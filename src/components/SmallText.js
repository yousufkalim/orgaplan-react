import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

export default function SmallText(props) {
  const useStyles = makeStyles((theme) => ({
    text: {
      textDecoration: "none",
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.primary.contrastText,
      fontWeight: props.bold ? "bold" : "normal",
      marginBottom: props.disableMargin ? 0 : 10,
    },
  }));
  const classes = useStyles();

  return (
    <div>
      {props.to ? (
        <Link
          to={props.to}
          className={classes.text + " " + props.className}
          style={props.style}
        >
          {props.primary}
        </Link>
      ) : (
        <Typography
          className={classes.text + " " + props.className}
          style={props.style}
        >
          {props.primary}
        </Typography>
      )}
    </div>
  );
}
