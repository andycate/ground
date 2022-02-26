const { app, BrowserWindow, ipcMain, globalShortcut, TouchBar } = require('electron');
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');

const App = require('./App');

const isMainDev = (process.env.VARIANT === 'main');

let backendApp = new App();
let selector, window1, window2;
function createWindow (isMain) {
  let url1, url2;
  if(isMain) {
    // main windows
    url1 = (isDev ? 'http://127.0.0.1:3000#/main' : `file://${path.join(__dirname, '../index.html#main')}`);
    url2 = (isDev ? 'http://127.0.0.1:3000#/control' : `file://${path.join(__dirname, '../index.html#control')}`);
  } else {
    // aux windows
    url1 = (isDev ? 'http://127.0.0.1:3000#/aux1' : `file://${path.join(__dirname, '../index.html#aux1')}`);
    url2 = (isDev ? 'http://127.0.0.1:3000#/aux2' : `file://${path.join(__dirname, '../index.html#aux2')}`);
  }

  // TouchBar Start

  let selection = 'MainValves'
  let selectionState = 'Closed'
  const update = (text) => {
    if (text == 'Open') {
      stateText.label = 'Open  ';
      stateText.textColor = '#6ab04c';
    }
    if (text == 'Closed') {
      stateText.label = text;
      stateText.textColor = '#E25241';
    }
    backendApp.commandFuncs['open-loxFillRBV']();
  };
  const abortButton = new TouchBarButton({
    label: '‎                   ABORT                   ‎',
    accessibilityLabel: 'Abort',
    backgroundColor: '#E25241',
    click: () => { backendApp.abort(); }
  });
  const selectionText = new TouchBarLabel({
    label: `${selection}:`
  });
  const stateText = new TouchBarLabel({
    label: 'Closed',
    textColor: '#E25241'
  });
  const openButton = new TouchBarButton({
    label: 'Open',
    accessibilityLabel: 'Counter',
    backgroundColor: '#6ab04c',
    click: () => { update('Open'); }
  });
  const closeButton = new TouchBarButton({
    label: 'Close',
    accessibilityLabel: 'Counter',
    backgroundColor: '#E25241',
    click: () => { update('Closed'); }
  });
  const touchBar = new TouchBar({
  items: [
    abortButton, 
    new TouchBarSpacer({size: 'large'}),
    selectionText,
    stateText,
    new TouchBarSpacer({size: 'medium'}),
    openButton,
    closeButton,
  ], 
  });
  
  // TouchBar End

  window1 = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev,
    },
  });
  window1.maximize();
  if(!isDev) {
    window1.removeMenu();
  }
  window1.loadURL(url1);
  window1.setTouchBar(touchBar)
  window1.on('closed', function () {
    backendApp.removeWebContents(window1.webContents);
    window1 = null;
  });
  window1.webContents.once('did-finish-load', () => {
    backendApp.addWebContents(window1.webContents);
    if(backendApp.webContents.length === 2){
      backendApp.initApp()
    }
  });
  window1.once('ready-to-show', () => {
    window1.show();
  });

  window2 = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev,
    },
  });
  window2.maximize();
  if(!isDev) {
    window2.removeMenu();
  }
  window2.loadURL(url2);
  window2.setTouchBar(touchBar)
  window2.on('closed', function () {
    window2 = null;
  });
  window2.webContents.once('did-finish-load', () => {
    backendApp.addWebContents(window2.webContents);
    if(backendApp.webContents.length === 2){
      backendApp.initApp()
    }
  });
  window2.once('ready-to-show', () => {
    window2.show();
  });
}

function createSelectorWindow() {
  let selectorUrl = (isDev ? 'http://127.0.0.1:3000#/selector' : `file://${path.join(__dirname, '../index.html#selector')}`);
  selector = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev,
    },
  });
  selector.setSize(200, 100);
  selector.center();
  selector.setTitle('Selector');
  // selector.maximize();
  if(!isDev) {
    selector.removeMenu();
  }
  selector.loadURL(selectorUrl);
  selector.on('closed', function () {
    selector = null;
  });
  // selector.webContents.once('did-finish-load', () => {
  //   backendApp.addWebContents(selector.webContents);
  // });
  selector.once('ready-to-show', () => {
    selector.show();
  });

  ipcMain.handleOnce('open-main-windows', (e) => {
    selector.close();
    createWindow(true);
  });
  ipcMain.handleOnce('open-aux-windows', (e) => {
    selector.close();
    createWindow(false);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs
app.on('ready', () => {
  // createSelectorWindow();
  const ret = globalShortcut.register('F17', () => {
    backendApp.abort();
  })

  if(isDev) {
    createWindow(isMainDev);
  } else {
    createSelectorWindow();
  }
});


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  console.log('quitting');
  backendApp.removeWebContents(window1.webContents);
  backendApp.removeWebContents(window2.webContents);
});

ipcMain.handle('app-info', async (event) => {
  return {
    appName: app.getName(),
    appVersion: app.getVersion(),
  };
});
