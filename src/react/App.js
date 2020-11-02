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
                id: 1,
                index: 0,
                color: '#7D3C98',
                interpolate: (value) => {
                  return 1.2258857538273733 * value * (1024 / Math.pow(2, 23)) - 123.89876445934394;
                  // return value * 5 / Math.pow(2, 23)
                }
              },{
                label: 'Prop T',
                id: 1,
                index: 1,
                color: '#2E86C1',
                interpolate: (value) => {
                  return 1.2258857538273733 * value * (1024 / Math.pow(2, 23)) - 123.89876445934394;
                  // return value * 5 / Math.pow(2, 23)
                }
              },{
                label: 'LOX I',
                id: 1,
                index: 2,
                color: '#229954',
                interpolate: (value) => {
                  return 1.2258857538273733 * value * (1024 / Math.pow(2, 23)) - 123.89876445934394;
                  // return value * 5 / Math.pow(2, 23)
                }
              },{
                label: 'Prop I',
                id: 1,
                index: 3,
                color: '#D68910',
                interpolate: (value) => {
                  return 1.2258857538273733 * value * (1024 / Math.pow(2, 23)) - 123.89876445934394;
                  // return value * 5 / Math.pow(2, 23)
                }
              }]
            } max={600} window={60} interval={80} label='Pressures'/>
          </Col>
          <Col className='p-0 pl-2'>
            <Graph sensors={
              [{
                label: 'High Pressure',
                id: 1,
                index: 4,
                color: '#C0392B',
                interpolate: (value) => {
                  // y, x
                  const map = [
                    // [0, 0, ]
                    [0,15,1702887.424],
                    [150,100,1845493.76],
                    [700,580,2650800.128],
                    [730,615,2709520.384],
                    [805,665,2793406.464],
                    [890,740,2919235.584],
                    [990,820,3053453.312],
                    [1100,910,3204448.256],
                    [1200,980,3321888.768],
                    [1351,1120,3556769.7920000004],
                    [1450,1200,3690987.52],
                    [1580,1300,3858759.68],
                    [1760,1450,4110417.92],
                    [1930,1580,4328521.728],
                    [2100,1720,4563402.752],
                    [2180,1800,4697620.48],
                    [2400,1950,4949278.720000001],
                    [2550,2090,5184159.744],
                    [2700,2230,5419040.768],
                    [2870,2360,5637144.575999999],
                    [3020,2490,5855248.384],
                    [3190,2630,6090129.408],
                    [3333,2735,6266290.176000001],
                    [3426,2805,6383730.688000001],
                    [3620,2970,6660554.752],
                    [3700,3020,6744440.832],
                    [3850,3140,6945767.424000001],
                    [4000,3280,7180648.448000001],
                    [4080,3340,7281311.744000001],
                    [4186,3430,7432306.688000001],
                    [4221,3460,7482638.335999999],
                    [4365,3590,7700742.143999999],
                  ];
                  const calcPressure = (5000 / 16) * ((value * 5 * (20.0/4.36) / Math.pow(2, 23)) - 4);
                  // const index = map.findIndex((v, i) => {
                  //   return v[1] <= calcPressure && map[i+1][1] >= calcPressure;
                  // });
                  // // console.log(index);
                  // if(index === -1) {
                  //   return calcPressure;
                  // }
                  // // return calcPressure;
                  // return map[index][1] + (map[index+1][1] - map[index][1]) * ((calcPressure - map[index][0]) / (map[index+1][0] - map[index][0]));

                  const index = map.findIndex((v, i) => {
                    return v[2] <= value && map[i+1][2] >= value;
                  });
                  // console.log(index);
                  if(index === -1) {
                    return calcPressure;
                  }
                  return map[index][0] + (map[index+1][0] - map[index][0]) * ((value - map[index][2]) / (map[index+1][2] - map[index][2]))
                }
              }]
            } max={0} window={60} interval={80} label='Pressures'/>
          </Col>
          {/* <Col className='p-0 pl-2'>
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
          </Col> */}
        </Row>
        <Row className='m-0 pt-2 pr-2'>
          <Col className='p-0 pl-2'>
            <Graph sensors={
              [{
                label: 'Battery',
                id: 2,
                index: 0,
                color: 'MediumSeaGreen',
                interpolate: value => (value)
              },{
                label: 'Wattage',
                id: 2,
                index: 1,
                color: 'Tomato',
                interpolate: value => (value)
              },{
                label: 'Current',
                id: 2,
                index: 2,
                color: 'Blue',
                interpolate: value => (value)
              }]
            } max={26} window={60} interval={200} label='Battery'/>
          </Col>
          <Col className='p-0 pl-2'>
            <Graph sensors={
              [{
                label: 'Temperature',
                id: 0,
                index: 0,
                color: 'MediumSeaGreen',
                interpolate: value => (value)
              }]
            } max={0} window={60} interval={200} label='Temperature'/>
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
