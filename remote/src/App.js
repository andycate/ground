import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sensors: {}
    };
  }
  componentDidMount() {
    window.setInterval(async () => {
      console.log('ere')
      const res = await axios.get('/data');
      this.setState({sensors: res.data});
    }, 1000);
  }
  render() {
    return (
      <div className="App">
        {this.state.sensors.loxTank}
      </div>
    );
  }
}

export default App;
