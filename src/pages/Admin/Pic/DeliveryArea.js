import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Chip from "@material-ui/core/Chip";
import _ from "lodash";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";
import { TEXTS } from "../../../assets/languages/french";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import SmallText from "../../../components/SmallText";
import FormLabel from "../../../components/FormLabel";
import FormInput from "../../../components/FormInput";
import ColorPicker from "../../../components/ColorPcker";
import MultiAdderInput from "../../../components/MultiAdderInput";
import UnavailabilityTimes from "../../../components/UnavailabilityTimes";
import DeliveryAreaAddressModal from "../../../components/DeliveryAreaAddressModal";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
  chip: {
    color: theme.palette.primary.contrastText,
    marginRight: theme.spacing(1),
  },
}));

export default function DeliveryArea(props) {
  const {
    NAME,
    VALIDATE,
    AVAILABILITIES,
    Enter_site_addresses,
    Vehicles,
    Days_before_end_of_the_contract,
    NOTIFY_THE_ADDRESSES,
    Please_enter_email,
    START_DATE,
    END_DATE,
    UNAVAILABILITIES,
    ACCESSIBILITY_ADDRESSES,
    Enter_vehicles,
    MEANS_ALLOWED,
    Please_enter_valid_email,
  } = TEXTS;

  const { setSelectedShape } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [color, setColor] = useState("#d71313");
  const [startDate, setStartDate] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [unavailabilityDates, setUnavailabilityDates] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [update, setUpdate] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [notificationPriorToDays, setNotificationPriorToDays] = useState("0");
  const [notificationTo, setNotificationTo] = useState([]);
  const [ismodalFilled, setIsmodalFilled] = useState(false);
  const [means, setMeans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      if (props.selectedShape) {
        const means = await GLOBALS.API({
          uri: `${GLOBALS.Constants.GET_DELIVERY_AREA_MEANS}/${props.selectedShape.deliveryArea._id}`,
          token: store.token,
        });
        setMeans(means.data.map((item) => item.name));

        const addressAr = props.selectedShape.deliveryArea.addresses.map(
          (address) => ({
            _id: address._id,
            image: [{ key: address._id, uri: address.pdf }],
            endDate: address.endDate,
            location: address.location,
            startDate: address.startDate,
            label: address.label,
          }),
        );
        const vehiclesAr = props.selectedShape.deliveryArea.vehicles.map(
          (vehi, ind) => ({ key: ind, label: vehi }),
        );
        setName(props.selectedShape.deliveryArea.name);
        setColor(props.selectedShape.deliveryArea.color);
        setStartDate(props.selectedShape.deliveryArea.availability.start);
        setEndDate(props.selectedShape.deliveryArea.availability.end || "");
        setAddresses(addressAr);
        setUnavailabilityDates(
          props.selectedShape.deliveryArea.unavailabilityDates?.map(
            (key, index) => {
              delete key._id;
              return key;
            },
          ),
        );
        setVehicles(vehiclesAr);
        setNotificationPriorToDays(
          props.selectedShape.deliveryArea.notificationPriorToDays,
        );
        setNotificationTo(props.selectedShape.deliveryArea.notificationTo);
        setUpdate((st) => !st);
      } else {
        setEndDate(moment(adminStore.site.siteId.end).format("YYYY-MM-DD"));
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const handleFormFilling = () => {
    setIsmodalFilled(true);
  };

  function handleChange(name, value) {
    if (name === "name") {
      if (!GLOBALS.Functions.empty(value)) {
        setName(value);
        setErrors({ ...errors, name: "" });
      } else if (GLOBALS.Functions.empty(value)) {
        setErrors({ ...errors, name: "Name is required" });
        setName("");
      }
    } else if (name === "color") setColor(value);
    else if (name === "startDate") {
      if (value && value.length > 1) {
        setStartDate(value);
        setErrors({ ...errors, startDate: "" });
      } else if ((value && value.length < 1) || value === null) {
        setStartDate("");
        setErrors({ ...errors, startDate: "Please enter starting date" });
      }
    } else if (name === "endDate") setEndDate(value);
    else if (name === "addresses") {
      setUpdate((st) => !st);
      setAddresses(value);
    } else if (name === "unavailabilityDates") {
      setUpdate((st) => !st);
      setUnavailabilityDates(value);
    } else if (name === "vehicles") setVehicles(value);
    else if (name === "notificationPriorToDays")
      setNotificationPriorToDays(value);
    else if (name === "notificationTo") {
      setUpdate((st) => !st);
      setNotificationTo(value);
    }
  }
  function validation(name, value) {
    if (name === "name") {
      if (GLOBALS.Functions.empty(value)) {
        setErrors({ ...errors, name: "Name is required" });
      } else setErrors({ ...errors, name: "" });
    }
    if (!handleFormFilling) {
      if (GLOBALS.Functions.empty(value)) {
        setErrors({ ...errors, addresses: "Address Info is required" });
      } else setErrors({ ...errors, addresses: "" });
    }
  }

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const addressesAr = addresses.map((item) => ({
        location: [0, 0],
        endDate: item.endDate,
        startDate: item.startDate,
        pdf: item.image[0].uri,
        label: item.label,
      }));
      const notificationToAr = notificationTo.map((item) => item.label);
      const vehiclesAr = vehicles.map((item) => item.label);

      const formdata = JSON.stringify({
        name,
        addresses: addressesAr,
        unavailabilityDates,
        color: color,
        availability: {
          start: startDate,
          end: endDate,
        },
        siteId: adminStore.site.siteId._id,
        vehicles: vehiclesAr,
        notificationPriorToDays,
        notificationTo: notificationToAr,
      });

      const response = await GLOBALS.API({
        method: props.selectedShape ? "PUT" : "POST",
        uri: props.selectedShape
          ? `${GLOBALS.Constants.CREATE_DELIVERY_AREA}/${props.selectedShape._id}`
          : GLOBALS.Constants.CREATE_DELIVERY_AREA,
        token: store.token,
        body: formdata,
      });

      let propShapes = _.cloneDeep(props.shapes);
      let propShape = props.shape
        ? _.cloneDeep(props.shape)
        : _.cloneDeep(props.selectedShape);
      let inde = propShapes.findIndex((item) => item._id === propShape._id);
      propShapes[inde].color = color;
      propShapes[inde].deliveryArea = response.data;
      propShapes[inde]._id = response.data._id;
      propShapes[inde].name = name;
      propShape._id = response.data._id;
      propShape.name = response.data.name;

      propShape.color = response.data.color;
      propShape.deliveryArea = response.data;

      if (!props.selectedShape) {
        await GLOBALS.API({
          method: "POST",
          uri: GLOBALS.Constants.ADMIN_PIC_SHAPE,
          token: store.token,
          body: JSON.stringify({
            picId: props.pic._id,
            deliveryArea: response.data._id,
            ...propShape,
          }),
        });
      }

      setLoading(false);
      props.setShapes(propShapes, propShape);
      setSelectedShape("");
      props.setSelectedShape("");
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
    <div className={classes.content}>
      <Form.Form onSubmit={onSubmit}>
        <Form.Row>
          <FormLabel bold primary={`${NAME}* : `} />
          <Form.Row noMargin width="65%">
            <FormInput
              name="name"
              error={errors.name}
              value={name}
              placeholder={NAME}
              onBlur={({ target: { name, value } }) => validation(name, value)}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
            <div style={GLOBALS.Styles.inputWidth}>
              <ColorPicker
                color={color}
                handleChange={(color) => handleChange("color", color.hex)}
              />
            </div>
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary={`${AVAILABILITIES}* :`} />
          <Form.Row noMargin width="65%">
            <FormInput
              type="date"
              error={errors.startDate}
              name="startDate"
              value={startDate}
              placeholder={START_DATE}
              min={
                moment().isAfter(moment(adminStore.site.siteId.start), "day")
                  ? moment().format("YYYY-MM-DD")
                  : moment(adminStore.site.siteId.start).format("YYYY-MM-DD")
              }
              max={moment(adminStore.site.siteId.end).format("YYYY-MM-DD")}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
            <FormInput
              type="date"
              name="endDate"
              disabled={!startDate}
              placeholder={END_DATE}
              min={moment(startDate).add(1, "days").format("YYYY-MM-DD")}
              max={moment(adminStore.site.siteId.end)
                .add(1, "days")
                .format("YYYY-MM-DD")}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              value={endDate}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary={`${UNAVAILABILITIES}: `} />

          <Form.Row noMargin width="65%">
            <UnavailabilityTimes
              name="unavailabilityDates"
              values={unavailabilityDates}
              style={GLOBALS.Styles.inputWidth}
              unavailabilityDates={unavailabilityDates}
              setUnavailabilityDates={setUnavailabilityDates}
              startRange={startDate}
              endRange={moment(endDate).add(1, "days")}
              onChange={(values) => handleChange("unavailabilityDates", values)}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary={`${ACCESSIBILITY_ADDRESSES} :`} />

          <Form.Row noMargin width="65%">
            <DeliveryAreaAddressModal
              max={endDate}
              min={startDate}
              handleFormFilling={handleFormFilling}
              error={errors.addresses}
              name="addresses"
              values={addresses}
              disabled={!startDate || !endDate || !addresses}
              style={GLOBALS.Styles.inputWidth}
              placeholder={Enter_site_addresses}
              onChange={(values) => handleChange("addresses", values)}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary={`${Vehicles}: `} />
          <Form.Row noMargin width="65%">
            <MultiAdderInput
              name="vehicles"
              values={vehicles}
              placeholder={Enter_vehicles}
              style={GLOBALS.Styles.inputWidth}
              onChange={(values) => handleChange("vehicles", values)}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary={`${MEANS_ALLOWED}:`} />

          <Form.Row noMargin width="65%" justifyContent="flex-start">
            {means.map((mean, index) => (
              <Chip key={index} label={mean} className={classes.chip} />
            ))}
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="Notification : " />
          <Form.Row
            noMargin
            width="65%"
            alignItems="center"
            justifyContent="flex-start"
          >
            <FormInput
              type="number"
              placeholder="0"
              textAlign="center"
              name="notificationPriorToDays"
              value={notificationPriorToDays}
              style={{ ...GLOBALS.Styles.inputWidth, maxWidth: 100 }}
              onChange={({ target: { name, value } }) =>
                value >= 0 && handleChange(name, value)
              }
            />
            <SmallText
              primary={Days_before_end_of_the_contract}
              style={{ marginLeft: "10px", marginBottom: 0 }}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary={`${NOTIFY_THE_ADDRESSES} : `} />
          <Form.Row noMargin width="65%">
            <MultiAdderInput
              name="notificationTo"
              values={notificationTo}
              style={{ width: "100%" }}
              validateError={Please_enter_valid_email}
              placeholder={Please_enter_email}
              onChange={(values) => handleChange("notificationTo", values)}
              validate={(text) => {
                const re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/;
                return !re.test(String(text).toLowerCase());
              }}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text={VALIDATE}
              fullWidth={false}
              disabled={
                loading || !name || !color || !startDate || addresses.length < 1
              }
            />
          </Form.ButtonContainer>
        </Form.Row>
      </Form.Form>
      {update && ""}
    </div>
  );
}
