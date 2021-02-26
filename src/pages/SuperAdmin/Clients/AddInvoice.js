import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
// import * as Yup from "yup";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";

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

export default function AddInvoice(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);

  const [clientId, setClientId] = useState("");
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
    clientId && fetchSitesByClient();
    // eslint-disable-next-line
  }, [clientId]);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.CLIENTS}`,
        token: store.token,
      });
      let itemsArray = result.data.items.map((item) => ({
        value: item._id,
        label: item.companyId.name,
      }));
      setClients(itemsArray);
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
        uri: `${GLOBALS.Constants.SITE_BY_CLIENT}/${clientId}`,
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
    if (name === "clientId") setClientId(value);
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
        clientId: clientId,
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

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD AN INVOICE" />
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary="CLIENT NAME* :" />
            <FormSelect
              name="clientId"
              values={clients}
              value={clientId}
              // error={clientId}
              placeholder="Select Client"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="INVOICE DATES* : " />
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
            <FormLabel bold primary="CONSTRUCTION SITE*:" />
            <FormSelect
              name="siteId"
              value={siteId}
              values={sites}
              // error={siteId}
              placeholder="Select Site"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="AMOUNT*:" />
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
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="DESCRIPTION:" />
            <FormInput
              textArea
              rows={3}
              name="description"
              value={description}
              // error={description}
              placeholder="Description"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
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
                !clientId ||
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
