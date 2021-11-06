const Board = require('./Board');

const packets = {

  5: {
    0: {
      field: 'daq3-numPacketSent',
      interpolation: null
    }
  },

  8: {
    0: {
      field: 'daq3-fuel-capVal',
      interpolation: null
    },
    1: {
      field: 'daq3-fuel-frequency',
      interpolation: null
    },
    2: {
      field: 'daq3-lox-capVal',
      interpolation: null
    },
    3: {
      field: 'daq3-lox-frequency',
      interpolation: null
    }

  },
};

class DAQV3 extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    super(port, address, packets, mapping, onConnect, onDisconnect, onRate);
  }
}

module.exports = DAQV3;
