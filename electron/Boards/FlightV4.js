const Board = require('../Board');
const Interpolation = require("../Interpolation");

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

      // kalman filter values
      2: [
        ["filteredAltitude", asFloat],
        ["filteredVelocity", asFloat],
        ["filteredAccel", asFloat]
      ],

      // IMU Telemetry
      3: [
        ["accelX", asFloat],
        ["accelY", asFloat],
        ["accelZ", asFloat],
        ["gyroX", asFloat],
        ["gyroY", asFloat],
        ["gyroZ", asFloat],
        ["accelX2", asFloat],
        ["accelY2", asFloat],
        ["accelZ2", asFloat]
      ],

      // Barometer Telemetry
      5: [
        ["baroAltitude", asFloat],
        ["baroTemperature", asFloat]
        ["baroPressure2", asFloat],
        ["baroTemperature2", asFloat]
      ],

      // GPS Telemetry
      4: [
        ["gpsAltitude", asFloat],
        ["gpsLatitude", asFloat],
        ["gpsLongitude", asFloat],
        ["numGpsSats", asUInt8]
      ],

      6: [
        ["chute1Curr", asFloat],
        ["video1Curr", asFloat],
        ["video0Curr", asFloat],
        ["chute0Curr", asFloat],
        ["valve1Curr", asFloat],
        ["valve0Curr", asFloat],
        ["rbvCurr", asFloat],
        ["breakwire0", asFloat]
      ],

      7: [
        ["chute1Cont", asFloat],
        ["video1Cont", asFloat],
        ["video0Cont", asFloat],
        ["chute0Cont", asFloat],
        ["valve1Cont", asFloat],
        ["valve0Cont", asFloat],
        ["rbvCont", asFloat],
        ["breakwire1", asFloat]
      ],

      8: [
        ["busVoltage", asFloat],
        ["shuntCurrent", asFloat],
        ["power", asFloat]
      ],

      10: [
        ["launched", asUInt8],
        ["burnout", asUInt8],
        ["apogee", asUInt8],
        ["drogueDep", asUInt8],
        ["mainDep", asUInt8]
      ],

      11: [
        ["rssi", asFloat]
      ],

      12: [
        ["bbWritten", asUInt32]
      ],

      // // LOX GEMS IV
      // 5: [
      //   ["loxGEMSvoltage", asFloat],
      //   ["loxGEMScurrent", asFloat]
      // ],
      
      // // Fuel GEMS IV
      // 6: [
      //   ["fuelGEMSvoltage", asFloat],
      //   ["fuelGEMScurrent", asFloat]
      // ],

      // // LOX GEMS State
      // 7: [
      //   ["loxGEMSstate", asUInt8]
      // ],
      
      // // LOX GEMS State
      // 8: [
      //   ["fuelGEMSstate", asUInt8]
      // ],

      // // Press Flow RBV
      // 11: [
      //   ["pressurantFlowRBVstate", asUInt8],
      //   ["pressurantFlowRBVvoltage", asFloat],
      //   ["pressurantFlowRBVcurrent", asFloat]
      // ],

      // // Apogee
      // 12: [
      //   ["apogeeTime", asUInt32],
      //   ["apogeeAltitudeDetected", asUInt32],
      //   ["mainChuteDeployTime", asUInt32],
      //   ["drogueChuteDeployTime", asUInt32]
      // ],

      // // Vehicle State
      // 13: [
      //   ["vehicleState", asUInt8]
      // ],

      // // Blackbox Bytes Written
      // 14: [
      //   ["blackboxWritten", asUInt32],
      //   ["isRecording", asUInt8]
      // ],

      // // Flight OC Event
      // 15: [],

      // // AutoVent Status
      // 16: [
      //   ["autoVentStatus", asUInt8]
      // ],

      // // Breakwire 1 State
      // 17: [
      //   ["breakWire1Voltage", asFloat],
      //   ["breakWire1Current", asFloat]
      // ],
      
      // // Breakwire 2 State
      // 18: [
      //   ["breakWire2Voltage", asFloat],
      //   ["breakWire2Current", asFloat]
      // ],

      // // PT Value
      // 19: [
      //   ["ptValue1", asFloat],
      //   ["ptValue2", asFloat],
      //   ["ptValue0", asFloat],
      //   ["ptValue3", asFloat],
      //   ["ptValue4", asFloat],
      //   ["ptValue5", asFloat],
      //   ["ptValue6", asFloat],
      //   ["ptValue7", asFloat]
      // ],

      // // RTD Value
      // 20: [
      //   ["rtd0", asFloat],
      //   ["rtd1", asFloat]
      // ],

      // Cap Fill
      21: [
        ["loxCapVal", asFloat],
        ["loxCapAvg", asFloat],
        ["loxCapTemperature", asFloat],
        ["loxCapRefVal", asFloat],
        ["loxCapRawVal", asFloat]
      ],

      // Fuel Cap Fill
      22: [
        ["fuelCapVal", asFloat],
        ["fuelCapAvg", asFloat],
        ["fuelCapTemperature", asFloat],
        ["fuelCapRefVal", asFloat],
        ["fuelCapRawVal", asFloat]
      ]
    }
  }
}

module.exports = FlightV4;