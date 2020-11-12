const { ipcMain } = require('electron');
const { EventEmitter } = require('events');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const moment = require('moment');
const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const app = express();

const { config, getPacketConfig } = require('./config');

class Comms {
  constructor() {
    this.state = {
      port: null,
      portSelected: null,
      open: false,
      connected: false,
      connTimeout: null,
      bandwidth: 0, // bits per second
      sensors: { // For web server
        loxTank: 0,
        propTank: 0,
        loxInjector: 0,
        propInjector: 0,
        highPressure: 0,
        battery: 0,
        wattage: 0
      }
    };
    // TODO: add code to transmit ping and wait for pong
    this.connEvents = new EventEmitter();
    this.sensorEvents = new EventEmitter();
  }

  init = () => {
    app.use(serveStatic(path.join(__dirname, 'viewer'), { 'index': ['index.html'] }));
    app.get('/sensors', (req, res) => {
      res.send(this.state.sensors);
    });
    this.sensorEvents.on('data', data => {
      switch(data.idx) {
        case 0:
          this.state.sensors.loxTank = data.values[0];
          break;
        case 1:
          this.state.sensors.propTank = data.values[0];
          break;
        case 2:
          this.state.sensors.loxInjector = data.values[0];
          break;
        case 3:
          this.state.sensors.propInjector = data.values[0];
          break;
        case 4:
          this.state.sensors.highPressure = data.values[0];
          break;
        case 5:
          this.state.sensors.battery = data.values[0];
          this.state.sensors.wattage = data.values[1];
          break;
      }
    });
    app.listen(3001, '0.0.0.0');




    this.packetConfig = getPacketConfig();
    console.log(this.packetConfig);

    this.receivedPacket = true;
    this.connectionInterval = setInterval(() => {
      if(!this.receivedPacket) {
        if(this.state.connected) {
          this.connEvents.emit('disconnect');
        }
        this.state.connected = false;
      }
      this.receivedPacket = false;
    }, 1000);

    ipcMain.handle('get-config', (event) => {
      return config;
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

  parsePacket = rawData => {
    const data = rawData.replace(/(\r\n|\n|\r)/gm, '');
    if(data.substring(0, 1) === '{') { // data packet
      if(!this.state.connected) {
        this.connEvents.emit('connect');
        this.state.connected = true;
      }
      this.receivedPacket = true;
      const [ rawValues, checksum ] = data.replace(/({|})/gm, '').split('|');
      const [ id, ...values ] = rawValues.split(',').map(v => parseFloat(v));
      const calculatedChecksum = this.fletcher16(Buffer.from(rawValues, 'binary'));
      if(parseInt(Number('0x' + checksum), 10) !== calculatedChecksum) {
        console.log(`Checksums don't match! Message: ${data} Checksum: ${calculatedChecksum}`);
        return null;
      }
      return {
        id,
        values
      };
    }
    return null;
  }

  processData = rawData => {
    this.bandwidthCounter += rawData.length * 8 + 3 // 8 bits per byte plus one start bit and two stop bits
    const timestamp = moment().toJSON();
    const packet = this.parsePacket(rawData);
    if(!packet) { // packet is not data or is invalid
      return;
    }
    if(!this.packetConfig[packet.id]) { // if no config exists for this packet, we don't know about it
      return;
    }
    this.packetConfig[packet.id].forEach(idx => {
      const sensor = config.sensors[idx]; // get sensor that is associated with this packet
      const payload = {
        idx,
        timestamp,
        values: sensor.values.map(v => {
          if(!packet.values[v.packetPosition]) return NaN; // sonetimes packets have sensors with different read frequencies
          switch(v.interpolation.type) {
            case "none":
              return packet.values[v.packetPosition];
            case "linear":
              return this.linearInterpolate(packet.values[v.packetPosition], v.interpolation.values);
            default:
              return packet.values[v.packetPosition];
          }
        })
      };
      this.sensorEvents.emit('data', payload);
    });
  }

  linearInterpolate = (rawValue, map) => {
    var index = 0;
    if(map[map.length-1][0] < rawValue) {
      index = map.length-2;
    } else if(map[0][0] > rawValue) {
      return map[0][1];
    } else {
      index = map.findIndex((v, i) => {
        return v[0] <= rawValue && map[i+1][0] >= rawValue;
      });
    }
    return map[index][1] + (map[index+1][1] - map[index][1]) * ((rawValue - map[index][0]) / (map[index+1][0] - map[index][0]));
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
