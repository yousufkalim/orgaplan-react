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
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import Pagination from "../../../components/Pagination";
import { ReactComponent as Details } from "../../../assets/icons/invoices.svg";
import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";
import { ReactComponent as Cross } from "../../../assets/icons/Cross.svg";

import SubHeading from "../../../components/SubHeading";
import SearchInput from "../../../components/SearchInput";

import { TEXTS } from "../../../assets/languages/french";

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

export default function Questions(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { CREATE_A_FAQ_QUESTION, Are_you_sure_to_Delete, FAQ } = TEXTS;
  const store = useSelector((state) => state.auth);

  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);
  const [data, setData] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page]);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.FAQ}?page=${page}&question=${query}`,
      });
      setItems(result.data.items);
      setData(result.data);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function onDelete(id) {
    try {
      if (window.confirm(Are_you_sure_to_Delete)) {
        setLoading(true);
        const response = await GLOBALS.API({
          method: "DELETE",
          token: store.token,
          uri: GLOBALS.Constants.FAQ + "/" + id,
        });

        const itemsArray = items.filter((item) => item._id !== id);

        setItems(itemsArray);
        setLoading(false);

        fetchData();

        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar(response.message, "success"),
          ),
        );
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
    item.question,
    item.answer?.replace(/(.{50})..+/, "$1..."),
    moment(item.createdAt).format("DD/MM/YYYY"),
    <>
      <IconButton component={NavLink} to={`/questions/view/${item._id}`}>
        <Details style={{ width: 15, height: 15 }} />
      </IconButton>
      <IconButton component={NavLink} to={`/questions/edit/${item._id}`}>
        <Pencil style={{ width: 15, height: 15 }} />
      </IconButton>
      <IconButton onClick={() => onDelete(item._id)}>
        <Cross style={{ width: 15, height: 15, color: "red" }} />
      </IconButton>
    </>,
  ]);

  return (
    <div className={classes.root}>
      <Form.Row alignItems="center">
        <Heading primary={FAQ} noWrap />
        <div>
          <Form.Row alignItems="center" noMargin>
            <SubHeading
              noMargin
              primary={data && `Total : ${data.totalItems} questions`}
              bold
            />
            <Button
              fullWidth={false}
              component={NavLink}
              text={CREATE_A_FAQ_QUESTION}
              style={{ marginLeft: "20px" }}
              to={"/questions/create"}
            />
          </Form.Row>
        </div>
      </Form.Row>
      <Form.Row noMargin>
        <SearchInput
          value={query}
          placeholder={"Question"}
          onClick={fetchData}
          onChange={({ target: { value } }) => setQuery(value)}
        />
      </Form.Row>
      <div className={classes.content}>
        {loading ? (
          <Loader.Progress />
        ) : (
          <Table
            headers={["Question", "Réponse", "Date De Création", "Actions"]}
            rows={rows}
          />
        )}
        {!loading && data.totalItems > 10 && (
          <Pagination
            page={page}
            count={data.totalPages}
            onChange={(e, value) => {
              setPage(value);
            }}
          />
        )}
      </div>
    </div>
  );
}
