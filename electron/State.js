const moment = require('moment');

class State {
  constructor(model) {
    this._state = {};
    this.lastUpdate = moment();
    Object.assign(this._state, model);
  }

  updateState(timestamp, update) {
    Object.assign(this._state, update);
    this.lastUpdate = timestamp;
  }
}

module.exports = State;
