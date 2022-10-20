import React, { Component } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import "./index.css";
import WindowSelector from "./WindowSelector";
import Main from "./Main";
import Control from "./Control";
import Aux1 from "./Aux1";
import Aux2 from "./Aux2";
import { ThemeProvider, createTheme, CssBaseline } from "@material-ui/core";
import Settings from "./components/Settings";
import Navbar from "./components/Navbar";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isDark: false,
      showSettings: false,
    };

    this.changeLightDark = this.changeLightDark.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
  }

  changeLightDark() {
    // comms.setDarkMode(!this.state.isDark);
    this.setState({ isDark: !this.state.isDark });
  }
  openSettings() {
    this.setState({ showSettings: true });
  }

  closeSettings() {
    this.setState({ showSettings: false });
  }

  render() {
    const theme = createTheme({
      palette: {
        type: this.state.isDark ? "dark" : "light",
        primary: {
          main: "#43a047",
          darker: "#388e3c",
          contrastText: "#fff",
        },
        success: {
          main: "#43a047",
          darker: "#388e3c",
          contrastText: "#fff",
        },
        secondary: {
          main: "#1976d2",
          darker: "#115293",
          contrastText: "#fff",
        },
        neutral: {
          main: "#64748B",
          contrastText: "#fff",
        },
      },
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorSchema />
        <Settings
          open={this.state.showSettings}
          closeSettings={this.closeSettings}
        />
        <Navbar
          changeLightDark={this.changeLightDark}
          openSettings={this.openSettings}
        />
        <HashRouter>
          <Switch>
            <Route path="/selector" exact component={WindowSelector} />
            <Route path="/main" exact component={Main} />
            <Route path="/control" exact component={Control} />
            <Route path="/aux1" exact component={Aux1} />
            <Route path="/aux2" exact component={Aux2} />
          </Switch>
        </HashRouter>
      </ThemeProvider>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
