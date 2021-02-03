import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import RadioButton from "../../../components/RadioButton";
import MultiAdderInput from "../../../components/MultiAdderInput";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
// import { ReactComponent as Plus } from "../../../assets/icons/Plus.svg";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "40px 15px",
  },
  content: {
    padding: 15,
    marginTop: 10,
  },
}));

const formInputStyle = {
  width: "48%",
};

export default function Profile(props) {
  const classes = useStyles();
  const [typeOfContract, setTypeOfContract] = useState("perSite");
  const [functionalitySubscribed, setFunctionalitySubscribed] = useState(
    "deliveryModule",
  );
  const [emailAddress, setEmailAddress] = useState([
    { key: 0, label: "test@gmail.com" },
    { key: 1, label: "tes2@gmail.com" },
  ]);
  const [color, setColor] = useState("");
  const [logoArray, setLogoArray] = useState([]);

  const onSubmit = () => {
    console.log("onSubmit", {
      typeOfContract,
      functionalitySubscribed,
      emailAddress,
      color,
    });
  };

  return (
    <div className={classes.root}>
      <IconButton>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD A CLIENT" />
      <div className={classes.content}>
        <Form.Row>
          <FormLabel bold primary="COMPANY NAME* :" />
          <FormInput placeholder="Company name" style={formInputStyle} />
        </Form.Row>
        <Form.Row style={{ alignItems: "flex-start" }}>
          <FormLabel bold primary="COMPANY LOGO* :" />
          <Form.Row style={{ ...formInputStyle, alignItems: "flex-start" }}>
            <FormMultipleUpload
              style={formInputStyle}
              values={logoArray}
              onChange={(values) => {
                setLogoArray(values);
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
          <Form.Row style={formInputStyle}>
            <FormInput placeholder="First Name" style={formInputStyle} />
            <FormInput placeholder="Last Name" style={formInputStyle} />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="RESPONSIBLE CONTACT : " />
          <Form.Row style={formInputStyle}>
            <FormInput placeholder="Email Address" style={formInputStyle} />
            <FormInput placeholder="Phone Number" style={formInputStyle} />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="TYPE OF CONTRACT* : " />
          <RadioButton
            items={[
              { value: "perSite", label: "Per Site" },
              { value: "master", label: "Master Contract" },
            ]}
            style={formInputStyle}
            value={typeOfContract}
            onChange={(event) => setTypeOfContract(event.target.value)}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="CONTRACT DATE* : " />
          <Form.Row style={formInputStyle}>
            <FormInput
              type="date"
              style={formInputStyle}
              placeholder="Start date"
            />
            <FormInput
              type="date"
              placeholder="End date"
              style={formInputStyle}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="FUNCTIONALITY SUBSCRIBED : " />
          <RadioButton
            items={[{ value: "deliveryModule", label: "Delivery module" }]}
            style={formInputStyle}
            value={functionalitySubscribed}
            onChange={(event) => setFunctionalitySubscribed(event.target.value)}
          />
        </Form.Row>
        <Form.Row style={{ alignItems: "flex-start" }}>
          <FormLabel bold primary="ADDITIONNAL INFORMATION :" />
          <FormInput
            textArea
            rows={3}
            style={formInputStyle}
            placeholder="Company name"
          />
        </Form.Row>
        <Form.Row style={{ alignItems: "flex-start" }}>
          <FormLabel bold primary="NOTIFICATION : " />
          <FormInput
            type="number"
            style={formInputStyle}
            placeholder="Days before end of the contract"
          />
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
      </div>
    </div>
  );
}
