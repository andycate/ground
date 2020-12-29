import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'fontsource-roboto';
import './Control.css';

import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import { green, red } from '@material-ui/core/colors';
import Paper from '@material-ui/core/Paper'

import comms from './comms';

import Navbar from './Navbar';
import Graph from './Graph';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
  },
  container: {
    flexGrow: 1,
    width: '30%',
    position: 'absolute',
    top: theme.spacing(8),
    paddingTop: theme.spacing(3)
    // ,backgroundColor: theme.palette.success.main
  },
  row: {
    height: '100%'
  },
  item: {
    height: '33%',
  },
  navbarGrid: {
    // height: theme.spacing(2)
  },
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
  bgcolor: 'background.paper',
  borderColor: 'text.primary',
  m: 1,
  border: 1,
  style: { width: '6rem', height: '3rem' },
};

const PurpleSwitch = withStyles({
  switchBase: {
    color: red[300],
    '&$checked': {
      color: green[500],
    },
    '&$checked + $track': {
      backgroundColor: green[500],
    },
  },
  checked: {},
  track: {},
})(Switch);

class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
      open: false,
      open2: false
    };
    this.sensorListeners = [];
    this.bandwidthListeners = [];
  }
  componentDidMount = async () => {
    const connected = await comms.getConnected();
    const ports = await comms.listPorts();
    const port = await comms.getPort();
    this.setState({
      connected,
      port: port ? ports.findIndex(p => p.path === port.path) : 0,
      ports,
      portOpened: !!port
    });
    comms.connListen(connected => {
      this.setState({ connected });
    });
    comms.sensorListen(payload => {
      this.sensorListeners.filter(v => v.idx === payload.idx).forEach(v => {
        v.handler(payload.values, moment(payload.timestamp));
      });
    });
    comms.bandwidthListen(payload => {
      this.bandwidthListeners.forEach(b => {
        b(payload);
      });
    });
  }

  addSensorListener = (idx, handler) => {
    this.sensorListeners.push({
      idx,
      handler
    });
  }

  addBandwidthListener = handler => {
    this.bandwidthListeners.push(handler);
  }

  connect = async () => {
    const success = await comms.selectPort(this.state.ports[this.state.port], this.state.baud);
    if(success) {
      this.setState({
        portOpened: true
      });
    }
    return success; // maybe put this in the state?
  }

  toggle = async (e) => {
    this.setState({open: !this.state.open, open2: !this.state.open2});
    const b = await comms.test();
  }

  render() {
    const { classes } = this.props;
    const theme = createMuiTheme({
      palette: {
        type: this.state.isDark ? 'dark' : 'light'
      }
    });
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Box>

          <Container maxWidth='xl' className={classes.container}>
            <Grid container spacing={3} className={classes.row}>
              <Grid item xs={6} className={classes.item}>
              <div style={{width: '6rem', height: '1rem', backgroundColor: this.state.open ? 'green' : 'red', margin: '1rem'}}>
              </div>
                <Button
                color='secondary'
                variant='outlined'
                className={!this.state.open ? classes.closedButton : classes.closedButtonOutline}
                onClick={this.toggle}
                disabled={!this.state.open}
                >
                  Close
                </Button>
                <Button
                color='primary'
                variant='outlined'
                className={this.state.open ? classes.openButton : classes.openButtonOutline}
                onClick={this.toggle}
                disabled={this.state.open}
                >
                  Open
                </Button>
              </Grid>
              <Grid item xs={6} className={classes.item}>
                <Button variant='outlined'>LOX Gems</Button>
                <PurpleSwitch name="checkedA" />
              </Grid>
              <Grid item xs={6} className={classes.item}>
                <Box borderRadius={4} {...statusBox} />
                <Button variant='outlined'>Prop GEMS</Button>
              </Grid>
              <Grid item container spacing={1} direction="column" alignItems='center' xs={6}>
                <Grid item >
                  <Paper className={this.state.open2 ? classes.openStatusBox : classes.closedStatusBox}>{this.state.open2 ? 'Open' : 'Closed'}</Paper>
                </Grid>
                <Grid item >
                  <Button variant='outlined' onClick={this.toggle}>Close</Button>
                  <Button variant='outlined' onClick={this.toggle}>Open</Button>
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.item}>
                <Button variant='outlined'>LOX 5 Way</Button>
              </Grid>
              <Grid item xs={6} className={classes.item}>
                <Button variant='outlined'>Prop 5 Way</Button>
              </Grid>
            </Grid>
          </Container>



        </Box>
      </ThemeProvider>
    );
  }
}

Control.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Control);
