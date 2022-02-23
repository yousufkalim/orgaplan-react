import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import IconButton from "@material-ui/core/IconButton";
import { TEXTS } from "../../../assets/languages/french";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Actions from "../../../redux/actions";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import TextField from "@material-ui/core/TextField";
import PhoneBox from "../../../components/PhoneBox";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import ColorPicker from "../../../components/ColorPcker";
import RadioButton from "../../../components/RadioButton";
import FormMultiSelect from "../../../components/FormMultiSelect";
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
    color: "red",
  },
  autoComplete: {
    "& .MuiFormControl-marginNormal": {
      marginTop: "0 !important",
      marginBottom: "0 !important",
    },
    "& .MuiOutlinedInput-root ": {
      borderRadius: "0 !important",
    },
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
      padding: "4px !important",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #707070 !important",
    },
    "& .MuiFormLabel-root": {
      marginTop: -5,
    },
  },
}));

export default function AddCompanies(props) {
  const {
    NAME,
    VALIDATE,
    AVAILABILITY,
    Enter_site_addresses,
    END_DATE,
    DELIVERYAREAS,
    COMPANIES,
    is_Full,
    Vehicles,
    Days_before_end_of_the_contract,
    NOTIFY_THE_ADDRESSES,
    Please_enter_email,
    MEANS,
    NOTIFICATION,
    IDENTITY,
    ACCESSIBILITY,
    AVAILABILITIES,
    UNAVAILABILITIES,
    HOURLY_RATE,
    ADDITIONNAL_INFORMATION,
    Add_COMPANY,
    TYPE_OF_COMPANY,
    General_Contractor,
    SUBCONTRACTOR,
    TRADES,
    FIRST_NAME,
    IDENTITY_OF_RESPONSIBLE,
    LAST_NAME,
    Please_select_a_company,
    something_went_wrong,
    Company_already_Exists_With_this_name,
    Please_enter_name,
    Please_provide_image,
    Please_enter_valid_email,
    Please_enter_valid_URL,
    WEBSITE,
  } = TEXTS;

  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [color, setColor] = useState("#d71313");
  const [image, setImage] = useState([]);
  const [companyType, setCompanyType] = useState("generalcontractor");
  const [parentCompanyId, setParentCompanyId] = useState("");
  const [trades, setTrades] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [website, setWebsite] = useState("");
  const [addInfo, setAddInfo] = useState("");

  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [ParentCompanyError, setParentCompanyError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [websiteError, setWebsiteError] = useState("");

  // Dropdowns
  const [allTrades, setAllTrades] = useState([]);

  // All Data
  const [allSiteCompanies, setAllSiteCompanies] = useState([]);

  const [nonSiteCompanies, setNonSiteCompanies] = useState([]);
  const [allNonSiteCompanies, setAllNonSiteCompanies] = useState([]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  async function getData() {
    try {
      const getAllCompaniesResponse = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_SITE_COMPANY}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_COMPANY_EXCLUDE_SITE}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const siteCo = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_SITE_COMPANY}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      setCompanies(getAllCompaniesResponse.data);
      setNonSiteCompanies(response.data);
      setAllNonSiteCompanies(
        response.data.map((item) => ({
          label: item.name,
          value: item._id,
        })),
      );
      setAllSiteCompanies(
        siteCo.data.map((item) => ({
          label: item.companyId.name,
          value: item.companyId._id,
        })),
      );
      setAllTrades(
        adminStore.site.siteId.trades.map((trade) => ({
          label: trade,
          value: trade,
        })),
      );
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }
  async function onSubmit() {
    try {
      if (
        nameError ||
        imageError ||
        emailError ||
        websiteError ||
        !companyType
      ) {
        alert(something_went_wrong);
      } else {
        let checkCompanyExists = companies.filter(
          (company) => company.companyId.name === name,
        );
        if (checkCompanyExists.length > 0) {
          return dispatch(
            Actions.notistack.enqueueSnackbar(
              Actions.notistack.snackbar(
                Company_already_Exists_With_this_name,
                "error",
              ),
            ),
          );
        }
        setLoading(true);
        const incharge = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: "+" + phone,
        };
        var formdata = new FormData();
        image[0].file && formdata.append("logo", image[0].file);
        formdata.append("name", name);
        formdata.append("color", color);
        formdata.append("website", website);
        formdata.append("description", addInfo);
        formdata.append("adminIds", store.user._id);
        formdata.append("trades", JSON.stringify(trades));
        formdata.append("siteId", adminStore.site.siteId._id);
        formdata.append("incharge", JSON.stringify(incharge));
        companyId && formdata.append("companyId", companyId);
        companyType === "subcontractor" &&
          parentCompanyId &&
          formdata.append("parentCompanyId", parentCompanyId);
        // for (let [key, value] of formdata) {
        //   console.log(`formdatais ${key}: ${value}`);
        // }
        // console.log("company type", formdata.get("parentCompanyId"));

        const response = await GLOBALS.API({
          method: "POST",
          uri: GLOBALS.Constants.ADMIN_COMPANY,
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
          body: formdata,
        });
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar(response.message, "success"),
          ),
        );
        setLoading(false);
        props.history.goBack();
      }
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function inputChange(name, value) {
    if (name === "name") {
      setName(value);
    } else if (name === "color") setColor(value);
    else if (name === "companyType") {
      setCompanyType(value);
    } else if (name === "parentCompanyId") {
      setParentCompanyId(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "phone") {
      setPhone(value);
    } else if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "image") {
      setImage(value);
      setUpdate((st) => !st);
    } else if (name === "trades") {
      setTrades(value);
    } else if (name === "addInfo") {
      setAddInfo(value);
    } else if (name === "website") {
      setWebsite(value);
    }

    validation(name, value);
  }

  const validation = (name, value) => {
    if (name == "name") {
      if (!value) {
        setNameError(Please_enter_name);
      } else {
        setNameError("");
      }
    } else if (name == "image") {
      if (!value.length > 0) {
        setImageError(Please_provide_image);
      } else {
        setImageError("");
      }
    } else if (name == "parentCompanyId") {
      if (!value) {
        setParentCompanyError(Please_select_a_company);
      } else {
        setParentCompanyError("");
      }
    } else if (name == "email") {
      const emailValidation = /\S+@\S+\.\S+/;
      if (!value.match(emailValidation) && value !== "") {
        setEmailError(Please_enter_valid_email);
      } else {
        setEmailError("");
      }
    } else if (name == "website") {
      const websiteValidation =
        /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
      if (!value.match(websiteValidation) && value !== "") {
        setWebsiteError(Please_enter_valid_URL);
      } else {
        setWebsiteError("");
      }
    }
  };

  function handlePhone(evt) {
    if (evt.currentTarget.value.length < 26) {
      const value = evt.currentTarget.validity.valid
        ? evt.currentTarget.value
        : phone;
      setPhone(value);
    }
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      {update && ""}
      <Heading primary={Add_COMPANY} />
      <div className={classes.content}>
        <Form.Form>
          <Form.Row>
            <FormLabel bold primary={`${IDENTITY} :`} />
            <Form.Row width="48%" noMargin>
              <Form.Column noMargin style={GLOBALS.Styles.inputWidth}>
                <Autocomplete
                  freeSolo
                  fullWidth
                  inputValue={name}
                  // disabled={!fieldsEnabled}
                  options={allNonSiteCompanies}
                  className={classes.autoComplete}
                  getOptionLabel={(option) => option.label}
                  onChange={(e, option) => {
                    if (option) {
                      let comp = nonSiteCompanies.find(
                        (com) => com._id === option.value,
                      );
                      if (comp) {
                        setCompanyId(option.value);
                        if (comp.incharge) {
                          setEmail(comp.incharge.email);
                          setPhone(comp.incharge.phone);
                          setFirstName(comp.incharge.firstName);
                          setLastName(comp.incharge.lastName);
                        }
                        comp.logo &&
                          setImage([{ key: image.length, uri: comp.logo }]);
                      }
                    }
                  }}
                  onInputChange={(e, value) => {
                    if (companyId) {
                      setEmail("");
                      setPhone("");
                      setFirstName("");
                      setLastName("");
                      setImage([]);
                    }
                    inputChange("name", value);
                    setCompanyId("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="name"
                      label={NAME}
                      variant="outlined"
                      onBlur={({ target: { name, value } }) =>
                        validation(name, value)
                      }
                      error={nameError}
                    />
                  )}
                />
                <div
                  style={{
                    position: "relative",
                    height: "5px",
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  {nameError}
                </div>
              </Form.Column>
              <div style={GLOBALS.Styles.inputWidth}>
                <ColorPicker
                  color={color}
                  handleChange={(color) => inputChange("color", color.hex)}
                />
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="IMAGE* :" />
            <FormMultipleUpload
              name="image"
              values={image}
              // enabled={companyId}
              style={GLOBALS.Styles.inputWidth}
              onChange={(values) => inputChange("image", values)}
              error={imageError}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${TYPE_OF_COMPANY}* :`} />
            <Form.Row width="48%" noMargin>
              <Form.Column noMargin>
                <RadioButton
                  name="companyType"
                  value={companyType}
                  onChange={({ target: { name, value } }) =>
                    inputChange(name, value)
                  }
                  items={[
                    {
                      value: "generalcontractor",
                      label: General_Contractor,
                    },
                    { value: "subcontractor", label: SUBCONTRACTOR },
                  ]}
                />
              </Form.Column>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${General_Contractor}* :`} />
            <Form.Row noMargin width="48%">
              <Form.Column noMargin style={GLOBALS.Styles.inputWidth}>
                <FormSelect
                  name="parentCompanyId"
                  value={parentCompanyId}
                  values={allSiteCompanies}
                  placeholder={Please_select_a_company}
                  disabled={companyType === "generalcontractor"}
                  onChange={({ target: { name, value } }) => {
                    inputChange(name, value);
                  }}
                  error={
                    companyType === "generalcontractor"
                      ? null
                      : ParentCompanyError
                  }
                />
              </Form.Column>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${TRADES} :`} />
            <Form.Row noMargin width="48%">
              <FormMultiSelect
                name="trades"
                value={trades}
                values={allTrades}
                placeholder={TRADES}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  inputChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${IDENTITY_OF_RESPONSIBLE} :`} />
            <Form.Row width="48%" noMargin>
              <Form.Column noMargin style={GLOBALS.Styles.inputWidth}>
                <FormInput
                  name="email"
                  value={email}
                  type="email"
                  disabled={companyId}
                  placeholder={Please_enter_email}
                  onChange={({ target: { name, value } }) =>
                    inputChange(name, value)
                  }
                  onBlur={({ target: { name, value } }) =>
                    validation(name, value)
                  }
                  error={emailError}
                />
              </Form.Column>
              <Form.Column noMargin style={GLOBALS.Styles.inputWidth}>
                <PhoneBox
                  name="phone"
                  type="text"
                  maxLength="25"
                  value={phone}
                  disabled={companyId}
                  placeholder="Téléphone"
                  onInput={(value) => handlePhone(value)}
                />
              </Form.Column>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel />
            <Form.Row width="48%" noMargin>
              <FormInput
                maxLength="30"
                name="firstName"
                value={firstName}
                disabled={companyId}
                placeholder={FIRST_NAME}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  inputChange(name, value)
                }
              />
              <FormInput
                name="lastName"
                value={lastName}
                disabled={companyId}
                placeholder={LAST_NAME}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  inputChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${WEBSITE} :`} />
            <Form.Row width="48%" noMargin>
              <Form.Column noMargin style={GLOBALS.Styles.inputWidth}>
                <FormInput
                  name="website"
                  value={website}
                  placeholder="http://"
                  onChange={({ target: { name, value } }) =>
                    inputChange(name, value)
                  }
                  onBlur={({ target: { name, value } }) =>
                    validation(name, value)
                  }
                  error={websiteError}
                />
              </Form.Column>
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary={`${ADDITIONNAL_INFORMATION} :`} />
            <Form.Row width="48%" noMargin>
              <FormInput
                textArea
                rows={3}
                name="addInfo"
                maxLength="300"
                value={addInfo}
                placeholder="Informations complémentaires"
                onChange={({ target: { name, value } }) =>
                  inputChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              minWidth={200}
              text={VALIDATE}
              fullWidth={false}
              loading={loading}
              onClick={onSubmit}
              disabled={
                loading ||
                !name ||
                !color ||
                image.length === 0 ||
                (companyType !== "generalcontractor" && !parentCompanyId)
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
