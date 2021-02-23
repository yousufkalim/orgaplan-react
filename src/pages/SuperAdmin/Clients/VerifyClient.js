import React, { useEffect } from "react";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import * as Yup from "yup";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

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

export default function Profile(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const onSubmit = async (values) => {
    try {
      let item = props.location.item;

      const notificationTo = values.notificationTo.map((item) => item.label);

      var formdata = new FormData();
      formdata.append("logo", values.logo[0].file);
      formdata.append("color", values.color);
      formdata.append("clientId", item._id);
      formdata.append("companyId", item.companyId._id);
      formdata.append("name", values.name);
      formdata.append("firstName", values.firstName);
      formdata.append("lastName", values.lastName);
      formdata.append("email", values.email);
      formdata.append("phone", values.phone);
      formdata.append("contractType", values.contractType);
      formdata.append("contractEndDate", values.contractEndDate);
      formdata.append("contractStartDate", values.contractStartDate);
      formdata.append("functionality", values.functionality);
      formdata.append("additionalInfo", values.additionalInfo);
      formdata.append(
        "notificationPriorToDays",
        values.notificationPriorToDays,
      );
      formdata.append("notificationTo", JSON.stringify(notificationTo));

      await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.CLIENTS_VERIFY}`,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      formik.setSubmitting(false);
      props.history.replace("/clients");
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err, "error"),
        ),
      );
    }
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
  });

  useEffect(() => {
    let item = props.location.item;
    formik.setValues({
      logo: [],
      name: item.companyId.name,
      color: "",
      firstName: item.companyId.incharge.firstName,
      lastName: item.companyId.incharge.lastName,
      email: item.companyId.incharge.email,
      phone: item.companyId.incharge.phone,
      contractType: item.companyId.type,
      contractStartDate: "",
      contractEndDate: "",
      functionality: "DELIVERY",
      additionalInfo: "",
      notificationPriorToDays: 0,
      notificationTo: [],
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD A CLIENT" />
      <div className={classes.content}>
        <Form.Form onSubmit={formik.handleSubmit}>
          <Form.Row>
            <FormLabel bold primary="COMPANY NAME* :" />
            <FormInput
              name="name"
              disabled
              placeholder="Company name"
              value={formik.values.name}
              error={formik.errors.name}
              onChange={formik.handleChange}
              style={GLOBALS.Styles.inputWidth}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="COMPANY LOGO* :" />
            <Form.Row noMargin width="48%">
              <FormMultipleUpload
                name="logo"
                error={formik.errors.logo}
                values={formik.values.logo}
                style={GLOBALS.Styles.inputWidth}
                onChange={(values) => formik.setFieldValue("logo", values)}
              />
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
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="RESPONSIBLE COMPANY : " />
            <Form.Row noMargin width="48%">
              <FormInput
                disabled
                name="firstName"
                placeholder="First Name"
                onChange={formik.handleChange}
                value={formik.values.firstName}
                error={formik.errors.firstName}
                style={GLOBALS.Styles.inputWidth}
              />
              <FormInput
                disabled
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
            <FormLabel bold primary="RESPONSIBLE CONTACT : " />
            <Form.Row noMargin width="48%">
              <FormInput
                disabled
                name="email"
                placeholder="E-mail Address"
                value={formik.values.email}
                error={formik.errors.email}
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
              />
              <FormInput
                disabled
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
            <FormLabel bold primary="TYPE OF CONTRACT* : " />
            <RadioButton
              disabled
              name="contractType"
              onChange={formik.handleChange}
              style={GLOBALS.Styles.inputWidth}
              value={formik.values.contractType}
              error={formik.errors.contractType}
              items={[
                { value: "CLIENTPERSITE", label: "Per Site" },
                { value: "MASTERCLIENT", label: "Master Contract" },
              ]}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="CONTRACT DATE* : " />
            <Form.Row noMargin width="48%">
              <FormInput
                type="date"
                placeholder="Start date"
                name="contractStartDate"
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.contractStartDate}
                error={formik.errors.contractStartDate}
              />
              <FormInput
                type="date"
                placeholder="End date"
                name="contractEndDate"
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.contractEndDate}
                error={formik.errors.contractEndDate}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="FUNCTIONALITY SUBSCRIBED : " />
            <RadioButton
              name="functionality"
              onChange={formik.handleChange}
              style={GLOBALS.Styles.inputWidth}
              value={formik.values.functionality}
              error={formik.errors.functionality}
              items={[{ value: "DELIVERY", label: "Delivery module" }]}
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="ADDITIONNAL INFORMATION :" />
            <FormInput
              textArea
              rows={3}
              style={GLOBALS.Styles.inputWidth}
              onChange={formik.handleChange}
              placeholder="Additional information"
              name="additionalInfo"
              value={formik.values.additionalInfo}
              error={formik.errors.additionalInfo}
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="NOTIFICATION : " />
            <Form.Row
              noMargin
              width="48%"
              alignItems="center"
              justifyContent="center"
            >
              <FormInput
                type="number"
                name="notificationPriorToDays"
                onChange={formik.handleChange}
                value={formik.values.notificationPriorToDays}
                error={formik.errors.notificationPriorToDays}
                style={{ ...GLOBALS.Styles.inputWidth, maxWidth: 100 }}
              />
              <SmallText
                primary="Days before end of the contract"
                style={{ marginLeft: "10px" }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="NOTIFY THE ADDRESSES : " />
            <MultiAdderInput
              style={GLOBALS.Styles.inputWidth}
              name="notificationTo"
              validateError="Invalid Email"
              placeholder="Enter email address"
              values={formik.values.notificationTo}
              onChange={(values) =>
                formik.setFieldValue("notificationTo", values)
              }
              validate={(text) => {
                const re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/;
                return !re.test(String(text).toLowerCase());
              }}
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
