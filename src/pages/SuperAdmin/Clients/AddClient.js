import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";
import { TEXTS } from "../../../assets/languages/french";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import PhoneBox from "../../../components/PhoneBox";
import SmallText from "../../../components/SmallText";
import FormLabel from "../../../components/FormLabel";
import ColorPicker from "../../../components/ColorPcker";
import RadioButton from "../../../components/RadioButton";
import MultiAdderInput from "../../../components/MultiAdderInput";
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
}));

export default function AddClient(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    TELEPHONE,
    FIRST_NAME,
    LAST_NAME,
    START_DATE,
    END_DATE,
    FUNCTIONALITY_SUBSCRIBED,
    VALIDATE,
    NOTIFICATION,
    ADDITIONNAL_INFORMATION,
    NAME_OF_COMPANY,
    COMPANY_RESPONSIBLE,
    COMPANY_LOGO,
    ADD_A_CLIENT,
    Days_before_end_of_the_site,
    NOTIFY_THE_ADDRESSES,
    Please_enter_company_name,
    Please_Add_logo,
    Please_select_start_date,
    Please_select_end_date,
    Please_enter_valid_email,
    Please_enter_email,
    CONTACT_RESPONSIBLE,
    TYPE_OF_CONTRACT,
    Per_site,
    MASTER_CONTRACT,
    CONTRACT_DATE,
    Delivery_Module,
  } = TEXTS;
  const store = useSelector((state) => state.auth);
  const plus = "+";

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const [logo, setLogo] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [color, setColor] = useState("green");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [notificationTo, setNotificationTo] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [contractEndDate, setContractEndDate] = useState("");
  const [contractStartDate, setContractStartDate] = useState("");
  const [functionality, setFunctionality] = useState("DELIVERY");
  const [contractType, setContractType] = useState("CLIENTPERSITE");
  const [notificationPriorToDays, setNotificationPriorToDays] = useState("");

  // State for errors
  const [nameError, setNameError] = useState("");
  const [logoError, setLogoError] = useState("");
  const [contractEndDateError, setContractEndDateError] = useState("");
  const [contractStartDateError, setContractStartDateError] = useState("");

  function handleChange(name, value) {
    if (name === "logo") setLogo(value);
    else if (name === "name") setName(value);
    else if (name === "color") setColor(value);
    else if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "email") setEmail(value);
    else if (name === "phone") setPhone(value);
    else if (name === "contractType") {
      setContractStartDate("");
      setContractEndDate("");
      setContractType(value);
    } else if (name === "contractStartDate") {
      setContractEndDate("");
      setContractStartDate(value);
    } else if (name === "contractEndDate") setContractEndDate(value);
    else if (name === "functionality") setFunctionality(value);
    else if (name === "additionalInfo") setAdditionalInfo(value);
    else if (name === "notificationPriorToDays")
      setNotificationPriorToDays(value);
    else if (name === "notificationTo") setNotificationTo(value);
    setUpdate((st) => !st);

    validation(name, value);
  }

  function validation(name, value) {
    if (name === "name") {
      if (GLOBALS.Functions.empty(value)) {
        setNameError(Please_enter_company_name);
      } else {
        setNameError("");
      }
    }
    if (name === "logo") {
      if (GLOBALS.Functions.empty(value.length)) {
        setLogoError(Please_Add_logo);
      } else {
        setLogoError("");
      }
    }
    if (name === "contractStartDate") {
      if (GLOBALS.Functions.empty(value)) {
        setContractStartDateError(Please_select_start_date);
      } else {
        setContractStartDateError("");
      }
    }
    if (name === "contractEndDate") {
      if (GLOBALS.Functions.empty(value)) {
        setContractEndDateError(Please_select_end_date);
      } else {
        setContractEndDateError("");
      }
    }
  }

  async function onSubmit(e) {
    try {
      e.preventDefault();
      setLoading(true);
      const notificationToArray = notificationTo.map((item) => item.label);
      var formdata = new FormData();
      formdata.append("logo", logo[0].file);
      formdata.append("name", name);
      formdata.append("color", color);
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("email", email);
      formdata.append("phone", plus + phone);
      formdata.append("contractType", contractType);
      formdata.append("contractStartDate", contractStartDate);
      formdata.append("contractEndDate", contractEndDate);
      formdata.append("functionality", functionality);
      formdata.append("additionalInfo", additionalInfo);
      formdata.append("notificationPriorToDays", notificationPriorToDays);
      formdata.append("notificationTo", JSON.stringify(notificationToArray));

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.CLIENTS,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      setLoading(false);
      props.history.push("/clients");
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary={ADD_A_CLIENT} />
      <div className={classes.content}>
        <Form.Form>
          <Form.Row>
            <FormLabel bold primary={`${NAME_OF_COMPANY}* :`} />
            <FormInput
              name="name"
              value={name}
              maxLength="30"
              error={nameError}
              placeholder={NAME_OF_COMPANY}
              style={GLOBALS.Styles.inputWidth}
              onBlur={({ target: { name, value } }) => validation(name, value)}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          {update && ""}
          <Form.Row>
            <FormLabel bold primary={`${COMPANY_LOGO}* :`} />
            <Form.Row noMargin width="48%">
              <FormMultipleUpload
                name="logo"
                values={logo}
                error={logoError}
                style={GLOBALS.Styles.inputWidth}
                onChange={(values) => handleChange("logo", values)}
              />
              <div style={GLOBALS.Styles.inputWidth}>
                <ColorPicker
                  color={color}
                  handleChange={({ hex }) => handleChange("color", hex)}
                />
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${COMPANY_RESPONSIBLE}`} />
            <Form.Row noMargin width="48%">
              <FormInput
                maxLength="30"
                name="firstName"
                value={firstName}
                placeholder={FIRST_NAME}
                style={GLOBALS.Styles.inputWidth}
                onBlur={({ target: { name, value } }) =>
                  validation(name, value)
                }
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                maxLength="30"
                name="lastName"
                value={lastName}
                placeholder={LAST_NAME}
                style={GLOBALS.Styles.inputWidth}
                onBlur={({ target: { name, value } }) =>
                  validation(name, value)
                }
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${CONTACT_RESPONSIBLE}`} />
            <Form.Row noMargin width="48%">
              <FormInput
                name="email"
                value={email}
                placeholder={Please_enter_email}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <PhoneBox
                name="phone"
                value={phone}
                type="number"
                placeholder={TELEPHONE}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  value.length < 26 ? handleChange(name, value) : ""
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${TYPE_OF_CONTRACT}`} />
            <RadioButton
              name="contractType"
              value={contractType}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              items={[
                { value: "CLIENTPERSITE", label: Per_site },
                { value: "MASTERCLIENT", label: MASTER_CONTRACT },
              ]}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${CONTRACT_DATE}* :`} />
            <Form.Row noMargin width="48%">
              <FormInput
                type="date"
                placeholder={START_DATE}
                name="contractStartDate"
                value={contractStartDate}
                min={moment().format("YYYY-MM-DD")}
                error={
                  contractType === "MASTERCLIENT" && contractStartDateError
                }
                style={GLOBALS.Styles.inputWidth}
                disabled={contractType !== "MASTERCLIENT"}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                type="date"
                placeholder={END_DATE}
                name="contractEndDate"
                value={contractEndDate}
                min={moment(contractStartDate)
                  .add(1, "days")
                  .format("YYYY-MM-DD")}
                error={contractType === "MASTERCLIENT" && contractEndDateError}
                style={GLOBALS.Styles.inputWidth}
                disabled={contractType !== "MASTERCLIENT"}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={FUNCTIONALITY_SUBSCRIBED} />
            <RadioButton
              name="functionality"
              value={functionality}
              style={GLOBALS.Styles.inputWidth}
              items={[{ value: "DELIVERY", label: Delivery_Module }]}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary={ADDITIONNAL_INFORMATION} />
            <FormInput
              textArea
              rows={3}
              maxLength="300"
              name="additionalInfo"
              value={additionalInfo}
              style={GLOBALS.Styles.inputWidth}
              placeholder={ADDITIONNAL_INFORMATION}
              onBlur={({ target: { name, value } }) => validation(name, value)}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary={`${NOTIFICATION}:`} />
            <Form.Row
              noMargin
              width="48%"
              alignItems="center"
              justifyContent="flex-start"
            >
              <FormInput
                type="number"
                placeholder="0"
                name="notificationPriorToDays"
                value={notificationPriorToDays}
                disabled={contractType !== "MASTERCLIENT"}
                style={{ ...GLOBALS.Styles.inputWidth, maxWidth: 100 }}
                onChange={({ target: { name, value } }) =>
                  value >= 0 && handleChange(name, value)
                }
              />
              <SmallText
                primary={Days_before_end_of_the_site}
                style={{ marginLeft: "10px", marginBottom: 0 }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary={NOTIFY_THE_ADDRESSES} />
            <MultiAdderInput
              name="notificationTo"
              values={notificationTo}
              validateError={Please_enter_valid_email}
              placeholder={Please_enter_email}
              style={GLOBALS.Styles.inputWidth}
              disabled={contractType !== "MASTERCLIENT"}
              onChange={(values) => handleChange("notificationTo", values)}
              validate={(text) => {
                const re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/;
                return !re.test(String(text).toLowerCase());
              }}
            />
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              onClick={onSubmit}
              minWidth={200}
              text={VALIDATE}
              fullWidth={false}
              loading={loading}
              disabled={
                loading ||
                !name ||
                nameError ||
                logo.length === 0 ||
                logoError ||
                Number(notificationPriorToDays) < 0 ||
                (contractType === "MASTERCLIENT" &&
                  (!contractStartDate ||
                    !contractEndDate ||
                    moment(contractEndDate).diff(
                      moment(contractStartDate),
                      "days",
                    ) <= 0))
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
