import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

// const addAdminYup = Yup.object().shape({
//   email: Yup.string().required("Required"),
//   phone: Yup.number()
//     .test(
//       "len",
//       "Must be exactly 10 characters",
//       (val) => val && val.toString().length === 10,
//     )
//     .required("Required"),
//   firstName: Yup.string().required("Required"),
//   lastName: Yup.string().required("Required"),
//   image: Yup.array().min(1, "Required").required("Required"),
//   companyId: Yup.string().required("Required"),
// });

export default function AddContact(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [loading, setLoading] = useState(false);
  const [dropdownType, setDropdownType] = useState([]);
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      // const result = await GLOBALS.API({
      //   uri: `${GLOBALS.Constants.COMPANY}`,
      // });

      const typeArray = [
        { value: "LOGISTICS", label: "LOGISTICS" },
        { value: "SITE", label: "SITE" },
      ];

      setDropdownType(typeArray);

      // const itemsArray = [];
      // result.data.items.map((item) => {
      //   if (!item.adminId) {
      //     itemsArray.push({
      //       value: item._id,
      //       label: item.name,
      //     });
      //   }
      //   return true;
      // });

      // setCompanies(itemsArray);
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
    if (name === "email") {
      setEmail(value);
      if (value === "" || name === null) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    } else if (name === "phone") {
      setPhone(value);
      if (value === "" || name === null) {
        setPhoneError(true);
      } else {
        setPhoneError(false);
      }
    } else if (name === "firstName") {
      setFirstName(value);
      if (value === "" || name === null) {
        setFirstNameError(true);
      } else {
        setFirstNameError(false);
      }
    } else if (name === "lastName") {
      setLastName(value);
      if (value === "" || name === null) {
        setLastNameError(true);
      } else {
        setLastNameError(false);
      }
    } else if (name === "image") setImage(value);
    else if (name === "company") setCompany(value);
    else if (name === "role") setRole(value);
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      var formdata = new FormData();
      console.log(" adminStore.site.siteId._id", adminStore.site.siteId._id);
      formdata.append("email", email);
      formdata.append("phone", phone);
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("image", image[0].file);
      formdata.append("company", company);
      formdata.append("siteId", adminStore.site.siteId._id);
      formdata.append("type", type);
      formdata.append("role", role);

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.POST_SITE_ORGANIGRAMMES,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      setLoading(false);
      props.history.goBack();
      // props.history.push("/admins");
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD A CONTACT" />
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary="TYPE OF ORGANIGRAMME*: " />
            <Form.Row noMargin width="48%">
              <FormSelect
                name="type"
                value={type}
                // error={companyId}
                values={dropdownType}
                placeholder="Type"
                style={GLOBALS.Styles.inputWidth}
                onChange={(e) => {
                  const index = e.target.selectedIndex - 1;
                  console.log("index", index);
                  if (index !== -1) {
                    const item = e.target.value;

                    console.log(item);
                    setType(item);
                  } else {
                    setType("");
                  }
                }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="CONTACT INFO*: " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="email"
                value={email}
                // error={firstName}
                placeholder="Adresse e-mail"
                style={{ ...GLOBALS.Styles.inputWidth, marginRight: "10px" }}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                name="phone"
                value={phone}
                // error={lastName}
                placeholder="Téléphone"
                style={{ ...GLOBALS.Styles.inputWidth, marginRight: "10px" }}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="IDENTITY*:  " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="firstName"
                value={firstName}
                // error={firstName}
                placeholder="First Name"
                style={{ ...GLOBALS.Styles.inputWidth, marginRight: "10px" }}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                name="lastName"
                value={lastName}
                // error={lastName}
                placeholder="Last Name"
                style={{ ...GLOBALS.Styles.inputWidth, marginRight: "10px" }}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormMultipleUpload
                name="profile"
                // error={image}
                values={image}
                style={GLOBALS.Styles.inputWidth}
                onChange={(values) => handleChange("profile", values)}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="COMPANY: " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="company"
                value={company}
                // error={lastName}
                placeholder="Enterprise"
                style={{ ...GLOBALS.Styles.inputWidth, marginRight: "10px" }}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              {/* <FormSelect
                name="company"
                value={company}
                // error={companyId}
                values={companies}
                placeholder="Entreprise"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              /> */}
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="Rôle: " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="role"
                value={role}
                // error={lastName}
                placeholder="Role"
                style={{ ...GLOBALS.Styles.inputWidth, marginRight: "10px" }}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              {emailError && ""}
              {phoneError && ""}
              {firstNameError && ""}
              {lastNameError && ""}
              {/* <FormSelect
                name="companyId"
                value={companyId}
                // error={companyId}
                values={companies}
                placeholder="Rôle"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              /> */}
            </Form.Row>
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              loading={loading}
              disabled={
                loading ||
                !type ||
                !email ||
                !phone ||
                !firstName ||
                !lastName ||
                image.length === 0
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
