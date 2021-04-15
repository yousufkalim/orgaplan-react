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
    start = dd + "/" + mm + "/" + yyyy;
    return start;
  };

  const getStartTime = (date) => {
    var dt = moment(date, ["h:mm A"]).format("HH:mm");
    return dt;
  };
  if (event) {
    console.log(event);
    return (
      <Modal show={popoverShow} onHide={handlePopoverClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="showPopover">
            {event.objectName === "Deliveries" ? (
              <> 
                <span>Company</span>
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
                  {event.company.name}
                </h5>

                <span>Means</span>
                <h5
                  style={{
                    backgroundColor: "#f7f7f7",
                    fontSize: "16px",
                    color: "#777",
                    padding: "10px 20px",
                    margin: "10px 0px",
                  }}
                >
                  <table style={{ width: "100%" }}>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                    </tr>
                    {event.means.map((key, index) => {
                      return (
                        <tr>
                          <td>{key.name}</td>
                          <td>{key.meanType}</td>
                        </tr>
                      );
                    })}
                  </table>
                </h5>
                <span>Material</span>
                <h5
                  style={{
                    backgroundColor: "#f7f7f7",
                    fontSize: "16px",
                    color: "#777",
                    padding: "10px 20px",
                    margin: "10px 0px",
                  }}
                >
                  <table style={{ width: "100%" }}> 
                    {event.materials.map((key, index) => {
                      return (
                        <tr>
                          <td>{key}</td>
                        </tr>
                      );
                    })}
                  </table>
                </h5> 
                {event.deliveryArea!==null ? <>
                  <span>Delivery area</span>
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
                  {event.deliveryArea.name}
                </h5>
                </> : <>
                </>}
               
                {event.storageArea!==null ? <>
                  <span>Storage area</span>
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
                  {event.storageArea.name}
                </h5>
                </> : <>
                </>} 
                <span>Booking Reason</span>
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

                <span
                  style={{
                    fontWeight: "normal",
                  }}
                >
                  Start Time:
                </span>
                <div
                  style={{
                    backgroundColor: "#f7f7f7",
                    fontSize: "16px",
                    color: "#50c878",
                    textAlign: "center",
                    padding: "10px 20px",
                    margin: "10px 0px",
                  }}
                >
                  <span>{getStartDate(event.start)}</span> -{" "}
                  {getStartTime(event.start)}
                </div>
                <br />
                <span style={{}}>End Time:</span>
                <div
                  style={{
                    backgroundColor: "#f7f7f7",
                    fontSize: "16px",
                    color: "#ed2939",
                    textAlign: "center",
                    padding: "10px 20px",
                    margin: "10px 0px",
                  }}
                >
                  <span>{getStartDate(event.end)}</span> -{" "}
                  {getStartTime(event.end)}
                </div>

                <hr />
                <div className="popoverfooter">
                  <div className="col-lg-2">
                    <button
                      className="btn text-primary btn-light px-3 text-center"
                      // onClick={handleEditEvent}
                    >
                      <i class="fas fa-pencil"></i> <span>validate</span>
                    </button>
                  </div>
                  <div className="col-lg-3">
                    <button
                      className="btn text-danger btn-light"
                      // onClick={handleDeleteEvent}
                    >
                      <i class="fas fa-trash"></i> <span>Refuse</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <span>Company</span>
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
                  {event.companyName}
                </h5>
                <span>Mean</span>
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
                  {event.meanName}
                </h5>
                <span>Booking Reason</span>
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

                <span
                  style={{
                    fontWeight: "normal",
                  }}
                >
                  Start Time:
                </span>
                <div
                  style={{
                    backgroundColor: "#f7f7f7",
                    fontSize: "16px",
                    color: "#50c878",
                    textAlign: "center",
                    padding: "10px 20px",
                    margin: "10px 0px",
                  }}
                >
                  <span>{getStartDate(event.start)}</span> -{" "}
                  {getStartTime(event.start)}
                </div>
                <br />
                <span style={{}}>End Time:</span>
                <div
                  style={{
                    backgroundColor: "#f7f7f7",
                    fontSize: "16px",
                    color: "#ed2939",
                    textAlign: "center",
                    padding: "10px 20px",
                    margin: "10px 0px",
                  }}
                >
                  <span>{getStartDate(event.end)}</span> -{" "}
                  {getStartTime(event.end)}
                </div>

                <hr />
                <div className="popoverfooter">
                  <div className="col-lg-2">
                    <button
                      className="btn text-primary btn-light px-3 text-center"
                      // onClick={handleEditEvent}
                    >
                      <i class="fas fa-pencil"></i> <span>validate</span>
                    </button>
                  </div>
                  <div className="col-lg-3">
                    <button
                      className="btn text-danger btn-light"
                      onClick={handleDeleteEvent}
                    >
                      <i class="fas fa-trash"></i> <span>Refuse</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    );
  } else {
    return "";
  }
};
export default PopoverModal;
