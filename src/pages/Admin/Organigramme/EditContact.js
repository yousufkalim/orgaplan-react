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

export default function EditContact(props) {
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
        let fileClone = [{ uri: contactInfo.image }];
    setImage(fileClone);

    setCompany(contactInfo.company);
    setRole(contactInfo.role);

    // const mean = props.location.mean;
    // setName(mean.name);
    // let fileClone = [{ uri: mean.image }];
    // setImage(fileClone);
    // setSelectedMeanType(mean.meanType);
    // let meanTypeIndex = 0;
    // dropdownMeanTypes.forEach((item, index) => {
    //   if (item.value === mean.meanType) meanTypeIndex = index;
    // });

    // setSelectedMeanTypeIndex(meanTypeIndex);

    // setColor(mean.color);

    // setStartDate(moment(mean.availability.start).format("MM/DD/yyyy"));
    // setEndDate(moment(mean.availability.end).format("MM/DD/yyyy"));
    // setRate(mean.pricePerHour);
    // setAddInfo(mean.additionalInfo);
    // const locationTemp = [];
    // mean.location.forEach((item, index) => {
    //   let loc = { key: "", label: "", id: "", type: "" };

    //   if (item.locationType === "STORAGEAREA") {
    //     loc.key = item.storageArea._id;
    //     loc.label = item.storageArea.name;
    //     loc.id = item.storageArea._id;
    //     loc.type = accessabilityPoints[0].value;
    //     locationTemp.push(loc);
    //   }
    //   if (item.locationType === "DELIVERYAREA") {
    //     loc.key = item.deliveryArea._id;
    //     loc.label = item.deliveryArea.name;
    //     loc.id = item.deliveryArea._id;
    //     loc.type = accessabilityPoints[1].value;
    //     locationTemp.push(loc);
    //   }
    // });
    // setDeliveryAndStorageLocations(locationTemp);
    // console.log(JSON.stringify(locationTemp, null, 2));

  };




  async function fetchData() {
    try {
      // const result = await GLOBALS.API({
      //   uri: `${GLOBALS.Constants.COMPANY}`,
      // });
        console.log(props.location)
        const typeArray = [
        { value: 'Logistic ', label: 'Logistic'}, 
        { value: 'Site ', label: 'Site'}
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
        method: "POST",
        uri: GLOBALS.Constants.POST_SITE_ORGANIGRAMMES,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      setLoading(false);
      props.history.push("/admins");
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
                                    {image}

              <FormMultipleUpload
                name="image"
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
                !type||
                !email ||
                !phone ||
                !firstName ||
                !lastName 
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}
