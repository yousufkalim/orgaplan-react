import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TEXTS } from "../../assets/languages/french";

import Heading from "../../components/Heading";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import GLOBALS from "../../globals";
import Table from "../../components/Table";
import Actions from "../../redux/actions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    padding: "20px",
  },
}));

export default function Logs(props) {
  const { ACTIVITY_LOGS } = TEXTS;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  const [data, setData] = useState("");

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const result = await GLOBALS.API({
          uri: `${GLOBALS.Constants.LOGS}/?page=${page}`,
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
    fetchData();
  }, [page, dispatch]);

  const rows = items.map((item) => [item.date, item.description]);
  return (
    <>
      <div className={classes.root}>
        <Heading primary={ACTIVITY_LOGS} />
      </div>
      <div className={classes.content}>
        {loading ? (
          <Loader.Progress />
        ) : (
          <Table
            headers={GLOBALS.Data.logs.headings}
            rows={rows}
            align="left"
          />
        )}
        {/* This pagination block is temporary disabled and will enabled after backend pagination */}
        {!loading && data.totalItems > 4 && (
          <Pagination
            page={page}
            count={data.totalPages}
            onChange={(e, value) => {
              setPage(value);
              // console.log(page);
            }}
          />
        )}
      </div>
    </>
  );
}
