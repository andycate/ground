import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Tooltip, IconButton } from '@material-ui/core';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import SettingsIcon from '@material-ui/icons/Settings';

import comms from '../api/Comms';

const styles = theme => ({
  spacer: {
    flexGrow: 1
  },
  bar: {
    borderBottom: '0.5px solid gray'
  }
});

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }

  componentDidMount() {
    // comms.addSubscriber('loxTankPT', this.updateLoxTankPT);
  }

  componentWillUnmount() {
    // comms.removeSubscriber('loxTankPT', this.updateLoxTankPT);
  }

  render() {
    const { classes, changeLightDark, openSettings } = this.props;
    return (
      <AppBar position="static" color="default" elevation={0} className={classes.bar}>
        <Toolbar variant="dense">
          <div className={classes.spacer}/>
          <Tooltip title='Toggle light/dark theme'>
            <IconButton
              color="inherit"
              onClick={ changeLightDark }
            >
              <Brightness4Icon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Settings'>
            <IconButton
              color="inherit"
              onClick={ openSettings }
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withTheme(withStyles(styles)(Navbar));
