import React from 'react';
import GLOBALS from "../../../globals";
import { makeStyles, useTheme } from "@material-ui/core/styles";

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

const Organigramme = () => {
    const classes = useStyles();
    return (
        <div  className={classes.root}>
            Organigramme
        </div>
    )
}

export default Organigramme
