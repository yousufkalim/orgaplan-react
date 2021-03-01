import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {Images} from "../assets/Assets";

export default function Heading({ className, bold, ...props }) {
  const useStyles = makeStyles((theme) => ({
    heading: {
      fontWeight: "bold",
      fontSize: theme.typography.pxToRem(26),
      color: theme.palette.primary.contrastText,
      margin: props.disableMargin ? 0 : props.margin || "0 0 10px 0",
    },
  }));
  const classes = useStyles();

  return (
   <>
    <Typography
      className={`${classes.heading} ${className}`}
      style={props.style}
      {...props}
    >
       
      {props.primary}
      {
        props.icon && (
          <span className="pl-5" > <img src={Images.uploadIcon} style={{width: "1.5rem"}} /></span>
        )
      }
    </Typography>
  
   </>
  );
}
