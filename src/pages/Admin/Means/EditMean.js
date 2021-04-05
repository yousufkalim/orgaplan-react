import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormLabel from "../../../components/FormLabel";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import ColorPicker from "../../../components/ColorPcker";
import MeanLocationModal from "../../../components/MeanLocationModal";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

export default function AddMean(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [name, setName] = useState("");
  const [meanType, setMeanType] = useState("");
  const [color, setColor] = useState("#d71313");
  const [image, setImage] = useState([]);
  const [locations, setLocations] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [techSheet, setTechSheet] = useState([]);
  const [rate, setRate] = useState("0");
  const [addInfo, setAddInfo] = useState("");

  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [storageAreas, setStorageAreas] = useState([]);
  const [meanTypes, setMeanTypes] = useState([]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const getData = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ADD_MEAN}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.data.site_delivery_areas !== null) {
        const temp = [];
        response.data.site_delivery_areas.map((item) =>
          temp.push({
            label: item.name,
            value: item._id,
          }),
        );
        setDeliveryAreas(temp);
      }
      if (response.data.site_storage_areas !== null) {
        const temp = [];
        response.data.site_storage_areas.map((item) =>
          temp.push({ label: item.name, value: item._id }),
        );
        setStorageAreas(temp);
      }
      if (response.data.mean_types !== null) {
        const temp = [];
        response.data.mean_types.map((item) =>
          temp.push({ label: item, value: item }),
        );
        setMeanTypes(temp);
      }
      if (props.location.mean) {
        const mean = props.location.mean;
        console.log("Means", mean);

        setName(mean.name);
        setMeanType(mean.meanType);
        setColor(mean.color);
        setStartDate(mean.availability.start);
        setEndDate(mean.availability.end);
        setRate(mean.pricePerHour);
        setImage([
          {
            key: 0,
            uri: mean.image,
          },
        ]);
        const locaAr = mean.location.map((loc) => ({
          key:
            loc.locationType === "STORAGEAREA"
              ? loc.storageArea
              : loc.deliveryArea,
          type: loc.locationType,
          label: loc.label,
        }));
        setLocations(locaAr);
        mean.sheet &&
          setTechSheet([
            {
              key: 0,
              uri: mean.sheet,
            },
          ]);
        setAddInfo(mean.additionalInfo);
        setUpdate((st) => !st);
      }
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const handleChange = (name, value) => {
    if (name === "name") {
      setName(value);
    } else if (name === "color") setColor(value);
    else if (name === "meanType") setMeanType(value);
    else if (name === "image") {
      setImage(value);
      setUpdate((st) => !st);
    } else if (name === "locations") {
      setLocations(value);
      setUpdate((st) => !st);
    } else if (name === "startDate") setStartDate(value);
    else if (name === "endDate") setEndDate(value);
    else if (name === "techSheet") setTechSheet(value);
    else if (name === "rate") setRate(value);
    else if (name === "addInfo") setAddInfo(value);
  };

  const createMean = async () => {
    try {
      setLoading(true);

      const locationsAr = locations.map((ite) => {
        let vals =
          ite.type === "STORAGEAREA"
            ? { storageArea: ite.key }
            : { deliveryArea: ite.key };
        return { locationType: ite.type, label: ite.label, ...vals };
      });
      var formdata = new FormData();
      let availabilities = {
        start: startDate,
        end: endDate,
      };

      // TEST DATA , CALENDAR NOT MADE YET
      const unavailabilities = [
        {
          date: new Date("05/20/2021"),
          reason: "Public Holiday",
          startingHour: new Date().getTime(),
          endingHour: new Date().getTime(),
        },
        {
          date: new Date("05/28/2021"),
          reason: "Maintenance",
          startingHour: new Date().getTime(),
          endingHour: new Date().getTime(),
        },
      ];

      formdata.append("siteId", adminStore.site.siteId._id);
      formdata.append("name", name);
      formdata.append("meanType", meanType);
      formdata.append("color", color);
      formdata.append("image", image[0].file);
      formdata.append("location", JSON.stringify(locationsAr));
      formdata.append("availability", JSON.stringify(availabilities));
      formdata.append("sheet", image[0].file);
      formdata.append("unavailability", JSON.stringify(unavailabilities));
      formdata.append("pricePerHour", rate);
      formdata.append("additionalInfo", addInfo);

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.CREATE_MEAN,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });

      setLoading(false);
      props.history.goBack();
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
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      {loading && ""}
      <Form.Row>
        <Heading primary="EDIT A MEAN" />
      </Form.Row>
      <Form.Form>
        <Form.Row>
          {update && ""}
          <FormLabel bold primary="IDENTITY * : " />
          <Form.Row
            noMargin
            width="65%"
            style={{ gap: "20px", justifyContent: "flex-start" }}
          >
            <FormInput
              name="name"
              value={name}
              placeholder="name"
              style={{ width: "25%" }}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
            <FormSelect
              name="type"
              value={meanType}
              placeholder="Type"
              values={meanTypes}
              style={{ width: "25%" }}
              onChange={(event) => handleChange("meanType", event.target.value)}
            />
            <div style={{ width: "25%" }}>
              <ColorPicker
                color={color}
                handleChange={(values) => handleChange("color", values.hex)}
              />
            </div>
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="IMAGE :  " />
          <Form.Row noMargin width="65%">
            <FormMultipleUpload
              name="image"
              values={image}
              onChange={(values) => {
                handleChange("image", values);
              }}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="LOCATION * :  " />
          <Form.Row noMargin width="65%">
            <MeanLocationModal
              name="location"
              values={locations}
              storageAreas={storageAreas}
              deliveryAreas={deliveryAreas}
              onChange={(values) => handleChange("locations", values)}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="AVAILABILITIES * :" />
          <Form.Row
            noMargin
            width="65%"
            justifyContent="flex-start"
            style={{ gap: "20px" }}
          >
            <FormInput
              type="date"
              name="startDate"
              style={{ width: "300px" }}
              placeholder={`Start date`}
              min={moment(adminStore.site.siteId.start).format("YYYY-MM-DD")}
              max={moment(adminStore.site.siteId.end).format("YYYY-MM-DD")}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              value={startDate}
            />
            <FormInput
              type="date"
              placeholder="End date"
              style={{ width: "300px" }}
              name="endDate"
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              value={endDate}
              min={moment(startDate).add(1, "days").format("YYYY-MM-DD")}
              max={moment(adminStore.site.siteId.end).format("YYYY-MM-DD")}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="TECHNICAL SHEET :" />
          <Form.Row noMargin width="65%">
            <FormMultipleUpload
              name="techSheet"
              values={techSheet}
              onChange={(values) => {
                handleChange("techSheet", values);
              }}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="UNAVAILABILITIES" />
          <Form.Row noMargin width="65%">
            <div
              to={"/means/add-mean"}
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
        <Form.Row alignItems="flex-start">
          <FormLabel bold primary="HOURLY RATE :" />
          <Form.Row noMargin width="65%">
            <div style={{ width: "30%", height: "100%", position: "relative" }}>
              <FormInput
                type="number"
                name="rate"
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                value={rate}
              />
              <span style={{ position: "absolute", top: "25%", right: "5%" }}>
                €
              </span>
            </div>
          </Form.Row>
        </Form.Row>
        <Form.Row alignItems="flex-start">
          <FormLabel bold primary="ADDITIONAL INFORMATION :" />
          <Form.Row noMargin width="65%">
            <FormInput
              textArea
              rows={3}
              maxLength="300"
              style={{ width: "100%" }}
              placeholder="Informations complémentaires"
              name="addInfo"
              className="means-addinfo"
              onChange={({ target: { name, value } }) => {
                handleChange(name, value);
              }}
              value={addInfo}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <Form.ButtonContainer style={{ width: "80%" }}>
            <Button
              minWidth={200}
              text="VALIDATE"
              loading={loading}
              fullWidth={false}
              onClick={async () => {
                await createMean();
              }}
              disabled={
                loading ||
                !name ||
                !meanType ||
                !color ||
                !startDate ||
                !locations
              }
            />
          </Form.ButtonContainer>
        </Form.Row>
      </Form.Form>
    </div>
  );
}
