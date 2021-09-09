import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Overlay, Tooltip } from "react-bootstrap";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { TEXTS } from "../../../../assets/languages/french";

export const IconStyle = {
  cursor: "pointer",
};

export const TooltipContent = ({ onClose, event }) => {
  const { COMPANY, DELIVERYAREA, STORAGEAREA } = TEXTS;

  return (
    <>
      <div style={{ textAlign: "left", "font-size": "11px" }}>
        <div>
          {COMPANY}: {event.event.company.name}
        </div>
        <div>
          {DELIVERYAREA}: {event.event.deliveryArea.name}
        </div>
        <div>
          {STORAGEAREA}: {event.event.storageArea.name}
        </div>
      </div>
    </>
  );
};

export const EventToolTips = (event) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const closeTooltip = () => {
    setShowTooltip(false);
  };

  const openTooltip = () => {
    setShowTooltip(true);
  };
  const ref = useRef(null);

  const getTarget = () => {
    return ReactDOM.findDOMNode(ref.current);
  };

  return (
    <div ref={ref}>
      <span onMouseOver={openTooltip} onMouseOut={closeTooltip}>
        {event.title}
      </span>
      <Overlay
        rootClose
        target={getTarget}
        show={showTooltip}
        placement="top"
        onHide={closeTooltip}
        onClose={closeTooltip}
      >
        <Tooltip id="test">
          <TooltipContent event={event} onClose={closeTooltip} />
        </Tooltip>
      </Overlay>
    </div>
  );
};
