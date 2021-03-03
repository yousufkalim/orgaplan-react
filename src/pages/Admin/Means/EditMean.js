import React , { useState, useEffect }from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import SmallText from "../../../components/SmallText";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import RadioButton from "../../../components/RadioButton";
import MultiAdderInput from "../../../components/MultiAdderInput";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";
import MultiAdderInputModal from "../../../components/MultiAdderInputModal";
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

const addClientYup = Yup.object().shape({
  logo: Yup.array().min(1, "Required").required("Required"),
  name: Yup.string().required("Required"),
  color: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().required("Required"),
  phone: Yup.number()
    .test(
      "len",
      "Must be exactly 10 characters",
      (val) => val && val.toString().length === 10,
    )
    .required("Required"),
  contractType: Yup.string().required("Required"),
  contractStartDate: Yup.string().required("Required"),
  contractEndDate: Yup.string().required("Required"),
  functionality: Yup.string().required("Required"),
  additionalInfo: Yup.string(),
  notificationPriorToDays: Yup.number(),
  notificationTo: Yup.array(),
});

export default function EditMean(props) {
    const [addresses, setAddresses] = useState([]);
    const [update, setUpdate] = useState(false);


  const classes = useStyles();
  const store = useSelector((state) => state.auth);

  const onSubmit = async (values) => {
    const notificationTo = values.notificationTo.map((item) => item.label);

    var formdata = new FormData();
    formdata.append("logo", values.logo[0].file);
    formdata.append("name", values.name);
    formdata.append("color", values.color);
    formdata.append("firstName", values.firstName);
    formdata.append("lastName", values.lastName);
    formdata.append("email", values.email);
    formdata.append("phone", values.phone);
    formdata.append("contractType", values.contractType);
    formdata.append("contractStartDate", values.contractStartDate);
    formdata.append("contractEndDate", values.contractEndDate);
    formdata.append("functionality", values.functionality);
    formdata.append("additionalInfo", values.additionalInfo);
    formdata.append("notificationPriorToDays", values.notificationPriorToDays);
    formdata.append("notificationTo", JSON.stringify(notificationTo));

    await GLOBALS.API({
      method: "POST",
      uri: GLOBALS.Constants.CLIENTS,
      headers: {
        Authorization: store.token,
      },
      body: formdata,
    });
    formik.setSubmitting(false);
    props.history.push("/clients");
  };

  const formik = useFormik({
    initialValues: {
      logo: [],
      name: "",
      color: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      contractType: "CLIENTPERSITE",
      contractStartDate: "",
      contractEndDate: "",
      functionality: "DELIVERY",
      additionalInfo: "",
      notificationPriorToDays: "",
      notificationTo: [],
    },
    validationSchema: addClientYup,
    onSubmit,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
  });

  function handleChange(name, value) {
    if (name === "addresses") {
      setUpdate((st) => !st);
      setAddresses(value);
    } 
  }


  return (
    <div className={classes.root}>
      <Form.Row>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />

      </IconButton>
      <div className="text-center pr-5">
      <img src={Images.profile2} />
      <div>Thierry Marles</div>
      </div>

      </Form.Row>
      <Form.Row>
      <Heading primary="EDIT A MEAN" />
      <Button
                fullWidth={false}
                component={NavLink}
                text="EDIT LOCATION"
                to={"/means/add-mean"}
                style={{
                  marginRight: "100px",
                  marginBottom: "7px",
                  width: "320px",
                  textAlign: "left",
                  backgroundColor: "#140772"
                }}
              />

      </Form.Row>
      <div className={classes.content}>
        <Form.Form onSubmit={formik.handleSubmit}>
          <Form.Row >
            <FormLabel bold primary="IDENTITY : " />
            <Form.Row noMargin width="65%" style={{gap: "20px"}}>
            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth}
              placeholder="Company name"
              onChange={formik.handleChange}
              value={formik.values.name}
              error={formik.errors.name}
            />
             <FormSelect
                placeholder="Type"
                name="color"
                style={GLOBALS.Styles.inputWidth}
                onChange={formik.handleChange}
                value={formik.values.color}
                error={formik.errors.color}
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
                onChange={formik.handleChange}
                value={formik.values.color}
                error={formik.errors.color}
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
                name="logo"
                style={GLOBALS.Styles.inputWidth}
                error={formik.errors.logo}
                values={formik.values.logo}
                onChange={(values) =>
                  formik.handleChange({
                    target: {
                      type: "text",
                      name: "logo",
                      value: values,
                    },
                  })
                }
              />
            </Form.Row>
           
          </Form.Row>

          <Form.Row>
          <FormLabel bold primary="" />
          <Form.Row noMargin width="65%">
          <MultiAdderInputModal
            name="addresses"
            values={addresses}
            // error={addresses}
            style={GLOBALS.Styles.inputWidth}
            placeholder="Enter site addresses"
            onChange={(values) => handleChange("addresses", values)}
          />
          </Form.Row>
        </Form.Row>

        <Form.Row>
            <FormLabel bold primary="DISPONIBILITE : " />
            <Form.Row noMargin width="65%" justifyContent="flex-start" style={{gap: "20px"}}>
              <FormInput
                type="date"
                style={{width: "300px"}}
                placeholder="Date de début"
                name="contractStartDate"
                onChange={formik.handleChange}
                value={formik.values.contractStartDate}
                error={formik.errors.contractStartDate}
              />
              <FormInput
                type="date"
                placeholder="Date de fin"
                style={{width: "300px"}}
                name="contractEndDate"
                onChange={formik.handleChange}
                value={formik.values.contractEndDate}
                error={formik.errors.contractEndDate}
              />
            </Form.Row>
          </Form.Row>


          <Form.Row>
            <FormLabel bold primary="FICHE TECHNIQUE : " />
            <Form.Row noMargin width="65%">
              <FormMultipleUpload
                name="logo"
                style={GLOBALS.Styles.inputWidth}
                error={formik.errors.logo}
                values={formik.values.logo}
                onChange={(values) =>
                  formik.handleChange({
                    target: {
                      type: "text",
                      name: "logo",
                      value: values,
                    },
                  })
                }
              />
              
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary="INDISPONIBILITES : " />
            <Form.Row noMargin width="65%">
            <Button
                fullWidth={false}
                component={NavLink}
                text="VOIR LES INDISPONIBILITÉS"
                to={"/means/add-mean"}
                style={{
                  marginLeft: "0px",
                  marginBottom: "7px",
                  width: "320px",
                  textAlign: "center",
                  backgroundColor: "#140772"
                }}
              />
              
            </Form.Row>
          </Form.Row>


         
         
          
          
         
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="TARIF HORAIRE : " />
           <Form.Row noMargin width="65%">
           <FormInput
              textArea
              rows={1}
              style={{width: "300px", textAlign: "right"}}
              onChange={formik.handleChange}
              placeholder="€"
              name="additionalInfo"
              value={formik.values.additionalInfo}
              error={formik.errors.additionalInfo}
            />
           </Form.Row>
          </Form.Row>

          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="INFORMATIONS COMPLÉMENTAIRES : " />
           <Form.Row noMargin width="65%">
           <FormInput
              textArea
              rows={3}
              style={{width: "600px"}}
              onChange={formik.handleChange}
              placeholder="Informations complémentaires"
              name="additionalInfo"
              value={formik.values.additionalInfo}
              error={formik.errors.additionalInfo}
            />
           </Form.Row>
          </Form.Row>
          
         
          <Form.Row>
          <Form.ButtonContainer style={{width: "80%"}}>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting}
            />
          </Form.ButtonContainer>
          </Form.Row>
        </Form.Form>
      </div>
    </div>
  );
}
