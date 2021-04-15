const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');

const App = require('./App');

const isMain = (process.env.VARIANT === 'main');

let backendApp = new App();
let window1, window2;
function createWindow () {
  let url1, url2;
  if(isMain) {
    // main windows
    url1 = (isDev ? 'http://127.0.0.1:3000#/main' : url.format({
      pathname: path.join(__dirname, '../index.html'),
      hash: '/main',
      protocol: 'file:',
      slashes: true,
    }));
    url2 = (isDev ? 'http://127.0.0.1:3000#/control' : url.format({
      pathname: path.join(__dirname, '../index.html'),
      hash: '/control',
      protocol: 'file:',
      slashes: true,
    }));
  } else {
    // aux windows
    url1 = (isDev ? 'http://127.0.0.1:3000#/aux1' : url.format({
      pathname: path.join(__dirname, '../index.html'),
      hash: '/aux1',
      protocol: 'file:',
      slashes: true,
    }));
    url2 = (isDev ? 'http://127.0.0.1:3000#/aux2' : url.format({
      pathname: path.join(__dirname, '../index.html'),
      hash: '/aux2',
      protocol: 'file:',
      slashes: true,
    }));
  }

  window1 = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  window1.maximize();
  if(!isDev) {
    window1.removeMenu();
  }
  window1.loadURL(url1);
  window1.on('closed', function () {
    window1 = null;
  });
  window1.webContents.once('did-finish-load', () => {
    backendApp.addWebContents(window1.webContents);
  });
  window1.once('ready-to-show', () => {
    window1.show();
  });

  window2 = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  window2.maximize();
  if(!isDev) {
    window2.removeMenu();
  }
  window2.loadURL(url2);
  window2.on('closed', function () {
    window2 = null;
  });
  window2.webContents.once('did-finish-load', () => {
    backendApp.addWebContents(window2.webContents);
  });
  window2.once('ready-to-show', () => {
    window2.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs
app.on('ready', createWindow);


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (window1 === null) {
    createWindow();
  }
});

ipcMain.handle('app-info', async (event) => {
  return {
    appName: app.getName(),
    appVersion: app.getVersion(),
  };
});
