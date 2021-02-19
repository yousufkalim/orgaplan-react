import React, { useState } from "react";
import { useForm } from "react-hook-form";
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

const formInputStyle = {
  width: "48%",
};

const addClientYup = Yup.object().shape({
  companyLogo: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string(),
      }),
    )
    .required(GLOBALS.I18n.t("required")),
  companyName: Yup.string().required(GLOBALS.I18n.t("required")),
  companyColor: Yup.string().required(GLOBALS.I18n.t("required")),
  companyResponsibleFirstName: Yup.string().required(
    GLOBALS.I18n.t("required"),
  ),
  companyResponsibleLastName: Yup.string().required(GLOBALS.I18n.t("required")),
  companyResponsibleEmail: Yup.string().required(GLOBALS.I18n.t("required")),
  companyResponsiblePhone: Yup.number().required(GLOBALS.I18n.t("required")),
  typeOfContract: Yup.string().required(GLOBALS.I18n.t("required")),
  contractStartDate: Yup.string().when("typeOfContract", {
    is: "MASTERCLIENT",
    then: Yup.string().required("Required"),
  }),
  contractEndDate: Yup.string().when("typeOfContract", {
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
  const [companyLogo, setLogo] = useState([]);
  const [companyName, setName] = useState("");
  const [companyColor, setColor] = useState("");
  const [companyResponsibleFirstName, setFirstName] = useState("");
  const [companyResponsibleLastName, setLastName] = useState("");
  const [companyResponsibleEmail, setEmail] = useState("");
  const [companyResponsiblePhone, setPhone] = useState("");
  const [typeOfContract, setTypeOfContract] = useState("CLIENTPERSITE");
  const [contractStartDate, setStartDate] = useState("");
  const [contractEndDate, setEndDate] = useState("");
  const [functionalitySubscribed, setFunctionality] = useState("DELIVERY");
  const [additionalInformation, setInformation] = useState("");
  const [notificationPriorToDays, setNotifyDays] = useState("2");
  const [notificationTo, setEmailAddress] = useState([]);

  const [errors, setErrors] = useState({
    companyLogo: false,
    companyName: false,
    companyColor: false,
    companyResponsibleFirstName: false,
    companyResponsibleLastName: false,
    companyResponsibleEmail: false,
    companyResponsiblePhone: false,
    typeOfContract: false,
    contractStartDate: false,
    contractEndDate: false,
    functionalitySubscribed: false,
    additionalInformation: false,
    notificationPriorToDays: false,
    notificationTo: false,
  });

  const onSubmit = async () => {
    const data = {
      companyLogo,
      companyName,
      companyColor,
      companyResponsibleFirstName,
      companyResponsibleLastName,
      companyResponsibleEmail,
      companyResponsiblePhone,
      typeOfContract,
      contractStartDate,
      contractEndDate,
      functionalitySubscribed,
      additionalInformation,
      notificationPriorToDays,
      notificationTo,
    };
    addClientYup
      .validate(data)
      .then((validData) => console.log("validData", validData))
      .catch((err) => console.log(err));
  };

  function handleChange({ target: { name, value } }) {
    console.log("name", name, value);
    eval("set" + name);
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD A CLIENT" />
      <div className={classes.content}>
        <Form.Form>
          <Form.Row>
            <FormLabel bold primary="COMPANY NAME* :" />
            <FormInput
              error={"Required"}
              value={companyName}
              name={"companyName"}
              style={formInputStyle}
              onChange={handleChange}
              placeholder="Company name"
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="COMPANY LOGO* :" />
            <Form.Row noMargin width="48%">
              <FormMultipleUpload
                error={"Required"}
                values={companyLogo}
                name={"companyLogo"}
                style={formInputStyle}
                onChange={(values) => {
                  setLogo(values);
                }}
              />
              <FormSelect
                error={"Required"}
                placeholder="Color"
                value={companyColor}
                name={"companyColor"}
                style={formInputStyle}
                onChange={handleChange}
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
                error={"Required"}
                style={formInputStyle}
                onChange={handleChange}
                placeholder="First Name"
                value={companyResponsibleFirstName}
                name={"companyResponsibleFirstName"}
              />
              <FormInput
                error={"Required"}
                style={formInputStyle}
                onChange={handleChange}
                placeholder="Last Name"
                value={companyResponsibleLastName}
                name={"companyResponsibleLastName"}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="RESPONSIBLE CONTACT : " />
            <Form.Row noMargin width="48%">
              <FormInput
                error={"Required"}
                style={formInputStyle}
                onChange={handleChange}
                placeholder="E-mail Address"
                value={companyResponsibleEmail}
                name={"companyResponsibleEmail"}
              />
              <FormInput
                error={"Required"}
                style={formInputStyle}
                onChange={handleChange}
                placeholder="Phone Number"
                value={companyResponsiblePhone}
                name={"companyResponsiblePhone"}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="TYPE OF CONTRACT* : " />
            <RadioButton
              style={formInputStyle}
              value={typeOfContract}
              onChange={handleChange}
              name={"typeOfContract"}
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
                error={"Required"}
                style={formInputStyle}
                onChange={handleChange}
                placeholder="Start date"
                value={contractStartDate}
                name={"contractStartDate"}
              />
              <FormInput
                type="date"
                error={"Required"}
                placeholder="End date"
                style={formInputStyle}
                onChange={handleChange}
                value={contractEndDate}
                name={"contractEndDate"}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="FUNCTIONALITY SUBSCRIBED : " />
            <RadioButton
              style={formInputStyle}
              onChange={handleChange}
              value={functionalitySubscribed}
              name={"functionalitySubscribed"}
              items={[{ value: "DELIVERY", label: "Delivery module" }]}
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="ADDITIONNAL INFORMATION :" />
            <FormInput
              textArea
              rows={3}
              error={"Required"}
              style={formInputStyle}
              onChange={handleChange}
              value={additionalInformation}
              name={"additionalInformation"}
              placeholder="Additional information"
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
                error={"Required"}
                onChange={handleChange}
                value={notificationPriorToDays}
                name={"notificationPriorToDays"}
                style={{ ...formInputStyle, maxWidth: 100 }}
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
              error={"Required"}
              style={formInputStyle}
              values={notificationTo}
              name={"notificationTo"}
              validateError="Invalid Email"
              placeholder="Enter email address"
              onChange={(values) => setEmailAddress(values)}
              validate={(text) => {
                const re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/;
                return !re.test(String(text).toLowerCase());
              }}
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
      </div>
    </div>
  );
}
