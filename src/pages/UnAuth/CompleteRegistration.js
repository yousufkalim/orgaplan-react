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

  const [expired, setExpired] = useState(true);
  const [admin, setAdmin] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      setExpired(true);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
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
      setAdmin(result.data);
      setCompany(result.data.company.name);
      setEmail(result.data.email);
      setPhone(`0${result.data.phone}`);
      setFirstName(result.data.firstName);
      setLastName(result.data.lastName);
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
    if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "phone") setPhone(value);
    else if (name === "password") setPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const formdata = JSON.stringify({
        phone,
        firstName,
        lastName,
        password,
        adminId: admin._id,
        companyId: admin.company._id,
        verifyToken,
      });

      const data = await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.ADMIN_REGISTRATION,
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
          <Heading primary={"Complete your registration"} />
          <div className={classes.content}>
            <Form.Form onSubmit={onSubmit}>
              <Form.Row>
                <FormLabel bold primary="COMPANY*: " />
                <FormInput
                  disabled
                  type="text"
                  name="company"
                  value={company}
                  // error={company}
                  style={GLOBALS.Styles.inputWidth}
                  placeholder={GLOBALS.I18n.t("companyPlaceholder")}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </Form.Row>
              <Form.Row>
                <FormLabel bold primary="Contact*: " />
                <Form.Row noMargin width="48%">
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
                  <FormInput
                    type="number"
                    name="phone"
                    value={phone}
                    // error={phone}
                    style={GLOBALS.Styles.inputWidth}
                    placeholder={GLOBALS.I18n.t("phonePlaceholder")}
                    onChange={({ target: { name, value } }) =>
                      handleChange(name, value)
                    }
                  />
                </Form.Row>
              </Form.Row>
              <Form.Row>
                <FormLabel bold primary="Identity*: " />
                <Form.Row noMargin width="48%">
                  <FormInput
                    type="text"
                    name="firstName"
                    value={firstName}
                    // error={firstName}
                    style={GLOBALS.Styles.inputWidth}
                    placeholder={GLOBALS.I18n.t("firstNamePlaceholder")}
                    onChange={({ target: { name, value } }) =>
                      handleChange(name, value)
                    }
                  />
                  <FormInput
                    type="text"
                    name="lastName"
                    value={lastName}
                    // error={lastName}
                    style={GLOBALS.Styles.inputWidth}
                    placeholder={GLOBALS.I18n.t("lastNamePlaceholder")}
                    onChange={({ target: { name, value } }) =>
                      handleChange(name, value)
                    }
                  />
                </Form.Row>
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
                    loading ||
                    !firstName ||
                    !lastName ||
                    !phone ||
                    phone.length !== 10 ||
                    !password ||
                    confirmPassword !== password
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
