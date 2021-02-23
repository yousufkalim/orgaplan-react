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
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
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

const addAdminYup = Yup.object().shape({
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
  profile: Yup.array().min(1, "Required").required("Required"),
  color: Yup.string().required("Required"),
});

export default function AddAdmin(props) {
  const classes = useStyles();
  const store = useSelector((state) => state.auth);

  const onSubmit = async (values) => {
    var formdata = new FormData();
    formdata.append("email", values.email);
    formdata.append("phone", values.phone);
    formdata.append("firstName", values.firstName);
    formdata.append("lastName", values.lastName);
    formdata.append("image", values.profile[0].file);
    formdata.append("color", values.color);

    await GLOBALS.API({
      method: "POST",
      uri: GLOBALS.Constants.ADMINS,
      headers: {
        Authorization: store.token,
      },
      body: formdata,
    });
    formik.setSubmitting(false);
    props.history.push("/admins");
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      profile: [],
      color: "",
    },
    validationSchema: addAdminYup,
    onSubmit,
  });

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD AN ADMIN" />
      <div className={classes.content}>
        <Form.Form onSubmit={formik.handleSubmit}>
          <Form.Row>
            <FormLabel bold primary="CONTACT INFO: " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="email"
                placeholder="E-mail Address"
                value={formik.values.email}
                error={formik.errors.email}
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
              />
              <FormInput
                name="phone"
                placeholder="Phone Number"
                value={formik.values.phone}
                error={formik.errors.phone}
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="IDENTITY: " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="firstName"
                placeholder="First Name"
                onChange={formik.handleChange}
                value={formik.values.firstName}
                error={formik.errors.firstName}
                style={GLOBALS.Styles.inputWidth}
              />
              <FormInput
                name="lastName"
                placeholder="Last Name"
                onChange={formik.handleChange}
                value={formik.values.lastName}
                error={formik.errors.lastName}
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="PROFILE*: " />
            <FormMultipleUpload
              name="profile"
              error={formik.errors.profile}
              values={formik.values.profile}
              style={GLOBALS.Styles.inputWidth}
              onChange={(values) => formik.setFieldValue("profile", values)}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="COMPANY*: " />
            <FormSelect
              name="color"
              placeholder="Color"
              value={formik.values.color}
              error={formik.errors.color}
              onChange={formik.handleChange}
              style={GLOBALS.Styles.inputWidth}
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
