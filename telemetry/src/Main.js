import React, { Component } from "react";
import PropTypes from "prop-types";
import "@fontsource/roboto";
import {
  createTheme,
  withStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import {Box, Container, Grid, Typography} from "@material-ui/core";

import Graph from "./components/Graph";
import SixValueSquare from "./components/SixValueSquare";

import comms from "./api/Comms";
import MessageDisplaySquare from "./components/MessageDisplaySquare";
import Field from "./components/Field";

const PAGE_TITLE = "Telemetry: Main";

const fields = [
  [
    {
      name: "pressurantPT",
      color: [70, 1, 155],
      unit: "PSI",
    },
  ],
  [
    {
      name: "loxTankPT",
      color: [0, 126, 254],
      unit: "PSI",
    },
  ],
  [
    {
      name: "fuelTankPT",
      color: [0, 187, 0],
      unit: "PSI",
    },
  ],
  [
    {
      name: "loxInjectorPT",
      color: [221, 0, 0],
      unit: "PSI",
    },
    {
      name: "fuelInjectorPT",
      color: [70, 1, 155],
      unit: "PSI",
    },
  ],
  [
    {
      name: "loxCapVal",
      color: [59, 126, 161],
      unit: "pF",
      precision: 3,
    },
    {
      name: "loxCapValFiltered",
      color: [0, 50, 98],
      unit: "pF",
      precision: 3,
    },
    
  ],
  [
    {
      name: "thrust0",
      color: [255, 51, 224],
      unit: "LBS",
    },
    {
      name: "thrust1", // prop PT temp
      color: [15, 202, 221],
      unit: "LBS",
    },
    {
      name: "thrust2", // prop PT temp
      color: [202, 15, 221],
      unit: "LBS",
    },
    {
      name: "totalThrust", // prop PT temp
      color: [238, 154, 7],
      unit: "LBS",
    },
  ],
  [
    {
      name: "fuelCapVal",
      color: [253, 181, 21],
      unit: "pF",
      precision: 3,
    },
    {
      name: "fuelCapValFiltered",
      color: [196, 130, 14],
      unit: "pF",
      precision: 3,
      },
  ],
  // [
  //   {
  //     name: "engineTop1TC",
  //     color: [0, 126, 254],
  //     unit: "ºC",
  //   },
  //   {
  //     name: "engineTop2TC",
  //     color: [0, 187, 0],
  //     unit: "ºC",
  //   },
  //   {
  //     name: "engineBottom1TC",
  //     color: [123, 35, 162],
  //     unit: "ºC",
  //   },
  //   {
  //     name: "engineBottom2TC",
  //     color: [35, 123, 162],
  //     unit: "ºC",
  //   },
  // ],
];

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

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastPressRocTime: window.performance.now(),
      lastPressRocValue: 0
    }
    this.rocValues = [];
  }

  componentDidMount() {
    document.title = PAGE_TITLE;
    comms.connect();
  }

  componentWillUnmount() {
    // make sure that when there's a hot reload, we disconnect comms before its connected again
    comms.destroy();
  }

  calcPressRoc(value) {
    const {lastPressRocValue, lastPressRocTime} = this.state;
    
    const currentPressRocTime = window.performance.now();
    const delta_press_roc = (value - lastPressRocValue) / (currentPressRocTime - lastPressRocTime);
    
    this.rocValues.push(delta_press_roc);
    if (this.rocValues.length > 30) {
      this.rocValues.pop(0);
    }
    this.setState({ lastPressRocTime: currentPressRocTime, lastPressRocValue: value});

    let sum = 0;
    for (let rocVal in this.rocValues) {
      sum += Number(rocVal);
    }
    return sum / this.rocValues.length;
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={1} className={classes.row}>
            {fields.slice(0, 3).map((field) => (
              <Grid item={1} xs={4} className={classes.item}>
                <Graph fields={field} />
              </Grid>
            ))}

            <Grid item={1} xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  ["LOX DOME", "loxDomePT", "PSI"],
                  ["RQD Pressure", "rqdPT", "PSI"],
                  ["Purge Bottle", "purgePT", "PSI"],
                  ["Fuel DOME", "fuelDomePT", "PSI"],
                  ["PressPT Roc", "pressurantPT", "PSI/ms", 2, 1, this.calcPressRoc],
                ]}
              />
            </Grid>

            {fields.slice(3, 6).map((field) => (
              <Grid item={1} xs={4} className={classes.item}>
                <Graph fields={field} />
              </Grid>
            ))}

            <Grid item={1} xs={4} className={classes.item}>
              <MessageDisplaySquare />
            </Grid>
            {fields.slice(6).map((field) => (
              <Grid item={1} xs={4} className={classes.item}>
                <Graph fields={field} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Main);
