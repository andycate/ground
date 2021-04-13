const Packet = require('./Packet');

class Board {
  constructor() {
    this.isConnected = false;
    this.watchdog = null;
  }

  /**
   * 
   * @param {Packet} packet 
   */
  processPacket(packet) { }

  resetWatchdog() {
    this.isConnected = true;
    clearTimeout(this.watchdog);
    this.watchdog = setTimeout(() => {
      this.isConnected = false;
    }, 1000);
  }
}

module.exports = Board;
