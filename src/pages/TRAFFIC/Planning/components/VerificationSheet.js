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
  const admin = useSelector((state) => state.admin);
  console.log(store, admin);
  const [image, setImage] = useState([]);
  const [eventdata, setEventData] = useState(location.state.event);
  const [materials, setMaterials] = useState([]);
  const [materialsData, setMaterialsData] = useState([]);

  const [delayTime, setDelayTime] = useState("00:00");
  const [delayCheckBox, setDelayCheckBox] = useState(false);
  const [status, setStatus] = useState(eventdata.status);
  const [checkStatus, setCheckStatus] = useState();
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);
  var obj = [{ uri: "uploads/mean/grey.png" }];
  console.log(eventdata);
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

  const onSubmit = async () => {
    console.log(checkStatus);
    let materialsArray = [];
    for (const [key, value] of Object.entries(materialsData)) {
      if (value) {
        materialsArray.push(key);
      }
    }

    try {
      setLoading(true);

      var formdata = new FormData();
      formdata.append("delay", delayCheckBox);
      formdata.append("status", checkStatus);
      formdata.append("comments", comments);
      // if (images) {
      //   formdata.append('images', {
      //     uri: images.uri,
      //     name: images.fileName,
      //     type: images.type,
      //   });
      // }
      formdata.append("time", delayTime);
      formdata.append("materialsDelivered", JSON.stringify(materialsArray));
      formdata.append(
        "username",
        store.user.firstName + " " + store.user.lastName,
      );

      await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.COMPLETE_DELIVERY}/${eventdata.id}`,
        body: formdata,
        headers: {
          Authorization: store.token,
        },
      });

      if (delayCheckBox === true) {
        let locationObj = { deliveryArea: eventdata.deliveryArea._id };
        var formdata = new FormData();
        formdata.append(
          "name",
          store.user.firstName + " " + store.user.lastName,
        );
        formdata.append("date", moment(eventdata.start).format("YYYY-MM-DD"));
        formdata.append("time", moment(eventdata.start).format("HH:mm"));
        formdata.append(
          "price",
          parseInt(admin.site.siteId.penaltyforLateDelivery),
        );
        formdata.append("isBillable", "true");
        formdata.append("isPaid", "false");
        formdata.append("location", JSON.stringify(locationObj));
        formdata.append("siteId", admin.site.siteId._id);
        formdata.append("companyId", eventdata.company._id);
        formdata.append("type", "DELAY");
        await GLOBALS.API({
          method: "POST",
          uri: GLOBALS.Constants.POST_ADD_SITE_INCIDENTS,
          headers: {
            Authorization: store.token,
          },
          body: formdata,
        });
      }
      setLoading(false);

      history.push("/Plannig");
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
          <Button variant="danger" className="incedentBtn">
            CREATE AN INCIDENT
          </Button>
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
        <div className="col-sm-6">
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
        </div>

        <div className="col-sm-6">
          <div className="label" style={{ padding: "25px 0px" }}>
            DELIVERED MATERIAL :<br />
            (click if not received)
          </div>
        </div>
        <div className="col-sm-6">
          <ButtonGroup
            array={materials}
            selected={materialsData}
            setSelected={setMaterialsData}
            disabled={status != "VALIDATED"}
          />
        </div>
        <div className="col-sm-6">
          <div className="label">COMMENTS TRAFFIC AGENT :</div>
        </div>
        <div className="col-sm-6">
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              rows={3}
              value={comments}
              placeholder="Ajouter un commentaire"
              disabled={status != "VALIDATED"}
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
            disabled={status != "VALIDATED"}
          />
        </div>
        <div className="col-sm-6">
          <br />
          <div className="label">STATUS OF DELIVERY : </div>
        </div>
        <div className="col-sm-6">
          <br />
          <div className="radioBtn">
            {status === "PENDING" ? (
              <>
                <Form.Check
                  type="radio"
                  label="PENDING"
                  name="status"
                  checked
                  className="pending"
                />
              </>
            ) : (
              <>
                <Form.Check
                  type="radio"
                  label="Completed"
                  name="status"
                  className="green"
                  value="COMPLETED"
                  onChange={(e) => {
                    setCheckStatus(e.target.value);
                  }}
                />
                <Form.Check
                  type="radio"
                  label="Completed with issues"
                  name="status"
                  value="COMPLETEDWITHISSUE"
                  onChange={(e) => {
                    setCheckStatus(e.target.value);
                  }}
                />

                <Form.Check
                  type="radio"
                  label="Not completed"
                  name="status"
                  value="VALIDATED"
                  onChange={(e) => {
                    setCheckStatus(e.target.value);
                  }}
                  defaultChecked
                />
              </>
            )}
          </div>
        </div>
      </div>
      <Button
        variant="warning"
        className="validate_Btn"
        disabled={status != "VALIDATED"}
        onClick={onSubmit}
      >
        VALIDER
      </Button>
      {/* </Form.Form> */}
    </>
  );
};
export default VarificationSheet;
