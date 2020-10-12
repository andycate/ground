import React, { Component } from 'react';
import './App.css';
import serial from './serial';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Form, Button } from 'react-bootstrap';

const { ipcRenderer } = window;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ports: [],
      portSelected: '',
      showPortSelect: true,
      opening: false,
      success: null,
      messages: []
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
    const success = await serial.selectPort(this.state.portSelected, 9600);
    this.setState({ success, opening: false, showPortSelect: false });
    if(!success) {
      alert('unsuccessful!');
    } else {
      serial.startDataListening(data => {
        this.setState({messages: [...this.state.messages, data]});
      });
      window.setInterval(() => {
        serial.writeData('hello')
      }, 1000);
    }
  }
  render() {
    const { appName, appVersion, ports } = this.state;
    console.log(ports);
    return (
      <div className="App">
        <Modal show={this.state.showPortSelect}>
          <Modal.Body>
            <p className='h3 font-weight-light'>Select a port</p>
            <Form>
              <Form.Control as='select' value={this.state.portSelected} onChange={e => this.setState({portSelected: e.target.value})}>
                {this.state.ports.map((v, i) => (
                  <option value={v.path} key={i}>{v.path}</option>
                ))}
              </Form.Control>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={!this.state.portSelected || this.state.opening} onClick={this.openPort}>Ok</Button>
          </Modal.Footer>
        </Modal>
        {this.state.messages.map((v, i) => (
          <p className='lead' key={i}>{v}</p>
        ))}
      </div>
    );
  }
}
