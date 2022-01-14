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
    ['flightBattVoltage', asFloat],
    ['flightBattCurrent', asFloat],
    ['flightBattPower', asFloat]
  ],
  2: [
    ['flightSupply12Voltage', asFloat],
    ['flightSupply12Current', asFloat],
    ['flightSupply12Power', asFloat]
  ],
  3: [
    ['flightSupply8Voltage', asFloat],
    ['flightSupply8Current', asFloat],
    ['flightSupply8Power', asFloat]
  ],
  // [10..59] Sent by Flight Computer
  10: [
    ['loxTankPT', asFloat],
    ['fuelTankPT', asFloat],
    ['loxInjectorPT', asFloat],
    ['fuelInjectorPT', asFloat],
    ['pressurantPT', asFloat],
    ['loxDomePT', asFloat],
  ],
  20: [
    ['engineTC1', asFloat],
  ],
  21: [
    ['engineTC2', asFloat],
  ],
  22: [
    ['engineTC3', asFloat],
  ],
  23: [
    ['engineTC4', asFloat],
  ],
}

/** @type {Object.<Number,Array.<Number>>} */
const OUTBOUND_PACKET_DEFS = {
  // Windows enable port packet
  0: [UINT8],
  // [130..169] Sent to Flight Computer
  130: [UINT8],
  131: [UINT8],
  132: [UINT8],
  133: [UINT8],
  134: [],
  135: [],
  // [170..199] Sent to Actuator Controller
  170: [UINT8, UINT32],
  171: [UINT8, UINT32],
  172: [UINT8, UINT32],
  173: [UINT8, UINT32],
  174: [UINT8, UINT32],
  175: [UINT8, UINT32],
  176: [UINT8, UINT32],
  180: [UINT8],
  181: [UINT8],
  182: [UINT8],
  183: [UINT8],
}

module.exports = { INBOUND_PACKET_DEFS, OUTBOUND_PACKET_DEFS }
