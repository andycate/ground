import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Grid, Button, Box } from '@material-ui/core';

import comms from '../api/Comms';

const styles = theme => ({
  openButton: {
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important',
    borderColor: theme.palette.success.main + ' !important',
    transition: 'none',
  },
  openButtonOutline: {
    color: theme.palette.success.main + ' !important',
    borderColor: theme.palette.success.main + ' !important',
    transition: 'none',
  },
  closedButton: {
    backgroundColor: theme.palette.error.main + ' !important',
    color: theme.palette.text.primary + ' !important',
    transition: 'none',
  },
  closedButtonOutline: {
    color: theme.palette.error.main + ' !important',
    transition: 'none',
  },
  openStatusBox: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.success.main
  },
  closedStatusBox: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.error.main
  }
});

const statusBox = {
  borderColor: 'text.secondary',
  // m: 1,
  border: 0.5,
  style: { width: '9rem', height: '1rem' },
};

class ButtonGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openClicked: false,
    };

    this.updateOpen = this.updateOpen.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.setClosed = this.setClosed.bind(this);
  }

  updateOpen(timestamp, value) {
    this.setState({open: value});
  }

  setOpen() {
    const { open } = this.props;
    this.setState({openClicked: true});
    open();
  }

  setClosed() {
    const { close } = this.props;
    this.setState({openClicked: false});
    close();
  }

  componentDidMount() {
    const { field } = this.props;
    comms.addSubscriber(field, this.updateOpen);
  }

  componentWillUnmount() {
    const { field } = this.props;
    comms.removeSubscriber(field, this.updateOpen);
  }

  render() {
    const { classes, theme, text } = this.props;
    const { open, openClicked } = this.state;
    return (
      <Grid container spacing={1} direction="column" alignItems='center'>
        <Grid item>
          <Box component="span" display="block">{text}</Box>
        </Grid>
        <Grid item>
          <Box borderRadius={4} {...statusBox} bgcolor={open ? theme.palette.success.main : theme.palette.error.main}/>
        </Grid>
        <Grid item >
          <Button
          color='secondary'
          variant='outlined'
          className={!openClicked ? classes.closedButton : classes.closedButtonOutline}
          onClick={this.setClosed}
          disabled={this.props.disabled || false}
          disableRipple
          size='small'
          >
            {this.props.failText || "Close"}
          </Button>
          <Button
          color='primary'
          variant='outlined'
          className={openClicked ? classes.openButton : classes.openButtonOutline}
          onClick={this.setOpen}
          disabled={this.props.disabled || false}
          disableRipple
          size='small'
          >
            {this.props.successText || "Open"}
          </Button>
        </Grid>
        <br></br>
      </Grid>
    );
  }
}

export default withTheme(withStyles(styles)(ButtonGroup));
