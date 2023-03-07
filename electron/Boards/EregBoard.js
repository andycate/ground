const Board = require('../Board');
const Interpolation = require("../Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32, asUInt32fromustos} = Interpolation;
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES;

class EregBoard extends Board {
  constructor(port, address, name, onConnect, onDisconnect, onRate) {
    
    super(port, address, name, {}, onConnect, onDisconnect, onRate);

    this.inboundPacketDefs = {
      // Firmware Status
      0: [
        ["firmwareCommitHash", asASCIIString]
      ],

      // Telemetry
      1: [
        ["upstreamPressure", asFloat],
        ["downstreamPressure", asFloat],
        ["encoderAngle", asFloat],
        ["angleSetpoint", asFloat],
        ["pressureSetpoint", asFloat],
        ["motorPower", asFloat],
        ["pressureControlP", asFloat],
        ["pressureControlI", asFloat],
        ["pressureControlD", asFloat]
      ],

      // Config
      2: [
        ["pressureSetpointConfig", asFloat],
        ["pOuterNominal", asFloat],
        ["iOuterNominal", asFloat],
        ["dOuterNominal", asFloat],
        ["pInner", asFloat],
        ["iInner", asFloat],
        ["dInner", asFloat],
        ["flowDuration", asFloat]
      ],

      // Diagnostic
        3: [
          ["motorDirPass", asUInt8],
          ["servoDirPass", asUInt8]
        ],

      // State Transition Error
        4: [
          ["errorCode", asUInt8]
        ],

      // Flow State
        5: [
          ["flowState", asUInt8]
        ],

      // Limit Switch
        6: [
          ["fullyClosedSwitch", asFloat],
          ["fullyOpenSwitch", asFloat]
        ],

      // Phase Currents
        7: [
          ["currentA", asFloat],
          ["currentB", asFloat],
          ["currentC", asFloat]
        ],

      // Temperatures
        8: [
          ["boardTempA", asFloat],
          ["boardTempB", asFloat],
          ["motorTemp", asFloat]
        ],

      // Abort
      9: [],

      // Overcurrent Trigger
      10: [
        ["avgCurrent", asFloat],
        ["bufferSize", asFloat]
      ]
    }
  }
}

module.exports = EregBoard;