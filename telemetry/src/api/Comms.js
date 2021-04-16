import moment from 'moment';

const { ipcRenderer } = window;

class Comms {
  constructor(ipc) {
    this.subscribers = {};
    this.darkmodeListeners = [];
    this.ipc = ipc;
    this.stateUpdate = this.stateUpdate.bind(this);
    this.darkmodeUpdate = this.darkmodeUpdate.bind(this);

    this.openMainWindows = this.openMainWindows.bind(this);
    this.openAuxWindows = this.openAuxWindows.bind(this);

    this.connectInflux = this.connectInflux.bind(this);
    this.getDatabases = this.getDatabases.bind(this);
    this.setDatabase = this.setDatabase.bind(this);
    this.setDarkMode = this.setDarkMode.bind(this);


    this.getFlightConnected = this.getFlightConnected.bind(this);
    this.getDaq1Connected = this.getDaq1Connected.bind(this);
    this.getLinAct1Connected = this.getLinAct1Connected.bind(this);
    this.getLinAct2Connected = this.getLinAct2Connected.bind(this);
    this.getLinAct3Connected = this.getLinAct3Connected.bind(this);

    this.openLox2Way = this.openLox2Way.bind(this);
    this.closeLox2Way = this.closeLox2Way.bind(this);

    this.openLox5Way = this.openLox5Way.bind(this);
    this.closeLox5Way = this.closeLox5Way.bind(this);

    this.openProp5Way = this.openProp5Way.bind(this);
    this.closeProp5Way = this.closeProp5Way.bind(this);

    this.openLoxGems = this.openLoxGems.bind(this);
    this.closeLoxGems = this.closeLoxGems.bind(this);

    this.openPropGems = this.openPropGems.bind(this);
    this.closePropGems = this.closePropGems.bind(this);

    this.enableHPS = this.enableHPS.bind(this);
    this.disableHPS = this.disableHPS.bind(this);
    this.openHPS = this.openHPS.bind(this);
    this.closeHPS = this.closeHPS.bind(this);

    this.beginFlow = this.beginFlow.bind(this);
    this.abort = this.abort.bind(this);

    // GSE
    this.openPurgeFlowRBV = this.openPurgeFlowRBV.bind(this);
    this.closePurgeFlowRBV = this.closePurgeFlowRBV.bind(this);

    this.openPurgeRBV = this.openPurgeRBV.bind(this);
    this.closePurgeRBV = this.closePurgeRBV.bind(this);
  }

  stateUpdate(event, payload) {
    const { timestamp, update } = payload;
    const mTimestamp = moment(timestamp);
    for(let k of Object.keys(update)) {
      const subs = this.subscribers[k];
      if(subs !== undefined) {
        const val = update[k];
        for(let s of subs) {
          s(mTimestamp, val);
        }
      }
    }
  }

  addSubscriber(field, callback) {
    if(this.subscribers[field] === undefined) {
      this.subscribers[field] = [];
    }
    if(this.subscribers[field].indexOf(callback) === -1) {
      this.subscribers[field].push(callback);
    }
  }

  removeSubscriber(field, callback) {
    const index = this.subscribers[field].indexOf(callback);
    if(index === -1) return;
    this.subscribers[field].splice(index, 1);
  }

  addDarkModeListener(listener) {
    this.darkmodeListeners.push(listener);
  }

  darkmodeUpdate(event, isDark) {
    for(let l of this.darkmodeListeners) {
      l(isDark);
    }
  }

  removeDarkModeListener(listener) {
    const index = this.darkmodeListeners.indexOf(listener);
    if(index === -1) return;
    this.darkmodeListeners.splice(index, 1);
  }

  connect() {
    this.ipc.on('state-update', this.stateUpdate);
    this.ipc.on('set-darkmode', this.darkmodeUpdate);
  }

  destroy() {
    this.ipc.removeListener('state-update', this.stateUpdate);
  }

  async openMainWindows() { return await this.ipc.invoke('open-main-windows'); }
  async openAuxWindows() { return await this.ipc.invoke('open-aux-windows'); }

  async connectInflux(host, port, protocol, username, password) { return await this.ipc.invoke('connect-influx', host, port, protocol, username, password); }
  async getDatabases() { return await this.ipc.invoke('get-databases'); }
  async setDatabase(database) { return await this.ipc.invoke('set-database', database); }
  async setDarkMode(isDark) { return await this.ipc.invoke('set-darkmode', isDark); }

  async getFlightConnected() { return await this.ipc.invoke('flight-connected'); }
  async getDaq1Connected() { return await this.ipc.invoke('daq1-connected'); }
  async getLinAct1Connected() { return await this.ipc.invoke('linact1-connected'); }
  async getLinAct2Connected() { return await this.ipc.invoke('linact2-connected'); }
  async getLinAct3Connected() { return await this.ipc.invoke('linact3-connected'); }

  async openLox2Way() { return await this.ipc.invoke('open-lox2Way'); }
  async closeLox2Way() { return await this.ipc.invoke('close-lox2Way'); }

  async openLox5Way() { return await this.ipc.invoke('open-lox5Way'); }
  async closeLox5Way() { return await this.ipc.invoke('close-lox5Way'); }

  async openProp5Way() { return await this.ipc.invoke('open-prop5Way'); }
  async closeProp5Way() { return await this.ipc.invoke('close-prop5Way'); }

  async openLoxGems() { return await this.ipc.invoke('open-loxGems'); }
  async closeLoxGems() { return await this.ipc.invoke('close-loxGems'); }

  async openPropGems() { return await this.ipc.invoke('open-propGems'); }
  async closePropGems() { return await this.ipc.invoke('close-propGems'); }

  async enableHPS() { return await this.ipc.invoke('enable-HPS'); }
  async disableHPS() { return await this.ipc.invoke('disable-HPS'); }
  async openHPS() { return await this.ipc.invoke('open-HPS'); }
  async closeHPS() { return await this.ipc.invoke('close-HPS'); }

  async beginFlow() { return await this.ipc.invoke('begin-flow'); }
  async abort() { return await this.ipc.invoke('abort'); }

  // GSE
  async openPurgeFlowRBV() { return await this.ipc.invoke('open-purgeFlowRBV'); }
  async closePurgeFlowRBV() { return await this.ipc.invoke('close-purgeFlowRBV'); }
  
  async openPurgeRBV() { return await this.ipc.invoke('open-purgeRBV'); }
  async closePurgeRBV() { return await this.ipc.invoke('close-purgeRBV'); }
}

export default new Comms(ipcRenderer);
