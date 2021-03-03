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

export default function AddUser(props) {
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
      <Heading primary="ADD USER" />
      <div className={classes.content}>
        <Form.Form onSubmit={formik.handleSubmit}>
          <Form.Row>
            <FormLabel bold primary="CONTACT INFO* :" />
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
            <FormLabel bold primary="INDENTITY* :" />
            <Form.Row width="48%">
            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth, {marginRight: "10px"}}
              placeholder="FIRST NAME"
              onChange={formik.handleChange}
              value={formik.values.name}
              error={formik.errors.name}
            />
            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth, {marginRight: "10px"}}
              placeholder="LAST NAME"
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
            <FormLabel bold primary="COMPANY : " />
            <Form.Row noMargin width="48%">
            <FormSelect
                placeholder="Company"
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
            <FormLabel bold primary="RÔLE : " />
            <Form.Row noMargin width="48%">
            <FormSelect
                placeholder="RÔLE : "
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
          <FormLabel bold primary="CONSTRUCTION SITE : " />
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
          
         
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="CONTINUER"
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
