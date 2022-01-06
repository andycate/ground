const Interpolation = require("./Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32 } = Interpolation
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES

/**
 * Interpolates the value to obtain an update object
 * @typedef {function(any): any|ExtendedUpdateObject} Interpolator
 */
/**
 * Parses the buffer at an offset to obtain a value
 * @typedef {function(Buffer,Number): [any, Number]} Parser
 */
/** @type {Object.<Number,Array.<[String,Parser,Interpolator|null]>|Array.<[String,Parser]>>} */
const INBOUND_PACKET_DEFS = {
  // [1..9] Sent by All Boards
  1: [
    ['battVoltage', asFloat],
    ['battCurrent', asFloat],
    ['battPower', asFloat]
  ],
  2: [
    ['supply12Voltage', asFloat],
    ['supply12Current', asFloat],
    ['supply12Power', asFloat]
  ],
  3: [
    ['supply8Voltage', asFloat],
    ['supply8Current', asFloat],
    ['supply8Power', asFloat]
  ],
  // [10..59] Sent by Flight Computer
}

/** @type {Object.<Number,Array.<Number>>} */
const OUTBOUND_PACKET_DEFS = {
  // Windows enable port packet
  0: [UINT8],
  // [130..169] Sent to Flight Computer
  130: [UINT8],
  // [170..199] Sent to Actuator Controller
  170: [UINT8, UINT32]
}

module.exports = { INBOUND_PACKET_DEFS, OUTBOUND_PACKET_DEFS }
