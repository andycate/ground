const SP = require('serialport');

const Port = require('./Port');

class SerialPort extends Port {
  constructor() {
    super();
    this.port = null;
  }

  /**
   * Attempt to connect to the port that has the specified path
   * 
   * Uses default baud rate of 57600
   * @param {string} portName 
   * @returns true if successful, false otherwise
   */
  async connect(portName) {
    return await this.connect(portName, 57600);
  }

  /**
   * Attempt to connect to the port that has the specified path
   * @param {string} portName 
   * @param {Number} baud the baud rate of the serial port. Our radio defaults to 57600 
   * @returns true if successful, false otherwise
   */
  async connect(portName, baud) {
    this.port = new SP(portName, {
      baudRate: baud,
      autoOpen: false
    });
  }

  /**
   * Returns all the available serial ports
   * 
   * `
   * [
   *   {
   *     path: 'COM1',
   *     manufacturer: '(Standard port types)',
   *     serialNumber: undefined,
   *     pnpId: 'ACPI...',
   *     locationId: undefined,
   *     vendorId: undefined,
   *     productId: undefined
   *   }
   * ]
   * `
   * 
   * @returns a list of available ports
   */
  static async listAvailable() {
    return await SP.list();
  }
}

module.exports = SerialPort;
