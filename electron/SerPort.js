const dgram = require('dgram');

const Packet = require('./Packet');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

class SerPort {
  /**
   *
   * @param {String} address
   * @param {Number} port
   * @param {Object} boards
   * @param {Function} updateStateCallback
   */
  constructor(port, baud, updateStateCallback) {
    this.device = new SerialPort(port, {
      baudRate: baud
    });
    this.lineStream = this.device.pipe(new Readline());
    this.boards = {};
    this.updateStateCallback = updateStateCallback;

    this.lineStream.on('data', (msg) => {

    });
  }

  /**
   * Register a board to receive packets
   *
   * @param {string} address
   * @param {Board} board
   */
  register(address, board) {
    this.boards[address] = board;
    // stupid windows won't start receiving until at least one packet sent
    if (process.platform === 'win32') {
      console.log('sending first packet (windows)')
      this.server.send("{0|eeee}", this.port, address);
    }
  }

  /**
   * Send data over the port to the specified address
   *
   * @param {string} address
   * @param {Object} data
   */
  send(address, data) {
    console.log(address + ": " + data);
    this.device.write(data);
  }
}

module.exports = SerPort;
