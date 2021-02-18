import React, { useState } from "react";
import { Formik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import IconButton from "@material-ui/core/IconButton";

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

const formInputStyle = {
  width: "48%",
};

const addClientYup = Yup.object().shape({
  companyName: Yup.string().required(GLOBALS.I18n.t("required")),
  companyLogo: Yup.object().shape({
    name: Yup.string().required(GLOBALS.I18n.t("required")),
  }),
  companyColor: Yup.string().required(GLOBALS.I18n.t("required")),
  companyResponsibleFirstName: Yup.string().required(
    GLOBALS.I18n.t("required"),
  ),
  companyResponsibleLastName: Yup.string().required(GLOBALS.I18n.t("required")),
  companyResponsibleEmail: Yup.string().required(GLOBALS.I18n.t("required")),
  companyResponsiblePhone: Yup.number().required(GLOBALS.I18n.t("required")),
  typeOfContract: Yup.string().required(GLOBALS.I18n.t("required")),
  contractStartDate: Yup.date().when("typeOfContract", {
    is: "MASTERCLIENT",
    then: Yup.string().required("Required"),
  }),
  contractEndDate: Yup.date().when("typeOfContract", {
    is: "MASTERCLIENT",
    then: Yup.string().required("Required"),
  }),
  functionalitySubscribed: Yup.string().required(GLOBALS.I18n.t("required")),
  additionalInformation: Yup.string().required(GLOBALS.I18n.t("required")),
  notificationPriorToDays: Yup.number().required(GLOBALS.I18n.t("required")),
  notificationTo: Yup.array().of(
    Yup.string().required(GLOBALS.I18n.t("required")),
  ),
});

export default function Profile(props) {
  const classes = useStyles();
  const [logo, setLogo] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [typeOfContract, setTypeOfContract] = useState("CLIENTPERSITE");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [functionality, setFunctionality] = useState("DELIVERY");
  const [information, setInformation] = useState("");
  const [notifyDays, setNotifyDays] = useState("2");
  const [emailAddress, setEmailAddress] = useState([]);

  const onSubmit = () => {
    console.log("Google");
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD A CLIENT" />
      <div className={classes.content}>
        <Formik
          initialValues={{}}
          validationSchema={addClientYup}
          onSubmit={onSubmit}
        >
          {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
            <Form.Form onSubmit={handleSubmit}>
              <Form.Row>
                <FormLabel bold primary="COMPANY NAME* :" />
                <FormInput
                  name="companyName"
                  onBlur={handleBlur}
                  style={formInputStyle}
                  onChange={handleChange}
                  value={values.companyName}
                  error={errors.companyName}
                  placeholder={GLOBALS.I18n.t("Company name")}
                />
              </Form.Row>
              <Form.Row>
                <FormLabel bold primary="COMPANY LOGO* :" />
                <Form.Row noMargin width="48%">
                  <FormMultipleUpload
                    style={formInputStyle}
                    values={logo}
                    onChange={(values) => {
                      setLogo(values);
                    }}
                  />
                  <FormSelect
                    name="companyColor"
                    onBlur={handleBlur}
                    style={formInputStyle}
                    error={errors.companyName}
                    value={values.companyColor}
                    placeholder={GLOBALS.I18n.t("Color")}
                    onChange={({ target: { name, value } }) => setColor(value)}
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
                    name="companyResponsibleFirstName"
                    onBlur={handleBlur}
                    style={formInputStyle}
                    onChange={handleChange}
                    value={values.companyResponsibleFirstName}
                    error={errors.companyResponsibleFirstName}
                    placeholder={GLOBALS.I18n.t("First Name")}
                  />
                  <FormInput
                    name="companyResponsibleLastName"
                    onBlur={handleBlur}
                    style={formInputStyle}
                    onChange={handleChange}
                    value={values.companyResponsibleLastName}
                    error={errors.companyResponsibleLastName}
                    placeholder={GLOBALS.I18n.t("Last Name")}
                  />
                </Form.Row>
              </Form.Row>
              <Form.Row>
                <FormLabel bold primary="RESPONSIBLE CONTACT : " />
                <Form.Row noMargin width="48%">
                  <FormInput
                    type="email"
                    name="companyResponsibleEmail"
                    onBlur={handleBlur}
                    style={formInputStyle}
                    onChange={handleChange}
                    value={values.companyResponsibleEmail}
                    error={errors.companyResponsibleEmail}
                    placeholder={GLOBALS.I18n.t("E-mail Address")}
                  />
                  <FormInput
                    type="number"
                    name="companyResponsiblePhone"
                    onBlur={handleBlur}
                    style={formInputStyle}
                    onChange={handleChange}
                    value={values.companyResponsiblePhone}
                    error={errors.companyResponsiblePhone}
                    placeholder={GLOBALS.I18n.t("Phone Number")}
                  />
                </Form.Row>
              </Form.Row>
              <Form.Row>
                <FormLabel bold primary="TYPE OF CONTRACT* : " />
                <RadioButton
                  style={formInputStyle}
                  value={typeOfContract}
                  onChange={({ target: { value } }) => setTypeOfContract(value)}
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
                    value={startDate}
                    style={formInputStyle}
                    placeholder="Start date"
                    onChance={({ target: { value } }) => setStartDate(value)}
                  />
                  <FormInput
                    type="date"
                    value={endDate}
                    placeholder="End date"
                    style={formInputStyle}
                    onChance={({ target: { value } }) => setEndDate(value)}
                  />
                </Form.Row>
              </Form.Row>
              <Form.Row>
                <FormLabel bold primary="FUNCTIONALITY SUBSCRIBED : " />
                <RadioButton
                  value={functionality}
                  style={formInputStyle}
                  onChange={({ target: { value } }) => setFunctionality(value)}
                  items={[{ value: "DELIVERY", label: "Delivery module" }]}
                />
              </Form.Row>
              <Form.Row alignItems="flex-start">
                <FormLabel bold primary="ADDITIONNAL INFORMATION :" />
                <FormInput
                  textArea
                  rows={3}
                  value={information}
                  style={formInputStyle}
                  placeholder="Additional information"
                  onChange={({ target: { value } }) => setInformation(value)}
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
                    value={notifyDays}
                    style={{ ...formInputStyle, maxWidth: 100 }}
                    onChange={({ target: { value } }) => setNotifyDays(value)}
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
                  values={emailAddress}
                  style={formInputStyle}
                  validate={(text) => {
                    const re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/;
                    return !re.test(String(text).toLowerCase());
                  }}
                  error="Invalid Email"
                  placeholder="Enter email address"
                  onChange={(values) => setEmailAddress(values)}
                />
              </Form.Row>
              <Form.ButtonContainer>
                <Button
                  minWidth={200}
                  text="VALIDATE"
                  fullWidth={false}
                  onClick={onSubmit}
                />
              </Form.ButtonContainer>
            </Form.Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
