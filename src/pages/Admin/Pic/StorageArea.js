import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import { useFormik } from "formik";
import * as Yup from "yup";

// import * as Yup from "yup";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import MultiAdderInputModal from "../../../components/MultiAdderInputModal";

import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";
import { Images } from "../../../assets/Assets";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

// const addInvoiceYup = Yup.object().shape({
//   clientId: Yup.string().required("Required"),
//   startDate: Yup.string().required("Required"),
//   endDate: Yup.string().required("Required"),
//   siteId: Yup.string().required("Required"),
//   amount: Yup.number().min(1, "Must have a value").required("Required"),
//   description: Yup.string().optional(),
// });

export default function StorageArea(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [incident, setIncident] = useState([]);
  const [sites, setSites] = useState([]);

  const [incidentId, setIncidentId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [siteId, setSiteId] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    incident && fetchSitesByClient();
    // eslint-disable-next-line
  }, [incidentId]);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADD_INCIDENTS}`,
        token: store.token,
      });
      let itemsArray = result.data.items.map((item) => ({
        value: item._id,
        label: item.companyId.name,
      }));
      setIncident(itemsArray);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function fetchSitesByClient() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITE_BY_CLIENT}/${incidentId}`,
        token: store.token,
      });
      let itemsArray = result.data.items.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setSites(itemsArray);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const handleChange = (name, value) => {
    if (name === "clientId") setIncidentId(value);
    else if (name === "startDate") setStartDate(value);
    else if (name === "endDate") setEndDate(value);
    else if (name === "siteId") setSiteId(value);
    else if (name === "amount") setAmount(value);
    else if (name === "description") setDescription(value);
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formdata = JSON.stringify({
        incidentId: incidentId,
        startDate: startDate,
        endDate: endDate,
        siteId: siteId,
        amount: amount,
        description: description,
      });

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.INVOICES,
        token: store.token,
        body: formdata,
      });
      setLoading(false);
      props.history.goBack();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const addClientYup = Yup.object().shape({
    logo: Yup.array().min(1, "Required").required("Required"),
    name: Yup.string().required("Required"),
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
    notificationPriorToDays: Yup.number(),
    notificationTo: Yup.array(),
  });

  const formik = useFormik({
    initialValues: {
      logo: [],
      name: "",
      color: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      contractType: "CLIENTPERSITE",
      contractStartDate: "",
      contractEndDate: "",
      functionality: "DELIVERY",
      additionalInfo: "",
      notificationPriorToDays: "",
      notificationTo: [],
    },
    validationSchema: addClientYup,
    onSubmit,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
  });
  return (
    <div className={classes.root}>
      <Form.Row className="pr-5">
        <IconButton onClick={() => props.history.goBack()}>
          <BackArrow style={{ width: 30, height: 30 }} />
        </IconButton>

        <div
          style={{
            marginRight: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ marginRight: "8rem", color: "red" }}>
            <input type="checkbox" name="isFull" />
            <span>FULL ?</span>
          </div>
        </div>
      </Form.Row>
      <Heading primary="Storage Area" />
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary="NAME* :" />
            <Form.Row width="48%">
              <FormInput
                name="name"
                style={GLOBALS.Styles.inputWidth}
                placeholder="Name"
              />
              <FormInput
                name="color"
                style={GLOBALS.Styles.inputWidth}
                placeholder="Color"
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="DATE OF AVAILABILITIES* : " />
            <Form.Row noMargin width="48%">
              <FormInput
                type="date"
                name="startDate"
                value={startDate}
                // error={startDate}
                placeholder="Start date"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                type="date"
                name="endDate"
                value={endDate}
                // error={endDate}
                placeholder="End date"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="DELIVERY AREAS :" />
            <Form.Row style={{ width: "48%" }}>
              <MultiAdderInputModal
                name="addresses"
                values={addresses}
                // error={addresses}
                style={GLOBALS.Styles.inputWidth}
                placeholder="Enter site addresses"
                onChange={(values) => handleChange("addresses", values)}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="AVAILABLE MEANS" />
            <Form.Row width="48%">
              <div>Moyen 1</div>

              <div>Moyen 2</div>

              <div>Moyen 3</div>
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="UNAVAILABILITIES:" />
            <Form.Row style={{ width: "48%" }}>
              <Button
                fullWidth={false}
                text="SHOW THE UNAVAILABILITIES"
                style={{
                  backgroundColor: "#140772",
                  alignSelf: "flex-start",
                }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="COMPANIES ALLOWED :" />
            <Form.Row noMargin width="48%">
              <MultiAdderInputModal
                name="addresses"
                values={addresses}
                // error={addresses}
                style={GLOBALS.Styles.inputWidth}
                placeholder="Enter site addresses"
                onChange={(values) => handleChange("addresses", values)}
              />
            </Form.Row>
          </Form.Row>

          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="NOTIFICATION*:" />
            <Form.Row width="48%" justifyContent="flex-start">
              <Form.Row width="25%">
                <FormInput
                  type="number"
                  name="amount"
                  value={amount}
                  // error={amount}
                  style={GLOBALS.Styles.inputWidth}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </Form.Row>
              <span style={{ marginTop: "15px" }}>
                Jours avant la fin du contrat
              </span>
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="NOTIFY THE PEOPLE:" />

            <Form.Row noMargin width="48%">
              <MultiAdderInputModal
                name="addresses"
                values={addresses}
                // error={addresses}
                style={GLOBALS.Styles.inputWidth}
                placeholder="Enter site addresses"
                onChange={(values) => handleChange("addresses", values)}
              />
            </Form.Row>
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              loading={loading}
              disabled={
                loading ||
                !incidentId ||
                !startDate ||
                !endDate ||
                !siteId ||
                Number(amount) <= 0
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
