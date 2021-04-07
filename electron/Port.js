class Port {
  constructor() {}

  /**
   * Connect to the specified port
   * @param {Object} portName name of the port to connect to
   */
  connect(portName) {}

  /**
   * List ports available for connection
   */
  static listAvailable() {}

  static parsePacket(rawPacket) {
    const data = rawPacket.replace(/(\r\n|\n|\r)/gm, '');
    if(data.substring(0, 1) === '{') { // data packet
      const [ rawValues, checksum ] = data.replace(/({|})/gm, '').split('|');
      const [ id, ...values ] = rawValues.split(',').map(v => parseFloat(v));
      const calculatedChecksum = this.fletcher16(Buffer.from(rawValues, 'binary'));
      if(parseInt(Number('0x' + checksum), 10) !== calculatedChecksum) {
        console.log(`Checksums don't match! Message: ${data} Checksum: ${calculatedChecksum}`);
        return null;
      }
      return {
        id,
        values
      };
    }
    return null;
  }
}

export default Port;
