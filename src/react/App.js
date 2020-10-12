import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import serial from './serial';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Form, Modal, Button } from 'react-bootstrap';

const { ipcRenderer } = window;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ports: [],
      portSelected: '',
      showPortSelect: true,
      opening: false,
      success: null
    };
    serial.setIPC(ipcRenderer); // pass the IPC instance to serial
  }
  componentDidMount = async () => {
    const { appName, appVersion } = await ipcRenderer.invoke('app-info');
    const ports = await ipcRenderer.invoke('list-ports');
    this.setState({ appName, appVersion, ports });
  }
  openPort = async () => {
    this.setState({opening: true});
    const success = await serial.selectPort(this.state.portSelected, 115200);
    this.setState({ success, opening: false, showPortSelect: false });
    if(!success) {
      alert('unsuccessful!');
    }
  }
  render() {
    const { appName, appVersion, ports } = this.state;
    console.log(ports);
    return (
      <div className="App">
        {/* <Modal show={this.state.showPortSelect}>
          <Modal.Body>
            <Form>
              <Form.Control as='select' value={this.state.portSelected}>
                {this.state.ports.map((v, i) => (
                  <option value={v} key={i}>{v}</option>
                ))}
              </Form.Control>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={!this.state.portSelected || this.state.opening} onClick={this.openPort}>Ok</Button>
          </Modal.Footer>
        </Modal> */}
      </div>
    );
  }
}
