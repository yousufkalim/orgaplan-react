import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default function FormCheckbox(props) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name={props.name}
          color={props.color || "default"}
          checked={props.checked}
          onChange={props.onChange}
        />
      }
      label={props.label}
    />
  );
}
