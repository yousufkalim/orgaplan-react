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

export default function UserList(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  // const [companies, setCompanies] = useState([]);
  const [userList, setUserList] = useState([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [filterCompanyId, setFilterCompanyId] = useState("");
  const [filterUserName, setFilterUserName] = useState("");
  const [editModel, setEditModel] = useState("");
  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [dropdownRoles, setDropdownRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [userId, setUserId] = useState("");
  const [siteName, setSiteName] = useState("");

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filteredUser();
    // eslint-disable-next-line
  }, [filterCompanyId, filterUserName]);

  useEffect(() => {
    updateEditModel();
    // eslint-disable-next-line
  }, [editModel]);

  async function updateEditModel() {
    if (editModel) {
      setEmail(editModel.userId.email);
      setPhone(editModel.userId.phone);
      setCompanyId(editModel.companyId._id);
      setImage([{ key: 0, file: undefined, uri: editModel.userId.image }]);
      setUserId(editModel.userId._id);
    }
  }

  async function filteredUser() {
    try {
      const params = { siteId: adminStore.site.siteId._id };
      if (filterCompanyId.length !== 0) params["companyId"] = filterCompanyId;
      if (filterUserName.length !== 0) params["name"] = filterUserName;

      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.FILTER_USER}`,
        token: store.token,
        method: "POST",
        body: JSON.stringify(params),
      });
      console.log("response", response.data.users);
      if (response.success) {
        if (response.data.users) {
          const data = response.data.users.filter(
            (x) => x.companyId._id === filterCompanyId && x.userId !== null,
          );
          setUserList(data);
        } else {
          setUserList([]);
        }
      } else {
        setUserList([]);
      }
    } catch (err) {
      setUserList([]);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const getData = async () => {
    try {
      console.log(props?.match?.params?.id);
      setSiteName(adminStore.site.siteId.name);

      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_COMPANY_USERS}/${adminStore.site.siteId._id}/${props.match.params.id}`,
        token: store.token,
      });
      const userResponse = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ADD_USER}/${adminStore.site.siteId._id}/${store.user._id}`,
        token: store.token,
      });
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
      setFilterCompanyId(props?.match?.params?.id);

      // if (response.success) {
      //   ///working
      //   const data = response.data.users.filter(
      //     (x) => x.companyId._id === filterCompanyId,
      //   );
      //   // setUserList(data);
      //   // setUsers(response.data[0].usersArray);
      // } else {
      // }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const onUpdate = async (e) => {
    try {
      e.preventDefault();

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
      getData();
      setOpen(false);
    } catch (err) {
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
  // eslint-disable-next-line
  let rows = userList.map((item) => {
    if (item.companyId && item.userId) {
      return [
        item.userId.firstName + " " + item.userId.lastName,
        item.companyId.name,
        item.role,
        item.userId.isVerified ? "Inscrit" : "En attente",
        item.userId.email,
        <SmallButton
          text="Edit"
          // text={item.userId.isVerified ? "Edit" : "Re-Send"}
          onClick={(e) => {
            setEditModel(item);
            handleClickOpen();
          }}
          color={theme.palette.primary.contrastText}
          to={"/companies"}
          style={{
            marginLeft: 10,
            borderRadius: 4,
          }}
        />,
      ];
    }
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
            <SearchInput
              placeholder="Name OF USER"
              value={filterUserName}
              onClick={filteredUser}
              onChange={(e) => {
                setFilterUserName(e.target.value);
              }}
            />
            <FormSelect
              placeholder="Company"
              name="color"
              value={filterCompanyId}
              style={{ marginLeft: "20px", maxWidth: 250 }}
              values={dropdownCompanies}
              onChange={(e) => {
                const index = e.target.selectedIndex - 1;
                if (index !== -1) {
                  const item = e.target.value;
                  setFilterCompanyId(item);
                }
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
                onChange={(file) => {}}
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
                value={siteName}
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
