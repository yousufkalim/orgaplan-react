import React from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import SubHeading from "../../../components/SubHeading";
import SearchInput from "../../../components/SearchInput";

import { ReactComponent as Plus } from "../../../assets/icons/Plus.svg";
import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";
import { ReactComponent as Report } from "../../../assets/icons/Report.svg";

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
      <Form.Row alignItems="center">
        <Heading primary="CLIENTS LIST" noWrap />
        <div>
          <Form.Row alignItems="center">
            <SubHeading disableMargin primary="Total : 234 Clients" bold />
            <Button
              fullWidth={false}
              component={NavLink}
              text="CREATE A CLIENT"
              style={{ marginLeft: "20px" }}
              to={"/clients/add-client"}
            />
          </Form.Row>
        </div>
      </Form.Row>
      <Form.Row>
        <SearchInput placeholder="Name of Client" />
      </Form.Row>
      <div className={classes.content}>
        <Table
          headers={GLOBALS.Data.clients.headings}
          rows={GLOBALS.Data.clients.items.map((item) =>
            item[6] === "Requested"
              ? [
                  ...item,
                  <IconButton>
                    <Plus style={{ width: 18, height: 18 }} />
                  </IconButton>,
                ]
              : [
                  ...item,
                  <>
                    <IconButton>
                      <Pencil style={{ width: 18, height: 18 }} />
                    </IconButton>
                    <IconButton component={NavLink} to="/clients/invoices">
                      <Report style={{ width: 18, height: 18 }} />
                    </IconButton>
                  </>,
                ],
          )}
        />
      </div>
    </div>
  );
}
