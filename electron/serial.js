const { ipcMain } = require('electron');
const SerialPort = require('serialport');

let state = {
  port: null,
  open: false
};

ipcMain.handle('list-ports', async (event) => {
  const ports = await SerialPort.list();
  return ports;
});

ipcMain.handle('open-port', async (event, port, baud) => {
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
      res(true);
    });
  });
  return state.open;
});

ipcMain.on('start-data-listening', (event) => {
  state.port.on('data', (data) => {
    event.reply('new-data', data);
  });
});

ipcMain.handle('serial-write', async (event, data) => {
  try {
    await state.port.write(data);
    return true;
  } catch(err) {
    console.error(`error writing data ${data} to the serial port`);
    console.error(err);
    return false;
  }
});
