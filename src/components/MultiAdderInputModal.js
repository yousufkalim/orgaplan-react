import React, { useState } from "react";
import { useFormik } from "formik";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";

import Form from "./Form";
import Modal from "./Modal";
import Button from "./Button";
import FormInput from "./FormInput";

import { ReactComponent as Plus } from "../assets/icons/Plus.svg";

const addAddressesYup = Yup.object().shape({
  street: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  postal: Yup.string().required("Required"),
});

export default function MultiAdderInputModal(props) {
  const theme = useTheme();

  const error = theme.palette.error.main;
  const white = theme.palette.common.white;
  const primaryColor = theme.palette.primary.contrastText;
  const borderColor = props.error ? error : theme.palette.grey[100];

  const useStyles = makeStyles((theme) => ({
    root: {
      position: "relative",
    },
    container: {
      width: 45,
      height: 45,
      outline: 0,
      borderWidth: 1,
      display: "grid",
      cursor: "pointer",
      borderStyle: "solid",
      placeItems: "center",
      backgroundColor: white,
      borderColor: borderColor,
    },
    chips: {
      margin: 0,
      marginTop: 15,
      display: "flex",
      flexWrap: "wrap",
      listStyle: "none",
      justifyContent: "center",
    },
    chip: {
      color: primaryColor,
      margin: theme.spacing(0.5),
    },
    error: {
      color: error,
      fontWeight: 400,
      position: "absolute",
      fontSize: theme.typography.pxToRem(12),
    },
  }));

  const classes = useStyles();
  const [modal, setModal] = useState(false);
  const [update, setUpdate] = useState(false);

  async function onUpdate(values) {
    let newValues = props.values;
    newValues.push({
      key: newValues.length,
      street: values.street,
      city: values.city,
      postal: values.postal,
      label: `${values.street} ${values.city} ${values.postal}`,
    });
    props.onChange(newValues);
    setUpdate((st) => !st);
    setModal(false);
    formik.setSubmitting(false);
    formik.handleReset();
  }

  const handleDelete = (value) => () => {
    const newValues = props.values.filter((chip) => chip.key !== value.key);
    props.onChange(newValues);
    setUpdate((st) => !st);
  };

  const formik = useFormik({
    initialValues: {
      street: "",
      city: "",
      postal: "",
    },
    validationSchema: addAddressesYup,
    onSubmit: onUpdate,
  });

  return (
    <>
      <div className={`${classes.root} ${props.className}`} style={props.style} >
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <div className={classes.container}>
              <div onClick={() => {setModal(true); props.onBlur()}}>
                <Plus style={{ width: 20, height: 20 }} />
              </div>
            </div>
            {props.error !== "" && (
              <span className={classes.error}>{props.error}</span>
            )}
          </Grid>
          {update && ""}
          <ul className={classes.chips}>
            {props.values.map((data) => (
              <li key={data.key}>
                <Chip
                  label={data.label}
                  className={classes.chip}
                  onDelete={handleDelete(data)}
                />
              </li>
            ))}
          </ul>
        </Grid>
      </div>
      <Modal
        title="ADD ADDRESS"
        open={modal}
        onClose={() => setModal((st) => !st)}
        body={
          <Form.Form onSubmit={formik.handleSubmit}>
            <Form.Row>
              <FormInput
                name="street"
                placeholder="Street"
                value={formik.values.street}
                error={formik.errors.street}
                onChange={formik.handleChange}
              />
            </Form.Row>
            <Form.Row>
              <FormInput
                name="city"
                placeholder="City"
                value={formik.values.city}
                error={formik.errors.city}
                onChange={formik.handleChange}
              />
            </Form.Row>
            <Form.Row>
              <FormInput
                name="postal"
                placeholder="Postal"
                value={formik.values.postal}
                error={formik.errors.postal}
                onChange={formik.handleChange}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <Button
                type="submit"
                minWidth={200}
                text="VALIDATE"
                fullWidth={false}
                loading={formik.isSubmitting}
                disabled={formik.isSubmitting}
              />
            </Form.Row>
          </Form.Form>
        }
      />
    </>
  );
}
