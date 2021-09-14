import React, { useState, useEffect, useRef } from "react";
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
import { ReactComponent as Plus } from "../../../../assets/icons/Plus.svg";
import IconButton from "@material-ui/core/IconButton";
import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";
import moment from "moment";
import { Modal } from "antd";
import Avatar from "@material-ui/core/Avatar";
import _ from "lodash";

// import Popup from "reactjs-popup";
import SignaturePad from "react-signature-canvas";

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
    MODIFIED_BY_ADMIN,
  } = TEXTS;

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const admin = useSelector((state) => state.admin);
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
  const [imageURL, setImageURL] = useState(null); // create a state that will contain our image url
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);

  const sigCanvas = useRef({});
  var obj = [{ uri: "uploads/mean/grey.png" }];

  const clear = () => sigCanvas.current.clear();

  /* a function that uses the canvas ref to trim the canvas 
  from white spaces via a method given by react-signature-canvas
  then saves it in our state */
  const save = () => {
    setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setShowImgModal(false);
  };

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
    store.user.sign &&
      setImageURL(GLOBALS.Constants.BASE_URL + store.user.sign);
    setDelayTime(moment(eventdata.end).format("hh:mm"));
    materialData();
  }, []);

  const onSubmit = async () => {
    let materialsArray = [];
    for (const [key, value] of Object.entries(materialsData)) {
      if (value) {
        materialsArray.push(key);
      }
    }

    var base64Data = imageURL.replace(/^data:image\/png;base64,/, "");

    try {
      setLoading(true);

      var form = new FormData();
      form.append("sign", base64Data);
      const res = await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.ADD_SIGN}/${store.user._id}`,
        body: form,
        headers: {
          Authorization: store.token,
        },
      });
      const user = _.cloneDeep(store.user);
      user.sign = res.data;

      dispatch(Actions.auth.set_user(user));

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
      formdata.append("verifiedBy", store.user._id);
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
      <Modal
        title="Merci de signer"
        visible={isModalVisible}
        onOk={save}
        okText="Add"
        onCancel={handleCancel}
        destroyOnClose={true}
        footer={null}
      >
        <>
          <SignaturePad
            ref={sigCanvas}
            canvasProps={{
              className: "signatureCanvas",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Button variant="warning" className="validate_Btn" onClick={clear}>
              CLEAR
            </Button>
            <Button variant="warning" className="validate_Btn" onClick={save}>
              ADD
            </Button>
          </div>
        </>
      </Modal>

      <Modal
        title="Signer"
        visible={showImgModal}
        onCancel={handleCancel}
        destroyOnClose={true}
        footer={null}
      >
        <img
          src={
            imageURL
              ? imageURL
              : store.user.sign
              ? GLOBALS.Constants.BASE_URL + store.user.sign
              : GLOBALS.Constants.BASE_URL + obj[0].uri
          }
          alt={"my signature"}
          style={{
            width: "100%",
            height: 200,
            border: "1px solid black",
          }}
        />
      </Modal>

      <div className="row">
        <div className="col-sm-12">
          <br />
          <IconButton onClick={() => history.goBack()}>
            <BackArrow style={{ width: 30, height: 30 }} />
          </IconButton>
          <div style={{ display: "flex" }}>
            <h1
              style={{
                marginTop: "auto",
                marginBottom: "auto",
              }}
              className="heading"
            >
              {VERIFICATION_SHEET}
            </h1>
            {eventdata.status === "MODIFIED" && (
              <div
                style={{
                  backgroundColor: "orange",
                  color: "white",
                  fontWeight: "bold",
                  float: "left",
                  fontSize: 12,
                  padding: 10,
                  borderRadius: 10,
                  marginLeft: 20,
                }}
              >
                {MODIFIED_BY_ADMIN}
              </div>
            )}
          </div>
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
              label="RETARD ?"
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
          <div className="label">MERCI DE SIGNER*:</div>
        </div>
        <div
          className="col-sm-6"
          style={{
            display: "flex",
            flexDirection: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <br />
          <div
            style={{
              width: 45,
              height: 45,
              outline: 0,
              borderWidth: 1,
              display: "grid",
              cursor: "pointer",
              borderStyle: "solid",
              placeItems: "center",
              backgroundColor: "white",
              borderColor: "#707070",
            }}
            onClick={checkStatus === "VALIDATED" && showModal}
          >
            <Plus style={{ width: 20, height: 20 }} />
          </div>
          <div
            onClick={() => checkStatus === "VALIDATED" && setShowImgModal(true)}
          >
            <img
              src={
                imageURL
                  ? imageURL
                  : store.user.sign
                  ? GLOBALS.Constants.BASE_URL + store.user.sign
                  : GLOBALS.Constants.BASE_URL + obj[0].uri
              }
              alt={"my signature"}
              style={{ width: 45, height: 45, marginLeft: "15px" }}
            />
          </div>
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
                  disabled={status != "VALIDATED" && status != "MODIFIED"}
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
                  disabled={status != "VALIDATED" && status != "MODIFIED"}
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
                  disabled={status != "VALIDATED" && status != "MODIFIED"}
                  defaultChecked={
                    checkStatus === "VALIDATED" || checkStatus === "MODIFIED"
                  }
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
          !imageURL ||
          (status != "VALIDATED" && status != "MODIFIED") ||
          checkStatus === "VALIDATED" ||
          checkStatus === "MODIFIED" ||
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
