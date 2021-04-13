const Interpolation = require('./Interpolation');
const Board = require('./Board');

const packets = {
  
};

class DAQ extends Board {
  constructor() {
    super();
  }

  /**
   * Takes in a packet and returns a state update
   * 
   * @param {Packet} packet 
   */
  processPacket(packet) {
    this.resetWatchdog();
    const def = packets[packet.id];
    if(def === undefined) return;
    const update = {};
    for(let i = 0; i < packet.values.length; i++) {
      const fieldDef = def[i];
      if(fieldDef === undefined) continue;
      let val = packet.values[i];
      if(fieldDef.interpolation !== null) {
        val = fieldDef.interpolation(val);
      }
      update[fieldDef.field] = val;
    }
    return update;
  }
}

module.exports = DAQ;
