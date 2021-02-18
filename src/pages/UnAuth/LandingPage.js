import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Header from "./UnAuthHeader";
import Footer from "../../components/Footer";
import Heading from "../../components/Heading";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
  },
}));

export default function LandingPage() {
  const classes = useStyles();

  return (
    <Header>
      <div className={classes.root}>
        <Heading primary="Landing Page" />
        <Footer />
      </div>
    </Header>
  );
}
