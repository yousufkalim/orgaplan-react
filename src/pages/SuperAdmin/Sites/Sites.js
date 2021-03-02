import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import SmallButton from "../../../components/SmallButton";
import SearchInput from "../../../components/SearchInput";

import SiteImage from "../../../assets/images/Site.png";
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
  link: {
    marginRight: 20,
    whiteSpace: "nowrap",
    color: theme.palette.primary.contrastText,
  },
  image: {
    height: 70,
    borderRadius: theme.shape.borderRadius,
  },
}));

export default function Sites(props) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page] = useState(1);

  // const [modal, setModal] = useState(false);
  // const [selectedItem, setSelectedItem] = useState("");
  // const [selectedNestedItem, setSelectedNestedItem] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITE}?page=${page}`,
      });
      setItems(result.data.items);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function onArchive(itemId) {
    try {
      if (window.confirm("Are you sure, you want to do this?")) {
        setLoading(true);
        await GLOBALS.API({
          method: "PUT",
          token: store.token,
          uri: GLOBALS.Constants.SITE_ARCHIVE + "/" + itemId,
        });
        const itemsArray = items.filter((item) => item._id !== itemId);
        setItems(itemsArray);
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
  }

  const rows = items.map((item) => [
    <img
      src={item.logo ? GLOBALS.Constants.BASE_URL + item.logo : SiteImage}
      alt="siteimage"
      className={classes.image}
    />,
    item.name,
    item.zacId ? item.zacId.name : "N/A",
    `${item.adminId.userId.firstName} ${item.adminId.userId.lastName}`,
    item.status,
    <Form.Row alignItems="center" justifyContent="center">
      <IconButton>
        <Pencil style={{ width: 15, height: 15 }} />
      </IconButton>
      <SmallButton
        text="Archive"
        disabled={loading}
        onClick={() => onArchive(item._id)}
        color={theme.palette.primary.contrastText}
        style={{
          marginLeft: 10,
          borderRadius: 4,
        }}
      />
    </Form.Row>,
  ]);

  return (
    <div className={classes.root}>
      <Form.Row alignItems="center">
        <Heading primary="SITES LIST" noWrap />
        <div>
          <Form.Row alignItems="center" noMargin>
            <SubHeading
              disableMargin
              primary={`Total : ${rows.length} Sites`}
              bold
            />
            <Button
              fullWidth={false}
              component={NavLink}
              text="ZACS LIST"
              to={"/sites/zacs"}
              style={{ marginLeft: "20px" }}
            />
            <Button
              fullWidth={false}
              component={NavLink}
              text="CREATE A SITE"
              to={"/sites/add-site"}
              style={{ marginLeft: "20px" }}
            />
          </Form.Row>
        </div>
      </Form.Row>
      <Form.Row alignItems="center" noMargin>
        <Form.Row justifyContent="flex-start" noMargin>
          <SearchInput
            placeholder="Site name"
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Client"
            values={[
              { value: "green", label: "Green" },
              { value: "Yellow", label: "Yellow" },
              { value: "Red", label: "Red" },
              { value: "Blue", label: "Blue" },
              { value: "Orange", label: "Orange" },
              { value: "Purple", label: "Purple" },
              { value: "Magenta", label: "Magenta" },
            ]}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Status"
            values={[
              { value: "green", label: "Green" },
              { value: "Yellow", label: "Yellow" },
              { value: "Red", label: "Red" },
              { value: "Blue", label: "Blue" },
              { value: "Orange", label: "Orange" },
              { value: "Purple", label: "Purple" },
              { value: "Magenta", label: "Magenta" },
            ]}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
        </Form.Row>
        <NavLink className={classes.link} to="/sites/archives">
          See archived sites
        </NavLink>
      </Form.Row>
      <div className={classes.content}>
        <Table headers={GLOBALS.Data.sites.headings} rows={rows} />
      </div>
    </div>
  );
}
