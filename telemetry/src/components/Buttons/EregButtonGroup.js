import React from "react";
import {
  Button,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  fuelButtonOutline: {
    color: theme.palette.fuel.main + " !important",
    border: "1px solid " + theme.palette.fuel.main + " !important",
    transition: "none",
	  borderRadius: "1em",
  },
  loxButtonOutline: {
    color: theme.palette.lox.main + " !important",
    border: "1px solid " + theme.palette.lox.main + " !important",
    transition: "none",
	  borderRadius: "1em",
  },
  grayButtonOutline: {
    color: theme.palette.neutral.main + " !important",
    border: "1px solid " + theme.palette.neutral.main + " !important",
    transition: "none",
	  borderRadius: "1em",
  },
}));

export default function OpenCloseButtonGroup({
  isOpen,
  setClosed,
  setOpen,
  ...props
}) {
  const classes = useStyles();
  return (
    <div>
      <Button
        color="primary"
        variant="text"
        className={props.disabled ? classes.grayButtonOutline : classes.loxButtonOutline}
        onClick={setClosed}
        disabled={props.disabled || false}
        disableRipple
        size="small"
      >
        {"O-Reg"}
      </Button>
      <Button
        color="primary"
        variant="text"
        className={props.disabled ? classes.grayButtonOutline : classes.fuelButtonOutline}
        onClick={setOpen}
        disabled={props.disabled || false}
        disableRipple
        size="small"
      >
        {"F-Reg"}
      </Button>
    </div>
  );
}
