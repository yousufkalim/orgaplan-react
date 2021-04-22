import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import * as Yup from "yup";

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
import CustomInputModal from "../../../components/CustomInputModalSingleSelect";
import Actions from "../../../redux/actions";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ColorPicker from "../../../components/ColorPcker";

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

export default function EditCompany(props) {
  const dispatch = useDispatch();

  const classes = useStyles();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [color, setColor] = useState("");
  const [companyType, setCompanyType] = useState("subcontractor");
  const [contract, setContract] = useState("");
  const [contractError, setContractError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [website, setWebsite] = useState("");
  const [addInfo, setAddInfo] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(null);

  const [dropdownTrades, setDropdownTrades] = useState([]);
  const [selectedTrade, setSelectedTrade] = useState("");
  const [listOfTrades, setListOfTrades] = useState([]);
  const [fieldsEnabled, setFieldsEnabled] = useState(true);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    getCompanyAutoFill();
    // eslint-disable-next-line
  }, [companyId]);
  const getData = async () => {
    setCompanyId(props.location.id);
    try {
      //formik.setFieldValue("site", adminStore.site.siteId.name);
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ADD_COMPANY}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        setCompanies(response.data.site_companies);
        if (response.data.site_companies !== null) {
          const companyTemp = [];

          response.data.site_companies.map((item, index) => {
            return companyTemp.push({
              label: item.companyId.name,
              value: item.companyId.name,
            });
          });
          setDropdownCompanies(companyTemp);
        }

        if (response.data.site_trades !== null) {
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

  const getCompanyAutoFill = async () => {
    if (companyId.length === 0) return;
    try {
      //formik.setFieldValue("site", adminStore.site.siteId.name);
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_COMPANY_AUTOFILL}/${adminStore.site.siteId._id}/${companyId}`,
        token: store.token,
      });
      if (response.success) {
        if (response.data.site_companies.length !== 0) {
          const company = response.data.site_companies[0].companyId;
          const trades = response.data.site_companies[0].trades;
          formik.setFieldValue("email", company.name);
          setName(company.name);
          if (company.incharge !== undefined) {
            const incharge = company.incharge;
            setFname(incharge.firstName);
            setLname(incharge.lastName);
            setEmail(incharge.email);
            setPhone(incharge.phone);
          } else {
            setFname("");
            setLname("");
            setEmail("");
            setPhone("");
          }
          if (company.color !== undefined) setColor(company.color);
          if (company.website !== undefined) setWebsite(company.website);
          else setWebsite("");
          if (company.description !== undefined)
            setAddInfo(company.description);
          else setAddInfo("");
          if (trades !== undefined) {
            const tradesTemp = [];
            trades.forEach((item, index) => {
              tradesTemp.push({ key: item, label: item });
            });
            setListOfTrades(tradesTemp);
          }
        }
        await getGeneralContractor();
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

  const getGeneralContractor = async () => {
    try {
      //formik.setFieldValue("site", adminStore.site.siteId.name);
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_GENERAL_CONTRACTOR}/${adminStore.site.siteId._id}/${companyId}`,
        token: store.token,
      });
      if (response.success) {
        if (response.data.companies.length === 0) {
          await setCompanyType("generalcontractor");
          setSelectedCompany("");
          setSelectedCompanyIndex(null);
        } else {
          await setCompanyType("subcontractor");
          const company = response.data.companies[0].companyId;
          let companyIndex = null;
          let companyValue = null;
          companies.forEach((item, index) => {
            if (item.companyId._id === company._id) {
              companyIndex = index;
              companyValue = item.companyId.name;
            }
          });
          if (companyIndex !== null && companyValue !== null) {
            setSelectedCompany(companyValue);
            setSelectedCompanyIndex(companyIndex);
          } else {
            setSelectedCompany("");
            setSelectedCompanyIndex(null);
          }
        }
        console.log(JSON.stringify(response, null, 2));
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
    const isSubContractor = companyType === "subcontractor";
    let parentCompanyId = undefined;
    if (
      companies.length !== 0 &&
      isSubContractor &&
      companies[selectedCompanyIndex].companyId !== undefined
    )
      parentCompanyId = companies[selectedCompanyIndex].companyId._id;

    const trades = [];

    listOfTrades.forEach((item, index) => {
      trades.push(item.label);
    });

    var formdata = new FormData();
    //formdata.append("logo", values.images[0].file);

    formdata.append("name", name);
    formdata.append("color", color);
    formdata.append("website", website);
    formdata.append("description", addInfo);
    formdata.append("trades", JSON.stringify(trades));
    formdata.append("siteId", adminStore.site.siteId._id);

    if (isSubContractor) {
      if (parentCompanyId === undefined)
        alert("You need to select a general contractor");
      formdata.append("parentCompanyId", parentCompanyId);
    }
    if (
      fname.length !== 0 &&
      lname.length !== 0 &&
      email.length !== 0 &&
      phone.length !== 0
    ) {
      const incharge = {
        firstName: fname,
        lastName: lname,
        email: email,
        phone: phone,
      };
      formdata.append("incharge", JSON.stringify(incharge));
    }

    const response = await GLOBALS.API({
      method: "POST",

      uri: GLOBALS.Constants.CREATE_COMPANY,
      headers: {
        Authorization: store.token,
      },
      body: formdata,
    });
    if (response.success) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(response.message, "success"),
        ),
      );
    }

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
      } else {
      }
    }

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
      // eslint-disable-next-line
      var mailformat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!e.target.value.match(mailformat)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }

    if (e.target.name === "images") {
    }
    if (e.target.name === "trades") {
    }

    if (e.target.name === "addInfo") {
      setAddInfo(e.target.value);
    }
  };

  const submitHandler = (e) => {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    e.preventDefault();
    if (name === "" || name === null) {
      setNameError(true);
    }
    if (color === "" || color === null) {
    }
    if (
      companyType === "" ||
      companyType === null ||
      companyType === undefined
    ) {
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
    var phoneformat = /^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/;
    if (phone !== "") {
      if (!phone.match(phoneformat)) {
        setPhoneError(true);
      } else {
        setPhoneError(false);
      }
    } else {
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

  const handleChangecolor = (color) => {
    setColor(color.hex);
    console.log("color is", color.hex);
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="Edit A COMPANY" />
      <div className={classes.content}>
        <Form.Form onSubmit={submitHandler}>
          <Form.Row>
            <FormLabel bold primary="IDENTITY* :" />
            <Form.Row
              width="55%"
              style={{ gap: "20px", justifyContent: "flex-start" }}
            >
              <div style={{ width: "35%", height: "100%" }}>
                <Autocomplete
                  id="free-solo-demo"
                  freeSolo
                  disabled={true}
                  defaultValue={name}
                  style={{
                    width: "100%",
                    marginRight: "10px",
                  }}
                  value={name}
                  className="company-autocomplete"
                  onSelect={(event) => {
                    let companyId = "";
                    let logo = null;
                    companies.forEach((item, index) => {
                      if (item.companyId.name === event.target.value) {
                        companyId = item.companyId._id;
                        logo = item.companyId.logo;
                        setName(item.companyId.name);
                      }
                    });

                    //                  let fileClone = [{ uri: mean.image }];
                    // setImage(fileClone);

                    if (companyId.length !== 0) {
                      setCompanyId(companyId);
                      setFieldsEnabled(false);
                      formik.setFieldValue("images", [{ uri: logo }]);
                    }
                  }}
                  options={companies.map(
                    (option) =>
                      option.companyId.name !== undefined &&
                      option.companyId.name,
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Name"
                      margin="normal"
                      variant="outlined"
                      defaultValue={name}
                      name="name"
                      disabled={true}
                      onChange={(event) => {
                        console.log(event);
                        setName(event.target.value);
                        formik.setFieldValue("email", event.target.value);
                      }}
                      value={formik.values.email}
                      error={formik.errors.email}
                    />
                  )}
                />
                {nameError && (
                  <div className={classes.error}>Please enter name</div>
                )}
              </div>
              <div style={{ width: "35%", height: "100%" }}>
                <ColorPicker
                  disableAlpha="true"
                  color={color}
                  handleChange={handleChangecolor}
                />
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="IMAGE * :" />
            <Form.Row width="55%">
              <FormMultipleUpload
                name="images"
                disabled
                enabled={!fieldsEnabled}
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
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="TYPE OF COMPANY* :" />
            <Form.Row width="55%">
              <RadioButton
                name="contractType"
                value={companyType}
                // error={contractType}
                style={{ width: "70%" }}
                onChange={({ target: { name, value } }) =>
                  setCompanyType(value)
                }
                items={[
                  {
                    value: "generalcontractor",
                    label: "General Contractor",
                  },
                  { value: "subcontractor", label: "Subcontractor" },
                ]}
              />
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
                disabled
                placeholder="Select Trades"
                chipDefaultValues={listOfTrades}
                chipValues={(values) => {
                  const valuesTemp = [];
                  values.forEach((item, index) => {
                    valuesTemp.push(item);
                  });
                  setListOfTrades(valuesTemp);

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
                  disabled
                  onChange={inputChange}
                  value={phone}
                />
                {phoneError === true && (
                  <div className={classes.error}>
                    Telephone must have 10 to 25 digits
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
                style={{ width: "50%" }}
                disabled
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
