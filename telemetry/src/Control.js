import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import comms from './api/Comms';
import ButtonGroup from './components/ButtonGroup';

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
    height: '100%'
  },
});

class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
      showSettings: false,
    };

    this.setLightDark = this.setLightDark.bind(this);
  }

  setLightDark(isDark) {
    this.setState({ isDark });
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
          <Container maxWidth='xl' className={classes.container}>
            <Grid container={true} spacing={1} className={classes.row}>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openHPS}
                      close={comms.closeHPS}
                      field='HPS'
                      text='Pressurant'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.enableHPS}
                      close={comms.disableHPS}
                      field='HPSEnable'
                      text='Pressurant Enable'
                      successText='Enab'
                      failText='Dsabl'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openLoxGems}
                      close={comms.closeLoxGems}
                      field='loxGems'
                      text='LOX GEMS'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openPropGems}
                      close={comms.closePropGems}
                      field='propGems'
                      text='Prop GEMS'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <ButtonGroup
                      open={comms.openLox2Way}
                      close={comms.closeLox2Way}
                      field='lox2Way'
                      text='Arm Main Valves'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openLox5Way}
                      close={comms.closeLox5Way}
                      field='lox5Way'
                      text='LOX 5 Way'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openProp5Way}
                      close={comms.closeProp5Way}
                      field='prop5Way'
                      text='Prop 5 Way'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <ButtonGroup
                      open={comms.beginFlow}
                      close={comms.abort}
                      field='_' // change this?
                      text='Begin Flow'
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openPurgeFlowRBV}
                      close={comms.closePurgeFlowRBV}
                      field=''
                      text='Purge Flow RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openPurgeRBV}
                      close={comms.closePurgeRBV}
                      field=''
                      text='Purge RBV'
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
                
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
                
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
