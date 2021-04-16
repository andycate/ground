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

class ActuatorController extends Board {
  constructor(port, address, mapping) {
    super(port, address, packets, mapping);

    this.open12vCh0 = this.open12vCh0.bind(this);
    this.close12vCh0 = this.close12vCh0.bind(this);
    this.setHeater12vCh0 = this.setHeater12vCh0.bind(this);

    this.open12vCh1 = this.open12vCh1.bind(this);
    this.close12vCh1 = this.close12vCh1.bind(this);
    this.setHeater12vCh1 = this.setHeater12vCh1.bind(this);

    this.open24vCh0 = this.open24vCh0.bind(this);
    this.close24vCh0 = this.close24vCh0.bind(this);
    this.setHeater24vCh0 = this.setHeater24vCh0.bind(this);

    this.open24vCh0 = this.open24vCh0.bind(this);
    this.close24vCh0 = this.close24vCh0.bind(this);
    this.setHeater24vCh0 = this.setHeater24vCh0.bind(this);

    this.openActCh0 = this.openActCh0.bind(this);
    this.closeActCh0 = this.closeActCh0.bind(this);
    this.actCh0ms = this.actCh0ms.bind(this);

    this.openActCh1 = this.openActCh1.bind(this);
    this.closeActCh1 = this.closeActCh1.bind(this);
    this.actCh1ms = this.actCh1ms.bind(this);

    this.openActCh2 = this.openActCh2.bind(this);
    this.closeActCh2 = this.closeActCh2.bind(this);
    this.actCh2ms = this.actCh2ms.bind(this);

    this.openActCh3 = this.openActCh3.bind(this);
    this.closeActCh3 = this.closeActCh3.bind(this);
    this.actCh3ms = this.actCh3ms.bind(this);

    this.openActCh4 = this.openActCh4.bind(this);
    this.closeActCh4 = this.closeActCh4.bind(this);
    this.actCh4ms = this.actCh4ms.bind(this);

    this.openActCh5 = this.openActCh5.bind(this);
    this.closeActCh5 = this.closeActCh5.bind(this);
    this.actCh5ms = this.actCh5ms.bind(this);

    this.openActCh6 = this.openActCh6.bind(this);
    this.closeActCh6 = this.closeActCh6.bind(this);
    this.actCh6ms = this.actCh6ms.bind(this);


  }

  open12vCh0() { return this.sendPacket(10, [1]); }
  close12vCh0() { return this.sendPacket(10, [0]); }
  setHeater12vCh0(heaterVal) { return this.sendPacket(10, [heaterVal]); }

  open12vCh1() { return this.sendPacket(10, [1]); }
  close12vCh1() { return this.sendPacket(10, [0]); }
  setHeater12vCh1(heaterVal) { return this.sendPacket(10, [heaterVal]); }

  open24vCh0() { return this.sendPacket(10, [1]); }
  close24vCh0() { return this.sendPacket(10, [0]); }
  setHeater24vCh0(heaterVal) { return this.sendPacket(10, [heaterVal]); }

  open24vCh0() { return this.sendPacket(10, [1]); }
  close24vCh0() { return this.sendPacket(10, [0]); }
  setHeater24vCh0(heaterVal) { return this.sendPacket(10, [heaterVal]); }

  openActCh0() { return this.sendPacket(14, [2]); }
  closeActCh0() { return this.sendPacket(14, [1]); }
  actCh0ms(time) { return this.sendPacket(14, [time]); }

  openActCh1() { return this.sendPacket(15, [2]); }
  closeActCh1() { return this.sendPacket(15, [1]); }
  actCh1ms(time) { return this.sendPacket(15, [time]); }

  openActCh2() { return this.sendPacket(16, [2]); }
  closeActCh2() { return this.sendPacket(16, [1]); }
  actCh2ms(time) { return this.sendPacket(16, [time]); }

  openActCh3() { return this.sendPacket(17, [2]); }
  closeActCh3() { return this.sendPacket(17, [1]); }
  actCh3ms(time) { return this.sendPacket(17, [time]); }

  openActCh4() { return this.sendPacket(18, [2]); }
  closeActCh4() { return this.sendPacket(18, [1]); }
  actCh4ms(time) { return this.sendPacket(18, [time]); }

  openActCh5() { return this.sendPacket(19, [2]); }
  closeActCh5() { return this.sendPacket(19, [1]); }
  actCh5ms(time) { return this.sendPacket(19, [time]); }

  openActCh6() { return this.sendPacket(20, [2]); }
  closeActCh6() { return this.sendPacket(20, [1]); }
  actCh6ms(time) { return this.sendPacket(20, [time]); }

}

module.exports = ActuatorController;
