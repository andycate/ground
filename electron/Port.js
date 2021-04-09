class Port {
  constructor() {}

  /**
   * Connect to the specified port
   * @param {Object} portName name of the port to connect to
   */
  async connect(portName) {}

  /**
   * List ports available for connection
   */
  static async listAvailable() {}
}

module.exports = Port;
