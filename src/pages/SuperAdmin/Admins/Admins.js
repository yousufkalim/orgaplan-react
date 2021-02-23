import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import * as Yup from "yup";
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

const updateAdminYup = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().required("Required"),
  phone: Yup.number()
    .test(
      "len",
      "Must be exactly 10 characters",
      (val) => val && val.toString().length === 10,
    )
    .required("Required"),
  image: Yup.array().min(1, "Required").required("Required"),
  color: Yup.string().required("Required"),
});

export default function Admins(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMINS}?page=${page}`,
      });
      setItems(result.data.items);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err, "error"),
        ),
      );
    }
  }

  const onUpdate = async (values) => {
    var formdata = new FormData();
    formdata.append("image", values.image.file);
    formdata.append("color", values.color);
    formdata.append("userId", selectedItem.userId._id);
    formdata.append("firstName", values.firstName);
    formdata.append("lastName", values.lastName);
    formdata.append("email", values.email);
    formdata.append("phone", values.phone);

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
    formik.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      image: "",
      color: "",
    },
    validationSchema: updateAdminYup,
    onSubmit: onUpdate,
  });

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
            rows={items.map((item) => {
              const sendTo = [
                "-",
                item.firstName + " " + item.lastName,
                item.phone,
                0,
              ];
              return [
                ...sendTo,
                <IconButton
                  onClick={() => {
                    setSelectedItem(item);
                    formik.setValues({
                      image: {
                        uri: GLOBALS.Constants.BASE_URL + item.image,
                      },
                      color: item.color,
                      phone: item.phone,
                      firstName: item.firstName,
                      lastName: item.lastName,
                      email: item.email,
                    });
                    setModal(true);
                  }}
                >
                  <Pencil style={{ width: 18, height: 18 }} />
                </IconButton>,
              ];
            })}
          />
        </div>
      </div>
      <Modal
        title="EDIT ADMIN"
        open={selectedItem ? modal : false}
        onClose={() => setModal((st) => !st)}
        body={
          <Form.Form onSubmit={formik.handleSubmit}>
            <Form.Row justifyContent="center">
              <AvatarUpload
                onChange={(file) => {
                  const uri = URL.createObjectURL(file);
                  formik.setFieldValue("image", { file, uri });
                }}
                value={formik.values.image}
                error={formik.errors.image}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormInput
                name="email"
                value={formik.values.email}
                error={formik.errors.email}
                placeholder="E-mail Address"
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormInput
                name="phone"
                placeholder="Phone Number"
                value={formik.values.phone}
                error={formik.errors.phone}
                onChange={formik.handleChange}
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormSelect
                name="color"
                placeholder="Color"
                value={formik.values.color}
                error={formik.errors.color}
                onChange={formik.handleChange}
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
            <Form.Column alignItems="center">
              <Form.Row justifyContent="center">
                <Button
                  type="submit"
                  minWidth="30%"
                  text="VALIDATE"
                  fullWidth={false}
                  loading={formik.isSubmitting}
                  disabled={formik.isSubmitting}
                />
              </Form.Row>
              <Form.Row justifyContent="center">
                <Button
                  text="DELETE"
                  minWidth="30%"
                  fullWidth={false}
                  disabled={formik.isSubmitting}
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
