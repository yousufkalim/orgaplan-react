import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Modal from "../../../components/Modal";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Loader from "../../../components/Loader";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import Pagination from "../../../components/Pagination";
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
  error: {
    color: "red",
  },
}));

export default function Admins(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [data, setData] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [update, setUpdate] = useState(false);

  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page]);

  async function fetchData() {
    try {
      setLoading(true);
      const admins = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMINS}?page=${page}&name=${query}`,
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
      setModal(false);
      setItems(admins.data.items);
      setCompanies(companiesArray);
      setData(admins.data);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function handleChange(name, value) {
    if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "phone") {
      setPhone(value);
      if (value.charAt(0) !== "0") {
        setPhoneError("Telephone shoud starts with 0");
      } else if (value.charAt(0) === "0" && value.length !== 10) {
        setPhoneError("Telephone must have 10 digits");
      } else {
        setPhoneError("");
      }
    } else if (name === "image") {
      setUpdate((st) => !st);
      setImage(value);
    } else if (name === "companyId") setCompanyId(value);
  }

  async function onUpdate(e) {
    try {
      e.preventDefault();
      setLoading(true);
      var formdata = new FormData();
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("phone", phone);
      formdata.append("companyId", companyId);
      formdata.append("adminId", selectedItem._id);
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
      setModal(false);
      setLoading(false);
      resetForm();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function onDelete(itemId) {
    try {
      if (window.confirm("Are you sure, you want to delete this?")) {
        setLoading(true);
        await GLOBALS.API({
          method: "DELETE",
          token: store.token,
          uri: GLOBALS.Constants.ADMIN_DELETE + "/" + itemId,
        });
        const itemsArray = items.filter((item) => item._id !== itemId);
        setItems(itemsArray);
        fetchData();
      }
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function resetForm() {
    setFirstName("");
    setLastName("");
    setPhone("");
    setImage("");
    setCompanyId("");
    setCompanyName("");
  }

  const rows = items.map((item) => {
    const sendTo = [
      item.company.name,
      item.firstName + " " + item.lastName,
      `0${item.phone}`,
      item.sites,
    ];
    return [
      ...sendTo,
      <IconButton
        onClick={() => {
          setSelectedItem(item);
          setImage({
            uri: GLOBALS.Constants.BASE_URL + item.image,
          });
          setFirstName(item.firstName);
          setLastName(item.lastName);
          setPhone(`0${item.phone}`);
          setCompanyId(item.company._id);
          setCompanyName(item.company.name);
          setModal(true);
        }}
      >
        <Pencil style={{ width: 15, height: 15 }} />
      </IconButton>,
    ];
  });

  return (
    <>
      <div className={classes.root}>
        <Form.Row alignItems="center">
          <Heading primary="ADMINS LIST" noWrap />
          <div>
            <Form.Row alignItems="center" noMargin>
              <SubHeading
                noMargin
                primary={data && `Total : ${data.totalItems} Admins`}
                bold
              />
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
          <SearchInput
            value={query}
            placeholder="Name"
            onClick={fetchData}
            onChange={({ target: { value } }) => setQuery(value)}
          />
        </Form.Row>
        <div className={classes.content}>
          {loading ? (
            <Loader.Progress />
          ) : (
            <Table headers={GLOBALS.Data.admins.headings} rows={rows} />
          )}
          {!loading && data.totalItems > 10 && (
            <Pagination
              page={page}
              count={data.totalPages}
              onChange={(e, value) => {
                setPage(value);
              }}
            />
          )}
        </div>
      </div>
      {update && ""}
      <Modal
        title="EDIT ADMIN"
        open={selectedItem ? modal : false}
        onClose={() => {
          setModal((st) => !st);
          resetForm();
          setPhoneError("");
        }}
        body={
          <Form.Form onSubmit={onUpdate}>
            <Form.Row justifyContent="center">
              <AvatarUpload
                value={image}
                onChange={(file) => {
                  const uri = URL.createObjectURL(file);
                  handleChange("image", { file, uri });
                }}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <div style={{ width: "50%" }}>
                <FormInput
                  name="firstName"
                  value={firstName}
                  placeholder="First Name"
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </div>
            </Form.Row>
            <Form.Row justifyContent="center">
              <div style={{ width: "50%" }}>
                <FormInput
                  name="lastName"
                  value={lastName}
                  placeholder="Last Name"
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </div>
            </Form.Row>
            <Form.Row justifyContent="center">
              <div style={{ width: "50%" }}>
                <FormInput
                  name="phone"
                  value={phone}
                  style={{ width: "100%" }}
                  placeholder="Phone Number"
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
                {phoneError && (
                  <div className={classes.error}>{phoneError}</div>
                )}
              </div>
            </Form.Row>
            <Form.Row justifyContent="center">
              <div style={{ width: "50%" }}>
                <FormSelect
                  name="companyId"
                  value={companyId}
                  values={companies}
                  placeholder={companyName}
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </div>
            </Form.Row>
            <Form.Column alignItems="center">
              <Form.Row justifyContent="center">
                <Button
                  type="submit"
                  minWidth={200}
                  text="VALIDATE"
                  fullWidth={false}
                  loading={loading}
                  disabled={
                    loading ||
                    !firstName ||
                    !lastName ||
                    phone.length !== 10 ||
                    image === "" ||
                    !companyId
                  }
                />
              </Form.Row>
              <Form.Row justifyContent="center">
                <Button
                  text="DELETE"
                  minWidth="30%"
                  fullWidth={false}
                  disabled={loading}
                  loading={loading}
                  color={theme.palette.error.main}
                  onClick={() => onDelete(selectedItem._id)}
                />
              </Form.Row>
            </Form.Column>
          </Form.Form>
        }
      />
    </>
  );
}
