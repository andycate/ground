import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';

import comms from './api/Comms';
import { Button } from '@material-ui/core';

const styles = theme => ({
});

class WindowSelector extends Component {
  render() {
    const { classes } = this.props;
    const theme = createMuiTheme({
      palette: {
        type: 'light'
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Box>
          <Button onClick={comms.openMainWindows}>Main</Button>
          <Button onClick={comms.openAuxWindows}>Aux</Button>
        </Box>
      </ThemeProvider>
    );
  }
}

WindowSelector.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(WindowSelector);
