import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import comms from '../api/Comms';

import gas1Wav from "../media/gas1.wav";
import gas2Wav from "../media/gas2.wav";
import gas3Wav from "../media/gas3.wav";

const styles = theme => ({
  root: {
    height: '100%'
  },
  value: {
    display: 'inline'
  },
  unit: {
    display: 'inline',
    marginLeft: '0.5rem'
  }
});

class Field extends Component {
  constructor(props) {
    super(props);
    this.decimals = (this.props.decimals !== undefined ? this.props.decimals : 0);
    this.valRef = React.createRef();
    this.colorRef = React.createRef();
    this.value = 0;
    this.animationID = null;

    this.handleValueUpdate = this.handleValueUpdate.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.playGas = this.playGas.bind(this);
  }

  handleValueUpdate(timestamp, value) {
    const { modifyValue } = this.props;
    this.value = modifyValue ? modifyValue(value, timestamp) : value;
    if(this.animationID === null) {
      this.animationID = requestAnimationFrame(this.updateDisplay);
    }
    if(this.props.field === "freg.filteredUpstreamPressure1@roc") {
      if(this.value > 10.0 && !this.lockoutTime) {
        this.playGas();
        this.lockoutTime = true;
        setTimeout(() => {this.lockoutTime = false;}, 120 * 1000);
      }
    }
  }

  updateDisplay() {
    this.animationID = null;
    this.valRef.current.innerHTML = this.value.toFixed(this.decimals);
    if(this.value > this.props.threshold && this.props.threshold !== null) {
      this.colorRef.current.style.backgroundColor = this.props.thresholdColor;
    } else {
      this.colorRef.current.style.backgroundColor = '';
    }
  }

  playGas() {
    const r = Math.random();
    if(r < 0.33) {
      new Audio(gas1Wav).play();
    } else if (r < 0.66) {
      new Audio(gas2Wav).play();
    } else {
      new Audio(gas3Wav).play();
    }
  }

  componentDidMount() {
    const { field } = this.props;
    comms.addSubscriber(field, this.handleValueUpdate);
  }

  componentWillUnmount() {
    const { field } = this.props;
    comms.removeSubscriber(field, this.handleValueUpdate);
    cancelAnimationFrame(this.animationID);
  }

  render() {
    const { classes, field, name, unit } = this.props;
    return (
      <Grid container spacing={1} alignItems='center' className={classes.root}>
        <Grid item xs={12}>
          <div ref={this.colorRef}>
            <Typography variant='h6'>
              {name}
            </Typography>
            <Typography variant='h3' className={classes.value} ref={this.valRef}>
              {field === null ? "" : (0).toFixed(this.decimals)}
            </Typography>
            <Typography variant='h6' className={classes.unit}>
              {unit}
            </Typography>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withTheme(withStyles(styles)(Field));
