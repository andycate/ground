import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import Control from './Control';
import Aux1 from './Aux1';
import Aux2 from './Aux2';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path='/main' component={Main} />
        <Route path='/control' component={Control} />
        <Route path='/aux1' component={Aux1} />
        <Route path='/aux2' component={Aux2} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
