import React, { useState } from "react";
import { useTheme } from "@material-ui/core/styles";

import Form from "../../../../components/Form";
import Button from "../../../../components/Button";
import SmallText from "../../../../components/SmallText";
import FormInput from "../../../../components/FormInput";
import FormLabel from "../../../../components/FormLabel";
import FormSelect from "../../../../components/FormSelect";
import MultiAdderInput from "../../../../components/MultiAdderInput";

const formInputStyle = {
  width: "48%",
};

export default function Profile(props) {
  const theme = useTheme();
  const [typeOfContract] = useState("perSite");
  const [functionalitySubscribed] = useState("deliveryModule");
  const [emailAddress, setEmailAddress] = useState([
    { key: 0, label: "test@gmail.com" },
  ]);
  const [color, setColor] = useState("");

  const onSubmit = () => {
    console.log("onSubmit", {
      typeOfContract,
      functionalitySubscribed,
      emailAddress,
      color,
    });
    props.setStep(3);
  };

  return (
    <Form.Form>
      <Form.Row>
        <FormLabel bold primary="SITE DATES* : " />
        <Form.Row width="48%" noMargin>
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
        <FormLabel bold primary="OPENING TIME : " />
        <Form.Row width="48%" noMargin>
          <FormSelect
            value={color}
            placeholder="Start time"
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
          <FormSelect
            value={color}
            placeholder="End time"
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
        <FormLabel bold primary="UNAVAILABILITY TIME :" />
        <Form.Row
          width="48%"
          noMargin
          justifyContent="flex-start"
          alignItems="center"
        >
          <Button
            fullWidth={false}
            text="SEE UNAVAILABILITY"
            color={theme.palette.blue}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="ADDITIONNAL INFORMATION :" />
        <FormInput
          textArea
          rows={3}
          style={formInputStyle}
          placeholder="Additional information"
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="NOTIFICATION : " />
        <Form.Row
          noMargin
          width="48%"
          justifyContent="flex-start"
          alignItems="center"
        >
          <FormInput
            type="number"
            style={{ ...formInputStyle, maxWidth: 100 }}
          />
          <SmallText
            style={{ marginLeft: 10 }}
            primary="Days before end of the site"
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
          text="CONTINUE"
          fullWidth={false}
          onClick={onSubmit}
        />
      </Form.ButtonContainer>
    </Form.Form>
  );
}
