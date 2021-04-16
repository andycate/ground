class State {
  constructor(model) {
    this._state = {};
    this.lastUpdate = Date.now();
    Object.assign(this._state, model);
  }

  updateState(timestamp, update) {
    Object.assign(this._state, update);
    this.lastUpdate = timestamp;
  }
}

module.exports = State;
