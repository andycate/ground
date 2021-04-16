const Interpolation = require('./Interpolation');
const Board = require('./Board');

const packets = {
  1: {
    0: {
      field: 'adcVal0',
      interpolation: null
    },
    1: {
      field: 'adcVal1',
      interpolation: null
    },
    2: {
      field: 'adcVal2',
      interpolation: null
    },
    3: {
      field: 'adcVal3',
      interpolation: null
    },
    4: {
      field: 'adcVal4',
      interpolation: null
    },
    5: {
      field: 'adcVal5',
      interpolation: null
    },
    6: {
      field: 'adcVal6',
      interpolation: null
    },
    7: {
      field: 'adcVal7',
      interpolation: null
    }
  },
  2: {
    0: {
      field: 'daqVoltage',
      interpolation: null
    },
    1: {
      field: 'daqPower',
      interpolation: null
    },
    2: {
      field: 'daqCurrentDraw',
      interpolation: null
    }
  },
  3: {
    0: {
      field: 'lc0',
      interpolation: null
    },
    1: {
      field: 'lc1',
      interpolation: null
    },
    2: {
      field: 'lcSum',
      interpolation: null
    }
  },
  4: {
    0: {
      field: 'tcVal0',
      interpolation: null
    },
    1: {
      field: 'tcVal1',
      interpolation: null
    },
    2: {
      field: 'tcVal2',
      interpolation: null
    },
    3: {
      field: 'tcVal3',
      interpolation: null
    }
  },
  5: {
    0: {
      field: '5v_aVoltage',
      interpolation: null
    },
    1: {
      field: '5v_aCurrent',
      interpolation: null
    },
    2: {
      field: '5vVoltage',
      interpolation: null
    },
    3: {
      field: '5vCurrent',
      interpolation: null
    }
  }
};

class DAQ extends Board {
  constructor(port, address, mapping) {
    super(port, address, packets, mapping);
  }
}

module.exports = DAQ;
