import React from "react";
import GLOBALS from "../../../globals";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Invoices = () => {
  const classes = useStyles();
  return <div className={classes.root}>Invoices</div>;
};

export default Invoices;
