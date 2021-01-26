import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: 20,
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
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
