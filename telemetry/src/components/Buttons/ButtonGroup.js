import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  ButtonGroup as MaterialButtonGroup,
  Box,
  Typography,
} from "@material-ui/core";

import comms from "../../api/Comms";
import OpenCloseButtonGroup from "./OpenCloseButtonGroup";
import GroupLabel from "./GroupLabel";
import { addButtonEnabledListener, removeButtonEnabledListener } from "../../util";

class ButtonGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commsOpenReading: false,
      btnOpen: false,
      disabled: false
    };

    this.updateOpen = this.updateOpen.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.setClosed = this.setClosed.bind(this);
  }

  updateOpen(timestamp, value) {
    this.setState({ commsOpenReading: value });
  }

  setOpen() {
    this.setState({ btnOpen: true });

    const { open } = this.props;
    open();
  }

  setClosed() {
    this.setState({ btnOpen: false });

    const { close } = this.props;
    close();
  }

  componentDidMount() {
    const { field } = this.props;
    comms.addSubscriber(field, this.updateOpen);
    addButtonEnabledListener(this.props.buttonId, (enabled) => {
      this.setState({ disabled: !enabled });
    });
  }

  componentWillUnmount() {
    const { field } = this.props;
    comms.removeSubscriber(field, this.updateOpen);
    removeButtonEnabledListener(this.props.buttonId);
  }

  render() {
    const { classes, theme, text, children } = this.props;
    const { commsOpenReading, btnOpen, disabled } = this.state;
    return (
      <GroupLabel
        text={text}
        barColor={
          commsOpenReading
            ? theme.palette.success.main
            : theme.palette.error.main
        }
      >
        <Grid item>
          <OpenCloseButtonGroup
            isOpen={btnOpen}
            setClosed={this.setClosed}
            setOpen={this.setOpen}
            disabled={disabled}
          />
        </Grid>
      </GroupLabel>
    );
  }
}

export default withTheme(ButtonGroup);
