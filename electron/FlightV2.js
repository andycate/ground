const Interpolation = require('./Interpolation');
const Board = require('./Board');
const Packet = require('./Packet');

const packets = {
  0: {
    0: {
      field: 'loxTreeTemp',
      interpolation: null
    },
    1: {
      field: 'loxTreeHeater',
      interpolation: null
    }
  },
  1: {
    0: {
      field: 'loxTankPT',
      interpolation: null
    },
    1: {
      field: 'propTankPT',
      interpolation: null
    },
    2: {
      field: 'loxInjectorPT',
      interpolation: null
    },
    3: {
      field: 'propInjectorPT',
      interpolation: null
    },
    4: {
      field: 'pressurantPT',
      interpolation: null
    },
    5: {
      field: 'loxDomePT',
      interpolation: null
    },
    6: {
      field: 'propDomePT',
      interpolation: null
    },
    7: {
      field: 'loxGemsPT',
      interpolation: null
    },
  },
  2: {
    0: {
      field: 'flightVoltage',
      interpolation: null
    },
    1: {
      field: 'flightPower',
      interpolation: null
    },
    2: {
      field: 'flightCurrent',
      interpolation: null
    },
  },
  4: {
    0: {
      field: 'loxTankMidTC',
      interpolation: null
    },
    1: {
      field: 'loxTankTopTC',
      interpolation: null
    },
    2: {
      field: 'propTankMidTC',
      interpolation: null
    },
    3: {
      field: 'propTankTopTC',
      interpolation: null
    },
  },
  6: {
    0: {
      field: 'loxGemsTemp',
      interpolation: null
    },
    1: {
      field: 'loxGemsHeater',
      interpolation: null
    },
  },
  8: {
    0: {
      field: 'propGemsTemp',
      interpolation: null
    },
    1: {
      field: 'propGemsHeater',
      interpolation: null
    },
  },
  16: {
    0: {
      field: 'propTreeTemp',
      interpolation: null
    },
    1: {
      field: 'propTreeHeater',
      interpolation: null
    },
  },
  17: {
    0: {
      field: 'loxExpectedStatic',
      interpolation: null
    },
    1: {
      field: 'propExpectedStatic',
      interpolation: null
    },
  },
  18: {
    0: {
      field: 'flowType',
      interpolation: null
    },
    1: {
      field: 'flowState',
      interpolation: null
    },
  },
  19: {
    0: {
      field: 'loxInjectorTemp',
      interpolation: null
    },
    1: {
      field: 'loxInjectorHeater',
      interpolation: null
    },
    2: {
      field: 'loxInjectorHeaterCurrent',
      interpolation: null
    },
  },
  21: {
    0: {
      field: 'lox2WayCurrent',
      interpolation: null
    },
    1: {
      field: 'igniterCurrent',
      interpolation: null
    },
    2: {
      field: 'lox5WayCurrent',
      interpolation: null
    },
    3: {
      field: 'prop5WayCurrent',
      interpolation: null
    },
    4: {
      field: 'loxGemsCurrent',
      interpolation: null
    },
    5: {
      field: 'propGemsCurrent',
      interpolation: null
    },
    6: {
      field: 'pressurantCurrent',
      interpolation: null
    },
  },
  22: {
    0: {
      field: 'lox2WayVoltage',
      interpolation: null
    },
    1: {
      field: 'igniterVoltage',
      interpolation: null
    },
    2: {
      field: 'lox5WayVoltage',
      interpolation: null
    },
    3: {
      field: 'prop5WayVoltage',
      interpolation: null
    },
    4: {
      field: 'loxGemsVoltage',
      interpolation: null
    },
    5: {
      field: 'propGemsVoltage',
      interpolation: null
    },
    6: {
      field: 'pressurantVoltage',
      interpolation: null
    },
  },
  60: {
    0: {
      field: 'propInjectorTemp',
      interpolation: null
    },
    1: {
      field: 'propInjectorHeater',
      interpolation: null
    },
    2: {
      field: 'propInjectorHeaterCurrent',
      interpolation: null
    },
  },
  20: {
    0: {
      field: 'lox2Way',
      interpolation: Interpolation.floatToBool
    },
    1: {
      field: 'igniter',
      interpolation: Interpolation.floatToBool
    },
    2: {
      field: 'lox5Way',
      interpolation: Interpolation.floatToBool
    },
    3: {
      field: 'prop5Way',
      interpolation: Interpolation.floatToBool
    },
    4: {
      field: 'loxGems',
      interpolation: Interpolation.floatToBool
    },
    5: {
      field: 'propGems',
      interpolation: Interpolation.floatToBool
    },
    6: {
      field: 'HPS',
      interpolation: Interpolation.floatToBool
    },
    7: {
      field: 'HPSEnable',
      interpolation: Interpolation.floatToBool
    },
  }
};

