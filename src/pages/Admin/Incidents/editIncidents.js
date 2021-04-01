import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import SmallText from "../../../components/SmallText";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import RadioButton from "../../../components/RadioButton";
import { TimePicker } from "antd";

import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";
import moment from "moment";

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

export default function AddIncidents(props) {
  const classes = useStyles();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [name, setName] = useState("");
  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [dropdownLocationType, setDropdownLocationType] = useState([]);
  const [dropdownLocation, setDropdownLocation] = useState([]);

  const [selectedLocationType, setselectedLocationType] = useState("");

  const [companyId, setCompanyId] = useState("");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");

  const [isBillable, setIsBillable] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");

  const [comment, setComment] = useState("");
  const [image, setImage] = useState([]);

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

    console.log(response);

    if (response.success) {
      if (response.data.site_companies) {
        const temp = [];
        response.data.site_companies.map((item, index) => {
          return temp.push({
            label: item.companyId.name,
            value: item.companyId._id,
          });
        });
        setDropdownCompanies(temp);
      }

      if (response.data.locationTypes) {
        const temp = [];
        response.data.locationTypes.map((item, index) => {
          return temp.push({ label: item, value: item });
        });
        setDropdownLocationType(temp);
      }
    }
    await setValues();
  };

  const setValues = () => {
    const incident = props?.location?.data;
    setName(incident.name);
    setCompanyId(incident?.companyId?._id); //working
    setDate(incident?.date);
    //setTime(incident?.time); // moment(item.date).format("MM/DD/yyyy"): ' '

    // setTime(moment(incident?.time).format("HH:mm:ss"));
    // console.log(moment(incident?.time).format("HH:mm:ss"));
    setIsBillable(incident?.isBillable);
    setPrice(incident?.price);
    setType(incident?.type);
    setStatus(incident?.status);
    setDescription(incident?.description);
    console.log(props.location?.data);

    // setType(contactInfo.type);
    // setEmail(contactInfo.email);
    // setPhone(contactInfo.phone);
    // setFirstName(contactInfo.firstName);
    // setLastName(contactInfo.lastName);
    // setImage([{ key: 0, file: undefined, uri: contactInfo.image }]);

    // // setImage(fileClone);

    // setCompany(contactInfo.company);
    // setRole(contactInfo.role);
  };

  const onFormSubmit = async () => {
    // const notificationTo = values.notificationTo.map((item) => item.label);

    var formdata = new FormData();
    // formdata.append("photos", values.logo[0].file);
    formdata.append("name", name);
    formdata.append("date", date);
    formdata.append("time", time);
    formdata.append("status", status);
    formdata.append("description", description);
    formdata.append("isBillable", isBillable);
    formdata.append("price", price);
    formdata.append("type", type);
    formdata.append("comment", comment);
    // formdata.append(
    //   "location",
    //   JSON.stringify({ deliveryArea: "600952a9df49e51b42fab57b" }),
    // );
    // formdata.append("type", );
    formdata.append("companyId", companyId);
    formdata.append("siteId", adminStore.site.siteId._id);
    console.log(store.token);
    await GLOBALS.API({
      method: "PUT",
      uri:
        GLOBALS.Constants.POST_ADD_SITE_INCIDENTS +
        "/" +
        props.location.data._id,
      headers: {
        Authorization: store.token,
      },
      body: formdata,
    });

    props.history.push("/incidents");
  };
  const nameChange = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
      if (e.target.name === "" || name === null) {
      } else {
      }
    }
    if (e.target.name === "comapnyId") {
      setCompanyId(e.target.value);
      if (e.target.value === "" || e.target.value === null) {
      } else {
      }
    }
    if (e.target.name === "date") {
      setDate(e.target.value);
      // console.log(date)
      if (e.target.value === "" || e.target.value === null) {
      } else {
      }
    }
    if (e.target.name === "time") {
      setTime(e.target.value);
      if (e.target.value === "" || e.target.value === null) {
      } else {
      }
    }
    if (e.target.name === "location") {
      // setTime(e.target.value);
      const locationObject = {};
      locationObject[0] = selectedLocationType;

      locationObject[1] = e.target.value;

      if (e.target.value === "" || e.target.value === null) {
      } else {
      }
    }
    if (e.target.name === "description") {
      setDescription(e.target.value);
    }
    if (e.target.name === "isBillable") {
      setIsBillable(e.target.value);
    }
    if (e.target.name === "price") {
      setPrice(e.target.value);
    }
    if (e.target.name === "comment") {
      setComment(e.target.value);
    }
    if (e.target.name === "profile") {
      setImage(e.target.value);
    }
    if (e.target.name === "type") {
      setType(e.target.value);
    }
    if (e.target.name === "status") {
      setType(e.target.status);
    }
  };

  const fetchLocationDataOnTypeChange = async () => {
    if (selectedLocationType === "STORAGEAREA") {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_STORAGE_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        const storageValue = [
          {
            label: response.data.name,
            value: response.data._id,
          },
        ];

        setDropdownLocation(storageValue);
      }
      console.log(response);
    }
    if (selectedLocationType === "DELIVERYAREA") {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_DELIVERY_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        if (response.data) {
          const temp = [];
          response.data.map((item, index) => {
            return temp.push({ label: item.name, value: item._id });
          });
          setDropdownLocation(temp);
        }
      }
      console.log(response);
    }
  };
  const locationTypeChange = (e) => {
    setselectedLocationType(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (name === "" || name === null) {
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
      // submitIncident()
    }
    onFormSubmit();
  };
  const timeChange = (e) => {
    // setTime(e?._d);
    setTime(moment(e?._d).format("HH:mm:ss"));
    // moment(incident.time).format("HH:mm:ss");
    // console.log(moment(e?._d).format("HH:mm:ss"));
  };
  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="EDIT AN INCIDENTS" />
      <div className={classes.content}>
        <Form.Form onSubmit={submitHandler}>
          <Form.Row>
            <FormLabel bold primary="GENERAL :" />
            <Form.Row noMargin width="48%">
              <FormSelect
                name="type"
                id="bill"
                style={{ width: "40%", height: "45px", color: "#8B8989" }}
                //  onChange={(e) => {
                //    seIsBillable(e.target.value);
                //    console.log("billable is", isBillable);
                //    isBillable === "No" && console.log("value");
                //  }}
                onChange={nameChange}
                value={type}
                values={[
                  { value: "INCIDENT", label: "Incident" },
                  { value: "MEAN", label: "Mean" },
                  { value: "DELAY", label: "Delay" },
                  { value: "UNEXPRECTED", label: "Unexp" },
                ]}
              />
              <RadioButton
                onChange={nameChange}
                name="status"
                style={GLOBALS.Styles.inputWidth}
                value={status}
                items={[
                  { value: "open", label: "Ouvert" },
                  { value: "close", label: "Ferme" },
                ]}
              ></RadioButton>
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary="DESIGNATION* :" />
            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth}
              placeholder="Name of incident"
              onChange={nameChange}
              value={name}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="NAME OF COMPANY* :" />
            <Form.Row noMargin width="48%">
              <FormSelect
                placeholder="Nom de I'enterprise"
                name="comapnyId"
                style={GLOBALS.Styles.inputWidth}
                onChange={nameChange}
                value={companyId}
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
                value={date}
              />

              {/* <FormInput
                placeholder="TIME"
                type="time"
                name="time"
                style={GLOBALS.Styles.inputWidth}
                onChange={nameChange}
                value={time}
              /> */}
              <TimePicker
                name="time"
                placeholder="Time"
                style={{ width: "48%", height: "45px", color: "#8B8989" }}
                onChange={timeChange}
                value={time}
                //  value={time}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="LOCATION : " />
            <Form.Row noMargin width="48%">
              <FormSelect
                placeholder="Type of location"
                name="locationType"
                style={GLOBALS.Styles.inputWidth}
                onChange={locationTypeChange}
                values={dropdownLocationType}
              />
              <FormSelect
                placeholder="LOCATION"
                name="location"
                style={GLOBALS.Styles.inputWidth}
                onChange={nameChange}
                value=""
                values={dropdownLocation}
                disabled={!selectedLocationType}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="DESCRIPTION : " />
            <FormInput
              textArea
              rows={3}
              value={description}
              style={GLOBALS.Styles.inputWidth}
              onChange={nameChange}
              placeholder="Information complementaires"
              name="description"
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="ADD PICTURES : " />
            <Form.Row noMargin width="48%">
              <FormMultipleUpload
                name="profile"
                values={image}
                style={GLOBALS.Styles.inputWidth}
                onChange={nameChange}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="BILLABLE* : " />
            <Form.Row width="48%">
              <FormSelect
                name="comapnyId"
                style={{ width: "40%", height: "45px", color: "#8B8989" }}
                onChange={(e) => {
                  setIsBillable(e.target.value);
                  if (isBillable === false) setPrice(0);
                }}
                value={isBillable}
                values={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
              />
              {/* 
              <select
                name="bill"
                id="bill"
                // value={isBillable}
                style={{ width: "40%", height: "45px", color: "#8B8989" }}
                onChange={(e) => {
                  setIsBillable(e.target.value);
                  if (isBillable === false) setPrice(0);
                }}
              ></select> */}
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="AMOUNT :" />
            <Form.Row width="48%" noMargin alignItems="center">
              <Form.Row width="24%" noMargin alignItems="center">
                <FormInput
                  type="number"
                  name="price"
                  onChange={nameChange}
                  value={price}
                  disabled={isBillable === "No"}
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
              onChange={nameChange}
              value={comment}
              placeholder="Ajouter un commentaire"
              name="comment"
            />
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDER"
              fullWidth={false}
              disabled={!name || !date || !dropdownCompanies || !isBillable}
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
