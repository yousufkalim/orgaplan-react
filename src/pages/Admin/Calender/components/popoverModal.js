import React from "react";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import "./sass/custom.scss";
const PopoverModal = ({
  popoverShow,
  handlePopoverClose,
  handleDeleteEvent,
  handleEditEvent,
  event,
}) => {
  const getStartDate = (start) => {
    var dd = String(start.getDate()).padStart(2, "0");
    var mm = String(start.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = start.getFullYear();
    start = mm + "/" + dd + "/" + yyyy;
    return start;
  };

  const getStartTime = (date) => {
    var dt = moment(date, ["h:mm A"]).format("HH:mm");
    return dt;
  };
  if (event) {
    return (
      <Modal show={popoverShow} onHide={handlePopoverClose}>
        <Modal.Header closeButton>
          <Modal.Title>Event Detail </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="showPopover">
            <h5>{event.title}</h5>
            {/* {console.log(event)} */}
            <p>
              {/* {event.start.getDay()}-{event.start.getMonth() + 1}-
                {event.start.getYear()} */}
              <h6 style={{ "font-size": "12px", "padding-top": "10px" }}>
                <span>
                  <b>Start Time:</b> {getStartTime(event.start)}{" "}
                </span>{" "}
                <span>{getStartDate(event.start)}</span>
                <br />
                <span>
                  <b>End Time:</b> {getStartTime(event.end)}{" "}
                </span>{" "}
                <span>{getStartDate(event.end)}</span>
              </h6>
            </p>

            <hr />
            <div className="popoverfooter">
              <div className="col-lg-6">
                <button
                  className="btn text-white bg-primary"
                  onClick={handleEditEvent}
                >
                  <i class="fas fa-pencil"></i> <span>edit</span>
                </button>
              </div>
              <div className="col-lg-6">
                <button
                  className="btn text-white bg-danger"
                  onClick={handleDeleteEvent}
                >
                  <i class="fas fa-trash"></i> <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  } else {
    return "";
  }
};
export default PopoverModal;
