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
    const width = this.sizeDetector.current.clientWidth;
    const height = this.sizeDetector.current.clientHeight;
    this.canvas.current.width = width * window.devicePixelRatio;
    this.canvas.current.height = height * window.devicePixelRatio;

    this.webglp = new WebGLPlot(this.canvas.current);

    const line = new WebglLine(new ColorRGBA(1, 0, 0, 1), 0);
    line.offsetX = -1;
    this.webglp.addLine(line);

    let buffer = [];

    let values = [];
    let yValues = [];
    let moments = [];
    
    const renderPlot = () => {
      performance.mark('rstart');
      const now = moment();
      for(let i = 0; i < moments.length; i++) {
        if(now.diff(moments[i], 'seconds', true) > this.state.window) {
          moments.splice(i, 1);
          values.splice(i*2, 2);
          yValues.splice(i, 1);
          i--;
        } else {
          break;
        }
      }
      const diff = now.diff(moments[moments.length-1], 'seconds', true);
      for(let i = 0; i < values.length / 2; i++) {
        values[i*2] = (values[i*2] - diff);
      }
      if(buffer.length > 0) {
        buffer.forEach(v => {
          moments.push(v[0]);
          yValues.push(v[1]);
          values.push(this.state.window - now.diff(v[0], 'seconds', true));
          values.push(v[1]);
        });
        buffer = [];
      }

      const minValue = Math.min.apply(null, yValues);
      const maxValue = Math.max.apply(null, yValues);
      line.scaleY = 2.0 / (maxValue - minValue);
      line.offsetY = -minValue * line.scaleY - 1;
      line.scaleX = 2.0/this.state.window;
      line.numPoints = values.length/2;
      line.webglNumPoints = values.length/2;
      line.xy = Float32Array.from(values);
      this.animationId = requestAnimationFrame(renderPlot);
      performance.mark('rend');

      performance.measure('render', 'rstart', 'rend');
      console.log(performance.getEntriesByName('render'));
      performance.clearMarks();
      performance.clearMeasures();

      this.webglp.update();
    }
    this.animationId = requestAnimationFrame(renderPlot);

    // this.props.sensors.forEach((v, i) => {
    //   this.props.addSensorListener(v.idx, this.makeListener(v, i));
    // });
    this.props.addSensorListener(0, (data, timestamp) => {
      buffer.push([timestamp, data[0]]);
    });
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
