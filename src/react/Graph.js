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
      latestValues: {}
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
    const newValue = sensor.interpolate(data[sensor.index]);
    this.buffer[i].push({
      x: timestamp,
      y: newValue
    });
    this.setState({[i]: newValue});
    // this.setState({latestValue: data[0]});
  }
  componentDidMount() {
    const ctx = this.canvas.current.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        // datasets: [{
        //   label: this.props.label,
        //   data: [],
        //   fill: false,
        //   lineTension: 0.1,
        //   backgroundColor: 'MediumSeaGreen',
        //   borderColor: 'MediumSeaGreen',
        //   borderJoinStyle: 'miter',
        //   pointRadius: 0
        // }]
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
              // https://www.chartjs.org/docs/latest/axes/labelling.html#creating-custom-tick-formats
                callback: function(value, index, values) {
                // console.log(value)
                // return moment(values[index].value).diff(moment(values[values.length-1].value), 'seconds', true);
                return '';
              }
            }
          }],
          yAxes: [{
            ticks: {
              suggestedMin: 0,
              suggestedMax: this.props.max
            }
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
      addSensorListener(v.id, this.makeListener(v, i));
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
        </Card.Body>
        <Row className='m-0 text-center'>
          {
            this.props.sensors.map((v, i) => (
              <Col>
                <p className='lead mb-1'>{v.label}: {(this.state[i] || 0).toString().substr(0, 5)}</p>
              </Col>
            ))
          }
        </Row>
      </Card>
    );
  }
}

export default Graph;
