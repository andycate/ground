import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'fontsource-roboto';
import './App.css';

import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { updateConnState,
         startConnListen,
         startSensorListen } from './actions/connActions';

import Navbar from './Navbar';
import Graph from './Graph';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
  },
  container: {
    flexGrow: 1,
    height: '100%'
  },
  row: {
    height: '100%'
  },
  item: {
    height: '50%'
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false
    };
  }
  componentDidMount() {
    this.props.updateConnState();
    this.props.startConnListen();
    this.props.startSensorListen();
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
        <Grid container className={classes.root} justify='space-around'>
          <Grid item xs={12}>
            {/* <AppBar position='static' color='default'>
              <Toolbar>
                <IconButton
                  color="inherit"
                  onClick={e => this.setState({isDark: !this.state.isDark})}
                >
                  <Brightness4Icon />
                </IconButton>
              </Toolbar>
            </AppBar> */}
            <Navbar onThemeChange={isDark => this.setState({isDark})} isDark={this.state.isDark} />
          </Grid>
          <Grid item xs={12}>
            <Container maxWidth='xl' className={classes.container}>
              <Grid container spacing={3} className={classes.row}>
                <Grid item xs={6} className={classes.item}>
                  <Graph sensors={
                    [{
                      label: 'LOX TANK',
                      idx: 0,
                      index: 0,
                      color: '#7b1fa2'
                    },{
                      label: 'PROP TANK',
                      idx: 1,
                      index: 0,
                      color: '#d32f2f'
                    }]
                  } max={600} window={90} interval={80} label='Pressures'/>
                </Grid>
                <Grid item xs={6} className={classes.item}>
                  <Graph sensors={
                    [{
                      label: 'LOX INJECTOR',
                      idx: 2,
                      index: 0,
                      color: '#388e3c'
                    },{
                      label: 'PROP INJECTOR',
                      idx: 3,
                      index: 0,
                      color: '#1976d2'
                    }]
                  } max={600} window={90} interval={80} label='Pressures'/>
                </Grid>
                <Grid item xs={6} className={classes.item}>
                  <Graph sensors={
                    [{
                      label: 'PRESSURANT',
                      idx: 4,
                      index: 0,
                      color: '#f57c00'
                    }]
                  } max={0} window={90} interval={80} label='Pressures'/>
                </Grid>
                <Grid item xs={6} className={classes.item}>
                  <Graph sensors={
                    [{
                      label: 'BATTERY',
                      idx: 5,
                      index: 0,
                      color: '#00796b'
                    },
                    {
                      label: 'POWER',
                      idx: 5,
                      index: 1,
                      color: '#fbc02d'
                    }]
                  } max={24} window={90} interval={150} label='Power'/>
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({});
export default connect(
  mapStateToProps,
  { updateConnState,
    startConnListen,
    startSensorListen }
)(withStyles(styles)(App));
