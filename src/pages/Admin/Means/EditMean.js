import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import Actions from "../../../redux/actions";
import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/CustomFormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";
import CustomInputModal from "../../../components/CustomInputModal";
import moment from "moment";
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

export default function EditMean(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
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
  const [
    selectedSiteDeliveryAreadIndex,
    seltSelectedSiteDeliveryAreaIndex,
  ] = useState(null);

  const [storageAreas, setStorageAreas] = useState([]);
  const [dropdownStorageAreas, setDropdownStorageAreas] = useState([]);
  const [
    selectedDropdownStorageArea,
    setSelectedDropdownStorageArea,
  ] = useState("");
  const [selectedStorageAreaIndex, setSelectedStorageAreaIndex] = useState(
    null,
  );

  const [deliveryAreaId, setDeilveryAreaId] = useState("");
  const [storageAreaId, setStorageAreaId] = useState("");

  const [
    deliveryAndStorageLocations,
    setDeliveryAndStorageLocations,
  ] = useState([]);

  const [buildings, setBuidings] = useState([]);
  const [dropdownBuildings, setDropdownBuildings] = useState([]);
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState(null);

  const [levels, setLevels] = useState([]);
  const [selectedDropdownIndex] = useState(null);

  const [meanTypes, setMeanTypes] = useState([]);
  const [dropdownMeanTypes, setDropdownMeanTypes] = useState([]);
  const [selectedMeanType, setSelectedMeanType] = useState("");
  const [selecetedMeanTypeIndex, setSelectedMeanTypeIndex] = useState(null);

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  const setValues = () => {
    const mean = props.location.mean;
    setName(mean.name);
    let fileClone = [{ uri: mean.image }];
    setImage(fileClone);
    setSelectedMeanType(mean.meanType);
    let meanTypeIndex = 0;
    dropdownMeanTypes.forEach((item, index) => {
      if (item.value === mean.meanType) meanTypeIndex = index;
    });

    setSelectedMeanTypeIndex(meanTypeIndex);

    setColor(mean.color);

    setStartDate(moment(mean.availability.start).format("MM/DD/yyyy"));
    setEndDate(moment(mean.availability.end).format("MM/DD/yyyy"));
    setRate(mean.pricePerHour);
    setAddInfo(mean.additionalInfo);
    const locationTemp = [];
    mean.location.forEach((item, index) => {
      let loc = { key: "", label: "", id: "", type: "" };

      if (item.locationType === "STORAGEAREA") {
        loc.key = item.storageArea._id;
        loc.label = item.storageArea.name;
        loc.id = item.storageArea._id;
        loc.type = accessabilityPoints[0].value;
        locationTemp.push(loc);
      }
      if (item.locationType === "DELIVERYAREA") {
        loc.key = item.deliveryArea._id;
        loc.label = item.deliveryArea.name;
        loc.id = item.deliveryArea._id;
        loc.type = accessabilityPoints[1].value;
        locationTemp.push(loc);
      }
    });
    setDeliveryAndStorageLocations(locationTemp);
    console.log(JSON.stringify(locationTemp, null, 2));
    // "key": "61615286801076",
    // "label": "storqg",
    // "id": "60096007880eb61e9d7188d2",
    // "type": "Storage Area"
  };
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
          await setDeliveryAreas(response.data.site_delivery_areas);
          await setDropdownDeliveryAreas(temp);
        }

        if (response.data.site_storage_areas !== null) {
          const temp = [];
          response.data.site_storage_areas.map((item, index) =>
            temp.push({ label: item.name, value: item.name, id: item._id }),
          );
          await setStorageAreas(response.data.site_storage_areas);
          await setDropdownStorageAreas(temp);
        }

        if (response.data.site_buildings !== null) {
          const temp = [];
          response.data.site_buildings.map((item, index) =>
            temp.push({ label: item.name, value: item.name }),
          );
          await setBuidings(response.data.site_buildings);
          await setDropdownBuildings(temp);
        }

        if (response.data.mean_types !== null) {
          const temp = [];
          response.data.mean_types.map((item, index) =>
            temp.push({ label: item, value: item }),
          );
          await setMeanTypes(response.data.mean_types);
          await setDropdownMeanTypes(temp);
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
      await setValues();
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
    //alert(JSON.stringify(value, null, 2));
    if (name === "name") setName(value);
    else if (name === "type") setType(value);
    else if (name === "color") setColor(value);
    else if (name === "image") setImage(value);
    else if (name === "startDate") setStartDate(value);
    else if (name === "endDate") setEndDate(value);
    else if (name === "techSheet") setTechSheet(value);
    else if (name === "rate") setRate(value);
    else if (name === "addInfo") setAddInfo(value);
  }

  const updateMean = async () => {
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

      // const sampleDateOne = new Date("05/20/2021");
      // const sampleDateTwo = new Date("05/28/2021");
      // const unavailabilities = [
      //   {
      //     date: sampleDateOne,
      //     reason: "Public Holiday",
      //     startingHour: new Date().getTime(),
      //     endingHour: new Date().getTime(),
      //   },
      //   {
      //     date: sampleDateTwo,
      //     reason: "Maintenance",
      //     startingHour: new Date().getTime(),
      //     endingHour: new Date().getTime(),
      //   },
      // ];

      formdata.append("name", name);
      formdata.append("color", color);
      if (image.length !== 0 && image[0].file !== undefined)
        formdata.append("image", image[0].file);
      if (image.length !== 0 && image[0].file !== undefined)
        formdata.append("sheet", image[0].file);
      formdata.append("pricePerHour", rate);
      formdata.append("additionalInfo", addInfo);
      formdata.append("siteId", adminStore.site.siteId._id);
      formdata.append("meanType", selectedMeanType);
      formdata.append("location", JSON.stringify(locations));
      formdata.append("availability", JSON.stringify(availabilities));
      //formdata.append("unavailability", JSON.stringify(unavailabilities));

      const response = await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.UPDATE_MEAN + "/" + props.location.mean._id,
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
        uri: `${GLOBALS.Constants.GET_DELIVERY_AREA_BY_SITE_ID}/6008169bedbb7816d40b197d`,
        token: store.token,
      });

      if (response.success) {
        setLevels(response.data);
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
        uri: `${GLOBALS.Constants.GET_STORAGE_AREA_BY_SITE_ID}/6008169bedbb7816d40b197d`,
        token: store.token,
      });

      if (response.success) {
        setLevels(response.data);
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

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>

      <Form.Row>
        <Heading primary="EDIT A MEAN" />

        {/* <Button
                fullWidth={false}
                component={NavLink}
                text="LOCALISATION"
                to={"/means/add-mean"}
                style={{
                  marginRight: "100px",
                  marginBottom: "7px",
                  width: "320px",
                  textAlign: "center",
                  backgroundColor: "#140772"
                }}
              /> */}
      </Form.Row>
      {loading && ""}
      {levels && ""}
      {selectedDropdownIndex && ""}
      {meanTypes && ""}
      {selectedBuildingIndex && ""}
      {DeliveryAreas && ""}
      {selectedSiteDeliveryAreadIndex && ""}
      {storageAreas && ""}
      {selectedStorageAreaIndex && ""}
      <div className={classes.content}>
        <Form.Form>
          <Form.Row>
            <FormLabel bold primary="IDENTITY : " />
            <Form.Row noMargin width="65%" style={{ gap: "20px" }}>
              <FormInput
                name="name"
                error
                style={GLOBALS.Styles.inputWidth}
                placeholder="name"
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                value={name}
                validateSchema={Yup.string().required()}
              />
              <FormSelect
                placeholder="Type"
                name="type"
                value={selectedMeanType}
                style={GLOBALS.Styles.inputWidth}
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
                values={dropdownMeanTypes}
              />
              <FormSelect
                placeholder="color"
                name="color"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                value={color}
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
              <FormMultipleUpload
                name="image"
                style={GLOBALS.Styles.inputWidth}
                values={image}
                onChange={(values) => {
                  handleChange("image", values);
                }}
              />
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary="LOCATION :  " />
            <Form.Row noMargin width="65%">
              <CustomInputModal
                name="location"
                values={accessabilityPoints}
                chipDefaultValues={deliveryAndStorageLocations}
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
                      seltSelectedSiteDeliveryAreaIndex(0);
                      setSelectedDropdownArea("");
                      setDeilveryAreaId("");

                      setSelectedStorageAreaIndex(0);
                      setSelectedDropdownStorageArea("");
                      setStorageAreaId("");
                    }
                  } else {
                    seltSelectedSiteDeliveryAreaIndex(0);
                    setSelectedDropdownArea("");
                    setDeilveryAreaId("");

                    setSelectedStorageAreaIndex(0);
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
                      setSelectedStorageAreaIndex(index);
                      setSelectedDropdownStorageArea(item);
                    } else {
                      setSelectedStorageAreaIndex(0);
                      setSelectedDropdownStorageArea("");
                    }

                    if (accessabilityPoints[1].value === accessabilityPoint) {
                      setDeilveryAreaId(DeliveryAreas[index]._id);
                      seltSelectedSiteDeliveryAreaIndex(index);
                      setSelectedDropdownArea(item);
                    } else {
                      seltSelectedSiteDeliveryAreaIndex(0);
                      setSelectedDropdownArea("");
                    }
                  } else {
                    setSelectedStorageAreaIndex(0);
                    setSelectedDropdownStorageArea("");
                    seltSelectedSiteDeliveryAreaIndex(0);
                    setSelectedDropdownArea("");
                  }
                }}
              />
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary="DISPONIBILITE :" />
            <Form.Row
              noMargin
              width="65%"
              justifyContent="flex-start"
              style={{ gap: "20px" }}
            >
              <FormInput
                type="date"
                style={{ width: "300px" }}
                placeholder={`Date de début`}
                name="startDate"
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                value={startDate}
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
            <FormLabel bold primary="FICHE TECHNIQUE : " />
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

          <Form.Row>
            <FormLabel bold primary="INDISPONIBILITES: " />
            <Form.Row noMargin width="65%">
              <div
                // name="availability"

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
            <FormLabel bold primary="TARIF HORAIRE : " />
            <Form.Row noMargin width="65%">
              <FormInput
                textArea
                rows={1}
                style={{ width: "300px", textAlign: "right" }}
                placeholder="€"
                name="rate"
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                value={rate}
              />
            </Form.Row>
          </Form.Row>

          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="INFORMATIONS COMPLÉMENTAIRES :" />
            <Form.Row noMargin width="65%">
              <FormInput
                textArea
                rows={3}
                style={{ width: "600px" }}
                placeholder="Informations complémentaires"
                name="addInfo"
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
                  await updateMean();
                }}
                // loading={formik.isSubmitting}
                // disabled={
                //   !name ||
                //   location.length === 0 ||
                //   !type ||
                //   !color ||
                //   !startDate
                // }
              />
            </Form.ButtonContainer>
          </Form.Row>
        </Form.Form>
      </div>
    </div>
  );
}
