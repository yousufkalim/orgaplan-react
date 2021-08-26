import React, { useState, useEffect } from "react";
import "./VerificationSheet.css";
import { useHistory, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
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

import { TEXTS } from "../../../../assets/languages/french";

const VarificationSheet = (props) => {
  const {
    VERIFICATION_SHEET,
    COMPANY,
    DATE_AND_TIME,
    DELIVERYAREA,
    MEAN,
    STORAGEAREA,
    DELIVERY_REALTIME,
    MATERIALS_DELIVERED,
    NOT_RECEIVED,
    COMMENT_TRAFFIC,
    ADD_PHOTO,
    DELIVERY_STATUS,
    COMPLETED,
    COMPLETED_WITH_ISSUES,
    NOT_COMPLETED,
    CREATE_AN_INCIDENT,
    PENDING,
  } = TEXTS;

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const admin = useSelector((state) => state.admin);
  // console.log(store, admin);
  const [image, setImage] = useState([]);
  const [eventdata, setEventData] = useState(location.state.event);
  const [materials, setMaterials] = useState([]);
  const [materialsData, setMaterialsData] = useState([]);

  const [delayTime, setDelayTime] = useState("");
  const [delayCheckBox, setDelayCheckBox] = useState(false);
  const [status, setStatus] = useState(eventdata.status);
  const [checkStatus, setCheckStatus] = useState(status);
  const [comments, setComments] = useState("");
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
    setDelayTime(moment(eventdata.end).format("hh:mm"));
    materialData();
  }, []);

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
      {/* {console.log(materialsData)} */}
      <div className="row">
        <div className="col-sm-12">
          <br />
          <IconButton onClick={() => history.goBack()}>
            <BackArrow style={{ width: 30, height: 30 }} />
          </IconButton>
          <h1 className="heading">{VERIFICATION_SHEET}</h1>
          <Button
            variant="danger"
            className="incedentBtn"
            onClick={() => {
              history.push("/incidents");
            }}
          >
            {CREATE_AN_INCIDENT}
          </Button>
        </div>
      </div>
      {/* <Form.Form> */}
      <div className="row box">
        <div className="col-sm-6">
          <div className="label">{COMPANY} : </div>
          <div className="label">{DATE_AND_TIME} :</div>
          <div className="label">
            {DELIVERYAREA} / {MEAN} :{" "}
          </div>
          <div className="label">
            {STORAGEAREA} / {MEAN} :{" "}
          </div>
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
          <div className="label">{DELIVERY_REALTIME} : </div>
        </div>
        <div className="col-sm-6">
          <div className="value checkBoxTime">
            <TimePicker
              value={delayTime}
              disabled={checkStatus != "VALIDATED"}
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
              disabled={checkStatus != "VALIDATED"}
              onChange={(e) => {
                setDelayCheckBox(e.target.checked);
              }}
            />
          </div>
        </div>

        <div className="col-sm-6">
          <div className="label" style={{ padding: "25px 0px" }}>
            {MATERIALS_DELIVERED} :<br />({NOT_RECEIVED})
          </div>
        </div>
        <div className="col-sm-6">
          <ButtonGroup
            array={materials}
            selected={materialsData}
            setSelected={setMaterialsData}
            disabled={checkStatus != "VALIDATED"}
          />
        </div>
        <div className="col-sm-6">
          <div className="label">{COMMENT_TRAFFIC} :</div>
        </div>
        <div className="col-sm-6">
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              rows={3}
              value={comments}
              placeholder="Ajouter un commentaire"
              disabled={checkStatus != "VALIDATED"}
              onChange={(e) => {
                setComments(e.target.value);
              }}
            />
          </Form.Group>
        </div>
        <div className="col-sm-6">
          <div className="label">{ADD_PHOTO} :</div>
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
            disabled={checkStatus != "VALIDATED"}
          />
        </div>
        <div className="col-sm-6">
          <br />
          <div className="label">{DELIVERY_STATUS} : </div>
        </div>
        <div className="col-sm-6">
          <br />
          <div className="radioBtn">
            {status === "PENDING" ? (
              <>
                <Form.Check
                  type="radio"
                  label={PENDING}
                  name="status"
                  checked
                  className="pending"
                />
              </>
            ) : (
              <>
                <Form.Check
                  type="radio"
                  label={COMPLETED}
                  name="status"
                  className="green"
                  value="COMPLETED"
                  onChange={(e) => {
                    setCheckStatus(e.target.value);
                  }}
                  disabled={status != "VALIDATED"}
                  defaultChecked={checkStatus === "COMPLETED"}
                />
                <Form.Check
                  type="radio"
                  label={COMPLETED_WITH_ISSUES}
                  name="status"
                  value="COMPLETEDWITHISSUE"
                  onChange={(e) => {
                    setCheckStatus(e.target.value);
                  }}
                  disabled={status != "VALIDATED"}
                  defaultChecked={checkStatus === "COMPLETEDWITHISSUE"}
                />

                <Form.Check
                  type="radio"
                  label={NOT_COMPLETED}
                  name="status"
                  value="VALIDATED"
                  onChange={(e) => {
                    setCheckStatus(e.target.value);
                  }}
                  disabled={status != "VALIDATED"}
                  defaultChecked={checkStatus === "VALIDATED"}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <Button
        variant="warning"
        className="validate_Btn"
        disabled={
          status != "VALIDATED" ||
          checkStatus === "VALIDATED" ||
          (delayCheckBox == true && delayTime == "00:00")
        }
        onClick={onSubmit}
      >
        VALIDER
      </Button>
      {/* </Form.Form> */}
    </>
  );
};
export default VarificationSheet;
