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
import CustomButtonModal from "../../../components/CustomButtonModal";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

// const addClientYup = Yup.object().shape({
//   logo: Yup.array().min(1, "Required").required("Required"),
//   name: Yup.string().required("Required"),
//   color: Yup.string().required("Required"),
//   firstName: Yup.string().required("Required"),
//   lastName: Yup.string().required("Required"),
//   email: Yup.string().required("Required"),
//   phone: Yup.number()
//     .test(
//       "len",
//       "Must be exactly 10 characters",
//       (val) => val && val.toString().length === 10,
//     )
//     .required("Required"),
//   contractType: Yup.string().required("Required"),
//   contractStartDate: Yup.string().required("Required"),
//   contractEndDate: Yup.string().required("Required"),
//   functionality: Yup.string().required("Required"),
//   additionalInfo: Yup.string(),
//   notificationPriorToDays: Yup.number(),
//   notificationTo: Yup.array(),
// });

export default function AddMean(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const [addresses] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState([]);
  const [location, setLocation] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [techSheet, setTechSheet] = useState([]);
  const [rate, setRate] = useState("");
  const [addInfo, setAddInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [disableDropdpwn, setDisableDropdown] = useState(false);
  const [isExterior, setIsExterior] = useState(false);
  const classes = useStyles();

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
  const [selectedDropdownBuilding, setSelectedDropdownBuilding] = useState("");
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState(null);

  const [levels, setLevels] = useState([]);
  const [dropdownLevels, setDropdownLevels] = useState([]);
  const [selectedDropdownLevel, setSelectedDropdownLevel] = useState("");
  const [selectedDropdownIndex, setSelectedLevelIndex] = useState(null);

  const [meanTypes, setMeanTypes] = useState([]);
  const [dropdownMeanTypes, setDropdownMeanTypes] = useState([]);
  const [selectedMeanType, setSelectedMeanType] = useState("");
  const [selecetedMeanTypeIndex, setSelectedMeanTypeIndex] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {}, [
    meanTypes,
    dropdownMeanTypes,
    selecetedMeanTypeIndex,
    selectedMeanType,
  ]);

  const getData = async () => {
    console.log(JSON.stringify(store, null, 2));
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ADD_MEAN}/6008169bedbb7816d40b197d`,
        token: store.token,
      });
      if (response.success) {
        console.log(JSON.stringify(response, null, 2));
        if (response.data.site_delivery_areas != null) {
          const temp = [];
          response.data.site_delivery_areas.map((item, index) => {
            temp.push({ label: item.name, value: item.name, id: item._id });
          });
          setDeliveryAreas(response.data.site_delivery_areas);
          setDropdownDeliveryAreas(temp);
        }

        if (response.data.site_storage_areas != null) {
          const temp = [];
          response.data.site_storage_areas.map((item, index) => {
            temp.push({ label: item.name, value: item.name, id: item._id });
          });
          setStorageAreas(response.data.site_storage_areas);
          setDropdownStorageAreas(temp);
        }

        if (response.data.site_buildings != null) {
          const temp = [];
          response.data.site_buildings.map((item, index) => {
            temp.push({ label: item.name, value: item.name });
          });
          setBuidings(response.data.site_buildings);
          setDropdownBuildings(temp);
        }

        if (response.data.mean_types != null) {
          const temp = [];
          response.data.mean_types.map((item, index) => {
            temp.push({ label: item, value: item });
          });
          setMeanTypes(response.data.mean_types);
          setDropdownMeanTypes(temp);
        }
        // if (response.data.mean_types != null) {
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
    //alert(JSON.stringify(value, null, 2));
    if (name === "name") setName(value);
    else if (name === "type") setType(value);
    else if (name === "color") setColor(value);
    else if (name === "image") setImage(value);
    else if (name === "location") setLocation(value);
    else if (name === "startDate") setStartDate(value);
    else if (name === "endDate") setEndDate(value);
    else if (name === "techSheet") setTechSheet(value);
    else if (name === "rate") setRate(value);
    else if (name === "addInfo") setAddInfo(value);
  }

  const createMean = async () => {
    try {
      // setLoading(true);

      var formdata = new FormData();

      let locations = [];
      if (isExterior) {
        let loc = {
          locationType: "EXTERIOR",
          buildingId: buildings[selectedBuildingIndex]._id,
        };

        locations.push(loc);
      } else {
        let loc = {
          locationType: "LEVEL",
          buildingId: buildings[selectedBuildingIndex]._id,
          levelID: levels[selectedDropdownIndex]._id,
        };
        locations.push(loc);
      }

      deliveryAndStorageLocations.forEach((item) => {
        if (item.type == "STORAGEAREA") {
          let loc = {
            locationType: item.type,
            storageArea: item.id,
          };
          locations.push(loc);
        }
        if (item.type == "DELIVERYAREA") {
          let loc = {
            locationType: item.type,
            deliveryArea: item.id,
          };
          locations.push(loc);
        }
      });

      let availabilities = {
        availability: {
          start: startDate,
          end: endDate,
        },
      };

      // TEST DATA , CALENDAR NOT MADE YET

      const sampleDateOne = new Date("05/20/2021");
      const sampleDateTwo = new Date("05/28/2021");
      const unavailabilities = {
        unavailability: [
          {
            date: sampleDateOne,
            reason: "Public Holiday",
            startingHour: new Date().getTime(),
            endingHour: new Date().getTime(),
          },
          {
            date: sampleDateTwo,
            reason: "Maintenance",
            startingHour: new Date().getTime(),
            endingHour: new Date().getTime(),
          },
        ],
      };

      formdata.append("name", name);
      formdata.append("color", color);
      formdata.append("image", image[0].file);
      formdata.append("sheet", image[0].file);
      formdata.append("pricePerHour", rate);
      formdata.append("additionalInfo", addInfo);
      formdata.append("siteId", "6008169bedbb7816d40b197d");
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
        alert(JSON.stringify(response, null, 2));
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

  const getLevels = async (buidlingId) => {
    try {
      setLoading(true);

      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_LEVELS}/${buidlingId}`,
        token: store.token,
      });

      if (response.success) {
        setLevels(response.data);
        if (response.data != null && response.data.length > 0) {
          const temp = [];
          response.data.map((item, index) => {
            temp.push({ label: item.name, value: item.name });
          });

          setDropdownLevels(temp);
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
        <Heading primary="ADD A MEAN" />
        <CustomButtonModal
          name="addresses"
          values={addresses}
          title="LOCALISATION"
          leftValue={selectedDropdownBuilding}
          rightValue={selectedDropdownLevel}
          leftDropdownValues={dropdownBuildings}
          rightDropdownValues={dropdownLevels}
          leftDropdwonPlaceholder={"Select Building"}
          rightDropdownPlaceholder={"Select Level"}
          disabled={disableDropdpwn}
          leftDropdwonValueChange={(event) => {
            const index = event.target.selectedIndex - 1;
            if (index != -1) {
              const item = event.target.value;

              setSelectedBuildingIndex(index);
              setSelectedDropdownBuilding(item);
              // Reset Levels
              setSelectedLevelIndex(0);
              setSelectedDropdownLevel("");
              setDropdownLevels([]);
              if (buildings[index].buildingType == "EXTERIOR") {
                setDisableDropdown(true);
                setIsExterior(true);
              } else {
                setIsExterior(false);
                setDisableDropdown(false);
                getLevels(buildings[index]._id);
              }
            } else {
              setSelectedBuildingIndex(0);
              setSelectedDropdownBuilding("");
              // Reset Levels
              setSelectedLevelIndex(0);
              setSelectedDropdownLevel("");
              setDropdownLevels([]);
            }
          }}
          rightDropdwonValueChange={(event) => {
            const index = event.target.selectedIndex - 1;
            if (index != -1) {
              const item = event.target.value;
              setSelectedLevelIndex(index);
              setSelectedDropdownLevel(item);
            } else {
              setSelectedLevelIndex(0);
              setSelectedDropdownLevel("");
            }
          }}
          // error={addresses}
          //    style={GLOBALS.Styles.inputWidth}
          style={{ width: "250px", marginRight: "240px" }}
          placeholder="Enter site addresses"
          onChange={(values) => handleChange("addresses", values)}
        />
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
                style={GLOBALS.Styles.inputWidth}
                onChange={(event) => {
                  const index = event.target.selectedIndex - 1;

                  if (index != -1) {
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
                  console.log("IMAGE", JSON.stringify(values, null, 2));
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
                values={location}
                leftValue={selectedDropdownArea}
                rightValue={selectedDropdownStorageArea}
                leftId={deliveryAreaId}
                rightId={storageAreaId}
                chipValues={(values) => {
                  console.log(JSON.stringify(values, null, 2));
                  setDeliveryAndStorageLocations(values);
                }}
                leftDropdownValues={dropdownDeliveryAreas}
                leftDropdwonPlaceholder={"Select Delivery Area"}
                rightDropdownPlaceholder={"Select Storage Area"}
                leftDropdwonValueChange={(event) => {
                  const index = event.target.selectedIndex - 1;
                  if (index != -1) {
                    const item = event.target.value;
                    seltSelectedSiteDeliveryAreaIndex(index);
                    setSelectedDropdownArea(item);
                    setDeilveryAreaId(DeliveryAreas[index]._id);
                    // filterMean();
                  } else {
                    seltSelectedSiteDeliveryAreaIndex(null);
                    setSelectedDropdownArea("");
                    setDeilveryAreaId("");
                    // filterMean();
                  }
                }}
                rightDropdownValues={dropdownStorageAreas}
                // error={addresses}
                style={GLOBALS.Styles.inputWidth}
                rightDropdwonValueChange={(event) => {
                  const index = event.target.selectedIndex - 1;
                  if (index != -1) {
                    const item = event.target.value;
                    setStorageAreaId(storageAreas[index]._id);
                    setSelectedStorageAreaIndex(index);
                    setSelectedDropdownStorageArea(item);
                  } else {
                    setSelectedStorageAreaIndex(0);
                    setSelectedDropdownStorageArea("");
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
                  console.log("TECH", JSON.stringify(values, null, 2));
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
                  console.log("add, info", value);
                  handleChange(name, value);
                }}
                value={addInfo}
              />
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <Form.ButtonContainer style={{ width: "80%" }}>
              <Button
                type="submit"
                minWidth={200}
                text="VALIDATE"
                fullWidth={false}
                onClick={() => {
                  createMean();
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

/*
 onChange={(value) => {
            if(props.validte) 
            {
              props.ypuprop.validate(value)
            }
          }}
        */
