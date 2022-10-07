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
                <Graph
                  fields={
                    [
                      {
                        name: 'pressurantPT',
                        color: [70, 1, 155],
                        unit: 'PSI'
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'loxTankPT',
                        color: [0, 126, 254],
                        unit: 'PSI'
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'fuelTankPT',
                        color: [0, 187, 0],
                        unit: 'PSI'
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'LOX DOME',
                    field: 'loxDomePT',
                    unit: 'PSI'
                  }}
                  field2={{
                    name: 'RQD Pressure',
                    field: 'rqdPT',
                    unit: 'PSI'
                  }}
                  field3={{
                    name: '_',
                    field: '_',
                    unit: ''
                  }}
                  field4={{
                    name: 'Fuel DOME',
                    field: 'fuelDomePT',
                    unit: 'PSI'
                  }}
                  field5={{
                    name: '_',
                    field: '_',
                    unit: ''
                  }}
                  field6={{
                    name: '_',
                    field: '_',
                    unit: ''
                  }}
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'loxInjectorPT',
                        color: [221, 0, 0],
                        unit: 'PSI'
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'fuelInjectorPT',
                        color: [70, 1, 155],
                        unit: 'PSI'
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                {/* <Graph
                  fields={
                    [
                      {
                        name: 'loxGemsPT',
                        color: [0, 126, 254],
                        unit: 'psi'
                      },
                      {
                        name: 'propGemsPT',
                        color: [0, 187, 0],
                        unit: 'psi'
                      },
                    ]
                  }
                /> */}
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'thrust1',
                        color: [255, 51, 224],
                        unit: 'LBS'
                      },
                      {
                        name: 'thrust2', // prop PT temp
                        color: [15, 202, 221],
                        unit: 'LBS'
                      },
                      {
                        name: 'thrust3', // prop PT temp
                        color: [202, 15, 221],
                        unit: 'LBS'
                      },
                      {
                        name: 'thrust4', // prop PT temp
                        color: [221, 202, 15],
                        unit: 'LBS'
                      },
                      {
                        name: 'totalThrust', // prop PT temp
                        color: [238, 154, 7],
                        unit: 'LBS'
                      },
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'engineTop1TC',
                        color: [0, 126, 254],
                        unit: 'ºC'
                      },
                      {
                        name: 'engineTop2TC',
                        color: [0, 187, 0],
                        unit: 'ºC'
                      },
                      {
                        name: 'engineBottom1TC',
                        color: [123, 35, 162],
                        unit: 'ºC'
                      },
                      {
                        name: 'engineBottom2TC',
                        color: [35, 123, 162],
                        unit: 'ºC'
                      },

                      // {
                      //   name: 'engineTC4',
                      //   color: [0, 126, 254],
                      //   unit: 'ºC'
                      // },
                      // {
                      //   name: 'engineTC5',
                      //   color: [0, 187, 0],
                      //   unit: 'ºC'
                      // },
                      // {
                      //   name: 'engineTC6',
                      //   color: [123, 35, 162],
                      //   unit: 'ºC'
                      // },
                      // {
                      //   name: 'engineTC7',
                      //   color: [35, 123, 162],
                      //   unit: 'ºC'
                      // },

                      // {
                      //   name: 'engineTC8',
                      //   color: [0, 126, 254],
                      //   unit: 'ºC'
                      // },
                      // {
                      //   name: 'engineTC9',
                      //   color: [0, 187, 0],
                      //   unit: 'ºC'
                      // },
                      // {
                      //   name: 'engineTC10',
                      //   color: [123, 35, 162],
                      //   unit: 'ºC'
                      // },
                      // {
                      //   name: 'engineTC11',
                      //   color: [35, 123, 162],
                      //   unit: 'ºC'
                      // },
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
