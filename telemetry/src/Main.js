import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import comms from './api/Comms';
import Graph from './components/Graph';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import SixValueSquare from './components/SixValueSquare';
import TankHeaterSquare from './components/TankHeaterSquare';

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

class Main extends Component {
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
                        name: 'propTankPT',
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
                    name: 'LOx DOME',
                    field: 'loxDomePT',
                    unit: 'PSI'
                  }}
                  field2={{
                    name: 'Prop DOME',
                    field: 'propDomePT',
                    unit: 'PSI'
                  }}
                  field3={{
                    name: 'LOx Expected Static',
                    field: 'loxExpectedStatic',
                    unit: 'PSI'
                  }}
                  field4={{
                    name: 'LOx GEMS',
                    field: 'loxGemsPT',
                    unit: 'PSI'
                  }}
                  field5={{
                    name: 'Prop GEMS',
                    field: 'propGemsPT',
                    unit: 'PSI'
                  }}
                  field6={{
                    name: 'Prop Expected Static',
                    field: 'propExpectedStatic',
                    unit: 'PSI'
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
                        name: 'propInjectorPT',
                        color: [70, 1, 155],
                        unit: 'PSI'
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <TankHeaterSquare
                  field1={{
                    name: 'LOx Top',
                    field: 'loxTankHighTC',
                    decimals: 2
                  }}
                  field2={{
                    name: 'LOx Middle',
                    field: 'loxTankMidTC',
                    decimals: 2
                  }}
                  field3={{
                    name: 'LOx Bottom',
                    field: 'loxTankLowTC',
                    decimals: 2
                  }}
                  field4={{
                    name: 'Prop Top',
                    field: 'propTankHighTC',
                    decimals: 2
                  }}
                  field5={{
                    name: 'Prop Middle',
                    field: 'propTankMidTC',
                    decimals: 2
                  }}
                  field6={{
                    name: 'Prop Bottom',
                    field: 'propTankLowTC',
                    decimals: 2
                  }}
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'loxTankLowTC',
                        color: [0, 126, 254],
                        unit: 'PSI'
                      },
                      {
                        name: 'loxTankMidTC',
                        color: [0, 187, 0],
                        unit: 'PSI'
                      },
                      {
                        name: 'loxTankHighTC',
                        color: [123, 35, 162],
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
                        name: 'propTankLowTC',
                        color: [0, 126, 254],
                        unit: 'PSI'
                      },
                      {
                        name: 'propTankMidTC',
                        color: [0, 187, 0],
                        unit: 'PSI'
                      },
                      {
                        name: 'propTankHighTC',
                        color: [123, 35, 162],
                        unit: 'PSI'
                      }
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

Main.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Main);
