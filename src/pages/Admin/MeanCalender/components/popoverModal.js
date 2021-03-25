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
          <Modal.Title className="text-center">Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="showPopover">
            <span>BOOKING REASON</span>
            <h5
              className="text-center"
              style={{
                backgroundColor: "#f7f7f7",
                fontSize: "16px",
                color: "#777",
                textAlign: "center",
                padding: "10px 20px",
                margin: "10px 0px",
              }}
            >
              {event.title}
            </h5>
            {/* {console.log(event)} */}
            <p>
              {/* {event.start.getDay()}-{event.start.getMonth() + 1}-
                {event.start.getYear()} */}

              <span
                style={{
                  fontWeight: "normal",
                  textTransform: "uppercase",
                }}
              >
                Start Time:
              </span>
              <div
                style={{
                  backgroundColor: "#f7f7f7",
                  fontSize: "16px",
                  color: "#777",
                  color: "#50c878",
                  textAlign: "center",
                  padding: "10px 20px",
                  margin: "10px 0px",
                }}
              >
                {getStartTime(event.start)}-
                <span>{getStartDate(event.start)}</span>
              </div>
              <br />
              <span
                style={{
                  textTransform: "uppercase",
                }}
              >
                End Time:
              </span>
              <div
                style={{
                  backgroundColor: "#f7f7f7",
                  fontSize: "16px",
                  color: "#777",
                  color: "#ed2939",
                  textAlign: "center",
                  padding: "10px 20px",
                  margin: "10px 0px",
                }}
              >
                {getStartTime(event.end)}-<span>{getStartDate(event.end)}</span>
              </div>
            </p>

            <hr />
            <div className="popoverfooter">
              <div className="col-lg-2">
                {/* <button
                  className="btn text-primary btn-light px-3 text-center"
                  onClick={handleEditEvent}
                >
                  <i class="fas fa-pencil"></i> <span>Edit</span>
                </button> */}
              </div>
              <div className="col-lg-3">
                <button
                  className="btn text-danger btn-light"
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
