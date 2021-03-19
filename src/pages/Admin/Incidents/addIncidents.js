import React, { useState, useEffect } from "react";

import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import * as Yup from "yup";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import SmallText from "../../../components/SmallText";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";

const useStyles = makeStyles(() => ({
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

// const addClientYup = Yup.object().shape({
//   logo: Yup.array().min(1, "Required").required("Required"),
//   name: Yup.string().required("Required"),
//   color: Yup.string().required("Required"),
//   firstName: Yup.string().required("Required"),
//   lastName: Yup.string().required("Required"),
//   email: Yup.string().required("Required"),
//   phone: Yup.number()
//     .test(
//       "len",
//       "Must be exactly 10 characters",
//       (val) => val && val.toString().length === 10,
//     )
//     .required("Required"),
//   contractType: Yup.string().required("Required"),
//   contractStartDate: Yup.string().required("Required"),
//   contractEndDate: Yup.string().required("Required"),
//   functionality: Yup.string().required("Required"),
//   additionalInfo: Yup.string(),
//   notificationPriorToDays: Yup.number(),
//   notificationTo: Yup.array(),
// });

export default function AddIncidents(props) {
  const classes = useStyles();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [name, setName] = useState("");
  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [dropdownLocationType, setDropdownLocationType] = useState([]);
  const [location, setLocations] = useState([]);
  const [selectedLocationType, setselectedLocationType] = useState("");

  const [companyId, setCompanyId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [nameError, setNameError] = useState(""); //working

  const [comapnyError, setComapnyError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

    useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);
   useEffect(() => {
    fetchLocationDataOnTypeChange();
    // eslint-disable-next-line
  }, [selectedLocationType]);

 const fetchData = async () => {
   const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_SITE_INCIDENT}/${adminStore.site.siteId._id}`,
        token: store.token,

       });
      
    console.log(response)
    
    if(response.success) {
      console.log(response.data.site_companies)
      if(response.data.site_companies) {
        const temp = [];
          response.data.site_companies.map((item, index) => {
            console.log(item)
            return temp.push({ label: item.companyId.name, value: item.companyId._id });
          });
          setDropdownCompanies(temp);

        console.log(dropdownCompanies)

      }

        if (response.data.locationTypes) {
          setLocations(response.data.locationTypes);
          const temp = [];
          response.data.locationTypes.map((item, index) => {
            return temp.push({ label: item, value: item });
          });
          setDropdownLocationType(temp);
        }

    }
 }



  const onSubmit = async (values) => {
  const notificationTo = values.notificationTo.map((item) => item.label);

  var formdata = new FormData();
  formdata.append("logo", values.logo[0].file);
  formdata.append("name", values.name);
  formdata.append("color", values.color);
  formdata.append("firstName", values.firstName);
  formdata.append("lastName", values.lastName);
  formdata.append("email", values.email);
  formdata.append("phone", values.phone);
    formdata.append("contractType", values.contractType);
    formdata.append("contractStartDate", values.contractStartDate);
    formdata.append("contractEndDate", values.contractEndDate);
    formdata.append("functionality", values.functionality);
    formdata.append("additionalInfo", values.additionalInfo);
    formdata.append("notificationPriorToDays", values.notificationPriorToDays);
    formdata.append("notificationTo", JSON.stringify(notificationTo));
    await GLOBALS.API({
      method: "POST",
      uri: GLOBALS.Constants.CLIENTS,
      headers: {
        Authorization: store.token,
      },
      body: formdata,
    });
    // formik.setSubmitting(false);
    props.history.push("/clients");
  };
   const nameChange = (e) => {
     console.log(e.target.value)
    if (e.target.name === "name") {
      setName(e.target.value);
      if (e.target.name === "" || name === null) {
        setNameError(true);
      } else {
        setNameError(false);
      }
    }
    if (e.target.name === "company") {
      setCompanyId(e.target.value);
      if (e.target.value === "" || e.target.value === null) {
        setComapnyError(true);
      } else {
        setComapnyError(false);
      }
    }
        if (e.target.name === "date") {
      setDate(e.target.value);
      // console.log(date)
      if (e.target.value === "" || e.target.value === null) {
        setDateError(true);
      } else {
        setDateError(false);
      }
    }
        if (e.target.name === "time") { 
      setTime(e.target.value);
      if (e.target.value === "" || e.target.value === null) {
        setTimeError(true);
      } else {
        setTimeError(false);
      }
      
    }
       if (e.target.name === "location") {
      setTime(e.target.value);
      if (e.target.value === "" || e.target.value === null) {
        setTimeError(true);
      } else {
        setTimeError(false);
      }
      
    }
       if (e.target.name === "additionalInfo") { //working
      setTime(e.target.value);
      if (e.target.value === "" || e.target.value === null) {
        setTimeError(true);
      } else {
        setTimeError(false);
      }
      
    }
       if (e.target.name === "time") { //working
      setTime(e.target.value);
      if (e.target.value === "" || e.target.value === null) {
        setTimeError(true);
      } else {
        setTimeError(false);
      }
      
    }



  };

  const fetchLocationDataOnTypeChange = async () => {
    if(selectedLocationType === 'STORAGEAREA') {
        const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_STORAGE_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if(response.success) {
        
      }
      console.log(response)
    }
    if(selectedLocationType === 'DELIVERYAREA') {
        const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_DELIVERY_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if(response.success) {
        //  const temp = [];
        //   response.data.map((item, index) => {
        //     return temp.push({ label: item, value: item });
        //   });
        //   setDropdownLocationType(temp);
      }
      console.log(response);
    }
  }
  const locationTypeChange = (e)=> {
     setselectedLocationType(e.target.value);
  }
  const submitHandler = (e) => {
    e.preventDefault();
    if (name === "" || name === null) {
      setNameError(true);
    }
    // if (types === "" || types === null) {
    //   setTypeError(true);
    // }
    // if (color === "" || color === null) {
    //   setColorError(true);
    // }
    // if (startDate === "" || startDate === undefined || startDate === null) {
    //   setStartDateError(true);
    //   setIsDateSelect(true);
      
    // } 
    // if (endDate === "" || endDate === undefined || endDate === null) {
    //   setEndDateError(true);
    // } 
    // if( rate === "" || rate === null){
    //   setRateError(true);
    // }
    // if( name !== "" && types !== "" && color !== "" && startDate !== "" && endDate !== ""){
    //   clearFileds();
    // }
    else {
      // clearFileds();
    }
  };


  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="CREATE AN INCIDENTS" />
      <div className={classes.content}>
        <Form.Form onSubmit={submitHandler}>
          <Form.Row>
            <FormLabel bold primary="DESIGNATION* :" />
            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth}
              placeholder="Name of incident"
              onChange={nameChange}
              value={name}
            />
                {/* {nameError && (
                  <div className={classes.error}>Please enter name</div>
                )} */}
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="NAME OF COMPANY* :" />
            <Form.Row noMargin width="48%">
              <FormSelect
                placeholder="Nom de I'enterprise"
                name="comapnyId"
                style={GLOBALS.Styles.inputWidth}
                onChange={nameChange}
                // value={formik.values.color}
                values={dropdownCompanies}
              />
              <span
                style={{
                  textAlign: "center",
                  marginRight: "50px",
                  marginTop: "10px",
                }}
              >
                General Contractor name
              </span>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="DATE AND TIME : " />
            <Form.Row noMargin width="48%">
              <FormInput
                type="date"
                style={GLOBALS.Styles.inputWidth}
                placeholder="Date"
                name="date" 
                onChange={nameChange}
                // error={formik.errors.contractStartDate}
              />
              <FormInput
                placeholder="TIME"
                type="time"
                name="time"
                style={GLOBALS.Styles.inputWidth}
                onChange={nameChange}
                // value={formik.values.color}
                // error={formik.errors.color}
               
              />
            </Form.Row> 
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="LOCATION : " />
            <Form.Row noMargin width="48%"> 
              <FormSelect
                placeholder="Type of location" //working
                name="color"
                style={GLOBALS.Styles.inputWidth}
                 onChange={locationTypeChange}
                // value={formik.values.color}
                // error={formik.errors.color}
                values={dropdownLocationType}
              />
              <FormSelect
                placeholder="LOCATION"
                name="location"
                style={GLOBALS.Styles.inputWidth}
                // onChange={formik.handleChange}
                // value={formik.values.color}
                // error={formik.errors.color}
                values={[
                  { value: "green", label: "Green" },
                  { value: "Yellow", label: "Yellow" },
                  { value: "Red", label: "Red" },
                  { value: "Blue", label: "Blue" },
                  { value: "Orange", label: "Orange" },
                  { value: "Purple", label: "Purple" },
                  { value: "Magenta", label: "Magenta" },
                ]}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="DESCRIPTION : " />
            <FormInput
              textArea
              rows={3}
              style={GLOBALS.Styles.inputWidth}
                onChange={nameChange}
              placeholder="Information complementaires"
              name="additionalInfo"
              // value={formik.values.additionalInfo}
              // error={formik.errors.additionalInfo}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="ADD PICTURES : " />
            <Form.Row noMargin width="48%">
              {/* <FormMultipleUpload
                name="logo"
                style={GLOBALS.Styles.inputWidth}
                error={formik.errors.logo}
                values={formik.values.logo}
                onChange={(values) =>
                  formik.handleChange({
                    target: {
                      type: "text",
                      name: "logo",
                      value: values,
                    },
                  }
                  )
                }
              /> */}
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="BILLABLE* : " />
            <FormSelect
              placeholder="Select"
              name="color"
              style={GLOBALS.Styles.inputWidth}
              // onChange={formik.handleChange}
              // value={formik.values.color}
              // error={formik.errors.color}
              values={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="AMOUNT :" />
            <Form.Row width="48%" noMargin alignItems="center">
              <Form.Row width="24%" noMargin alignItems="center">
                <FormInput
                  type="number"
                  name="penaltyforLateDelivery"
                  // error={penaltyforLateDelivery}
                />
                <SmallText style={{ marginLeft: 10 }} primary="€" />
              </Form.Row>
            </Form.Row>
          </Form.Row>

          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="COMMENT ON INVOICE : " />
            <FormInput
              textArea
              rows={3}
              style={GLOBALS.Styles.inputWidth}
              // onChange={formik.handleChange}
              placeholder="Ajouter un commentaire"
              name="additionalInfo"
              // value={formik.values.additionalInfo}
              // error={formik.errors.additionalInfo}
            />
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDER"
              fullWidth={false}
              // loading={formik.isSubmitting}
              // disabled={formik.isSubmitting}
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
