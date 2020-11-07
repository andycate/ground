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
      <div className='App'>
        <PortModal/>
        <Row className='m-0 pt-2 pr-2'>
          <Col className='p-0 pl-2'>
            <Graph sensors={
              [{
                label: 'LOX T',
                idx: 0,
                index: 0,
                color: '#7D3C98'
              },{
                label: 'PROP T',
                idx: 1,
                index: 0,
                color: 'Tomato'
              }]
            } max={600} window={90} interval={80} label='Pressures'/>
            </Col>
            <Col>
            <Graph sensors={
              [{
                label: 'LOX I',
                idx: 2,
                index: 0,
                color: 'Blue'
              },{
                label: 'PROP I',
                idx: 3,
                index: 0,
                color: 'Green'
              }]
            } max={600} window={90} interval={80} label='Pressures'/>
          </Col>
        </Row>
        <Row className='m-0 pt-2 pr-2'>
          <Col className='p-0 pl-2'>
            <Graph sensors={
              [{
                label: 'HIGH T',
                idx: 4,
                index: 0,
                color: '#7D3C98'
              }]
            } max={0} window={90} interval={80} label='Pressures'/>
          </Col>
          <Col className='p-0 pl-2'>
            <Graph sensors={
              [{
                label: 'Battery',
                idx: 5,
                index: 0,
                color: 'Blue'
              },
              {
                label: 'Current',
                idx: 5,
                index: 1,
                color: 'Tomato'
              }]
            } max={24} window={90} interval={150} label='Power'/>
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
