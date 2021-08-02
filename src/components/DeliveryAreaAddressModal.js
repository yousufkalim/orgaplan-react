import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import moment from "moment";
import { TEXTS } from "../assets/languages/french";

import Form from "./Form";
import Modal from "./Modal";
import Button from "./Button";
import GLOBALS from "../globals";
import FormInput from "./FormInput";
import FormLabel from "./FormLabel";
import FormMultipleUpload from "./FormMultipleUpload";

import { ReactComponent as Plus } from "../assets/icons/Plus.svg";

export default function MultiAdderInputModal(props) {
  const theme = useTheme();
  const {
    VALIDATE,
    LOCATION,
    AVAILABILITIES,
    START_DATE,
    END_DATE,
    ADD_ADDRESS,
  } = TEXTS;
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState([]);
  const [location, setLocation] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleChange = (name, value) => {
    if (name === "location") {
      if (!GLOBALS.Functions.empty(value)) {
        setLocation(value);
        setErrors({ ...errors, location: "" });
      } else if (GLOBALS.Functions.empty(value)) {
        setErrors({ ...errors, location: "location is required" });
        setLocation("");
      }
    } else if (name === "image") setImage(value);
    else if (name === "startDate") {
      if (value && value.length > 1) {
        setStartDate(value);
        setErrors({ ...errors, startDate: "" });
      } else if ((value && value.length < 1) || value === null) {
        setStartDate("");
        setErrors({ ...errors, startDate: "Please enter starting date" });
      }
    } else if (name === "endDate") setEndDate(value);
  };

  async function onSubmit() {
    let newValues = props.values;

    setLoading(true);
    const formdataImage = new FormData();
    formdataImage.append("image", image[0].file);

    const imageData = await GLOBALS.API({
      method: "POST",
      uri: `${GLOBALS.Constants.FILE_UPLOAD}/delivery-area`,
      headers: {},
      body: formdataImage,
    });

    let imageAr = image;
    delete imageAr[0].file;
    imageAr[0].uri = imageData.image;

    const values = {
      _id: newValues.length,
      image: imageAr,
      endDate: endDate,
      location: location,
      startDate: startDate,
      label: `${location}`,
    };
    newValues.push(values);
    props.onChange(newValues);

    setUpdate((st) => !st);
    setLoading(false);
    setModal(false);
    setLocation("");
    setImage([]);
    setEndDate("");
    setStartDate("");
    props.handleFormFilling();
  }

  const handleDelete = (value) => () => {
    const newValues = props.values.filter((chip) => chip._id !== value._id);
    props.onChange(newValues);
    setUpdate((st) => !st);
  };

  function validation(name, value) {
    if (name === "location") {
      if (GLOBALS.Functions.empty(value)) {
        setErrors({ ...errors, location: "Location is required" });
      } else setErrors({ ...errors, location: "" });
    }
  }
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
              <li key={data._id}>
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
        title={ADD_ADDRESS}
        open={modal}
        onClose={() => setModal((st) => !st)}
        body={
          <Form.Form>
            <Form.Row>
              <FormLabel bold primary="Address * :" />
              <Form.Row
                noMargin
                width="65%"
                justifyContent="flex-start"
                style={{ gap: "20px" }}
              >
                <FormInput
                  name="location"
                  maxLength="80"
                  value={location}
                  error={errors.location}
                  placeholder={LOCATION}
                  onBlur={({ target: { name, value } }) =>
                    validation(name, value)
                  }
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <FormLabel bold primary="PDF * :" />
              <Form.Row
                noMargin
                width="65%"
                style={{ gap: "20px" }}
                justifyContent="flex-start"
              >
                <FormMultipleUpload
                  name="image"
                  values={image}
                  fileTypes={["application/pdf"]}
                  onChange={(values) => handleChange("image", values)}
                />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <FormLabel bold primary={`${AVAILABILITIES}*:`} />
              <Form.Row
                noMargin
                width="65%"
                justifyContent="flex-start"
                style={{ gap: "20px" }}
              >
                <FormInput
                  type="date"
                  name="startDate"
                  error={errors.startDate}
                  value={startDate}
                  placeholder={START_DATE}
                  min={moment(props.min).format("YYYY-MM-DD")}
                  max={moment(props.max).format("YYYY-MM-DD")}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
                <FormInput
                  type="date"
                  placeholder={END_DATE}
                  name="endDate"
                  value={endDate}
                  min={moment(startDate).add(1, "days").format("YYYY-MM-DD")}
                  max={moment(props.max).format("YYYY-MM-DD")}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </Form.Row>
            </Form.Row>
            <Form.Row justifyContent="center">
              <Button
                minWidth={200}
                text={VALIDATE}
                loading={loading}
                fullWidth={false}
                onClick={onSubmit}
                disabled={
                  !location || !startDate || !endDate || loading || !image
                }
              />
            </Form.Row>
          </Form.Form>
        }
      />
    </>
  );
}
