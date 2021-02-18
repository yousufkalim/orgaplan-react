import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

export default function SubHeading({
  className,
  disableMargin,
  bold,
  ...props
}) {
  const useStyles = makeStyles((theme) => ({
    subHeading: {
      marginBottom: disableMargin ? 0 : 10,
      fontSize: theme.typography.pxToRem(18),
      color: theme.palette.primary.contrastText,
      fontWeight: bold ? "bold" : "normal",
    },
  }));
  const classes = useStyles();

  return (
    <Typography className={classes.subHeading + " " + className} {...props}>
      {props.primary}
    </Typography>
  );
}
