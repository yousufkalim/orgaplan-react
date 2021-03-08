import React, { useState } from "react";
import { useFormik } from "formik";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import * as Yup from "yup";
import Chip from "@material-ui/core/Chip";

import GLOBALS from "../globals";

import Form from "./Form";
import Modal from "./Modal";
import Button from "./Button";
import FormLabel from "./FormLabel";
import FormSelect from "./FormSelect";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
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
    color: theme.palette.primary.contrastText,
    margin: theme.spacing(0.5),
  },
}));

const addUnavailabilityYup = Yup.object().shape({
  key: Yup.number().required("Required"),
  date: Yup.date().required("Required"),
  startHour: Yup.number().required("Required"),
  endHour: Yup.number().required("Required"),
  dayOff: Yup.bool().required("Required"),
  reason: Yup.string().optional(),
});

export default function MultiAdderInputModal(props) {
  const theme = useTheme();

  const classes = useStyles();

  const [modal, setModal] = useState(false);
  const [update, setUpdate] = useState(false);

  async function onSubmit(values) {
    let newValues = props.values;
    props.onChange(newValues);
    setUpdate((st) => !st);
    // setModal(false);
    formik.setSubmitting(false);
    formik.handleReset();
  }

  const handleDelete = (chipToDelete) => () => {
    const newValues = props.values.filter(
      (chip) => chip.key !== chipToDelete.key,
    );
    props.onChange(newValues);
  };

  const formik = useFormik({
    initialValues: {
      day1Start: 0,
      day1End: 23,
    },
    validationSchema: addUnavailabilityYup,
    onSubmit: onSubmit,
  });

  const values = [
    { value: 0, label: "0" },
    { value: 1, label: "1" },
  ];

  return (
    <>
      <Button
        minWidth={200}
        fullWidth={false}
        color={theme.palette.blue}
        text="SEE UNAVAILABILITIES"
        // onClick={() => setModal(true)}
      />
      {update && ""}
      <Modal
        open={modal}
        title="UNAVAILABILITIES"
        onClose={() => setModal((st) => !st)}
        body={
          <>
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
            <Form.Form onSubmit={formik.handleSubmit}>
              <Form.Row>
                <Form.Row noMargin>
                  <FormLabel noMargin bold primary="Day 1:" />
                </Form.Row>
                <Form.Row noMargin>
                  <FormSelect
                    values={values}
                    name="day1Start"
                    onChange={formik.handleChange}
                    value={formik.values.day1Start}
                    error={formik.errors.day1Start}
                    style={GLOBALS.Styles.inputWidth}
                  />
                  <FormSelect
                    name="day1End"
                    values={values}
                    value={formik.values.day1End}
                    error={formik.errors.day1End}
                    onChange={formik.handleChange}
                    style={GLOBALS.Styles.inputWidth}
                  />
                </Form.Row>
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
          </>
        }
      />
    </>
  );
}
