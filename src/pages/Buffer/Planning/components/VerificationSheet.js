import React, { useState } from "react";
import "./VerificationSheet.css";
import { useHistory } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import TimePicker from "react-time-picker";
import FormCheckbox from "../../../../components/FormCheckbox";
import FormMultipleUpload from "../../../../components/FormMultipleUpload";
import validate from "../../../../components/Button";
import ButtonGroup from "./btnGroup";
import { ReactComponent as BackArrow } from "../../../../assets/icons/BackArrow.svg";
import IconButton from "@material-ui/core/IconButton";
const VarificationSheet = () => {
  const [image, setImage] = useState([]);
  const history = useHistory();
  var obj = [{ uri: "uploads/mean/grey.png" }];
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

      <div className="row box">
        <div className="col-sm-6">
          <div className="label">COMPANY : </div>
          <div className="label">DATE AND TIME :</div>
          <div className="label">DELIVERY AREA / MEAN : </div>
          <div className="label">STORAGE AREA / MEAN : </div>
        </div>
        <div className="col-sm-6">
          <div className="value">ConstructBTP</div>
          <div className="value">12/03/2021 entre 8h et 12h</div>
          <div className="value">Aire RRZR21 / Grue mobile</div>
          <div className="value">RD32 / Fenwick</div>
        </div>
        <div className="col-sm-6">
          <div className="label">REAL TIME OF DELIVERY : </div>
        </div>
        <div className="col-sm-6">
          <div className="value checkBoxTime">
            <TimePicker value={"10:00"} onChange={(e) => {}} locale="sv-sv" />
            <FormCheckbox name="delay" label="DELAY ?" />
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
            array={["Bardage", "Plaques béton", "Plaquettes", "CMU"]}
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
              placeholder="Ajouter un commentaire"
            />
          </Form.Group>
        </div>
        <div className="col-sm-6">
          <div className="label">ADD PICTURES :</div>
        </div>
        <div className="col-sm-6">
          <FormMultipleUpload
            name="image"
            values={"abc"}
            values={
              image[0] && image[0].file
                ? image
                : image[0] && image[0].uri
                ? image
                : obj
            }
            onChange={(values) => {}}
          />
        </div>
        <div className="col-sm-6">
          <br />
          <div className="label">STATUS OF DELIVERY : </div>
        </div>
        <div className="col-sm-6">
          <br />
          <div className="radioBtn">
            <Form.Check type="radio" label="Completed" name="Completed" />
            <Form.Check
              type="radio"
              label="Completed with issues"
              name="CompletedWithIssues"
            />
            <Form.Check
              type="radio"
              label="Not completed"
              name="NotCompleted"
            />
          </div>
        </div>
      </div>
      <Button variant="warning" className="validate_Btn">
        VALIDER
      </Button>
    </>
  );
};
export default VarificationSheet;
