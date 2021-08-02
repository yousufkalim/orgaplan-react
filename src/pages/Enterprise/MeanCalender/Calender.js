import React from "react";
import GLOBALS from "../../../globals";
import { makeStyles } from "@material-ui/core/styles";
import { TEXTS } from "../../../assets/languages/french";

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

const Calender = () => {
  const { CALENDAR } = TEXTS;
  const classes = useStyles();
  return <div className={classes.root}>{CALENDAR}</div>;
};

export default Calender;
