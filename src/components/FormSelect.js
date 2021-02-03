import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

export default function Input(props) {
  const theme = useTheme();

  const error = theme.palette.error.main;
  const primaryText = theme.palette.secondary.contrastText;

  const white = theme.palette.common.white;
  const color = props.error ? error : primaryText;
  const borderColor = props.error ? error : theme.palette.grey[100];

  const useStyles = makeStyles((theme) => ({
    root: {
      position: "relative",
      width: "100%",
    },
    select: {
      border: 0,
      outline: 0,
      height: 45,
      color: color,
      width: "100%",
      borderWidth: 1,
      display: "flex",
      overflow: "hidden",
      textAlign: "center",
      padding: "14px 12px",
      borderStyle: "solid",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: white,
      borderColor: borderColor,
      transition: "background-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
      "&::placeholder": {
        color: color,
      },
      [theme.breakpoints.down("sm")]: {
        width: 225,
      },
    },
    error: {
      color: error,
      fontWeight: 400,
      position: "absolute",
      fontSize: theme.typography.pxToRem(12),
    },
  }));
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${props.className}`} style={props.style}>
      <select
        name={props.name}
        value={props.value}
        selected={props.value}
        onChange={props.onChange}
        className={classes.select}
      >
        {props.placeholder && <option>{props.placeholder}</option>}
        {props.values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      {props.error !== "" && (
        <span className={classes.error}>{props.error}</span>
      )}
    </div>
  );
}
