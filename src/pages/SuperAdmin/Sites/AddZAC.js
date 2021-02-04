import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
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

  const onSubmit = () => {
    console.log("onSubmit", {});
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD A ZAC" />
      <div className={classes.content}>
        <Form.Form>
          <Form.Row>
            <FormLabel bold primary="NAME OF ZAC: " />
            <FormInput
              value={name}
              style={formInputStyle}
              placeholder="Name of ZAC"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              minWidth={200}
              text="COMPLETE"
              fullWidth={false}
              onClick={onSubmit}
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
