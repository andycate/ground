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
    this.state = {
      value: '0'
    };

    this.handleValueUpdate = this.handleValueUpdate.bind(this);
  }

  handleValueUpdate(timestamp, value) {
    this.setState({value: value.toFixed(0)});
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
    const { classes, name } = this.props;
    const { value } = this.state;
    return (
      <div className={classes.root}>
        <Typography variant='h6' className={classes.value}>
          {name}:
        </Typography>
        <Typography variant='h3' className={classes.value}>
          {value}
        </Typography>
      </div>
    );
  }
}

export default withTheme(withStyles(styles)(FieldTemp));
