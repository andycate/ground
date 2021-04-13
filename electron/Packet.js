const moment = require('moment');

class Packet {
  /**
   * 
   * @param {moment.Moment} timestamp 
   * @param {Number} id 
   * @param {Array} values 
   */
  constructor(timestamp, id, values) {
    this.timestamp = timestamp;
    this.id = id;
    this.values = values;
    this.length = this.values.length;
  }

  /**
   * Generates a string representation of the packet that can be transmitted
   * @returns a string representation of the packet
   */
  stringify() {
    const data = [this.id].concat(this.values.map(v => v.toFixed(2))).toString();
    return `{${data}|${Packet.fletcher16(Buffer.from(data, 'binary')).toString(16)}}`;
  }

  /**
   * Parses stringified packet into object
   * @param {String} rawData 
   * @returns parsed packet
   */
  static parsePacket(rawData) {
    const timestamp = moment(); // TODO: Change this to come from packet
    let data = rawData.replace(/(\r\n|\n|\r)/gm, '');
    const start = data.indexOf('{');
    const end = data.indexOf('}');
    if(start < 0 || end < 0) {
      return null;
    }
    data = data.substring(start + 1, end);
    const [ rawValues, checksum ] = data.replace(/({|})/gm, '').split('|');
    const calculatedChecksum = Packet.fletcher16(Buffer.from(rawValues, 'binary'));
    if(Number('0x' + checksum) !== calculatedChecksum) {
      return null;
    }
    const [ id, ...values ] = rawValues.split(',').map(v => parseFloat(v));
    return new Packet(timestamp, id, values);
  }

  /**
   * Calculates the fletcher16 checksum for some data.
   * 
   * See https://en.wikipedia.org/wiki/Fletcher%27s_checksum
   * @param {Buffer} data the data to checksum
   * @returns integer checksum
   */
  static fletcher16(data) {
    let a = 0, b = 0;
    for (let i = 0; i < data.length; i++) {
        a = (a + data[i]) % 255;
        b = (b + a) % 255;
    }
    return a | (b << 8);
  }
}

module.exports = Packet;
