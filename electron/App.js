const { ipcMain } = require('electron');

const { model } = require('./config');

const State = require('./State');
const UdpPort = require('./UdpPort');
const FlightV2 = require('./FlightV2');
const DAQ = require('./DAQ');
const ActuatorController = require('./ActuatorController');
const InfluxDB = require('./InfluxDB');

class App {
  constructor() {
    this.webContents = [];
    this.state = new State(model);
    this.influxDB = new InfluxDB();

    // comms
    this.updateState = this.updateState.bind(this);
    this.sendDarkModeUpdate = this.sendDarkModeUpdate.bind(this);
    this.port = new UdpPort('0.0.0.0', 42069, this.updateState);

    this.flightComputer = new FlightV2(this.port,
                                       '10.0.0.42',
                                       () => this.updateState(Date.now(), { flightConnected: true }),
                                       () => this.updateState(Date.now(), { flightConnected: false }),
                                       (rate) => this.updateState(Date.now(), { flightKbps: rate }));
    this.daq1 = new DAQ(this.port, '10.0.0.11', {
      pressureVal0: 'propGemsPT',
      voltage: 'daq1Voltage',
      power: 'daq1Power',
      currentDraw: 'daq1CurrentDraw',
      lc0: 'thrust1',
      lc1: 'thrust2',
      lcSum: 'totalThrust',
      tcVal0: 'LOxTankBottomTC',
      tcVal1: 'propTankBottomTC',
      tcVal2: 'EngineTC1',
      tcVal3: 'EngineTC2',
      _5v_aVoltage: 'daq1_5v_aVoltage',
      _5v_aCurrent: 'daq1_5v_aCurrent',
      _5vVoltage: 'daq1_5vVoltage',
      _5vCurrent: 'daq1_5vCurrent',
      analogTemp0:'pressurantTemp'
    },
    () => this.updateState(Date.now(), { daq1Connected: true }),
    () => this.updateState(Date.now(), { daq1Connected: false }),
    (rate) => this.updateState(Date.now(), { daq1Kbps: rate }));

    this.actCtrlr1 = new ActuatorController(this.port, '10.0.0.21', {
      ch12v0Current: null,
      ch12v1Current: null,
      ch24v0Current: 'propTankTopHeaterCurrent',
      ch24v1Current: 'propTankMidHeaterCurrent',
      ch12v0State: null,
      ch12v1State: null,
      ch24v0State: 'propTankTopHeaterVal',
      ch24v1State: 'propTankMidHeaterVal',
      voltage: 'ac1Voltage',
      power: 'ac1Power',
      currentDraw: 'ac1CurrentDraw',
      act0Current: 'pressurantVentRBVcurrent',
      act1Current: 'pressurantFlowRBVcurrent',
      act2Current: 'LOxVentRBVcurrent',
      act3Current: 'LOxTankVentRBVcurrent',
      act4Current: 'LOxFlowRBVcurrent',
      act5Current: null,
      act6Current: null,
      ch0State: 'pressurantVentRBVchState',
      ch1State: 'pressurantFlowRBVchState',
      ch2State: 'LOxVentRBVchState',
      ch3State: 'LOxTankVentRBVchState',
      ch4State: 'LOxFlowRBVchState',
      ch5State: null,
      ch6State: null,
      act0State: 'pressurantVentRBVstate',
      act1State: 'pressurantFlowRBVstate',
      act2State: 'LOxVentRBVstate',
      act3State: 'LOxTankVentRBVstate',
      act4State: 'LOxFlowRBVstate',
      act5State: null,
      act6State: null
    },
    () => this.updateState(Date.now(), { actCtrlr1Connected: true }),
    () => this.updateState(Date.now(), { actCtrlr1Connected: false }),
    (rate) => this.updateState(Date.now(), { actCtrlr1Kbps: rate }));
    this.actCtrlr2 = new ActuatorController(this.port, '10.0.0.22', {
      ch12v0Current: null,
      ch12v1Current: null,
      ch24v0Current: 'propTankBottomHeaterCurrent',
      ch24v1Current: 'LOxTankTopHeaterCurrent',
      ch12v0State: null,
      ch12v1State: null,
      ch24v0State: 'propTankBottomHeaterVal',
      ch24v1State: 'LOxTankTopHeaterVal',
      voltage: 'ac2Voltage',
      power: 'ac2Power',
      currentDraw: 'ac2CurrentDraw',
      act0Current: 'LOxRQD1current',
      act1Current: 'LOxRQD2current',
      act2Current: 'propaneVentRBVcurrent',
      act3Current: 'propaneFlowRBVcurrent',
      act4Current: 'propaneRQD1current',
      act5Current: 'propaneRQD2current',
      act6Current: null,
      ch0State: 'LOxRQD1chState',
      ch1State: 'LOxRQD2chState',
      ch2State: 'propaneVentRBVchState',
      ch3State: 'propaneFlowRBVchState',
      ch4State: 'propaneRQD1chState',
      ch5State: 'propaneRQD2chState',
      ch6State: null,
      act0State: 'LOxRQD1state',
      act1State: 'LOxRQD2state',
      act2State: 'propaneVentRBVstate',
      act3State: 'propaneFlowRBVstate',
      act4State: 'propaneRQD1state',
      act5State: 'propaneRQD2state',
      act6State: null
    },
    () => this.updateState(Date.now(), { actCtrlr2Connected: true }),
    () => this.updateState(Date.now(), { actCtrlr2Connected: false }),
    (rate) => this.updateState(Date.now(), { actCtrlr2Kbps: rate }));

    this.actCtrlr3 = new ActuatorController(this.port, '10.0.0.23', {
      ch12v0Current: null,
      ch12v1Current: null,
      ch24v0Current: 'LOxTankMidHeaterCurrent',
      ch24v1Current: 'LOxTankBottomHeaterCurrent',
      ch12v0State: null,
      ch12v1State: null,
      ch24v0State: 'LOxTankMidHeaterVal',
      ch24v1State: 'LOxTankBottomHeaterVal',
      voltage: 'ac3Voltage',
      power: 'ac3Power',
      currentDraw: 'ac3CurrentDraw',
      act0Current: 'LOxPrechillRBVcurrent',
      act1Current: 'purgePrechillVentRBVcurrent',
      act2Current: 'prechillFlowRBVcurrent',
      act3Current: 'propanePrechillRBVcurrent',
      act4Current: 'purgeFlowRBVcurrent',
      act5Current: null,
      act6Current: null,
      ch0State: 'LOxPrechillRBVchState',
      ch1State: 'purgePrechillVentRBVchState',
      ch2State: 'prechillFlowRBVchState',
      ch3State: 'propanePrechillRBVchState',
      ch4State: 'purgeFlowRBVchState',
      ch5State: null,
      ch6State: null,
      act0State: 'LOxPrechillRBVstate',
      act1State: 'purgePrechillVentRBVstate',
      act2State: 'prechillFlowRBVstate',
      act3State: 'propanePrechillRBVstate',
      act4State: 'purgeFlowRBVstate',
      act5State: null,
      act6State: null
    },
    () => this.updateState(Date.now(), { actCtrlr3Connected: true }),
    () => this.updateState(Date.now(), { actCtrlr3Connected: false }),
    (rate) => this.updateState(Date.now(), { actCtrlr3Kbps: rate }));

    this.abort = this.abort.bind(this);
    this.hold = this.hold.bind(this);

    this.setupIPC();
  }

