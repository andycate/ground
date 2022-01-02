const Interpolation = require("./Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32 } = Interpolation

/**
 * Interpolates the value to obtain an update object
 * @typedef {function(any): any|ExtendedUpdateObject} Interpolator
 */
/**
 * Parses the buffer at an offset to obtain a value
 * @typedef {function(Buffer,Number): [any, Number]} Parser
 */
/** @type {Object.<Number,Array.<[String,Parser,Interpolator|null]>|Array.<[String,Parser]>>} */
const PACKET_DEFS = {
  // [1-9] Sent by All Boards
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
  ]
  // [10-59] Sent by Flight Computer

}

module.exports = { PACKET_DEFS }
