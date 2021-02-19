import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'fontsource-roboto'

import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

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
      openClicked: false,
    };
  }

  open = () => {
    this.props.send(true);
    this.setState({openClicked: true});
  }

  close = () => {
    this.props.send(false);
    this.setState({openClicked: false});
  }

  render() {
    const { classes, theme, open, text, width } = this.props;
    const { openClicked } = this.state;
    return (
      <Grid item container spacing={1} direction="column" alignItems='center' xs={12*width}>
        <Grid item>
          <Box component="span" display="block">{text}</Box>
        </Grid>
        <Grid item>
          <Box borderRadius={4} {...statusBox} bgcolor={open ? theme.palette.success.main : theme.palette.error.main}/>
        </Grid>
        <Grid item >
          <Button
          color='secondary'
          variant='outlined'
          className={!openClicked ? classes.closedButton : classes.closedButtonOutline}
          onClick={(e) => this.close()}
          disabled={this.props.disabled || false}
          >
            {this.props.failText || "Close"}
          </Button>
          <Button
          color='primary'
          variant='outlined'
          className={openClicked ? classes.openButton : classes.openButtonOutline}
          onClick={(e) => this.open()}
          disabled={this.props.disabled || false}
          >
            {this.props.successText || "Open"}
          </Button>
        </Grid>
        <br></br>
      </Grid>
    )
  }

}

ButtonGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};
export default withStyles(styles, {withTheme: true})(ButtonGroup);
