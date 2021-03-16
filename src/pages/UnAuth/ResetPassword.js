import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import GLOBALS from "../../globals";
import Actions from "../../redux/actions";

import Form from "../../components/Form";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import Heading from "../../components/Heading";
import FormInput from "../../components/FormInput";
import FormLabel from "../../components/FormLabel";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

export default function Login(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [user, setUser] = useState("");
  const [expired, setExpired] = useState(true);
  const [loading, setLoading] = useState(true);
  const [verifyToken, setVerifyToken] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    validateToken();
    // eslint-disable-next-line
  }, []);

  async function validateToken() {
    try {
      const {
        location: { search },
      } = props;
      const query = new URLSearchParams(search);
      const uid = query.get("uid");
      const verifyToken = query.get("verifyToken");

      setVerifyToken(verifyToken);

      await GLOBALS.API({
        uri: `${GLOBALS.Constants.VALIDATE_TOKEN}/${uid}/${verifyToken}`,
      });
      setExpired(false);
      fetchData();
    } catch (err) {
      setLoading(false);
      setExpired(true);
    }
  }

  async function fetchData() {
    try {
      const {
        location: { search },
      } = props;
      const query = new URLSearchParams(search);
      const uid = query.get("uid");

      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_GET}/${uid}`,
      });
      setUser(result.data);
      setEmail(result.data.email);
      setExpired(false);
      setLoading(false);
    } catch (err) {
      setExpired(true);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const handleChange = (name, value) => {
    if (name === "password") setPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const formdata = JSON.stringify({
        userId: user._id,
        verifyToken,
        password,
      });

      const data = await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.RESET_PASSWORD,
        body: formdata,
      });
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(data.message, "success"),
        ),
      );
      props.history.replace("/login");
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
      {loading ? (
        <Loader.Progress />
      ) : expired ? (
        <Heading primary={"Invalid or expired verification token"} />
      ) : (
        <>
          <Heading primary={"Reset your password"} />
          <div className={classes.content}>
            <Form.Form onSubmit={onSubmit}>
              <Form.Row>
                <FormLabel bold primary="Email*: " />
                <FormInput
                  disabled
                  type="email"
                  name="email"
                  value={email}
                  // error={email}
                  style={GLOBALS.Styles.inputWidth}
                  placeholder={GLOBALS.I18n.t("emailPlaceholder")}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </Form.Row>
              <Form.Row>
                <FormLabel bold primary="Password*: " />
                <FormInput
                  type="password"
                  name="password"
                  value={password}
                  // error={password}
                  style={GLOBALS.Styles.inputWidth}
                  placeholder={GLOBALS.I18n.t("passwordPlaceholder")}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </Form.Row>
              <Form.Row>
                <FormLabel bold primary="Confirm Password*: " />
                <FormInput
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  // error={confirmPassword}
                  style={GLOBALS.Styles.inputWidth}
                  placeholder={GLOBALS.I18n.t("confirmPasswordPlaceholder")}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </Form.Row>
              <Form.ButtonContainer>
                <Button
                  type="submit"
                  minWidth={200}
                  text="VALIDATE"
                  fullWidth={false}
                  loading={loading}
                  disabled={
                    loading || !password || confirmPassword !== password
                  }
                />
              </Form.ButtonContainer>
            </Form.Form>
          </div>
        </>
      )}
    </div>
  );
}
