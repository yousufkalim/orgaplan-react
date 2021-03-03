import React from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import * as Yup from "yup";

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

export default function AddCompanies(props) {
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

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD A COMPANY" />
      <div className={classes.content}>
        <Form.Form onSubmit={formik.handleSubmit}>
          <Form.Row>
            <FormLabel bold primary="IDENTITY* :" />
            <Form.Row width="48%">
            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth, {marginRight: "10px"}}
              placeholder="Name of Company"
              onChange={formik.handleChange}
              value={formik.values.name}
              error={formik.errors.name}
            />
            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth, {marginRight: "10px"}}
              placeholder="Color"
              onChange={formik.handleChange}
              value={formik.values.name}
              error={formik.errors.name}
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
            <FormLabel bold primary="TYPE OF COMPANY* :" />
            <RadioButton
              name="contractType"
              style={GLOBALS.Styles.inputWidth}
              value={formik.values.contractType}
              error={formik.errors.contractType}
              onChange={formik.handleChange}
              items={[
                { value: "GENERALCONTRACTOR", label: "General Contractor" },
                { value: "Subcontractor", label: "Subcontract" },
              ]}
            />
              
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="GENERAL CONTRACTOR : " />
            <Form.Row noMargin width="48%">
            <FormSelect
                placeholder="List"
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
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="TRADES : " />
            <Form.Row noMargin width="48%">
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
            <FormLabel bold primary="IDEMTITY OF RESPONSIBLE* : " />
            <Form.Row width="48%">
              
            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth, {marginRight: "10px"}}
              placeholder="Adresse e-mail"
              onChange={formik.handleChange}
              value={formik.values.name}
              error={formik.errors.name}
            />
            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth, {marginRight: "10px"}}
              placeholder="Téléphone"
              onChange={formik.handleChange}
              value={formik.values.name}
              error={formik.errors.name}
            />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel/>
            <Form.Row noMargin width="48%">
            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth, {marginRight: "10px"}}
              placeholder="First Name"
              onChange={formik.handleChange}
              value={formik.values.name}
              error={formik.errors.name}
            />
            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth, {marginRight: "10px"}}
              placeholder="Last Name"
              onChange={formik.handleChange}
              value={formik.values.name}
              error={formik.errors.name}
            />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="Website : " />
            <Form.Row width="48%">

            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth, {marginRight: "10px", textAlign:"left"}}
              placeholder="http://"
              onChange={formik.handleChange}
              value={formik.values.name}
              error={formik.errors.name}
            />
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="ADDITIONNAL INFORMATION :" />
            <FormInput
              textArea
              rows={3}
              style={GLOBALS.Styles.inputWidth}
              onChange={formik.handleChange}
              placeholder="Informations complémentaires"
              name="additionalInfo"
              value={formik.values.additionalInfo}
              error={formik.errors.additionalInfo}
            />
          </Form.Row>
          
         
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting}
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
