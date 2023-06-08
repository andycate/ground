import React, { Component } from "react";
import "@fontsource/roboto";
import {
  createTheme,
  withStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import {Box, Container, Grid, Typography} from "@material-ui/core";

import Graph from "./Graph";
import SixValueSquare from "./SixValueSquare";

import MessageDisplaySquare from "./MessageDisplaySquare";
import ErrorSquare from "./ErrorSquare";
import FourButtonSquare from "./FourButtonSquare";
import LaunchButton from "./LaunchButton";
import ProgressBarsSquare from "./ProgressBarsSquare";
import RocketOrientation from "./RocketOrientation";
import Map from "./Map";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
  },
  container: {
    flexGrow: 1,
    position: "absolute",
    top: theme.spacing(6),
    bottom: "0px",
    padding: theme.spacing(1),
  },
  row: {
    height: "100%",
  },
  item: {
    height: "33%",
  }
});

class NineGrid extends Component {
  constructor(props) {
    super(props);
    this.windowConfig = props.windowConfig;
    this.config = props.config;
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={1} className={classes.row}>
            {
              this.windowConfig.slots.map(field => (
                <Grid item={1} xs={4} className={classes.item}>
                  {
                    (() => {
                      switch (field.type) {
                        case "logs":
                          return (
                            <MessageDisplaySquare />
                          )
                        case "six-square":
                          return (
                            <SixValueSquare fields={
                              field.values.map(value => [
                                value.field,
                                value.name,
                                value.units,
                                null,
                                null,
                                null,
                                null,
                                value.func
                              ])}
                            />
                          )
                        case "graph":
                          return (
                            <Graph fields={
                              field.values.map(value => ({
                                field: value.field,
                                name: value.name,
                                color: value.color,
                                unit: value.units
                              }))}
                            />
                          )
                        case "four-button":
                          return (
                            <FourButtonSquare fields={
                              field.buttons.map(value => [
                                value.id,
                                value.type,
                                value.name,
                                value.field,
                                value.actions,
                                value.safe || false,
                                value.green || []
                              ])}
                            />
                          )
                        case "launch":
                          return (
                            <LaunchButton mode={this.config.mode} />
                          )
                        case "progress":
                          return (
                            <ProgressBarsSquare fields={
                              field.values.map(value => ({
                                field: value.field,
                                name: value.name,
                                units: value.units,
                                color: value.color,
                                minValue: value.minValue,
                                delta: value.delta
                              }))}
                            />
                          )
                        case "orientation":
                          return (
                            <RocketOrientation
                              fieldQW={field.qw}
                              fieldQX={field.qx}
                              fieldQY={field.qy}
                              fieldQZ={field.qz}
                            />
                          )
                        case "gpsmap": 
                          return (
                            <Map 
                              gpsLatitude={field.gpsLatitude}
                              gpsLongitude={field.gpsLongitude}
                            />
                        )
                        default:
                          return (
                            <ErrorSquare error={`Field type "${field.type}" not found`} />
                          )
                      }
                    })()
                  }
                </Grid>
              ))
            }
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(NineGrid);
