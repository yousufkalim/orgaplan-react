import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import * as Yup from "yup";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Actions from "../../../redux/actions";
import CustomInputModal from "../../../components/CustomInputModalSingleSelect";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

const addClientYup = Yup.object().shape({
  logo: Yup.array().min(1, "Required").required("Required"),
  name: Yup.string().required("Required"),
  email: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  site: Yup.string().required("Required"),
  phone: Yup.number()
    .test(
      "len",
      "Must be exactly 10 characters",
      (val) => val && val.toString().length === 10,
    )
    .required("Required"),
});

export default function AddUser(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const [page] = useState(1);
  const [companies, setCompanies] = useState([]);
  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(null);

  const [roles, setRoles] = useState([]);
  const [dropdownRoles, setDropdownRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(null);

  const [siteParams, setSiteParams] = useState([]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      formik.setFieldValue("site", adminStore.site.siteId.name);
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ADD_USER}/${adminStore.site.siteId._id}/${store.user._id}`,
        token: store.token,
      });
      if (response.success) {
        setCompanies(response.data.site_companies.companies);
        setRoles(response.data.site_companies.companies);
        setUsers(response.data.users);
        if (response.data.site_companies != null) {
          const companyTemp = [];

          response.data.site_companies.companies.map((item, index) => {
            return companyTemp.push({ label: item.name, value: item.name });
          });
          setDropdownCompanies(companyTemp);
        }
        if (response.data.roles != null) {
          const rolesTemp = [];

          response.data.roles.map((item, index) => {
            return rolesTemp.push({ label: item, value: item });
          });
          setDropdownRoles(rolesTemp);
        }
      } else {
      }

      //   setItems(response.data.items);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const getUserCompany = async (userId) => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_USER_COMPANY}/${adminStore.site.siteId._id}/${userId}`,
        token: store.token,
      });
      if (response.success) {
        console.log(JSON.stringify(response, null, 2));
        if (response.data) {
          companies.forEach((item, index) => {
            if (item._id === response.data._id) {
              item.users.forEach((innerItem, innerIndex) => {
                console.log("innser ", innerItem.userId);
                if (innerItem.userId === userId) {
                  setSelectedRoleIndex(innerIndex);

                  setSelectedRole(innerItem.role);
                }
              });
              setSelectedCompanyIndex(index);

              setSelectedCompany(item.name);
            }
          });
        }
      } else {
      }

      //   setItems(response.data.items);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const onSubmit = async () => {
    const values = formik.values;
    const sites = [];
    siteParams.forEach((item) => {
      sites.push({ siteId: item.id, role: selectedRole });
    });
    var formdata = new FormData();
    formdata.append("image", values.logo[0].file);
    //formdata.append("name", values.name);
    formdata.append("firstName", values.firstName);
    formdata.append("lastName", values.lastName);
    formdata.append("email", values.email);
    formdata.append("phone", values.phone);
    formdata.append("sites", JSON.stringify(sites));
    formdata.append("companyId", companies[selectedCompanyIndex]._id);

    await GLOBALS.API({
      method: "POST",
      uri: GLOBALS.Constants.ADD_USER_ADMIN,
      headers: {
        Authorization: store.token,
      },
      body: formdata,
    });
    formik.setSubmitting(false);
    props.history.push("/clients");
  };

  const formik = useFormik({
    initialValues: {
      logo: [],
      name: "",
      color: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      site: "",
      contractType: "CLIENTPERSITE",
      contractStartDate: "",
      contractEndDate: "",
      functionality: "DELIVERY",
      additionalInfo: "",
      notificationPriorToDays: "",
    },
    validationSchema: addClientYup,
    onSubmit,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
  });

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD USER" />
      <div className={classes.content}>
        <Form.Form onSubmit={formik.handleSubmit}>
          <Form.Row>
            <FormLabel bold primary="CONTACT INFO* :" />
            <Form.Row width="48%">
              {/* <FormInput
                name="name"
                style={{ ...GLOBALS.Styles.inputWidth, marginRight: "10px" }}
                placeholder="Adresse e-mail"
                onChange={formik.handleChange}
                value={formik.values.name}
                error={formik.errors.name}
              /> */}
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                style={{
                  ...GLOBALS.Styles.inputWidth,
                  marginRight: "10px",
                }}
                onSelect={(event) => {
                  users.forEach((item, index) => {
                    if (item.userId.email === event.target.value) {
                      console.log(JSON.stringify(item.sites, null, 2));
                      formik.setFieldValue("firstName", item.userId.firstName);
                      formik.setFieldValue("lastName", item.userId.lastName);
                      formik.setFieldValue("phone", item.userId.phone);
                      formik.setFieldValue("logo", [
                        { uri: item.userId.image },
                      ]);

                      getUserCompany(item.userId._id);
                    }
                  });
                }}
                options={users.map((option) => {
                  if (option.userId.email != undefined)
                    return option.userId.email;
                })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Email"
                    margin="normal"
                    variant="outlined"
                    name="email"
                    value={formik.values.email}
                    error={formik.errors.email}
                    onChange={formik.handleChange}
                  />
                )}
              />
              <FormInput
                name="phone"
                style={{ ...GLOBALS.Styles.inputWidth, marginRight: "10px" }}
                placeholder="Téléphone"
                onChange={formik.handleChange}
                value={formik.values.phone}
                error={formik.errors.phone}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="INDENTITY* :" />
            <Form.Row width="48%">
              <FormInput
                name="firstName"
                style={(GLOBALS.Styles.inputWidth, { marginRight: "10px" })}
                placeholder="FIRST NAME"
                onChange={formik.handleChange}
                value={formik.values.firstName}
                error={formik.errors.firstName}
              />
              <FormInput
                name="lastName"
                style={(GLOBALS.Styles.inputWidth, { marginRight: "10px" })}
                placeholder="LAST NAME"
                onChange={formik.handleChange}
                value={formik.values.lastName}
                error={formik.errors.name}
              />
              <FormMultipleUpload
                name="logo"
                style={GLOBALS.Styles.inputWidth}
                error={formik.errors.logo}
                values={formik.values.logo}
                onChange={(values) =>
                  formik.handleChange({
                    target: {
                      type: "text",
                      name: "logo",
                      value: values,
                    },
                  })
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="COMPANY : " />
            <Form.Row noMargin width="48%">
              <FormSelect
                placeholder="Company"
                values={dropdownCompanies}
                value={selectedCompany}
                onChange={(event) => {
                  const index = event.target.selectedIndex - 1;

                  if (index !== -1) {
                    const item = event.target.value;

                    setSelectedCompanyIndex(index);

                    setSelectedCompany(item);
                  } else {
                    setSelectedCompanyIndex(null);

                    setSelectedCompany("");
                  }
                }}
                style={{ marginRight: "20px", maxWidth: 250 }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="RÔLE : " />
            <Form.Row noMargin width="48%">
              <FormSelect
                placeholder="RÔLE : "
                name="color"
                style={GLOBALS.Styles.inputWidth}
                onChange={formik.handleChange}
                value={formik.values.color}
                error={formik.errors.color}
                values={dropdownRoles}
                value={selectedRole}
                onChange={(event) => {
                  const index = event.target.selectedIndex - 1;

                  if (index !== -1) {
                    const item = event.target.value;

                    setSelectedRoleIndex(index);

                    setSelectedRole(item);
                  } else {
                    setSelectedRoleIndex(null);

                    setSelectedRole("");
                  }
                }}
              />
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary="CONSTRUCTION SITE : " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="site"
                style={{ ...GLOBALS.Styles.inputWidth, marginRight: "10px" }}
                placeholder="Site"
                onChange={formik.handleChange}
                value={formik.values.site}
                error={formik.errors.site}
                disabled={true}
              />
            </Form.Row>
          </Form.Row>

          <Form.ButtonContainer>
            <Button
              minWidth={200}
              text="CONTINUER"
              fullWidth={false}
              onClick={() => {
                onSubmit();
              }}
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting}
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
