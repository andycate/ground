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
                label: 'LOX Injector',
                id: 1,
                color: 'MediumSeaGreen'
              },{
                label: 'Prop Injector',
                id: 2,
                color: 'Tomato'
              }]
            } max={800} window={30} interval={80} label='Injectors'/>
          </Col>
          <Col className='p-0 pl-2'>
            <Graph sensors={
              [{
                label: 'LOX Tank',
                id: 3,
                color: '#8E44AD'
              },{
                label: 'Prop Tank',
                id: 4,
                color: '#B9770E'
              }]
            } max={800} window={10} interval={80} label='Tanks'/>
          </Col>
        </Row>
        <Row className='m-0 pt-2 pr-2'>
          <Col className='p-0 pl-2'>
            <Graph sensors={
              [{
                label: 'High Pressure',
                id: 5,
                color: 'MediumSeaGreen'
              }]
            } max={800} window={30} interval={120} label='Nitrogen'/>
          </Col>
          <Col className='p-0 pl-2'>

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
