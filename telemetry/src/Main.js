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

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
  },
  container: {
    flexGrow: 1,
    height: '100vh',
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
      settingsOpen: false,
    };

    this.closeSettings = this.closeSettings.bind(this);
  }

  closeSettings() {
    this.setState({ settingsOpen: false });
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
          {/* <Settings open={ this.state.settingsOpen } handleClose={ this.closeSettings }/> */}
          <Container maxWidth='xl' className={classes.container}>
            <Grid container={true} spacing={1} className={classes.row}>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'pressurantPT',
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
                        name: 'loxTankPT',
                        color: [123, 35, 162]
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
                        color: [123, 35, 162]
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
                        name: 'loxTankPT',
                        color: [123, 35, 162]
                      }
                    ]
                  }
                /> */}
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'loxInjectorPT',
                        color: [123, 35, 162]
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
                        color: [123, 35, 162]
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
                        name: 'loxTankPT',
                        color: [123, 35, 162]
                      }
                    ]
                  }
                /> */}
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'loxTankLowTC',
                        color: [123, 35, 162]
                      },
                      {
                        name: 'loxTankMidTC',
                        color: [123, 35, 162]
                      },
                      {
                        name: 'loxTankHighTC',
                        color: [123, 35, 162]
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
                        color: [123, 35, 162]
                      },
                      {
                        name: 'propTankMidTC',
                        color: [123, 35, 162]
                      },
                      {
                        name: 'propTankHighTC',
                        color: [123, 35, 162]
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
