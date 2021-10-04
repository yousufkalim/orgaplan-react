import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";
import { TEXTS } from "../../../assets/languages/french";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import PhoneBox from "../../../components/PhoneBox";
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
  error: {
    color: "#FF0000",
  },
}));

export default function AddContact(props) {
  const {
    ADD_A_CONTACT,
    TYPE_OF_ORGANIGRAMME,
    CONTACT_INFO,
    Please_enter_email,
    IDENTITY,
    FIRST_NAME,
    LAST_NAME,
    VALIDATE,
    TYPE,
    FIRST_NAME_REQUIRED,
    Telephone_must_have_10_to_25_digits,
    LAST_NAME_REQUIRED,
    Please_enter_company_name,
    Please_enter_type_of_organigramme,
    Please_enter_valid_email,
  } = TEXTS;
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [loading, setLoading] = useState(false);
  const [dropdownType, setDropdownType] = useState([]);
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const [typeError, setTypeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [companyError, setCompanyError] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      // const result = await GLOBALS.API({
      //   uri: `${GLOBALS.Constants.COMPANY}`,
      // });

      const typeArray = [
        { value: "LOGISTICS", label: "LOGISTICS" },
        { value: "SITE", label: "SITE" },
      ];

      setDropdownType(typeArray);
      const typeOfContact = props.location.type;
      setType(typeOfContact);

      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const handleChange = (name, value) => {
    if (name === "email") {
      setEmail(value);
    } else if (name === "phone") {
      setPhone(value);
    } else if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    } else if (name === "company") {
      setCompany(value);
    } else if (name === "role") {
      setRole(value);
    } else if (name === "image") setImage(value);
    else if (name === "company") setCompany(value);
    else if (name === "role") setRole(value);
    else if (dropdownType !== "") {
    }
    validation(name, value);
  };

  const validation = (name, value) => {
    if (name == "email") {
      const emailValidation = /\S+@\S+\.\S+/;
      if (!value.match(emailValidation)) {
        setEmailError(Please_enter_valid_email);
      } else {
        setEmailError("");
      }
    } else if (name == "phone") {
      if (value.length < 10 || value.length > 25) {
        setPhoneError(Telephone_must_have_10_to_25_digits);
      } else {
        setPhoneError("");
      }
    } else if (name == "firstName") {
      if (!value) {
        setFirstNameError(FIRST_NAME_REQUIRED);
      } else {
        setFirstNameError("");
      }
    } else if (name == "lastName") {
      if (!value) {
        setLastNameError(LAST_NAME_REQUIRED);
      } else {
        setLastNameError("");
      }
    } else if (name == "company") {
      if (!value) {
        setCompanyError(Please_enter_company_name);
      } else {
        setCompanyError("");
      }
    } else if (name == "type") {
      if (!value) {
        setTypeError(Please_enter_type_of_organigramme);
      } else {
        setTypeError("");
      }
    }
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (
        emailError !== "" ||
        phoneError !== "" ||
        firstNameError !== "" ||
        lastNameError !== "" ||
        companyError !== ""
      ) {
        alert("something went wrong");
      } else {
        setLoading(true);
        var formdata = new FormData();
        formdata.append("email", email);
        formdata.append("phone", "+" + phone);
        formdata.append("firstName", firstName);
        formdata.append("lastName", lastName);
        if (image[0]?.file) {
          formdata.append("image", image[0].file);
        }
        formdata.append("company", company);
        formdata.append("siteId", adminStore.site.siteId._id);
        formdata.append("type", type);
        formdata.append("role", role);
        await GLOBALS.API({
          method: "POST",
          uri: GLOBALS.Constants.POST_SITE_ORGANIGRAMMES,
          headers: {
            Authorization: store.token,
          },
          body: formdata,
        });
        setLoading(false);
        props.history.push("/organigramme", { type: type });
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  function handlePhone(evt) {
    if (evt.currentTarget.value.length < 26) {
      const value = evt.currentTarget.validity.valid
        ? evt.currentTarget.value
        : phone;
      setPhone(value);
      setPhoneError("");
      if (evt.currentTarget.value.length < 9) {
        setPhoneError(Telephone_must_have_10_to_25_digits);
      }
    }
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary={ADD_A_CONTACT} />
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary={`${TYPE_OF_ORGANIGRAMME}* : `} />
            <Form.Row noMargin width="55%">
              <FormSelect
                name="type"
                value={type}
                // error={companyId}
                values={dropdownType}
                placeholder={TYPE}
                style={GLOBALS.Styles.inputWidth}
                onChange={(e) => {
                  const index = e.target.selectedIndex - 1;
                  if (index !== -1) {
                    const item = e.target.value;
                    setType(item);
                  } else {
                    setType("");
                  }
                  validation("type", e.target.value);
                }}
                error={typeError}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${CONTACT_INFO}* : `} />
            <Form.Row
              noMargin
              width="55%"
              style={{ justifyContent: "flex-start", gap: "20px" }}
            >
              <div style={{ width: "45%" }}>
                <FormInput
                  name="email"
                  value={email}
                  // error={firstName}
                  placeholder={Please_enter_email}
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                  onBlur={({ target: { name, value } }) =>
                    validation(name, value)
                  }
                  error={emailError}
                />
              </div>
              <div style={{ width: "45%" }}>
                <PhoneBox
                  name="phone"
                  value={phone}
                  error={phoneError}
                  type="text"
                  placeholder="Téléphone"
                  style={{ width: "100%" }}
                  onInput={(value) => handlePhone(value)}
                />
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${IDENTITY} : `} />
            <Form.Row
              noMargin
              width="55%"
              style={{ justifyContent: "flex-start", gap: "10px" }}
            >
              <div style={{ width: "30%" }}>
                <FormInput
                  name="firstName"
                  value={firstName}
                  placeholder={FIRST_NAME}
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                  onBlur={({ target: { name, value } }) =>
                    validation(name, value)
                  }
                  error={firstNameError}
                />
              </div>
              <div style={{ width: "30%" }}>
                <FormInput
                  name="lastName"
                  value={lastName}
                  placeholder={LAST_NAME}
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                  onBlur={({ target: { name, value } }) =>
                    validation(name, value)
                  }
                  error={lastNameError}
                />
              </div>
              <div style={{ width: "30%" }}>
                <FormMultipleUpload
                  name="profile"
                  // error={image}
                  values={image}
                  style={{ width: "100%" }}
                  onChange={(values) => handleChange("profile", values)}
                />
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="Entreprise* : " />
            <Form.Row noMargin width="55%">
              <div style={{ width: "50%" }}>
                <FormInput
                  name="company"
                  value={company}
                  placeholder="Enterprise"
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                  onBlur={({ target: { name, value } }) =>
                    validation(name, value)
                  }
                  error={companyError}
                />
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="Rôle : " />
            <Form.Row noMargin width="55%">
              <div style={{ width: "50%" }}>
                <FormInput
                  name="role"
                  value={role}
                  // error={lastName}
                  placeholder="Role"
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </div>
            </Form.Row>
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text={VALIDATE}
              fullWidth={false}
              loading={loading}
              disabled={
                loading ||
                !type ||
                !email ||
                !phone ||
                !firstName ||
                !lastName ||
                !company ||
                phoneError
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
