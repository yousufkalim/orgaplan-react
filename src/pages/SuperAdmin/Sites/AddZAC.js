import React from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import * as Yup from "yup";

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

const addZACYup = Yup.object().shape({
  name: Yup.string().required("Required"),
});

export default function Profile(props) {
  const classes = useStyles();
  const store = useSelector((state) => state.auth);

  const onSubmit = async (values) => {
    const formdata = JSON.stringify({
      name: values.name,
    });

    await GLOBALS.API({
      method: "POST",
      uri: GLOBALS.Constants.ZACS,
      token: store.token,
      body: formdata,
    });
    formik.setSubmitting(false);
    props.history.push("/sites/zacs");
  };

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: addZACYup,
    onSubmit,
  });

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD A ZAC" />
      <div className={classes.content}>
        <Form.Form onSubmit={formik.handleSubmit}>
          <Form.Row>
            <FormLabel bold primary="NAME OF ZAC: " />
            <FormInput
              name="name"
              placeholder="Name of ZAC"
              value={formik.values.name}
              error={formik.errors.name}
              onChange={formik.handleChange}
              style={GLOBALS.Styles.inputWidth}
            />
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting}
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
