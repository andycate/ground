import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App'
import Control from './Control'


class ViewManager extends Component {

  static Views() {
    return {
      graphs:  <App />,
      control: <Control />
    }
  }


  static View (props) {
    let name = props.location.search.substr(1);
    let view = ViewManager.Views()[name];
    if (view == null)
      throw new Error("View '" + name + "' is undefined");
    return view;
  }

  render() {
    return (
      <Router>
      <div>
      <Route path='/' component={ViewManager.View}/>
      </div>
      </Router>
    );
  }
}

export default ViewManager;
