import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Card, CardContent, Grid } from "@material-ui/core";

import Field from "./Field";

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
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, fields } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={1} className={classes.container}>
            {fields.map((obj) => (
              <Grid item xs={4} className={classes.item}>
                <Field
                  name={obj.name}
                  field={obj.field}
                  unit={obj.unit}
                  decimals={obj.decimals}
                  threshold={obj.threshold}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(SixValueSquare));
