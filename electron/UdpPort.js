const dgram = require('dgram');

const Packet = require('./Packet');

class UdpPort {
  /**
   * 
   * @param {String} address 
   * @param {Number} port 
   * @param {Object} boards 
   * @param {Function} updateStateCallback
   */
  constructor(address, port, updateStateCallback) {
    this.address = address;
    this.port = port;
    this.server = dgram.createSocket('udp4');
    this.boards = {};
    this.updateStateCallback = updateStateCallback;

    this.server.on('error', (err) => {
      console.log(`${this.address}:${this.port} server error:\n${err.stack}`);
      this.server.close();
    });
    
    this.server.on('message', (msg, rinfo) => {
      const b = this.boards[rinfo.address];
      if(b === undefined) return;
      const pkt = Packet.parsePacket(msg.toString());
      if(pkt) {
        const update = b.processPacket(pkt);
        this.updateStateCallback(pkt.timestamp, update);
      }
    });
    
    this.server.on('listening', () => {
      const address = this.server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });
    
    this.server.bind(this.port, this.address);
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
    this.server.send("{0|eeee}", 42069, address);
  }
}

module.exports = UdpPort;
