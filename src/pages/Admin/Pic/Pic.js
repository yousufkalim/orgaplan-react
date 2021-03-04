import React from "react";
import "./Pic.css";
import GLOBALS from "../../../globals";
import { makeStyles } from "@material-ui/core/styles";

import { NavLink } from "react-router-dom";

import { Images } from "../.../../../../assets/Assets";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormSelect from "../../../components/FormSelect";

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
  link: {
    marginRight: 20,
    whiteSpace: "nowrap",
    color: theme.palette.primary.contrastText,
  },
  image: {
    height: 70,
    borderRadius: theme.shape.borderRadius,
  },
}));

const Pic = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Form.Row alignItems="center">
        <Heading primary="PIC" noWrap />
      </Form.Row>

      <Form.Row alignItems="center" noMargin className="mt-3">
        <Form.Row justifyContent="flex-start" noMargin>
          <FormSelect
            placeholder="Select a building"
            values={[
              { value: "green", label: "Green" },
              { value: "Yellow", label: "Yellow" },
              { value: "Red", label: "Red" },
              { value: "Blue", label: "Blue" },
              { value: "Orange", label: "Orange" },
              { value: "Purple", label: "Purple" },
              { value: "Magenta", label: "Magenta" },
            ]}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Select a level"
            values={[
              { value: "green", label: "Green" },
              { value: "Yellow", label: "Yellow" },
              { value: "Red", label: "Red" },
              { value: "Blue", label: "Blue" },
              { value: "Orange", label: "Orange" },
              { value: "Purple", label: "Purple" },
              { value: "Magenta", label: "Magenta" },
            ]}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
        </Form.Row>
      </Form.Row>
      <div className="admin-pic">
        <div className="admin-pic-image">
          <img src={Images.picMap} alt="img" />
        </div>
        <div className="admin-pic-content">
          <Button
            fullWidth={false}
            component={NavLink}
            text="EDIT THIS MAP"
            to={"/sites/add-mean"}
            style={{
              marginLeft: "10px",
              marginBottom: "7px",
              width: "270px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          />
          <Button
            fullWidth={false}
            component={NavLink}
            text="EDIT THE PLAN"
            to={"/sites/add-mean"}
            style={{
              marginLeft: "10px",
              marginBottom: "7px",
              width: "270px",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "1.5rem",
            }}
          />
          <div className="admin-pic-content-historic">
            Historic of the plans
          </div>
          <img src={Images.mapIcon} className="admin-pic-map-icon" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Pic;
