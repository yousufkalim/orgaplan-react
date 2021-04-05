import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { useSelector, useDispatch } from "react-redux";
import Actions from "../../../redux/actions";
import moment from "moment";
import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";
import CustomInputModal from "../../../components/CustomInputModal";
import ColorPicker from "../../../components/ColorPcker";
import UnavailabilityTimes from "../../../components/UnavailabilityTimes";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

const accessabilityPoints = [
  { label: "Storage Area", value: "Storage Area" },
  { label: "Delivery Area", value: "Delivery Area" },
];

export default function AddMean(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("#d71313");
  const [image, setImage] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [techSheet, setTechSheet] = useState([]);
  const [rate, setRate] = useState("");
  const [addInfo, setAddInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  const [accessabilityPoint, setAccessabilityPoint] = useState("");
  const [DeliveryAreas, setDeliveryAreas] = useState([]);
  const [dropdownDeliveryAreas, setDropdownDeliveryAreas] = useState([]);
  const [selectedDropdownArea, setSelectedDropdownArea] = useState("");

  const [storageAreas, setStorageAreas] = useState([]);
  const [dropdownStorageAreas, setDropdownStorageAreas] = useState([]);
  const [
    selectedDropdownStorageArea,
    setSelectedDropdownStorageArea,
  ] = useState("");

  const [deliveryAreaId, setDeilveryAreaId] = useState("");
  const [storageAreaId, setStorageAreaId] = useState("");

  const [
    deliveryAndStorageLocations,
    setDeliveryAndStorageLocations,
  ] = useState([]);

  const [meanTypes, setMeanTypes] = useState([]);
  const [dropdownMeanTypes, setDropdownMeanTypes] = useState([]);
  const [selectedMeanType, setSelectedMeanType] = useState("");
  const [selecetedMeanTypeIndex, setSelectedMeanTypeIndex] = useState(null);
  const [unavailabilities, setUnavailabilities] = useState([]);
  console.log(unavailabilities);
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {}, [
    meanTypes,
    dropdownMeanTypes,
    selecetedMeanTypeIndex,
    selectedMeanType,
  ]);

  const getData = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ADD_MEAN}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        if (response.data.site_delivery_areas !== null) {
          const temp = [];
          response.data.site_delivery_areas.map((item, index) =>
            temp.push({ label: item.name, value: item.name, id: item._id }),
          );
          setDeliveryAreas(response.data.site_delivery_areas);
          setDropdownDeliveryAreas(temp);
        }

        if (response.data.site_storage_areas !== null) {
          const temp = [];
          response.data.site_storage_areas.map((item, index) =>
            temp.push({ label: item.name, value: item.name, id: item._id }),
          );
          setStorageAreas(response.data.site_storage_areas);
          setDropdownStorageAreas(temp);
        }

        if (response.data.site_buildings !== null) {
          const temp = [];
          response.data.site_buildings.map((item, index) =>
            temp.push({ label: item.name, value: item.name }),
          );
        }

        if (response.data.mean_types !== null) {
          const temp = [];
          response.data.mean_types.map((item, index) =>
            temp.push({ label: item, value: item }),
          );
          setMeanTypes(response.data.mean_types);
          setDropdownMeanTypes(temp);
        }
        // if (response.data.mean_types !== null) {
        //   setTypes(response.data.mean_types);
        //   const temp = [];
        //   response.data.mean_types.map((item, index) => {
        //     temp.push({ label: item, value: item });
        //   });
        //   setDropdownTypes(temp);
        // }
      } else {
      }

      //   setItems(response.data.items);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  function handleChange(name, value) {
    if (name === "name") {
      setName(value);
    } else if (name === "type") setType(value);
    else if (name === "color") setColor(value);
    else if (name === "image") setImage(value);
    else if (name === "startDate") setStartDate(value);
    else if (name === "endDate") setEndDate(value);
    else if (name === "techSheet") setTechSheet(value);
    else if (name === "rate") setRate(value);
    else if (name === "addInfo") setAddInfo(value);
  }

  const createMean = async () => {
    try {
      setLoading(true);

      var formdata = new FormData();

      let locations = [];

      deliveryAndStorageLocations.forEach((item) => {
        if (item.type === accessabilityPoints[0].value) {
          let loc = {
            locationType: "STORAGEAREA",
            storageArea: item.id,
          };
          locations.push(loc);
        }
        if (item.type === accessabilityPoints[1].value) {
          let loc = {
            locationType: "DELIVERYAREA",
            deliveryArea: item.id,
          };
          locations.push(loc);
        }
      });

      let availabilities = {
        start: startDate,
        end: endDate,
      };

      // TEST DATA , CALENDAR NOT MADE YET

      const sampleDateOne = new Date("05/20/2021");
      const sampleDateTwo = new Date("05/28/2021");

      formdata.append("name", name);
      formdata.append("color", color);
      if (image[0]?.file) formdata.append("image", image[0].file);
      // formdata.append("sheet", image[0].file);
      formdata.append("pricePerHour", rate);
      formdata.append("additionalInfo", addInfo);
      formdata.append("siteId", adminStore.site.siteId._id);
      formdata.append("meanType", selectedMeanType);
      formdata.append("location", JSON.stringify(locations));
      formdata.append("availability", JSON.stringify(availabilities));
      formdata.append("unavailability", JSON.stringify(unavailabilities));

      const response = await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.CREATE_MEAN,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      if (response.success) {
        setLoading(false);
      } else {
        setLoading(false);
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar(response.message, "error"),
          ),
        );
      }
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

  const getDeliveryArea = async () => {
    try {
      setLoading(true);

      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_DELIVERY_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      if (response.success) {
        if (response.data !== null && response.data.length > 0) {
          const temp = [];
          response.data.map((item, index) =>
            temp.push({ label: item.name, value: item.name }),
          );

          setDropdownDeliveryAreas(temp);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
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

  const getStorageArea = async () => {
    try {
      setLoading(true);

      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_STORAGE_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      if (response.success) {
        if (response.data !== null && response.data.length > 0) {
          const temp = [];
          response.data.map((item, index) =>
            temp.push({ label: item.name, value: item.name }),
          );

          setDropdownStorageAreas(temp);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
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

  const handleChangecolor = (color) => {
    setColor(color.hex);
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      {loading && ""}
      <Form.Row>
        <Heading primary="ADD A MEAN" />
      </Form.Row>
      <div className={classes.content}>
        <Form.Form>
          <Form.Row>
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
                placeholder="Type"
                name="type"
                style={{ width: "25%" }}
                values={dropdownMeanTypes}
                onChange={(event) => {
                  const index = event.target.selectedIndex - 1;
                  if (index !== -1) {
                    const item = event.target.value;
                    setSelectedMeanTypeIndex(index);
                    setSelectedMeanType(item);
                  } else {
                    setSelectedMeanTypeIndex(null);
                    setSelectedMeanType("");
                  }
                }}
              />
              <div style={{ width: "25%" }}>
                <ColorPicker color={color} handleChange={handleChangecolor} />
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="IMAGE :  " />
            <Form.Row noMargin width="65%">
              <FormMultipleUpload
                name="image"
                style={{ width: "40%" }}
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
              <CustomInputModal
                name="location"
                values={accessabilityPoints}
                leftValue={accessabilityPoint}
                rightValue={
                  accessabilityPoint === accessabilityPoints[0].value
                    ? selectedDropdownStorageArea
                    : selectedDropdownArea
                }
                leftId={accessabilityPoint}
                rightId={
                  accessabilityPoint === accessabilityPoints[0].value
                    ? storageAreaId
                    : deliveryAreaId
                }
                chipValues={(values) => {
                  console.log(values);
                  setDeliveryAndStorageLocations(values);
                }}
                leftDropdownValues={accessabilityPoints}
                leftDropdwonPlaceholder={"Select Location Type"}
                rightDropdownPlaceholder={"Select Location"}
                leftDropdwonValueChange={(event) => {
                  const index = event.target.selectedIndex - 1;
                  if (index !== -1) {
                    const item = event.target.value;
                    setAccessabilityPoint(item);
                    if (item === accessabilityPoints[0].value) {
                      getStorageArea();
                    }
                    if (item === accessabilityPoints[1].value) {
                      getDeliveryArea();
                    } else {
                      setSelectedDropdownArea("");
                      setDeilveryAreaId("");

                      setSelectedDropdownStorageArea("");
                      setStorageAreaId("");
                    }
                  } else {
                    setSelectedDropdownArea("");
                    setDeilveryAreaId("");

                    setSelectedDropdownStorageArea("");
                    setStorageAreaId("");
                  }
                }}
                rightDropdownValues={
                  accessabilityPoint === accessabilityPoints[0].value
                    ? dropdownStorageAreas
                    : dropdownDeliveryAreas
                }
                // error={addresses}
                style={GLOBALS.Styles.inputWidth}
                rightDropdwonValueChange={(event) => {
                  const index = event.target.selectedIndex - 1;
                  if (index !== -1) {
                    const item = event.target.value;
                    if (accessabilityPoints[0].value === accessabilityPoint) {
                      setStorageAreaId(storageAreas[index]._id);
                      setSelectedDropdownStorageArea(item);
                    } else {
                      setSelectedDropdownStorageArea("");
                    }

                    if (accessabilityPoints[1].value === accessabilityPoint) {
                      setDeilveryAreaId(DeliveryAreas[index]._id);
                      setSelectedDropdownArea(item);
                    } else {
                      setSelectedDropdownArea("");
                    }
                  } else {
                    setSelectedDropdownStorageArea("");
                    setSelectedDropdownArea("");
                  }
                }}
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
                value={startDate}
                style={{ width: "300px" }}
                placeholder={`Start date`}
                min={moment(adminStore.site.siteId.start).format("YYYY-MM-DD")}
                max={moment(adminStore.site.siteId.end).format("YYYY-MM-DD")}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
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
                style={GLOBALS.Styles.inputWidth}
                values={techSheet}
                onChange={(values) => {
                  handleChange("techSheet", values);
                }}
              />
            </Form.Row>
          </Form.Row>
          {startDate !== "" && endDate !== "" ? (
            <>
              <Form.Row>
                <FormLabel bold primary="UNAVAILABILITIES" />
                <Form.Row noMargin width="65%">
                  <UnavailabilityTimes
                    name="unavailabilityDates"
                    values={unavailabilities}
                    style={GLOBALS.Styles.inputWidth}
                    unavailabilityDates={unavailabilities}
                    setUnavailabilityDates={setUnavailabilities}
                    startRange={startDate}
                    endRange={moment(endDate).add(1, "days")}
                    onChange={(values) =>
                      handleChange("unavailabilityDates", values)
                    }
                  />
                </Form.Row>
              </Form.Row>
            </>
          ) : (
            ""
          )}

          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="HOURLY RATE :" />
            <Form.Row noMargin width="65%">
              <div
                style={{ width: "30%", height: "100%", position: "relative" }}
              >
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
          {type && ""}
          <Form.Row>
            <Form.ButtonContainer style={{ width: "80%" }}>
              <Button
                minWidth={200}
                text="VALIDATE"
                fullWidth={false}
                onClick={async () => {
                  await createMean();
                }}
                disabled={
                  !name ||
                  !selectedMeanType ||
                  !color ||
                  !startDate ||
                  !deliveryAndStorageLocations[0] ||
                  !endDate
                }
              />
            </Form.ButtonContainer>
          </Form.Row>
        </Form.Form>
      </div>
    </div>
  );
}
