import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Card, CardContent, Grid, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

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

class ErrorSquare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {
    const { classes, openCreatePopup } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={1} className={classes.container} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <div style={{display: "block", marginLeft: "auto", marginRight: "auto"}}>
              <IconButton style={{display: "block", marginLeft: "auto", marginRight: "auto"}}
                  color="inherit"
                  onClick={ openCreatePopup }
              >
                <AddIcon />
              </IconButton>
            </div>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(ErrorSquare));
