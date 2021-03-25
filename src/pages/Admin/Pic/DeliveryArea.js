import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import FormLabel from "../../../components/FormLabel";
import FormInput from "../../../components/CustomFormInput";
import CustomInputModal from "../../../components/CustomInputModal";
import FormMultipleUpload from "../../../components/FormMultipleUpload";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

export default function DeliveryArea(props) {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState([]);
  const [location, setLocation] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [techSheet, setTechSheet] = useState([]);
  const [rate, setRate] = useState("");
  const [addInfo, setAddInfo] = useState("");

  function handleChange(name, value) {
    if (name === "name") setName(value);
    else if (name === "type") setType(value);
    else if (name === "color") setColor(value);
    else if (name === "image") setImage(value);
    else if (name === "location") setLocation(value);
    else if (name === "startDate") setStartDate(value);
    else if (name === "endDate") setEndDate(value);
    else if (name === "techSheet") setTechSheet(value);
    else if (name === "rate") setRate(value);
    else if (name === "addInfo") setAddInfo(value);
  }

  return (
    <div className={classes.content}>
      <Form.Form>
        <Form.Row>
          <FormLabel bold primary="Name : " />
          <Form.Row noMargin width="65%" style={{ gap: "20px" }}>
            <FormInput
              name="name"
              value={name}
              placeholder="Company name"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
            <FormMultipleUpload
              name="image"
              style={GLOBALS.Styles.inputWidth}
              values={image}
              onChange={(values) => handleChange("profile", values)}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="AVAILABILITY :" />
          <Form.Row
            noMargin
            width="65%"
            justifyContent="flex-start"
            style={{ gap: "20px" }}
          >
            <FormInput
              type="date"
              style={{ width: "300px" }}
              placeholder={`Date de début`}
              name="startDate"
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              value={startDate}
            />
            <FormInput
              type="date"
              placeholder="Date de fin"
              style={{ width: "300px" }}
              name="endDate"
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              value={endDate}
            />
          </Form.Row>
        </Form.Row>

        <Form.Row>
          <FormLabel bold primary="ACCESSIBILITY ADDRESSES :  " />
          <Form.Row noMargin width="65%">
            <CustomInputModal
              name="location"
              values={location}
              // error={addresses}
              style={GLOBALS.Styles.inputWidth}
              placeholder="Enter Delivery areas"
              onChange={(values) => handleChange("addresses", values)}
            />
          </Form.Row>
        </Form.Row>

        <Form.Row>
          <FormLabel bold primary="FICHE TECHNIQUE : " />
          <Form.Row noMargin width="65%">
            <FormMultipleUpload
              name="techSheet"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              values={techSheet}
            />
          </Form.Row>
        </Form.Row>

        <Form.Row>
          <FormLabel bold primary="INDISPONIBILITES: " />
          <Form.Row noMargin width="65%">
            <div
              // name="availability"

              to={"/means/add-mean"}
              style={{
                marginLeft: "0px",
                marginBottom: "7px",
                width: "320px",
                color: "#fff",
                padding: "0.8rem 0",
                borderRadius: "8px",
                textAlign: "center",
                backgroundColor: "#140772",
              }}
            >
              SHOW UNAVAILABILITIES
            </div>
          </Form.Row>
        </Form.Row>

        <Form.Row alignItems="flex-start">
          <FormLabel bold primary="TARIF HORAIRE : " />
          <Form.Row noMargin width="65%">
            <FormInput
              textArea
              rows={1}
              style={{ width: "300px", textAlign: "right" }}
              placeholder="€"
              name="rate"
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              value={rate}
            />
          </Form.Row>
        </Form.Row>

        <Form.Row alignItems="flex-start">
          <FormLabel bold primary="INFORMATIONS COMPLÉMENTAIRES :" />
          <Form.Row noMargin width="65%">
            <FormInput
              textArea
              rows={3}
              style={{ width: "600px" }}
              placeholder="Informations complémentaires"
              name="addInfo"
              onChange={({ target: { name, value } }) => {
                console.log("add, info", value);
                handleChange(name, value);
              }}
              value={addInfo}
            />
          </Form.Row>
        </Form.Row>

        <Form.Row>
          <Form.ButtonContainer style={{ width: "80%" }}>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              // loading={formik.isSubmitting}
              disabled={
                !name || location.length === 0 || !type || !color || !startDate
              }
            />
          </Form.ButtonContainer>
        </Form.Row>
      </Form.Form>
    </div>
  );
}
