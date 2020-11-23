const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { Sequelize, DataTypes } = require('sequelize');

const homeDir = require('os').homedir();
const dataDir = path.join(homeDir, 'GroundStation');
if(!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir); // make data directory
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dataDir, 'database.sqlite'),
  logging: false
});
const DataRow = sequelize.define('DataRow', {
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fittingTreeTemperature: {
    type: DataTypes.FLOAT
  },
  fittingTreeHeater: {
    type: DataTypes.FLOAT
  },
  loxTank: {
    type: DataTypes.FLOAT
  },
  propTank: {
    type: DataTypes.FLOAT
  },
  loxInjector: {
    type: DataTypes.FLOAT
  },
  propInjector: {
    type: DataTypes.FLOAT
  },
  highPressure: {
    type: DataTypes.FLOAT
  },
  batteryVoltage: {
    type: DataTypes.FLOAT
  },
  wattage: {
    type: DataTypes.FLOAT
  },
  batteryAmperage: {
    type: DataTypes.FLOAT
  }
}, {
  timestamps: false
});
const ValveEvent = sequelize.define('ValveEvent', {
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  valve: {
    type: DataTypes.STRING,
    allowNull: false
  },
  event: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});
const Event = sequelize.define('Event', {
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.STRING
  }
}, {
  timestamps: false
});

sequelize.sync();

var recordingStream = null;
var recordingStart = null;

module.exports.handleSensorData = async data => {
  // record, etc
  const timestamp = moment(data.timestamp);
  const dataRow = await DataRow.create({
    ...data,
    timestamp
  });
  if(recordingStream) {
    const dataString = [
      timestamp.diff(recordingStart, 'seconds', true),
      dataRow.fittingTreeTemperature,
      dataRow.fittingTreeHeater,
      dataRow.loxTank,
      dataRow.propTank,
      dataRow.loxInjector,
      dataRow.propInjector,
      dataRow.highPressure,
      dataRow.batteryVoltage,
      dataRow.wattage,
      dataRow.batteryAmperage
    ].join(',');
    recordingStream.write(`${dataString}\n`);
  }
}

// state of valves
module.exports.handleValveEvent = async (name, state) => {
  const evt = await ValveEvent.create({
    timestamp: moment(),
    valve: name,
    event: (state?'open':'close')
  });
}

module.exports.startRecording = async name => {
  console.log('start recording')
  const dayDir = path.join(dataDir, moment().format('YYYY-MM-DD'));
  if(!fs.existsSync(dayDir)) {
    fs.mkdirSync(dayDir); // make data directory
  }
  const fileName = path.join(dayDir, `${name}_${moment().format('YYYY-MM-DD_HH-mm-ss')}.csv`);
  recordingStream = fs.createWriteStream(fileName);
  recordingStart = moment();
  const evt = await Event.create({
    timestamp: recordingStart,
    type: 'recording-start',
    value: name
  });
}

module.exports.stopRecording = () => {
  console.log('stop recording')
  if(recordingStream) {
    return new Promise((res) => {
      recordingStream.end(async () => {
        recordingStream = null;
        recordingStart = null;
        await Event.create({
          timestamp: moment(),
          type: 'recording-stop'
        });
        res();
      });
    });
  }
  return Promise.resolve();
}
