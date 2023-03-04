const { ipcMain, TouchBar } = require('electron');

const State = require('./State');
const UdpPort = require('./UdpPort');
const InfluxDB = require('./InfluxDB');
const FlightV4 = require('./Boards/FlightV4');
const PTBoard = require('./Boards/PTBoard');
const TCBoard = require('./Boards/TCBoard');
const LCBoard = require('./Boards/LCBoard');
const ACBoard = require('./Boards/ACBoard');
const { initTime, fletcher16Partitioned } = require('./Packet');
const EregBoard = require('./Boards/EregBoard');

let lastThrust12 = 0.0;
// let lastThrust34 = 0.0;

class App {
  constructor(config) {
    this.webContents = [];
    // this.state = new State(model);
    this.state = new State({});
    this.influxDB = new InfluxDB();
    this.commandFuncs = {};
    this.config = config;
    this.boards = {};

    this.updateState = this.updateState.bind(this);
    this.sendDarkModeUpdate = this.sendDarkModeUpdate.bind(this);
    this.handleSendCustomMessage = this.handleSendCustomMessage.bind(this)
    this.addBackendFunc = this.addBackendFunc.bind(this);
    this.sendPacket = this.sendPacket.bind(this);
    this.sendSignalPacket = this.sendSignalPacket.bind(this);
    this.sendSignalTimedPacket = this.sendSignalTimedPacket.bind(this);
    this.sendZeroPacket = this.sendZeroPacket.bind(this);
    this.launch = this.launch.bind(this);
    this.abort = this.abort.bind(this);
  }

  /**
   * Separate init function from constructor to ensure WebContents are present before accepting IPC invocations
   */
  initApp() {
    this.port = new UdpPort('0.0.0.0', 42069, this.updateState);

    const boardTypes = {
      "flightV4": FlightV4,
      "pt": PTBoard,
      "tc": TCBoard,
      "lc": LCBoard,
      "ac": ACBoard,
      "ereg": EregBoard
    };

    for (let boardName in this.config.boards) {
      this.boards[boardName] = new boardTypes[this.config.boards[boardName].type](
        this.port,
        this.config.boards[boardName].address,
        boardName,
        () => {
          let packet = {};
          packet[boardName + ".boardConnected"] = true;
          this.updateState(Date.now(), packet);
        },
        () => {
          let packet = {};
          packet[boardName + ".boardConnected"] = false;
          this.updateState(Date.now(), packet);
        },
        (rate) => {
          let packet = {};
          packet[boardName + ".boardKbps"] = rate;
          this.updateState(Date.now(), packet);
        }
      );
    }

    // Begin TouchBar
    // this.abort = this.addBackendFunc('abort', this.groundComputer.abort)
    // End TouchBar

    this.setupIPC();
  }
  
  /**
   * Creates a function that will log state update to influx
   */
  addBackendFunc(name, func) {
    return () => {
      this.updateState(Date.now(), {[name]: 'invoked'}, true)
      func()
    }
  }
    

  /**
   * Takes in an update to the state and sends it where it needs to go
   *
   * @param timestamp timestamp of the state update
   * @param {Object} update
   * @param dbrecord should store in db?
   */
  updateState(timestamp, update, dbrecord = true) {
    this.state.updateState(timestamp, update);
    this.sendStateUpdate(timestamp, update);
    let mappedUpdate = {};
    Object.keys(update).forEach(_k => {
      if (this.config.influxMap[_k] !== undefined) {
        mappedUpdate[this.config.influxMap[_k]] = update[_k];
      }
      else {
        let board = _k.split(".")[0]
        let field = _k.split(".")[1]
        if (board === "freg" || board === "oreg" || field === "boardConnected" || field === "boardKbps") {
          mappedUpdate[board + "_" + _k.split(".")[1]] = update[_k];
        }
        else {
          mappedUpdate[_k.split(".")[1]] = update[_k];
        }
      }
    })
    if (dbrecord) {
      // if update value is not number -> add to syslog as well
      Object.keys(mappedUpdate).forEach(_k => {
        if(typeof mappedUpdate[_k] !== 'number'){
          if(mappedUpdate[_k].message){
            this.influxDB.handleSysLogUpdate(timestamp, `${_k} -> ${mappedUpdate[_k].message}`, mappedUpdate[_k].tags)
          }else{
            this.influxDB.handleSysLogUpdate(timestamp, `${_k} -> ${mappedUpdate[_k]}`)
          }
        }
      })
      this.influxDB.handleStateUpdate(timestamp, mappedUpdate);
    }

    if(Object.keys(mappedUpdate).includes("totalThrust12")) {
      lastThrust12 = mappedUpdate['totalThrust12']; // update total thrust value
      this.updateState(timestamp, {"totalThrust": lastThrust12});
    }
    // if(Object.keys(update).includes("totalThrust34")) {
    //   lastThrust34 = update['totalThrust34'];
    //   this.updateState(timestamp, {"totalThrust": lastThrust12 + lastThrust34});
    // }
  }

