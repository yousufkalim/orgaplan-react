import React, { useState, useEffect } from "react";
import "./VerificationSheet.css";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form } from "react-bootstrap";
import TimePicker from "react-time-picker";
import FormCheckbox from "../../../../components/FormCheckbox";
import FormMultipleUpload from "../../../../components/FormMultipleUpload";
import validate from "../../../../components/Button";
import ButtonGroup from "./btnGroup";
import { ReactComponent as BackArrow } from "../../../../assets/icons/BackArrow.svg";
import IconButton from "@material-ui/core/IconButton";
import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";
import moment from "moment";
const VarificationSheet = (props) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const [image, setImage] = useState([]);
  const [bufferArea, setBufferArea] = useState(
    location?.state?.event?.bufferArea
      ? location?.state?.event?.bufferArea
      : "",
  );
  const [eventdata, setEventData] = useState(location.state.event);
  const [materials, setMaterials] = useState([]);
  const [materialsData, setMaterialsData] = useState([]);

  const [delayTime, setDelayTime] = useState("00:00");
  const [arrivalTime, setArrivalTime] = useState("00:00");
  const [departureTime, setDepartureTime] = useState("00:00");
  const [flatRegistration, setFlatRegistration] = useState("");
  const [delayCheckBox, setDelayCheckBox] = useState(false);
  const [status, setStatus] = useState(eventdata.status);
  const [checkStatus, setCheckStatus] = useState();
  const [comments, setComments] = useState(
    eventdata?.comment ? eventdata.comment : "",
  );
  const [loading, setLoading] = useState(true);
  var obj = [{ uri: "uploads/mean/grey.png" }];
  // console.log(eventdata);
  const liftingMeans = () => {
    var data = eventdata.liftingMeans?.map((name, index) => {
      return name.name;
    });
    return data.join(" , ");
  };
  const routingMeans = () => {
    var data = eventdata.routingMeans?.map((name, index) => {
      return name.name;
    });
    return data.join(" , ");
  };
  const materialData = () => {
    let array = [];
    const data = eventdata.materials?.map((name, index) => {
      array.push(name);
      return;
    });
    setMaterials(array);
  };

  useEffect(() => {
    materialData();
  }, []);

  let arrivelIs = new Date(
    new Date(eventdata.start).setHours(arrivalTime.split(":")[0]),
  );
  let departureIs = new Date(
    new Date(eventdata.start).setHours(departureTime.split(":")[0]),
  );
  // console.log("event data is ", eventdata);

  const onSubmit = async () => {
    // console.log(checkStatus);
    let materialsArray = [];
    for (const [key, value] of Object.entries(materialsData)) {
      if (value) {
        materialsArray.push(key);
      }
    }

    try {
      setLoading(true);

      var formdata = new FormData();
      formdata.append("bufferArea", bufferArea);
      formdata.append("arrivalTime", arrivelIs);
      formdata.append("flatRegistration", flatRegistration);
      formdata.append("departureTime", departureIs);

      await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.BUFFER_UPDATE_DELIVERY}/${eventdata.id}`,
        body: formdata,
        headers: {
          Authorization: store.token,
        },
      });

      // if (delay === true) {
      //   let locationObj = { deliveryArea: deliveryAreaId };
      //   var formdata = new FormData();
      //   console.log("JSON.stringify(locationObj)", JSON.stringify(locationObj));
      //   formdata.append("name", "Created by NameOfTrafficAgent");
      //   formdata.append("date", moment(startTime).format("YYYY-MM-DD"));
      //   formdata.append("time", moment(startTime).format("HH:mm"));
      //   formdata.append(
      //     "price",
      //     parseInt(storeUser.site.siteId.penaltyforLateDelivery),
      //   );
      //   formdata.append("isBillable", "true");
      //   formdata.append("isPaid", "false");
      //   formdata.append("location", JSON.stringify(locationObj));
      //   formdata.append("siteId", storeUser.site.siteId._id);
      //   formdata.append("companyId", companyId);
      //   formdata.append("type", "DELAY");
      //   await GLOBALS.API({
      //     method: "POST",
      //     uri: GLOBALS.Constants.POST_ADD_SITE_INCIDENTS,
      //     headers: {
      //       Authorization: store.token,
      //     },
      //     body: formdata,
      //   });
      // }
      setLoading(false);

      history.push("/Planing");
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <br />
          <IconButton onClick={() => history.goBack()}>
            <BackArrow style={{ width: 30, height: 30 }} />
          </IconButton>
          <h1 className="heading">VERIFICATION SHEET FOR DELIVERY</h1>
          {/* <Button variant="danger" className="incedentBtn">
            CREATE AN INCIDENT
          </Button> */}
        </div>
      </div>
      {/* <Form.Form> */}
      <div className="row box">
        <div className="col-sm-6">
          <div className="label">COMPANY : </div>
          <div className="label">DATE AND TIME :</div>
          <div className="label">DELIVERY AREA / MEAN : </div>
          <div className="label">STORAGE AREA / MEAN : </div>
        </div>
        <div className="col-sm-6">
          <div className="value">{eventdata.company.name}</div>
          <div className="value">
            {moment(eventdata.start).format("DD-MM-YYYY") +
              " entre " +
              moment(eventdata.start).format("HH") +
              "h et " +
              moment(eventdata.end).format("HH") +
              "h"}
          </div>
          <div className="value">
            {eventdata.deliveryArea.name + " / " + liftingMeans()}
          </div>
          <div className="value">
            {eventdata.storageArea.name + " / " + routingMeans()}
          </div>
        </div>
        {status === "PENDING" ? (
          <>
            <div className="col-sm-6">
              <div className="label" style={{ padding: "25px 0px" }}>
                MATERIEL LIVRÉ :<br />
              </div>
            </div>
            <div className="col-sm-6">
              <ButtonGroup
                array={materials}
                selected={materialsData}
                setSelected={setMaterialsData}
                disabled={true}
              />
            </div>
          </>
        ) : (
          <>
            {/* <div className="col-sm-6">
              <div className="label">REAL TIME OF DELIVERY : </div>
            </div>
            <div className="col-sm-6">
              <div className="value checkBoxTime">
                <TimePicker
                  value={delayTime}
                  disabled={!delayCheckBox}
                  disableClock
                  onChange={(e) => {
                    setDelayTime(e);
                  }}
                  locale="sv-sv"
                />

                <FormCheckbox
                  name={delayCheckBox}
                  label="DELAY ?"
                  checked={delayCheckBox}
                  disabled={status != "VALIDATED"}
                  onChange={(e) => {
                    setDelayCheckBox(e.target.checked);
                  }}
                />
              </div>
            </div> */}

            <div className="col-sm-6">
              <div className="label" style={{ padding: "25px 0px" }}>
                MATERIEL LIVRÉ :<br />
              </div>
            </div>
            <div className="col-sm-6">
              <ButtonGroup
                array={materials}
                disabled={true}
                selected={materialsData}
                setSelected={setMaterialsData}
              />
            </div>
          </>
        )}

        <div className="col-sm-6">
          <div className="label">ADDITIONAL INFORMATION:</div>
        </div>
        <div className="col-sm-6">
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              rows={1}
              value={comments}
              placeholder="Ajouter un commentaire"
              disabled={true}
              onChange={(e) => {
                setComments(e.target.value);
              }}
            />
          </Form.Group>
        </div>
        <div className="col-sm-6">
          <div className="label">ADD PICTURES :</div>
        </div>
        <div className="col-sm-6">
          <FormMultipleUpload
            name="image"
            values={
              image[0] && image[0].file
                ? image
                : image[0] && image[0].uri
                ? image
                : obj
            }
            onChange={(e) => {
              setImage(e);
            }}
            disabled={true}
          />
        </div>
        {status != "PENDING" && (
          <>
            <div className="col-sm-6">
              <br />
              <div className="label">RETURN BUFFER AREA: </div>
            </div>
            <div className="col-sm-6">
              <br />
              <div style={{ display: "flex" }}>
                <>
                  <Form.Check
                    type="radio"
                    label="YES"
                    name="bufferArea"
                    className="green"
                    style={{ marginRight: "5px" }}
                    value={true}
                    onChange={(e) => {
                      setBufferArea(e.target.value);
                    }}
                  />
                  <Form.Check
                    type="radio"
                    label="NO"
                    name="bufferArea"
                    value={false}
                    onChange={(e) => {
                      setBufferArea(e.target.value);
                    }}
                  />
                </>
              </div>
            </div>
            <div className="col-sm-6">
              <br />
              <div className="label">TIME OF ARRIVAL: </div>
            </div>
            <div className="col-sm-6">
              <br />
              <div style={{ display: "flex" }}>
                <>
                  <TimePicker
                    value={arrivalTime}
                    onChange={(e) => {
                      setArrivalTime(e);
                    }}
                    // disableClock
                    locale="sv-sv"
                  />
                </>
              </div>
            </div>
            <div className="col-sm-6">
              <br />
              <div className="label">IMMATRICULATION PLATE : </div>
            </div>
            <div className="col-sm-6">
              <br />
              <div style={{ display: "flex" }}>
                <>
                  <Form.Control
                    as="input"
                    value={flatRegistration}
                    placeholder="Ajouter un commentaire"
                    onChange={(e) => {
                      setFlatRegistration(e.target.value);
                    }}
                  />
                </>
              </div>
            </div>
            <div className="col-sm-6">
              <br />
              <div className="label">TIME OF DEPARTURE: </div>
            </div>
            <div className="col-sm-6">
              <br />
              <div style={{ display: "flex" }}>
                <>
                  <TimePicker
                    value={departureTime}
                    onChange={(e) => {
                      setDepartureTime(e);
                    }}
                    // disableClock
                    locale="sv-sv"
                  />
                </>
              </div>
            </div>
          </>
        )}
      </div>
      <Button
        variant="warning"
        className="validate_Btn"
        disabled={
          status != "PENDING" &&
          (bufferArea == "" ||
            arrivalTime == "00:00" ||
            arrivalTime == null ||
            departureTime == "00:00" ||
            departureTime == null ||
            flatRegistration == "")
        }
        onClick={onSubmit}
      >
        VALIDATE
      </Button>
      {/* </Form.Form> */}
    </>
  );
};
export default VarificationSheet;
