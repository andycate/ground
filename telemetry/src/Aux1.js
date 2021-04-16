import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Box, Container, Grid } from '@material-ui/core';

import Settings from './components/Settings';
import Navbar from './components/Navbar';
import Graph from './components/Graph';
import SixValueSquare from './components/SixValueSquare';

import comms from './api/Comms';

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
    comms.connect();
  }

  componentWillUnmount() {
    // make sure that when there's a hot reload, we disconnect comms before its connected again
    comms.destroy();
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
                    field: '_changeme_',
                    unit: 'V'
                  }}
                  field2={{
                    name: 'AC 1',
                    field: '_changeme_',
                    unit: 'V'
                  }}
                  field3={{
                    name: 'AC 2',
                    field: '_changeme_',
                    unit: 'V'
                  }}
                  field4={{
                    name: 'DAQ 1',
                    field: '_changeme_',
                    unit: 'V'
                  }}
                  field5={{
                    name: 'DAQ 2',
                    field: '_changeme_',
                    unit: 'V'
                  }}
                  field6={{
                    name: 'AC 3',
                    field: '_changeme_',
                    unit: 'V'
                  }}
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: '_changeme_', // lox PT temp
                        color: [123, 35, 162],
                        unit: 'degC'
                      },
                      {
                        name: '_changeme_', // lox gems temp
                        color: [123, 35, 162],
                        unit: 'degC'
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
                        name: '_changeme_', // prop PT temp
                        color: [123, 35, 162],
                        unit: 'degC'
                      },
                      {
                        name: '_changeme_', // prop gems temp
                        color: [123, 35, 162],
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
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field2={{
                    name: 'AC 1',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field3={{
                    name: 'AC 2',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field4={{
                    name: 'DAQ 1',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field5={{
                    name: 'DAQ 2',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field6={{
                    name: 'AC 3',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: '_changeme_', // lox injector PT temp
                        color: [123, 35, 162],
                        unit: 'degC'
                      },
                      {
                        name: '_changeme_', // prop injector PT temp
                        color: [123, 35, 162],
                        unit: 'degC'
                      },
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'LOx Tank PT Heater',
                    field: '_changeme_',
                    unit: '',
                    decimals: 2
                  }}
                  field2={{
                    name: 'AC 1',
                    field: '_changeme_',
                    unit: '',
                    decimals: 2
                  }}
                  field3={{
                    name: 'AC 2',
                    field: '_changeme_',
                    unit: '',
                    decimals: 2
                  }}
                  field4={{
                    name: 'DAQ 1',
                    field: '_changeme_',
                    unit: '',
                    decimals: 2
                  }}
                  field5={{
                    name: 'DAQ 2',
                    field: '_changeme_',
                    unit: '',
                    decimals: 2
                  }}
                  field6={{
                    name: 'AC 3',
                    field: '_changeme_',
                    unit: '',
                    decimals: 2
                  }}
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: '_changeme_', // engine temp 1
                        color: [123, 35, 162],
                        unit: 'degC'
                      },
                      {
                        name: '_changeme_', // engine temp 2
                        color: [123, 35, 162],
                        unit: 'degC'
                      },
                      {
                        name: '_changeme_', // engine temp 3
                        color: [123, 35, 162],
                        unit: 'degC'
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
                        name: '_changeme_', // engine temp 4
                        color: [123, 35, 162],
                        unit: 'degC'
                      },
                      {
                        name: '_changeme_', // engine temp 5
                        color: [123, 35, 162],
                        unit: 'degC'
                      },
                      {
                        name: '_changeme_', // engine temp 6
                        color: [123, 35, 162],
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
