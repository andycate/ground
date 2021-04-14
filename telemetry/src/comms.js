import moment from 'moment';

const { ipcRenderer } = window;

class Comms {
  constructor(ipc) {
    console.log('make comm');
    this.subscribers = {};
    this.ipc = ipc;
    this.stateUpdate = this.stateUpdate.bind(this);


    this.connectInflux = this.connectInflux.bind(this);
    this.getDatabases = this.getDatabases.bind(this);
    this.setDatabase = this.setDatabase.bind(this);


    this.openLox2Way = this.openLox2Way.bind(this);
    this.closeLox2Way = this.closeLox2Way.bind(this);

    this.openLox5Way = this.openLox5Way.bind(this);
    this.closeLox5Way = this.closeLox5Way.bind(this);

    this.openProp5Way = this.openProp5Way.bind(this);
    this.closeProp5Way = this.closeProp5Way.bind(this);

    this.openLoxGems = this.openLoxGems.bind(this);
    this.closeLoxGems = this.closeLoxGems.bind(this);

    this.enableHPS = this.enableHPS.bind(this);
    this.disableHPS = this.disableHPS.bind(this);
    this.openHPS = this.openHPS.bind(this);
    this.closeHPS = this.closeHPS.bind(this);
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
    this.subscribers[field].push(callback);
  }

  removeSubscriber(field, callback) {
    const index = this.subscribers[field].indexOf(callback);
    if(index === -1) return;
    this.subscribers[field].splice(index, 1);
  }

  connect() {
    this.ipc.on('state-update', this.stateUpdate);
  }

  destroy() {
    this.ipc.removeListener('state-update', this.stateUpdate);
  }

  async connectInflux(host, port, protocol, username, password) { return await this.ipc.invoke('connect-influx', host, port, protocol, username, password); }
  async getDatabases() { return await this.ipc.invoke('get-databases'); }
  async setDatabase(database) { return await this.ipc.invoke('set-database', database); }

  async openLox2Way() { return await this.ipc.invoke('open-lox2Way'); }
  async closeLox2Way() { return await this.ipc.invoke('close-lox2Way'); }

  async openLox5Way() { return await this.ipc.invoke('open-lox5Way'); }
  async closeLox5Way() { return await this.ipc.invoke('close-lox5Way'); }

  async openProp5Way() { return await this.ipc.invoke('open-prop5Way'); }
  async closeProp5Way() { return await this.ipc.invoke('close-prop5Way'); }

  async openLoxGems() { return await this.ipc.invoke('open-loxGems'); }
  async closeLoxGems() { return await this.ipc.invoke('close-loxGems'); }

  async enableHPS() { return await this.ipc.invoke('enable-HPS'); }
  async disableHPS() { return await this.ipc.invoke('disable-HPS'); }
  async openHPS() { return await this.ipc.invoke('open-HPS'); }
  async closeHPS() { return await this.ipc.invoke('close-HPS'); }
}

export default new Comms(ipcRenderer);
