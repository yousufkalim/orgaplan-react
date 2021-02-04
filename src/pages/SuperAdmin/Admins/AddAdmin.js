import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

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

const formInputStyle = {
  width: "48%",
};

export default function Profile(props) {
  const classes = useStyles();
  const [color, setColor] = useState("");
  const [logoArray, setLogoArray] = useState([]);

  const onSubmit = () => {
    console.log("onSubmit", {});
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD AN ADMIN" />
      <div className={classes.content}>
        <Form.Form>
          <Form.Row>
            <FormLabel bold primary="CONTACT INFO: " />
            <Form.Row noMargin width="48%">
              <FormInput placeholder="E-mail Address" style={formInputStyle} />
              <FormInput placeholder="Phone" style={formInputStyle} />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="IDENTITY: " />
            <Form.Row noMargin width="48%">
              <FormInput placeholder="First Name" style={formInputStyle} />
              <FormInput placeholder="Last Name" style={formInputStyle} />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="PROFILE*: " />
            <FormMultipleUpload
              style={formInputStyle}
              values={logoArray}
              onChange={(values) => {
                setLogoArray(values);
              }}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="COMPANY*: " />
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
