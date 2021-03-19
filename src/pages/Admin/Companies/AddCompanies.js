import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
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
import { InputSharp } from "@material-ui/icons";
import CustomInputModal from "../../../components/CustomInputModalSingleSelect";
import Actions from "../../../redux/actions";
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
  radioLabel: {
    marginLeft: "7px",
    color: "#7E7878",
    marginRight: "50px",
  },
  radioBtn: {},
}));

const addClientYup = Yup.object().shape({
  images: Yup.array().min(1, "Required").required("Required"),
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

export default function AddCompanies(props) {
  const dispatch = useDispatch();

  const classes = useStyles();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [color, setColor] = useState("");
  const [colorError, setColorError] = useState("");
  const [images, setImages] = useState([]);
  const [companyType, setCompanyType] = useState("subcontractor");
  const [companyTypeError, setCompanyTypeError] = useState("");
  const [contract, setContract] = useState("");
  const [contractError, setContractError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [update, setUpdate] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [website, setWebsite] = useState("");
  const [addInfo, setAddInfo] = useState("");

  const [companies, setCompanies] = useState([]);
  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(null);

  const [trades, setTrades] = useState([]);
  const [dropdownTrades, setDropdownTrades] = useState([]);
  const [selectedTrade, setSelectedTrade] = useState("");
  const [listOfTrades, setListOfTrades] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      //formik.setFieldValue("site", adminStore.site.siteId.name);
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ADD_COMPANY}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        setCompanies(response.data.site_companies);
        setTrades(response.data.site_trades);
        if (response.data.site_companies != null) {
          const companyTemp = [];

          response.data.site_companies.map((item, index) => {
            return companyTemp.push({
              label: item.companyId.name,
              value: item.companyId.name,
            });
          });
          setDropdownCompanies(companyTemp);
        }

        if (response.data.site_trades != null) {
          const tradesTemp = [];

          response.data.site_trades.map((item, index) => {
            return tradesTemp.push({
              label: item,
              value: item,
            });
          });
          setDropdownTrades(tradesTemp);
        }
      } else {
      }

      //   setItems(response.data.items);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  // const [startDate, setStartDate] = useState("");
  // const [startDateError, setStartDateError] = useState("");
  // const [isDateSelect, setIsDateSelect] = useState("");
  // const [endDate, setEndDate] = useState("");
  // const [endDateError, setEndDateError] = useState("");
  // const [available, setAvailable] = useState("VOIR LES INDISPONIBILITÉS");
  // const [techSheet, setTechSheet] = useState([]);
  // const [rate, setRate] = useState("");
  // const [rateError, setRateError] = useState("");

  const onSubmit = async () => {
    // const notificationTo = values.notificationTo.map((item) => item.label);
    const values = formik.values;
    const isSubContractor = companyType === "subcontractor";
    const parentCompanyId = companies[selectedCompanyIndex].companyId._id;

    alert(
      name +
        " " +
        phone +
        " " +
        fname +
        " " +
        lname +
        " " +
        website +
        " " +
        addInfo,
    );
    return;

    var formdata = new FormData();
    formdata.append("logo", values.images[0].file);
    formdata.append("name", name);
    formdata.append("color", values.color);
    formdata.append("firstName", values.firstName);
    formdata.append("lastName", values.lastName);
    formdata.append("email", values.email);
    formdata.append("phone", values.phone);
    // formdata.append("contractType", values.contractType);
    //formdata.append("contractStartDate", values.contractStartDate);
    //formdata.append("contractEndDate", values.contractEndDate);
    //formdata.append("functionality", values.functionality);
    //formdata.append("additionalInfo", values.additionalInfo);
    //formdata.append("notificationPriorToDays", values.notificationPriorToDays);
    // formdata.append("notificationTo", JSON.stringify(notificationTo));
    await GLOBALS.API({
      method: "POST",
      uri: GLOBALS.Constants.CLIENTS,
      headers: {
        Authorization: store.token,
      },
      body: formdata,
    });
    formik.setSubmitting(false);
    props.history.push("/clients");
  };

  const inputChange = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
      if (e.target.name === "" || name === null) {
        setNameError(true);
      } else {
        setNameError(false);
      }
    }
    if (e.target.name === "color") {
      setColor(e.target.value);
      if (e.target.value === "" || e.target.value === null) {
        setColorError(true);
      } else {
        setColorError(false);
      }
    }
    // if (e.target.name === "companyType") {
    //   console.log(e.target.value);
    //   setCompanyType(e.target.value);
    //   console.log("company type", companyType);
    //   if (e.target.value === "" || e.target.value === null) {
    //     setCompanyTypeError(true);
    //   } else {
    //     setCompanyTypeError(false);
    //   }
    // }
    if (e.target.name === "contract") {
      setContract(e.target.value);
      if (
        e.target.value === "" ||
        e.target.value === null ||
        e.target.value === undefined
      ) {
        setContractError(true);
      } else {
        setContractError(false);
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
    if (e.target.name === "phone") {
      setPhone(e.target.value);
      if (e.target.value.length !== 10) {
        setPhoneError(true);
      } else {
        setPhoneError(false);
      }
    }

    if (e.target.name === "images") {
      setImages(e.target.value);
    }
    if (e.target.name === "trades") {
      setTrades(e.target.value);
    }

    if (e.target.name === "addInfo") {
      setAddInfo(e.target.value);
    }
  };

  const handleChange = (name, value) => {
    if (name === "trades") {
      if (value !== "") {
        setUpdate((st) => !st);
        setTrades(value);
        console.log("trades", trades);
      }
    }
  };

  const submitHandler = (e) => {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    e.preventDefault();
    if (name === "" || name === null) {
      setNameError(true);
    }
    if (color === "" || color === null) {
      setColorError(true);
    }
    if (
      companyType === "" ||
      companyType === null ||
      companyType === undefined
    ) {
      setCompanyTypeError(true);
    }
    if (contract === "" || contract === null || contract === undefined) {
      setContractError(true);
    }
    if (email !== "") {
      if (!email.match(mailformat)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
    if (phone !== "") {
      if (phone.length !== 10) {
        setPhoneError(true);
      } else {
        setPhoneError(false);
      }
    } else {
      console.log("contarct submit", companyType);
    }
  };
  const formik = useFormik({
    initialValues: {
      images: [],
      name: "",
      color: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      contractType: "CLIENTPERSITE",
      contractStartDate: "",
      contractEndDate: "",
      functionality: "DELIVERY",
      additionalInfo: "",
      notificationPriorToDays: "",
      notificationTo: [],
    },
    validationSchema: addClientYup,
    //    onSubmit,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
  });
  console.log("type ==> ", companyType);
  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD A COMPANY" />
      <div className={classes.content}>
        <Form.Form onSubmit={submitHandler}>
          <Form.Row>
            <FormLabel bold primary="IDENTITY* :" />
            <Form.Row width="55%" style={{ gap: "20px" }}>
              <div style={{ width: "35%", height: "100%" }}>
                <Autocomplete
                  id="free-solo-demo"
                  freeSolo
                  style={{
                    ...GLOBALS.Styles.inputWidth,
                    marginRight: "10px",
                  }}
                  onSelect={(event) => {
                    companies.forEach((item, index) => {
                      if (item.companyId.name === event.target.value) {
                        setName(item.companyId.name);
                      }
                    });
                  }}
                  options={companies.map((option) => {
                    if (option.companyId.name != undefined)
                      return option.companyId.name;
                  })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Email"
                      margin="normal"
                      variant="outlined"
                      name="name"
                      value={formik.values.email}
                      error={formik.errors.email}
                      onChange={formik.handleChange}
                    />
                  )}
                />
                {nameError && (
                  <div className={classes.error}>Please enter name</div>
                )}
              </div>
              <div style={{ width: "35%", height: "100%" }}>
                <FormInput
                  name="color"
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
                values={formik.values.images}
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
                <div>
                  <input
                    className={classes.radioBtn}
                    type="radio"
                    onChange={(e) => setCompanyType("generalcontractor")}
                    id="generalcontractor"
                    name="companyType"
                    value="generalcontractor"
                  />
                  <label for="generalcontractor" className={classes.radioLabel}>
                    General Contractor
                  </label>
                  <input
                    className={classes.radioBtn}
                    type="radio"
                    id="subcontractor"
                    name="companyType"
                    onChange={(e) => {
                      setCompanyType("subcontractor");
                      console.log(companyType);
                    }}
                    value="subcontractor"
                    defaultChecked
                  />
                  <label for="subcontractor" className={classes.radioLabel}>
                    Sub contractor
                  </label>
                </div>
                {companyTypeError === true && (
                  <div className={classes.error}>Please select company</div>
                )}
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="GENERAL CONTRACTOR : " />
            <Form.Row noMargin width="55%" style={{ gap: "20px" }}>
              <div style={{ width: "100%", height: "100%" }}>
                <FormSelect
                  placeholder="Company"
                  values={dropdownCompanies}
                  value={selectedCompany}
                  disabled={companyType === "generalcontractor" ? true : false}
                  onChange={(event) => {
                    const index = event.target.selectedIndex - 1;

                    if (index !== -1) {
                      const item = event.target.value;

                      setSelectedCompanyIndex(index);

                      setSelectedCompany(item);
                    } else {
                      setSelectedCompanyIndex(null);

                      setSelectedCompany("");
                    }
                  }}
                  style={{ marginRight: "20px", maxWidth: 250 }}
                />
                {/* <select
                  name="contract"
                  disabled={companyType === "generalcontractor" ? true : false}
                  id="contract"
                  type={contract}
                  style={{
                    width: "40%",
                    height: "45px",
                    color: "#8B8989",
                    padding: "0px 10px",
                  }}
                  onChange={inputChange}
                >
                
                </select> */}
                {contractError === true && (
                  <div className={classes.error}>Please select contract</div>
                )}
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="TRADES : " />
            <Form.Row noMargin width="55%" style={{ gap: "20px" }}>
              <CustomInputModal
                name="trades"
                values={dropdownTrades}
                value={selectedTrade}
                placeholder="Select Trades"
                chipValues={(values) => {
                  const valuesTemp = [];
                  values.forEach((item, index) => {
                    valuesTemp.push(item.label);
                  });
                  setListOfTrades(valuesTemp);
                  console.log(JSON.stringify(valuesTemp, null, 2));

                  // setSiteParams(values);
                }}
                onChange={(event) => {
                  const index = event.target.selectedIndex - 1;
                  if (index !== -1) {
                    const item = event.target.value;

                    setSelectedTrade(item);
                  } else {
                    setSelectedTrade("");
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
                  type="number"
                  style={{ width: "100%", height: "45px", color: "#8B8989" }}
                  placeholder="Téléphone"
                  onChange={inputChange}
                  value={phone}
                />
                {phoneError === true && (
                  <div className={classes.error}>
                    Telephone should be 10 digits
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
                  style={{ width: "100%", height: "45px", color: "#8B8989" }}
                  placeholder="First Name"
                  onChange={(e) => setFname(e.target.value)}
                  value={fname}
                />
              </div>
              <div style={{ width: "35%", height: "100%" }}>
                <FormInput
                  name="lname"
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
                style={{ width: "50%" }}
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
                style={{ width: "90%" }}
                onChange={(e) => setAddInfo(e.target.value)}
                placeholder="Informations complémentaires"
                name="addInfo"
                value={addInfo}
              />
            </Form.Row>
          </Form.Row>

          <Form.ButtonContainer>
            <Button
              minWidth={200}
              text="VALIDATE"
              onClick={() => {
                onSubmit();
              }}
              fullWidth={false}
              // loading={formik.isSubmitting}
              disabled={name === "" || color === "" || companyType === ""}
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
