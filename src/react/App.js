import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';

import { updateConnState,
         startConnListen,
         startSensorListen } from './actions/connActions';

import PortModal from './PortModal';
import Graph from './Graph';

class App extends Component {
  componentDidMount() {
    this.props.updateConnState();
    this.props.startConnListen();
    this.props.startSensorListen();
  }
  render() {
    return (
      <div className="App">
        <PortModal/>
        <Row>
          <Col>
            <Graph sensors={
              [{
                label: 'LOX Injector Low Pressure',
                id: 1,
                color: 'MediumSeaGreen'
              },{
                label: 'Prop Injector Low Pressure',
                id: 2,
                color: 'Tomato'
              }]
            } max={800} window={30} label='Injector'/>
          </Col>
          <Col>
            {/* <Graph label='Prop Injector Low Pressure' sensorId={2} max={800}/> */}
          </Col>
        </Row>
      </div>
    );
  }
}

PortModal.propTypes = {};
const mapStateToProps = state => ({});
export default connect(
  mapStateToProps,
  { updateConnState,
    startConnListen,
    startSensorListen }
)(App);
