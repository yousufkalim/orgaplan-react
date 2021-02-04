import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

import { ReactComponent as Plus } from "../assets/icons/Plus.svg";

export default function FormMultipleUpload(props) {
  const theme = useTheme();

  const white = theme.palette.common.white;

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 100,
      outline: 0,
      height: 100,
      display: "grid",
      cursor: "pointer",
      position: "relative",
      placeItems: "center",
      backgroundColor: white,
    },
    image: {
      width: "100%",
      height: "100%",
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main,
    },
    plus: {
      zIndex: 10,
      width: "40%",
      height: "40%",
      position: "absolute",
      color: theme.palette.common.white,
    },
  }));

  const classes = useStyles();
  const [update, setUpdate] = useState(false);

  return (
    <div
      className={`${classes.root} ${props.className}`}
      style={props.style}
      onClick={() => document.getElementById(`fileinput`).click()}
    >
      {update && ""}
      <Plus className={classes.plus} />
      <Avatar
        alt="avatar"
        variant="circle"
        src={props.value.uri}
        className={classes.image}
      />
      <input
        hidden
        type="file"
        id={`fileinput`}
        onChange={(e) => {
          props.onChange(e.target.files[0]);
          setUpdate((st) => !st);
        }}
      />
    </div>
  );
}
