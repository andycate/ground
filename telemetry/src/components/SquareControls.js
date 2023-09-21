import React, { Component } from "react";

import { withTheme } from "@material-ui/core/styles";

import OpenWithIcon from "@material-ui/icons/OpenWith";
import CloseIcon from "@material-ui/icons/Close";

class SquareControls extends Component {

  render() {
    const { reset, locked } = this.props;
    if (!locked) {
      return (
        <span style={{zIndex: 100}} className="squareControls">
          <OpenWithIcon width={10} className="handle" style={{position: "absolute", right: 10, top: 10, cursor: "grab"}} />
          <CloseIcon width={10} style={{position: "absolute", right: 40, top: 10, cursor: "pointer"}} onClick={reset} />
        </span>
      );
    }
    return (null);
  }
}

export default withTheme(SquareControls);
