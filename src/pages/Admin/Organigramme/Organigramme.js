import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";
import { Images } from "../../../assets/Assets";

import Form from "../../../components/Form";
import Modal from "../../../components/Modal";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
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

export default function Organigramme() {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [page] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);

  const [selectedItem] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyName] = useState("");

  useEffect(() => {
    fetchData();

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

  const rows = GLOBALS.Data.oranigramme.items.map((item) => {
    return [
      <img src={Images.avatar} alt="Organigramme" style={{ width: 50, height: 50 }} />,
      ...item,
    ];
  });

  const modalHandler = (btn) => {
    setOpen(btn);
  };
  return (
    <>
      <div className={classes.root}>
        <Form.Row alignItems="center" className="pr-3">
          <Heading primary="ORGANNIGRAMME" noWrap />
          <div>
            <Form.Row alignItems="center" noMargin>
              <Button
                fullWidth={false}
                component={NavLink}
                text="ADD A CONTACT"
                style={{ marginLeft: "20px" }}
                to={"/organigramme/add-contact"}
              />
            </Form.Row>
          </div>
        </Form.Row>
        <Form.Row noMargin>
          <Form.Row style={{ justifyContent: "flex-start" }} noMargin>
            <Button
              fullWidth={false}
              component={NavLink}
              text="SITE ORGANIGAMME"
              style={{
                marginLeft: "20px",
                backgroundColor: "#140772",
              }}
              to={"/"}
            />
            <Button
              fullWidth={false}
              component={NavLink}
              text="LOGISTIC ORGANIGAMME"
              style={{
                marginLeft: "20px",
                backgroundColor: "#fff",
                border: "1px solid #707070",
              }}
              textColor="#7E7878"
              to={"/"}
            />
          </Form.Row>
        </Form.Row>
        <div className={classes.content}>
          <Table
            headers={GLOBALS.Data.oranigramme.headings}
            rows={rows}
            modalHandler={modalHandler}
          />
        </div>
      </div>
      <Modal
        title="THIERRY MARLES"
        open={open}
        onClose={() => modalHandler(false)}
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
                placeholder={companyName}
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
