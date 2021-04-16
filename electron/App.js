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
    this.sendDarkModeUpdate = this.sendDarkModeUpdate.bind(this);
    this.port = new UdpPort('0.0.0.0', 42069, this.updateState);

    this.flightComputer = new FlightV2(this.port,
                                       '10.0.0.42',
                                       () => this.updateState(Date.now(), { flightConnected: true }),
                                       () => this.updateState(Date.now(), { flightConnected: false }),
                                       (rate) => this.updateState(Date.now(), { flightKbps: rate }));
    this.daq1 = new DAQ(this.port,
                        '10.0.0.11',
                        {},
                        () => this.updateState(Date.now(), { daq1Connected: true }),
                        () => this.updateState(Date.now(), { daq1Connected: false }),
                        (rate) => this.updateState(Date.now(), { daq1Kbps: rate }));
    this.linAct1 = new LinearActuator(this.port,
                                      '10.0.0.21',
                                      {},
                                      () => this.updateState(Date.now(), { linAct1Connected: true }),
                                      () => this.updateState(Date.now(), { linAct1Connected: false }),
                                      (rate) => this.updateState(Date.now(), { linAct1Kbps: rate }));
    this.linAct2 = new LinearActuator(this.port,
                                      '10.0.0.22',
                                      {},
                                      () => this.updateState(Date.now(), { linAct2Connected: true }),
                                      () => this.updateState(Date.now(), { linAct2Connected: false }),
                                      (rate) => this.updateState(Date.now(), { linAct2Kbps: rate }));
    this.linAct3 = new LinearActuator(this.port,
                                      '10.0.0.23',
                                      {},
                                      () => this.updateState(Date.now(), { linAct3Connected: true }),
                                      () => this.updateState(Date.now(), { linAct3Connected: false }),
                                      (rate) => this.updateState(Date.now(), { linAct3Kbps: rate }));

    this.abort = this.abort.bind(this);

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

  /**
   * Sets up all the IPC commands that the windows have access to
   */
  setupIPC() {
    ipcMain.handle('connect-influx', (e, host, port, protocol, username, password) => this.influxDB.connect(host, port, protocol, username, password));
    ipcMain.handle('get-databases', this.influxDB.getDatabaseNames);
    ipcMain.handle('set-database', (e, database) => this.influxDB.setDatabase(database));
    ipcMain.handle('set-darkmode', (e, isDark) => this.sendDarkModeUpdate(isDark));


    ipcMain.handle('flight-connected', () => this.flightComputer.isConnected);
    ipcMain.handle('daq1-connected', () => this.daq1.isConnected);
    ipcMain.handle('linact1-connected', () => this.linAct1.isConnected);
    ipcMain.handle('linact2-connected', () => this.linAct2.isConnected);
    ipcMain.handle('linact3-connected', () => this.linAct3.isConnected);

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
  }
}

module.exports = App;
