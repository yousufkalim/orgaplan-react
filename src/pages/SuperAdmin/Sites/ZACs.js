import React from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import { ReactComponent as Cross } from "../../../assets/icons/Cross.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "40px 15px",
  },
  content: {
    padding: 15,
    marginTop: 10,
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function Profile(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Form.Row>
        <Heading primary="ZACS LIST" />
        <Button
          fullWidth={false}
          component={NavLink}
          text="CREATE A ZAC"
          to={"/sites/add-zac"}
        />
      </Form.Row>
      <div className={classes.content}>
        <Table
          headers={GLOBALS.Data.zacs.headings}
          rows={GLOBALS.Data.zacs.items.map((item) => [
            ...item,
            <>
              <IconButton>
                <Cross style={{ width: 18, height: 18, color: "red" }} />
              </IconButton>
            </>,
          ])}
        />
      </div>
    </div>
  );
}
