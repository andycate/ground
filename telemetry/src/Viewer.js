import React, { Component } from 'react';

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
    const { comms } = this.props;
    console.log(comms);
    comms.addSubscriber('loxTankPT', this.updateLoxTankPT);
  }

  componentWillUnmount() {
    const { comms } = this.props;
    comms.removeSubscriber('loxTankPT', this.updateLoxTankPT);
  }

  render() {
    const { loxTankPT } = this.state;
    const { comms } = this.props;
    return (
      <div>
        { loxTankPT }
        <button onClick={comms.openLox2Way}>open lox2Way</button>
      </div>
    );
  }
}

export default Viewer;