  /**
   * Send the specified state update to all windows
   *
   * @param {moment.Moment} timestamp
   * @param {Object} update
   */
  sendStateUpdate(timestamp, update) {
    for (let wc of this.webContents) {
      wc.send('state-update', {
        timestamp,
        update,
      });
    }
  }

  sendDarkModeUpdate(isDark) {
    for (let wc of this.webContents) {
      wc.send('set-darkmode', isDark);
    }
  }

  /**
   * When a window is created, register it's webContents object so we can send
   * state updates to that window
   *
   * @param {Object} webContents
   */
  addWebContents(webContents) {
    this.webContents.push(webContents);
  }

  removeWebContents(webContents) {
    this.webContents.splice(this.webContents.indexOf(webContents), 1);
  }

  addIPC(channel, handler, dbrecord = true) {
    let updateFunc = (...args) => {
      const update = {
        [channel]: args.length > 1 ? `invoked with arg(s): ${args.slice(1).join(", ")}` : 'invoked'
      };
      this.updateState(Date.now(), update, dbrecord)
      return handler(...args);
    }
    ipcMain.handle(channel, updateFunc);
    this.commandFuncs[channel] = updateFunc
  }

  handleSendCustomMessage(e, messageDestination, message){
    if(messageDestination === 'sys-log'){
      this.influxDB.handleSysLogUpdate(Date.now(), `text-input -> ${message}`, {
        manualInput: true
      }).then(r => {
        // TODO: implement some sort of sent check
      })
    }else{
      const destBoard = this[messageDestination]
      if(destBoard){
        // TODO: implement sending to the respective boards with sendPacket
      }
    }
    console.debug(`received request to send custom message to ${messageDestination}: ${message}`)
  }

  /**
   * Sets up all the IPC commands that the windows have access to
   */
  setupIPC() {
    console.debug('setting up ipc channels')
    this.addIPC('connect-influx', (e, host, port, protocol, username, password) => this.influxDB.connect(host, port, protocol, username, password), false);
    this.addIPC('get-databases', this.influxDB.getDatabaseNames);
    this.addIPC('set-database', (e, database) => this.influxDB.setDatabase(database));
    this.addIPC('set-darkmode', (e, isDark) => this.sendDarkModeUpdate(isDark), false);
    this.addIPC('set-procedure-state', (e, procState) => this.influxDB.setProcedureStep(procState));

    this.addIPC('send-custom-message', this.handleSendCustomMessage, false);

    this.addIPC('send-packet', this.sendPacket);
    this.addIPC('send-signal-packet', this.sendSignalPacket);
    this.addIPC('send-signal-timed-packet', this.sendSignalTimedPacket);
    this.addIPC('send-zero-packet', this.sendZeroPacket);
    this.addIPC('launch', this.launch);
    this.addIPC('abort', this.abort);
  }

  sendPacket(_, board, packet, number, command, time) {
    let buf = App.generateActuatorPacket(packet, number, command, time);
    this.port.send(this.boards[board].address, buf);
    // this.port.server.send(buf, 42070, this.boards[board].address);
  }

  sendSignalPacket(_, board, packet) {
    let buf = App.generateSignalPacket(packet);
    this.port.send(this.boards[board].address, buf);
  }

  sendSignalTimedPacket(_, board, packet, time) {
    let buf = App.generateSignalTimedPacket(packet, time);
    this.port.send(this.boards[board].address, buf);
  }

  sendZeroPacket(_, board, packet, channel) {
    let buf = App.generateZeroPacket(packet, channel);
    this.port.send(this.boards[board].address, buf);
  }

  static generateSignalPacket(id) {
    let idBuf = Buffer.alloc(1);
    idBuf.writeUInt8(id);
    let len = 0;
    let values = [];
    let lenBuf = Buffer.alloc(1);
    lenBuf.writeUInt8(len);
    let tsOffsetBuf = Buffer.alloc(4)
    tsOffsetBuf.writeUInt32LE(Date.now() - initTime);
    let checksumBuf = Buffer.alloc(2);
    checksumBuf.writeUInt16LE(fletcher16Partitioned([idBuf, lenBuf, tsOffsetBuf, ...values]));
    return Buffer.concat([idBuf, lenBuf, tsOffsetBuf, checksumBuf, ...values]);
  }

  static generateSignalTimedPacket(id, time) {
    let idBuf = Buffer.alloc(1);
    idBuf.writeUInt8(id);
    let len = 4;
    let values = [];
    let timeBuf = Buffer.alloc(4);
    timeBuf.writeFloatLE(time);
    values.push(timeBuf);
    let lenBuf = Buffer.alloc(1);
    lenBuf.writeUInt8(len);
    let tsOffsetBuf = Buffer.alloc(4)
    tsOffsetBuf.writeUInt32LE(Date.now() - initTime);
    let checksumBuf = Buffer.alloc(2);
    checksumBuf.writeUInt16LE(fletcher16Partitioned([idBuf, lenBuf, tsOffsetBuf, ...values]));
    return Buffer.concat([idBuf, lenBuf, tsOffsetBuf, checksumBuf, ...values]);
  }

