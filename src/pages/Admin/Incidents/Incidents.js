import React, { useState, useEffect } from "react";
import GLOBALS from "../../../globals";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";

import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import SearchInput from "../../../components/SearchInput";
import FormInput from "../../../components/FormInput";

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

const Incidents = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const store = useSelector((state) => state.auth);

  // const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [items, setItems] = useState([]);
  const [siteDeliveryArea, setSiteDeliveryArea] = useState([]);
  const [siteStorageArea, setSiteStorageArea] = useState([]);
  const [siteComapny, setSiteComapny] = useState([]); // setselectedStatus
  const [selectedStatus, setselectedStatus] = useState([]);
  const [status, setStatus] = useState([]);
  // const [status, setStatus] = useState([]);
  const [tatalInvoices, seTatalInvoices] = useState([]);
  const [tatalPrice, seTatalPrice] = useState([]);
  const [nameText, setNameText] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [siteBuilding, setSiteBuilding] = useState([]);

  // const [page, setPage] = useState("");
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filterIncidents();
    // eslint-disable-next-line
  }, [nameText, companyId, selectedType, selectedStatus, startDate]);

  async function fetchData() {
    try {
      if (props?.location?.companyId) {
        setCompanyId(props?.location?.companyId);
      }
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ALL_SITE_INCIDENTS}/${adminStore.site.siteId._id}`,
      });
      if (result.success) {
        setIncidents(result.data.incidents);

        if (result.data.incidents) {
          seTatalInvoices(result.data.incidents.length);
          getIncidentsfiltered(result.data.incidents);
        }
        if (result.data.site_delivery_areas) {
          getDeliveryArea(result.data.site_delivery_areas);
        }
        if (result.data.site_storage_areas) {
          getStorageArea(result.data.site_storage_areas);
        }
        if (result.data.type) {
          getType(result.data.type);
        }
        if (result.data.status) {
          getStatus(result.data.status);
        }
        if (result.data.site_companies) {
          getCompanies(result.data.site_companies);
        }
        if (result.data.site_buildings) {
          getBuildingLocation(result.data.site_buildings);
        }
      }
      // setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function filterIncidents() {
    try {
      setLoading(true);
      const params = { siteId: adminStore.site.siteId._id };
      if (nameText.length !== 0) params["name"] = nameText;

      if (companyId.length !== 0) params["company"] = companyId;

      if (selectedType.length !== 0) params["type"] = selectedType;
      if (selectedStatus.length !== 0) params["status"] = selectedStatus;
      if (!isNaN(moment(startDate))) params["startDate"] = startDate;
      // if (!isNaN(moment(formik.values.contractEndDate)))
      // params["endDate"] = formik.values.contractEndDate;

      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.FILTER_INCIDENT}`,
        token: store.token,
        method: "POST",
        body: JSON.stringify(params),
      });
      if (response.success) {
        getIncidentsfiltered(response.data);
        // setItems(temp);
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
  }

  function getBuildingLocation(data) {
    let temp = [];
    data.map((item, index) => {
      return temp.push({
        label: item.name,
        value: item._id,
      });
    });
    setSiteBuilding(temp);
  }
  function getCompanies(data) {
    let temp = [];
    data.map((item, index) => {
      return temp.push({
        label: item.companyId.name,
        value: item.companyId._id,
      });
    });
    setSiteComapny(temp);
  }
  function getStatus(data) {
    let temp = [];
    data.map((item, index) => {
      return temp.push({
        label: item,
        value: item,
      });
    });
    setStatus(temp);
  }

  function getStorageArea(data) {
    let temp = [];
    data.map((item, index) => {
      return temp.push({
        label: item.name,
        value: item._id,
      });
    });
    setSiteStorageArea(temp);
  }

  function getType(data) {
    let temp = [];
    data.map((item, index) => {
      return temp.push({
        label: item,
        value: item,
      });
    });
  }

  function getDeliveryArea(data) {
    let temp = [];
    data.map((item, index) => {
      return temp.push({
        label: item.name,
        value: item._id,
      });
    });
    setSiteDeliveryArea(temp);
  }

  function getIncidentsfiltered(data) {
    let temp = [];
    let total = 0;

    data.map((item, index) => {
      total = total + item.price;
      let data = [];
      data[0] = item.date ? moment(item.date).format("MM/DD/yyyy") : " ";
      data[1] = item?.type;
      data[2] = item?.name;
      data[3] = item.companyId?.name;
      data[4] = item.status;
      data[5] = item.location?.deliveryArea?.name;
      data[6] = item?.isBillable ? "Yes" : "No";
      data[7] = item?.price;
      data[8] = item?.isBillable ? "Yes" : "No";
      return temp.push(data);
    });
    seTatalPrice(total);
    setItems(temp);
  }

  const rows = items.map((item, index) => {
    return [
      item[0] ? item[0] : "",
      item[1] ? item[1] : " ",
      item[2] ? item[2] : " ",
      item[3] ? item[3] : " ",
      item[4] ? item[4] : " ",
      item[5] ? item[5] : " ",
      item[6] ? item[6] : " ",
      item[7] ? item[7] : " ",
      item[8] ? item[8] : " ",
    ];
  });

  return (
    <div className={classes.root}>
      <Form.Row alignItems="center">
        <Heading icon primary="RE-INVOICING" noWrap />
        {loading && ""}
        <div>
          <Form.Row alignItems="flex-start" noMargin justifyContent="flex-end">
            <SubHeading
              noMargin
              topPadding
              style={{ color: "#F80303" }}
              primary={`TOTAL: ${tatalInvoices} RE-INVOICING
              ${tatalPrice}€`}
              bold
            />
            <Form.Column style={{ width: "50%" }}>
              <Button
                fullWidth={false}
                component={NavLink}
                text="CREATE AN INCIDENT"
                to={"/incidents/add-incidents"}
                style={{
                  marginLeft: "20px",
                  marginBottom: "7px",
                  width: "200px",
                  fontWeight: "bold",
                  backgroundColor: "#F80303",
                }}
              />
              {/* <Button
                fullWidth={false}
                component={NavLink}
                text="MEANS REQUEST"
                to={"/sites/means-request"}
                style={{ marginLeft: "20px", width: "200px" }}
              /> */}
            </Form.Column>
          </Form.Row>
        </div>
      </Form.Row>
      <Form.Row alignItems="center" noMargin>
        <Form.Row justifyContent="flex-start" noMargin>
          {/* <SearchInput
            placeholder="Site name"
            style={{ marginRight: "20px", maxWidth: 250 }}
          /> */}
          <FormSelect
            placeholder="Delivery area"
            values={siteDeliveryArea}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Location"
            values={siteBuilding}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Level"
            values={[]}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Storage area"
            values={siteStorageArea}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Type"
            values={[
              { value: "INCIDENT", label: "Incident" },
              { value: "MEAN", label: "Mean" },
              { value: "DELAY", label: "Delay" },
              { value: "UNEXPRECTED", label: "Unexp" },
            ]}
            style={{ marginRight: "5px", maxWidth: 250 }}
            onChange={(event) => {
              const index = event.target.selectedIndex - 1;
              if (index !== -1) {
                const item = event.target.value;
                setSelectedType(item);
                // Reset Storage Means
                //filterMean();
              } else {
                setSelectedType("");
                // Reset Storage Means
                //filterMean();
              }
            }}
          />
        </Form.Row>
        {/* <NavLink className={classes.link} to="/sites/archives">
          See archived sites
        </NavLink> */}
      </Form.Row>

      <Form.Row alignItems="center" className="mt-3">
        <Form.Row justifyContent="flex-start" noMargin>
          <FormSelect
            placeholder="Company"
            value={companyId} //working
            values={siteComapny}
            onChange={(event) => {
              setCompanyId(event.target.value);
            }}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />

          <FormInput
            type="date"
            placeholder="Start date"
            name="startDate"
            icon
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            // onChange={formik.handleChange}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormInput
            type="date"
            placeholder="End date"
            name="endDate"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            // icon
            // onChange={formik.handleChange}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            values={status}
            style={{ marginRight: "20px", maxWidth: 250 }}
            onChange={(event) => {
              setselectedStatus(event.target.value);
            }}
          />
          <SearchInput
            placeholder="Designation"
            style={{ marginRight: "5px", maxWidth: 250 }}
            onChange={(event) => {
              setNameText(event.target.value);
            }}
          />
        </Form.Row>
      </Form.Row>
      <div className={classes.content}>
        <Table
          headers={GLOBALS.Data.incidents.headings}
          rows={rows}
          onClick={(e) => {
            return props.history.push({
              pathname: "/incidents/edit-incidents",
              data: incidents[e],
            });
          }}
        />
      </div>
    </div>
  );
};

export default Incidents;
