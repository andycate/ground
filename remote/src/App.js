import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import fluid_tank from './images/liquid_tank.svg'
import gas_tank from './images/gas_tank.svg'
import pt from './images/pt.svg'
import gems_closed from './images/GEMS_closed.svg'
import gems_open from './images/GEMS_open.svg'
import high_pressure_closed from './images/High_Pressure_closed.svg'
import high_pressure_open from './images/High_Pressure_open.svg'
import two_way_closed from './images/2_way_closed.svg'
import two_way_open from './images/2_way_open.svg'
import prop_five_way_closed from './images/prop_5_way_closed.svg'
import prop_five_way_open from './images/prop_5_way_open.svg'
import lox_five_way_closed from './images/lox_5_way_closed.svg'
import lox_five_way_open from './images/lox_5_way_open.svg'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sensors: {
        loxTank: 0,
        propTank: 0,
        loxInjector: 0,
        propInjector: 0,
        highPressure: 0,
        battery: 0,
        wattage: 0
      },
      valves: {
        loxTwoWay: false,
        propTwoWay: false,
        loxFiveWay: false,
        propFiveWay: false,
        loxGems: gems_closed,
        propGems: gems_closed,
        HPS: high_pressure_closed
      },
      date: new Date(),
      test: 0
    };

    this.ims = {
      closed: {
        HPS: high_pressure_closed,
        loxGems: gems_closed,
        propGems: gems_closed,
        loxTwoWay: two_way_closed,
        propTwoWay: gems_closed,
        loxFiveWay: lox_five_way_closed,
        propFiveWay: prop_five_way_closed,
      },
      open: {
        HPS: high_pressure_open,
        loxGems: gems_open,
        propGems: gems_open,
        loxTwoWay: two_way_open,
        propTwoWay: gems_open,
        loxFiveWay: lox_five_way_open,
        propFiveWay: prop_five_way_open,
      }
    }
  }

  componentDidMount() {
    window.setInterval(async () => {
      console.log('ere')
      const res = await axios.get('/data');
      // Set valve image according to state
      var valves = res.data.valves;
      for (var key of Object.keys(valves)) {
        if (Boolean(valves[key])) {
          valves[key] = this.ims['open'][key];
        } else {
          valves[key] = this.ims['closed'][key];
        }
      }
      this.setState({valves: valves});
      // Round sensor readings for display
      var sensors = res.data.sensors;
      for (var key of Object.keys(sensors)) {
        sensors[key] = Math.round(sensors[key]);
      }
      this.setState({sensors: sensors});
    }, 1000);

    this.timer = setInterval(
      () => this.tick(),
      1000
    );

  }

  tick() {
    this.setState({
      date: new Date()
    });
    console.log("testing")
  }




  render() {
    // {this.state.date.toLocaleTimeString()}{JSON.stringify(this.state)}

    let gems_styles = {
      width: '50px',
      height: '50px',
      overflow: 'hidden',
    };
    let gems_style = {
      width: '50%'
    };
    return (
      <div className="App">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <div className="test">
        </div>

        <div class="Diagram">
          <img src={this.state.valves.HPS}/>
          <div class="tank" >
            <img src={gas_tank} />
            <div class="top-center-gn2">GN2</div>
            <div class="centered-gn2">{this.state.sensors.highPressure}</div>
          </div>
          <img src={this.state.valves.loxGems} />
          <div class="tank" >
            <img src={fluid_tank} />
            <div class="top-center">LOX</div>
            <div class="centered">{this.state.sensors.loxTank}</div>
          </div>
          <img src={this.state.valves.propGems} />
          <div class="tank" >
            <img src={fluid_tank} />
            <div class="top-center">PROP</div>
            <div class="centered">{this.state.sensors.propTank}</div>
          </div>
          <img src={this.state.valves.loxTwoWay} />
          <br />
          <img src={this.state.valves.loxFiveWay} style={gems_style}/>
          <img src={this.state.valves.propFiveWay} style={gems_style}/>
        </div>
      </div>
    );
  }
}

export default App;
