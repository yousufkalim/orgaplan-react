import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
// import * as Yup from "yup";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Modal from "../../../components/Modal";
import SmallButton from "../../../components/SmallButton";

import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import SearchInput from "../../../components/SearchInput";
import AvatarUpload from "../../../components/AvatarUpload";

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

// const updateAdminYup = Yup.object().shape({
//   email: Yup.string().required("Required"),
//   phone: Yup.number()
//     .test(
//       "len",
//       "Must be exactly 10 characters",
//       (val) => val && val.toString().length === 10,
//     )
//     .required("Required"),
//   image: Yup.object().optional(""),
//   companyId: Yup.string().required("Required"),
// });

export default function UserList(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [page] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedItem] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    fetchData();
    console.log("items", items);
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const admins = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMINS}?page=${page}`,
      });
      const companies = await GLOBALS.API({
        uri: `${GLOBALS.Constants.COMPANY}`,
      });

      const companiesArray = [];
      companies.data.items.map((item) => {
        if (!item.adminId) {
          companiesArray.push({
            value: item._id,
            label: item.name,
          });
        }
        return true;
      });

      setItems(admins.data.items);
      setCompanies(companiesArray);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const handleChange = (name, value) => {
    if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "phone") setPhone(value);
    else if (name === "image") setImage(value);
    else if (name === "companyId") setCompanyId(value);
  };

  const onUpdate = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      var formdata = new FormData();
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("phone", phone);
      formdata.append("companyId", companyId);
      formdata.append("userId", selectedItem._id);
      image.file && formdata.append("image", image.file);

      const result = await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.ADMINS,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      const itemsArray = items.map((item) =>
        item._id === selectedItem._id ? result.data : item,
      );
      setItems(itemsArray);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const rows = GLOBALS.Data.userList.items.map((item) => {
    return [
      ...item,
      <SmallButton
        text="Edit"
        onClick={handleClickOpen}
        color={theme.palette.primary.contrastText}
        to={"/companies"}
        // component={NavLink}
        style={{
          marginLeft: 10,
          borderRadius: 4,
        }}
      />,
    ];
  });

  return (
    <>
      <div className={classes.root}>
        <Form.Row alignItems="center" className="pr-3">
          <Heading primary="LIST OF USERS" noWrap />
          <div>
            <Form.Row alignItems="center" noMargin>
              <SubHeading noMargin primary="Total : 234 Users" bold />
              <Button
                fullWidth={false}
                component={NavLink}
                text="ADD A USER"
                style={{ marginLeft: "20px" }}
                to={"/companies/add-user"}
              />
            </Form.Row>
          </div>
        </Form.Row>
        {companies && ""}
        <Form.Row noMargin>
          <Form.Row style={{ justifyContent: "flex-start" }} noMargin>
            <SearchInput placeholder="Name OF USER" />
            <SearchInput
              style={{ marginLeft: "20px" }}
              placeholder="Name OF COMPANY"
            />
          </Form.Row>
        </Form.Row>
        <div className={classes.content}>
          <Table headers={GLOBALS.Data.userList.headings} rows={rows} />
        </div>
      </div>
      <Modal
        title="THEIRRY MARLES"
        open={open}
        onClose={() => setOpen(false)}
        body={
          <Form.Form onSubmit={onUpdate}>
            <Form.Row justifyContent="center">
              <AvatarUpload
                value={image}
                // error={image}
                onChange={(file) => {
                  const uri = URL.createObjectURL(file);
                  handleChange("image", { file, uri });
                }}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormInput
                name="thier@contrco.com"
                value={firstName}
                // error={firstName}
                placeholder="First Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormInput
                name="lastName"
                value={lastName}
                // error={lastName}
                placeholder="Last Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormSelect
                placeholder="Company"
                name="color"
                style={GLOBALS.Styles.inputWidth}
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
            <Form.ButtonContainer>
              <Button
                type="submit"
                minWidth={200}
                text="VALIDATE"
                fullWidth={false}
                disabled={loading}
              />
            </Form.ButtonContainer>
          </Form.Form>
        }
      />
    </>
  );
}
