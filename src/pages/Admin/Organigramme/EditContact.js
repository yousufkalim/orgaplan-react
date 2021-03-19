import React, { useState, useEffect } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
// import * as Yup from "yup";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import Modal from "../../../components/Modal";
import Table from "../../../components/Table";

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

export default function EditContact(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);


  const setValues = () => {
    console.log( 'data', props.location.data);
    const contactInfo = props.location.data;

    setType(contactInfo.type);
    setEmail(contactInfo.email);
    setPhone(contactInfo.phone);
    setFirstName(contactInfo.firstName);
    setLastName(contactInfo.lastName);
        // let fileClone = [{ uri: contactInfo.image }];
    setImage([{ key: 0, file: undefined, uri:  contactInfo.image  }]);

    // setImage(fileClone);

    setCompany(contactInfo.company);
    setRole(contactInfo.role);


  };




  async function fetchData() {
    try {
         const typeArray = [
        { value: 'Logistic ', label: 'Logistic'}, 
        { value: 'Site ', label: 'Site'}
      ];

      setDropdownType(typeArray);
      await setValues();
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
    if (name === "email") setEmail(value);
    else if (name === "phone") setPhone(value);
    else if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "image") setImage(value);
    else if (name === "company") setCompany(value);
    else if (name === "role") setRole(value);
  };

  async function onDelete() {
    try {
      if (window.confirm("Are you sure, you want to delete this?")) {
        setLoading(true);
        console.log(store.token)
        await GLOBALS.API({
          method: "DELETE",
          uri: GLOBALS.Constants.DELETE_SITE_ORGANIGRAMMES + "/" + props.location.data._id,
          token: store.token,
        });
        props.history.goBack();

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

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      var formdata = new FormData();
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
        method: "PUT",
        uri: GLOBALS.Constants.PUT_SITE_ORGANIGRAMMES + "/" + props.location.data._id,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      setLoading(false);
      props.history.goBack();
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
 const modalHandler = (btn) => {
    setOpen(btn);
  };
  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="EDIT A CONTACT" />
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary="TYPE OF ORGANIGRAMME: " />
            <Form.Row noMargin width="48%">
              <FormSelect
                name="type" //working
                value={type}
                // error={companyId}
                values={[
                    { value: 'LOGISTICS', label: 'LOGISTICS'}, 
                    { value: 'SITE', label: 'SITE'}
                    ]}
                placeholder="Type"
                style={GLOBALS.Styles.inputWidth}
                   onChange={(e) => {
                  const index = e.target.selectedIndex - 1;
                  console.log('index', index);
                  if (index !== -1) {
                    const item = e.target.value;

                    console.log(item)
                    setType(item);
                  } else {

                    setType("");
                  }
                }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="CONTACT INFO : " />
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
            <FormLabel bold primary="IDENTITY :  " />
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
                !type||
                !email ||
                !phone ||
                !firstName ||
                !lastName 
              }
            />
          </Form.ButtonContainer>
            
 
    <Button
        text="DELETE"
        minWidth={200}
        fullWidth={false}
        color={theme.palette.error.main}
                  onClick={onDelete}
                  loading={loading}
                  disabled={loading}
                />

        </Form.Form>
      </div>

    </div>
  );
}
