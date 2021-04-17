import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Tooltip, IconButton, Button } from '@material-ui/core';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import SettingsIcon from '@material-ui/icons/Settings';

import comms from '../api/Comms';

const styles = theme => ({
  spacer: {
    flexGrow: 1
  },
  bar: {
    borderBottom: '0.5px solid gray'
  },
  connectedButton: {
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
  disconnectedButton: {
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.error.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
});

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flightConnected: false,
      daq1Connected: false,
      linAct1Connected: false,
      linAct2Connected: false,
      linAct3Connected: false,

      flightKbps: 0,
      daq1Kbps: 0,
      linAct1Kbps: 0,
      linAct2Kbps: 0,
      linAct3Kbps: 0,
    };

    this.updateFlightConnected = this.updateFlightConnected.bind(this);
    this.updateDaq1Connected = this.updateDaq1Connected.bind(this);
    this.updateLinAct1Connected = this.updateLinAct1Connected.bind(this);
    this.updateLinAct2Connected = this.updateLinAct2Connected.bind(this);
    this.updateLinAct3Connected = this.updateLinAct3Connected.bind(this);

    this.updateFlightKbps = this.updateFlightKbps.bind(this);
    this.updateDaq1Kbps = this.updateDaq1Kbps.bind(this);
    this.updateLinAct1Kbps = this.updateLinAct1Kbps.bind(this);
    this.updateLinAct2Kbps = this.updateLinAct2Kbps.bind(this);
    this.updateLinAct3Kbps = this.updateLinAct3Kbps.bind(this);
  }

  updateFlightConnected(timestamp, value) { this.setState({ flightConnected: value }); }
  updateDaq1Connected(timestamp, value) { this.setState({ daq1Connected: value }); }
  updateLinAct1Connected(timestamp, value) { this.setState({ linAct1Connected: value }); }
  updateLinAct2Connected(timestamp, value) { this.setState({ linAct2Connected: value }); }
  updateLinAct3Connected(timestamp, value) { this.setState({ linAct3Connected: value }); }

  updateFlightKbps(timestamp, value) { this.setState({ flightKbps: value }); }
  updateDaq1Kbps(timestamp, value) { this.setState({ daq1Kbps: value }); }
  updateLinAct1Kbps(timestamp, value) { this.setState({ linAct1Kbps: value }); }
  updateLinAct2Kbps(timestamp, value) { this.setState({ linAct2Kbps: value }); }
  updateLinAct3Kbps(timestamp, value) { this.setState({ linAct3Kbps: value }); }

  async componentDidMount() {
    comms.addSubscriber('flightConnected', this.updateFlightConnected);
    comms.addSubscriber('daq1Connected', this.updateDaq1Connected);
    comms.addSubscriber('linAct1Connected', this.updateLinAct1Connected);
    comms.addSubscriber('linAct2Connected', this.updateLinAct2Connected);
    comms.addSubscriber('linAct3Connected', this.updateLinAct3Connected);

    comms.addSubscriber('flightKbps', this.updateFlightKbps);
    comms.addSubscriber('daq1Kbps', this.updateDaq1Kbps);
    comms.addSubscriber('linAct1Kbps', this.updateLinAct1Kbps);
    comms.addSubscriber('linAct2Kbps', this.updateLinAct2Kbps);
    comms.addSubscriber('linAct3Kbps', this.updateLinAct3Kbps);

    this.setState({
      flightConnected: await comms.getFlightConnected(),
      daq1Connected: await comms.getDaq1Connected(),
      linAct1Connected: await comms.getLinAct1Connected(),
      linAct2Connected: await comms.getLinAct2Connected(),
      linAct3Connected: await comms.getLinAct3Connected(),
    });
  }

  componentWillUnmount() {
    comms.removeSubscriber('flightConnected', this.updateFlightConnected);
    comms.removeSubscriber('daq1Connected', this.updateDaq1Connected);
    comms.removeSubscriber('linAct1Connected', this.updateLinAct1Connected);
    comms.removeSubscriber('linAct2Connected', this.updateLinAct2Connected);
    comms.removeSubscriber('linAct3Connected', this.updateLinAct3Connected);

    comms.removeSubscriber('flightKbps', this.updateFlightKbps);
    comms.removeSubscriber('daq1Kbps', this.updateDaq1Kbps);
    comms.removeSubscriber('linAct1Kbps', this.updateLinAct1Kbps);
    comms.removeSubscriber('linAct2Kbps', this.updateLinAct2Kbps);
    comms.removeSubscriber('linAct3Kbps', this.updateLinAct3Kbps);
  }

  render() {
    const { classes,
            changeLightDark,
            openSettings } = this.props;
    
    const { flightConnected,
            daq1Connected,
            linAct1Connected,
            linAct2Connected,
            linAct3Connected,
            flightKbps,
            daq1Kbps,
            linAct1Kbps,
            linAct2Kbps,
            linAct3Kbps } = this.state;

    return (
      <AppBar position="static" color="default" elevation={0} className={classes.bar}>
        <Toolbar variant="dense">
          <div className={classes.spacer}/>
          <Button className={flightConnected ? classes.connectedButton : classes.disconnectedButton}>Flight - {flightKbps} kbps</Button>
          <Button className={daq1Connected ? classes.connectedButton : classes.disconnectedButton}>DAQ1 - {daq1Kbps} kbps</Button>
          <Button className={linAct1Connected ? classes.connectedButton : classes.disconnectedButton}>LinAct1 - {linAct1Kbps} kbps</Button>
          <Button className={linAct2Connected ? classes.connectedButton : classes.disconnectedButton}>LinAct2 - {linAct2Kbps} kbps</Button>
          <Button className={linAct3Connected ? classes.connectedButton : classes.disconnectedButton}>LinAct3 - {linAct3Kbps} kbps</Button>
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
