const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');
const comms = require('./comms');
comms.init();

let mainWindow;
function createWindow () {
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true,
  });
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // worldSafeExecuteJavaScript: true,
      // contextIsolation: true
    },
  });
  mainWindow.maximize();
  if(!isDev) {
    mainWindow.removeMenu();
  }
  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.webContents.on('did-finish-load', () => {
    comms.openWebCon(mainWindow.webContents);
  });
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('app-info', async (event) => {
  return {
    appName: app.getName(),
    appVersion: app.getVersion(),
  };
});
