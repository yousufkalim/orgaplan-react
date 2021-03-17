import React, { useEffect } from "react";
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

const Incidents = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const store = useSelector((state) => state.auth);

  // const [loading, setLoading] = useState(true);
  // const [items, setItems] = useState([]);
  // const [page, setPage] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      // const result = await GLOBALS.API({
      //   // uri: `${GLOBALS.Constants.SITES}?page=${page}`,
      // });
      // setItems(result.data.items);
      // setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const rows = GLOBALS.Data.incidents.items.map((item) => [...item]);

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

  return (
    <div className={classes.root}>
      <Form.Row alignItems="center">
        <Heading icon primary="RE-INVOICING" noWrap />
        <div>
          <Form.Row alignItems="flex-start" noMargin justifyContent="flex-end">
            <SubHeading
              disableMargin
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
            placeholder="Type"
            values={[
              { value: "green", label: "Green" },
              { value: "Yellow", label: "Yellow" },
              { value: "Red", label: "Red" },
              { value: "Blue", label: "Blue" },
              { value: "Orange", label: "Orange" },
              { value: "Purple", label: "Purple" },
              { value: "Magenta", label: "Magenta" },
            ]}
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
            name="endDate"
            icon
            onChange={formik.handleChange}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Status"
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
          <SearchInput
            placeholder="Designation"
            style={{ marginRight: "5px", maxWidth: 250 }}
          />
        </Form.Row>
      </Form.Row>
      <div className={classes.content}>
        <Table headers={GLOBALS.Data.incidents.headings} rows={rows} />
      </div>
    </div>
  );
};

export default Incidents;
