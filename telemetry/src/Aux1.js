import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Box, Container, Grid } from '@material-ui/core';

import Settings from './components/Settings';
import Navbar from './components/Navbar';
import Graph from './components/Graph';
import SixValueSquare from './components/SixValueSquare';

import comms from './api/Comms';

const PAGE_TITLE = "Telemetry: Aux #1"

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
  },
  container: {
    flexGrow: 1,
    position: 'absolute',
    top: theme.spacing(6),
    // height: '100vh',
    bottom: '0px',
    padding: theme.spacing(1)
  },
  row: {
    height: '100%'
  },
  item: {
    height: '33%'
  },
  navbarGrid: {
    // height: theme.spacing(2)
  }
});

class Aux1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
      showSettings: false,
    };

    this.changeLightDark = this.changeLightDark.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
  }

  changeLightDark() {
    comms.setDarkMode(!this.state.isDark);
    this.setState({ isDark: !this.state.isDark });
  }

  openSettings() {
    this.setState({ showSettings: true });
  }

  closeSettings() {
    this.setState({ showSettings: false });
  }

  componentDidMount() {
    document.title = PAGE_TITLE;
    comms.connect();
  }

  componentWillUnmount() {
    // make sure that when there's a hot reload, we disconnect comms before its connected again
    comms.destroy();
  }

  render() {
    const { classes } = this.props;
    const theme = createTheme({
      palette: {
        type: this.state.isDark ? 'dark' : 'light'
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Box>
          <Settings open={this.state.showSettings} closeSettings={this.closeSettings}/>
          <Navbar
            changeLightDark={this.changeLightDark}
            openSettings={this.openSettings}
          />
          <Container maxWidth='xl' className={classes.container}>
            <Grid container={true} spacing={1} className={classes.row}>
              <Grid item={1} xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'FC',
                    field: 'flightSupplyVoltage',
                    unit: 'V',
                    decimals: 1
                  }}
                  field2={{
                    name: 'GC',
                    field: 'groundSupplyVoltage',
                    unit: 'V',
                    decimals: 1
                  }}
                  field3={{
                    name: 'AC 2',
                    field: '_',
                    unit: 'V',
                    decimals: 1
                  }}
                  field4={{
                    name: 'DAQ 1',
                    field: 'daq1BattVoltage',
                    unit: 'V',
                    decimals: 1
                  }}
                  field5={{
                    name: 'DAQ 2',
                    field: 'daq2BattVoltage',
                    unit: 'V',
                    decimals: 1
                  }}
                  field6={{
                    name: 'AC 3',
                    field: 'ac3Voltage',
                    unit: 'V',
                    decimals: 1
                  }}
                />
              </Grid>
              <Grid item={1} xs={8} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'engineTop1TC', // engine temp 1
                        color: [221, 0, 0],
                        unit: 'degC'
                      },
                      {
                        name: 'engineTop2TC', // engine temp 2
                        color: [0, 127, 254],
                        unit: 'degC'
                      },
                      {
                        name: 'engineBottom1TC', // engine temp 3
                        color: [0, 187, 0],
                        unit: 'degC'
                      },
                      {
                        name: 'engineBottom2TC', // engine temp 3
                        color: [245, 185, 66],
                        unit: 'degC'
                      },
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'FC',
                    field: 'flightSupplyCurrent',
                    unit: 'A',
                    decimals: 1
                  }}
                  field2={{
                    name: 'GC',
                    field: 'groundSupplyCurrent',
                    unit: 'A',
                    decimals: 1
                  }}
                  field3={{
                    name: 'AC 2',
                    field: '_',
                    unit: 'A',
                    decimals: 1
                  }}
                  field4={{
                    name: 'DAQ 1',
                    field: 'daq1CurrentDraw',
                    unit: 'A',
                    decimals: 1
                  }}
                  field5={{
                    name: 'DAQ 2',
                    field: 'daq2CurrentDraw',
                    unit: 'A',
                    decimals: 1
                  }}
                  field6={{
                    name: 'AC 3',
                    field: 'ac3CurrentDraw',
                    unit: 'A',
                    decimals: 1
                  }}
                />
              </Grid>
              <Grid item={1} xs={8} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'injectorTC', // engine temp 1
                        color: [221, 0, 0],
                        unit: 'degC'
                      },
                      {
                        name: 'engineMid1TC', // engine temp 2
                        color: [0, 127, 254],
                        unit: 'degC'
                      },
                      {
                        name: 'engineMid2TC', // engine temp 3
                        color: [0, 187, 0],
                        unit: 'degC'
                      },
                      {
                        name: 'engineTop3TC', // engine temp 3
                        color: [245, 185, 66],
                        unit: 'degC'
                      },
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                {/* <Graph
                  fields={
                    [
                      {
                        name: 'loxTankPTTemp', // lox PT temp
                        color: [123, 35, 162],
                        unit: 'degC'
                      },
                      // {
                      //   name: 'loxGemsTemp', // lox gems temp
                      //   color: [0, 126, 254],
                      //   unit: 'degC'
                      // },
                    ]
                  }
                /> */}
              </Grid>
              <Grid item={1} xs={8} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'engineTop4TC', // engine temp 1
                        color: [221, 0, 0],
                        unit: 'degC'
                      },
                      {
                        name: 'engineBottom3TC', // engine temp 2
                        color: [0, 127, 254],
                        unit: 'degC'
                      },
                      {
                        name: 'engineBottom4TC', // engine temp 3
                        color: [0, 187, 0],
                        unit: 'degC'
                      },
                      {
                        name: 'propTankTC', // engine temp 3
                        color: [245, 185, 66],
                        unit: 'degC'
                      },
                    ]
                  }
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }
}

Aux1.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Aux1);
