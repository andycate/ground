const Influx = require('influx');

class InfluxDB {
  constructor() {
    this.influx = null;
    this.database = null;
    this.tags = {
      recording: null,
      procedureStep: null,
    };

    this.connect = this.connect.bind(this);
    this.getDatabaseNames = this.getDatabaseNames.bind(this);
    this.setDatabase = this.setDatabase.bind(this);
    this.setRecording = this.setRecording.bind(this);
    this.clearRecording = this.clearRecording.bind(this);
    this.setProcedureStep = this.setProcedureStep.bind(this);
    this.clearProcedureStep = this.clearProcedureStep.bind(this);
    this.handleStateUpdate = this.handleStateUpdate.bind(this);
  }

  connect(host, port, protocol, username, password) {
    this.influx = new Influx.InfluxDB({
      host,
      port,
      protocol,
      username,
      password,
    });
  }

  async getDatabaseNames() {
    return await this.influx.getDatabaseNames();
  }

  setDatabase(database) {
    this.database = database;
  }

  setRecording(name) {
    this.tags.recording = name;
  }

  clearRecording() {
    this.tags.recording = null;
  }

  setProcedureStep(step) {
    this.tags.procedureStep = step;
  }

  clearProcedureStep() {
    this.tags.procedureStep = null;
  }

  async handleStateUpdate(timestamp, update) {
    if(this.influx === null) return;
    if(this.database === null) return;
    const points = [];
    for(let k of Object.keys(update)) {
      points.push({
        measurement: k,
        tags: this.tags,
        fields: { value: update[k] },
        timestamp: timestamp
      });
    }
    return await this.influx.writePoints(points, { database: this.database, precision: 'ms' });
  }
}

module.exports = InfluxDB;
