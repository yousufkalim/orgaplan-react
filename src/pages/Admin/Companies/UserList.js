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
  const adminStore = useSelector((state) => state.admin);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [companies, setCompanies] = useState([]);
    const [userList, setUserList] = useState([]);

  const [open, setOpen] = useState(false);

  const [selectedItem] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [filterCompanyId, setFilterCompanyId] = useState("");
  const [editModel, setEditModel] = useState("");

  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [dropdownRoles, setDropdownRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filteredUser();
    // eslint-disable-next-line
  }, [filterCompanyId]);

   useEffect(() => {
     updateEditModel();
     // eslint-disable-next-line
   }, [editModel]);

 async function updateEditModel() {
   if(editModel) {
     console.log(editModel);
    setEmail(editModel.userId.email);
    setPhone(editModel.userId.phone);
    setCompanyId(editModel.companyId.name);
    setImage([{ key: 0, file: undefined, uri: editModel.userId.image }]);
    setUserId(editModel.userId._id);
   }
  

 }



 async function filteredUser() {
   console.log('filter called')
   setLoading(true);
   const params = { siteId: adminStore.site.siteId._id };
   if (filterCompanyId.length !== 0) params["companyId"] = filterCompanyId;
   const response = await GLOBALS.API({
    uri: `${GLOBALS.Constants.FILTER_USER}`,
    token: store.token,
    method: "POST",
    body: JSON.stringify(params),
   });
   console.log(response);
    //  let rows = userList.map((item) => {
    //    // console.log(item)
    //    return [
    //      item.usersArray[0].firstName + " " + item.usersArray[0].lastName,
    //      item.company.name,
    //      item.usersArray[0].role,
    //      item.usersArray[0].isVerified ? "Inscrit" : "En attente",
    //      item.usersArray[0].email,
    //      <SmallButton
    //        text={item.usersArray[0].isVerified ? "Edit" : "Re-Send"}
    //        onClick={
    //          item.usersArray[0].isVerified
    //            ? handleClickOpen
    //            : resendVerificaiontRequest
    //        }
    //        color={theme.palette.primary.contrastText}
    //        to={"/companies"}
    //        // component={NavLink}
    //        style={{
    //          marginLeft: 10,
    //          borderRadius: 4,
    //        }}
    //      />,
    //    ];
    //  });
}


  const getData = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_COMPANY_USERS}/${adminStore.site.siteId._id}/${props.match.params.id}`,
        token: store.token,
      });
       const userResponse = await GLOBALS.API({
         uri: `${GLOBALS.Constants.GET_ADD_USER}/${adminStore.site.siteId._id}/${store.user._id}`,
         token: store.token,
       });
      console.log('response', response.data);
      // console.log('userResponse', userResponse);
      if (userResponse.success) {
            if (userResponse.data.roles != null) {
              const rolesTemp = [];
              userResponse.data.roles.map((item, index) => {
                return rolesTemp.push({ label: item, value: item });
              });
              setDropdownRoles(rolesTemp);
            }
        if (userResponse.data.site_companies.companies) {
          const companyTemp = [];
          userResponse.data.site_companies.companies.map((item, index) => {
            return companyTemp.push({
              label: item.companyId.name,
              value: item.companyId._id,
            });
          });
           setDropdownCompanies(companyTemp);
        }
      
      }
        if (response.success) {
          setUserList(response.data.users);
          // setCompanyName(response.data[0].company.name);
          // setUsers(response.data[0].usersArray);
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
  const resendVerificaiontRequest = () => {};


  const onUpdate = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const formdata = JSON.stringify({
        role: selectedRole,
        siteId: adminStore.site.siteId._id,
        email: email,
        companyId: companyId,
        userId: userId,
      });
       await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.UPDATE_COMPANY_USER,
        token: store.token,
        body: formdata,
      });
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
    // console.log('item', e.target.value);
    setOpen(true);
  };
  let rows = userList.map((item) => {
    return [
      item.userId.firstName + " " + item.userId.lastName,
      item.companyId.name,
      item.role,
      item.userId.isVerified ? "Inscrit" : "En attente",
      item.userId.email,
      <SmallButton
      text={item.userId.isVerified ? "Edit" : "Re-Send"}
      onClick={ 
        (e) => {
          setEditModel(item)
          handleClickOpen();
        }
        }
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
              <SubHeading
                disableMargin
                primary={`Total : ${userList.length} Users`}
                bold
              />
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

        <Form.Row noMargin>
          <Form.Row style={{ justifyContent: "flex-start" }} noMargin>
            <SearchInput placeholder="Name OF USER" />
            <FormSelect
              placeholder="Company"
              name="color"
              style={{ marginLeft: "20px", maxWidth: 250 }}
              values={dropdownCompanies}
              onChange={(e) => {
                setFilterCompanyId(e.target.value);
              }}
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
                disabled
                onChange={(file) => {
                  const uri = URL.createObjectURL(file);
                }}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormInput
                name="email"
                value={email}
                // error={firstName}
                disabled
                placeholder="Email"
                style={GLOBALS.Styles.inputWidth}
               
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormInput
                name="phone"
                value={phone}
                // error={lastName}
                placeholder="Phone"
                disabled
                style={GLOBALS.Styles.inputWidth}
              
              />
            </Form.Row>

            <Form.Row justifyContent="center">
              <FormInput
                name="company"
                value="Client 1"
                disabled
                // error={lastName}
                placeholder="Company"
                style={GLOBALS.Styles.inputWidth}
         
              />
            </Form.Row>

         
            <Form.Row justifyContent="center">
              <Form.Row noMargin width="80%">
                <FormSelect
                  placeholder="RÔLE : "
                  name="color"
                  style={GLOBALS.Styles.inputWidth}
                  values={dropdownRoles}
                  value={selectedRole}
                  onChange={(event) => {
                    const index = event.target.selectedIndex - 1;

                    if (index !== -1) {
                      const item = event.target.value;

                      setSelectedRole(item);
                    } else {
                      setSelectedRole("");
                    }
                  }}
                />
              </Form.Row>
            </Form.Row>

            <Form.ButtonContainer>
              <Button
                type="submit"
                minWidth={200}
                text="VALIDATE"
                fullWidth={false}
              />
            </Form.ButtonContainer>
          </Form.Form>
        }
      />
    </>
  );
}
