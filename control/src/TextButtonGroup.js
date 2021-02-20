import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'fontsource-roboto'

import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

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

class TextButtonGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openClicked: false,
    };
  }


  sendVal = () => {
    this.props.send(this.state.textVal)
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
          <TextField label='value' value={this.state.textVal} onChange={e => this.setState({textVal: e.target.value})}/>
        </Grid>
        <Grid item >
          <Button
          color='primary'
          variant='contained'
          onClick={(e) => this.sendVal()}
          >
            Send
          </Button>
        </Grid>
        <br></br>
      </Grid>
    )
  }

}

TextButtonGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};
export default withStyles(styles, {withTheme: true})(TextButtonGroup);
