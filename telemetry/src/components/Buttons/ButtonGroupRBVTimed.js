import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Grid, Button, IconButton, Box, TextField, Switch } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

import comms from "../../api/Comms";
import OpenCloseButtonGroup from "./OpenCloseButtonGroup";
import GroupLabel from "./GroupLabel";
import { addButtonEnabledListener, removeButtonEnabledListener } from "../../util";

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
  redSendButton: {
    color: theme.palette.error.main + " !important",
  },
});

class ButtonGroupRBVTimed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      openClicked: false,
      timeField: 0, // ms
      disabled: false,
    };

    this.updateStatus = this.updateStatus.bind(this);
    this.handleTimeFieldChange = this.handleTimeFieldChange.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.setClosed = this.setClosed.bind(this);
    this.setOpenTimed = this.setOpenTimed.bind(this);
    this.setClosedTimed = this.setClosedTimed.bind(this);
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

  setOpenTimed() {
    const { timeField } = this.state;
    const { timed_open } = this.props;
    timed_open(timeField);
  }

  setClosedTimed() {
    const { timeField } = this.state;
    const { timed_close } = this.props;
    timed_close(timeField);
  }

  componentDidMount() {
    const { field } = this.props;
    comms.addSubscriber(field, this.updateStatus);
    addButtonEnabledListener(this.props.buttonId, (enabled) => {
      this.setState({ disabled: !enabled });
    });
  }

  componentWillUnmount() {
    const { field } = this.props;
    comms.removeSubscriber(field, this.updateStatus);
    removeButtonEnabledListener(this.props.buttonId);
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
          <IconButton
            variant="contained"
            onClick={this.setClosedTimed}
            disabled={this.state.disabled || false}
            disableRipple
            className={classes.redSendButton}
            size="small"
          >
            <SendIcon />
          </IconButton>
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
            onClick={this.setOpenTimed}
            disabled={this.state.disabled || false}
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
            disabled={this.state.disabled || false}
          />
        </Grid>
      </GroupLabel>
    );
  }
}

export default withTheme(withStyles(styles)(ButtonGroupRBVTimed));
