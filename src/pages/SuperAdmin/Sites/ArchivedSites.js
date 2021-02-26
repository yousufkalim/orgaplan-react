import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Heading from "../../../components/Heading";
import SmallButton from "../../../components/SmallButton";
import SearchInput from "../../../components/SearchInput";

import SiteImage from "../../../assets/images/Site.png";
import { ReactComponent as Cross } from "../../../assets/icons/Cross.svg";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";

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
  image: {
    height: 70,
    borderRadius: theme.shape.borderRadius,
  },
}));

export default function ArchivedSites(props) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [page] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITE_ARCHIVES}?page=${page}`,
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

  async function onUnArchive(itemId) {
    try {
      if (window.confirm("Are you sure, you want to do this?")) {
        setLoading(true);
        await GLOBALS.API({
          method: "PUT",
          token: store.token,
          uri: GLOBALS.Constants.SITE_UN_ARCHIVE + "/" + itemId,
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
      <SmallButton
        text="Unarchive"
        fullWidth={false}
        disabled={loading}
        onClick={() => onUnArchive(item._id)}
        color={theme.palette.primary.contrastText}
        style={{
          marginRight: 10,
          borderRadius: 4,
        }}
      />
      <IconButton>
        <Cross style={{ width: 18, height: 18, color: "red" }} />
      </IconButton>
    </Form.Row>,
  ]);

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Form.Column>
        <Heading primary="ARCHIVED SITES" />
        <SearchInput placeholder="Site name" />
      </Form.Column>
      <div className={classes.content}>
        <Table headers={GLOBALS.Data.archivedSites.headings} rows={rows} />
      </div>
    </div>
  );
}
