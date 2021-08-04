import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import PhoneBox from "../../../components/PhoneBox";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import RadioButton from "../../../components/RadioButton";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";
import { TEXTS } from "../../../assets/languages/french";

// Field to auto add email and text field to hold it
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
  error: {
    color: "red",
  },
}));

export default function AddAdmin(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    ADD_AN_ADMIN,
    CONTACT_INFO,
    TELEPHONE,
    FIRST_NAME,
    LAST_NAME,
    SELECT_COMPANY,
    VALIDATE,
    IDENTITY,
    PROFILE,
    COMPANIES,
    Please_enter_email,
    TYPE_OF_ADMIN,
    FIRST_NAME_REQUIRED,
    Telephone_must_have_10_to_25_digits,
    LAST_NAME_REQUIRED,
    Please_enter_company_name,
    Please_enter_type_of_organigramme,
    Please_enter_valid_email,
    please_add_profile_image,
    Please_select_a_company,
    Per_site,
  } = TEXTS;
  const store = useSelector((state) => state.auth);

  const [company, setCompany] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState([]);
  const [imageURI, setImageURI] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [adminType, setAdminType] = useState("ADMINPERSITE");

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [companyIdError, setCompanyIdError] = useState("");

  // States to get user data and disable fields
  const [users, setUsers] = useState([]);
  const [disableUser, setDisableUser] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.COMPANY}`,
      });

      const itemsArray = result.data.items.map((item) => ({
        value: item._id,
        label: item.name,
      }));

      setAllCompanies(result.data.items);
      setCompanies(itemsArray);
      setLoading(false);

      // Getting users from API
      const userResponse = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ALL_USERS}`,
        token: store.token,
      });
      setUsers(userResponse.data);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }
  async function onSubmit(e) {
    try {
      e.preventDefault();
      setLoading(true);
      var formdata = new FormData();
      formdata.append("email", email);
      formdata.append("phone", "+" + phone);
      formdata.append("lastName", lastName);
      formdata.append("firstName", firstName);
      formdata.append("adminType", adminType);
      formdata.append("companyId", companyId);
      formdata.append("image", image[0]?.file || imageURI);

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.ADMINS,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      setLoading(false);
      props.history.push("/admins");
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function handleChange(name, value) {
    if (name === "email") setEmail(value);
    else if (name === "phone") setPhone(value);
    else if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "adminType") setAdminType(value);
    else if (name === "image") setImage(value);
    else if (name === "companyId") {
      setCompanyId(value);
      value
        ? setCompany(allCompanies.find((item) => item._id === value))
        : setCompany("");
    }
    setUpdate((st) => !st);
    validation(name, value);
  }

  function validation(name, value) {
    if (name === "email") {
      if (GLOBALS.Functions.email(value))
        setEmailError(Please_enter_valid_email);
      else setEmailError("");
    } else if (name === "phone") {
      if (GLOBALS.Functions.phone(value))
        setPhoneError(Telephone_must_have_10_to_25_digits);
      else setPhoneError("");
    } else if (name === "firstName") {
      if (GLOBALS.Functions.empty(value))
        setFirstNameError(FIRST_NAME_REQUIRED);
      else setFirstNameError("");
    } else if (name === "lastName") {
      if (GLOBALS.Functions.empty(value)) setLastNameError(LAST_NAME_REQUIRED);
      else setLastNameError("");
    } else if (name === "image") {
      if (GLOBALS.Functions.empty(value.length)) {
        setImageError(please_add_profile_image);
      } else {
        setImageError("");
      }
    } else if (name === "companyId") {
      if (GLOBALS.Functions.empty(value))
        setCompanyIdError(Please_select_a_company);
      else setCompanyIdError("");
    }
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary={ADD_AN_ADMIN} />
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary={`${CONTACT_INFO}*: `} />
            <Form.Row noMargin width="48%">
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                style={{
                  ...GLOBALS.Styles.inputWidth,
                  marginRight: "10px",
                  marginTop: "-17px",
                }}
                onSelect={(event) => {
                  users.forEach((item, index) => {
                    if (item.email === event.target.value) {
                      setDisableUser(true);
                      setEmail(item.email);
                      setPhone(parseInt(item.phone));
                      setFirstName(item.firstName);
                      setLastName(item.lastName);
                      setImageURI(item.image);
                      setImage([{ uri: item.image }]);
                    } else {
                      setDisableUser(false);
                    }
                  });
                }}
                options={users.map(
                  (option) => option.email !== undefined && option.email,
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Email"
                    margin="normal"
                    variant="outlined"
                    name="email"
                    value={email}
                    onBlur={({ target: { name, value } }) =>
                      validation(name, value)
                    }
                    error={emailError}
                    onChange={(e) => {
                      users.forEach((item, index) => {
                        if (item.email !== e.target.value) {
                          setEmail(e.target.value);
                          setFirstName("");
                          setLastName("");
                          setPhone("");
                          setImage([]);
                          setDisableUser(true);
                        }
                        validation("email", e.target.value);
                      });
                    }}
                  />
                )}
              />
              <PhoneBox
                name="phone"
                type="number"
                value={phone}
                error={phoneError}
                placeholder={TELEPHONE}
                style={GLOBALS.Styles.inputWidth}
                disabled={disableUser}
                onBlur={({ target: { name, value } }) =>
                  value.length < 26 ? validation(name, value) : ""
                }
                onChange={({ target: { name, value } }) => {
                  if (value.length < 26) {
                    handleChange(name, value);
                  }
                }}
              />
            </Form.Row>
          </Form.Row>
          {update && ""}
          <Form.Row>
            <FormLabel bold primary={IDENTITY} />
            <Form.Row noMargin width="48%">
              <FormInput
                name="firstName"
                value={firstName}
                error={firstNameError}
                placeholder={FIRST_NAME}
                style={GLOBALS.Styles.inputWidth}
                disabled={disableUser}
                onBlur={({ target: { name, value } }) =>
                  validation(name, value)
                }
                onChange={({ target: { name, value } }) => {
                  handleChange(name, value);
                }}
              />
              <FormInput
                name="lastName"
                value={lastName}
                error={lastNameError}
                placeholder={LAST_NAME}
                style={GLOBALS.Styles.inputWidth}
                disabled={disableUser}
                onBlur={({ target: { name, value } }) =>
                  validation(name, value)
                }
                onChange={({ target: { name, value } }) => {
                  handleChange(name, value);
                }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${PROFILE} *:`} />
            <FormMultipleUpload
              name="image"
              values={image}
              style={GLOBALS.Styles.inputWidth}
              disabled={disableUser}
              error={imageError}
              onChange={(values) => handleChange("image", values)}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${COMPANIES}*: `} />
            <FormSelect
              name="companyId"
              value={companyId}
              values={companies}
              placeholder={SELECT_COMPANY}
              error={companyIdError}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          {company.type === "MASTERCLIENT" && (
            <Form.Row>
              <FormLabel bold primary={`${TYPE_OF_ADMIN}* : `} />
              <RadioButton
                name="adminType"
                value={adminType}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                items={[
                  { value: "ADMINPERSITE", label: `Admin ${Per_site}` },
                  { value: "MASTERADMIN", label: "Master Admin" },
                ]}
              />
            </Form.Row>
          )}
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text={VALIDATE}
              fullWidth={false}
              loading={loading}
              disabled={
                loading ||
                emailError ||
                !email ||
                phoneError ||
                !phone ||
                firstNameError ||
                !firstName ||
                lastNameError ||
                !lastName ||
                !companyId
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
