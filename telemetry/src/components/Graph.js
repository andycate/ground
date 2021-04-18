import React, { Component } from 'react';
import { WebglPlot, WebglLine, ColorRGBA } from 'webgl-plot';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Card, CardContent } from '@material-ui/core';

import comms from '../api/Comms';

const styles = theme => ({
  root: {
    height: '100%'
  },
  cardContent: {
    height: '100%',
    padding: '8px',
    paddingBottom: '8px !important'
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
    height: '90%'
  },
  legend: {

  },
  scaleContainer: {
    height: '100%'
  }
});

class Graph extends Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
    this.sizeDetectorRef = React.createRef();
    this.legendRefs = this.props.fields.map(f => React.createRef());
    this.webglp = null;
    this.animationID = null;
    this.window = 30 * 1000; // 30 seconds
    this.numFields = this.props.fields.length;

    this.values = [];
    this.lengths = [];
    this.buffer = [];
    this.lines = [];
    this.lastUpdate = Date.now();
    this.subscribers = [];

    this.createUpdateHandler = this.createUpdateHandler.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
  }

  createUpdateHandler(index) {
    return (timestamp, value) => {
      this.buffer[index].push(timestamp);
      this.buffer[index].push(value);
      this.legendRefs[index].current.innerHTML = `(${value.toFixed(1)}`;
    }
  }

  updateGraph() {
    const now = Date.now();
    const diff = now - this.lastUpdate;
    let minValue = Number.MAX_VALUE;
    let maxValue = Number.MIN_VALUE;

    for(let f = 0; f < this.numFields; f++) {
      const vArray = this.values[f];
      let vLen = this.lengths[f];
      let cutIndex = 0;
      for(let i = 0; i < vLen; i+=2) {
        if(vArray[i] - diff >= 0) {
          cutIndex = i;
          break;
        }
      }
      if(cutIndex > 0) {
        vArray.copyWithin(0, cutIndex, vLen);
        vLen -= cutIndex;
      }

      for(let i = 0; i < vLen; i+=2) {
        vArray[i] = vArray[i] - diff;
      }
      const buff = this.buffer[f];
      if(buff.length > 0) {
        for(let i = 0; i < buff.length; i+=2) {
          vArray[vLen] = this.window - now + buff[i];
          vLen ++;
          vArray[vLen] = buff[i+1];
          vLen ++;
        }
        this.buffer[f] = [];
      }

      for(let i = 0; i < vLen; i+=2) {
        const value = vArray[i+1];
        minValue = (value < minValue) ? value : minValue;
        maxValue = (value > maxValue) ? value : maxValue;
      }
      this.lengths[f] = vLen;
    }
    this.lastUpdate = now;

    for(let f = 0; f < this.lines.length; f++) {
      const l = this.lines[f];
      l.scaleY = 2.0 / (maxValue - minValue);
      l.offsetY = -minValue * l.scaleY - 1 || 0;
      const len = this.lengths[f] / 2;
      l.numPoints = len;
      l.webglNumPoints = len;
    }
    this.animationID = requestAnimationFrame(this.updateGraph);
    
    this.webglp.update();
  }

  componentDidMount() {
    const width = this.sizeDetectorRef.current.clientWidth;
    const height = this.sizeDetectorRef.current.clientHeight;
    this.canvasRef.current.width = width * window.devicePixelRatio;
    this.canvasRef.current.height = height * window.devicePixelRatio;

    this.webglp = new WebglPlot(this.canvasRef.current);

    for(let i = 0; i < this.numFields; i++) {
      const field = this.props.fields[i];
      const fArray = new Float32Array(this.window);
      this.values.push(fArray);
      this.lengths.push(2);
      this.buffer.push([]);

      const newLine = new WebglLine(new ColorRGBA(...field.color.map(c => c / 256), 1), 0);
      newLine.xy = fArray;
      newLine.offsetX = -1;
      newLine.scaleX = 2.0/this.window;
      this.lines.push(newLine);
      this.webglp.addLine(newLine);
      const subscriber = this.createUpdateHandler(i);
      this.subscribers.push(subscriber);
      comms.addSubscriber(field.name, subscriber);
    }

    this.updateGraph();
  }

  componentWillUnmount() {
    for(let i = 0; i < this.numFields; i++) {
      const field = this.props.fields[i];
      comms.removeSubscriber(field.name, this.subscribers[i]);
    }
    cancelAnimationFrame(this.animationID);
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <table className={classes.legend}>
            <tbody>
              <tr>
                {
                  this.props.fields.map((f, i) => (
                    <>
                      <td style={{backgroundColor: `rgb(${f.color[0]},${f.color[1]},${f.color[2]})`, width: '30px', height: '100%'}}/>
                      <td style={{fontSize: '0.75rem'}}>
                        {f.name}
                      </td>
                      <td ref={this.legendRefs[i]} style={{fontSize: '0.75rem'}}>
                        (0.0
                      </td>
                      <td style={{width: '2.5rem', fontSize: '0.75rem'}}>{f.unit})</td>
                    </>
                  ))
                }
              </tr>
            </tbody>
          </table>
          <div ref={this.sizeDetectorRef} className={classes.sizeDetector}>
            <canvas ref={this.canvasRef} className={classes.canvas}/>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(Graph));
