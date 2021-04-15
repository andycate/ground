import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContent, Typography } from '@material-ui/core';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    

    this.props.handleClose();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { open } = this.props;
    return (
      <>
        <Dialog open={ open } onClose={ this.handleClose }>
          <DialogTitle>Settings</DialogTitle>
          <DialogContent>
            <Typography variant='h3'>
              Influx Database
            </Typography>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

export default Settings;
