import React, { Component } from 'react';

import { addBandwidthListener } from './actions/connActions';

class Bandwidth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bandwidth: 0
    };
  }
  componentDidMount() {
    addBandwidthListener((bandwidth) => {
      this.setState({ bandwidth });
    });
  }
  render() {
    return (
      <p className='lead'>%{(this.state.bandwidth * 100 / 57600).toString().substring(0, 5)}</p>
    );
  }
}

export default Bandwidth;
