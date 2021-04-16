import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';

import comms from '../api/Comms';

const procedures = [
  {
    id: 1,
    desc: '(T - 45 Minutes) Pressurant Fill',
    sub: [
      {
        id: 1,
        desc: 'Fill Pressurant Tank'
      },
      {
        id: 2,
        desc: 'Fill Dome Port Pressure'
      },
    ],
  },
  {
    id: 2,
    desc: '(T - 25 Minutes) Propellant Fill',
    sub: [
      {
        id: 1,
        desc: 'Connect Propane Fill QD'
      },
      {
        id: 2,
        desc: 'Connect LOx Fill QD'
      },
      {
        id: 3,
        desc: 'Connect Propane Prechill line'
      },
      {
        id: 4,
        desc: 'Connect LOx Prechill line'
      },
      {
        id: 5,
        desc: 'Ensure all remote-actuated ball valves are closed'
      },
      {
        id: 6,
        desc: 'Open dewar valve'
      },
      {
        id: 7,
        desc: 'Open propane valve'
      },
      {
        id: 8,
        desc: 'Open 6000 psi pressurant tank valve'
      },
      {
        id: 9,
        desc: 'Open purge tank valve'
      },
      {
        id: 10,
        desc: 'All but two personnel leave the pad'
      },
      {
        id: 11,
        desc: 'Open Purge Flow RBV'
      },
      {
        id: 12,
        desc: 'Open Propane GEMs'
      },
      {
        id: 13,
        desc: '(T - 22 Minutes)Open Propane Flow RBV to begin Propane fill'
      },
      {
        id: 14,
        desc: 'Close Propane Flow RBV once appropriate fill level is reached on the Propane tank'
      },
      {
        id: 15,
        desc: 'Open Propane Vent RBV to vent Propane fill line'
      },
      {
        id: 16,
        desc: '( T - 10 Minutes) Open LOx Flow RBV to begin LOx fill'
      },
      {
        id: 17,
        desc: 'Close LOx Flow RBV once appropriate fill level is reached in the LOx Tank'
      },
      {
        id: 18,
        desc: 'Open LOx Vent RBV to vent LOx fill line'
      },
      {
        id: 19,
        desc: '(T - 3 Minutes) Disconnect LOx Tank Vent RQD'
      },
      {
        id: 20,
        desc: 'Disconnect Propane RQD'
      },
      {
        id: 21,
        desc: 'Disconnect LOx RQD'
      },
      {
        id: 22,
        desc: 'Purge should still be going, pressurant QD still attached; everything else should be detached/closed'
      },
    ],
  },
  {
    id: 3,
    desc: '(T - 2 Minutes) Go-for-launch Checks',
    sub: [
      {
        id: 1,
        desc: 'Avionics/comms checkout and signoff'
      },
      {
        id: 2,
        desc: 'Propulsion/systems checkout and signoff',
        sub: [
          {
            id: 1,
            desc: 'Manual tank pressure checks'
          },
          {
            id: 2,
            desc: 'Dome pressure'
          },
          {
            id: 3,
            desc: 'TC Checks'
          },
        ],
      },
      {
        id: 3,
        desc: 'All personnel clear the pad',
        sub: [
          {
            id: 1,
            desc: 'Put igniter in'
          },
          {
            id: 2,
            desc: 'Designated person turns pad igniter key to "ON" position'
          }
        ],
      },
    ],
  },
  {
    id: 4,
    desc: '(T - 1 Minutes) Startup',
    sub: [
      {
        id: 1,
        desc: 'Close Purge Flow RBV'
      },
      {
        id: 2,
        desc: 'Open Pre-chill Flow RBV to begin Pre-chill'
      },
      {
        id: 3,
        desc: '(T - 45 seconds) Open HP solenoid to pressurize propellant tanks'
      },
      {
        id: 4,
        desc: 'Close HP solenoid'
      },
      {
        id: 5,
        desc: 'Open Pressurant Flow RBV to re-press the pressurant tank'
      },
      {
        id: 6,
        desc: 'Disconnect Pressurant RQD'
      },
      {
        id: 7,
        desc: '( T - 6 seconds) Close Pre-chill Flow RBV'
      },
      {
        id: 8,
        desc: 'Disconnect Propane Prechill RQD'
      },
      {
        id: 9,
        desc: 'Disconnect LOx Prechill RQD'
      },
      {
        id: 10,
        desc: 'Turn dashboard igniter key to "ON" position'
      },
      {
        id: 11,
        desc: '(T - 4 Seconds) Begin flow start valve opening procedure'
      },
    ],
  },
  {
    id: 5,
    desc: '(T - 3 Seconds) Ignition',
    sub: [
      {
        id: 1,
        desc: '(T - 2.327 seconds) High Pressure open'
      },
      {
        id: 2,
        desc: 'Both GEMS close'
      },
      {
        id: 3,
        desc: '(T - 1.327 seconds) Ignitor start'
      },
      {
        id: 4,
        desc: 'Visually confirm ignitor start'
      },
      {
        id: 5,
        desc: '2-way open'
      },
      {
        id: 6,
        desc: '(T - .127 seconds) LOX open'
      },
      {
        id: 7,
        desc: '(T - 0 seconds) Prop open'
      },
      {
        id: 8,
        desc: '(T + 0.5 seconds) 2-way close'
      },
    ],
  },
  {
    id: 6,
    desc: '(T + 10 Seconds) Vehicle Securing',
    sub: [
      {
        id: 1,
        desc: '(T + X seconds) X = burn time'
      },
      {
        id: 2,
        desc: '(T + X seconds) 2-way open'
      },
      {
        id: 3,
        desc: 'Prop close'
      },
      {
        id: 4,
        desc: '(T + X.2 seconds) LOX close'
      },
      {
        id: 5,
        desc: '2-way close'
      },
      {
        id: 6,
        desc: 'High Pressure close'
      },
      {
        id: 7,
        desc: 'Both GEMS open'
      },
    ],
  },
];

const styles = theme => ({
  
});

class Procedures extends Component {
  render() {
    return (<div/>);
  }
}

export default withTheme(withStyles(styles)(Procedures));
