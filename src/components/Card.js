import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: 15,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxShadow: theme.shadows[25],
    justifyContent: "space-between",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
  },
}));

const Card = (props) => {
  const classes = useStyles();

  return (
    <div className={`${classes.card} ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
