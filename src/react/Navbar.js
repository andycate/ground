import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Brightness4Icon from '@material-ui/icons/Brightness4';

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  themeButton: {
    marginLeft: theme.spacing(2)
  }
});

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      port: 'yeet1',
      ports: [],
      loading: true
    };
  }
  refresh = async () => {
    this.setState({loading: true});
    const ports = await this.props.getPorts();
    console.log(ports);
    this.setState({
      ports,
      loading: false
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <AppBar position='static' color='default'>
        <Toolbar>
          <div className={classes.grow}></div>
          <Tooltip title='Select serial port'>
            <Select value={this.state.port}>
              <MenuItem value='yeet1'>Ten</MenuItem>
              <MenuItem value='yeet2'>Twenty</MenuItem>
            </Select>
          </Tooltip>
          <Tooltip title='Toggle light/dark theme'>
            <IconButton
              className={classes.themeButton}
              color="inherit"
              onClick={e => this.props.onThemeChange(!this.props.isDark)}
            >
              <Brightness4Icon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withTheme(withStyles(styles)(Navbar));
