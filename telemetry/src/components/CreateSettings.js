import React, { Component } from 'react';
import { withTheme, withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContent, DialogActions, Button, Typography, TextField, Select, MenuItem } from '@material-ui/core';

const styles = theme => ({
  head: {
    // display: 'inline',
    // borderBottom: '0.5px solid gray'
  },
  fields: {
    marginTop: '1rem',
    marginRight: '1rem',
    width: '18ch',
  },
  connectButton: {
    marginTop: theme.spacing(2)
  },
  connectedButton: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
});

class CreateSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "logs",

      gpsLatitude: "",
      gpsLongitude: ""
    };
	}

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  setConfig() {
    console.log(this.state.type);
  }

  render() {
    const { classes, open, closeCreateSettings } = this.props;
    const {
      type
    } = this.state;
    return (
      <Dialog open={ open } onClose={ closeCreateSettings }>
        <DialogTitle>Create</DialogTitle>
        <DialogContent>
          {/* <Typography variant='subtitle1' className={ classes.head }>Create</Typography> */}
          <form noValidate>
            <div>
              <Select
                value={type}
                label="type"
                onChange={(e) => this.setState({type: e.target.value})}
              >
                <MenuItem value={"logs"}>Logs</MenuItem>
                <MenuItem value={"six-square"}>Six-Square</MenuItem>
                <MenuItem value={"graph"}>Graph</MenuItem>
                <MenuItem value={"four-button"}>Four-Button</MenuItem>
                <MenuItem value={"launch"}>Launch</MenuItem>
                <MenuItem value={"orientation"}>Orientation</MenuItem>
                <MenuItem value={"gpsmap"}>Map</MenuItem>
              </Select>
            </div>
            <div>
              {
                (() => {
                  switch (type) {
                    case "logs":
                      return (null);
                    case "six-square":
                      return (null);
                    case "graph":
                      return (null);
                    case "four-button":
                      return (null);
                    case "launch":
                      return (null);
                    case "orientation":
                      return (null);
                    case "gpsmap":
                      return (
                        <TextField
                          value={this.state.gpsLatitude}
                          label="latitude field"
                          onChange={(e) => this.setState({gpsLatitude: e.target.value})}
                        />
                      );
                    default:
                      return (null);
                  }
                })()
              }
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={ closeCreateSettings } color="error">
            Cancel
          </Button>
          <Button onClick={ () => {
            closeCreateSettings();
            this.setConfig();
          } } color="success">
            Set
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withTheme(withStyles(styles)(CreateSettings));
