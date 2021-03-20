import React, { useState, useEffect } from "react";
import GLOBALS from "../../../globals";
import { makeStyles } from "@material-ui/core/styles";
// import * as Yup from "yup";
import { useSelector } from "react-redux";

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
  const [completeIncidents, setCompleteIncidents] = useState([]);
  const [items, setItems] = useState([]);
  const [siteDeliveryArea, setSiteDeliveryArea] = useState([]);
  const [siteStorageArea, setSiteStorageArea] = useState([]);
  const [siteComapny, setSiteComapny] = useState([]);
  const [siteBuilding, setSiteBuilding] = useState([]);   
  const [status, setStatus] = useState([]);
  const [type, setType] = useState([]);

  // const [page, setPage] = useState("");
  const adminStore = useSelector((state) => state.admin);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ALL_SITE_INCIDENTS}/${adminStore.site.siteId._id}`,
      });
      console.log(result.data);
      if (result.success) {
        setIncidents(result.data.incidents);
        setCompleteIncidents(result.data.incidents);

        if (result.data.incidents) getIncidentsfiltered(result.data.incidents);
        if (result.data.site_delivery_areas) {
            getDeliveryArea(result.data.site_delivery_areas);
        }  if (result.data.site_storage_areas) {
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

    function getCompanies(data) {
      console.log(data);
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

  function getStorageArea(data){
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
    setType(temp);
  }

  function getDeliveryArea(data) {
    let temp = [];
    data.map((item, index) => {
        return temp.push({
          label: item.name,
          value: item._id,
        });
    })
    setSiteDeliveryArea(temp);
  }


  function getIncidentsfiltered(data) {
    let temp = [];
    data.map((item, index) => {
      let data = [];
      data[0] = item?.date;
      data[1] = item?.type;
      data[2] = item?.name;
      data[3] = item.companyId?.name;
      data[4] = item.companyId?.status;
      data[5] = item.location?.deliveryArea?.name;
      data[6] = item?.isBillable ? "Yes" : "No";
      data[7] = item?.price;
      data[8] = item?.isBillable ? "Yes" : "No";

      return temp.push(data);
    });
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
        <div>
          <Form.Row alignItems="flex-start" noMargin justifyContent="flex-end">
            <SubHeading
              noMargin
              topPadding
              style={{ color: "#F80303" }}
              primary="TOTAL : 5 RE-INVOICING
              345€ 
"
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
            values={[
              { value: "green", label: "Green" },
              { value: "Yellow", label: "Yellow" },
              { value: "Red", label: "Red" },
              { value: "Blue", label: "Blue" },
              { value: "Orange", label: "Orange" },
              { value: "Purple", label: "Purple" },
              { value: "Magenta", label: "Magenta" },
            ]}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Level"
            values={[
              { value: "green", label: "Green" },
              { value: "Yellow", label: "Yellow" },
              { value: "Red", label: "Red" },
              { value: "Blue", label: "Blue" },
              { value: "Orange", label: "Orange" },
              { value: "Purple", label: "Purple" },
              { value: "Magenta", label: "Magenta" },
            ]}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Storage area"
            values={siteStorageArea}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Type"
            values={type}
            style={{ marginRight: "5px", maxWidth: 250 }}
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
            values={siteComapny}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />

          <FormInput
            type="date"
            placeholder="Start date"
            name="startDate"
            icon
            // onChange={formik.handleChange}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormInput
            type="date"
            placeholder="End date"
            name="endDate"
            // icon
            // onChange={formik.handleChange}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Status"
            values={status}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <SearchInput
            placeholder="Designation"
            style={{ marginRight: "5px", maxWidth: 250 }}
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
