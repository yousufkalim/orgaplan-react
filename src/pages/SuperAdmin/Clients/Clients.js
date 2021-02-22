import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import moment from "moment";
import * as Yup from "yup";
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
  companyLogo: Yup.mixed(),
  companyColor: Yup.string().required("Required"),
  companyResponsibleFirstName: Yup.string().required("Required"),
  companyResponsibleLastName: Yup.string().required("Required"),
  companyResponsibleEmail: Yup.string().required("Required"),
  companyResponsiblePhone: Yup.number()
    .test(
      "len",
      "Must be exactly 10 characters",
      (val) => val && val.toString().length === 10,
    )
    .required("Required"),
  typeOfContract: Yup.string().required("Required"),
  contractStartDate: Yup.string().required("Required"),
  contractEndDate: Yup.string().required("Required"),
  functionalitySubscribed: Yup.string().required("Required"),
  additionalInformation: Yup.string(),
  notificationPriorToDays: Yup.number(),
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

  async function verifyClient(clientId, contractId) {
    try {
      if (window.confirm("Are you sure about this?")) {
        setLoading(true);
        const result = await GLOBALS.API({
          method: "PUT",
          uri: `${GLOBALS.Constants.CLIENTS_VERIFY}/${clientId}/${contractId}`,
        });
        const itemsArray = items.map((item) =>
          item._id === clientId ? result.data : item,
        );
        setItems(itemsArray);
        setLoading(false);
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err, "error"),
        ),
      );
    }
  }

  const onUpdate = async (values) => {
    var formdata = new FormData();
    formdata.append("logo", values.companyLogo.file);
    formdata.append("color", values.companyColor);
    formdata.append("clientId", selectedItem._id);
    formdata.append("userId", selectedItem.userId._id);
    formdata.append("contractId", selectedItem.contract._id);
    formdata.append("companyId", selectedItem.companyId._id);
    formdata.append("firstName", values.companyResponsibleFirstName);
    formdata.append("lastName", values.companyResponsibleLastName);
    formdata.append("email", values.companyResponsibleEmail);
    formdata.append("phone", values.companyResponsiblePhone);
    formdata.append("contractType", values.typeOfContract);
    formdata.append("contractStartDate", values.contractStartDate);
    formdata.append("contractEndDate", values.contractEndDate);
    formdata.append("functionality", values.functionalitySubscribed);
    formdata.append("additionalInfo", values.additionalInformation);
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
  };

  const formik = useFormik({
    initialValues: {
      companyLogo: "",
      companyColor: "",
      companyResponsibleFirstName: "",
      companyResponsibleLastName: "",
      companyResponsibleEmail: "",
      companyResponsiblePhone: "",
      typeOfContract: "",
      contractStartDate: "",
      contractEndDate: "",
      functionalitySubscribed: "",
      additionalInformation: "",
      notificationPriorToDays: "",
      monthlyCost: "",
    },
    validationSchema: updateClientYup,
    onSubmit: onUpdate,
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
          <Table
            headers={GLOBALS.Data.clients.headings}
            rows={items.map((item) => {
              const sendTo = [
                item.companyId.name,
                item.companyId.incharge.firstName +
                  " " +
                  item.companyId.incharge.lastName,
                item.companyId.incharge.phone,
                0,
                item.contract.isPendingResponse
                  ? "-"
                  : moment(item.contract.contractStartDate).format("DD/MM/YY"),
                item.contract.isPendingResponse
                  ? "-"
                  : moment(item.contract.contractEndDate).format("DD/MM/YY"),
                item.contract.isPendingResponse
                  ? "Requested"
                  : item.contract.contractType,
              ];
              return sendTo[6] === "Requested"
                ? [
                    ...sendTo,
                    <IconButton
                      disabled={loading}
                      onClick={() => {
                        setSelectedItem(item);
                        verifyClient(item._id, item.contract._id);
                      }}
                    >
                      <Plus style={{ width: 18, height: 18 }} />
                    </IconButton>,
                  ]
                : [
                    ...sendTo,
                    <>
                      <IconButton
                        disabled={loading}
                        onClick={() => {
                          setSelectedItem(item);
                          formik.setValues({
                            // the type of `values` inferred to be Blog
                            companyLogo: {
                              uri:
                                GLOBALS.Constants.BASE_URL +
                                item.companyId.logo,
                            },
                            companyColor: item.companyId.color,
                            companyResponsibleFirstName:
                              item.companyId.incharge.firstName,
                            companyResponsibleLastName:
                              item.companyId.incharge.lastName,
                            companyResponsibleEmail:
                              item.companyId.incharge.email,
                            companyResponsiblePhone:
                              item.companyId.incharge.phone,
                            typeOfContract: item.contract.contractType,
                            contractStartDate: moment(
                              item.contract.contractStartDate,
                            ).format("YYYY-MM-DD"),
                            contractEndDate: moment(
                              item.contract.contractEndDate,
                            ).format("YYYY-MM-DD"),
                            functionalitySubscribed:
                              item.contract.functionality,
                            additionalInformation: item.contract.additionalInfo,
                            notificationPriorToDays:
                              item.contract.notificationPriorToDays,
                            monthlyCost: item.contract.monthlyCost || 0,
                          });
                          setModal(true);
                        }}
                      >
                        <Pencil style={{ width: 18, height: 18 }} />
                      </IconButton>
                      <IconButton
                        disabled={loading}
                        component={NavLink}
                        to={`/clients/invoices/${item._id}`}
                      >
                        <Report style={{ width: 18, height: 18 }} />
                      </IconButton>
                    </>,
                  ];
            })}
          />
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
                  formik.setFieldValue("companyLogo", { file, uri });
                }}
                value={formik.values.companyLogo}
                error={formik.errors.companyLogo}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormSelect
                placeholder="Color"
                name="companyColor"
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.companyColor}
                error={formik.errors.companyColor}
                values={[
                  "Green",
                  "Yellow",
                  "Red",
                  "Blue",
                  "Orange",
                  "Purple",
                  "Magenta",
                ]}
              />
            </Form.Row>
            <Form.Row>
              <FormInput
                placeholder="First Name"
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
                name="companyResponsibleFirstName"
                value={formik.values.companyResponsibleFirstName}
                error={formik.errors.companyResponsibleFirstName}
              />
              <FormInput
                placeholder="Last Name"
                onChange={formik.handleChange}
                name="companyResponsibleLastName"
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.companyResponsibleLastName}
                error={formik.errors.companyResponsibleLastName}
              />
            </Form.Row>
            <Form.Row>
              <FormInput
                placeholder="E-mail Address"
                onChange={formik.handleChange}
                name="companyResponsibleEmail"
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.companyResponsibleEmail}
                error={formik.errors.companyResponsibleEmail}
              />
              <FormInput
                placeholder="Phone Number"
                onChange={formik.handleChange}
                name="companyResponsiblePhone"
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.companyResponsiblePhone}
                error={formik.errors.companyResponsiblePhone}
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
                name="typeOfContract"
                style={GLOBALS.Styles.inputWidth}
                value={formik.values.typeOfContract}
                error={formik.errors.typeOfContract}
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
                name="functionalitySubscribed"
                onChange={formik.handleChange}
                value={formik.values.functionalitySubscribed}
                error={formik.errors.functionalitySubscribed}
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
                name="additionalInformation"
                value={formik.values.additionalInformation}
                error={formik.errors.additionalInformation}
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
