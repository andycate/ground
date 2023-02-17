import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Card, CardContent, Grid, useTheme } from "@material-ui/core";

import Field from "./Field";
import ButtonGroup from "./Buttons/ButtonGroup";
import ButtonGroupRBVTimed from "./Buttons/ButtonGroupRBVTimed";
import { buttonAction } from "../util";
import SwitchButton from "./Buttons/SwitchButton";
import BigButton from "./Buttons/BigButton";

const styles = (theme) => ({
  root: {
    height: "100%",
  },
  cardContent: {
    height: "100%",
    padding: "8px",
    paddingBottom: "8px !important",
  },
  container: {
    height: "100%",
  },
  item: {
    height: "50%",
    textAlign: "center",
  },
});

class LaunchButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, classes, fields } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={1} className={classes.container}>
		  <Grid item xs={12}>
			<BigButton
				disabled={this.launchDisabled}
				onClick={this.beginLaunchSequence}
				text="Launch"
			/>
			</Grid>
			<Grid item xs={12}>
			<BigButton
				onClick={this.abortAll}
				text="Abort"
				isRed
			/>
			</Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(LaunchButton));
