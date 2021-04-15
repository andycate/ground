import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';

import comms from './api/Comms';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
  },
  container: {
    flexGrow: 1,
    height: '100vh',
    padding: theme.spacing(1)
  },
  row: {
    height: '100%'
  },
  item: {
    height: '33%'
  },
  navbarGrid: {
    // height: theme.spacing(2)
  }
});

class Aux2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
      settingsOpen: false,
    };

    this.closeSettings = this.closeSettings.bind(this);
  }

  closeSettings() {
    this.setState({ settingsOpen: false });
  }

  componentDidMount() {
    comms.connect();
  }

  componentWillUnmount() {
    // make sure that when there's a hot reload, we disconnect comms before its connected again
    comms.destroy();
  }

  render() {
    const { classes } = this.props;
    const theme = createMuiTheme({
      palette: {
        type: this.state.isDark ? 'dark' : 'light'
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Box>
        </Box>
      </ThemeProvider>
    );
  }
}

Aux2.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Aux2);
