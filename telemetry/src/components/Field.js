import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';

import green from '@material-ui/core/colors/green';

import comms from '../api/Comms';

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

    this.handleValueUpdate = this.handleValueUpdate.bind(this);
  }

  handleValueUpdate(timestamp, value) {
    this.valRef.current.innerHTML = value.toFixed(this.decimals);
    if(value > this.props.threshold) {
      this.colorRef.current.style.backgroundColor = '#27AE60';
    } else {
      this.colorRef.current.style.backgroundColor = '';
    }
  }

  componentDidMount() {
    const { field } = this.props;
    comms.addSubscriber(field, this.handleValueUpdate);
  }

  componentWillUnmount() {
    const { field } = this.props;
    comms.removeSubscriber(field, this.handleValueUpdate);
  }

  render() {
    const { classes, name, unit } = this.props;
    return (
      <Grid container spacing={1} direction='vertical' alignItems='center' className={classes.root}>
        <Grid item xs={12}>
          <div ref={this.colorRef}>
            <Typography variant='h6'>
              {name}
            </Typography>
            <Typography variant='h3' className={classes.value} ref={this.valRef}>
              {(0).toFixed(this.decimals)}
            </Typography>
            <Typography variant='h4' className={classes.unit}>
              {unit}
            </Typography>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withTheme(withStyles(styles)(Field));
