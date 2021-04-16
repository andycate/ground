import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Grid, Button, Box, TextField } from '@material-ui/core';

import comms from '../api/Comms';

const styles = theme => ({
  openButton: {
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important',
    borderColor: theme.palette.success.main + ' !important'
  },
  openButtonOutline: {
    color: theme.palette.success.main + ' !important',
    borderColor: theme.palette.success.main + ' !important'
  },
  closedButton: {
    backgroundColor: theme.palette.error.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
  closedButtonOutline: {
    color: theme.palette.error.main + ' !important'
  },
  openStatusBox: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.success.main
  },
  closedStatusBox: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.error.main
  }
});

const statusBox = {
  borderColor: 'text.secondary',
  m: 1,
  border: 0.5,
  style: { width: '9rem', height: '1rem', marginLeft: 'auto', marginRight: 'auto' },
};

class ButtonGroupHeater extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duty: 0, // duty cycle
    };

    this.handleDutyChange = this.handleDutyChange.bind(this);
    this.setDuty = this.setDuty.bind(this);
  }

  handleDutyChange(e) {
    this.setState({duty: parseFloat(e.target.value)});
  }

  setDuty() {
    const { duty } = this.state;
    const { sendDuty } = this.props;
    sendDuty(duty);
  }

  // componentDidMount() {
  //   const { field } = this.props;
  //   comms.addSubscriber(field, this.updateStatus);
  // }

  // componentWillUnmount() {
  //   const { field } = this.props;
  //   comms.removeSubscriber(field, this.updateStatus);
  // }

  render() {
    const { classes, theme, text } = this.props;
    const { duty } = this.state;
    return (
      <Grid container spacing={1} alignItems='center' style={{textAlign: 'center'}}>
        <Grid item xs={12}>
          <Box component="span" display="block">{text}</Box>
        </Grid>
        {/* <Grid item xs={12}>
          <Box borderRadius={4} {...statusBox} bgcolor={sColor}/>
        </Grid> */}
        <Grid item xs={6}>
          <TextField
            type='number'
            label='duty cycle'
            value={duty}
            onChange={this.handleDutyChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            color='primary'
            variant='contained'
            onClick={this.setDuty}
            disabled={this.props.disabled || false}
          >
            Send
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default withTheme(withStyles(styles)(ButtonGroupHeater));
