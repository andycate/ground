import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const styles = theme => ({
  thiccRed: {
    backgroundColor: theme.palette.error.main + '!important',
    color: theme.palette.text.main + '!important',
    width: '100%',
    fontSize: '3rem'
  },
  thiccOrange: {
    backgroundColor: theme.palette.warning.main + '!important',
    color: theme.palette.text.main + '!important',
    width: '100%',
    fontSize: '3rem'
  }
});

class BigButton extends Component {
  render() {
    const { classes, theme, text, onClick, isRed } = this.props;
    return (
      <Button onClick={onClick} color='primary' variant='contained' className={isRed ? classes.thiccRed : classes.thiccOrange}>{text}</Button>
    );
  }
}

export default withTheme(withStyles(styles)(BigButton));
