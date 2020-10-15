import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
import Chart from 'chart.js';
import moment from 'moment';

import { addSensorListener, removeSensorListener } from './actions/connActions'

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      window: 30
    };
    this.canvas = React.createRef();
  }
  listener = (data, timestamp) => {
    if(this.chart.data.datasets[0].data.length > 0) {
      if(timestamp.diff(this.chart.data.datasets[0].data[0].x, 'seconds', true) > this.state.window) {
        this.chart.data.datasets[0].data.shift();
      }
    }
    this.chart.data.datasets[0].data.push({
      x: timestamp,
      y: data[0]
    });
    this.chart.options.scales.xAxes[0].ticks.min = timestamp.clone().subtract(30, 'seconds');
    this.chart.options.scales.xAxes[0].ticks.max = timestamp;
    this.chart.update();
  }
  componentDidMount() {
    const ctx = this.canvas.current.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [1, 2, 3, 4, 5],
        datasets: [{
          label: 'test',
          data: [],
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'MediumSeaGreen',
          borderColor: 'MediumSeaGreen',
          borderJoinStyle: 'miter',
          pointRadius: 0
        }]
      },
      options: {
        animation: false,
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
                return moment(values[index].value).diff(moment(values[values.length-1].value), 'seconds', true);
              }
            }
          }],
          yAxes: [{
            ticks: {
              suggestedMin: 0,
              suggestedMax: this.props.max
            }
          }]
        }
      }
    });
    addSensorListener(this.props.sensorId, this.listener);
    // window.setInterval(() => {
    //   this.chart.data.datasets[0].data.push({
    //     x: moment(),
    //     y: Math.random()*5
    //   });
    //   this.chart.update();
    // }, 1000);
  }
  render() {
    return (
      <Card>
        <Card.Body>
          <p className='lead'>{this.props.label}</p>
          <canvas ref={this.canvas}/>
        </Card.Body>
      </Card>
    );
  }
}

export default Graph;
