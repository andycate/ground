class Packet {
  /**
   *
   * @param {Number} id
   * @param {Array.<number|string>} values
   * @param {number} timestamp
   */
  constructor(id, values, timestamp = null) {
    if (timestamp === null) {
      this.timestamp = Date.now();
    } else {
      this.timestamp = timestamp;
    }
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
    const pack = `{${data}|${Packet.fletcher16(Buffer.from(data, 'binary')).toString(16)}}`;
    // console.log(pack);
    return pack;
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
