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
import ButtonGroupFlow from './components/ButtonGroupFlow';
import ButtonGroupRBV from './components/ButtonGroupRBV';
import ButtonGroupRBVTimed from './components/ButtonGroupRBVTimed';
import ButtonGroupRQD from './components/ButtonGroupRQD';
import BigButton from './components/BigButton';

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
              {/* START OF FIRST BUTTON COLUMN */}
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
                    <ButtonGroupFlow
                      open={comms.beginFlow}
                      close={comms.abort}
                      field='flowState' // change this?
                      text='Begin Flow'
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* START OF SECOND BUTTON COLUMN */}
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      field='purgeFlowRBVstate'
                      text='Purge Flow RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      field='LOxPrechillRBVstate'
                      text='LOx Prechill RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      field='prechillFlowRBVstate'
                      text='Prechill Flow RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      field='propanePrechillRBVstate'
                      text='Propane Prechill RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <ButtonGroupRBV
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      field='purgePrechillVentRBVstate'
                      text='Purge Prechill Vent RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <BigButton
                      onClick={comms.abort}
                      text='Abort'
                      isRed
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <BigButton
                      color='palette.error.text'
                      onClick={comms.hold}
                      text='Hold'
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* START OF THIRD BUTTON COLUMN */}
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={8}>
                    <ButtonGroupRBVTimed
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      time={(timeMs) => console.log('change me ' + timeMs)}
                      field='_changeme_'
                      text='N2 Flow RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={4}>
                    <ButtonGroupRBV
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      field='pressurantVentRBVstate'
                      text='N2 Vent RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      field='LOxVentRBVstate'
                      text='LOX Vent RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      field='LOxFlowRBVstate'
                      text='LOX Flow RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      field='LOxTankVentRBVstate'
                      text='LOX Tank Vent RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRQD
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      field='_changeme_'
                      text='LOX RQD'
                    />
                  </Grid>
                </Grid>

                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      field='propaneVentRBVstate'
                      text='Prop Vent RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      field='propaneFlowRBVstate'
                      text='Prop Flow RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <ButtonGroupRQD
                      open={() => console.log('change me')}
                      close={() => console.log('change me')}
                      field='_changeme_'
                      text='Prop RQD'
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* START OF PROCEDURE COLUMN */}
              <Grid item={1} xs={3} className={classes.item}>
                
              </Grid>
            </Grid>
            <Grid container={true} spacing={1} className={classes.row}>
              
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
