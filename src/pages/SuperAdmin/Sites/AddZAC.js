import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import { TEXTS } from "../../../assets/languages/french";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

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

export default function AddZac(props) {
  const { ADD_ZAC, VALIDATE, ZAC_NAME } = TEXTS;
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  const handleChange = (name, value) => {
    if (name === "name") setName(value);
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const formdata = JSON.stringify({
        name: name,
      });

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.ZACS,
        token: store.token,
        body: formdata,
      });
      setLoading(false);
      props.history.goBack();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary={ADD_ZAC} />
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary={`${ZAC_NAME}* : `} />
            <FormInput
              name="name"
              value={name}
              // error={name}
              placeholder={ZAC_NAME}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text={VALIDATE}
              fullWidth={false}
              loading={loading}
              disabled={loading || !name}
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
