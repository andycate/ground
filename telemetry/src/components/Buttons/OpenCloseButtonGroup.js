import React from "react";
import {
  Button,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  openButton: {
    backgroundColor: theme.palette.success.main + " !important",
    color: theme.palette.success.contrastText + " !important",
    transition: "none",
    borderRadius: "1em",
    fontWeight: "800"
  },
  openButtonOutline: {
    color: theme.palette.success.main + " !important",
    border: "1px solid " + theme.palette.success.main + " !important",
    transition: "none",
	  borderRadius: "1em",
  },
  closedButton: {
    backgroundColor: theme.palette.error.main + " !important",
    color: theme.palette.error.contrastText + " !important",
    transition: "none",
    borderRadius: "1em",
    fontWeight: "800"
  },
  closedButtonOutline: {
    color: theme.palette.error.main + " !important",
    border: "1px solid " + theme.palette.error.main + " !important",
    transition: "none",
	  borderRadius: "1em",
  },
  grayButton: {
    backgroundColor: theme.palette.neutral.main + " !important",
    color: theme.palette.neutral.contrastText + " !important",
    transition: "none",
    borderRadius: "1em",
    fontWeight: "800"
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
        className={isOpen ? classes.closedButtonOutline : classes.closedButton}
        onClick={setClosed}
        disabled={false}
        disableRipple
        size="small"
      >
        {props.failText || "Close"}
      </Button>
      <Button
        color="primary"
        variant="text"
        className={props.disabled ? (isOpen ? classes.grayButton : classes.grayButtonOutline) : (isOpen ? classes.openButton : classes.openButtonOutline)}
        onClick={setOpen}
        disabled={props.disabled || false}
        disableRipple
        size="small"
      >
        {props.successText || "Open"}
      </Button>
    </div>
  );
}
