import React from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormSelect from "../../../components/FormSelect";
import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";
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
        <Heading primary="INVOICE" />
        <Button
          fullWidth={false}
          component={NavLink}
          text="CREATE AN INVOICE"
          to={"/clients/add-invoice"}
        />
      </Form.Row>
      <Form.Row>
        <FormSelect
          placeholder="Client"
          values={[
            "Green",
            "Yellow",
            "Red",
            "Blue",
            "Orange",
            "Purple",
            "Magenta",
          ]}
          style={{ maxWidth: 250 }}
        />
      </Form.Row>
      <div className={classes.content}>
        <Table
          headers={GLOBALS.Data.invoices.headings}
          rows={GLOBALS.Data.invoices.items.map((item) => [
            ...item,
            <>
              <IconButton>
                <Pencil style={{ width: 18, height: 18 }} />
              </IconButton>
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
