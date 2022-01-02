const Board = require('../Board');

class FlightV2 extends Board {
  constructor(port, address, onConnect, onDisconnect, onRate) {
    super(port, address, {}, onConnect, onDisconnect, onRate);

    this.openarmValve = this.openarmValve.bind(this);
    this.closearmValve = this.closearmValve.bind(this);

    this.openloxMainValve = this.openloxMainValve.bind(this);
    this.closeloxMainValve = this.closeloxMainValve.bind(this);

    this.openfuelMainValve = this.openfuelMainValve.bind(this);
    this.closefuelMainValve = this.closefuelMainValve.bind(this);

    // this.openLoxGems = this.openLoxGems.bind(this);
    // this.closeLoxGems = this.closeLoxGems.bind(this);

    // this.openPropGems = this.openPropGems.bind(this);
    // this.closePropGems = this.closePropGems.bind(this);

    this.enableHPS = this.enableHPS.bind(this);
    this.disableHPS = this.disableHPS.bind(this);
    this.openHPS = this.openHPS.bind(this);
    this.closeHPS = this.closeHPS.bind(this);

    this.enableThermocoupleRead = this.enableThermocoupleRead.bind(this)
    this.disableThermocoupleRead = this.disableThermocoupleRead.bind(this)

    this.activateIgniter = this.activateIgniter.bind(this);
    this.deactivateIgniter = this.deactivateIgniter.bind(this);

    this.beginFlow = this.beginFlow.bind(this);
    this.abort = this.abort.bind(this);


    this.setloxTankPTHeater = this.setloxTankPTHeater.bind(this);
    // this.setLoxGemsHeater = this.setLoxGemsHeater.bind(this);
    this.setloxInjectorPTHeater = this.setloxInjectorPTHeater.bind(this);

    this.setfuelTankPTHeater = this.setfuelTankPTHeater.bind(this);
    // this.setPropaneGemsHeater = this.setPropaneGemsHeater.bind(this);
    this.setfuelInjectorPTHeater = this.setfuelInjectorPTHeater.bind(this);

    this.endCheckout = this.endCheckout.bind(this);
    this.startCheckout = this.startCheckout.bind(this);

  }

  openarmValve() { return this.sendPacket(20, [1.0]); }
  closearmValve() { return this.sendPacket(20, [0.0]); }

  openloxMainValve() { return this.sendPacket(21, [1.0]); }
  closeloxMainValve() { return this.sendPacket(21, [0.0]); }

  openfuelMainValve() { return this.sendPacket(24, [1.0]); }
  closefuelMainValve() { return this.sendPacket(24, [0.0]); }

  // openLoxGems() { return this.sendPacket(22, [1.0]); }
  // closeLoxGems() { return this.sendPacket(22, [0.0]); }

  // openPropGems() { return this.sendPacket(25, [1.0]); }
  // closePropGems() { return this.sendPacket(25, [0.0]); }

  enableHPS() { return this.sendPacket(31, [1.0]); }
  disableHPS() { return this.sendPacket(31, [0.0]); }
  openHPS() { return this.sendPacket(26, [1.0]); }
  closeHPS() { return this.sendPacket(26, [0.0]); }

  beginFlow() { return this.sendPacket(29, [1.0]); } // 29 is old waterflow
  abort() { return this.sendPacket(29, [0.0]); } // 29 is old waterflow (should change to endFlow)

  activateIgniter() { return this.sendPacket(23, [1.0]); }
  deactivateIgniter() { return this.sendPacket(23, [0.0]); }

  enableThermocoupleRead() { return this.sendPacket(65, [1.0]); }
  disableThermocoupleRead() { return this.sendPacket(65, [0.0]); }


  setloxTankPTHeater(val) { return this.sendPacket(40, [val]); }
  // setLoxGemsHeater(val) { return this.sendPacket(41, [val]); }
  setloxInjectorPTHeater(val) { return this.sendPacket(44, [val]); }

  setfuelTankPTHeater(val) { return this.sendPacket(42, [val]); }
  // setPropaneGemsHeater(val) { return this.sendPacket(43, [val]); }
  setfuelInjectorPTHeater(val) { return this.sendPacket(45, [val]); }

  endCheckout() { return this.sendPacket(58, [1.0]); }
  startCheckout() { return this.sendPacket(58, [0.0]); }

}

module.exports = FlightV2;
