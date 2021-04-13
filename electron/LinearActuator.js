const Interpolation = require('./Interpolation');
const Board = require('./Board');

const packets = {
  
};

class LinearActuator extends Board {
  constructor(port, address) {
    super(port, address, packets, {});
  }
}

module.exports = LinearActuator;
