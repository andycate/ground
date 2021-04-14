const Interpolation = require('./Interpolation');
const Board = require('./Board');

const packets = {
  
};

class LinearActuator extends Board {
  constructor(port, address, mapping) {
    super(port, address, packets, mapping);
  }
}

module.exports = LinearActuator;
