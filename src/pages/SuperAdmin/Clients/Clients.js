import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
// import * as Yup from "yup";
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

// const updateClientYup = Yup.object().shape({
//   logo: Yup.mixed(),
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
//   monthlyCost: Yup.number().test("len", "Invalid", (val) => Number(val) >= 0),
// });

export default function Clients(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [items, setItems] = useState([]);
  const [page] = useState(1);

  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedNestedItem, setSelectedNestedItem] = useState("");

  const [logo, setLogo] = useState([]);
  const [color, setColor] = useState("green");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contractType, setContractType] = useState("CLIENTPERSITE");
  const [contractStartDate, setContractStartDate] = useState("");
  const [contractEndDate, setContractEndDate] = useState("");
  const [functionality, setFunctionality] = useState("DELIVERY");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [monthlyCost, setMonthlyCost] = useState("0");

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
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const handleChange = (name, value) => {
    if (name === "logo") {
      setUpdate((st) => !st);
      setLogo(value);
    } else if (name === "color") setColor(value);
    else if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "email") setEmail(value);
    else if (name === "phone") setPhone(value);
    else if (name === "contractType") setContractType(value);
    else if (name === "contractStartDate") setContractStartDate(value);
    else if (name === "contractEndDate") setContractEndDate(value);
    else if (name === "functionality") setFunctionality(value);
    else if (name === "additionalInfo") setAdditionalInfo(value);
    else if (name === "monthlyCost") setMonthlyCost(value);
  };

  function modifyClick(item, contract) {
    setSelectedItem(item);
    setSelectedNestedItem(contract);
    setLogo({
      uri: GLOBALS.Constants.BASE_URL + item.companyId.logo,
    });
    setColor(item.companyId.color);
    console.log(item.companyId.incharge);
    if (item.companyId.incharge) {
      setFirstName(item.companyId.incharge.firstName || "");
      setLastName(item.companyId.incharge.lastName || "");
      setEmail(item.companyId.incharge.email || "");
      setPhone(item.companyId.incharge.phone || "");
    }
    setContractType(contract.contractType);
    if (contract.contractType === "MASTERCLIENT") {
      setContractStartDate(
        moment(contract.contractStartDate).format("YYYY-MM-DD"),
      );
      setContractEndDate(moment(contract.contractEndDate).format("YYYY-MM-DD"));
    }
    setFunctionality(contract.functionality);
    setAdditionalInfo(contract.additionalInfo);
    setMonthlyCost(contract.monthlyCost || 0);
    setModal(true);
  }

  async function onUpdate(e) {
    try {
      e.preventDefault();
      setLoading(true);
      var formdata = new FormData();
      logo.file && formdata.append("logo", logo.file);
      formdata.append("color", color);
      formdata.append("clientId", selectedItem._id);
      formdata.append("contractId", selectedNestedItem._id);
      formdata.append("companyId", selectedItem.companyId._id);
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("email", email);
      formdata.append("phone", phone);
      formdata.append("contractType", contractType);
      formdata.append("contractStartDate", contractStartDate);
      formdata.append("contractEndDate", contractEndDate);
      formdata.append("functionality", functionality);
      formdata.append("additionalInfo", additionalInfo);
      formdata.append("monthlyCost", monthlyCost);

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

  async function onDelete(itemId) {
    try {
      if (window.confirm("Are you sure, you want to delete this?")) {
        setLoading(true);
        await GLOBALS.API({
          method: "DELETE",
          token: store.token,
          uri: GLOBALS.Constants.CLIENT_DELETE + "/" + itemId,
        });
        const itemsArray = items.filter((item) => item._id !== itemId);
        setItems(itemsArray);
        setModal(false);
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

  const rows = [];
  items.map((item) => {
    if (item.companyId.quoteVerified) {
      item.contractsIds.map((contract) => {
        rows.push([
          item.companyId.name,
          item.companyId.incharge
            ? `${item.companyId.incharge.firstName} ${item.companyId.incharge.lastName}`
            : "",
          item.companyId.incharge ? item.companyId.incharge.phone : "",
          0,
          contract.contractType === "MASTERCLIENT"
            ? moment(contract.contractStartDate).format("DD/MM/YY")
            : "-",
          contract.contractType === "MASTERCLIENT"
            ? moment(contract.contractEndDate).format("DD/MM/YY")
            : "-",
          contract.contractType,
          <>
            <IconButton
              disabled={loading}
              onClick={() => modifyClick(item, contract)}
            >
              <Pencil style={{ width: 15, height: 15 }} />
            </IconButton>
            <IconButton
              disabled={loading}
              component={NavLink}
              to={`/clients/invoices/${item._id}`}
            >
              <Report style={{ width: 15, height: 15 }} />
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
          <Plus style={{ width: 15, height: 15 }} />
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
              <SubHeading
                disableMargin
                primary={`Total : ${rows.length} Clients`}
                bold
              />
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
      {update && ""}
      <Modal
        title="EDIT CLIENT"
        open={selectedItem ? modal : false}
        onClose={() => setModal((st) => !st)}
        body={
          <Form.Form onSubmit={onUpdate}>
            <Form.Row justifyContent="center">
              <AvatarUpload
                value={logo}
                // error={logo}
                onChange={(file) => {
                  const uri = URL.createObjectURL(file);
                  handleChange("logo", { file, uri });
                }}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormSelect
                name="color"
                value={color}
                // error={color}
                placeholder="Color"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
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
                name="firstName"
                value={firstName}
                // error={firstName}
                placeholder="First Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                name="lastName"
                value={lastName}
                // error={lastName}
                placeholder="Last Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
            <Form.Row>
              <FormInput
                name="email"
                value={email}
                // error={email}
                placeholder="E-mail Address"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                name="phone"
                value={phone}
                // error={phone}
                placeholder="Phone Number"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
            <Form.Row>
              <FormInput
                type="date"
                placeholder="Start date"
                name="contractStartDate"
                value={contractStartDate}
                // error={contractStartDate}
                style={GLOBALS.Styles.inputWidth}
                disabled={contractType !== "MASTERCLIENT"}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                type="date"
                placeholder="End date"
                name="contractEndDate"
                value={contractEndDate}
                // error={contractEndDate}
                style={GLOBALS.Styles.inputWidth}
                disabled={contractType !== "MASTERCLIENT"}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
            <Form.Row>
              <RadioButton
                name="contractType"
                style={GLOBALS.Styles.inputWidth}
                value={contractType}
                // error={contractType}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
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
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                value={functionality}
                // error={functionality}
                items={[{ value: "DELIVERY", label: "Delivery module" }]}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <Form.Row noMargin alignItems="center" width="150px">
                <FormInput
                  type="number"
                  name="monthlyCost"
                  onChange={({ target: { name, value } }) =>
                    value >= 0 && handleChange(name, value)
                  }
                  value={monthlyCost}
                  // error={monthlyCost}
                  style={{ ...GLOBALS.Styles.inputWidth, maxWidth: 100 }}
                />
                <SmallText primary="€/month" />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <FormInput
                textArea
                rows={3}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                placeholder="Additional information"
                name="additionalInfo"
                value={additionalInfo}
                // error={additionalInfo}
              />
            </Form.Row>
            <Form.Column alignItems="center">
              <Form.Row justifyContent="center">
                <Button
                  type="submit"
                  minWidth={200}
                  text="VALIDATE"
                  fullWidth={false}
                  loading={loading}
                  disabled={
                    loading ||
                    !logo ||
                    (contractType === "MASTERCLIENT" &&
                      (!contractStartDate ||
                        !contractEndDate ||
                        moment(contractEndDate).diff(
                          moment(contractStartDate),
                          "days",
                        ) <= 0)) ||
                    firstName.length > 30 ||
                    lastName.length > 30 ||
                    (phone.length > 0 &&
                      (!phone.startsWith("0") || phone.length !== 10)) ||
                    additionalInfo.length > 300 ||
                    Number(monthlyCost) < 0
                  }
                />
              </Form.Row>
              <Form.Row justifyContent="center">
                <Button
                  text="DELETE"
                  minWidth="30%"
                  fullWidth={false}
                  loading={loading}
                  disabled={loading}
                  onClick={() => onDelete(selectedItem._id)}
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
