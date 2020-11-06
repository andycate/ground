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
import Bandwidth from './Bandwidth';

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
              }]
            } max={600} window={5} interval={80} label='Pressures'/>
            <Graph sensors={
              [{
                label: 'LOX T',
                idx: 1,
                index: 0,
                color: '#7D3C98'
              }]
            } max={600} window={5} interval={80} label='Pressures'/>
            </Col>
            <Col>
            <Graph sensors={
              [{
                label: 'LOX T',
                idx: 2,
                index: 0,
                color: '#7D3C98'
              }]
            } max={600} window={5} interval={80} label='Pressures'/>
            <Graph sensors={
              [{
                label: 'LOX T',
                idx: 3,
                index: 0,
                color: '#7D3C98'
              }]
            } max={600} window={5} interval={80} label='Pressures'/>
          </Col>
          <Col>
            <Bandwidth />
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
