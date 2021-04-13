import moment from 'moment';

class Comms {
  constructor(ipc) {
    this.subscribers = {};
    this.ipc = ipc;
    this.stateUpdate = this.stateUpdate.bind(this);
    this.ipc.on('state-update', this.stateUpdate);
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
    this.subscribers.splice(index, 1);
  }
}

export default Comms;
