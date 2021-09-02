import React from "react";
import moment from "moment";
import "./sass/custom.scss";
import { Modal, Alert } from "react-bootstrap";
import { TEXTS } from "../../../../assets/languages/french";

const PopoverModal = ({
  popoverShow,
  handlePopoverClose,
  handleDeleteEvent,
  handleDeleteDelivery,
  event,
  setEvent,
  setEditDelivery,
  handleValidateMeans,
  setAlertBoxTime,
  alertBoxTime,
  handleValidateDelivery,
  onEditDelivery,
}) => {
  const {
    YES,
    NO,
    BOOKING,
    EDIT,
    Modified_By,
    COMPANY_1,
    MEANS,
    NAME,
    TYPE,
    REASON,
    MATERIAL,
    DELIVERYAREA,
    STORAGEAREA,
    Start_time,
    BOOKING_REASON,
    End_time,
    VALIDATE,
    MORE_INFO,
    REFUSE,
    COMPANY,
    MEAN,
    Are_you_sure_You_want_to_delete_this,
  } = TEXTS;

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
  function Alertbox(props) {
    return (
      <Alert
        show={alertBoxTime}
        variant="danger"
        onClose={() => setAlertBoxTime(!alertBoxTime)}
      >
        <div style={{ textAlign: "center" }}>
          {props.message}&nbsp;&nbsp;&nbsp;
        </div>
        {event.objectName === "Deliveries" ? (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div
              onClick={() => {
                handleDeleteDelivery("no");
              }}
              className="alert-link"
              style={{ cursor: "pointer" }}
            >
              {NO}
            </div>
            <div
              onClick={() => {
                handleDeleteDelivery("yes");
              }}
              className="alert-link"
              style={{ cursor: "pointer" }}
            >
              {YES}
            </div>
          </div>
        ) : (
          <>
            <div
              onClick={() => {
                handleDeleteEvent("no");
              }}
              className="alert-link"
            >
              {NO}
            </div>{" "}
            &nbsp;&nbsp;
            <div
              onClick={() => {
                handleDeleteEvent("yes");
              }}
              className="alert-link"
            >
              {YES}
            </div>
          </>
        )}
      </Alert>
    );
  }
  // console.log("event", event);
  if (event) {
    return (
      <Modal show={popoverShow} onHide={handlePopoverClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">{BOOKING}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alertbox message={Are_you_sure_You_want_to_delete_this} />
          <div className="showPopover">
            <div style={{ textAlign: "right" }}>
              <button
                className="btn btn-light"
                onClick={() => {
                  setEditDelivery(true);
                  onEditDelivery(event);
                }}
              >
                <i class="fas fa-trash"></i> <span>{EDIT}</span>
              </button>
            </div>
            {event.objectName === "Deliveries" ? (
              <>
                {event.status === "MODIFIED" ? (
                  <>
                    <span>{Modified_By}</span>

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
                      {`${NAME}: ` +
                        event.user.firstName +
                        " " +
                        event.user.lastName +
                        " Role: " +
                        event.user.adminType}
                    </h5>
                  </>
                ) : (
                  <></>
                )}

                <span>{COMPANY_1}</span>
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

                <span>{MEANS}</span>
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
                      <th>{NAME}</th>
                      <th>{TYPE}</th>
                      <th>{REASON}</th>
                    </tr>
                    {event.liftingMeans.map((key, index) => {
                      return (
                        <tr>
                          <td>{key.name}</td>
                          <td>{key.meanType}</td>
                          <td>{key.alerts ? key.alerts.reason : null}</td>
                        </tr>
                      );
                    })}
                    {event.routingMeans.map((key, index) => {
                      return (
                        <tr>
                          <td>{key.name}</td>
                          <td>{key.meanType}</td>
                          <td>{key.alerts ? key.alerts.reason : null}</td>
                        </tr>
                      );
                    })}
                  </table>
                </h5>
                <span>{MATERIAL}</span>
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
                          <td> {key} </td>
                        </tr>
                      );
                    })}
                  </table>
                </h5>
                {event.deliveryArea !== null ? (
                  <>
                    <span>{DELIVERYAREA}</span>
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
                      {" Name:  " + event.deliveryArea.name} <br />{" "}
                      {event.deliveryArea.alert
                        ? " Reason:  " + event.deliveryArea.alert.reason
                        : null}
                    </h5>
                  </>
                ) : (
                  <></>
                )}

                {event.storageArea !== null ? (
                  <>
                    <span>{STORAGEAREA}</span>
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
                      {" Nom:  " + event.storageArea.name} <br />
                      {event.storageArea.alert
                        ? event.storageArea.alert.map((item, index) => {
                            return `Reason ${index + 1}   :   ${item.reason} `;
                          })
                        : null}
                    </h5>
                  </>
                ) : (
                  <></>
                )}
                <span>{BOOKING_REASON}</span>
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
                  {Start_time}:
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
                <span>{End_time}:</span>
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
                {event.status === "PENDING" ? (
                  <>
                    <hr />
                    <div className="popoverfooter">
                      <div className="col-lg-2">
                        <button
                          className="btn text-primary btn-light px-3 text-center"
                          onClick={handleValidateDelivery}
                        >
                          <i class="fas fa-pencil"></i> <span>{VALIDATE}</span>
                        </button>
                      </div>
                      <div className="col-lg-4">
                        <button
                          className="btn text-success btn-light"
                          onClick={() => onEditDelivery(event)}
                        >
                          <i class="fas fa-trash"></i> <span>{MORE_INFO}</span>
                        </button>
                      </div>
                      <div className="col-lg-3">
                        <button
                          className="btn text-danger btn-light"
                          onClick={handleDeleteDelivery}
                        >
                          <i class="fas fa-trash"></i> <span>{REFUSE}</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                <span>{COMPANY}</span>
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
                <span>{MEAN}</span>
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
                <span>{BOOKING_REASON}</span>
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
                  {Start_time}:
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
                <span>{End_time}:</span>
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

                {event.status !== "VALIDATED" ? (
                  <>
                    <div style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-light"
                        onClick={() => onEditDelivery(event)}
                      >
                        <i class="fas fa-trash"></i> <span>{EDIT}</span>
                      </button>
                    </div>
                    <hr />
                    <div className="popoverfooter">
                      <div className="col-lg-2">
                        <button
                          className="btn text-primary btn-light px-3 text-center"
                          onClick={handleValidateMeans}
                        >
                          <i class="fas fa-pencil"></i> <span>{VALIDATE}</span>
                        </button>
                      </div>
                      <div className="col-lg-3">
                        <button
                          className="btn text-danger btn-light"
                          onClick={handleDeleteEvent}
                        >
                          <i class="fas fa-trash"></i> <span>{REFUSE}</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <> </>
                )}
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
