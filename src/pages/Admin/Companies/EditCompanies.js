import React, {useState} from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import * as Yup from "yup";
import MultiAdderInput from "../../../components/MultiAdderInput";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import RadioButton from "../../../components/RadioButton";
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
  radioLabel: {
    marginLeft: "7px",
    color: "#7E7878",
    marginRight: "50px"

  },
  radioBtn: {

  }
}));

const addClientYup = Yup.object().shape({
  logo: Yup.array().min(1, "Required").required("Required"),
  name: Yup.string().required("Required"),
  color: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().required("Required"),
  phone: Yup.number()
    .test(
      "len",
      "Must be exactly 10 characters",
      (val) => val && val.toString().length === 10,
    )
    .required("Required"),
  contractType: Yup.string().required("Required"),
  contractStartDate: Yup.string().required("Required"),
  contractEndDate: Yup.string().required("Required"),
  functionality: Yup.string().required("Required"),
  additionalInfo: Yup.string(),
  notificationPriorToDays: Yup.number(),
  notificationTo: Yup.array(),
});

export default function EditCompanies(props) {
  const classes = useStyles();
  const store = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [color, setColor] = useState("");
  const [colorError, setColorError] = useState("");
  const [images, setImages] = useState([]);
  const [companyType, setCompanyType] = useState("");
  const [companyTypeError, setCompanyTypeError] = useState("");
  const [contract, setContract] = useState("");
  const [contractError, setContractError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [trades, setTrades] = useState([]);
  const [update, setUpdate] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [website, setWebsite] = useState("");
  const [addInfo, setAddInfo] = useState("");




  const inputChange = (e) => {
    if (e.target.name === "companyType") {
      setCompanyType(e.target.value);
      if (e.target.value === "" || e.target.value === null) {
        setCompanyTypeError(true);
      } else {
        setCompanyTypeError(false);
      }
    }
   
    if (e.target.name === "email") {
      setEmail(e.target.value);
      var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!e.target.value.match(mailformat)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
    if (e.target.name === "addInfo") {
      setAddInfo(e.target.value);
    }
   
  };


  // const onSubmit = async (values) => {
  //   const notificationTo = values.notificationTo.map((item) => item.label);

  //   var formdata = new FormData();
  //   formdata.append("logo", values.logo[0].file);
  //   formdata.append("name", values.name);
  //   formdata.append("color", values.color);
  //   formdata.append("firstName", values.firstName);
  //   formdata.append("lastName", values.lastName);
  //   formdata.append("email", values.email);
  //   formdata.append("phone", values.phone);
  //   formdata.append("contractType", values.contractType);
  //   formdata.append("contractStartDate", values.contractStartDate);
  //   formdata.append("contractEndDate", values.contractEndDate);
  //   formdata.append("functionality", values.functionality);
  //   formdata.append("additionalInfo", values.additionalInfo);
  //   formdata.append("notificationPriorToDays", values.notificationPriorToDays);
  //   formdata.append("notificationTo", JSON.stringify(notificationTo));

  //   await GLOBALS.API({
  //     method: "POST",
  //     uri: GLOBALS.Constants.CLIENTS,
  //     headers: {
  //       Authorization: store.token,
  //     },
  //     body: formdata,
  //   });
  //   formik.setSubmitting(false);
  //   props.history.push("/clients");
  // };

  const handleChange = (name, value) => {
    if (name === "trades") {
     if(value !== ""){
      setUpdate((st) => !st);
      setTrades(value);
      console.log("trades", trades);
    }
     }
  }

  const submitHandler = (e) => {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    e.preventDefault();
   
    // if (
    //   companyType === "" ||
    //   companyType === null ||
    //   companyType === undefined
    // ) {
    //   setCompanyTypeError(true);
    // }
   
    if (email !== "") {
      if (!email.match(mailformat)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
  else {
      console.log("contarct submit", companyType);
    }
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="EDIT A COMPANY" />
      <div className={classes.content}>
        <Form.Form onSubmit={submitHandler}>
          <Form.Row>
            <FormLabel bold primary="IDENTITY* :" />
            <Form.Row width="55%" style={{ gap: "20px" }}>
              <div style={{ width: "35%", height: "100%" }}>
                <FormInput
                  name="name"
                  disabled
                  onChange={inputChange}
                  style={{ width: "100%" }}
                  placeholder="Company name"
                  value={name}
                />
                {nameError && (
                  <div className={classes.error}>Please enter name</div>
                )}
              </div>
              <div style={{ width: "35%", height: "100%" }}>
                <FormInput
                  name="color"
                  disabled
                  onChange={inputChange}
                  style={{ width: "100%" }}
                  placeholder="Color"
                  value={color}
                />
                {colorError && (
                  <div className={classes.error}>Please enter color</div>
                )}
              </div>
              <FormMultipleUpload
                name="images"
                
                style={GLOBALS.Styles.inputWidth}
                multiple
                values={images}
                onChange={(values) =>
                  inputChange({
                    target: {
                      type: "text",
                      name: "images",
                      value: values,
                    },
                  })
                }
                // onChange={inputChange}
                // onChange={(values) =>
                
                   
                //      ( {type: "text",
                //       name: "trades",
                //       value: values})
                   
               
                // }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="TYPE OF COMPANY* :" />
            <Form.Row width="55%" style={{ gap: "20px" }}>
              <div>
                <div onChange={inputChange}>
                  <input
                  className={classes.radioBtn}
                    type="radio"
                    id="generalcontractor"
                    name="companyType"
                    value="generalcontractor"
                  />
                  <label for="generalcontractor" className={classes.radioLabel}>General Contractor</label>
                  <input
                  className={classes.radioBtn}
                    type="radio"
                    id="subcontractor"
                    name="companyType"
                    value="subcontractor"
                  />
                  <label for="subcontractor" className={classes.radioLabel}>Sub contractor</label>
                </div>
                {companyTypeError === true && (
                  <div className={classes.error}>Please select company</div>
                )}
              </div>

              {/* <RadioButton
                name="contractType"
                style={{width: '80%'}}
                value={formik.values.contractType}
                error={formik.errors.contractType}
                onChange={formik.handleChange}
                items={[
                  { value: "GENERALCONTRACTOR", label: "General Contractor" },
                  { value: "Subcontractor", label: "Subcontract" },
                ]}
              /> */}
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="GENERAL CONTRACTOR : " />
            <Form.Row noMargin width="55%" style={{ gap: "20px" }}>
              <div style={{ width: "100%", height: "100%" }}>
                <select
                  name="contract"
                  disabled
                  id="contract"
                  type={contract}
                  style={{ width: "40%", height: "45px", color: "#8B8989", padding: '0px 10px' }}
                  onChange={inputChange}
                >
                  <option value="">List</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                </select>
                {contractError === true && (
                  <div className={classes.error}>Please select contract</div>
                )}
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="TRADES : " />
            <Form.Row noMargin width="55%" style={{ gap: "20px" }}>
            <MultiAdderInput
              name="trades"
              values={trades}
              validateError="Please enter trades"
              placeholder="Trades"
              style={{width: "40%"}}
              // disabled={contractType !== "MASTERCLIENT"}
              onChange={(values) => handleChange("trades", values)}
              validate={(text) => {
                if(text !== ""){
                  return false;
                }
                else{
                  return true;
                }
              }}
            />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="IDEMTITY OF RESPONSIBLE* : " />
            <Form.Row
              width="55%"
              style={{ gap: "20px", justifyContent: "flex-start" }}
            >
              <div style={{ width: "40%", height: "100%" }}>
                <FormInput
                  name="email"
                  style={{ width: "100%", height: "45px", color: "#8B8989" }}
                  placeholder="Adresse e-mail"
                  onChange={inputChange}
                  value={email}
                />
                {emailError === true && (
                  <div className={classes.error}>Please enter valid email</div>
                )}
              </div>
              <div style={{ width: "40%", height: "100%" }}>
                <FormInput
                  name="phone"
                  disabled
                  type="number"
                  style={{ width: "100%", height: "45px", color: "#8B8989" }}
                  placeholder="Téléphone"
                  onChange={inputChange}
                  value={phone}
                />
                {phoneError === true && (
                  <div className={classes.error}>
                    Telephone should be 11 digits
                  </div>
                )}
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel />
            <Form.Row
              width="55%"
              style={{ gap: "20px", justifyContent: "flex-start" }}
            >
              <div style={{ width: "35%", height: "100%" }}>
                <FormInput
                  name="fname"
                  disabled
                  style={{ width: "100%", height: "45px", color: "#8B8989" }}
                  placeholder="First Name"
                  onChange={(e) => setFname(e.target.value)}
                  value={fname}
                />
              </div>
              <div style={{ width: "35%", height: "100%" }}>
                <FormInput
                  name="lname"
                  disabled
                  style={{ width: "100%", height: "45px", color: "#8B8989" }}
                  placeholder="Last Name"
                  onChange={(e) => setLname(e.target.value)}
                  value={lname}
                />
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="Website : " />
            <Form.Row width="55%">
              <FormInput
                name="website"
                disabled
                style={{width: '50%'}}
                placeholder="http://"
                onChange={(e) => setWebsite(e.target.value)}
                value={website}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="ADDITIONNAL INFORMATION :" />
            <Form.Row width="55%">
            <FormInput
              textArea
              rows={3}
              style={{width: '90%'}}
              onChange={(e) => setAddInfo(e.target.value)}
              placeholder="Informations complémentaires"
              name="addInfo"
              value={addInfo}
            />
            </Form.Row>
          </Form.Row>

          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              // loading={formik.isSubmitting}
              // disabled={
              //   name === "" ||
              //   color === "" ||
              //   companyType === "" ||
              //   contract === "" ?
              //   true : false
              // }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
