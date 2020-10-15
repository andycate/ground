const { ipcMain } = require('electron');
const { EventEmitter } = require('events');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const moment = require('moment');

const config = require('./config');

let state = {
  port: null,
  open: false,
  connected: false,
  connTimeout: null
};

// TODO: add code to transmit ping and wait for pong
const connEvents = new EventEmitter();
connEvents.on('ping', () => {
  if(!state.connected) {
    connEvents.emit('connect');
  }
  clearTimeout(state.connTimeout);
  state.connTimeout = setTimeout(() => {
    state.connected = false;
    connEvents.emit('disconnect');
  }, 2000);
  state.connected = true;
});

const sensorEvents = new EventEmitter();

function fletcher16(data) {
  var a = 0, b = 0;
  for (var i = 0; i < data.length; i++) {
      a = (a + data[i]) % 255;
      b = (b + a) % 255;
  }
  return a | (b << 8);
}

const processData = rawData => {
  const timestamp = moment().toJSON();
  const data = rawData.replace(/(\r\n|\n|\r)/gm, '');
  if(data === 'ping') {
    connEvents.emit('ping');
  }
  if(!state.connected) {
    return;
  }
  if(data.substring(0, 1) === '{') { // data packet
    const [ rawValues, checksum ] = data.replace(/({|})/gm, '').split('|');
    const [ id, ...values ] = rawValues.split(',').map(v => parseFloat(v));
    const calculatedChecksum = fletcher16(Buffer.from(rawValues, 'binary'));
    if(parseInt(checksum) !== calculatedChecksum) {
      console.log(`Checksums don't match! Message: ${data} Checksum: ${calculatedChecksum}`);
      return;
    }
    const sensorConf = config.sensors.find(v => v.id === id);
    if(!sensorConf) {
      return;
    }
    const payload = {
      id: id,
      data: values,
      timestamp
    };
    sensorEvents.emit('data', payload);
  }
}

ipcMain.handle('list-ports', async (event) => {
  const ports = await SerialPort.list();
  return ports;
});

ipcMain.handle('select-port', async (event, port, baud) => {
  console.log(port);
  console.log(baud);
  state.port = new SerialPort(port, {
    baudRate: baud,
    autoOpen: false
  });
  state.open = await new Promise((res, rej) => {
    state.port.open((err) => {
      if (err) {
        console.error(`Error opening port ${port}`);
        console.error(err);
        res(false);
      }
      const parser = new Readline();
      state.port.pipe(parser);
      parser.on('data', processData);
      console.log('Port opened!');
      res(true);
    });
  });
  return state.open;
});

ipcMain.on('start-conn-listening', (event) => {
  connEvents.on('connect', () => {
    console.log('Connected!');
    event.reply('connect');
  });
  connEvents.on('disconnect', () => {
    console.log('Disconnected!');
    event.reply('disconnect');
  });
});

ipcMain.on('start-sensor-listening', (event) => {
  console.log('start sensors');
  sensorEvents.on('data', data => {
    event.reply('sensor-data', data);
  });
});

// ipcMain.handle('serial-write', async (event, data) => {
//   try {
//     await state.port.write(data);
//     return true;
//   } catch(err) {
//     console.error(`error writing data ${data} to the serial port`);
//     console.error(err);
//     return false;
//   }
// });
