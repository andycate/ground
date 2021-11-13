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
};

class DAQ extends Board {
  constructor(port, mapping, onConnect, onDisconnect, onRate) {
    super(port, '', packets, mapping, onConnect, onDisconnect, onRate);
  }
}

module.exports = DAQ;
