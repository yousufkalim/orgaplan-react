import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Actions from "../../../redux/actions";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import PhoneBox from "../../../components/PhoneBox";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import ColorPicker from "../../../components/ColorPcker";
import RadioButton from "../../../components/RadioButton";
import FormMultiSelect from "../../../components/FormMultiSelect";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";
import { TEXTS } from "../../../assets/languages/french";

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
    EDIT_COMPANY,
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

  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [ParentCompanyError, setParentCompanyError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [websiteError, setWebsiteError] = useState("");

  // Dropdowns
  const [allTrades, setAllTrades] = useState([]);

  // All Data
  const [allSiteCompanies, setAllSiteCompanies] = useState([]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  async function getData() {
    try {
      const siteCo = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_SITE_COMPANY}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
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
      let company = siteCo.data.find(
        (item) => item.companyId._id === props.match.params.id,
      );
      setName(company.companyId.name);
      setColor(company.color);
      setTrades(company.trades);
      company.companyId.incharge.firstName &&
        setFirstName(company.companyId.incharge.firstName);
      company.companyId.incharge.lastName &&
        setLastName(company.companyId.incharge.lastName);
      company.companyId.incharge.email &&
        setEmail(company.companyId.incharge.email);
      company.companyId.incharge.phone &&
        setPhone(company.companyId.incharge.phone.substring(1));
      company.companyId.website && setPhone(company.companyId.website);
      company.companyId.description &&
        setAddInfo(company.companyId.description);
      company.companyId.logo &&
        setImage([{ key: 0, uri: company.companyId.logo }]);

      company.parentCompanyId && setCompanyType("subcontractor");
      company.parentCompanyId &&
        setParentCompanyId(company.parentCompanyId._id);
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
        alert("something went wrong");
      } else {
        setLoading(true);

        var formdata = {
          email: email,
          description: addInfo,
          siteId: adminStore.site.siteId._id,
          parentCompanyId:
            companyType === "generalcontractor" ? undefined : parentCompanyId,
        };

        const response = await GLOBALS.API({
          method: "PUT",
          token: store.token,
          body: JSON.stringify(formdata),
          uri: `${GLOBALS.Constants.ADMIN_COMPANY}/${props.match.params.id}`,
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
      <Heading primary={EDIT_COMPANY} />

      <div className={classes.content}>
        <Form.Form>
          <Form.Row>
            <FormLabel bold primary={`${IDENTITY} :`} />
            <Form.Row width="48%" noMargin>
              <Form.Column noMargin style={GLOBALS.Styles.inputWidth}>
                <FormInput
                  name="name"
                  value={name}
                  disabled={true}
                  placeholder={NAME}
                  onChange={({ target: { name, value } }) =>
                    inputChange(name, value)
                  }
                  onBlur={({ target: { name, value } }) =>
                    validation(name, value)
                  }
                  error={nameError}
                />
              </Form.Column>
              <div style={GLOBALS.Styles.inputWidth}>
                <ColorPicker
                  color={color}
                  disabled={true}
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
              disabled={true}
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
                  placeholder={Please_select_a_company}
                  values={allSiteCompanies.filter(
                    (item) => item.value !== props.match.params.id,
                  )}
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
                disabled={true}
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
                  value={phone}
                  disabled={true}
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
                disabled={true}
                name="firstName"
                value={firstName}
                placeholder={FIRST_NAME}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  inputChange(name, value)
                }
              />
              <FormInput
                name="lastName"
                disabled={true}
                value={lastName}
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
                  disabled={true}
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
            <FormLabel bold primary={`${ADDITIONNAL_INFORMATION}:`} />
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
                (companyType !== "generalcontractor" && !parentCompanyId)
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
