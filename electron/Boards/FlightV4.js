const Board = require('../Board');
const Interpolation = require("./Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32, asUInt32fromustos} = Interpolation;
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES;

class FlightV4 extends Board {
  constructor(port, address, name, onConnect, onDisconnect, onRate) {
    
    super(port, address, name, {}, onConnect, onDisconnect, onRate);

    this.inboundPacketDefs = {
      // Firmware Status
      0: [
        ["firmwareCommitHash", asASCIIString]
      ],

      // 8V Supply Stats
      1: [
        ["flightSupply8Voltage", asFloat],
        ["flightSupply8Current", asFloat],
        ["flightSupply8Power", asFloat]
      ],

      // IMU Telemetry
      2: [
        ["#", asUInt8],
        ["qW", asFloat],
        ["qX", asFloat],
        ["qY", asFloat],
        ["qZ", asFloat],
        ["accelX", asFloat],
        ["accelY", asFloat],
        ["accelZ", asFloat]
      ],

      // Barometer Telemetry
      3: [
        ["#", asUInt8],
        ["baroAltitude", asFloat],
        ["baroPressure", asFloat],
        ["baroTemperature", asFloat],
      ],

      // GPS Telemetry
      4: [
        ["gpsLatitude", asFloat],
        ["gpsLongitude", asFloat],
        ["gpsAltitude", asFloat],
        ["gpsSpeed", asFloat],
        ["validGpsFix", asUInt8],
        ["numGpsSats", asUInt8]
      ],

      // LOX GEMS IV
      5: [
        ["loxGEMSvoltage", asFloat]
        ["loxGEMScurrent", asFloat]
      ],
      
      // Fuel GEMS IV
      6: [
        ["fuelGEMSvoltage", asFloat]
        ["fuelGEMScurrent", asFloat]
      ],

      // LOX GEMS State
      7: [
        ["loxGEMSstate", asUInt8]
      ],
      
      // LOX GEMS State
      8: [
        ["fuelGEMSstate", asUInt8]
      ],

      // LOX Cap Fill
      9: [
        ["loxCapVal", asFloat],
        ["loxCapAvg", asFloat],
        ["loxCapTemperature", asFloat]
      ],

      // Fuel Cap Fill
      10: [
        ["fuelCapVal", asFloat],
        ["fuelCapAvg", asFloat],
        ["fuelCapTemperature", asFloat]
      ],

      // Press Flow RBV
      11: [
        ["pressurantFlowRBVstate", asUInt8],
        ["pressurantFlowRBVvoltage", asFloat],
        ["pressurantFlowRBVcurrent", asFloat]
      ],

      // Apogee
      12: [
        ["apogeeTime", asUInt32],
        ["apogeeAltitudeDetected", asUInt32],
        ["mainChuteDeployTime", asUInt32],
        ["drogueChuteDeployTime", asUInt32],
      ],

      // Vehicle State
      13: [
        ["vehicleState", asUInt8]
      ],

      // Blackbox Bytes Written
      14: [
        ["blackboxWritten", asUInt32],
        ["isRecording", asUInt8]
      ],

      // Flight OC Event
      15: [],

      // AutoVent Status
      16: [
        ["autoVentStatus", asUInt8]
      ],

      // Breakwire 1 State
      17: [
        ["breakWire1Voltage", asFloat],
        ["breakWire1Current", asFloat]
      ],
      
      // Breakwire 2 State
      18: [
        ["breakWire2Voltage", asFloat],
        ["breakWire2Current", asFloat]
      ],

      // PT Value
      19: [
        ["#", asUInt8],
        ["ptValue", asFloat]
      ],

      // TC Value
      20: [
        ["#", asUInt8],
        ["tcValue", asFloat]
      ]
    }
  }
}

module.exports = FlightV4;