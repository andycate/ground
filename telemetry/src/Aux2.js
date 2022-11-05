import React, { Component } from "react";
import PropTypes from "prop-types";
import "@fontsource/roboto";
import {
  createTheme,
  withStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Box, Container, Grid } from "@material-ui/core";

import Graph from "./components/Graph";
import SixValueSquare from "./components/SixValueSquare";

import comms from "./api/Comms";
import MessageDisplaySquare from "./components/MessageDisplaySquare";

const PAGE_TITLE = "Telemetry: Aux #2";


const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
  },
  container: {
    flexGrow: 1,
    position: "absolute",
    top: theme.spacing(6),
    // height: '100vh',
    bottom: "0px",
    padding: theme.spacing(1),
  },
  row: {
    height: "100%",
  },
  item: {
    height: "33%",
  },
  navbarGrid: {
    // height: theme.spacing(2)
  },
});


class Aux2 extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.title = PAGE_TITLE;
    comms.connect();
    // comms.addDarkModeListener(this.handleDarkMode);
  }

  componentWillUnmount() {
    // make sure that when there's a hot reload, we disconnect comms before its connected again
    // comms.removeDarkModeListener(this.handleDarkMode);
    comms.destroy();
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={1} className={classes.row}>
            {/* START OF ROW 1 */}
            <Grid item xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  ["Igniter Voltage", "igniterVoltage", "V", 0, 3],
                  ["Igniter Arm Voltage", "igniterArmVoltage", "V", 0, 3],
                  ["Main Arm Voltage", "armValveVoltage", "V", 0, 3],
                  ["Igniter Current", "igniterCurrent", "A", 2, 0.1],
                  ["Igniter Arm", "igniterEnableCurrent", "A", 2, 0.05],
                  ["Arm Valve Current", "armValveCurrent", "A", 2, 0.1],
                ]}
              />
            </Grid>

            <Grid item xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  ["Main Vent", "mainValveVentVoltage", "V", 0, 3],
                  ["LOX Main", "loxMainValveVoltage", "V", 0, 3],
                  ["Fuel Main", "fuelMainValveVoltage", "V", 0, 3],
                  ["Main Vent", "mainValveVentCurrent", "A", 2, 0.1],
                  ["LOX Main", "loxMainValveCurrent", "A", 2, 0.1],
                  ["Fuel Main", "fuelMainValveCurrent", "A", 2, 0.1],
                ]}
              />
            </Grid>

            <Grid item xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  ["LOX GEMS Voltage", "loxGemsVoltage", "V", 0, 3],
                  ["Fuel GEMS Voltage", "fuelGemsCurrent", "A", 2, 0.1],
                  ["Press Flow Voltage", "pressFlowVoltage", "V", 0, 3],
                  ["LOX GEMS Current", "loxGemsCurrent", "A", 2, 0.1],
                  ["Fuel Gems Current", "fuelGemsCurrent", "A", 2, 0.1],
                  ["Press Flow Current", "pressFlowCurrent", "A", 2, 0.1],
                ]}
              />
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  ["Breakwire Voltage", "breakwireVoltage", "V", 0, 3],
                  ["RQD Voltage", "RQDVoltage", "V", 0, 3],
                  ["Press Fill Voltage", "pressurantFillRBVvoltage", "V", 0, 3],
                  ["Breakwire Current", "breakwireCurrent", "A", 2, 0.1],
                  ["RQD Current", "RQDCurrent", "A", 2, 0.1],
                  [
                    "Press Fill Current",
                    "pressurantFillRBVcurrent",
                    "A",
                    2,
                    0.1,
                  ],
                ]}
              />
            </Grid>

            {/* START OF ROW 2 */}

            <Grid item xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  [
                    "Press Fill Vent Voltage",
                    "pressurantFillVentRBVvoltage",
                    "V",
                    0,
                    3,
                  ],
                  ["LOX Fill Voltage", "loxFillRBVvoltage", "V", 0, 3],
                  ["Fuel Fill Voltage", "fuelFillRBVvoltage", "V", 0, 3],
                  [
                    "Press Fill Vent Current",
                    "pressurantFillVentRBVcurrent",
                    "A",
                    2,
                    0.1,
                  ],
                  ["LOX Fill Current", "loxFillRBVcurrent", "A", 2, 0.1],
                  ["Fuel Fill Current", "fuelFillRBVcurrent", "A", 2, 0.1],
                ]}
              />
            </Grid>


            {/* START OF ROW 3 */}

            <Grid item xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  ["Igniter Abort Enabled", "igniterAbortEnabled", ""],
                  ["Breakwire Abort Enabled", "breakwireAbortEnabled", ""],
                  [
                    "Main Valve Current Abort Enabled",
                    "mainValveCurrentAbortEnabled",
                    "",
                  ],
                  ["Flight Mode Enabled", "flightModeEnabled", ""],
                ]}
              />
            </Grid>
            
            <Grid xs={4} className={classes.item}>
              <Graph fields={
                [ { name: "engineTop1TC", color: [0, 126, 254], unit: "ºC", },
                  { name: "engineTop2TC", color: [0, 187, 0], unit: "ºC", },
                  { name: "engineBottom1TC", color: [123, 35, 162], unit: "ºC", },
                  { name: "engineBottom2TC", color: [35, 123, 162], unit: "ºC", } ]}>
              </Graph>
            </Grid>
            
            <Grid item xs={4} className={classes.item}>

            </Grid>

            <Grid item xs={4} className={classes.item}>
              <MessageDisplaySquare />
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

Aux2.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Aux2);
