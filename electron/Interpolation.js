class Interpolation {
  static firstTimeStamps = {}
  static valueBuffers = {}
  static pastValues = {}

  static TYPES = {
    FLOAT: 0,
    UINT8: 1,
    UINT16: 2,
    UINT32: 3
  }

  /**
   * Returns the string that is represented by the buffer.
   * @param buffer {Buffer} the source buffer
   * @param offset {Number}
   * @returns {[String,Number]}
   */
  static asASCIIString(buffer, offset) {
    return [buffer.slice(offset).toString("ascii"), buffer.length]
  }

  /**
   * Returns the float that is represented by the buffer at the given offset.
   * @param buffer {Buffer} the source buffer
   * @param offset {Number}
   * @returns {[Number|Number]}
   */
  static asFloat(buffer, offset) {
    return [buffer.readFloatLE(offset), 4]
  }

  /**
   * Returns the unsigned 8 bit int that is represented by the buffer at the given offset.
   * @param buffer {Buffer} the source buffer
   * @param offset {Number}
   * @returns {[Number|Number]}
   */
  static asUInt8(buffer, offset) {
    return [buffer.readUInt8(offset), 1]
  }

  /**
   * Returns the unsigned 16 bit int that is represented by the buffer at the given offset.
   * @param buffer {Buffer} the source buffer
   * @param offset {Number}
   * @returns {[Number|Number]}
   */
  static asUInt16(buffer, offset) {
    return [buffer.readUInt16LE(offset), 2]
  }

  /**
   * Returns the unsigned 32 bit int that is represented by the buffer at the given offset.
   * @param buffer {Buffer} the source buffer
   * @param offset {Number}
   * @returns {[Number|Number]}
   */
  static asUInt32(buffer, offset) {
    return [buffer.readUInt32LE(offset), 4]
  }
}

module.exports = Interpolation;
