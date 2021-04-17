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
import ButtonGroupHeater from './components/ButtonGroupHeater';
import BigButton from './components/BigButton';
import Procedures from './components/Procedures';

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
                      open={comms.openPurgeFlowRBV}
                      close={comms.closePurgeFlowRBV}
                      field='purgeFlowRBVstate'
                      text='Purge Flow RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={comms.openLOxPrechillRBV}
                      close={comms.closeLOxPrechillRBV}
                      field='LOxPrechillRBVstate'
                      text='LOx Prechill RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={comms.openPrechillFlowRBV}
                      close={comms.closePrechillFlowRBV}
                      field='prechillFlowRBVstate'
                      text='Prechill Flow RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={comms.openPropanePrechillRBV}
                      close={comms.closePropanePrechillRBV}
                      field='propanePrechillRBVstate'
                      text='Propane Prechill RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <ButtonGroupRBV
                      open={comms.openPurgePrechillVentRBV}
                      close={comms.closePurgePrechillVentRBV}
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
                      open={comms.openPressurantFlowRBV}
                      close={comms.closePressurantFlowRBV}
                      time={comms.timePressurantFlowRBV}
                      field='pressurantFlowRBVstate'
                      text='N2 Flow RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={4}>
                    <ButtonGroupRBV
                      open={comms.openPressurantVentRBV}
                      close={comms.closePressurantVentRBV}
                      field='pressurantVentRBVstate'
                      text='N2 Vent RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={comms.openLOxVentRBV}
                      close={comms.closeLOxVentRBV}
                      field='LOxVentRBVstate'
                      text='LOX Vent RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={comms.openLOxFlowRBV}
                      close={comms.closeLOxFlowRBV}
                      field='LOxFlowRBVstate'
                      text='LOX Flow RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={comms.openLOxTankVentRBV}
                      close={comms.closeLOxTankVentRBV}
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
                      open={comms.openPropaneVentRBV}
                      close={comms.closePropaneVentRBV}
                      field='propaneVentRBVstate'
                      text='Prop Vent RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBV
                      open={comms.openPropaneFlowRBV}
                      close={comms.closePropaneFlowRBV}
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
                {/* <Procedures /> */}
              </Grid>
            </Grid>
            <Grid container={true} spacing={1}>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOx Tank Top Heater'
                      sendDuty={comms.setLOxTankTopHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOx Tank Middle Heater'
                      sendDuty={comms.setLOxTankMidHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOx Tank Bottom Heater'
                      sendDuty={comms.setLOxTankBottomHeater}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupHeater
                      text='Propane Tank Top Heater'
                      sendDuty={comms.setPropTankTopHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='Propane Tank Middle Heater'
                      sendDuty={comms.setPropTankMidHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='Propane Tank Bottom Heater'
                      sendDuty={comms.setPropTankBottomHeater}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOx PT Heater'
                      sendDuty={comms.setLoxPTHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOx GEMs Heater'
                      sendDuty={comms.setLoxGemsHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOx Injector PT Heater'
                      sendDuty={comms.setLoxInjectorHeater}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupHeater
                      text='Propane PT Heater'
                      sendDuty={comms.setPropPTHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='Propane GEMs Heater'
                      sendDuty={comms.setPropGemsHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='Propane Injector PT Heater'
                      sendDuty={comms.setPropInjectorHeater}
                    />
                  </Grid>
                </Grid>
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
