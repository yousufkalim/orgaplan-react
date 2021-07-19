import React, { useState, useEffect } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

const Options = (props) => {
  const { selected, setSelected } = props;

  useEffect(() => {
    props.array.map((item) => {
      setSelected((prev) => {
        return {
          ...prev,
          [item]: true,
        };
      });
    });
  }, [props.array]);

  const toggleOption = (e) => {
    if (props.disabled === false) {
      const key = e.target.value; // e.g. 'A'
      const value = !selected[key];
      setSelected({ ...selected, [key]: value });
    }
  };
  return (
    <ButtonGroup className="btnselect">
      {props.array.map((btn, index) => {
        // console.log(selected);
        return (
          <Button
            onClick={toggleOption}
            value={btn}
            variant={selected[btn] === true ? "danger" : "secondary"}
          >
            {btn}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default Options;
