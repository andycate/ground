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
    this.flightComputer = new FlightV2();
    this.daq1 = new DAQ();
    this.daq2 = new DAQ();
    this.linAct1 = new LinearActuator();
    this.linAct2 = new LinearActuator();
    this.linAct3 = new LinearActuator();
    this.updateState = this.updateState.bind(this);
    this.port = new UdpPort('10.0.0.69', 42069, {
      '10.0.0.42': this.flightComputer,
      '10.0.0.11': this.daq1,
      '10.0.0.12': this.daq2,
      '10.0.0.21': this.linAct1,
      '10.0.0.22': this.linAct2,
      '10.0.0.23': this.linAct3,
    }, this.updateState);
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

  addWebContents(webContents) {
    this.webContents.push(webContents);
  }
}

module.exports = App;
