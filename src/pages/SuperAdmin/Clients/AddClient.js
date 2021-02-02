import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Form from "../../../components/Form";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";

import { ReactComponent as Plus } from "../../../assets/icons/Plus.svg";
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
        <Form.Row>
          <FormLabel bold primary="COMPANY LOGO* :" />
          <FormInput placeholder="Company logo" style={formInputStyle} />
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
          <RadioGroup
            name="typeOfContract"
            value={typeOfContract}
            style={formInputStyle}
            onChange={(event) => setTypeOfContract(event.target.value)}
          >
            <Form.Row>
              <FormControlLabel
                value="perSite"
                label="Per Site"
                control={<Radio />}
                style={formInputStyle}
              />
              <FormControlLabel
                value="master"
                control={<Radio />}
                label="Master Contract"
                style={formInputStyle}
              />
            </Form.Row>
          </RadioGroup>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="CONTRACT DATE* : " />
          <FormInput placeholder="Company name" style={formInputStyle} />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="FUNCTIONALITY SUBSCRIBED : " />
          <FormInput placeholder="Company name" style={formInputStyle} />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="ADDITIONNAL INFORMATION :" />
          <FormInput placeholder="Company name" style={formInputStyle} />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="NOTIFICATION : " />
          <FormInput placeholder="Company name" style={formInputStyle} />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="NOTIFY THE ADDRESSES : " />
          <FormInput placeholder="Company name" style={formInputStyle} />
        </Form.Row>
      </div>
    </div>
  );
}
