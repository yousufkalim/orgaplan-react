import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import SmallText from "../../../components/SmallText";
import FormLabel from "../../../components/FormLabel";
import FormInput from "../../../components/FormInput";
import ColorPicker from "../../../components/ColorPcker";
import FormMultiSelect from "../../../components/FormMultiSelect";
import MultiAdderInput from "../../../components/MultiAdderInput";
import DeliveryAreaAddressModal from "../../../components/DeliveryAreaAddressModal";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

export default function DeliveryArea(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [unavailabilities, setUnavailabilities] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [update, setUpdate] = useState(false);
  const [selectedMeans, setSelectedMeans] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [notificationPriorToDays, setNotificationPriorToDays] = useState("0");
  const [notificationTo, setNotificationTo] = useState([]);

  const [means, setMeans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const means = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITE_MEANS}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      const meansTempArray = [];
      means.data.map((item) =>
        meansTempArray.push({
          value: item._id,
          label: item.name,
        }),
      );

      setMeans(meansTempArray);
      if (props.selectedShape) {
        setName(props.selectedShape.deliveryArea.name);
        setColor(props.selectedShape.color);
        setStartDate(props.selectedShape.deliveryArea.availability.start);
        setEndDate(props.selectedShape.deliveryArea.availability.end);
        setAddresses(props.selectedShape.deliveryArea.addresses);
        setUnavailabilities(props.selectedShape.deliveryArea.unavailability);
        setSelectedMeans(props.selectedShape.deliveryArea.means);
        setVehicles(props.selectedShape.deliveryArea.vehicles);
        setNotificationPriorToDays(
          props.selectedShape.deliveryArea.notificationPriorToDays,
        );
        setNotificationTo(props.selectedShape.deliveryArea.notificationTo);
        setUpdate((st) => !st);
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function handleChange(name, value) {
    if (name === "name") setName(value);
    else if (name === "color") setColor(value);
    else if (name === "startDate") setStartDate(value);
    else if (name === "endDate") setEndDate(value);
    else if (name === "addresses") {
      setUpdate((st) => !st);
      setAddresses(value);
    } else if (name === "unavailabilities") {
      setUpdate((st) => !st);
      setUnavailabilities(value);
    } else if (name === "means") setSelectedMeans(value);
    else if (name === "vehicles") setVehicles(value);
    else if (name === "notificationPriorToDays")
      setNotificationPriorToDays(value);
    else if (name === "notificationTo") {
      setUpdate((st) => !st);
      setNotificationTo(value);
    }
  }

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      console.log("address", addresses);

      const addressesAr = addresses.map((item) => ({
        location: [0, 0],
        endDate: item.endDate,
        startDate: item.startDate,
        pdf: item.image,
      }));
      const notificationToAr = notificationTo.map((item) => item.label);

      const formdata = JSON.stringify({
        name,
        addresses: addressesAr,
        unavailabilities,
        color: props.shape.color,
        availability: {
          start: startDate,
          end: endDate,
        },
        siteId: adminStore.site.siteId._id,
        means: selectedMeans,
        vehicles: vehicles,
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

      let propShapes = props.shapes;
      let propShape = props.shape;
      let inde = propShapes.findIndex((item) => item._id === propShape._id);
      propShapes[inde].deliveryArea = response.data;
      propShapes[inde]._id = response.data._id;
      propShapes[inde].name = name;
      propShape._id = response.data._id;
      propShape.name = response.data.name;
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
          <FormLabel bold primary="Name : " />
          <Form.Row noMargin width="65%">
            <FormInput
              name="name"
              value={name}
              placeholder="Name"
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
          <FormLabel bold primary="AVAILABILITY :" />
          <Form.Row noMargin width="65%">
            <FormInput
              type="date"
              name="startDate"
              value={startDate}
              placeholder={`Date de début`}
              min={moment(adminStore.site.siteId.start).format("YYYY-MM-DD")}
              max={moment(adminStore.site.siteId.end).format("YYYY-MM-DD")}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
            <FormInput
              type="date"
              name="endDate"
              placeholder="Date de fin"
              min={moment(startDate).add(1, "days").format("YYYY-MM-DD")}
              max={moment(adminStore.site.siteId.end).format("YYYY-MM-DD")}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              value={endDate}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="ACCESSIBILITY ADDRESSES :" />
          <Form.Row noMargin width="65%">
            <DeliveryAreaAddressModal
              max={endDate}
              min={startDate}
              name="addresses"
              values={addresses}
              // error={addresses}
              disabled={!startDate || !endDate}
              style={GLOBALS.Styles.inputWidth}
              placeholder="Enter site addresses"
              onChange={(values) => handleChange("addresses", values)}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="Means: " />
          <Form.Row noMargin width="65%">
            <FormMultiSelect
              name="means"
              values={means}
              placeholder="Means"
              value={selectedMeans}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="INDISPONIBILITES: " />
          <Form.Row noMargin width="65%">
            <div
              style={{
                marginLeft: "0px",
                marginBottom: "7px",
                width: "320px",
                color: "#fff",
                padding: "0.8rem 0",
                borderRadius: "8px",
                textAlign: "center",
                backgroundColor: "#140772",
              }}
            >
              SHOW UNAVAILABILITIES
            </div>
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="Vehicles: " />
          <Form.Row noMargin width="65%">
            <MultiAdderInput
              name="vehicles"
              values={vehicles}
              placeholder="Enter vehicles"
              style={GLOBALS.Styles.inputWidth}
              onChange={(values) => handleChange("vehicles", values)}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="NOTIFICATION : " />
          <Form.Row
            noMargin
            width="65%"
            alignItems="center"
            justifyContent="flex-start"
          >
            <FormInput
              type="number"
              placeholder="0"
              name="notificationPriorToDays"
              value={notificationPriorToDays}
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
        <Form.Row>
          <FormLabel bold primary="NOTIFY THE ADDRESSES : " />
          <Form.Row noMargin width="65%">
            <MultiAdderInput
              name="notificationTo"
              values={notificationTo}
              style={{ width: "100%" }}
              validateError="Invalid Email"
              placeholder="Enter email address"
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
              text="VALIDATE"
              fullWidth={false}
              disabled={loading || !name || !color || !startDate}
            />
          </Form.ButtonContainer>
        </Form.Row>
      </Form.Form>
      {update && ""}
    </div>
  );
}