class FlightV2 extends Board {
  constructor(port, address, onConnect, onDisconnect, onRate) {
    super(port, address, packets, {}, onConnect, onDisconnect, onRate);

    this.openLox2Way = this.openLox2Way.bind(this);
    this.closeLox2Way = this.closeLox2Way.bind(this);

    this.openLox5Way = this.openLox5Way.bind(this);
    this.closeLox5Way = this.closeLox5Way.bind(this);

    this.openProp5Way = this.openProp5Way.bind(this);
    this.closeProp5Way = this.closeProp5Way.bind(this);

    this.openLoxGems = this.openLoxGems.bind(this);
    this.closeLoxGems = this.closeLoxGems.bind(this);

    this.openPropGems = this.openPropGems.bind(this);
    this.closePropGems = this.closePropGems.bind(this);

    this.enableHPS = this.enableHPS.bind(this);
    this.disableHPS = this.disableHPS.bind(this);
    this.openHPS = this.openHPS.bind(this);
    this.closeHPS = this.closeHPS.bind(this);

    this.activateIgniter = this.activateIgniter.bind(this);
    this.deactivateIgniter = this.deactivateIgniter.bind(this);

    this.beginFlow = this.beginFlow.bind(this);
    this.abort = this.abort.bind(this);


    this.setLoxPTHeater = this.setLoxPTHeater.bind(this);
    this.setLoxGemsHeater = this.setLoxGemsHeater.bind(this);
    this.setLoxInjectorHeater = this.setLoxInjectorHeater.bind(this);

    this.setPropanePTHeater = this.setPropanePTHeater.bind(this);
    this.setPropaneGemsHeater = this.setPropaneGemsHeater.bind(this);
    this.setPropaneInjectorHeater = this.setPropaneInjectorHeater.bind(this);
  }

  openLox2Way() { return this.sendPacket(20, [1.0]); }
  closeLox2Way() { return this.sendPacket(20, [0.0]); }

  openLox5Way() { return this.sendPacket(21, [1.0]); }
  closeLox5Way() { return this.sendPacket(21, [0.0]); }

  openProp5Way() { return this.sendPacket(24, [1.0]); }
  closeProp5Way() { return this.sendPacket(24, [0.0]); }

  openLoxGems() { return this.sendPacket(22, [1.0]); }
  closeLoxGems() { return this.sendPacket(22, [0.0]); }

  openPropGems() { return this.sendPacket(25, [1.0]); }
  closePropGems() { return this.sendPacket(25, [0.0]); }

  enableHPS() { return this.sendPacket(31, [1.0]); }
  disableHPS() { return this.sendPacket(31, [0.0]); }
  openHPS() { return this.sendPacket(26, [1.0]); }
  closeHPS() { return this.sendPacket(26, [0.0]); }

  beginFlow() { return this.sendPacket(29, [1.0]); } // 29 is old waterflow
  abort() { return this.sendPacket(29, [0.0]); } // 29 is old waterflow (should change to endFlow)

  activateIgniter() { return this.sendPacket(23, [1.0]); }
  deactivateIgniter() { return this.sendPacket(23, [0.0]); }


  setLoxPTHeater(val) { return this.sendPacket(40, [val]); }
  setLoxGemsHeater(val) { return this.sendPacket(41, [val]); }
  setLoxInjectorHeater(val) { return this.sendPacket(44, [val]); }

  setPropanePTHeater(val) { return this.sendPacket(42, [val]); }
  setPropaneGemsHeater(val) { return this.sendPacket(43, [val]); }
  setPropaneInjectorHeater(val) { return this.sendPacket(45, [val]); }
}

module.exports = FlightV2;
