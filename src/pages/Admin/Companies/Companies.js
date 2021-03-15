import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
// import * as Yup from "yup";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

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
import uploadIcon from "../../../assets/images/upload.png";
import { Images } from "../../../assets/Assets";
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

export default function Companies(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [page] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedItem] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [nameOfResponsible, setNameOfResponsible] = useState("");
  const [nameOfCompany, setNameOfCompany] = useState("");

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  const getData = async () => {
    try {
      console.log(adminStore.site.siteId._id);
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_SITE_COMPANIES}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        setCompanies(response.data.companies);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
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
      setModal(false);
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const getParentComapnies = (connection) => {
    if (connection.length > 0) {
      const value = connection[0].childCompanyId
        .map((item, index) => {
          if (item.name != undefined) return item.name;
          return "N/A";
        })
        .toString()
        .replace(/,/g, " ");
      return value;
    }
    return "N/A";
  };

  const filterCompany = async () => {
    try {
      setLoading(true);
      const params = { siteId: "6008169bedbb7816d40b197d" };
      if (nameOfCompany.length !== 0) params["companyName"] = nameOfCompany;
      if (nameOfResponsible.length !== 0)
        params["responsibleName"] = nameOfResponsible;

      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.FILTER_COMPANY_SITES}`,
        token: store.token,
        method: "POST",
        body: JSON.stringify(params),
      });
      if (response.success) {
        setCompanies(response.data.companies);
        setLoading(false);
      } else {
        setLoading(false);
      }
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

  const rows = companies.map((item) => {
    return [
      <img src={Images.site} alt="Icon" />,
      item.name,
      getParentComapnies(item.connection),
      item.incharge != undefined
        ? item.incharge.firstName + " " + item.incharge.lastName
        : "N/A",
      item.incharge != undefined ? item.incharge.phone : "N/A",
      item.incharge != undefined ? item.incharge.email : "N/A",

      <div>
        <IconButton style={{ padding: "6px" }} onClick={() => {}}>
          <NavLink
            to={{
              pathname: "/companies/user-list",
              id: item._id,
            }}
          >
            <img
              src={Images.comapnies}
              style={{ width: 18, height: 17 }}
              alt="Icon"
            />
          </NavLink>
        </IconButton>
        <IconButton style={{ padding: "6px" }} onClick={() => {}}>
          <NavLink to="/companies/edit-companies">
            <Pencil style={{ width: 18, height: 15 }} />
          </NavLink>
        </IconButton>
        <IconButton style={{ padding: "6px" }} onClick={() => {}}>
          <img
            src={Images.calender}
            style={{ width: 18, height: 17 }}
            alt="Icon"
          />
        </IconButton>
        <IconButton style={{ padding: "6px" }} onClick={() => {}}>
          <img
            src={Images.invoices}
            style={{ width: 18, height: 17 }}
            alt="Icon"
          />
        </IconButton>
        <IconButton style={{ padding: "6px" }} onClick={() => {}}>
          <img
            src={Images.incidents}
            style={{ width: 18, height: 17 }}
            alt="Icon"
          />
        </IconButton>
      </div>,
    ];
  });

  return (
    <>
      <div className={classes.root}>
        <Form.Row alignItems="center" className="pr-3">
          <Heading primary="LIST OF COMPANIES" noWrap />
          <div>
            <Form.Row alignItems="center" noMargin>
              <SubHeading
                disableMargin
                primary={`Total : ${companies.length} COMPANIES`}
                bold
              />
              <Button
                fullWidth={false}
                component={NavLink}
                text="ADD A COMPANY"
                style={{ marginLeft: "20px" }}
                to={"/companies/add-companies"}
              />
            </Form.Row>
          </div>
        </Form.Row>
        <Form.Row noMargin className="pr-3">
          <Form.Row style={{ justifyContent: "flex-start" }} noMargin>
            <SearchInput
              placeholder="Name of responsible"
              value={nameOfResponsible}
              onClick={() => {
                filterCompany();
              }}
              onChange={(event) => {
                setNameOfResponsible(event.target.value);
              }}
            />
            <SearchInput
              style={{ marginLeft: "20px" }}
              placeholder="Name of company"
              value={nameOfCompany}
              onClick={() => {
                filterCompany();
              }}
              onChange={(event) => {
                setNameOfCompany(event.target.value);
              }}
            />
            <a href="#companies">
              <img
                style={{
                  width: "1.3rem",
                  marginLeft: "20px",
                  marginTop: "10px",
                }}
                src={uploadIcon}
                alt="File Upload Icon"
              />
            </a>
          </Form.Row>
          <Button
            fullWidth={true}
            component={NavLink}
            text="ACCESS REQUEST TO ZONES"
            style={{ width: "330px" }}
            to={"/admins/add-admin"}
          />
        </Form.Row>
        <div className={classes.content}>
          <Table headers={GLOBALS.Data.companies.headings} rows={rows} />
        </div>
      </div>
      <Modal
        title="EDIT ADMIN"
        open={selectedItem ? modal : false}
        onClose={() => setModal((st) => !st)}
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
                name="firstName"
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
              <FormInput
                name="phone"
                placeholder="Phone Number"
                value={phone}
                // error={phone}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormSelect
                name="companyId"
                value={companyId}
                // error={companyId}
                values={companies}
                placeholder="Company Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
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
                    !phone ||
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
                  disabled={loading || true}
                  color={theme.palette.error.main}
                />
              </Form.Row>
            </Form.Column>
          </Form.Form>
        }
      />
    </>
  );
}
