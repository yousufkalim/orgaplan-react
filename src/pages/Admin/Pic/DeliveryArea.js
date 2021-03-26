import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import ColorPicker from "../../../components/ColorPcker";
import FormInput from "../../../components/CustomFormInput";
import FormMultiSelect from "../../../components/FormMultiSelect";
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
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [update, setUpdate] = useState(false);

  const [selectedMeans, setSelectedMeans] = useState([]);
  const [means, setMeans] = useState([]);

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
    else if (name === "type") setType(value);
    else if (name === "color") setColor(value);
    else if (name === "addresses") {
      setUpdate((st) => !st);
      setAddresses(value);
    } else if (name === "startDate") setStartDate(value);
    else if (name === "endDate") setEndDate(value);
    else if (name === "means") setSelectedMeans(value);
  }

  return (
    <div className={classes.content}>
      <Form.Form>
        <Form.Row>
          <FormLabel bold primary="Name : " />
          <Form.Row noMargin width="65%" style={{ gap: "20px" }}>
            <FormInput
              name="name"
              value={name}
              placeholder="Name"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
            <div style={{ width: "25%" }}>
              <ColorPicker
                color={color}
                handleChange={(color) => handleChange("color", color.hex)}
              />
            </div>
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="AVAILABILITY :" />
          <Form.Row
            noMargin
            width="65%"
            justifyContent="flex-start"
            style={{ gap: "20px" }}
          >
            <FormInput
              type="date"
              name="startDate"
              value={startDate}
              style={{ width: "300px" }}
              placeholder={`Date de début`}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
            <FormInput
              type="date"
              placeholder="Date de fin"
              style={{ width: "300px" }}
              name="endDate"
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              value={endDate}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="ACCESSIBILITY ADDRESSES :  " />
          <Form.Row noMargin width="65%">
            <DeliveryAreaAddressModal
              name="addresses"
              values={addresses}
              // error={addresses}
              style={GLOBALS.Styles.inputWidth}
              placeholder="Enter site addresses"
              onChange={(values) => handleChange("addresses", values)}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="Means: " />
          <Form.Row noMargin width="65%">
            <FormSelect
              name="means"
              values={means}
              placeholder="Means"
              value={selectedMeans}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
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
          <Form.ButtonContainer style={{ width: "80%" }}>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              disabled={!name || !type || !color || !startDate}
            />
          </Form.ButtonContainer>
        </Form.Row>
      </Form.Form>
      {update && ""}
    </div>
  );
}
