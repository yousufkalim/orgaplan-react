import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
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
    color: "red"
  }
}));

export default function AddAdmin(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [update, setUpdate] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [mailformat] = useState("/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/")

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

      setCompanies(itemsArray);
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
      var mailformat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!value.match(mailformat)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
    if (name === "phone") {
      setPhone(value);
      if (value.charAt(0) !== "0") {
        setPhoneError("Telephone shoud starts with 0");
      } else if (value.charAt(0) === "0" && value.length !== 10) {
        setPhoneError("Telephone must have 10 digits");
      } else {
        setPhoneError("");
      }
    }
    else if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "image") {
      setUpdate((st) => !st);
      setImage(value);
      console.log("updated image");
    } else if (name === "companyId") setCompanyId(value);
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      var formdata = new FormData();
      formdata.append("email", email);
      formdata.append("phone", phone);
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("image", image[0]?.file);
      formdata.append("companyId", companyId);

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
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD AN ADMIN" />
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary="CONTACT INFO*: " />
            <Form.Row noMargin width="48%" style={{gap: "20px"}}>
              <div style={{width: "50%"}}>
              <FormInput
                name="email"
                type="email"
                placeholder="E-mail Address"
                value={email}
                // error={email}
                style={{width: "100%"}}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
               {emailError === true && (
                  <div className={classes.error}>Please enter valid email</div>
                )}
              </div>
              <div style={{width: "50%"}}>

              <FormInput
                name="phone"
                value={phone}
                type="number"
                // error={phone}
                placeholder="Phone Number"
                style={{width: "100%"}}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
                {phoneError && (
                  <div className={classes.error}>
                    {phoneError}
                  </div>
                )}
              </div>
            </Form.Row>
          </Form.Row>
          {update && ""}
          <Form.Row>
            <FormLabel bold primary="IDENTITY*: " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="firstName"
                value={firstName}
                // error={firstName}
                placeholder="First Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                name="lastName"
                value={lastName}
                // error={lastName}
                placeholder="Last Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="PROFILE*: " />
            <FormMultipleUpload
              name="image"
              // error={image}
              values={image}
              style={GLOBALS.Styles.inputWidth}
              onChange={(values) => handleChange("image", values)}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="COMPANY*: " />
            <FormSelect
              name="companyId"
              value={companyId}
              // error={companyId}
              values={companies}
              placeholder="Select Company"
              style={GLOBALS.Styles.inputWidth}
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
                emailError ||
                
                (!phone || phone.length !== 10 || phone.charAt(0) !== "0" )||
                !firstName ||
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
