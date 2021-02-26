import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import * as Yup from "yup";

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

const addInvoiceYup = Yup.object().shape({
  clientId: Yup.string().required("Required"),
  startData: Yup.string().required("Required"),
  endData: Yup.string().required("Required"),
  siteId: Yup.string().required("Required"),
  amount: Yup.number().min(1, "Must have a value").required("Required"),
  description: Yup.string().optional(),
});

export default function AddInvoice(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.CLIENTS}`,
      });
      let itemsArray = result.data.items.map((item) => ({
        value: item._id,
        label: item.companyId.name,
      }));
      setItems(itemsArray);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const onSubmit = async (values) => {
    console.log(store);
    // const formdata = JSON.stringify({
    //   clientId: values.clientId,
    //   startData: values.startData,
    //   endData: values.endData,
    //   siteId: values.siteId,
    //   amount: values.amount,
    //   description: values.description,
    // });

    // await GLOBALS.API({
    //   method: "POST",
    //   uri: GLOBALS.Constants.INVOICES,
    // token: store.token
    //   body: formdata,
    // });
    formik.setSubmitting(false);
    // props.history.goBack();
  };

  const formik = useFormik({
    initialValues: {
      clientId: "",
      startData: "",
      endData: "",
      siteId: "",
      amount: 0,
      description: "",
    },
    validationSchema: addInvoiceYup,
    onSubmit,
  });

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD AN INVOICE" />
      <div className={classes.content}>
        <Form.Form onSubmit={formik.handleSubmit}>
          <Form.Row>
            <FormLabel bold primary="CLIENT NAME* :" />
            <FormSelect
              values={items}
              name="clientId"
              placeholder="Client Name"
              onChange={formik.handleChange}
              value={formik.values.clientId}
              error={formik.errors.clientId}
              style={GLOBALS.Styles.inputWidth}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="INVOICE DATES* : " />
            <Form.Row noMargin width="48%">
              <FormInput
                type="date"
                name="startData"
                placeholder="Start date"
                onChange={formik.handleChange}
                value={formik.values.startData}
                error={formik.errors.startData}
                style={GLOBALS.Styles.inputWidth}
              />
              <FormInput
                type="date"
                name="endData"
                placeholder="End date"
                value={formik.values.endData}
                error={formik.errors.endData}
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="CONSTRUCTION SITE*:" />
            <FormSelect
              name="siteId"
              values={items}
              value={formik.values.siteId}
              error={formik.errors.siteId}
              onChange={formik.handleChange}
              placeholder="Construction Site"
              style={GLOBALS.Styles.inputWidth}
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="AMOUNT*:" />
            <FormInput
              type="number"
              name="amount"
              value={formik.values.amount}
              error={formik.errors.amount}
              onChange={formik.handleChange}
              style={GLOBALS.Styles.inputWidth}
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="DESCRIPTION:" />
            <FormInput
              textArea
              rows={3}
              name="description"
              placeholder="Description"
              onChange={formik.handleChange}
              style={GLOBALS.Styles.inputWidth}
              value={formik.values.description}
              error={formik.errors.description}
            />
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting}
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
