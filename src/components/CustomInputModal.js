import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
// import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import { useFormik } from "formik";
import GLOBALS from "../globals";
import FormSelect from "../components/FormSelect";



import Form from "./Form";
import Modal from "./Modal";
import Button from "./Button";
import FormInput from "./FormInput";

import { ReactComponent as Plus } from "../assets/icons/Plus.svg";

// const addAddressesYup = Yup.object().shape({
//   street: Yup.string().required("Required"),
//   city: Yup.string().required("Required"),
//   postal: Yup.string().required("Required"),
// });

export default function CustomInputModal(props) {
  const theme = useTheme();

  const error = theme.palette.error.main;
  const white = theme.palette.common.white;
  const primaryColor = theme.palette.primary.contrastText;
  const borderColor = props.error ? error : theme.palette.grey[100];

  const formik = useFormik({
    initialValues: {
      logo: [],
      name: "",
      storage: "",
      deliveryAreas:"",
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
    
    onSubmit,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
  });

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

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");

  const handleChange = (name, value) => {
    if (name === "street") setStreet(value);
    else if (name === "city") setCity(value);
    else if (name === "postal") setPostal(value);
  };

  async function onSubmit() {
    let newValues = props.values;

    const values = {
      key: newValues.length,
      street: street,
      city: city,
      postal: postal,
      label: `${street} ${city} ${postal}`,
    };
    newValues.push(values);
    props.onChange(newValues);

    setUpdate((st) => !st);
    setModal(false);
    setStreet("");
    setCity("");
    setPostal("");
  }

  const handleDelete = (value) => () => {
    const newValues = props.values.filter((chip) => chip.key !== value.key);
    props.onChange(newValues);
    setUpdate((st) => !st);
  };

  return (
    <>
      <div className={`${classes.root} ${props.className}`} style={props.style}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <div className={classes.container}>
              <div
                onClick={() => {
                  setModal(true);
                  props.onBlur && props.onBlur();
                }}
              >
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
        title="ADD LOCATION"
        open={modal}
        onClose={() => setModal((st) => !st)}
        body={
          <Form.Form>
            
            <Form.Row>
            <FormSelect
                placeholder="Storage"
                name="Storage"
                style={GLOBALS.Styles.inputWidth}
                onChange={formik.handleChange}
                value={formik.values.storage}
                error={formik.errors.storage}
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
              <FormSelect
                placeholder="Delivery Areas"
                name="deliveryAreas"
                style={GLOBALS.Styles.inputWidth}
                onChange={formik.handleChange}
                value={formik.values.deliveryAreas}
                error={formik.errors.deliveryAreas}
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
            
    
            <Form.Row justifyContent="center">
              <Button
                minWidth={200}
                text="VALIDATE"
                fullWidth={false}
                onClick={onSubmit}
                disabled={ !formik.values.storage || !formik.values.deliveryAreas}
              />
            </Form.Row>
          </Form.Form>
        }
      />
    </>
  );
}
