import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Grid, Button, IconButton, Box, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

import comms from "../../api/Comms";
import OpenCloseButtonGroup from "./OpenCloseButtonGroup";
import GroupLabel from "./GroupLabel";

const styles = (theme) => ({
  spacer: {
    flexGrow: 1,
  },
  openButton: {
    backgroundColor: theme.palette.success.main + " !important",
    color: theme.palette.text.primary + " !important",
    borderColor: theme.palette.success.main + " !important",
    transition: "none",
  },
  openButtonOutline: {
    color: theme.palette.success.main + " !important",
    borderColor: theme.palette.success.main + " !important",
    transition: "none",
  },
  closedButton: {
    backgroundColor: theme.palette.error.main + " !important",
    color: theme.palette.text.primary + " !important",
    transition: "none",
  },
  closedButtonOutline: {
    color: theme.palette.error.main + " !important",
    transition: "none",
  },
  openStatusBox: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.success.main,
  },
  closedStatusBox: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.error.main,
  },
  txtField: {
    width: "4rem",
  },
});

class ButtonGroupRBVTimed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      openClicked: false,
      timeField: 0, // ms
    };

    this.updateStatus = this.updateStatus.bind(this);
    this.handleTimeFieldChange = this.handleTimeFieldChange.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.setClosed = this.setClosed.bind(this);
    this.setTime = this.setTime.bind(this);
  }

  updateStatus(timestamp, value) {
    this.setState({ status: value });
  }

  handleTimeFieldChange(e) {
    this.setState({ timeField: parseFloat(e.target.value) });
  }

  setOpen() {
    const { open } = this.props;
    this.setState({ openClicked: true });
    open();
  }

  setClosed() {
    const { close } = this.props;
    this.setState({ openClicked: false });
    close();
  }

  setTime() {
    const { timeField } = this.state;
    const { time } = this.props;
    time(timeField);
  }

  componentDidMount() {
    const { field } = this.props;
    comms.addSubscriber(field, this.updateStatus);
  }

  componentWillUnmount() {
    const { field } = this.props;
    comms.removeSubscriber(field, this.updateStatus);
  }

  render() {
    const { classes, theme, text, noClose } = this.props;
    const { status, openClicked, timeField } = this.state;
    let sColor = null;
    switch (status) {
      case 0:
        sColor = theme.palette.error.main;
        break;
      case 1:
        sColor = theme.palette.success.main;
        break;
      case 2:
        sColor = theme.palette.warning.main;
        break;
    }
    return (
      <GroupLabel text={text} barColor={sColor}>
        <Grid item xs={12}>
          <TextField
            type="number"
            step={10}
            value={timeField}
            onChange={this.handleTimeFieldChange}
            className={classes.txtField}
            inputProps={{
              step: 50,
            }}
          />
          <IconButton
            color="primary"
            variant="contained"
            onClick={this.setTime}
            disabled={this.props.disabled || false}
            disableRipple
            size="small"
          >
            <SendIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <OpenCloseButtonGroup
            isOpen={this.state.openClicked}
            setOpen={this.setOpen}
            setClosed={this.setClosed}
            disabled={this.props.disabled}
          />
        </Grid>
      </GroupLabel>
    );
  }
}

export default withTheme(withStyles(styles)(ButtonGroupRBVTimed));
