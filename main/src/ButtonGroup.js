import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'fontsource-roboto'

import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import comms from './comms';

const styles = theme => ({
  openButton: {
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important',
    borderColor: theme.palette.success.main + ' !important'
  },
  openButtonOutline: {
    color: theme.palette.success.main + ' !important',
    borderColor: theme.palette.success.main + ' !important'
  },
  closedButton: {
    backgroundColor: theme.palette.error.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
  closedButtonOutline: {
    color: theme.palette.error.main + ' !important'
  },
  openStatusBox: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.success.main
  },
  closedStatusBox: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.error.main
  }
});

const statusBox = {
  borderColor: 'text.secondary',
  m: 1,
  border: 0.5,
  style: { width: '9rem', height: '1rem' },
};

class ButtonGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      isDark: false
    };
  }

  componentDidMount = beans => {

  };

  change = async (state) => {
    this.setState({open: state});
    const b = await comms.sendPacket(this.props.id, state ? [1] : [0]);

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
      <Grid item container spacing={1} direction="column" alignItems='center' xs={12*this.props.width}>
        <Grid item>
          <Box component="span" display="block">{this.props.text}</Box>
        </Grid>
        <Grid item>
          <Box borderRadius={4} {...statusBox} bgcolor={this.props.valveState ? theme.palette.success.main : theme.palette.error.main}/>
        </Grid>
        <Grid item >
          <Button
          color='secondary'
          variant='outlined'
          className={!this.state.open ? classes.closedButton : classes.closedButtonOutline}
          onClick={(e) => this.change(false)}
          >
            Close
          </Button>
          <Button
          color='primary'
          variant='outlined'
          className={this.state.open ? classes.openButton : classes.openButtonOutline}
          onClick={(e) => this.change(true)}
          >
            Open
          </Button>
        </Grid>
        <br></br>
      </Grid>
      </ThemeProvider>
    )
  }

}

ButtonGroup.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ButtonGroup);
