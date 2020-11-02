const { ipcMain } = require('electron');
const { EventEmitter } = require('events');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const moment = require('moment');

const config = require('./config');

class Comms {
  constructor() {
    this.state = {
      port: null,
      portSelected: null,
      open: false,
      connected: true,
      connTimeout: null,
      bandwidth: 0, // bits per second
    };
    // TODO: add code to transmit ping and wait for pong
    this.connEvents = new EventEmitter();
    this.sensorEvents = new EventEmitter();
  }

  init = () => {

    this.connEvents.on('ping', () => {
      if(!this.state.connected) {
        this.connEvents.emit('connect');
      }
      clearTimeout(this.state.connTimeout);
      this.state.connTimeout = setTimeout(() => {
        this.state.connected = false;
        this.connEvents.emit('disconnect');
      }, 2000);
      this.state.connected = true;
    });

    ipcMain.handle('list-ports', async (event) => {
      return await SerialPort.list();
    });

    ipcMain.handle('get-connected', async (event) => {
      return this.state.connected;
    });

    ipcMain.handle('get-port', async (event) => {
      return this.state.portSelected;
    });

    ipcMain.handle('select-port', async (event, port, baud) => {
      console.log(port.path);
      console.log(baud);
      this.state.portSelected = port;
      this.state.port = new SerialPort(port.path, {
        baudRate: baud,
        autoOpen: false
      });
      this.state.open = await new Promise((res, rej) => {
        this.state.port.open((err) => {
          if (err) {
            console.error(`Error opening port ${port.path}`);
            console.error(err);
            res(false);
          }
          this.parser = new Readline();
          this.state.port.pipe(this.parser);
          this.parser.on('data', this.processData);
          console.log('Port opened!');
          res(true);
        });
      });
      return this.state.open;
    });
  }

  openWebCon = (webCon) => {
    console.log('web connection');
    this.webCon = webCon;

    this.connEvents.on('connect', () => {
      console.log('Connected!');
      this.webCon.send('connect');
    });
    this.connEvents.on('disconnect', () => {
      console.log('Disconnected!');
      this.webCon.send('disconnect');
    });

    this.sensorEvents.on('data', data => {
      this.webCon.send('sensor-data', data);
    });

    this.bandwidthCounter = 0;
    this.bandwidthInterval = setInterval(() => {
      this.state.bandwidth = this.bandwidthCounter;
      this.bandwidthCounter = 0;
      this.webCon.send('bandwidth', this.state.bandwidth);
    }, 1000);
  }

  processData = rawData => {
    this.bandwidthCounter += rawData.length * 8 + 3 // 8 bits per byte plus one start bit and two stop bits
    const timestamp = moment().toJSON();
    const data = rawData.replace(/(\r\n|\n|\r)/gm, '');
    if(data === 'ping') {
      this.connEvents.emit('ping');
    }
    if(!this.state.connected) {
      return;
    }
    if(data.substring(0, 1) === '{') { // data packet
      const [ rawValues, checksum ] = data.replace(/({|})/gm, '').split('|');
      const [ id, ...values ] = rawValues.split(',').map(v => parseFloat(v));
      const calculatedChecksum = this.fletcher16(Buffer.from(rawValues, 'binary'));
      if(parseInt(Number('0x' + checksum), 10) !== calculatedChecksum) {
        console.log(`Checksums don't match! Message: ${data} Checksum: ${calculatedChecksum}`);
        return;
      }
      // const sensorConf = config.sensors.find(v => v.id === id);
      // if(!sensorConf) {
      //   return;
      // }
      const payload = {
        id: id,
        data: values,
        timestamp
      };
      this.sensorEvents.emit('data', payload);
    }
  }

  fletcher16 = (data) => {
    var a = 0, b = 0;
    for (var i = 0; i < data.length; i++) {
        a = (a + data[i]) % 255;
        b = (b + a) % 255;
    }
    return a | (b << 8);
  }
}

module.exports = new Comms();
