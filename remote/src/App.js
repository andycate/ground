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
        loxGems: false,
        propGems: false,
        HPS: false
      },
      connected: false,
      stale: false
    };
    this.timeSinceLastUpdate = 0;
    this.lastResponse = '';
  }

  componentDidMount() {
    window.setInterval(async () => {
      try {
        const res = await axios.get('/data', { transformResponse: (r) => r });
        if(res.data === this.lastResponse) {
          this.timeSinceLastUpdate += 300;
        } else {
          this.timeSinceLastUpdate = 0;
        }
        this.lastResponse = res.data;
        const stale = (this.timeSinceLastUpdate > 1000);
        const data = JSON.parse(res.data);
        Object.keys(data.sensors).forEach(k => {
          data.sensors[k] = Math.round(data.sensors[k]);
        });
        this.setState({...data, connected: true, stale});
      } catch(err) {
        this.setState({connected: false});
      }
    }, 300);
  }

  render() {
    const { sensors, valves, connected, stale } = this.state;
    return (
      <div className="App">
        <div style={{position: 'absolute', width: '6rem', height: '2rem', backgroundColor: connected?(stale?'orange':'green'):'red', margin: '1rem'}}>
        </div>
        <div className="Diagram">
          <img src={valves.HPS?high_pressure_open:high_pressure_closed}/>
          <div className="gn-tank">
            <img src={gas_tank} />
            <div className="top-center-gn2">GN2</div>
            <div className="centered-gn2">{sensors.highPressure}</div>
          </div>
          <img src={valves.loxGems?gems_open:gems_closed} />
          <div className="tank" >
            <img src={fluid_tank} />
            <div className="top-center">LOX</div>
            <div className="centered">{sensors.loxTank}</div>
          </div>
          <img src={valves.propGems?gems_open:gems_closed} />
          <div className="tank" >
            <img src={fluid_tank} />
            <div className="top-center">PROP</div>
            <div className="centered">{sensors.propTank}</div>
          </div>
          <img src={valves.loxTwoWay?two_way_open:two_way_closed} />
          <br />
          <div style={{marginLeft: '-1.5rem', marginRight: '-1.5rem', marginTop: '-1rem'}}>
            <img src={valves.loxFiveWay?lox_five_way_open:lox_five_way_closed} style={{width: '50%'}}/>
            <img src={valves.propFiveWay?prop_five_way_open:prop_five_way_closed} style={{width: '50%'}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
