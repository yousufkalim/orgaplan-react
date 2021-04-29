import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import SmallText from "../../../components/SmallText";
import FormLabel from "../../../components/FormLabel";
import RadioButton from "../../../components/RadioButton";
import MultiAdderInput from "../../../components/MultiAdderInput";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";
import ColorPicker from "../../../components/ColorPcker";

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
  const [notificationPriorToDays, setNotificationPriorToDays] = useState("");
  const [notificationTo, setNotificationTo] = useState([]);
  const [errors, setErrors] = useState({});
  const handleChange = (name, value) => {
    if (name === "logo") {
      setUpdate((st) => !st);
      setLogo(value);
    } else if (name === "name") setName(value);
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
    else if (name === "notificationTo") {
      setUpdate((st) => !st);
      setNotificationTo(value);
    }
    // Validation

    if (name === "name") {
      if (value !== "") setErrors({ nameError: "" });
      if (value.length > 30)
        setErrors({ nameError: "Max 30 characters are allowed" });
    }
    if (name === "firstName") {
      if (value !== "") setErrors({ firstNameError: "" });
      if (value.length > 30)
        setErrors({ firstNameError: "Max 30 characters are allowed" });
    }
    if (name === "lastName") {
      if (value !== "") setErrors({ lastNameError: "" });
      if (value.length > 30)
        setErrors({ lastNameError: "Max 30 characters are allowed" });
    }
    if (name === "email") {
      const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (value !== "") setErrors({ emailError: "" });
      if (!value.match(regEx)) {
        setErrors({ emailError: "* Please Enter Your Valid Email" });
      }
    }
    if (name === "phone") {
      if (value !== "") {
        setErrors({
          phoneError: "",
        });
      }
      if (value.length > 25 && value.length < 10) {
        setErrors({
          phoneError: "* Telephone must have 10 to 25 digits",
        });
      }
      if (value[0] !== "0") {
        setErrors({ phoneError: "* Phone Number must start with 0" });
      }
    }
    if (name === "additionalInfo") {
      if (value.length > 300) {
        setErrors({
          additionalInfoError: "Maximum 300 Characters are allowed",
        });
      } else {
        setErrors({
          additionalInfoError: "",
        });
      }
    }
  };
  const handleChangecolor = (color) => {
    setColor(color.hex);
  };

  const onSubmit = async (e) => {
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
      formdata.append("phone", phone);
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
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD A CLIENT" />
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary="COMPANY NAME* :" />
            <FormInput
              name="name"
              value={name}
              maxLength="30"
              placeholder="Company name"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row noMargin width="48%" alignItems="right">
            <FormLabel />
            {errors["nameError"] && (
              <div style={{ color: "red" }}>{errors["nameError"]}</div>
            )}
          </Form.Row>
          {update && ""}
          <Form.Row>
            <FormLabel bold primary="COMPANY LOGO* :" />
            <Form.Row noMargin width="48%">
              <FormMultipleUpload
                name="logo"
                values={logo}
                style={GLOBALS.Styles.inputWidth}
                onChange={(values) => handleChange("logo", values)}
              />
              <div style={{ width: "45%" }}>
                <ColorPicker
                  color={color}
                  handleChange={handleChangecolor}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="RESPONSIBLE COMPANY : " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="firstName"
                maxLength="30"
                value={firstName}
                error={errors["firstNameErrors"]}
                placeholder="First Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                name="lastName"
                value={lastName}
                maxLength="30"
                placeholder="Last Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row noMargin width="48%" alignItems="right">
            <FormLabel />
            {errors["firstNameError"] && (
              <div style={{ color: "red" }}>{errors["firstNameError"]}</div>
            )}
          </Form.Row>
          <Form.Row noMargin width="48%" alignItems="right">
            <FormLabel />
            {errors["lastNameError"] && (
              <div style={{ color: "red" }}>{errors["lastNameError"]}</div>
            )}
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="RESPONSIBLE CONTACT : " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="email"
                value={email}
                placeholder="E-mail Address"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                validate={(text) => {
                  const re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/;
                  return !re.test(String(text).toLowerCase());
                }}
              />
              <FormInput
                name="phone"
                value={phone}
                type="number"
                maxlength="25"
                placeholder="Phone Number"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row noMargin width="48%" alignItems="right">
            <FormLabel />
            {errors["emailError"] && (
              <div style={{ color: "red" }}>{errors["emailError"]}</div>
            )}
          </Form.Row>
          <Form.Row noMargin width="100%" alignItems="right">
            <FormLabel />
            {errors["phoneError"] && (
              <div style={{ color: "red" }}>{errors["phoneError"]}</div>
            )}
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="TYPE OF CONTRACT* : " />
            <RadioButton
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
            <FormLabel bold primary="CONTRACT DATE* : " />
            <Form.Row noMargin width="48%">
              <FormInput
                type="date"
                placeholder="Start date"
                name="contractStartDate"
                value={contractStartDate}
                min={moment().format("YYYY-MM-DD")}
                style={GLOBALS.Styles.inputWidth}
                disabled={contractType !== "MASTERCLIENT"}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                type="date"
                placeholder="End date"
                name="contractEndDate"
                value={contractEndDate}
                min={moment(contractStartDate)
                  .add(1, "days")
                  .format("YYYY-MM-DD")}
                style={GLOBALS.Styles.inputWidth}
                disabled={contractType !== "MASTERCLIENT"}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="FUNCTIONALITY SUBSCRIBED : " />
            <RadioButton
              name="functionality"
              value={functionality}
              style={GLOBALS.Styles.inputWidth}
              items={[{ value: "DELIVERY", label: "Delivery module" }]}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="ADDITIONNAL INFORMATION :" />
            <FormInput
              textArea
              rows={3}
              maxLength="300"
              name="additionalInfo"
              value={additionalInfo}
              style={GLOBALS.Styles.inputWidth}
              placeholder="Additional information"
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row noMargin width="48%" alignItems="right">
            <FormLabel />
            {errors["additionalInfoError"] && (
              <div style={{ color: "red" }}>
                {errors["additionalInfoError"]}
              </div>
            )}
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="NOTIFICATION : " />
            <Form.Row
              noMargin
              width="48%"
              alignItems="center"
              justifyContent="center"
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
                primary="Days before end of the contract"
                style={{ marginLeft: "10px" }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="NOTIFY THE ADDRESSES : " />
            <MultiAdderInput
              name="notificationTo"
              values={notificationTo}
              validateError="Invalid Email"
              placeholder="Enter email address"
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
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              loading={loading}
              disabled={
                loading ||
                !name ||
                name.length > 30 ||
                logo.length === 0 ||
                (contractType === "MASTERCLIENT" &&
                  (!contractStartDate ||
                    !contractEndDate ||
                    moment(contractEndDate).diff(
                      moment(contractStartDate),
                      "days",
                    ) <= 0)) ||
                firstName.length > 30 ||
                lastName.length > 30 ||
                (phone.length > 0 &&
                  (!phone.startsWith("0") || phone.length !== 10)) ||
                additionalInfo.length > 300 ||
                Number(notificationPriorToDays) < 0
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
