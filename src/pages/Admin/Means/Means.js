import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import GLOBALS from "../../../globals";
import { makeStyles } from "@material-ui/core/styles";
// import * as Yup from "yup";

import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import Actions from "../../../redux/actions";

import { useFormik } from "formik";

// import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import SearchInput from "../../../components/SearchInput";
import FormInput from "../../../components/FormInput";

import moment from "moment";
import { Images } from "../../../assets/Assets";

import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
    backgroundColor: theme.palette.secondary.main,
  },
  link: {
    marginRight: 20,
    whiteSpace: "nowrap",
    color: theme.palette.primary.contrastText,
  },
  image: {
    height: 70,
    borderRadius: theme.shape.borderRadius,
  },
}));

const Means = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const [siteDeliveryAreas, setSiteDeliveryAreas] = useState([]);
  const [dropdownDeliveryAreas, setDropdownDeliveryAreas] = useState([]);
  const [selectedDropdownArea, setSelectedDropdownArea] = useState("");
  const [
    selectedSiteDeliveryAreadIndex,
    seltSelectedSiteDeliveryAreaIndex,
  ] = useState(null);

  const [locations, setLocations] = useState([]);
  const [dropdownLocations, setDropdownLocations] = useState([]);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("");

  const [types, setTypes] = useState([]);
  const [doropdownTypes, setDropdownTypes] = useState([]);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);
  const [selectedType, setSelectedType] = useState("");

  const [status, setStatus] = useState([]);
  const [dropdownStatus, setDropdownStatus] = useState([]);
  const [selectedStatusIndex, setSelectedStatusIndex] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [company, setCompany] = useState([]);
  const [dropdownCompany, setDropdownCompany] = useState([]);
  const [selectedCompanyIndex, setSeletedCompanyIndex] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState("");

  const [levels, setLevels] = useState([]);
  const [dropdownLevels, setDropdownLevels] = useState([]);
  const [selectedDropdownLevelIndex, setSelectedDropdownLevelIndex] = useState(
    0,
  );
  const [selectedLevel, setSelectedLevel] = useState("");
  const [disableDropdpwn, setDisableDropdown] = useState(false);

  const [storageAreas, setStorageAreas] = useState([]);
  const [droprownStorageAreas, setDropdownStorageAreas] = useState([]);
  const [
    selectedDropdownStorageAreaIndex,
    setSelectedDropdownStorageAreaIndex,
  ] = useState(0);
  const [selectedStorageArea, setSelectedStorageArea] = useState("");
  const [storageMeans, setStorageMeans] = useState([]);
  const [means, setMeans] = useState([]);
  const [meanText, setMeanText] = useState("");

  const getMeans = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_LIST_OF_MEANS}/6008169bedbb7816d40b197d`,
        token: store.token,
      });
      if (response.success) {
        setMeans(response.data.means);

        if (response.data.means != null) {
          let temp = [];

          response.data.means.map((item, index) => {
            let data = [];
            data[0] = item.name;
            data[1] = item.status;
            data[2] = item.meanType;
            data[3] = item.location
              .map((innerItem, index) => innerItem.storageArea.name)
              .toString();
            data[4] = item.location
              .map((innerItem, index) => innerItem.deliveryArea.name)
              .toString();
            temp.push(data);
            return true;
          });
          setItems(temp);
        }

        if (response.data.site_delivery_areas != null) {
          const temp = [];
          response.data.site_delivery_areas.map((item, index) => {
            return temp.push({ label: item.name, value: item.name });
          });
          setSiteDeliveryAreas(response.data.site_delivery_areas);
          setDropdownDeliveryAreas(temp);
        }

        if (response.data.site_companies != null) {
          const temp = [];
          response.data.site_companies.map((item, index) => {
            return temp.push({ label: item.name, value: item.name });
          });
          setCompany(response.data.site_companies);
          setDropdownCompany(temp);
        }

        if (response.data.site_locations != null) {
          setLocations(response.data.site_locations);
          const temp = [];
          response.data.site_locations.map((item, index) => {
            return temp.push({ label: item.name, value: item.name });
          });
          setDropdownLocations(temp);
        }

        if (response.data.mean_types != null) {
          setTypes(response.data.mean_types);
          const temp = [];
          response.data.mean_types.map((item, index) => {
            return temp.push({ label: item, value: item });
          });
          setDropdownTypes(temp);
        }

        if (response.data.mean_status != null) {
          setStatus(response.data.mean_status);
          const temp = [];
          response.data.mean_status.map((item, index) => {
            return temp.push({ label: item, value: item });
          });
          setDropdownStatus(temp);
        }
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

  const getExternalMeans = async () => {
    try {
      setLoading(true);

      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_EXTERIOR_MEANS}/6008169bedbb7816d40b197d`,
        token: store.token,
      });

      if (response.success) {
        setStorageAreas(response.data);
        if (response.data != null && response.data.length > 0) {
          const temp = [];
          response.data.map((item, index) => {
            return temp.push({ label: item.name, value: item.name });
          });

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
            return temp.push({ label: item.name, value: item.name });
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

  const formik = useFormik({
    initialValues: {
      contractType: "CLIENTPERSITE",
      contractStartDate: "",
      contractEndDate: "",
      functionality: "DELIVERY",
      additionalInfo: "",
      notificationPriorToDays: "",
      notificationTo: [],
    },
    // validationSchema: addClientYup,
    // onSubmit,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
  });

  useEffect(() => {
    filterMean();
    // eslint-disable-next-line
  }, [
    selectedSiteDeliveryAreadIndex,
    selectedLocationIndex,
    selectedDropdownLevelIndex,
    selectedDropdownStorageAreaIndex,
    selectedStorageArea,
    selectedTypeIndex,
    selectedType,
    selectedCompanyIndex,
    selectedCompany,
    selectedStatusIndex,
    selectedStatus,
    formik.values.contractStartDate,
    formik.values.contractEndDate,
  ]);

  const filterMean = async () => {
    try {
      setLoading(true);
      const params = { siteId: "6008169bedbb7816d40b197d" };
      if (meanText.length !== 0) params["name"] = meanText;
      if (selectedDropdownArea.length !== 0)
        params["deliveryArea"] =
          siteDeliveryAreas[selectedSiteDeliveryAreadIndex]._id;
      if (selectedStorageArea.length !== 0)
        params["storageArea"] =
          storageAreas[selectedDropdownStorageAreaIndex]._id;

      if (selectedType.length !== 0) params["type"] = types[selectedTypeIndex];
      if (selectedStatus.length !== 0)
        params["status"] = status[selectedStatusIndex];
      if (!isNaN(moment(formik.values.contractStartDate)))
        params["startDate"] = formik.values.contractStartDate;
      if (!isNaN(moment(formik.values.contractEndDate)))
        params["endDate"] = formik.values.contractEndDate;
      console.log(JSON.stringify(params, null, 2));
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.FILTER_MEANS}`,
        token: store.token,
        method: "POST",
        body: JSON.stringify(params),
      });
      if (response.success) {
        let temp = [];

        response.data.map((item, index) => {
          let data = [];
          data[0] = item.name;
          data[1] = item.status;
          data[2] = item.meanType;
          data[3] = item.location
            .map((innerItem, index) => innerItem.storageArea.name)
            .toString();
          data[4] = item.location
            .map((innerItem, index) => innerItem.deliveryArea.name)
            .toString();
          return temp.push(data);
        });
        setItems(temp);

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

  const getStorageAreasByLevel = async (levelId) => {
    try {
      setLoading(true);
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_STORAGE_AREA_BY_LEVEL_ID}/${levelId}`,
        token: store.token,
      });

      if (response.success) {
        setStorageAreas(response.data);
        if (response.data != null && response.data.length > 0) {
          const temp = [];
          response.data.map((item, index) => {
            return temp.push({ label: item.name, value: item.name });
          });

          setDropdownStorageAreas(temp);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMeans();
    // eslint-disable-next-line
  }, []);

  const rows = items.map((item) => {
    return [
      ...item,
      <div>
        <NavLink
          to="/means/edit-mean"
          style={{ color: "#959491 !important", textDecoration: "none" }}
        >
          <Pencil style={{ width: 18, height: 15, cursor: "pointer" }} />
        </NavLink>
        <img
          src={Images.calender}
          style={{ width: 18, height: 15, paddingLeft: 5 }}
          alt="Icon"
        />

        <img
          src={Images.incidents}
          style={{ width: 18, height: 15, paddingLeft: 5 }}
          alt="Icon"
        />
      </div>,
    ];
  });

  return (
    <div className={classes.root}>
      <Form.Row alignItems="center">
        {loading && ""}
        {selectedLocation && ""}
        {company && ""}
        {selectedLevel && ""}
        {storageMeans && ""}
        <Heading primary="LIST OF MEANS" noWrap />
        <div>
          <Form.Row
            alignItems="flex-start"
            noMargin
            justifyContent="flex-end"
            style={{ paddingRight: "50px" }}
          >
            <SubHeading
              disableMargin
              topPadding
              primary={`TOTAL : ${means.length} means`}
              bold
            />
            <Form.Column style={{ width: "50%" }}>
              <Button
                fullWidth={false}
                component={NavLink}
                text="ADD A MEAN"
                to={"/means/add-mean"}
                style={{
                  marginLeft: "20px",
                  marginBottom: "7px",
                  width: "200px",
                }}
              />
              <Button
                fullWidth={false}
                component={NavLink}
                text="MEANS REQUEST"
                to={"/sites/means-request"}
                style={{ marginLeft: "20px", width: "200px" }}
              />
            </Form.Column>
          </Form.Row>
        </div>
      </Form.Row>
      <Form.Row alignItems="center" noMargin>
        <Form.Row justifyContent="flex-start" noMargin>
          <FormSelect
            placeholder="Delivery area"
            values={dropdownDeliveryAreas}
            onChange={(event) => {
              const index = event.target.selectedIndex - 1;

              if (index !== -1) {
                console.log("HERE 1");
                const item = event.target.value;
                console.log("HERE 2");
                seltSelectedSiteDeliveryAreaIndex(index);
                console.log("HERE 3");
                setSelectedDropdownArea(item);
                console.log("HERE 4");
                // filterMean();
                console.log("HERE 5");
              } else {
                seltSelectedSiteDeliveryAreaIndex(null);
                console.log("HERE 6");
                setSelectedDropdownArea("");
                console.log("HERE 7");
                // filterMean();
                console.log("HERE 8");
              }
            }}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Location"
            values={dropdownLocations}
            onChange={(event) => {
              const index = event.target.selectedIndex - 1;
              if (index !== -1) {
                const item = event.target.value;

                setSelectedLocationIndex(index);
                setSelectedLocation(item);
                // Reset Levels
                setSelectedDropdownLevelIndex(0);
                setSelectedLevel("");
                setDropdownLevels([]);
                // Reset Storage Area
                setSelectedDropdownStorageAreaIndex(0);
                setSelectedStorageArea("");
                setDropdownStorageAreas([]);
                // Reset Storage Means
                setStorageMeans([]);
                if (locations[index].locationType === "EXTERIOR") {
                  setDisableDropdown(true);
                  getExternalMeans();
                } else {
                  setDisableDropdown(false);
                  getLevels(locations[index].building._id);
                }
              } else {
                setSelectedLocationIndex(0);
                setSelectedLocation("");
                // Reset Levels
                setSelectedDropdownLevelIndex(0);
                setSelectedLevel("");
                setDropdownLevels([]);
                // Reset Storage Area
                setSelectedDropdownStorageAreaIndex(0);
                setSelectedStorageArea("");
                setDropdownStorageAreas([]);
                // Reset Storage Means
                setStorageMeans([]);
              }
            }}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Level"
            values={dropdownLevels}
            disabled={disableDropdpwn}
            onChange={(event) => {
              const index = event.target.selectedIndex - 1;
              if (index !== -1) {
                const item = event.target.value;
                setSelectedDropdownLevelIndex(index);
                setSelectedLevel(item);
                // Reset Storage Area
                setSelectedDropdownStorageAreaIndex(0);
                setSelectedStorageArea("");
                setDropdownStorageAreas([]);
                // Reset Storage Means
                setStorageMeans([]);

                getStorageAreasByLevel(levels[index]._id);
              } else {
                setSelectedDropdownLevelIndex(0);
                setSelectedLevel("");
                // Reset Storage Area
                setSelectedDropdownStorageAreaIndex(0);
                setSelectedStorageArea("");
                setDropdownStorageAreas([]);
                // Reset Storage Means
                setStorageMeans([]);
              }
            }}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Storage area"
            values={droprownStorageAreas}
            onChange={(event) => {
              const index = event.target.selectedIndex - 1;
              if (index !== -1) {
                const item = event.target.value;

                setSelectedDropdownStorageAreaIndex(index);
                setSelectedStorageArea(item);
                // Reset Storage Means
                setStorageMeans([]);

                // filterMean();
              } else {
                setSelectedDropdownStorageAreaIndex(0);
                setSelectedStorageArea("");
                //  filterMean();
              }
            }}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Type"
            values={doropdownTypes}
            onChange={(event) => {
              const index = event.target.selectedIndex - 1;
              if (index !== -1) {
                const item = event.target.value;
                setSelectedTypeIndex(index);
                setSelectedType(item);
                // Reset Storage Means
                //filterMean();
              } else {
                setSelectedTypeIndex(0);
                setSelectedType("");
                // Reset Storage Means
                //filterMean();
              }
            }}
            style={{ marginRight: "5px", maxWidth: 250 }}
          />
        </Form.Row>
        {/* <NavLink className={classes.link} to="/sites/archives">
          See archived sites
        </NavLink> */}
      </Form.Row>

      <Form.Row alignItems="center" noMargin className="mt-3">
        <Form.Row justifyContent="flex-start" noMargin>
          <FormSelect
            placeholder="Company"
            values={dropdownCompany}
            onChange={(event) => {
              const index = event.target.selectedIndex - 1;

              const item = event.target.value;

              if (index !== -1) {
                setSeletedCompanyIndex(index);
                setSelectedCompany(item);
                //   filterMean();
              } else {
                setSeletedCompanyIndex(0);
                setSelectedCompany("");
                // filterMean();
              }
            }}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Status"
            values={dropdownStatus}
            onChange={(event) => {
              const index = event.target.selectedIndex - 1;
              if (index !== -1) {
                const item = event.target.value;
                setSelectedStatusIndex(index);
                setSelectedStatus(item);
                // filterMean();
              } else {
                setSelectedStatusIndex(0);
                setSelectedStatus("");
                //filterMean();
              }
            }}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormInput
            type="date"
            placeholder="Start date"
            name="startDate"
            icon
            onChange={formik.handleChange}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormInput
            type="date"
            placeholder="End date"
            name="contractEndDate"
            icon
            onChange={formik.handleChange}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <SearchInput
            placeholder="Mean name"
            value={meanText}
            onIconButtonClick={() => {
              filterMean();
            }}
            onChange={(event) => {
              setMeanText(event.target.value);
            }}
            style={{ marginRight: "5px", maxWidth: 250 }}
          />
        </Form.Row>
      </Form.Row>
      <div className={classes.content}>
        <Table headers={GLOBALS.Data.means.headings} rows={rows} />
      </div>
    </div>
  );
};

export default Means;
