import React, { Component } from 'react';
import moment from 'moment';

import WebGLPlot, { WebglLine, ColorRGBA } from "webgl-plot";

import { withStyles, withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import Slider from '@material-ui/core/Slider';

import SettingsIcon from '@material-ui/icons/Settings';

const styles = theme => ({
  root: {
    height: '100%'
  },
  cardContent: {
    height: '100%',
  },
  button: {
    float: 'right',
    minWidth: '0px',
    zIndex: 1000
  },
  canvas: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  sizeDetector: {
    position: 'relative',
    width: '100%',
    height: '100%'
  }
});

class NewGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldScale: false,
      showSettings: false,
      window: this.props.defaultWindow
    };
    this.canvas = React.createRef();
    this.sizeDetector = React.createRef();
    this.lastUpdate = Date.now();
  }
  makeListener = (sensor, i) => {
    let values = [];
    return (data, timestamp) => {
      const buffer = this.chart.data.datasets[i].data;
      let newValue = data[sensor.index];
      if(buffer.length > 0) {
        if(timestamp.diff(buffer[0].x, 'seconds', true) > this.state.window) {
          buffer.shift();
        }
      } else {
        buffer.push({
          x: timestamp,
          y: newValue
        });
      }
      // console.log(newValue);
      if(isNaN(newValue)) {
        return;
      }
      if(values.length >= 4) {
        values = [];
        values.push(newValue);
        buffer.push({
          x: timestamp,
          y: newValue
        });
      } else {
        values.push(newValue);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const ave = values.reduce((prev, curr) => prev + curr) / values.length;
        // console.log(min);
        if(ave - min > max - ave) {
          // use min
          buffer[buffer.length-1].y = min;
        } else {
          // use max
          buffer[buffer.length-1].y = max;
        }
        buffer[buffer.length-1].x = timestamp;
      }
      this.chart.options.scales.xAxes[0].ticks.min = buffer[buffer.length-1].x.clone().subtract(this.state.window, 'seconds');
      this.chart.options.scales.xAxes[0].ticks.max = buffer[buffer.length-1].x;

      const latest = (Math.round(newValue * 10) / 10).toString().split('.');
      if(!latest[1]) {
        latest[1] = '0';
      }
      this.chart.data.datasets[i].label = `${sensor.label} (${latest[0]}.${latest[1]} ${sensor.unit})`;
      // console.log(buffer);
      if(Date.now() - this.lastUpdate > 100.0) {
        this.chart.update();
        this.lastUpdate = Date.now();
      }
    }
  }
  componentDidMount() {
    console.log(window.devicePixelRatio)
    const width = this.sizeDetector.current.clientWidth;
    const height = this.sizeDetector.current.clientHeight;

    this.canvas.current.width = width * window.devicePixelRatio;
    this.canvas.current.height = height * window.devicePixelRatio;

    this.webglp = new WebGLPlot(this.canvas.current);
    const numX = 1000;

    const line = new WebglLine(new ColorRGBA(1, 0, 0, 1), numX);
    this.webglp.addLine(line);

    line.lineSpaceX(-1, 2 / numX);

    let values = new Float32Array(numX);
    let currVal = 0.0;

    const renderPlot = () => {
      const noise1 = 0.1;
      // for (let i = 0; i < line.numPoints; i+=2) {
      //   const ySin = Math.sin(Math.PI * i * 0.001 * Math.PI * 2);
      //   const yNoise = Math.random() - 0.5;
      //   line.setY(i, ySin * 0.5 + yNoise * noise1);
      // }
      let yNoise = (Math.random() - 0.5) * 0.1;
      // if(currVal > 1) yNoise = -Math.abs(yNoise);
      // if(currVal < -1) yNoise = Math.abs(yNoise);
      currVal += yNoise;
      for(let i = 0; i < numX - 1; i++) {
        values[i] = values[i+1];
      }
      values[numX-1] = currVal;
      const minValue = Math.min.apply(null, values);
      const maxValue = Math.max.apply(null, values);
      line.scaleY = 2.0 / (maxValue - minValue);
      line.offsetY = -minValue * line.scaleY - 1;
      line.shiftAdd(new Float32Array([currVal]));
      this.animationId = requestAnimationFrame(renderPlot);
      this.webglp.update();
    }
    this.animationId = requestAnimationFrame(renderPlot);

    // this.props.sensors.forEach((v, i) => {
    //   this.props.addSensorListener(v.idx, this.makeListener(v, i));
    // });
  }
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Button className={classes.button} size='small' disableElevation onClick={e => this.setState({showSettings: true})}>
            <SettingsIcon/>
          </Button>
          <div ref={this.sizeDetector} className={classes.sizeDetector}>
            <canvas ref={this.canvas} className={classes.canvas}/>
          </div>
          <Dialog open={this.state.showSettings} onClose={() => this.setState({showSettings: false})} disablePortal fullWidth>
          <DialogTitle>Graph settings for {this.props.title}</DialogTitle>
            <DialogContent>
              <FormGroup>
                <Typography>
                  Display static scales
                </Typography>
                <Switch onChange={e => this.setState({shouldScale: e.target.checked})} checked={this.state.shouldScale}/>
                <Typography>
                  Time interval
                </Typography>
                <Slider step={1} min={1} max={300} valueLabelDisplay="auto" value={this.state.window} onChange={(e, v) => this.setState({window: v})}/>
              </FormGroup>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(NewGraph));
