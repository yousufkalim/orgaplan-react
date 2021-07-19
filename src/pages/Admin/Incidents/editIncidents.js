import React, { useState, useEffect } from "react";
import { TimePicker } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";
import { TEXTS } from "../../../assets/languages/french";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import SmallText from "../../../components/SmallText";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import RadioButton from "../../../components/RadioButton";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { useHistory } from "react-router-dom";
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

export default function AddIncidents(props) {
  const {
    YES,
    NO,
    OPEN,
    CLOSE,
    Please_select_a_incident,
    Please_select_a_company,
    EDIT_AN_INCIDENT,
    DESIGNATION,
    NAME_OF_INCIDENT,
    NAME_OF_COMPANY,
    DATE_AND_TIME,
    GENERAL,
    TYPE_OF_incident,
    LOCATION,
    TYPE_OF_PLACE,
    BILLABLE,
    PAID,
    AMOUNT,
    COMMENT_INVOICE,

    PLEASE_ENTER_NAME_OF_INCIDENT,
    PLEASE_ENTER_NAME_OF_COMPANY,
    Please_select_Date,
    PLEASE_SELECT_TYPE_OF_incident,
    INCIDENT,
    MEAN,
    DELAY,
    UNEXPECTED_DELIVERY,
    STORAGEAREA,
    DELIVERYAREA,
    ADDITIONNAL_INFORMATION,
    ADD_PHOTO,
    STATUS,
    ADD_COMMENT,
    VALIDATE,
  } = TEXTS;
  const classes = useStyles();
  const history = useHistory();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [dropdownLocation, setDropdownLocation] = useState([]);

  const [selectedLocationType, setselectedLocationType] = useState("");
  const [selectedLocation, setselectedLocation] = useState("");

  const [companyId, setCompanyId] = useState("");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");

  const [isBillable, setIsBillable] = useState(false);
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");

  const [comment, setComment] = useState("");
  const [image, setImage] = useState([]);
  const [priceDisable, setPriceDisable] = useState("true");
  const [companies, setCompanies] = useState([]);
  const [generalContractor, setGeneralContractor] = useState("");
  const [isPaid, setIsPaid] = useState("");
  const [location, setLocation] = useState("");

  const [nameError, setNameError] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [dateError, setDateError] = useState("");
  const [typeError, setTypeError] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [adminStore, history]);
  useEffect(() => {
    fetchLocationDataOnTypeChange();
    // eslint-disable-next-line
  }, [selectedLocationType]);
  useEffect(() => {
    if (companyId) {
      let comp = companies.find((com) => com.companyId._id === companyId);
      if (comp.parentCompanyId) setGeneralContractor(comp.parentCompanyId.name);
      else setGeneralContractor("");
    }
    // eslint-disable-next-line
  }, [companyId]);
  // console.log("mean data in edit", history.location.data);
  const fetchData = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_SITE_INCIDENT}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      if (response.data.site_companies) {
        setCompanies(response.data.site_companies);
        setDropdownCompanies(
          response.data.site_companies.map((item) => ({
            label: item.companyId.name,
            value: item.companyId._id,
          })),
        );
      }
      await setValues();
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const setValues = () => {
    const incident = history.location?.data;
    setName(incident.name);
    setCompanyId(incident?.companyId?._id);
    setDate(incident?.date);
    setIsBillable(incident?.isBillable);
    setPrice(incident?.price);
    setType(incident?.type);
    setStatus(incident?.status);
    setDescription(incident?.description);
    setIsPaid(incident.isPaid);
    setImage([{ key: 0, file: undefined, uri: incident.photos[0] }]);
    if (incident?.isBillable) {
      setPriceDisable("true");
    } else {
      setPriceDisable("false");
    }
    if (incident.location?.storageArea) {
      setselectedLocationType("storageArea");
      setselectedLocation(incident.location?.storageArea);
      const locationObject = {
        storageArea: incident.location?.storageArea,
      };
      setLocation(locationObject);
    } else if (incident.location?.deliveryArea) {
      setselectedLocationType("deliveryArea");

      setselectedLocation(incident.location?.deliveryArea);
      const locationObject = {
        deliveryArea: incident.location?.deliveryArea,
      };
      setLocation(locationObject);
    }
  };
  const handleChange = (name, value) => {
    if (name === "image") setImage(value);
  };
  const nameChange = (e) => {
    if (e.target.name === "name") setName(e.target.value);
    if (e.target.name === "date") {
      setDate(e.target.value);
    }
    if (e.target.name === "time") setTime(e.target.value);
    if (e.target.name === "description") setDescription(e.target.value);
    if (e.target.name === "isBillable") setIsBillable(e.target.value);
    if (e.target.name === "price") setPrice(e.target.value);
    if (e.target.name === "comment") setComment(e.target.value);
    if (e.target.name === "profile") setImage(e.target.value);
    if (e.target.name === "type") setType(e.target.value);
    if (e.target.name === "status") setStatus(e.target.value);
    if (e.target.name === "companyId") {
      setCompanyId(e.target.value);
    }
    if (e.target.name === "location") {
      setselectedLocation(e.target.value);
      const locationObject = {
        [selectedLocationType]: e.target.value,
      };
      setLocation(locationObject);
    }

    validation(e.target.name, e.target.value);
  };
  const fetchLocationDataOnTypeChange = async () => {
    try {
      if (selectedLocationType === "storageArea") {
        const response = await GLOBALS.API({
          uri: `${GLOBALS.Constants.GET_STORAGE_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
          token: store.token,
        });
        const storageValue = [
          {
            label: response.data.name,
            value: response.data._id,
          },
        ];

        setDropdownLocation(storageValue);
      }
      if (selectedLocationType === "deliveryArea") {
        const response = await GLOBALS.API({
          uri: `${GLOBALS.Constants.GET_DELIVERY_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
          token: store.token,
        });
        if (response.data) {
          setDropdownLocation(
            response.data.map((item) => ({
              label: item.name,
              value: item._id,
            })),
          );
        }
      }
    } catch (err) {}
  };

  const locationChange = (e) => {
    setselectedLocation(e.target.value);
    const locationObject = {
      [selectedLocationType]: e.target.value,
    };
    setLocation(locationObject);
  };
  const locationTypeChange = (e) => {
    setselectedLocationType(e.target.value);
  };
  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      var formdata = new FormData();
      formdata.append("name", name);
      formdata.append("date", date);
      formdata.append("time", time);
      formdata.append("status", status);
      formdata.append("description", description);
      formdata.append("isBillable", isBillable);
      formdata.append("price", price);
      formdata.append("type", type);
      formdata.append("comment", comment);
      formdata.append("companyId", companyId);
      formdata.append("isPaid", isPaid);
      formdata.append("location", JSON.stringify(location));

      if (image[0]?.file) formdata.append("photos", image[0].file);
      formdata.append("siteId", adminStore.site.siteId._id);
      // for (let [key, value] of formdata) {
      //   console.log(`formdata in add user ${key}: ${value}`);
      // }
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

      props.history.goBack();
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const timeChange = (e) => {
    setTime(moment(e?._d).format("HH:mm:ss"));
  };
  // console.log("selectedLocation", selectedLocation);
  // console.log("location", location);

  const validation = (name, value) => {
    if (name == "name") {
      if (!value) {
        setNameError(PLEASE_ENTER_NAME_OF_INCIDENT);
      } else {
        setNameError("");
      }
    } else if (name == "companyId") {
      if (!value) {
        setCompanyError(PLEASE_ENTER_NAME_OF_COMPANY);
      } else {
        setCompanyError("");
      }
    } else if (name == "date") {
      if (!value) {
        setDateError(Please_select_Date);
      } else {
        setDateError("");
      }
    } else if (name == "type") {
      if (!value) {
        setTypeError(PLEASE_SELECT_TYPE_OF_incident);
      } else {
        setTypeError("");
      }
    }
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary={EDIT_AN_INCIDENT} />

      <div className={classes.content}>
        <Form.Form onSubmit={submitHandler}>
          <Form.Row>
            <FormLabel bold primary={`${GENERAL} :`} />
            <Form.Row noMargin width="48%">
              <FormSelect
                name="type"
                id="bill"
                style={{ width: "40%", height: "45px", color: "#8B8989" }}
                onChange={nameChange}
                value={type}
                values={[
                  { value: "INCIDENT", label: INCIDENT },
                  { value: "MEAN", label: MEAN },
                  { value: "DELAY", label: DELAY },
                  { value: "UNEXPRECTED", label: UNEXPECTED_DELIVERY },
                ]}
              />
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary={`${DESIGNATION}* :`} />

            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth}
              placeholder={NAME_OF_INCIDENT}
              onChange={nameChange}
              value={name}
              onBlur={({ target: { name, value } }) => validation(name, value)}
              error={nameError}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${NAME_OF_COMPANY}* :`} />

            <Form.Row
              noMargin
              width="48%"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormSelect
                placeholder={NAME_OF_COMPANY}
                name="companyId"
                style={GLOBALS.Styles.inputWidth}
                onChange={nameChange}
                value={companyId}
                values={dropdownCompanies}
                error={companyError}
              />
              <SmallText
                primary={generalContractor}
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${DATE_AND_TIME}* : `} />

            <Form.Row noMargin width="48%">
              <FormInput
                type="date"
                style={GLOBALS.Styles.inputWidth}
                placeholder="Date"
                name="date"
                onChange={nameChange}
                value={date}
                error={dateError}
              />
              <TimePicker
                name="time"
                format="HH:mm"
                style={{ width: "48%", height: "45px", color: "#8B8989" }}
                onChange={timeChange}
                // value={time}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${LOCATION} : `} />

            <Form.Row noMargin width="48%">
              <FormSelect
                placeholder={TYPE_OF_PLACE}
                name="locationType"
                style={GLOBALS.Styles.inputWidth}
                disabled={history.location.data?.meanLocation ? true : false}
                onChange={locationTypeChange}
                value={selectedLocationType}
                values={[
                  { value: "storageArea", label: STORAGEAREA },
                  { value: "deliveryArea", label: DELIVERYAREA },
                ]}
              />
              <FormSelect
                placeholder={LOCATION}
                name="location"
                style={GLOBALS.Styles.inputWidth}
                onChange={locationChange}
                value={selectedLocation}
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
              placeholder={ADDITIONNAL_INFORMATION}
              name="description"
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${ADD_PHOTO} : `} />

            <Form.Row noMargin width="48%">
              <FormMultipleUpload
                name="profile"
                values={image}
                style={GLOBALS.Styles.inputWidth}
                onChange={(values) => {
                  handleChange("image", values);
                }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary={`${BILLABLE}* : `} />

            <Form.Row width="48%">
              <FormSelect
                key="1abc"
                name="companyId"
                style={{ width: "40%", height: "45px", color: "#8B8989" }}
                onChange={(e) => {
                  setPriceDisable(e.target.value);
                  if (e.target.value === "false") {
                    setPrice("0");
                    setIsBillable(false);
                  } else if (e.target.value === "true") {
                    setIsBillable(true);
                  }
                }}
                value={isBillable}
                values={[
                  { value: true, label: YES },
                  { value: false, label: NO },
                ]}
              />
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary={`${PAID}: `} />

            <Form.Row width="48%">
              <FormSelect
                disabled={priceDisable === "false" || priceDisable === false}
                name="paid"
                style={{ width: "40%", height: "45px", color: "#8B8989" }}
                onChange={(e) => {
                  if (e.target.value === "false") {
                    setIsPaid(false);
                  } else if (e.target.value === "true") {
                    setIsPaid(true);
                  }
                }}
                value={isPaid}
                values={[
                  { value: true, label: YES },
                  { value: false, label: NO },
                ]}
              />
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary={`${STATUS}: `} />

            <Form.Row width="48%" noMargin>
              <Form.Column noMargin>
                <RadioButton
                  name="status"
                  value={status}
                  // onChange={({ target: { name, value } }) =>
                  //   nameChange(name, value)
                  // }

                  onChange={nameChange}
                  items={[
                    {
                      value: "OPEN",
                      label: OPEN,
                    },
                    { value: "CLOSED", label: CLOSE },
                  ]}
                />
              </Form.Column>
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary={`${AMOUNT} :`} />

            <Form.Row width="48%" noMargin alignItems="center">
              <Form.Row width="24%" noMargin alignItems="center">
                <FormInput
                  type="number"
                  name="price"
                  onChange={nameChange}
                  value={price}
                  disabled={priceDisable === "false" || priceDisable === false}
                />
                <SmallText style={{ marginLeft: 10 }} primary="€" />
              </Form.Row>
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary={`${COMMENT_INVOICE} : `} />

            <FormInput
              textArea
              rows={3}
              style={GLOBALS.Styles.inputWidth}
              onChange={nameChange}
              value={comment}
              placeholder={ADD_COMMENT}
              name="comment"
            />
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text={VALIDATE}
              fullWidth={false}
              disabled={!name || !date || !dropdownCompanies}
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
