import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Heading from "../../components/Heading";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
}));

export default function LandingPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Heading primary="Landing Page" />
    </div>
  );
}
