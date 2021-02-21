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
  companyLogo: Yup.array().min(1, "Required").required("Required"),
  companyName: Yup.string().required("Required"),
  companyColor: Yup.string().required("Required"),
  companyResponsibleFirstName: Yup.string().required("Required"),
  companyResponsibleLastName: Yup.string().required("Required"),
  companyResponsibleEmail: Yup.string().required("Required"),
  companyResponsiblePhone: Yup.number()
    .test(
      "len",
      "Must be exactly 10 characters",
      (val) => val && val.toString().length === 10,
    )
    .required("Required"),
  typeOfContract: Yup.string().required("Required"),
  contractStartDate: Yup.string().required("Required"),
  contractEndDate: Yup.string().required("Required"),
  functionalitySubscribed: Yup.string().required("Required"),
  additionalInformation: Yup.string(),
  notificationPriorToDays: Yup.number(),
  notificationTo: Yup.array(),
});

export default function Profile(props) {
  const classes = useStyles();
  const store = useSelector((state) => state.auth);

  const onSubmit = async (values) => {
    console.log("values", values);

    const notificationTo = values.notificationTo.map((item) => item.label);

    var formdata = new FormData();
    formdata.append("logo", values.companyLogo[0].file);
    formdata.append("name", values.companyName);
    formdata.append("color", values.companyColor);
    formdata.append("firstName", values.companyResponsibleFirstName);
    formdata.append("lastName", values.companyResponsibleLastName);
    formdata.append("email", values.companyResponsibleEmail);
    formdata.append("phone", values.companyResponsiblePhone);
    formdata.append("contractType", values.typeOfContract);
    formdata.append("contractStartDate", values.contractStartDate);
    formdata.append("contractEndDate", values.contractEndDate);
    formdata.append("functionality", values.functionalitySubscribed);
    formdata.append("additionalInfo", values.additionalInformation);
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
      companyLogo: [],
      companyName: "",
      companyColor: "",
      companyResponsibleFirstName: "",
      companyResponsibleLastName: "",
      companyResponsibleEmail: "",
      companyResponsiblePhone: "",
      typeOfContract: "CLIENTPERSITE",
      contractStartDate: "",
      contractEndDate: "",
      functionalitySubscribed: "DELIVERY",
      additionalInformation: "",
      notificationPriorToDays: "",
      notificationTo: [],
    },
    validationSchema: addClientYup,
    onSubmit,
  });

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
              name="companyName"
              style={GLOBALS.Styles.inputWidth}
              placeholder="Company name"
              onChange={formik.handleChange}
              value={formik.values.companyName}
              error={formik.errors.companyName}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="COMPANY LOGO* :" />
            <Form.Row noMargin width="48%">
              <FormMultipleUpload
                name="companyLogo"
                style={GLOBALS.Styles.inputWidth}
                error={formik.errors.companyLogo}
                values={formik.values.companyLogo}
                onChange={(values) =>
                  formik.handleChange({
                    target: {
                      type: "text",
                      name: "companyLogo",
                      value: values,
                    },
                  })
                }
              />
              <FormSelect
                placeholder="Color"
                name="companyColor"
                style={GLOBALS.Styles.inputWidth}
                onChange={formik.handleChange}
                value={formik.values.companyColor}
                error={formik.errors.companyColor}
                values={[
                  "Green",
                  "Yellow",
                  "Red",
                  "Blue",
                  "Orange",
                  "Purple",
                  "Magenta",
                ]}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="RESPONSIBLE COMPANY : " />
            <Form.Row noMargin width="48%">
              <FormInput
                style={GLOBALS.Styles.inputWidth}
                placeholder="First Name"
                onChange={formik.handleChange}
                name="companyResponsibleFirstName"
                value={formik.values.companyResponsibleFirstName}
                error={formik.errors.companyResponsibleFirstName}
              />
              <FormInput
                style={GLOBALS.Styles.inputWidth}
                placeholder="Last Name"
                onChange={formik.handleChange}
                name="companyResponsibleLastName"
                value={formik.values.companyResponsibleLastName}
                error={formik.errors.companyResponsibleLastName}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="RESPONSIBLE CONTACT : " />
            <Form.Row noMargin width="48%">
              <FormInput
                style={GLOBALS.Styles.inputWidth}
                placeholder="E-mail Address"
                onChange={formik.handleChange}
                name="companyResponsibleEmail"
                value={formik.values.companyResponsibleEmail}
                error={formik.errors.companyResponsibleEmail}
              />
              <FormInput
                style={GLOBALS.Styles.inputWidth}
                placeholder="Phone Number"
                onChange={formik.handleChange}
                name="companyResponsiblePhone"
                value={formik.values.companyResponsiblePhone}
                error={formik.errors.companyResponsiblePhone}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="TYPE OF CONTRACT* : " />
            <RadioButton
              name="typeOfContract"
              style={GLOBALS.Styles.inputWidth}
              value={formik.values.typeOfContract}
              error={formik.errors.typeOfContract}
              onChange={formik.handleChange}
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
                style={GLOBALS.Styles.inputWidth}
                placeholder="Start date"
                name="contractStartDate"
                onChange={formik.handleChange}
                value={formik.values.contractStartDate}
                error={formik.errors.contractStartDate}
              />
              <FormInput
                type="date"
                placeholder="End date"
                style={GLOBALS.Styles.inputWidth}
                name="contractEndDate"
                onChange={formik.handleChange}
                value={formik.values.contractEndDate}
                error={formik.errors.contractEndDate}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="FUNCTIONALITY SUBSCRIBED : " />
            <RadioButton
              style={GLOBALS.Styles.inputWidth}
              name="functionalitySubscribed"
              onChange={formik.handleChange}
              value={formik.values.functionalitySubscribed}
              error={formik.errors.functionalitySubscribed}
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
              name="additionalInformation"
              value={formik.values.additionalInformation}
              error={formik.errors.additionalInformation}
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
                formik.handleChange({
                  target: {
                    type: "text",
                    name: "notificationTo",
                    value: values,
                  },
                })
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
