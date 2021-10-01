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
      let b = this.boards[rinfo.address];
      if (b === undefined && rinfo.address !== '127.0.0.1') {
        // enables testing packets from localhost
        console.info(`received packet from unknown remote: ${rinfo.address}`)
        return;
      }
      let pkt = Packet.parsePacket(msg.toString());
      if (b === undefined && rinfo.address === '127.0.0.1') {
        b = this.boards[`10.0.0.${pkt.values[0]}`] // if packet is from local test, set b to given address
      }
      const _pkt = b.packets[pkt?.id]
      if (_pkt && Object.keys(_pkt).map(_k => _pkt[_k]).reduce((acc, cur) => acc || cur.parseAsString, false)) {
        // should be parsed as string
        pkt = Packet.parsePacket(msg.toString(), true)
      }

      if (rinfo.address === '127.0.0.1') {
        pkt.values.shift() // discard first value from local testing packet
      }

      if (pkt) {
        const update = b.processPacket(pkt);
        if (update === undefined) return;
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
    this.server.send(data, this.port, address);
  }
}

module.exports = UdpPort;
