import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import * as Yup from "yup";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/CustomFormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";
import CustomInputModal from "../../../components/CustomInputModal";
import CustomButtonModal from "../../../components/CustomButtonModal";
import { Images } from "../../../assets/Assets";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

// const addClientYup = Yup.object().shape({
//   logo: Yup.array().min(1, "Required").required("Required"),
//   name: Yup.string().required("Required"),
//   color: Yup.string().required("Required"),
//   firstName: Yup.string().required("Required"),
//   lastName: Yup.string().required("Required"),
//   email: Yup.string().required("Required"),
//   phone: Yup.number()
//     .test(
//       "len",
//       "Must be exactly 10 characters",
//       (val) => val && val.toString().length === 10,
//     )
//     .required("Required"),
//   contractType: Yup.string().required("Required"),
//   contractStartDate: Yup.string().required("Required"),
//   contractEndDate: Yup.string().required("Required"),
//   functionality: Yup.string().required("Required"),
//   additionalInfo: Yup.string(),
//   notificationPriorToDays: Yup.number(),
//   notificationTo: Yup.array(),
// });

export default function AddMean(props) {
  const [addresses] = useState([]);

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

  const classes = useStyles();

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
    <div className={classes.root}>
     
        <IconButton onClick={() => props.history.goBack()}>
          <BackArrow style={{ width: 30, height: 30 }} />
        </IconButton>
       

      <Form.Row>
        <Heading primary="ADD A MEAN" />
        <CustomButtonModal
          name="addresses"
          values={addresses}
          title="LOCALISATION"
          // error={addresses}
          //    style={GLOBALS.Styles.inputWidth}
          style={{ width: "250px", marginRight: "240px" }}
          placeholder="Enter site addresses"
          onChange={(values) => handleChange("addresses", values)}
        />
        {/* <Button
                fullWidth={false}
                component={NavLink}
                text="LOCALISATION"
                to={"/means/add-mean"}
                style={{
                  marginRight: "100px",
                  marginBottom: "7px",
                  width: "320px",
                  textAlign: "center",
                  backgroundColor: "#140772"
                }}
              /> */}
      </Form.Row>
      <div className={classes.content}>
        <Form.Form>
          <Form.Row>
            <FormLabel bold primary="IDENTITY : " />
            <Form.Row noMargin width="65%" style={{ gap: "20px" }}>
              <FormInput
                name="name"
                error
                style={GLOBALS.Styles.inputWidth}
                placeholder="Company name"
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                value={name}
                validateSchema={Yup.string().required()}
              />
              <FormSelect
                placeholder="Type"
                name="type"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                value={type}
                values={[
                  { value: "green", label: "Green" },
                  { value: "Yellow", label: "Yellow" },
                  { value: "Red", label: "Red" },
                  { value: "Blue", label: "Blue" },
                  { value: "Orange", label: "Orange" },
                  { value: "Purple", label: "Purple" },
                  { value: "Magenta", label: "Magenta" },
                ]}
              />
              <FormSelect
                placeholder="color"
                name="color"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                value={color}
                values={[
                  { value: "green", label: "Green" },
                  { value: "Yellow", label: "Yellow" },
                  { value: "Red", label: "Red" },
                  { value: "Blue", label: "Blue" },
                  { value: "Orange", label: "Orange" },
                  { value: "Purple", label: "Purple" },
                  { value: "Magenta", label: "Magenta" },
                ]}
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
            <FormLabel bold primary="LOCATION :  " />
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
            <FormLabel bold primary="DISPONIBILITE :" />
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
                  !name ||
                  location.length === 0 ||
                  !type ||
                  !color ||
                  !startDate
                }
              />
            </Form.ButtonContainer>
          </Form.Row>
        </Form.Form>
      </div>
    </div>
  );
}

/*
 onChange={(value) => {
            if(props.validte) 
            {
              props.ypuprop.validate(value)
            }
          }}
        */
