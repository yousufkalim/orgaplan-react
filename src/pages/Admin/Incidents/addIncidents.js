import React, { useState, useEffect } from "react";
import { TimePicker } from "antd";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

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

export default function AddIncidents(props) {
  const classes = useStyles();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [dropdownLocation, setDropdownLocation] = useState([]);
  const [selectedLocationType, setselectedLocationType] = useState("");
  const [location, setLocation] = useState("");

  const [companyId, setCompanyId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isBillable, seIsBillable] = useState(false);
  const [price, setPrice] = useState("0");
  const [priceDisable, setPriceDisable] = useState("");

  const [type, setType] = useState("");

  const [comment, setComment] = useState("");
  const [image, setImage] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [generalContractor, setGeneralContractor] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    fetchLocationDataOnTypeChange();
    // eslint-disable-next-line
  }, [selectedLocationType]);

  const fetchData = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_SITE_INCIDENT}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.data.site_companies) {
        setCompanies(response.data.site_companies);
        const temp = [];
        response.data.site_companies.map((item) =>
          temp.push({
            label: item.companyId.name,
            value: item.companyId._id,
          }),
        );
        setDropdownCompanies(temp);
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const nameChange = (e) => {
    if (e.target.name === "name") setName(e.target.value);
    if (e.target.name === "comapnyId") {
      setCompanyId(e.target.value);
      if (e.target.value) {
        companies.map((com) => {
          let subc = com.subContractors.find(
            (sub) => sub._id === e.target.value,
          );
          if (subc) {
            setGeneralContractor(subc.name);
          }
          return true;
        });
      }
    }
    if (e.target.name === "date") setDate(e.target.value);
    if (e.target.name === "time") setTime(e.target.value);
    if (e.target.name === "location") {
      const locationObject = {
        [selectedLocationType]: e.target.value,
      };
      setLocation(locationObject);
    }
    if (e.target.name === "description") setDescription(e.target.value);
    if (e.target.name === "seIsBillable") {
      if (e.target.value === "true") {
        seIsBillable(true);
      } else if (e.target.value === "false") {
        seIsBillable(false);
      }
    }
    if (e.target.name === "price") setPrice(e.target.value);
    if (e.target.name === "comment") setComment(e.target.value);
    if (e.target.name === "profile") setImage(e.target.value);
    if (e.target.name === "type") setType(e.target.value);
  };
  const handleChange = (name, value) => {
    if (name === "image") setImage(value);
  };
  const fetchLocationDataOnTypeChange = async () => {
    if (selectedLocationType === "storageArea") {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_STORAGE_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        if (response.data) {
          const storageValue = [
            {
              label: response.data.name,
              value: response.data._id,
            },
          ];
          setDropdownLocation(storageValue);
        }
      }
    }
    if (selectedLocationType === "deliveryArea") {
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
    }
  };
  const locationTypeChange = (e) => {
    setselectedLocationType(e.target.value);
  };
  const timeChange = (e) => {
    setTime(e?._d);
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    let locationType = {};
    var formdata = new FormData();
    formdata.append("name", name);
    formdata.append("date", date);
    formdata.append("time", time);
    formdata.append("type", type);
    formdata.append("description", description);
    formdata.append("isBillable", isBillable);
    formdata.append("price", price);
    formdata.append("location", JSON.stringify(location));
    formdata.append("comment", comment);
    formdata.append("companyId", companyId);
    formdata.append("siteId", adminStore.site.siteId._id);
    await GLOBALS.API({
      method: "POST",
      uri: GLOBALS.Constants.POST_ADD_SITE_INCIDENTS,
      headers: {
        Authorization: store.token,
      },
      body: formdata,
    });

    props.history.push("/incidents");
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
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="NAME OF COMPANY* :" />
            <Form.Row
              noMargin
              width="48%"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormSelect
                name="comapnyId"
                onChange={nameChange}
                values={dropdownCompanies}
                placeholder="Nom de I'enterprise"
                style={GLOBALS.Styles.inputWidth}
              />
              <SmallText
                primary={generalContractor}
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="DATE AND TIME* : " />
            <Form.Row noMargin width="48%">
              <FormInput
                type="date"
                style={GLOBALS.Styles.inputWidth}
                placeholder="Date"
                name="date"
                onChange={nameChange}
                value={date}
              />
              <TimePicker
                name="time"
                format="HH:mm"
                style={{ width: "48%", height: "45px", color: "#8B8989" }}
                onChange={timeChange}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="GENERAL*: " />
            <Form.Row width="48%">
              <FormSelect
                name="type"
                id="bill"
                placeholder="Type of Incident"
                style={{ width: "40%", height: "45px", color: "#8B8989" }}
                onChange={nameChange}
                value={type}
                values={[
                  { value: "INCIDENT", label: "Incident" },
                  { value: "MEAN", label: "Mean" },
                  { value: "DELAY", label: "Delay" },
                  { value: "UNEXPRECTED", label: "Unexpected delivery" },
                ]}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="LOCATION : " />
            <Form.Row noMargin width="48%">
              <FormSelect
                placeholder="Type of location"
                name="locationType"
                style={GLOBALS.Styles.inputWidth} //working
                onChange={locationTypeChange}
                values={[
                  { value: "storageArea", label: "Storage Area" },
                  { value: "deliveryArea", label: "Delivery Area" },
                ]}
              />
              <FormSelect
                placeholder="LOCATION"
                name="location"
                style={GLOBALS.Styles.inputWidth}
                onChange={nameChange}
                values={dropdownLocation}
                disabled={!selectedLocationType}
              />
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary="DESCRIPTION : " />
            <FormInput
              textArea
              rows={5}
              maxLength="300"
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
                onChange={(values) => {
                  handleChange("image", values);
                }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="BILLABLE* : " />
            <Form.Row width="48%">
              <select
                name="bill"
                id="bill"
                style={{ width: "40%", height: "45px", color: "#8B8989" }}
                onChange={(e) => {
                  setPriceDisable(e.target.value);
                  if (e.target.value === "false") {
                    setPrice("0");
                  }
                  return nameChange;
                }}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="AMOUNT :" />
            <Form.Row width="48%" noMargin alignItems="center">
              <Form.Row width="24%" noMargin alignItems="center">
                <FormInput
                  type="number"
                  name="price"
                  value={price}
                  onChange={nameChange}
                  disabled={priceDisable === "false"}
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
              name="comment"
              maxLength="300"
              onChange={nameChange}
              style={GLOBALS.Styles.inputWidth}
              placeholder="Ajouter un commentaire"
            />
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDER"
              fullWidth={false}
              disabled={
                !name ||
                !date ||
                !dropdownCompanies ||
                (isBillable === "true" && !price) ||
                !type
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
