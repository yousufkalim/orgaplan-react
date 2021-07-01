import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import Heading from "../../components/Heading";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import GLOBALS from "../../globals";
import Table from "../../components/Table";
import Actions from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";

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
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.LOGS}`,
      });
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

  const rows = data.map((item) => [item.date, item.description]);
  return (
    <>
      <div className={classes.root}>
        <Heading primary="Activity Logs" />
      </div>
      <div className={classes.content}>
        {loading ? (
          <Loader.Progress />
        ) : (
          <Table headers={GLOBALS.Data.logs.headings} rows={rows} />
        )}
        {/* This pagination block is temporary disabled and will enabled after backend pagination */}
        {/* {!loading && data.length > 4 && (
          <Pagination
            page={page}
            onChange={(e, value) => {
              setPage(value);
            }}
          />
        )} */}
      </div>
    </>
  );
}
