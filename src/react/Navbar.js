import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import Brightness4Icon from '@material-ui/icons/Brightness4';

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  themeButton: {
    marginLeft: theme.spacing(2)
  },
  select: {
    marginLeft: theme.spacing(2)
  }
});

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      port: 0,
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
  componentDidMount = async () => {
    await this.refresh();
    window.setInterval(async () => {
      await this.refresh();
    }, 2000);
  }
  render() {
    const { classes } = this.props;
    return (
      <AppBar position='static' color='default'>
        <Toolbar>
          <div className={classes.grow}></div>
          <Button color='primary' variant='contained' disableElevation>
            Connect
          </Button>
          <Select className={classes.select} value={this.state.port} onChange={e => this.setState({port: parseInt(e.target.value)})}>
            {this.state.ports.map((p, i) => (
              <MenuItem value={i} key={i}>{p.path}</MenuItem>
            ))}
          </Select>
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