  static generateActuatorPacket(id, number, command, time) {
    let idBuf = Buffer.alloc(1);
    idBuf.writeUInt8(id);
    let len = 5;
    let values = [];
    if (number !== -1) {
      len ++;
      let numberBuf = Buffer.alloc(1);
      numberBuf.writeUInt8(number);
      values.push(numberBuf);
    }
    let commandBuf = Buffer.alloc(1);
    commandBuf.writeUInt8(command);
    values.push(commandBuf);
    let timeBuf = Buffer.alloc(4);
    timeBuf.writeUInt32LE(time);
    values.push(timeBuf);
    let lenBuf = Buffer.alloc(1);
    lenBuf.writeUInt8(len);
    let tsOffsetBuf = Buffer.alloc(4)
    tsOffsetBuf.writeUInt32LE(Date.now() - initTime);
    let checksumBuf = Buffer.alloc(2);
    checksumBuf.writeUInt16LE(fletcher16Partitioned([idBuf, lenBuf, tsOffsetBuf, ...values]));
    return Buffer.concat([idBuf, lenBuf, tsOffsetBuf, checksumBuf, ...values]);
  }

  static generateZeroPacket(id, channel) {
    let idBuf = Buffer.alloc(1);
    idBuf.writeUInt8(id);
    let len = 1;
    let values = [];
    let channelBuf = Buffer.alloc(1);
    channelBuf.writeUInt8(channel);
    values.push(channelBuf);
    let lenBuf = Buffer.alloc(1);
    lenBuf.writeUInt8(len);
    let tsOffsetBuf = Buffer.alloc(4)
    tsOffsetBuf.writeUInt32LE(Date.now() - initTime);
    let checksumBuf = Buffer.alloc(2);
    checksumBuf.writeUInt16LE(fletcher16Partitioned([idBuf, lenBuf, tsOffsetBuf, ...values]));
    return Buffer.concat([idBuf, lenBuf, tsOffsetBuf, checksumBuf, ...values]);
  }

  launch() {
    console.log("launch");
    this.sendPacket(null, "ac1", 100, 3, 4, 0); // Open ARM
    setTimeout(() => {
      this.sendPacket(null, "ac1", 100, 4, 4, 0); // Open LOX main
      setTimeout(() => {
        this.sendPacket(null, "ac1", 100, 5, 4, 0); // Open fuel main
        setTimeout(() => {
          this.sendSignalPacket(null, "oreg", 200); // Launch o-reg
          setTimeout(() => {
            this.sendSignalPacket(null, "freg", 200); // Launch f-reg
            setTimeout(() => {
              this.sendPacket(null, "ac1", 100, 3, 5, 0); // Close ARM
            }, 2000);
          }, 10);
        }, 10);
      }, 10);
    }, 10);

    setTimeout(this.abort, 5250);

      // close arm at end
      // check if igniter enabled
      // if enabled, fire igniter
      // check arm, main valve currents first
  }

  abort() {

    // This is not complete nor correct; the abort tasks list is confusing

    console.log("abort");

    // deactivate igniter
    // open lox gems
    // open fuel gems
    // begin ereg abort procedure/send ereg aborts
    // (for vertical) open main valve vent
    // open arm 
    // close lox main
    // close fuel main
    // wait for valves closing
    // (for vertical) close main valve vent
    // close arm

    this.sendPacket(null, "ac2", 100, 2, 5, 0); // Close igniter
    setTimeout(() => {
      this.sendPacket(null, "ac2", 100, 6, 4, 0); // Open LOX GEMS
      setTimeout(() => {
        this.sendPacket(null, "ac2", 100, 7, 4, 0); // Open fuel GEMS
        setTimeout(() => {
          this.sendSignalPacket(null, "oreg", 201); // Abort o-reg
          setTimeout(() => {
            this.sendSignalPacket(null, "freg", 201); // Abort f-reg
            setTimeout(() => {
              this.sendPacket(null, "ac1", 100, 3, 4, 0); // Open ARM
              setTimeout(() => {
                this.sendPacket(null, "ac1", 100, 4, 5, 0); // Close LOX main
                setTimeout(() => {
                  this.sendPacket(null, "ac1", 100, 5, 5, 0); // Close fuel main
                  setTimeout(() => {
                    this.sendPacket(null, "ac1", 100, 3, 5, 0); // Close ARM
                  }, 2000);
                }, 10);
              }, 10);
            }, 10);
          }, 10);
        }, 10);
      }, 10);
    }, 10);
  }
}

module.exports = App;
