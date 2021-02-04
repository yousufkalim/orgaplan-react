import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Modal from "../../../components/Modal";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import SearchInput from "../../../components/SearchInput";
import AvatarUpload from "../../../components/AvatarUpload";

import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";

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
}));

export default function Profile(props) {
  const classes = useStyles();
  const theme = useTheme();

  const [modal, setModal] = useState(false);
  const [avatar, setAvatar] = useState("");

  return (
    <>
      <div className={classes.root}>
        <Form.Row alignItems="center">
          <Heading primary="ADMINS LIST" noWrap />
          <div>
            <Form.Row alignItems="center" noMargin>
              <SubHeading disableMargin primary="Total : 234 Admins" bold />
              <Button
                fullWidth={false}
                component={NavLink}
                text="CREATE AN ADMIN"
                style={{ marginLeft: "20px" }}
                to={"/admins/add-admin"}
              />
            </Form.Row>
          </div>
        </Form.Row>
        <Form.Row noMargin>
          <SearchInput placeholder="Name" />
        </Form.Row>
        <div className={classes.content}>
          <Table
            headers={GLOBALS.Data.admins.headings}
            rows={GLOBALS.Data.admins.items.map((item) => [
              ...item,
              <IconButton onClick={() => setModal(true)}>
                <Pencil style={{ width: 18, height: 18 }} />
              </IconButton>,
            ])}
          />
        </div>
      </div>
      <Modal
        open={modal}
        title={"Admin"}
        onClose={() => setModal((st) => !st)}
        body={
          <Form.Form>
            <Form.Row justifyContent="center">
              <AvatarUpload
                onChange={(file) => {
                  const uri = URL.createObjectURL(file);
                  setAvatar({ file, uri });
                }}
                value={avatar}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormInput
                placeholder="E-mail Address"
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormInput
                placeholder="Phone"
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormSelect
                // value={color}
                placeholder="Company"
                style={GLOBALS.Styles.inputWidth}
                // onChange={({ target: { name, value } }) => setColor(value)}
                values={[
                  "Green",
                  "Yellow",
                  "Red",
                  "Blue",
                  "Orange",
                  "Purple",
                  "Magenta",
                ]}
              />
            </Form.Row>
          </Form.Form>
        }
        actions={
          <Form.Column alignItems="center">
            <Form.Row justifyContent="center">
              <Button text="VALIDATE" fullWidth={false} minWidth="30%" />
            </Form.Row>
            <Form.Row justifyContent="center">
              <Button
                text="DELETE"
                fullWidth={false}
                minWidth="30%"
                color={theme.palette.error.main}
              />
            </Form.Row>
          </Form.Column>
        }
      />
    </>
  );
}
