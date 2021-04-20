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
    this.state = {
      value: (0).toFixed(this.decimals)
    };

    this.handleValueUpdate = this.handleValueUpdate.bind(this);
  }

  handleValueUpdate(timestamp, value) {
    this.setState({value: value.toFixed(this.decimals)});
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
    const { classes, name, unit, theme, threshold } = this.props;
    const { value } = this.state;
    const colorVal = threshold !== undefined ? (value > threshold ? theme.palette.success.main : "white") : "white";
    return (
      <Grid container spacing={1} direction='vertical' alignItems='center' className={classes.root}>
        <Grid item xs={12}>
          <div style={{ backgroundColor: colorVal }}>
            <Typography variant='h6'>
              {name}
            </Typography>
            <Typography variant='h3' className={classes.value}>
              {value}
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
