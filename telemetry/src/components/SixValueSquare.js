import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Card, CardContent, Grid } from "@material-ui/core";

import Field from "./Field";
import SquareControls from "./SquareControls";

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

class SixValueSquare extends Component {

  render() {
    const { children, classes, fields } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <SquareControls reset={this.props.reset} />
          <Grid container spacing={1} className={classes.container}>
            {fields.map((obj) => (
              <Grid item xs={4} className={classes.item}>
                <Field
                    field={obj[0]}
                    name={obj[1]}
                    unit={obj[2]}
                    decimals={obj[3] || 1}
                    threshold={obj[4] || null}
                    modifyValue={obj[5] || null}
                    thresholdColor={obj[6] || '#27AE60'}
                />
              </Grid>
            ))}
            {children}
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(SixValueSquare));