  /**
   * Takes in an update to the state and sends it where it needs to go
   *
   * @param {Object} update
   */
  updateState(timestamp, update) {
    this.state.updateState(timestamp, update);
    this.sendStateUpdate(timestamp, update);
    this.influxDB.handleStateUpdate(timestamp, update);
  }

  /**
   * Send the specified state update to all windows
   *
   * @param {moment.Moment} timestamp
   * @param {Object} update
   */
  sendStateUpdate(timestamp, update) {
    for(let wc of this.webContents) {
      wc.send('state-update', {
        timestamp,
        update,
      });
    }
  }

  sendDarkModeUpdate(isDark) {
    for(let wc of this.webContents) {
      wc.send('set-darkmode', isDark);
    }
  }

  /**
   * When a window is created, register it's webContents object so we can send
   * state updates to that window
   *
   * @param {Object} webContents
   */
  addWebContents(webContents) {
    this.webContents.push(webContents);
  }

  abort() {
    this.flightComputer.abort();
  }

  hold() {
    // TODO: implement hold
  }

  /**
   * Sets up all the IPC commands that the windows have access to
   */
  setupIPC() {
    ipcMain.handle('connect-influx', (e, host, port, protocol, username, password) => this.influxDB.connect(host, port, protocol, username, password));
    ipcMain.handle('get-databases', this.influxDB.getDatabaseNames);
    ipcMain.handle('set-database', (e, database) => this.influxDB.setDatabase(database));
    ipcMain.handle('set-darkmode', (e, isDark) => this.sendDarkModeUpdate(isDark));

    // Flight Computer

    ipcMain.handle('flight-connected', () => this.flightComputer.isConnected);
    ipcMain.handle('daq1-connected', () => this.daq1.isConnected);
    ipcMain.handle('actctrlr1-connected', () => this.actCtrlr1.isConnected);
    ipcMain.handle('actctrlr2-connected', () => this.actCtrlr2.isConnected);
    ipcMain.handle('actctrlr3-connected', () => this.actCtrlr3.isConnected);

    ipcMain.handle('open-lox2Way', this.flightComputer.openLox2Way);
    ipcMain.handle('close-lox2Way', this.flightComputer.closeLox2Way);

    ipcMain.handle('open-lox5Way', this.flightComputer.openLox5Way);
    ipcMain.handle('close-lox5Way', this.flightComputer.closeLox5Way);

    ipcMain.handle('open-prop5Way', this.flightComputer.openProp5Way);
    ipcMain.handle('close-prop5Way', this.flightComputer.closeProp5Way);

    ipcMain.handle('open-loxGems', this.flightComputer.openLoxGems);
    ipcMain.handle('close-loxGems', this.flightComputer.closeLoxGems);

    ipcMain.handle('open-propGems', this.flightComputer.openPropGems);
    ipcMain.handle('close-propGems', this.flightComputer.closePropGems);

    ipcMain.handle('enable-HPS', this.flightComputer.enableHPS);
    ipcMain.handle('disable-HPS', this.flightComputer.disableHPS);
    ipcMain.handle('open-HPS', this.flightComputer.openHPS);
    ipcMain.handle('close-HPS', this.flightComputer.closeHPS);

    ipcMain.handle('begin-flow', this.flightComputer.beginFlow);
    ipcMain.handle('abort', this.abort);
    ipcMain.handle('hold', this.hold);


    // DAQ 1

    // DAQ 2


    // Actuator Controller 1

    ipcMain.handle('set-propTankTopHeater', (val) => this.actCtrlr1.setHeater24vCh0(val));

    ipcMain.handle('set-propTankMidHeater', (val) => this.actCtrlr1.setHeater24vCh1(val));

    ipcMain.handle('open-pressurantVentRBV', this.actCtrlr1.openActCh0);
    ipcMain.handle('close-pressurantVentRBV', this.actCtrlr1.closeActCh0);
    ipcMain.handle('time-pressurantVentRBV', (val) => this.actCtrlr1.actCh0ms(val));

    ipcMain.handle('open-pressurantFlowRBV', this.actCtrlr1.openActCh1);
    ipcMain.handle('close-pressurantFlowRBV', this.actCtrlr1.closeActCh1);
    ipcMain.handle('time-pressurantFlowRBV', (val) => this.actCtrlr1.actCh1ms(val));

    ipcMain.handle('open-LOxVentRBV', this.actCtrlr1.openActCh2);
    ipcMain.handle('close-LOxVentRBV', this.actCtrlr1.closeActCh2);
    ipcMain.handle('time-LOxVentRBV', (val) => this.actCtrlr1.actCh2ms(val));

    ipcMain.handle('open-LOxTankVentRBV', this.actCtrlr1.openActCh3);
    ipcMain.handle('close-LOxTankVentRBV', this.actCtrlr1.closeActCh3);
    ipcMain.handle('time-LOxTankVentRBV', (val) => this.actCtrlr1.actCh3ms(val));

    ipcMain.handle('open-LOxFlowRBV', this.actCtrlr1.openActCh4);
    ipcMain.handle('close-LOxFlowRBV', this.actCtrlr1.closeActCh4);
    ipcMain.handle('time-LOxFlowRBV', (val) => this.actCtrlr1.actCh4ms(val));

    // Actuator Controller 2

    ipcMain.handle('set-propTankBottomHeater', (val) => this.actCtrlr2.setHeater24vCh0(val));

    ipcMain.handle('set-LOxTankTopHeater', (val) => this.actCtrlr2.setHeater24vCh1(val));

    ipcMain.handle('open-LOxRQD1', this.actCtrlr2.openActCh0);
    ipcMain.handle('close-LOxRQD1', this.actCtrlr2.closeActCh0);
    ipcMain.handle('time-LOxRQD1', (val) => this.actCtrlr2.actCh0ms(val));

    ipcMain.handle('open-LOxRQD2', this.actCtrlr2.openActCh1);
    ipcMain.handle('close-LOxRQD2', this.actCtrlr2.closeActCh1);
    ipcMain.handle('time-LOxRQD2', (val) => this.actCtrlr2.actCh1ms(val));

    ipcMain.handle('open-propaneVentRBV', this.actCtrlr2.openActCh2);
    ipcMain.handle('close-propaneVentRBV', this.actCtrlr2.closeActCh2);
    ipcMain.handle('time-propaneVentRBV', (val) => this.actCtrlr2.actCh2ms(val));

    ipcMain.handle('open-propaneFlowRBV', this.actCtrlr2.openActCh3);
    ipcMain.handle('close-propaneFlowRBV', this.actCtrlr2.closeActCh3);
    ipcMain.handle('time-propaneFlowRBV', (val) => this.actCtrlr2.actCh3ms(val));

    ipcMain.handle('open-propaneRQD1', this.actCtrlr2.openActCh4);
    ipcMain.handle('close-propaneRQD1', this.actCtrlr2.closeActCh4);
    ipcMain.handle('time-propaneRQD1', (val) => this.actCtrlr2.actCh4ms(val));

    ipcMain.handle('open-propaneRQD2', this.actCtrlr2.openActCh5);
    ipcMain.handle('close-propaneRQD2', this.actCtrlr2.closeActCh5);
    ipcMain.handle('time-propaneRQD2', (val) => this.actCtrlr2.actCh5ms(val));

    // Actuator Controller 3

    ipcMain.handle('set-LOxTankMidHeater', (val) => this.actCtrlr3.setHeater24vCh0(val));

    ipcMain.handle('set-LOxTankBottomHeater', (val) => this.actCtrlr3.setHeater24vCh1(val));

    ipcMain.handle('open-LOxPrechillRBV', this.actCtrlr3.openActCh0);
    ipcMain.handle('close-LOxPrechillRBV', this.actCtrlr3.closeActCh0);
    ipcMain.handle('time-LOxPrechillRBV', (val) => this.actCtrlr3.actCh0ms(val));

    ipcMain.handle('open-purgePrechillVentRBV', this.actCtrlr3.openActCh1);
    ipcMain.handle('close-purgePrechillVentRBV', this.actCtrlr3.closeActCh1);
    ipcMain.handle('time-purgePrechillVentRBV', (val) => this.actCtrlr3.actCh1ms(val));

    ipcMain.handle('open-prechillFlowRBV', this.actCtrlr3.openActCh2);
    ipcMain.handle('close-prechillFlowRBV', this.actCtrlr3.closeActCh2);
    ipcMain.handle('time-prechillFlowRBV', (val) => this.actCtrlr3.actCh2ms(val));

    ipcMain.handle('open-propanePrechillRBV', this.actCtrlr3.openActCh3);
    ipcMain.handle('close-propanePrechillRBV', this.actCtrlr3.closeActCh3);
    ipcMain.handle('time-propanePrechillRBV', (val) => this.actCtrlr3.actCh3ms(val));

    ipcMain.handle('open-purgeFlowRBV', this.actCtrlr3.openActCh4);
    ipcMain.handle('close-purgeFlowRBV', this.actCtrlr3.closeActCh4);
    ipcMain.handle('time-purgeFlowRBV', (val) => this.actCtrlr3.actCh4ms(val));

  }
}

module.exports = App;
