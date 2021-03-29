import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import SmallText from "../../../components/SmallText";
import FormLabel from "../../../components/FormLabel";
import ColorPicker from "../../../components/ColorPcker";
import FormInput from "../../../components/CustomFormInput";
import FormMultiSelect from "../../../components/FormMultiSelect";
import MultiAdderInput from "../../../components/MultiAdderInput";

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

  const [isFull, setIsFull] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDeliveryAreas, setSelectedDeliveryAreas] = useState([]);
  const [selectedMeans, setSelectedMeans] = useState([]);
  const [unavailabilities, setUnavailabilities] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [notificationPriorToDays, setNotificationPriorToDays] = useState("");
  const [notificationTo, setNotificationTo] = useState([]);

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [means, setMeans] = useState([]);
  const [companies, setCompanies] = useState([]);

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
      const companies = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_SITE_COMPANIES}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const deliveryAreas = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_DELIVERY_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      const meansTempArray = [];
      means.data.map((item) =>
        meansTempArray.push({
          value: item._id,
          label: item.name,
        }),
      );

      const companiesTempArray = [];
      companies.data.companies.map((item) =>
        companiesTempArray.push({
          value: item.companyId._id,
          label: item.companyId.name,
        }),
      );

      const deliveryAreasTempArray = [];
      deliveryAreas.data.map((item) =>
        deliveryAreasTempArray.push({
          value: item._id,
          label: item.name,
        }),
      );

      setMeans(meansTempArray);
      setCompanies(companiesTempArray);
      setDeliveryAreas(deliveryAreasTempArray);
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
    else if (name === "isFull") setIsFull(value);
    else if (name === "color") setColor(value);
    else if (name === "startDate") setStartDate(value);
    else if (name === "endDate") setEndDate(value);
    else if (name === "deliveryAreas") setSelectedDeliveryAreas(value);
    else if (name === "means") setSelectedMeans(value);
    else if (name === "unavailabilities") {
      setUpdate((st) => !st);
      setUnavailabilities(value);
    } else if (name === "companies") setSelectedCompanies(value);
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

      const notificationToAr = notificationTo.map((item) => item.label);

      const formdata = JSON.stringify({
        siteId: adminStore.site.siteId._id,
        isFull: isFull,
        name,
        color: props.shape.color,
        availability: {
          start: startDate,
          end: endDate,
        },
        deliveryAreas: selectedDeliveryAreas,
        means: selectedMeans,
        unavailabilities,
        companies: selectedCompanies,
        notificationPriorToDays,
        notificationTo: notificationToAr,
      });

      const response = await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.CREATE_STORAGE_AREA,
        token: store.token,
        body: formdata,
      });

      let propShapes = props.shapes;
      let propShape = props.shape;
      let inde = propShapes.findIndex((item) => item._id === propShape._id);
      propShapes[inde]._id = response.data._id;
      propShapes[inde].name = name;
      propShape._id = response.data._id;
      propShape.name = response.data.name;
      props.setShapes(propShapes);
      props.setShape(propShape);

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.ADMIN_PIC_ADD_SHAPE,
        token: store.token,
        body: JSON.stringify({
          picId: props.pic._id,
          deliveryArea: response.data._id,
          ...propShape,
        }),
      });

      props.setModal(false);
      setLoading(false);
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
        <Form.Row justifyContent="flex-end">
          <FormControlLabel
            control={
              <Checkbox
                name="isFull"
                color="error"
                checked={isFull}
                onChange={({ target: { name, checked } }) =>
                  handleChange(name, checked)
                }
              />
            }
            label="isFull"
          />
        </Form.Row>
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
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
            <FormInput
              type="date"
              name="endDate"
              placeholder="Date de fin"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              value={endDate}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="Delivery Areas: " />
          <Form.Row noMargin width="65%">
            <FormMultiSelect
              name="deliveryAreas"
              values={deliveryAreas}
              placeholder="Delivery Areas"
              value={selectedDeliveryAreas}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="Available Means: " />
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
          <FormLabel bold primary="Unavailabilities: " />
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
          <FormLabel bold primary="Companies Allowed: " />
          <Form.Row noMargin width="65%">
            <FormMultiSelect
              name="companies"
              values={companies}
              placeholder="Companies"
              value={selectedCompanies}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
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
