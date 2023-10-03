import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Card, CardContent, Grid, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CreateSettings from "./CreateSettings";
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

class CreateSquare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateSettings: false
    }

    this.openCreateSettings = this.openCreateSettings.bind(this);
    this.closeCreateSettings = this.closeCreateSettings.bind(this);
  }

  openCreateSettings() {
    this.setState({showCreateSettings: true});
  }

  closeCreateSettings() {
    this.setState({showCreateSettings: false});
  }

  render() {
    const { classes, setSlotConfig } = this.props;
    const { showCreateSettings } = this.state;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <SquareControls reset={this.props.reset} locked={this.props.locked} />
          {
            !this.props.locked &&
            <Grid container spacing={1} className={classes.container} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
              <div style={{display: "block", marginLeft: "auto", marginRight: "auto"}}>
                <IconButton style={{display: "block", marginLeft: "auto", marginRight: "auto"}}
                    color="inherit"
                    onClick={ this.openCreateSettings }
                >
                  <AddIcon />
                </IconButton>
              </div>
            </Grid>
          }
        </CardContent>
        <CreateSettings open={showCreateSettings} closeCreateSettings={this.closeCreateSettings} setSlotConfig={setSlotConfig} />
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(CreateSquare));
