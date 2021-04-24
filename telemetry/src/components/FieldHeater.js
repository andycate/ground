import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import comms from '../api/Comms';

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%'
  },
  value: {
    display: 'inline',
    marginRight: '1rem'
  },
  unit: {
    display: 'inline',
  }
});

class FieldTemp extends Component {
  constructor(props) {
    super(props);
    this.decimals = (this.props.decimals !== undefined ? this.props.decimals : 0);
    this.valRef = React.createRef();
    this.value = 0;
    this.animationID = null;

    this.handleValueUpdate = this.handleValueUpdate.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
  }

  handleValueUpdate(timestamp, value) {
    this.value = value;
    if(this.animationID === null) {
      this.animationID = requestAnimationFrame(this.updateDisplay);
    }
  }

  updateDisplay() {
    this.animationID = null;
    this.valRef.current.innerHTML = this.value.toFixed(this.decimals);
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
    const { classes, name } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant='h6' className={classes.value}>
          {name}:
        </Typography>
        <Typography variant='h3' className={classes.value} ref={this.valRef}>
          {(0).toFixed(this.decimals)}
        </Typography>
      </div>
    );
  }
}

export default withTheme(withStyles(styles)(FieldTemp));
