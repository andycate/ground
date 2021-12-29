const Packet = require('./Packet');
const Interpolation = require("./Interpolation");

const UNIVERSAL_PACKETS = {
  99: {
    0: {
      field: 'boardMetadata',
      interpolation: Interpolation.interpolateMetadata,
      parseAsString: true
    }
  }
}

class Board {
  constructor(port, address, packets, mapping, onConnect, onDisconnect, onRate) {
    this.isConnected = false;
    this.watchdog = null;
    this.port = port;
    this.address = address;
    this.packets = { ...UNIVERSAL_PACKETS, ...packets };
    this.mapping = mapping;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.onRate = onRate;
    this.port.register(this.address, this);
    /** @type {Number} the time (in ms) at which the board was registered */
    this.registrationTime = -1;
    this.bytesRecv = 0;
    this.setupDataRateMonitor();
  }

  setupDataRateMonitor() {
    setInterval(() => {
      const kbps = this.bytesRecv * 8 / 1000;
      this.bytesRecv = 0;
      this.onRate(kbps);
    }, 1000);
  }

  sendPacket(id, values) {
    const p = new Packet(id, values);
    this.port.send(this.address, p.stringify());
    return true;
  }

  /**
   * Parses the raw packet into a data object
   * @param {Buffer} buf is the buffer that contains the full udp packet content
   * @returns {Packet|null} packet with parsed data
   */
  parseMsgBuf(buf) {
    const id = buf.readUInt8(0);
    const len = buf.readUInt8(1);

    const timestamp = Date.now(); // TODO: Change this to use packet TS offset byte and registrationTime

    const checksum = buf.readUInt16LE(2);

    // currently, data comes after the 2 bytes checksum (at offset 2) 2 + 2 = 4
    const dataOffset = 4;

    const dataBuf = buf.slice(dataOffset, dataOffset + len)
    const expectedChecksum = Packet.fletcher16(dataBuf)

    if (checksum === expectedChecksum) {
      const values = []
      const packetDef = this.packets[id]

      let offset = dataOffset;

      for (const [_, parser] of packetDef[id]) {
        const [value, byteLen] = parser(dataBuf, offset);
        values.push(value);
        offset += byteLen;
      }

      return new Packet(id, values, timestamp);
    } else {
      console.debug(`check sum check failed for packet id: ${id} from board ip: ${this.address}`)
      return null
    }
  }

  /**
   * Takes in a packet and returns a state update
   *
   * @param {Packet} packet
   */
  processPacket(packet) {
    this.resetWatchdog();
    this.bytesRecv += packet.length;
    const def = this.packets[packet.id];
    if (def === undefined) return;
    const update = {};
    for (let i = 0; i < packet.values.length; i++) {
      const fieldDef = def[i];
      if (fieldDef === undefined) continue;
      let val = packet.values[i];
      if (fieldDef.interpolation !== null) {
        val = fieldDef.interpolation(val, packet.timestamp);
        if (val._val) {
          const { additionalFields } = val
          Object.assign(update, additionalFields)
          val = val._val
        }
      }
      let mappedField = this.mapping[fieldDef.field];
      if (mappedField === undefined) {
        mappedField = fieldDef.field;
      } else if (mappedField === null) {
        continue;
      }
      update[mappedField] = val;
    }
    return update;
  }

  resetWatchdog() {
    if (!this.isConnected) {
      this.sendPacket(99, [0])
      this.onConnect();
    }
    this.isConnected = true;
    clearTimeout(this.watchdog);
    this.watchdog = setTimeout(() => {
      this.isConnected = false;
      this.onDisconnect();
    }, 1000);
  }
}

module.exports = Board;
