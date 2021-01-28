const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Influx = require('influx');

let selectedDb;
let influxLocal;

const homeDir = require('os').homedir();
const dataDir = path.join(homeDir, 'GroundStation');
if(!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir); // make data directory
}

var recordingName = null;
var recordingStream = null;
var recordingStart = null;

module.exports.getSelectedInfluxDB = () => {
  return selectedDb;
}

module.exports.initInfluxLocal = async (db) => {
  influxLocal = new Influx.InfluxDB({
    host: 'influx.andycate.com',
    database: db,
    // schema: []
    protocol: 'https',
    username: '',
    password: '',
    port: 443
  });
  selectedDb = db;
}

module.exports.handleSensorData = async data => {
  // record, etc
  const timestamp = moment(data.timestamp);
  try {
    await influxLocal.writePoints(Object.keys(data.values).map(k => (
      {
        measurement: k,
        tags: {recording: recordingName, type: 'sensor'},
        fields: {value: data.values[k]},
        timestamp: timestamp.toDate()
      }
    )));
  } catch(err) {
    console.error(err);
  }
  if(recordingStream) {
    const dataString = [
      timestamp.diff(recordingStart, 'seconds', true),
      data.values.fittingTreeTemperature,
      data.values.fittingTreeHeater,
      data.values.loxTank,
      data.values.propTank,
      data.values.loxInjector,
      data.values.propInjector,
      data.values.highPressure,
      data.values.batteryVoltage,
      data.values.wattage,
      data.values.batteryAmperage,
      data.values.cryoLoxTank,
      data.values.cryoInj1,
      data.values.cryoInj2,
      data.values.auxTherm
    ].join(',');
    recordingStream.write(`${dataString}\n`);
  }
}

// state of valves
module.exports.handleValveEvent = async (name, state) => {
  await influxLocal.writePoints([
    {
      measurement: name,
      tags: {recording: recordingName, type: 'valve', event: (state?'open':'close')},
      fields: {value: (state?1:0)},
      timestamp: moment().toDate()
    }
  ]);
}

module.exports.startRecording = async name => {
  console.log('start recording');
  const dayDir = path.join(dataDir, moment().format('YYYY-MM-DD'));
  if(!fs.existsSync(dayDir)) {
    fs.mkdirSync(dayDir); // make data directory
  }
  const fileName = path.join(dayDir, `${name}_${moment().format('YYYY-MM-DD_HH-mm-ss')}.csv`);
  recordingName = name;
  recordingStream = fs.createWriteStream(fileName);
  recordingStart = moment();
}

module.exports.stopRecording = () => {
  console.log('stop recording');
  if(recordingStream) {
    return new Promise((res) => {
      recordingStream.end(async () => {
        recordingName = null;
        recordingStream = null;
        recordingStart = null;
        res();
      });
    });
  }
  return Promise.resolve();
}
