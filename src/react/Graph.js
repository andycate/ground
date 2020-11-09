import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Card, Row, Col } from 'react-bootstrap';
import Chart from 'chart.js';
import moment from 'moment';

import { addSensorListener, removeSensorListener } from './actions/connActions'

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latestValues: {},
      shouldScale: false
    };
    this.canvas = React.createRef();
    this.buffer = [];
  }
  makeListener = (sensor, i) => (data, timestamp) => {
    if(this.buffer[i].length > 0) {
      if(timestamp.diff(this.buffer[i][0].x, 'seconds', true) > this.props.window) {
        this.buffer[i].shift();
      }
    }
    let newValue = data[sensor.index];
    this.buffer[i].push({
      x: timestamp,
      y: newValue
    });
    this.setState({[i]: newValue});
  }
  componentDidMount() {
    this.ctx = this.canvas.current.getContext('2d');
    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: {
        datasets: this.props.sensors.map(v => ({
          label: v.label,
          data: [],
          fill: false,
          lineTension: 0.1,
          backgroundColor: v.color,
          borderColor: v.color,
          borderJoinStyle: 'miter',
          pointRadius: 0
        }))
      },
      options: {
        animation: {
          duration: 0
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'second'
            },
            bounds: 'ticks',
            ticks: {
              display: false
            },
            gridLines: {
              display:false
            }
          }],
          yAxes: [{
            ticks: {
              suggestedMin: (this.state.shouldScale?0:undefined),
              suggestedMax: (this.state.shouldScale?this.props.max:undefined)
            },
          }]
        },
        tooltips: {
          mode: 'index',
          enabled: false
        },
        hover: {
          intersect: false,
          mode: null
        },
        events: []
      }
    });
    this.props.sensors.forEach((v, i) => {
      this.buffer.push([]);
      addSensorListener(v.idx, this.makeListener(v, i));
    });
    window.setInterval(() => {
      this.props.sensors.forEach((v, i) => {
        this.chart.data.datasets[i].data = this.buffer[i];
        if(this.buffer[i].length > 0) {
          this.chart.options.scales.xAxes[0].ticks.min = this.buffer[i][this.buffer[i].length-1].x.clone().subtract(this.props.window, 'seconds');
          this.chart.options.scales.xAxes[0].ticks.max = this.buffer[i][this.buffer[i].length-1].x;
        }
      })
      this.chart.update();
    }, this.props.interval);
  }
  render() {
    return (
      <Card>
        <Card.Body>
          <p className='lead text-center p-0 m-0'>{this.props.label}</p>
          <canvas ref={this.canvas}/>
          {/* <p className='p-0'>Current value: {this.state.latestValue} PSI</p> */}
          <Row className='m-0 text-center'>
          {
            this.props.sensors.map((v, i) => (
              <Col className='p-0'>
                <p className='lead m-0'>{v.label}: {(this.state[i] || 0).toString().substr(0, 5)}</p>
              </Col>
            ))
          }
        </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default Graph;
