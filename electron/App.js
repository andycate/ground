const { ipcMain, TouchBar } = require('electron');

// const { model } = require('./config');

const State = require('./State');
const UdpPort = require('./UdpPort');
const FlightV2 = require('./Boards/FlightV2');
const DAQ = require('./Boards/DAQ');
const DAQV3 = require('./Boards/DAQV3');
const ActuatorController = require('./Boards/ActuatorController');
const InfluxDB = require('./InfluxDB');

let lastThrust12 = 0.0;
let lastThrust34 = 0.0;

class App {
  constructor() {
    this.webContents = [];
    // this.state = new State(model);
    this.state = new State({});
    this.influxDB = new InfluxDB();
    this.commandFuncs = {};

    this.updateState = this.updateState.bind(this);
    this.sendDarkModeUpdate = this.sendDarkModeUpdate.bind(this);
    this.handleSendCustomMessage = this.handleSendCustomMessage.bind(this)
    this.addBackendFunc = this.addBackendFunc.bind(this);
  }

  /**
   * Separate init function from constructor to ensure WebContents are present before accepting IPC invocations
   */
  initApp() {
    this.port = new UdpPort('0.0.0.0', 42069, this.updateState);

    this.flightComputer = new FlightV2(this.port,
      '10.0.0.42',
      {
        firmwareCommitHash: 'flightCommitHash',
      },
      () => this.updateState(Date.now(), { flightConnected: true }),
      () => this.updateState(Date.now(), { flightConnected: false }),
      (rate) => this.updateState(Date.now(), { flightKbps: rate }));
    this.daq1 = new DAQ(this.port, '10.0.0.11', {
        firmwareCommitHash: 'daq1CommitHash',

        daqBattVoltage: null,
        daqBattCurrent: null,

        daqADC0: null,
        daqADC1: null,
        daqADC2: null,
        daqADC3: null,
        daqADC4: null,
        daqADC5: null,
        daqADC6: null,
        daqADC7: null,

        daqTC1: 'engineTC4',
        daqTC2: 'engineTC5',
        daqTC3: 'engineTC6',
        daqTC4: 'engineTC7',

        loadCell1: 'thrust1',
        loadCell2: 'thrust2',
        loadCellSum: 'totalThrust12',

        fastLoadCell1: 'fastThrust1',
        fastLoadCell2: 'fastThrust2',

        capacitor1: null,
        capacitor2: null,
      },
      () => this.updateState(Date.now(), { daq1Connected: true }),
      () => this.updateState(Date.now(), { daq1Connected: false }),
      (rate) => this.updateState(Date.now(), { daq1Kbps: rate }));

    this.daq2 = new DAQ(this.port, '10.0.0.12', {
        firmwareCommitHash: 'daq2CommitHash',

        daqBattVoltage: null,
        daqBattCurrent: null,

        daqADC0: null,
        daqADC1: null,
        daqADC2: null,
        daqADC3: null,
        daqADC4: null,
        daqADC5: null,
        daqADC6: null,
        daqADC7: null,

        daqTC1: 'engineTC8',
        daqTC2: 'engineTC9',
        daqTC3: 'engineTC10',
        daqTC4: 'engineTC11',

        loadCell1: 'thrust3',
        loadCell2: 'thrust4',
        loadCellSum: 'totalThrust34',

        capacitor1: null,
        capacitor2: null,
      },
      () => this.updateState(Date.now(), { daq2Connected: true }),
      () => this.updateState(Date.now(), { daq2Connected: false }),
      (rate) => this.updateState(Date.now(), { daq2Kbps: rate }));

    this.daq3 = new DAQ(this.port, '10.0.0.31', {
        firmwareCommitHash: 'daq3CommitHash',

        daqBattVoltage: null,
        daqBattCurrent: null,

        daqADC0: null,
        daqADC1: null,
        daqADC2: null,
        daqADC3: null,
        daqADC4: null,
        daqADC5: null,
        daqADC6: null,
        daqADC7: null,

        daqTC1: null,
        daqTC2: null,
        daqTC3: null,
        daqTC4: null,

        loadCell1: null,
        loadCell2: null,
        loadCellSum: null,

      capVal: 'loxCapVal',
      capValFiltered: 'loxCapValFiltered',
      capTemperature: 'loxCapTemp',
      },
      () => this.updateState(Date.now(), { daq3Connected: true }),
      () => this.updateState(Date.now(), { daq3Connected: false }),
      (rate) => this.updateState(Date.now(), { daq3Kbps: rate })
    )

    this.daq4 = new DAQ(this.port, '10.0.0.32', {
      firmwareCommitHash: 'daq4CommitHash',

      daqBattVoltage: null,
      daqBattCurrent: null,

      daqADC0: null,
      daqADC1: null,
      daqADC2: null,
      daqADC3: null,
      daqADC4: null,
      daqADC5: null,
      daqADC6: null,
      daqADC7: null,

      daqTC1: null,
      daqTC2: null,
      daqTC3: null,
      daqTC4: null,

      loadCell1: null,
      loadCell2: null,
      loadCellSum: null,

      capVal: 'fuelCapVal',
      capValFiltered: 'fuelCapValFiltered',
      capTemperature: 'fuelCapTemp',
    },
    () => this.updateState(Date.now(), { daq4Connected: true }),
    () => this.updateState(Date.now(), { daq4Connected: false }),
    (rate) => this.updateState(Date.now(), { daq4Kbps: rate })
  )

    this.actCtrlr1 = new ActuatorController(this.port, '10.0.0.21', {
        firmwareCommitHash: 'ac1CommitHash',

        acBattVoltage: 'ac1BattVoltage',
        acBattCurrent: 'ac1BattCurrent',
        acSupply12Voltage: 'ac1Supply12Voltage',
        acSupply12Current: 'ac1Supply12Current',

        acLinAct1State: 'loxFillRBVstate',
        acLinAct1Voltage: 'loxFillRBVvoltage',
        acLinAct1Current: 'loxFillRBVcurrent',
        
        acLinAct2State: 'fuelFillRBVstate',
        acLinAct2Voltage: 'fuelFillRBVvoltage',
        acLinAct2Current: 'fuelFillRBVcurrent',
        
        acLinAct3State: 'pressurantFlowRBVstate',
        acLinAct3Voltage: 'pressurantFlowRBVvoltage',
        acLinAct3Current: 'pressurantFlowRBVcurrent',

        acLinAct4State: 'pressurantFillRBVstate',
        acLinAct4Voltage: 'pressurantFillRBVvoltage',
        acLinAct4Current: 'pressurantFillRBVcurrent',
        
        acLinAct5State: 'purgePrechillVentRBVstate',
        acLinAct5Voltage: 'purgePrechillVentRBVvoltage',
        acLinAct5Current: 'purgePrechillVentRBVcurrent',
        
        acLinAct6State: 'pressurantFillVentRBVstate',
        acLinAct6Voltage: 'pressurantFillVentRBVvoltage',
        acLinAct6Current: 'pressurantFillVentRBVcurrent',

        acLinAct7State: null,
        acLinAct7Voltage: null,
        acLinAct7Current: null,

        acHeater1Voltage: null,
        acHeater1Current: null,

        acHeater2Voltage: null,
        acHeater2Current: null,

        acHeater3Voltage: null,
        acHeater3Current: null,

        acHeater4Voltage: null,
        acHeater4Current: null,
      },
      () => this.updateState(Date.now(), { actCtrlr1Connected: true }),
      () => this.updateState(Date.now(), { actCtrlr1Connected: false }),
      (rate) => this.updateState(Date.now(), { actCtrlr1Kbps: rate }));
    this.actCtrlr2 = new ActuatorController(this.port, '10.0.0.22', {
        firmwareCommitHash: 'ac2CommitHash',

        acBattVoltage: 'ac2BattVoltage',
        acBattCurrent: 'ac2BattCurrent',
        acSupply12Voltage: 'ac2Supply12Voltage',
        acSupply12Current: 'ac2Supply12Current',
        
        acLinAct1State: null,
        acLinAct1Voltage: null,
        acLinAct1Current: null,

        acLinAct2State: null,
        acLinAct2Voltage: null,
        acLinAct2Current: null,

        acLinAct3State: null,
        acLinAct3Voltage: null,
        acLinAct3Current: null,

        acLinAct4State: null,
        acLinAct4Voltage: null,
        acLinAct4Current: null,

        acLinAct5State: null,
        acLinAct5Voltage: null,
        acLinAct5Current: null,

        acLinAct6State: null,
        acLinAct6Voltage: null,
        acLinAct6Current: null,

        acLinAct7State: null,
        acLinAct7Voltage: null,
        acLinAct7Current: null,

        acHeater1Voltage: null,
        acHeater1Current: null,

        acHeater2Voltage: null,
        acHeater2Current: null,

        acHeater3Voltage: null,
        acHeater3Current: null,

        acHeater4Voltage: null,
        acHeater4Current: null,
      },
      () => this.updateState(Date.now(), { actCtrlr2Connected: true }),
      () => this.updateState(Date.now(), { actCtrlr2Connected: false }),
      (rate) => this.updateState(Date.now(), { actCtrlr2Kbps: rate }));

    // Begin TouchBar
    this.abort = this.addBackendFunc('abort', this.flightComputer.abort)
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
    if (dbrecord) {
      // if update value is not number -> add to syslog as well
      Object.keys(update).forEach(_k => {
        if(typeof update[_k] !== 'number'){
          if(update[_k].message){
            this.influxDB.handleSysLogUpdate(timestamp, `${_k} -> ${update[_k].message}`, update[_k].tags)
          }else{
            this.influxDB.handleSysLogUpdate(timestamp, `${_k} -> ${update[_k]}`)
          }
        }
      })
      this.influxDB.handleStateUpdate(timestamp, update);
    }

    if(Object.keys(update).includes("totalThrust12")) {
      lastThrust12 = update['totalThrust12']; // update total thrust value
      this.updateState(timestamp, {"totalThrust": lastThrust12 + lastThrust34});
    }
    if(Object.keys(update).includes("totalThrust34")) {
      lastThrust34 = update['totalThrust34'];
      this.updateState(timestamp, {"totalThrust": lastThrust12 + lastThrust34});
    }
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

    this.addIPC('send-custom-message', this.handleSendCustomMessage, false)

    // Flight Computer

    this.addIPC('flight-connected', () => this.flightComputer.isConnected);
    this.addIPC('daq1-connected', () => this.daq1.isConnected);
    this.addIPC('daq2-connected', () => this.daq2.isConnected);
    this.addIPC('daq3-connected', () => this.daq3.isConnected);
    this.addIPC('daq4-connected', () => this.daq4.isConnected);
    this.addIPC('actctrlr1-connected', () => this.actCtrlr1.isConnected);
    this.addIPC('actctrlr2-connected', () => this.actCtrlr2.isConnected);

    this.addIPC('open-loxGemsValve', this.flightComputer.openloxGemsValve);
    this.addIPC('close-loxGemsValve', this.flightComputer.closeloxGemsValve);

    this.addIPC('open-fuelGemsValve', this.flightComputer.openfuelGemsValve);
    this.addIPC('close-fuelGemsValve', this.flightComputer.closefuelGemsValve);

    this.addIPC('start-toggleLoxGemsValve', this.flightComputer.startToggleLoxGemsValve);
    this.addIPC('stop-toggleLoxGemsValve', this.flightComputer.stopToggleLoxGemsValve);

    this.addIPC('start-toggleFuelGemsValve', this.flightComputer.startToggleFuelGemsValve);
    this.addIPC('stop-toggleFuelGemsValve', this.flightComputer.stopToggleFuelGemsValve);

    this.addIPC('open-armValve', this.flightComputer.openarmValve);
    this.addIPC('close-armValve', this.flightComputer.closearmValve);

    this.addIPC('activate-igniter', this.flightComputer.activateIgniter);
    this.addIPC('deactivate-igniter', this.flightComputer.deactivateIgniter);

    this.addIPC('open-loxMainValve', this.flightComputer.openloxMainValve);
    this.addIPC('close-loxMainValve', this.flightComputer.closeloxMainValve);

    this.addIPC('open-fuelMainValve', this.flightComputer.openfuelMainValve);
    this.addIPC('close-fuelMainValve', this.flightComputer.closefuelMainValve);

    this.addIPC('activate-loxTankBottomHtr', this.flightComputer.activateLoxTankBottomHtr);
    this.addIPC('deactivate-loxTankBottomHtr', this.flightComputer.deactivateLoxTankBottomHtr);

    this.addIPC('activate-loxTankMidHtr', this.flightComputer.activateLoxTankMidHtr);
    this.addIPC('deactivate-loxTankMidHtr', this.flightComputer.deactivateLoxTankMidHtr);

    this.addIPC('activate-loxTankTopHtr', this.flightComputer.activateLoxTankTopHtr);
    this.addIPC('deactivate-loxTankTopHtr', this.flightComputer.deactivateLoxTankTopHtr);

    this.addIPC('beginFlow', this.flightComputer.beginFlow);
    this.addIPC('abort', this.flightComputer.abort);

    this.addIPC('enable-fastReadRate', this.flightComputer.enableFastReadRate);
    this.addIPC('disable-fastReadRate', this.flightComputer.disableFastReadRate);

    this.addIPC('enable-igniter', this.flightComputer.enableIgniter);
    this.addIPC('disable-igniter', this.flightComputer.disableIgniter);


    // DAQ 1

    // DAQ 2


    // Actuator Controller 1
    this.addIPC('open-loxFillRBV', this.actCtrlr1.openActCh0);
    this.addIPC('close-loxFillRBV', this.actCtrlr1.closeActCh0);
    this.addIPC('time-loxFillRBV', (e, val) => this.actCtrlr1.actCh0ms(val));

    this.addIPC('open-pressurantFillRBV', this.actCtrlr1.openActCh3);
    this.addIPC('close-pressurantFillRBV', this.actCtrlr1.closeActCh3);
    this.addIPC('time-pressurantFillRBV', (e, val) => this.actCtrlr1.actCh3ms(val));

    this.addIPC('open-pressurantFillVentRBV', this.actCtrlr1.openActCh5);
    this.addIPC('close-pressurantFillVentRBV', this.actCtrlr1.closeActCh5);
    this.addIPC('time-pressurantFillVentRBV', (e, val) => this.actCtrlr1.actCh5ms(val));

    this.addIPC('open-pressurantFlowRBV', this.actCtrlr1.closeActCh2);
    this.addIPC('close-pressurantFlowRBV', this.actCtrlr1.openActCh2);
    this.addIPC('time-pressurantFlowRBV', (e, val) => this.actCtrlr1.actCh2ms(-val));

    this.addIPC('open-fuelFillRBV', this.actCtrlr1.openActCh1);
    this.addIPC('close-fuelFillRBV', this.actCtrlr1.closeActCh1);
    this.addIPC('time-fuelFillRBV', (e, val) => this.actCtrlr1.actCh1ms(val));

    // Actuator Controller 2
    // TODO: swap RBV wiring so code mapping doesn't have to be swapped

  }
}

module.exports = App;
