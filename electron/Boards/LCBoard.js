const Board = require('../Board');
const Interpolation = require("../Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32, asUInt32fromustos} = Interpolation;
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES;

class LCBoard extends Board {
  constructor(port, address, name, onConnect, onDisconnect, onRate) {
    
    super(port, address, name, {}, onConnect, onDisconnect, onRate);

    this.inboundPacketDefs = {
      // Firmware Status
      0: [
        ["firmwareCommitHash", asASCIIString]
      ],

      // 24V Supply Stats
      1: [
        ["lcSupply24Voltage", asFloat],
        ["lcSupply24Current", asFloat],
        ["lcSupply24Power", asFloat]
      ],

      // LC Value
      2: [
        ["#", asUInt8],
        ["lcValue", asFloat]
      ]
    }
  }
}

module.exports = LCBoard;