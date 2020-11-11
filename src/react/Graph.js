import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Chart from 'chart.js';

const styles = theme => ({
  root: {
    height: '100%'
  },
  cardContent: {
    height: '100%'
  }
});

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
        responsive: true,
        maintainAspectRatio: false,
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
              suggestedMax: (this.state.shouldScale?this.props.max:undefined),
              fontColor: this.props.theme.palette.text.secondary
            },
            gridLines: {
              color: this.props.theme.palette.action.selected,
              zeroLineColor: this.props.theme.palette.action.disabledBackground
            },
          }],
        },
        legend: {
          labels: {
            fontColor: this.props.theme.palette.text.primary
          }
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
      this.props.addSensorListener(v.idx, this.makeListener(v, i));
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
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.theme !== this.props.theme) {
      // update graph colors
      this.chart.options.legend.labels.fontColor = this.props.theme.palette.text.primary;
      this.chart.options.scales.yAxes[0].ticks.fontColor = this.props.theme.palette.text.secondary;
      this.chart.options.scales.yAxes[0].gridLines.color = this.props.theme.palette.action.selected;
      this.chart.options.scales.yAxes[0].gridLines.zeroLineColor = this.props.theme.palette.action.disabledBackground;
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <canvas ref={this.canvas}/>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(Graph));
