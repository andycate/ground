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

      sixSquareField: ["", "", "", "", "", ""],
      sixSquareName: ["", "", "", "", "", ""],
      sixSquareUnits: ["", "", "", "", "", ""],

      orientationW: "",
      orientationX: "",
      orientationY: "",
      orientationZ: "",

      mapLatitude: "",
      mapLongitude: ""
    };
	}

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  generateConfig() {
    switch (this.state.type) {
      case "logs":
        return {
          type: "logs"
        };
      case "six-square":
        let sixSquareFields = [];
        for (let i = 0; i < 6; i ++) {
          if (this.state.sixSquareField[i] === "") {
            sixSquareFields.push({
              field: null
            });
          }
          else {
            sixSquareFields.push({
              field: this.state.sixSquareField[i],
              name: this.state.sixSquareName[i],
              units: this.state.sixSquareUnits[i]
            });
          }
        }
        return {
          type: "six-square",
          values: sixSquareFields
        }
      case "launch":
        return {
          type: "launch"
        }
      case "orientation":
        return {
          type: "orientation",
          qw: this.state.orientationW,
          qx: this.state.orientationX,
          qy: this.state.orientationY,
          qz: this.state.orientationZ
        };
      case "gpsmap":
        return {
          type: "gpsmap",
          gpsLatitude: this.state.mapLatitude,
          gpsLongitude: this.state.mapLongitude
        };
      default:
        return {};
    }
  }

  render() {
    const { classes, open, closeCreateSettings, setSlotConfig } = this.props;
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
                      return (null)
                    case "six-square":
                      return (
                        <div style={{display: "grid", gridTemplateColumns: "auto auto auto", rowGap: "20px"}}>
                          {
                            [0, 1, 2, 3, 4, 5].map(index => (
                              <div style={{float: "left"}}>
                                <TextField
                                  value={this.state.sixSquareField[index]}
                                  label="field"
                                  onChange={(e) => {
                                    let newFields = [...this.state.sixSquareField];
                                    newFields[index] = e.target.value;
                                    this.setState({sixSquareField: newFields});
                                  }}
                                  className={classes.fields}
                                />
                                <TextField
                                  value={this.state.sixSquareName[index]}
                                  label="name"
                                  onChange={(e) => {
                                    let newNames = [...this.state.sixSquareName];
                                    newNames[index] = e.target.value;
                                    this.setState({sixSquareName: newNames});
                                  }}
                                  className={classes.fields}
                                />
                                <TextField
                                  value={this.state.sixSquareUnits[index]}
                                  label="units"
                                  onChange={(e) => {
                                    let newUnits = [...this.state.sixSquareUnits];
                                    newUnits[index] = e.target.value;
                                    this.setState({sixSquareUnits: newUnits});
                                  }}
                                  className={classes.fields}
                                />
                              </div>
                            ))
                          }
                        </div>
                      )
                    case "graph":
                      return (null)
                    case "four-button":
                      return (null)
                    case "launch":
                      return (null)
                    case "orientation":
                      return (
                        <>
                          <TextField
                            value={this.state.orientationW}
                            label="qw field"
                            onChange={(e) => this.setState({orientationW: e.target.value})}
                            className={classes.fields}
                          />
                          <TextField
                            value={this.state.orientationX}
                            label="qx field"
                            onChange={(e) => this.setState({orientationX: e.target.value})}
                            className={classes.fields}
                          />
                          <TextField
                            value={this.state.orientationY}
                            label="qy field"
                            onChange={(e) => this.setState({orientationY: e.target.value})}
                            className={classes.fields}
                          />
                          <TextField
                            value={this.state.orientationZ}
                            label="qz field"
                            onChange={(e) => this.setState({orientationZ: e.target.value})}
                            className={classes.fields}
                          />
                        </>
                      )
                    case "gpsmap":
                      return (
                        <>
                          <TextField
                            value={this.state.gpsLatitude}
                            label="latitude field"
                            onChange={(e) => this.setState({mapLatitude: e.target.value})}
                            className={classes.fields}
                          />
                          <TextField
                            value={this.state.gpsLongitude}
                            label="longitude field"
                            onChange={(e) => this.setState({mapLongitude: e.target.value})}
                            className={classes.fields}
                          />
                        </>
                      )
                    default:
                      return (null)
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
            setSlotConfig(this.generateConfig());
          } } color="success">
            Set
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withTheme(withStyles(styles)(CreateSettings));
