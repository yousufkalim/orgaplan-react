import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
// import * as Yup from "yup";

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

export default function AddAdmin(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [update, setUpdate] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState([]);
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.COMPANY}`,
      });

      const itemsArray = [];
      result.data.items.map((item) => {
        if (!item.adminId) {
          itemsArray.push({
            value: item._id,
            label: item.name,
          });
        }
        return true;
      });

      setCompanies(itemsArray);
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
    else if (name === "image") {
      setUpdate((st) => !st);
      setImage(value);
      console.log("updated image");
    } else if (name === "companyId") setCompanyId(value);
  };

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
      formdata.append("companyId", companyId);

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.ADMINS,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      setLoading(false);
      props.history.push("/admins");
    } catch (err) {
      setLoading(false);
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
      <Heading primary="ADD AN ADMIN" />
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary="CONTACT INFO*: " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="email"
                placeholder="E-mail Address"
                value={email}
                // error={email}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                name="phone"
                value={phone}
                // error={phone}
                placeholder="Phone Number"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          {update && ""}
          <Form.Row>
            <FormLabel bold primary="IDENTITY*: " />
            <Form.Row noMargin width="48%">
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
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="PROFILE*: " />
            <FormMultipleUpload
              name="image"
              // error={image}
              values={image}
              style={GLOBALS.Styles.inputWidth}
              onChange={(values) => handleChange("image", values)}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="COMPANY*: " />
            <FormSelect
              name="companyId"
              value={companyId}
              // error={companyId}
              values={companies}
              placeholder="Select Company"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
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
                !email ||
                !phone ||
                phone.length !== 10 ||
                !firstName ||
                !lastName ||
                image.length === 0 ||
                !companyId
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
