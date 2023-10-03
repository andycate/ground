class Packet {
  /**
   *
   * @param {Number} id
   * @param {Array.<Number|String>} values
   * @param {Number|null} [timestamp]
   */
  constructor(id, values, timestamp) {
    if (!timestamp) {
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
   * Calculates the fletcher16 checksum for some partitioned data.
   *
   * See https://en.wikipedia.org/wiki/Fletcher%27s_checksum
   * @param {Buffer[]} bufArr the data to checksum
   * @returns integer checksum
   */
  static fletcher16Partitioned(bufArr) {
    let a = 0, b = 0;
    for (const buf of bufArr) {
      for (let i = 0; i < buf.length; i++) {
        a = (a + buf[i]) % 256;
        b = (b + a) % 256;
      }
    }
    return a | (b << 8);
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
      a = (a + data[i]) % 256;
      b = (b + a) % 256;
    }
    return a | (b << 8);
  }

  static initTime = Date.now()
}

module.exports = Packet;
