const { ipcMain } = require('electron');

const { model } = require('../shared/config');

const State = require('./State');
const UdpPort = require('./UdpPort');
const FlightV2 = require('./FlightV2');
const DAQ = require('./DAQ');
const LinearActuator = require('./LinearActuator');

class App {
  constructor() {
    this.webContents = [];
    this.state = new State(model);

    // comms
    this.updateState = this.updateState.bind(this);
    this.port = new UdpPort('10.0.0.69', 42069, this.updateState);

    this.flightComputer = new FlightV2(this.port, '10.0.0.42');
    this.daq1 = new DAQ(this.port, '10.0.0.11');
    this.linAct1 = new LinearActuator(this.port, '10.0.0.21');
    this.linAct2 = new LinearActuator(this.port, '10.0.0.22');
    this.linAct3 = new LinearActuator(this.port, '10.0.0.23');
  }

  /**
   * Takes in an update to the state and sends it where it needs to go
   * 
   * @param {Object} update 
   */
  updateState(timestamp, update) {
    this.state.updateState(timestamp, update);
    this.sendStateUpdate(timestamp, update);
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
        timestamp: timestamp.toJSON(),
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
