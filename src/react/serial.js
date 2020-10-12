import { ipcRenderer } from "electron";

class Serial {
  constructor() {
    this.ipc = null;
  }
  
  /**
   * The IPC object allows the renderer process
   * (this one) to talk to the main process. This is
   * important, because only the main process can
   * access hardware like serial ports and the file
   * system.
   * @param {EventEmitter} ipc the ipc instance used to communicate with main process
   */
  setIPC = ipc => {
    this.ipc = ipc; // ipc instance used to communicate with main process
  }

  /**
   * @return {Array} a list of ports by name
   */
  listPorts = async () => {
    return await this.ipc.invoke('list-ports');
  }

  startDataListening = (handler) => {
    ipcRenderer.on('new-data', (event, data) => {
      handler(data);
    });
    ipcRenderer.send('start-data-listening');
  }

  selectPort = async (port, baud) => {
    return await this.ipc.invoke('open-port', port, baud);
  }

  writeData = async (data) => {
    return await this.ipc.invoke('serial-write', data);
  }
}

const instance = new Serial();

export default instance;
