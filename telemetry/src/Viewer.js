import React, { Component } from 'react';

import comms from './Comms';

class Viewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loxTankPT: 0.0
    };

    this.updateLoxTankPT = this.updateLoxTankPT.bind(this);
  }

  updateLoxTankPT(timestamp, value) {
    this.setState({ loxTankPT: value });
  }

  componentDidMount() {
    comms.addSubscriber('loxTankPT', this.updateLoxTankPT);
  }

  componentWillUnmount() {
    comms.removeSubscriber('loxTankPT', this.updateLoxTankPT);
  }

  render() {
    const { loxTankPT } = this.state;
    return (
      <div>
        { loxTankPT }
        <button onClick={comms.openLox2Way}>open lox2Way</button>
      </div>
    );
  }
}

export default Viewer;
