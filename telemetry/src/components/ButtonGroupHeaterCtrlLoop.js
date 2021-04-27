import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Grid, Button, Box, TextField } from '@material-ui/core';

import comms from '../api/Comms';

const styles = theme => ({
  openButton: {
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important',
    borderColor: theme.palette.success.main + ' !important',
    transition: 'none'
  },
  openButtonOutline: {
    color: theme.palette.success.main + ' !important',
    borderColor: theme.palette.success.main + ' !important',
    transition: 'none'
  },
  closedButton: {
    backgroundColor: theme.palette.error.main + ' !important',
    color: theme.palette.text.primary + ' !important',
    transition: 'none'
  },
  closedButtonOutline: {
    color: theme.palette.error.main + ' !important',
    transition: 'none'
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
  border: 0.5,
  style: { width: '9rem', height: '1rem', marginLeft: 'auto', marginRight: 'auto' },
};

class ButtonGroupHeaterCtrlLoop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openClicked: false, // duty cycle
    };

    this.setCtrlLoop = this.setCtrlLoop.bind(this);
    this.setOn = this.setOn.bind(this);
    this.setOff = this.setOff.bind(this);
  }

  setCtrlLoop() {
    const { sendDuty } = this.props;
    sendDuty(300);
    this.setState({openClicked: null});
  }
  setOn() {
    const { sendDuty } = this.props;
    sendDuty(255);
    this.setState({openClicked: true});
  }
  setOff() {
    const { sendDuty } = this.props;
    sendDuty(0);
    this.setState({openClicked: false});
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
    const { openClicked } = this.state;
    return (
      <Grid container spacing={1} alignItems='center' style={{textAlign: 'center'}}>
        <Grid item xs={12}>
          <Box component="span" display="block">{text}</Box>
        </Grid>
        {/* <Grid item xs={12}>
          <Box borderRadius={4} {...statusBox} bgcolor={sColor}/>
        </Grid> */}
        {/* <Grid item xs={6}>
          <TextField
            type='number'
            label='duty cycle'
            value={duty}
            onChange={this.handleDutyChange}
          />
        </Grid> */}
        <Grid item xs={4}>
          <Button
            color='primary'
            variant={openClicked === null ? 'contained' : 'outlined'}
            onClick={this.setCtrlLoop}
            disabled={this.props.disabled || false}
            disableRipple
            size='small'
          >
            Enable Ctrl Loop
          </Button>
        </Grid>
        <Grid item xs={4}>
        <Button
            color='primary'
            variant='outlined'
            className={openClicked === true ? classes.openButton : classes.openButtonOutline}
            onClick={this.setOn}
            disabled={this.props.disabled || false}
            disableRipple
            size='small'
          >
            Turn On
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            color='secondary'
            variant='outlined'
            className={openClicked === false ? classes.closedButton : classes.closedButtonOutline}
            onClick={this.setOff}
            disabled={this.props.disabled || false}
            disableRipple
            size='small'
          >
            Turn Off
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default withTheme(withStyles(styles)(ButtonGroupHeaterCtrlLoop));
