import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormSelect from "../../../components/FormSelect";
import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";
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
}));

export default function Invoices(props) {
  const classes = useStyles();

  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page] = useState(1);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.INVOICES}/${props.match.params.clientId}?page=${page}`,
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

  async function onDelete(itemId) {
    try {
      if (window.confirm("Are you sure, you want to delete this?")) {
        setLoading(true);
        await GLOBALS.API({
          method: "DELETE",
          token: store.token,
          uri: GLOBALS.Constants.INVOICE_DELETE + "/" + itemId,
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
    item.clientId.companyId.name,
    moment(item.startDate).format("DD/MM/YYYY"),
    moment(item.endDate).format("DD/MM/YYYY"),
    item.siteId.name,
    item.amount,
    item.description,
    <>
      <IconButton>
        <Pencil style={{ width: 18, height: 18 }} />
      </IconButton>
      <IconButton onClick={() => onDelete(item._id)}>
        <Cross style={{ width: 18, height: 18, color: "red" }} />
      </IconButton>
    </>,
  ]);

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Form.Row alignItems="center">
        <Heading primary="INVOICES" noWrap />
        <Button
          fullWidth={false}
          component={NavLink}
          text="CREATE AN INVOICE"
          to="/clients/add-invoice"
        />
      </Form.Row>
      <Form.Row noMargin>
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
          style={{ maxWidth: 250 }}
        />
      </Form.Row>
      <div className={classes.content}>
        <Table headers={GLOBALS.Data.invoices.headings} rows={rows} />
      </div>
    </div>
  );
}
