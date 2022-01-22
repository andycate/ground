const SerialPort = require('serialport');
const Delimiter = SerialPort.parsers.Delimiter;

class SerPort {
  /**
   * @param {string} path The serial port path
   * @param {number} baud The baud rate for this path
   * @param {App.updateState} updateStateCallback
   */
  constructor(path, baud, updateStateCallback) {
    this.device = new SerialPort(path, {
      baudRate: baud,
      autoOpen: false
    });

    this.lineStream = this.device.pipe(new Delimiter({ delimiter: "\n", includeDelimiter: false }));
    this.board = null;
    this.updateStateCallback = updateStateCallback;

    this.lineStream.on('data', (msg) => {
      console.log(msg);
      this.board.updateRcvRate(msg.length);
      const packet = this.board.parseMsgBuf(msg);

      // if (packet) {
      //   const update = this.board.processPacket(packet);
      //   if (update === undefined) return;
      //   this.updateStateCallback(packet.timestamp, update);
      // }
    });
  }

  /**
   * Register a board to receive packets from the specified serial port path
   *
   * @param {string} _
   * @param {Board} board
   */
  register(_, board) {
    if(this.board){
      console.error(`You may only register one board to each serial port. Conflicting path: ${this.device.path}`)
      process.exit(1)
    }
    this.board = board

    // tries to open the serial port
    this.device.open(error => {
      if (!error) {
        return
      }
      console.debug(`could not connect to the board on path: ${this.device.path}. Error: ${error.toString()}`)
      console.debug("to list all the available serial ports on your device, please run `npx @serialport/list -f jsonline`")
      console.debug("afterwards, update App.js with the correct ports.")
    })
  }

  /**
   * Send data over the serial port
   *
   * @param {any} _
   * @param {Buffer} data
   * @param cb
   */
  send(_, data, cb) {
    console.debug(`[${this.device.path}]: `);
    console.debug(data.toString('hex').match(/../g).join(' '))
    this.device.write(data, cb);
  }
}

module.exports = SerPort;
