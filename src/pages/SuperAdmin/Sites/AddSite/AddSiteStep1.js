import React, { useState } from "react";
import { useTheme } from "@material-ui/core/styles";

import Form from "../../../../components/Form";
import Button from "../../../../components/Button";
import SmallText from "../../../../components/SmallText";
import FormInput from "../../../../components/FormInput";
import FormLabel from "../../../../components/FormLabel";
import FormSelect from "../../../../components/FormSelect";
import RadioButton from "../../../../components/RadioButton";
import MultiAdderInput from "../../../../components/MultiAdderInput";
import FormMultipleUpload from "../../../../components/FormMultipleUpload";

const formInputStyle = {
  width: "48%",
};

export default function Profile(props) {
  const theme = useTheme();
  const [typeOfContract] = useState("CLIENTPERSITE");
  const [functionalitySubscribed, setFunctionalitySubscribed] = useState(
    "DELIVERY",
  );
  const [emailAddress, setEmailAddress] = useState([
    { key: 0, label: "site 1" },
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
    props.setStep(2);
  };

  return (
    <Form.Form>
      <Form.Row>
        <FormLabel bold primary="SITE NAME* :" />
        <FormInput placeholder="Site name" style={formInputStyle} />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="SITE PICTURE : " />
        <FormMultipleUpload
          style={formInputStyle}
          values={logoArray}
          onChange={(values) => {
            setLogoArray(values);
          }}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="ZAC OF THE SITE : " />
        <Form.Row width="48%" noMargin>
          <FormSelect
            value={color}
            placeholder="Name of the ZAC"
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
          <FormInput
            placeholder="Client Name"
            style={{ ...formInputStyle, display: "none" }}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="SITE RESPONSIBLE* :" />
        <Form.Row width="48%" noMargin>
          <FormSelect
            value={color}
            placeholder="Admin Name"
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
          <FormInput placeholder="Client Name" style={formInputStyle} />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="AVAILABLE FUNCTIONALITY : " />
        <RadioButton
          items={[{ value: "DELIVERY", label: "Delivery module" }]}
          style={formInputStyle}
          value={functionalitySubscribed}
          onChange={(event) => setFunctionalitySubscribed(event.target.value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="SITE ADDRESS(ES)* : " />
        <MultiAdderInput
          values={emailAddress}
          style={formInputStyle}
          placeholder="Enter site address"
          onChange={(values) => setEmailAddress(values)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="TRADES : " />
        <Form.Row width="48%" noMargin>
          <Button
            fullWidth={false}
            text="SEE/EDIT TRADES"
            color={theme.palette.blue}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="COST OF DELIVERY PENALITIES: " />
        <Form.Row width="48%" noMargin>
          <Form.Row width="48%" noMargin>
            <FormInput type="number" placeholder="Delay" />
            <SmallText style={{ marginLeft: 10 }} primary="€" />
          </Form.Row>
          <Form.Row width="48%" noMargin>
            <FormInput type="number" placeholder="Unexp delivery" />
            <SmallText style={{ marginLeft: 10 }} primary="€" />
          </Form.Row>
        </Form.Row>
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
