const Board = require('../Board');

class ActuatorController extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    super(port, address, mapping, onConnect, onDisconnect, onRate);

    this.open12vCh0 = this.open12vCh0.bind(this);
    this.close12vCh0 = this.close12vCh0.bind(this);
    this.setHeater12vCh0 = this.setHeater12vCh0.bind(this);

    this.open12vCh1 = this.open12vCh1.bind(this);
    this.close12vCh1 = this.close12vCh1.bind(this);
    this.setHeater12vCh1 = this.setHeater12vCh1.bind(this);

    this.open24vCh0 = this.open24vCh0.bind(this);
    this.close24vCh0 = this.close24vCh0.bind(this);
    this.setHeater24vCh0 = this.setHeater24vCh0.bind(this);

    this.open24vCh1 = this.open24vCh1.bind(this);
    this.close24vCh1 = this.close24vCh1.bind(this);
    this.setHeater24vCh1 = this.setHeater24vCh1.bind(this);

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

  open12vCh1() { return this.sendPacket(11, [1]); }
  close12vCh1() { return this.sendPacket(11, [0]); }
  setHeater12vCh1(heaterVal) { return this.sendPacket(11, [heaterVal]); }

  open24vCh0() { return this.sendPacket(12, [1]); }
  close24vCh0() { return this.sendPacket(12, [0]); }
  setHeater24vCh0(heaterVal) { return this.sendPacket(12, [heaterVal]); }

  open24vCh1() { return this.sendPacket(13, [1]); }
  close24vCh1() { return this.sendPacket(13, [0]); }
  setHeater24vCh1(heaterVal) { return this.sendPacket(13, [heaterVal]); }

  openActCh0() { return this.sendPacket(14, [1]); }
  closeActCh0() { return this.sendPacket(14, [-1]); }
  actCh0ms(time) { return this.sendPacket(14, [time]); }

  openActCh1() { return this.sendPacket(15, [1]); }
  closeActCh1() { return this.sendPacket(15, [-1]); }
  actCh1ms(time) { return this.sendPacket(15, [time]); }

  openActCh2() { return this.sendPacket(16, [1]); }
  closeActCh2() { return this.sendPacket(16, [-1]); }
  actCh2ms(time) { return this.sendPacket(16, [time]); }

  openActCh3() { return this.sendPacket(17, [1]); }
  closeActCh3() { return this.sendPacket(17, [-1]); }
  actCh3ms(time) { return this.sendPacket(17, [time]); }

  openActCh4() { return this.sendPacket(18, [1]); }
  closeActCh4() { return this.sendPacket(18, [-1]); }
  actCh4ms(time) { return this.sendPacket(18, [time]); }

  openActCh5() { return this.sendPacket(19, [1]); }
  closeActCh5() { return this.sendPacket(19, [-1]); }
  actCh5ms(time) { return this.sendPacket(19, [time]); }

  openActCh6() { return this.sendPacket(20, [1]); }
  closeActCh6() { return this.sendPacket(20, [-1]); }
  actCh6ms(time) { return this.sendPacket(20, [time]); }

}

module.exports = ActuatorController;
