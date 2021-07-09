import React, { useState, useEffect } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

const Options = ({ array, disabled }) => {
  const [selected, setSelected] = useState({});

  const toggleOption = (e) => {
    const key = e.target.value; // e.g. 'A'
    const value = !selected[key];
    setSelected({ ...selected, [key]: value });
  };
  return (
    <ButtonGroup className="btnselect">
      {array.map((btn, index) => {
        return (
          <Button
            onClick={toggleOption}
            value={btn}
            variant={
              disabled
                ? "danger"
                : selected[btn] === true
                ? "danger"
                : "secondary"
            }
            disabled={disabled && disabled}
          >
            {btn}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default Options;
