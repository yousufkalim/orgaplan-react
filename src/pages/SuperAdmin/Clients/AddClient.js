import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
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

export default function Profile(props) {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [logo, setLogo] = useState([]);
  const [color, setColor] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [typeOfContract, setTypeOfContract] = useState("perSite");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [functionality, setFunctionality] = useState("deliveryModule");
  const [information, setInformation] = useState("");
  const [notifyDays, setNotifyDays] = useState("");
  const [emailAddress, setEmailAddress] = useState([
    { key: 0, label: "test@gmail.com" },
    { key: 1, label: "tes2@gmail.com" },
  ]);

  const onSubmit = () => {
    console.log("onSubmit", {
      name,
      logo,
      color,
      firstName,
      lastName,
      email,
      phone,
      typeOfContract,
      startDate,
      endDate,
      functionality,
      information,
      notifyDays,
      emailAddress,
    });
  };

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
              value={name}
              style={formInputStyle}
              placeholder="Company name"
              onChance={({ target: { value } }) => setName(value)}
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
                value={color}
                placeholder="Color"
                style={formInputStyle}
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
                value={firstName}
                style={formInputStyle}
                placeholder="First Name"
                onChance={({ target: { value } }) => setFirstName(value)}
              />
              <FormInput
                value={lastName}
                style={formInputStyle}
                placeholder="Last Name"
                onChance={({ target: { value } }) => setLastName(value)}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="RESPONSIBLE CONTACT : " />
            <Form.Row noMargin width="48%">
              <FormInput
                value={email}
                style={formInputStyle}
                placeholder="E-mail Address"
                onChance={({ target: { value } }) => setEmail(value)}
              />
              <FormInput
                value={phone}
                style={formInputStyle}
                placeholder="Phone Number"
                onChance={({ target: { value } }) => setPhone(value)}
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
                { value: "perSite", label: "Per Site" },
                { value: "master", label: "Master Contract" },
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
              items={[{ value: "deliveryModule", label: "Delivery module" }]}
            />
          </Form.Row>
          <Form.Row style={{ alignItems: "flex-start" }}>
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
          <Form.Row style={{ alignItems: "flex-start" }}>
            <FormLabel bold primary="NOTIFICATION : " />
            <Form.Row noMargin width="48%">
              <FormInput
                type="number"
                value={notifyDays}
                style={{ ...formInputStyle, maxWidth: 100 }}
                onChange={({ target: { value } }) => setNotifyDays(value)}
              />
              <SmallText
                // style={{ marginLeft: 10 }}
                primary="Days before end of the contract"
              />
            </Form.Row>
          </Form.Row>
          <Form.Row style={{ alignItems: "flex-start" }}>
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
      </div>
    </div>
  );
}
