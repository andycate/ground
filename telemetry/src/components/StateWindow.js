import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Box, Grid, Button } from '@material-ui/core';

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

const statusBox = {
  borderColor: 'text.secondary',
  // m: 1,
  border: 0.5,
};

class StateWindow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      state_num: 2
    };

    this.setOpen = this.setOpen.bind(this);
    this.setClosed = this.setClosed.bind(this);
  }

  setOpen() {
    const { state_num } = this.state;
    var next_state_num = state_num == 5 ? 5 : state_num + 1;
    this.setState({state_num: next_state_num});
    console.log(state_num);
  }

  setClosed() {
    const { state_num } = this.state;
    var next_state_num = state_num == 0 ? 0 : state_num - 1;
    this.setState({state_num: next_state_num});
    console.log(state_num);
  }



  render() {
    // const { classes, theme, text, onClick, isRed } = this.props;
    const { theme } = this.props;
    const { state_num } = this.state;
    return (
    <Grid container spacing={1} alignItems='center' style={{textAlign: 'center'}}>
      <Grid item xs={12}>
        <Box component="span" display="block">Procedure State</Box>
      </Grid>
      <Grid item xs={12}>
        <Box component="div" display="inline" p={1} m={1} bgcolor={ state_num == 0 ? '#e87917' : state_num > 0 ? theme.palette.success.main : 'background.paper'}>Setup</Box>
        <Box component="div" display="inline" p={1} m={1} bgcolor={ state_num == 1 ? '#e87917' : state_num > 1 ? theme.palette.success.main : 'background.paper'}>Pressurant Fill</Box>
        <Box component="div" display="inline" p={1} m={1} bgcolor={ state_num == 2 ? '#e87917' : state_num > 2 ? theme.palette.success.main : 'background.paper'}>Prop Fill</Box>
        <Box component="div" display="inline" p={1} m={1} bgcolor={ state_num == 3 ? '#e87917' : state_num > 3 ? theme.palette.success.main : 'background.paper'}>LOx Fill</Box>
        <Box component="div" display="inline" p={1} m={1} bgcolor={ state_num == 4 ? '#e87917' : state_num > 4 ? theme.palette.success.main : 'background.paper'}>Pre-Chill</Box>
      </Grid>
      <Grid item xs={12}>
        <Button
          color='primary'
          variant='contained'
          disableRipple
          size='small'
          onClick={this.setClosed}
        >
          Previous
        </Button>
        <Button
          color='primary'
          variant='contained'
          disableRipple
          size='small'
          onClick={this.setOpen}
        >
          Next
        </Button>
      </Grid>
    </Grid>

    );
  }
}

export default withTheme(withStyles(styles)(StateWindow));
