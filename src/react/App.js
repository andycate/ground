import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';

import PortModal from './PortModal';
import Graph from './Graph';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <PortModal/>
        <Row>
          <Col>
            <Graph label='LOX Injector Low Pressure' sensorId={1} max={800}/>
          </Col>
          <Col>
          </Col>
        </Row>
      </div>
    );
  }
}
