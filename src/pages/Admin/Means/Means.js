import React, { useState, useEffect } from "react";
import GLOBALS from "../../../globals";
import { makeStyles, useTheme } from "@material-ui/core/styles";
// import * as Yup from "yup";

import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../redux/actions";

import { useFormik } from "formik";
import IconButton from "@material-ui/core/IconButton";

// import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import SmallButton from "../../../components/SmallButton";
import SearchInput from "../../../components/SearchInput";
import FormInput from "../../../components/FormInput";

import SiteImage from "../../../assets/images/Site.png";
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

const Means = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page] = useState(1);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITES}?page=${page}`,
      });
      setItems(result.data.items);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const rows = GLOBALS.Data.means.items.map((item) => {
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

  async function onArchive(itemId) {
    try {
      if (window.confirm("Are you sure, you want to do this?")) {
        setLoading(true);
        await GLOBALS.API({
          method: "PUT",
          token: store.token,
          uri: GLOBALS.Constants.SITE_ARCHIVE + "/" + itemId,
        });
        const itemsArray = items.filter((item) => item._id !== itemId);
        setItems(itemsArray);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

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
              primary="TOTAL : 54 means"
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

      <Form.Row alignItems="center" noMargin className="mt-3">
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
          <FormInput
            type="date"
            style={GLOBALS.Styles.inputWidth}
            placeholder="Start date"
            name="contractStartDate"
            icon
            onChange={formik.handleChange}
            // value={formik.values.contractStartDate}
            // error={formik.errors.contractStartDate}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormInput
            type="date"
            style={GLOBALS.Styles.inputWidth}
            placeholder="End date"
            name="contractStartDate"
            icon
            onChange={formik.handleChange}
            // value={formik.values.contractStartDate}
            // error={formik.errors.contractStartDate}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <SearchInput
            placeholder="Mean name"
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
