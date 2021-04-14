const Packet = require('./Packet');

class Board {
  constructor(port, address, packets, mapping) {
    this.isConnected = false;
    this.watchdog = null;
    this.port = port;
    this.address = address;
    this.packets = packets;
    this.mapping = mapping;
    this.port.register(this.address, this);
  }

  sendPacket(id, values) {
    const p = new Packet(id, values);
    this.port.send(this.address, p.stringify());
    return true;
  }

  /**
   * Takes in a packet and returns a state update
   * 
   * @param {Packet} packet 
   */
   processPacket(packet) {
    this.resetWatchdog();
    const def = this.packets[packet.id];
    if(def === undefined) return;
    const update = {};
    for(let i = 0; i < packet.values.length; i++) {
      const fieldDef = def[i];
      if(fieldDef === undefined) continue;
      let val = packet.values[i];
      if(fieldDef.interpolation !== null) {
        val = fieldDef.interpolation(val);
      }
      let mappedField = this.mapping[fieldDef.field];
      if(mappedField === undefined) {
        mappedField = fieldDef.field;
      }
      update[mappedField] = val;
    }
    return update;
  }

  resetWatchdog() {
    this.isConnected = true;
    clearTimeout(this.watchdog);
    this.watchdog = setTimeout(() => {
      this.isConnected = false;
    }, 1000);
  }
}

module.exports = Board;
