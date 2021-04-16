const { ipcMain } = require('electron');

const { model } = require('./config');

const State = require('./State');
const UdpPort = require('./UdpPort');
const FlightV2 = require('./FlightV2');
const DAQ = require('./DAQ');
const LinearActuator = require('./LinearActuator');
const InfluxDB = require('./InfluxDB');

class App {
  constructor() {
    this.webContents = [];
    this.state = new State(model);
    this.influxDB = new InfluxDB();

    // comms
    this.updateState = this.updateState.bind(this);
    this.port = new UdpPort('10.0.0.69', 42069, this.updateState);

    this.flightComputer = new FlightV2(this.port, '10.0.0.42');
    this.daq1 = new DAQ(this.port, '10.0.0.11', {});
    this.linAct1 = new LinearActuator(this.port, '10.0.0.21', {
      ch12v0Current: 'null',
      ch12v1Current: 'null',
      ch24v0Current: '',
      ch24v1Current: '',
      ch12v0State: 'null',
      ch12v1State: 'null',
      ch24v0State: '',
      ch24v1State: '',
      voltage: 'ac1Voltage',
      power: 'ac1Power',
      currentDraw: 'ac1CurrentDraw',
      act0Current: 'pressurantVentRBVcurrent',
      act1Current: 'pressurantFlowRBVcurrent',
      act2Current: 'LOxVentRBVcurrent',
      act3Current: 'LOxTankVentRBVcurrent',
      act4Current: 'LOxFlowRBVcurrent',
      act5Current: 'null',
      act6Current: 'null',
      ch0State: 'pressurantVentRBVchState',
      ch1State: 'pressurantFlowRBVchState',
      ch2State: 'LOxVentRBVchState',
      ch3State: 'LOxTankVentRBVchState',
      ch4State: 'LOxFlowRBVchState',
      ch5State: 'null',
      ch6State: 'null',
      act0State: 'pressurantVentRBVstate',
      act1State: 'pressurantFlowRBVstate',
      act2State: 'LOxVentRBVstate',
      act3State: 'LOxTankVentRBVstate',
      act4State: 'LOxFlowRBVstate',
      act5State: 'null',
      act6State: 'null'
    });
    this.linAct2 = new LinearActuator(this.port, '10.0.0.22', {
      ch12v0Current: 'null',
      ch12v1Current: 'null',
      ch24v0Current: '',
      ch24v1Current: '',
      ch12v0State: 'null',
      ch12v1State: 'null',
      ch24v0State: '',
      ch24v1State: '',
      voltage: 'ac2Voltage',
      power: 'ac2Power',
      currentDraw: 'ac2CurrentDraw',
      act0Current: 'LOxRQD1current',
      act1Current: 'LOxRQD2current',
      act2Current: 'propaneVentRBVcurrent',
      act3Current: 'propaneFlowRBVcurrent',
      act4Current: 'propaneRQD1current',
      act5Current: 'propaneRQD2current',
      act6Current: 'null',
      ch0State: 'LOxRQD1',
      ch1State: 'LOxRQD2',
      ch2State: 'propaneVentRBV',
      ch3State: 'propaneFlowRBV',
      ch4State: 'propaneRQD1',
      ch5State: 'propaneRQD2',
      ch6State: 'null',
      act0State: 'LOxRQD1state',
      act1State: 'LOxRQD2state',
      act2State: 'propaneVentRBVstate',
      act3State: 'propaneFlowRBVstate',
      act4State: 'propaneRQD1state',
      act5State: 'propaneRQD2state',
      act6State: 'null'
    });
    this.linAct3 = new LinearActuator(this.port, '10.0.0.23', {
      ch12v0Current: 'null',
      ch12v1Current: 'null',
      ch24v0Current: '',
      ch24v1Current: '',
      ch12v0State: 'null',
      ch12v1State: 'null',
      ch24v0State: '',
      ch24v1State: '',
      voltage: 'ac3Voltage',
      power: 'ac3Power',
      currentDraw: 'ac3CurrentDraw',
      act0Current: 'LOxPrechillRBVcurrent',
      act1Current: 'purgePrechillVentRBVcurrent',
      act2Current: 'prechillFlowRBVcurrent',
      act3Current: 'propanePrechillRBVcurrent',
      act4Current: 'purgeFlowRBVcurrent',
      act5Current: 'null',
      act6Current: 'null',
      ch0State: 'LOxPrechillRBV',
      ch1State: 'purgePrechillVentRBV',
      ch2State: 'prechillFlowRBV',
      ch3State: 'propanePrechillRBV',
      ch4State: 'purgeFlowRBV',
      ch5State: 'null',
      ch6State: 'null',
      act0State: 'LOxPrechillRBVstate',
      act1State: 'purgePrechillVentRBVstate',
      act2State: 'prechillFlowRBVstate',
      act3State: 'propanePrechillRBVstate',
      act4State: 'purgeFlowRBVstate',
      act5State: 'null',
      act6State: 'null'
    });

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

  /**
   * When a window is created, register it's webContents object so we can send
   * state updates to that window
   *
   * @param {Object} webContents
   */
  addWebContents(webContents) {
    this.webContents.push(webContents);
  }

  /**
   * Sets up all the IPC commands that the windows have access to
   */
  setupIPC() {
    ipcMain.handle('connect-influx', (e, host, port, protocol, username, password) => this.influxDB.connect(host, port, protocol, username, password));
    ipcMain.handle('get-databases', this.influxDB.getDatabaseNames);
    ipcMain.handle('set-database', (e, database) => this.influxDB.setDatabase(database));


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
  }
}

module.exports = App;
