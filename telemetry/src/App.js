import React, { Component } from 'react';
import '@fontsource/roboto';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';

import Comms from './Comms';
import Viewer from './Viewer';

const { ipcRenderer } = window;
const comms = new Comms(ipcRenderer);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false
    };

    this.subscribeTo = this.subscribeTo.bind(this);
    this.unsubscribeTo = this.unsubscribeTo.bind(this);
  }

  subscribeTo(field, callback) {
    comms.addSubscriber(field, callback);
  }

  unsubscribeTo(field, callback) {
    comms.removeSubscriber(field, callback);
  }

  componentWillUnmount() {
    // make sure that when there's a hot reload, we disconnect comms before its connected again
    comms.destroy();
  }

  render() {
    const theme = createMuiTheme({
      palette: {
        type: this.state.isDark ? 'dark' : 'light'
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Box>
          <Viewer comms={comms}/>
        </Box>
      </ThemeProvider>
    );
  }
}

export default App;
