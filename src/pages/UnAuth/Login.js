import React from "react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import LockIcon from "@material-ui/icons/Lock";
import PersonIcon from "@material-ui/icons/Person";

import GLOBALS from "../../globals";
import Form from "../../components/Form";
import Actions from "../../redux/actions";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import SmallText from "../../components/SmallText";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
}));

const loginYup = Yup.object().shape({
  email: Yup.string()
    .email(GLOBALS.I18n.t("emailInvalid"))
    .required(GLOBALS.I18n.t("required")),
  password: Yup.string()
    .min(1, GLOBALS.I18n.t("passwordInvalid"))
    .required(GLOBALS.I18n.t("required")),
});

export default function Login(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const onSubmit = (values) => {
    dispatch(Actions.auth.do_login(values.email, values.password));
  };

  return (
    <div className={classes.root}>
      <Heading primary={GLOBALS.I18n.t("loginHeaderPrimary")} />
      <Formik
        initialValues={{ email: "yousaf.falcon321@gmail.com", password: "1" }}
        validationSchema={loginYup}
        onSubmit={onSubmit}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <Form.Form onSubmit={handleSubmit} maxWidth="350px">
            <Form.Item>
              <Input
                type="email"
                name="email"
                onBlur={handleBlur}
                value={values.email}
                error={errors.email}
                onChange={handleChange}
                startAdornment={<PersonIcon />}
                placeholder={GLOBALS.I18n.t("emailPlaceholder")}
              />
            </Form.Item>
            <Form.Item>
              <Input
                type="password"
                name="password"
                onBlur={handleBlur}
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                startAdornment={<LockIcon />}
                placeholder={GLOBALS.I18n.t("passwordPlaceholder")}
              />
            </Form.Item>
            <Form.ButtonContainer>
              <Button
                type="submit"
                loading={store.loading}
                disabled={store.loading}
                text={GLOBALS.I18n.t("login")}
              />
            </Form.ButtonContainer>
            <Form.Row>
              <SmallText
                primary={GLOBALS.I18n.t("forgotPassword")}
                to="/password-forgot"
              />
              <SmallText
                primary={GLOBALS.I18n.t("dontHaveAccount")}
                to="/register"
              />
            </Form.Row>
          </Form.Form>
        )}
      </Formik>
    </div>
  );
}
