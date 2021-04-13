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
    const { subscribeTo } = this.props;
    subscribeTo('loxTankPT', this.updateLoxTankPT);
  }

  componentWillUnmount() {
    const { unsubscribeTo } = this.props;
    unsubscribeTo('loxTankPT', this.updateLoxTankPT);
  }

  render() {
    const { loxTankPT } = this.state;
    return (
      <div>
        { loxTankPT }
      </div>
    );
  }
}

export default Viewer;
