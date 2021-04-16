const Interpolation = require('./Interpolation');
const Board = require('./Board');

const packets = {
  0: {
    0: {
      field: 'ch12v0Current',
      interpolation: null
    },
    1: {
      field: 'ch12v1Current',
      interpolation: null
    },
    2: {
      field: 'ch24v0Current',
      interpolation: null
    },
    3: {
      field: 'ch24v1Current',
      interpolation: null
    }
  },
  1: {
    0: {
      field: 'ch12v0State',
      interpolation: Interpolation.floatToBool
    },
    1: {
      field: 'ch12v1State',
      interpolation: Interpolation.floatToBool
    },
    2: {
      field: 'ch24v0State',
      interpolation: Interpolation.floatToBool
    },
    3: {
      field: 'ch24v1State',
      interpolation: Interpolation.floatToBool
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
      field: 'act0Current',
      interpolation: null
    },
    1: {
      field: 'act1Current',
      interpolation: null
    },
    2: {
      field: 'act2Current',
      interpolation: null
    },
    3: {
      field: 'act3Current',
      interpolation: null
    },
    4: {
      field: 'act4Current',
      interpolation: null
    },
    5: {
      field: 'act5Current',
      interpolation: null
    },
    6: {
      field: 'act6Current',
      interpolation: null
    }
  },
  4: {
    0: {
      field: 'ch0State',
      interpolation: Interpolation.floatToBool
    },
    1: {
      field: 'ch1State',
      interpolation: Interpolation.floatToBool
    },
    2: {
      field: 'ch2State',
      interpolation: Interpolation.floatToBool
    },
    3: {
      field: 'ch3State',
      interpolation: Interpolation.floatToBool
    },
    4: {
      field: 'ch4State',
      interpolation: Interpolation.floatToBool
    },
    5: {
      field: 'ch5State',
      interpolation: Interpolation.floatToBool
    },
    6: {
      field: 'ch6State',
      interpolation: Interpolation.floatToBool
    }
  },
  5: {
    0: {
      field: 'act0State',
      interpolation: Interpolation.floatToBool
    },
    1: {
      field: 'act1State',
      interpolation: Interpolation.floatToBool
    },
    2: {
      field: 'act2State',
      interpolation: Interpolation.floatToBool
    },
    3: {
      field: 'act3State',
      interpolation: Interpolation.floatToBool
    },
    4: {
      field: 'act4State',
      interpolation: Interpolation.floatToBool
    },
    5: {
      field: 'act5State',
      interpolation: Interpolation.floatToBool
    },
    6: {
      field: 'act6State',
      interpolation: Interpolation.floatToBool
    }
  }
};

class LinearActuator extends Board {
  constructor(port, address, mapping) {
    super(port, address, packets, mapping);
  }
}

module.exports = LinearActuator;
