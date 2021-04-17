const Interpolation = require('./Interpolation');
const Board = require('./Board');

const packets = {
  1: {
    0: {
      field: 'pressureVal0',
      interpolation: null
    }
  },
  2: {
    0: {
      field: 'voltage',
      interpolation: null
    },
    1: {
      field: 'power',
      interpolation: null
    },
    2: {
      field: 'currentDraw',
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
      field: 'analogTemp0',
      interpolation: null
    }
  }
  6: {
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
