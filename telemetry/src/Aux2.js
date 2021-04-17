import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Box, Container, Grid } from '@material-ui/core';

import Graph from './components/Graph';
import SixValueSquare from './components/SixValueSquare';

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
    // height: '100%'
    borderBottom: '0.5px solid',
    borderColor: theme.palette.text.primary
  },
  item: {
    height: '100%'
  },
});

class Aux2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
    };

    this.handleDarkMode = this.handleDarkMode.bind(this);
  }

  handleDarkMode(isDark) {
    this.setState({ isDark });
  }

  componentDidMount() {
    comms.connect();
    comms.addDarkModeListener(this.handleDarkMode);
  }

  componentWillUnmount() {
    // make sure that when there's a hot reload, we disconnect comms before its connected again
    comms.removeDarkModeListener(this.handleDarkMode);
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
          <Container maxWidth='xl' className={classes.container}>
            <Grid container={true} spacing={1} className={classes.row}>
              
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }
}

Aux2.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Aux2);
