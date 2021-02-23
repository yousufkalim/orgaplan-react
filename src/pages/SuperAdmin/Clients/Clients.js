import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import * as Yup from "yup";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import SmallText from "../../../components/SmallText";
import SubHeading from "../../../components/SubHeading";
import FormSelect from "../../../components/FormSelect";
import RadioButton from "../../../components/RadioButton";
import SearchInput from "../../../components/SearchInput";
import AvatarUpload from "../../../components/AvatarUpload";

import { ReactComponent as Plus } from "../../../assets/icons/Plus.svg";
import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";
import { ReactComponent as Report } from "../../../assets/icons/Report.svg";

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
}));

const updateClientYup = Yup.object().shape({
  logo: Yup.mixed(),
  color: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().required("Required"),
  phone: Yup.number()
    .test(
      "len",
      "Must be exactly 10 characters",
      (val) => val && val.toString().length === 10,
    )
    .required("Required"),
  contractType: Yup.string().required("Required"),
  contractStartDate: Yup.string().required("Required"),
  contractEndDate: Yup.string().required("Required"),
  functionality: Yup.string().required("Required"),
  additionalInfo: Yup.string(),
  monthlyCost: Yup.number().test("len", "Invalid", (val) => Number(val) >= 0),
});

export default function Clients(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedNestedItem, setSelectedNestedItem] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.CLIENTS}?page=${page}`,
      });
      setItems(result.data.items);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err, "error"),
        ),
      );
    }
  }

  async function onUpdate(values) {
    var formdata = new FormData();
    formdata.append("logo", values.logo.file);
    formdata.append("color", values.color);
    formdata.append("clientId", selectedItem._id);
    formdata.append("userId", selectedItem.userId._id);
    formdata.append("contractId", selectedNestedItem._id);
    formdata.append("companyId", selectedItem.companyId._id);
    formdata.append("firstName", values.firstName);
    formdata.append("lastName", values.lastName);
    formdata.append("email", values.email);
    formdata.append("phone", values.phone);
    formdata.append("contractType", values.contractType);
    formdata.append("contractStartDate", values.contractStartDate);
    formdata.append("contractEndDate", values.contractEndDate);
    formdata.append("functionality", values.functionality);
    formdata.append("additionalInfo", values.additionalInfo);
    formdata.append("monthlyCost", values.monthlyCost);

    const result = await GLOBALS.API({
      method: "PUT",
      uri: GLOBALS.Constants.CLIENTS,
      headers: {
        Authorization: store.token,
      },
      body: formdata,
    });
    const itemsArray = items.map((item) =>
      item._id === selectedItem._id ? result.data : item,
    );
    setItems(itemsArray);
    setModal(false);
    formik.setSubmitting(false);
  }

  const formik = useFormik({
    initialValues: {
      logo: "",
      color: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      contractType: "",
      contractStartDate: "",
      contractEndDate: "",
      functionality: "",
      additionalInfo: "",
      monthlyCost: "",
    },
    validationSchema: updateClientYup,
    onSubmit: onUpdate,
  });

  function modifyClick(item, contract) {
    setSelectedItem(item);
    setSelectedNestedItem(contract);
    formik.setValues({
      logo: {
        uri: GLOBALS.Constants.BASE_URL + item.companyId.logo,
      },
      color: item.companyId.color,
      firstName: item.companyId.incharge.firstName,
      lastName: item.companyId.incharge.lastName,
      email: item.companyId.incharge.email,
      phone: item.companyId.incharge.phone,
      contractType: contract.contractType,
      contractStartDate: moment(contract.contractStartDate).format(
        "YYYY-MM-DD",
      ),
      contractEndDate: moment(contract.contractEndDate).format("YYYY-MM-DD"),
      functionality: contract.functionality,
      additionalInfo: contract.additionalInfo,
      monthlyCost: contract.monthlyCost || 0,
    });
    setModal(true);
  }

  const rows = [];
  items.map((item) => {
    if (item.contract.length > 0) {
      item.contract.map((contract) => {
        rows.push([
          item.companyId.name,
          item.companyId.incharge.firstName +
            " " +
            item.companyId.incharge.lastName,
          item.companyId.incharge.phone,
          0,
          contract.isPendingResponse
            ? "-"
            : moment(contract.contractStartDate).format("DD/MM/YY"),
          contract.isPendingResponse
            ? "-"
            : moment(contract.contractEndDate).format("DD/MM/YY"),
          contract.isPendingResponse ? "Requested" : contract.contractType,
          <>
            <IconButton
              disabled={loading}
              onClick={() => modifyClick(item, contract)}
            >
              <Pencil style={{ width: 18, height: 18 }} />
            </IconButton>
            <IconButton
              disabled={loading}
              component={NavLink}
              to={`/clients/invoices/${item._id}/${contract._id}`}
            >
              <Report style={{ width: 18, height: 18 }} />
            </IconButton>
          </>,
        ]);
        return true;
      });
    } else {
      rows.push([
        item.companyId.name,
        item.companyId.incharge.firstName +
          " " +
          item.companyId.incharge.lastName,
        item.companyId.incharge.phone,
        0,
        "-",
        "-",
        "Requested",
        <IconButton
          disabled={loading}
          onClick={() =>
            props.history.push({
              pathname: "/clients/verify-client",
              item,
            })
          }
        >
          <Plus style={{ width: 18, height: 18 }} />
        </IconButton>,
      ]);
      return true;
    }
    return true;
  });

  return (
    <>
      <div className={classes.root}>
        <Form.Row alignItems="center">
          <Heading primary="CLIENTS LIST" noWrap />
          <div>
            <Form.Row alignItems="center" noMargin>
              <SubHeading disableMargin primary="Total : 234 Clients" bold />
              <Button
                fullWidth={false}
                component={NavLink}
                text="CREATE A CLIENT"
                style={{ marginLeft: "20px" }}
                to={"/clients/add-client"}
              />
            </Form.Row>
          </div>
        </Form.Row>
        <Form.Row noMargin>
          <SearchInput placeholder="Name of Client" />
        </Form.Row>
        <div className={classes.content}>
          <Table headers={GLOBALS.Data.clients.headings} rows={rows} />
        </div>
      </div>
      <Modal
        title="EDIT CLIENT"
        open={selectedItem ? modal : false}
        onClose={() => setModal((st) => !st)}
        body={
          <Form.Form onSubmit={formik.handleSubmit}>
            <Form.Row justifyContent="center">
              <AvatarUpload
                onChange={(file) => {
                  const uri = URL.createObjectURL(file);
                  formik.setFieldValue("logo", { file, uri });
                }}
                value={formik.values.logo}
                error={formik.errors.logo}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormSelect
                placeholder="Color"
                name="color"
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.color}
                error={formik.errors.color}
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
            </Form.Row>
            <Form.Row>
              <FormInput
                placeholder="First Name"
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
                name="firstName"
                value={formik.values.firstName}
                error={formik.errors.firstName}
              />
              <FormInput
                placeholder="Last Name"
                onChange={formik.handleChange}
                name="lastName"
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.lastName}
                error={formik.errors.lastName}
              />
            </Form.Row>
            <Form.Row>
              <FormInput
                placeholder="E-mail Address"
                onChange={formik.handleChange}
                name="email"
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.email}
                error={formik.errors.email}
              />
              <FormInput
                placeholder="Phone Number"
                onChange={formik.handleChange}
                name="phone"
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.phone}
                error={formik.errors.phone}
              />
            </Form.Row>
            <Form.Row>
              <FormInput
                type="date"
                placeholder="Start date"
                name="contractStartDate"
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.contractStartDate}
                error={formik.errors.contractStartDate}
              />
              <FormInput
                type="date"
                placeholder="End date"
                name="contractEndDate"
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.contractEndDate}
                error={formik.errors.contractEndDate}
              />
            </Form.Row>
            <Form.Row>
              <RadioButton
                name="contractType"
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.contractType}
                error={formik.errors.contractType}
                onChange={formik.handleChange}
                items={[
                  { value: "CLIENTPERSITE", label: "Per Site" },
                  { value: "MASTERCLIENT", label: "Master Contract" },
                ]}
              />
            </Form.Row>
            <Form.Row>
              <RadioButton
                style={GLOBALS.Styles.inputWidth}
                name="functionality"
                onChange={formik.handleChange}
                value={formik.values.functionality}
                error={formik.errors.functionality}
                items={[{ value: "DELIVERY", label: "Delivery module" }]}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <Form.Row noMargin alignItems="center" width="150px">
                <FormInput
                  type="number"
                  name="monthlyCost"
                  onChange={formik.handleChange}
                  value={formik.values.monthlyCost}
                  error={formik.errors.monthlyCost}
                  style={{ ...GLOBALS.Styles.inputWidth, maxWidth: 100 }}
                />
                <SmallText primary="€/month" />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <FormInput
                textArea
                rows={3}
                onChange={formik.handleChange}
                placeholder="Additional information"
                name="additionalInfo"
                value={formik.values.additionalInfo}
                error={formik.errors.additionalInfo}
              />
            </Form.Row>
            <Form.Column alignItems="center">
              <Form.Row justifyContent="center">
                <Button
                  type="submit"
                  minWidth="30%"
                  text="VALIDATE"
                  fullWidth={false}
                  loading={formik.isSubmitting}
                  disabled={formik.isSubmitting}
                />
              </Form.Row>
              <Form.Row justifyContent="center">
                <Button
                  text="DELETE"
                  minWidth="30%"
                  fullWidth={false}
                  disabled={formik.isSubmitting}
                  color={theme.palette.error.main}
                />
              </Form.Row>
            </Form.Column>
          </Form.Form>
        }
      />
    </>
  );
}
