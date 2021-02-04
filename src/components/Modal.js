import React from "react";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: "20px",
    justifyContent: "space-between",
  },
  header: {
    color: "rgba(0, 0, 0, 0.54)",
    margin: 0,
  },
  icon: {
    cursor: "pointer",
    color: "rgba(0, 0, 0, 0.54)",
  },
  body: {
    width: "100%",
  },
  actions: {
    display: "flex",
    padding: "20px 0px",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const Modal = (props) => {
  const classes = useStyles();

  return (
    <Dialog
      maxWidth={props.maxWidth || "md"}
      fullWidth={true}
      open={props.open}
      onClose={props.onClose}
    >
      <div className={classes.root}>
        <div className={classes.headerContainer}>
          <h2 className={classes.header}>{props.title}</h2>
          <CloseIcon onClick={props.onClose} className={classes.icon} />
        </div>
        <div className={classes.body}>{props.body}</div>
        {props.actions && (
          <div className={classes.actions}>{props.actions}</div>
        )}
      </div>
    </Dialog>
  );
};

export default Modal;
