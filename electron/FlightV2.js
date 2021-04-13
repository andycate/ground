const Interpolation = require('./Interpolation');
const Board = require('./Board');

const packets = {
  0: {
    0: {
      field: 'loxTreeTC',
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
      field: 'loxTankLowTC',
      interpolation: null
    },
    1: {
      field: 'loxTankMidTC',
      interpolation: null
    },
    3: {
      field: 'propTankLowTC',
      interpolation: null
    },
    4: {
      field: 'propTankMidTC',
      interpolation: null
    },
  },
  6: {
    0: {
      field: 'loxGemsTC',
      interpolation: null
    },
    1: {
      field: 'loxGemsHeater',
      interpolation: null
    },
  },
  20: {
    0: {
      field: 'lox2Way',
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
  constructor(port, address) {
    super(port, address, packets, {});
  }
}

module.exports = FlightV2;
