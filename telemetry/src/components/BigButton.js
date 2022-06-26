import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const styles = theme => ({
  thiccRed: {
    backgroundColor: theme.palette.error.main + '!important',
    color: theme.palette.text.main + '!important',
    width: '100%',
    fontSize: '3rem',
    transition: 'none',
  },
  thiccOrange: {
    backgroundColor: '#CCCC00' + '!important',
    color: theme.palette.text.main + '!important',
    width: '100%',
    fontSize: '3rem',
    transition: 'none',
  }
});

class BigButton extends Component {
  render() {
    const { classes, theme, text, onClick, isRed } = this.props;
    return (
      <Button onClick={onClick} color='primary' variant='contained' disableRipple className={isRed ? classes.thiccRed : classes.thiccOrange}>{text}</Button>
    );
  }
}

export default withTheme(withStyles(styles)(BigButton));
