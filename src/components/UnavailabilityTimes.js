import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import * as Yup from "yup";
import Input from "./Input";
import moment from "moment";
import Form from "./Form";
import Modal from "./Modal";
import Button from "./Button";
import FormLabel from "./FormLabel";
import FormSelect from "./FormSelect";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Actions from "../redux/actions";

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
  const { unavailabilityDates, setUnavailabilityDates } = props;
  const dispatch = useDispatch();
  const theme = useTheme();

  const classes = useStyles();

  const [modal, setModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [time, setTime] = useState({
    start: "0",
    end: "23",
  });
  const [dayOff, setDayOff] = useState(false);

  async function onSubmit(values) {
    let newValues = props.values;
    props.onChange(newValues);
    setUpdate((st) => !st);
    // setModal(false);
    formik.setSubmitting(false);
    formik.handleReset();
  }
  const getTime = (e) => {
    setTime({ ...time, [e.target.name]: e.target.value });
  };
  const getDate = (e) => {
    setDate(e.target.value);
  };
  const getreason = (e) => {
    setReason(e.target.value);
  };
  const deleteUnavailability = (id) => {
    let deleteArray = [];
    unavailabilityDates.map(
      (key, index) => index !== id && (deleteArray[index] = key),
    );
    setUnavailabilityDates(deleteArray);
  };

  const handledayOff = (event) => {
    setDayOff(event.target.checked);

    if (event.target.checked) {
      time.start = "0";
      time.end = "0";
      setTime(time);
    } else {
      time.start = "0";
      time.end = "23";
      setTime(time);
    }
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
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
    { value: 13, label: "13" },
    { value: 14, label: "14" },
    { value: 15, label: "15" },
    { value: 16, label: "16" },
    { value: 17, label: "17" },
    { value: 18, label: "18" },
    { value: 19, label: "19" },
    { value: 20, label: "20" },
    { value: 21, label: "21" },
    { value: 22, label: "22" },
    { value: 23, label: "23" },
  ];

  const unavailabilityDatesHandal = () => {
    let newDate = new Date();
    let formDate = new Date(date);
    const newarray = {
      date: date,
      startHour: time.start,
      endHour: time.end,
      dayOff: dayOff,
      reason: reason,
    };
    if (
      (parseInt(time.start) < parseInt(time.end) ||
        (time.start === "0" && time.end === "0")) &&
      newDate.getDate() <= formDate.getDate() &&
      newDate.getMonth() + 1 <= formDate.getMonth() + 1 &&
      newDate.getFullYear() <= formDate.getFullYear() &&
      date !== ""
    ) {
      setUnavailabilityDates((prevState) => [...prevState, newarray]);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar("Added Successfully", "success"),
        ),
      );
      // set value are all value empty
      setDate("");
      setReason("");
      setTime({
        start: "0",
        end: "23",
      });
      setDayOff(false);
      // set value are all value empty
    } else {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar("Invalid", "error"),
        ),
      );
    }
  };

  return (
    <>
      <Button
        minWidth={200}
        fullWidth={false}
        color={theme.palette.blue}
        text="SEE UNAVAILABILITIES"
        onClick={() => setModal(true)}
      />
      {update && ""}
      <Modal
        open={modal}
        title="UNAVAILABILITIES"
        onClose={() => setModal((st) => !st)}
        body={
          <>
            <Form.Form>
              <Form.Row>
                <Form.Row noMargin>
                  <FormLabel disableMargin bold primary="Date:" />
                </Form.Row>
                <Form.Row noMargin>
                  <Input
                    name="date"
                    type="date"
                    value={date}
                    className={classes.input}
                    onChange={getDate}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dayOff}
                        onChange={handledayOff}
                        name="dayOff"
                        color="primary"
                      />
                    }
                    label="Day Off"
                  />
                </Form.Row>
              </Form.Row>
              <Form.Row style={{ display: dayOff ? "none" : "flex" }}>
                <Form.Row noMargin>
                  <FormLabel disableMargin bold primary="Time:" />
                </Form.Row>

                <Form.Row noMargin>
                  <FormSelect
                    values={values}
                    name="start"
                    value={time.start}
                    onChange={getTime}
                    style={{ "margin-right": "5px" }}
                  />

                  <FormSelect
                    name="end"
                    values={values}
                    value={time.end}
                    onChange={getTime}
                  />
                </Form.Row>
              </Form.Row>

              <Form.Row>
                <Form.Row noMargin>
                  <FormLabel disableMargin bold primary="Reason:" />
                </Form.Row>

                <Form.Row noMargin>
                  <textarea
                    name="reason"
                    rows="3"
                    value={reason}
                    onChange={getreason}
                    maxLength="50"
                    minLength="3"
                    placeholder="Reason"
                    style={{ width: "100%" }}
                  />
                </Form.Row>
              </Form.Row>

              <Form.Row>
                <Form.Row noMargin></Form.Row>

                <Form.Row noMargin justifyContent="center">
                  <Button
                    minWidth={200}
                    onClick={unavailabilityDatesHandal}
                    text="Add"
                    fullWidth={false}
                  />
                </Form.Row>
              </Form.Row>
            </Form.Form>
            <table className="table">
              {unavailabilityDates.length > 0 && (
                <>
                  <tr>
                    <th>Date</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                  {unavailabilityDates.map((key, index) => {
                    return (
                      <tr key={index}>
                        <td> {moment(key.date).format("YYYY-MM-DD")} </td>
                        <td>{key.startHour}</td>
                        <td>{key.endHour}</td>
                        <td>{key.reason}</td>
                        <td>
                          <button
                            onClick={() => {
                              deleteUnavailability(index);
                            }}
                            className="btn btn-danger"
                            style={{ "font-size": "13px", padding: "0px 12px" }}
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </table>
          </>
        }
      />
    </>
  );
}
