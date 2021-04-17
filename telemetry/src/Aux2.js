import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';

import comms from './api/Comms';

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
    // height: '100%'
    borderBottom: '0.5px solid',
    borderColor: theme.palette.text.primary
  },
  item: {
    height: '100%'
  },
});

class Aux2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
    };

    this.handleDarkMode = this.handleDarkMode.bind(this);
  }

  handleDarkMode(isDark) {
    this.setState({ isDark });
  }

  componentDidMount() {
    comms.connect();
    comms.addDarkModeListener(this.handleDarkMode);
  }

  componentWillUnmount() {
    // make sure that when there's a hot reload, we disconnect comms before its connected again
    comms.removeDarkModeListener(this.handleDarkMode);
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
          <Container maxWidth='xl' className={classes.container}>
            <Grid container={true} spacing={1} className={classes.row}>
              <Grid item={1} xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'HPS',
                    field: '_changeme_', // HPS current
                    unit: 'A'
                  }}
                  field2={{
                    name: 'LOx GEMS',
                    field: '_changeme_', // current
                    unit: 'A'
                  }}
                  field3={{
                    name: 'Prop GEMS',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field4={{
                    name: 'ARM',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field5={{
                    name: 'LOx Main',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field6={{
                    name: 'Prop Main',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                {/* Power supply voltages */}
                <SixValueSquare
                  field1={{
                    name: 'HPS',
                    field: '_changeme_', // HPS current
                    unit: 'A'
                  }}
                  field2={{
                    name: 'LOx GEMS',
                    field: '_changeme_', // current
                    unit: 'A'
                  }}
                  field3={{
                    name: 'Prop GEMS',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field4={{
                    name: 'ARM',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field5={{
                    name: 'LOx Main',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field6={{
                    name: 'Prop Main',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'HPS',
                    field: '_changeme_', // HPS current
                    unit: 'A'
                  }}
                  field2={{
                    name: 'LOx GEMS',
                    field: '_changeme_', // current
                    unit: 'A'
                  }}
                  field3={{
                    name: 'Prop GEMS',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field4={{
                    name: 'ARM',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field5={{
                    name: 'LOx Main',
                    field: '_changeme_',
                    unit: 'A'
                  }}
                  field6={{
                    name: 'Prop Main',
                    field: '_changeme_',
                    unit: 'A'
                  }}
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

Aux2.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Aux2);
