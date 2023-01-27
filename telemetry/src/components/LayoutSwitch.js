import { Typography } from '@material-ui/core';
import { Component, useState } from 'react';
import { useLocation } from 'react-router-dom';


class LayoutSwitch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      config: props.config,
      hash: window.location.hash
    }
  }
  render() {
    const { hash, config } = this.state;
    return (
      <Typography variant='h6'>
        {hash}
        {JSON.stringify(config)}
      </Typography>
    )
  }
}

export default LayoutSwitch;