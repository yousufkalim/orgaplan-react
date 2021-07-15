import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";
import { TEXTS } from "../../../assets/languages/french";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
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

export default function VerifyClient(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    TELEPHONE,
    FIRST_NAME,
    LAST_NAME,
    CONTRACT,
    CONTRACT_DATE,
    START_DATE,
    END_DATE,
    FUNCTIONALITY_SUBSCRIBED,
    VALIDATE,
    NOTIFICATION,
    ADDITIONNAL_INFORMATION,
    VERIFY_A_QUOTE,
    COMPANY_NAME,
    COMPANY,
    RESPONSIBLE,
    ADD_A_CLIENT,
    Days_before_end_of_the_site,
    NOTIFY_THE_ADDRESSES,
    DELETE,
    CREATE_A_CLIENT,
    Are_you_sure_to_Delete,
    Please_select_a_company,
    ADDITIONNAL_INFORMATION_MUST_BE_LESS_THAN_30_CHARACTERS,
    TYPE_OF_CONTRACT,
    Delivery_module,
    Please_enter_valid_email,
  } = TEXTS;
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const [logo, setLogo] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("green");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contractType, setContractType] = useState("CLIENTPERSITE");
  const [contractStartDate, setContractStartDate] = useState("");
  const [contractEndDate, setContractEndDate] = useState("");
  const [functionality, setFunctionality] = useState("DELIVERY");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [notificationPriorToDays, setNotificationPriorToDays] = useState("0");
  const [notificationTo, setNotificationTo] = useState([]);

  const [errors, setErrors] = useState({});

  function handleChange(name, value) {
    if (name === "logo") setLogo(value);
    else if (name === "name") setName(value);
    else if (name === "color") setColor(value);
    else if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "email") setEmail(value);
    else if (name === "phone") setPhone(value);
    else if (name === "contractType") setContractType(value);
    else if (name === "contractStartDate") setContractStartDate(value);
    else if (name === "contractEndDate") setContractEndDate(value);
    else if (name === "functionality") setFunctionality(value);
    else if (name === "additionalInfo") setAdditionalInfo(value);
    else if (name === "notificationPriorToDays")
      setNotificationPriorToDays(value);
    else if (name === "notificationTo") setNotificationTo(value);
    setUpdate((st) => !st);
  }

  async function onSubmit(e) {
    try {
      e.preventDefault();
      setLoading(true);
      let item = props.location.item;

      const notificationToArray = notificationTo.map((item) => item.label);

      var formdata = new FormData();
      formdata.append("logo", logo[0].file);
      formdata.append("color", color);
      formdata.append("clientId", item._id);
      formdata.append("companyId", item.companyId._id);
      formdata.append("contractType", contractType);
      formdata.append("contractEndDate", contractEndDate);
      formdata.append("contractStartDate", contractStartDate);
      formdata.append("functionality", functionality);
      formdata.append("additionalInfo", additionalInfo);
      formdata.append("notificationPriorToDays", notificationPriorToDays);
      formdata.append("notificationTo", JSON.stringify(notificationToArray));

      await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.QUOTE_VERIFY}`,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      setLoading(false);
      props.history.replace("/clients");
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function validation(name, value) {
    if (name === "additionalInfo") {
      if (GLOBALS.Functions.length(value, 300))
        setErrors({
          ...errors,
          additionalInfo:
            ADDITIONNAL_INFORMATION_MUST_BE_LESS_THAN_30_CHARACTERS,
        });
      else setErrors({ ...errors, additionalInfo: "" });
    }
  }

  useEffect(() => {
    let item = props.location.item;
    setName(item.companyId.name);
    setFirstName(item.companyId.incharge.firstName);
    setLastName(item.companyId.incharge.lastName);
    setEmail(item.companyId.incharge.email);
    setPhone(item.companyId.incharge.phone);
    setContractType(item.companyId.type);

    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary={VERIFY_A_QUOTE} />
      {update && ""}
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary={`${COMPANY_NAME}* :`} />
            <FormInput
              disabled
              name="name"
              value={name}
              // error={name}
              placeholder={COMPANY_NAME}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${COMPANY} LOGO* :`} />
            <Form.Row noMargin width="48%">
              <FormMultipleUpload
                name="logo"
                values={logo}
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
            <FormLabel bold primary={`${RESPONSIBLE} ${COMPANY}`} />
            <Form.Row noMargin width="48%">
              <FormInput
                disabled
                name="firstName"
                value={firstName}
                placeholder={FIRST_NAME}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                disabled
                name="lastName"
                value={lastName}
                placeholder={LAST_NAME}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${RESPONSIBLE} CONTACT`} />
            <Form.Row noMargin width="48%">
              <FormInput
                disabled
                name="email"
                value={email}
                placeholder="E-mail Address"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                disabled
                name="phone"
                type="number"
                value={phone}
                placeholder={TELEPHONE}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${TYPE_OF_CONTRACT}* : `} />
            <RadioButton
              disabled
              name="contractType"
              value={contractType}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              items={[
                { value: "CLIENTPERSITE", label: "Per Site" },
                { value: "MASTERCLIENT", label: "Master Contract" },
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
                style={GLOBALS.Styles.inputWidth}
                min={moment().format("YYYY-MM-DD")}
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
                style={GLOBALS.Styles.inputWidth}
                disabled={contractType !== "MASTERCLIENT"}
                min={moment(contractStartDate)
                  .add(1, "days")
                  .format("YYYY-MM-DD")}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${FUNCTIONALITY_SUBSCRIBED}:`} />
            <RadioButton
              name="functionality"
              value={functionality}
              style={GLOBALS.Styles.inputWidth}
              items={[{ value: "DELIVERY", label: Delivery_module }]}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary={`${ADDITIONNAL_INFORMATION}:`} />
            <FormInput
              textArea
              rows={3}
              name="additionalInfo"
              value={additionalInfo}
              error={errors.additionalInfo}
              style={GLOBALS.Styles.inputWidth}
              placeholder={ADDITIONNAL_INFORMATION}
              onBlur={({ target: { name, value } }) => validation(name, value)}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary={NOTIFICATION} />
            <Form.Row
              noMargin
              width="48%"
              alignItems="center"
              justifyContent="flex-start"
            >
              <FormInput
                type="number"
                name="notificationPriorToDays"
                value={notificationPriorToDays}
                disabled={contractType !== "MASTERCLIENT"}
                style={{ ...GLOBALS.Styles.inputWidth, maxWidth: 100 }}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
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
              style={GLOBALS.Styles.inputWidth}
              placeholder="Enter email address"
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
              type="submit"
              minWidth={200}
              text={VALIDATE}
              fullWidth={false}
              loading={loading}
              disabled={
                loading ||
                logo.length === 0 ||
                (contractType === "MASTERCLIENT" &&
                  (!contractStartDate ||
                    !contractEndDate ||
                    moment(contractEndDate).diff(
                      moment(contractStartDate),
                      "days",
                    ) <= 0)) ||
                errors.additionalInfo ||
                Number(notificationPriorToDays) < 0
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
