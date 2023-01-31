const Board = require('../Board');
const Interpolation = require("../Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32, asUInt32fromustos} = Interpolation;
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES;

class ACBoard extends Board {
  constructor(port, address, name, onConnect, onDisconnect, onRate) {
    
    super(port, address, name, {}, onConnect, onDisconnect, onRate);

    this.inboundPacketDefs = {
      // Firmware Status
      0: [
        ["firmwareCommitHash", asASCIIString]
      ],

      // 24V Supply Stats
      1: [
        ["acSupply24Voltage", asFloat],
        ["acSupply24Current", asFloat],
        ["acSupply24Power", asFloat]
      ],

      // Actuator IV
      2: [
        ["#", asUInt8],
        ["actuatorState", asUInt8],
        ["actuatorContinuity", asFloat]
        ["actuatorCurrent", asFloat]
      ]
    }
  }
}

module.exports = ACBoard;