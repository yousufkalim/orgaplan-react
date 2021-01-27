import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Texts from "../globals/Texts";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    minWidth: 700,
    [theme.breakpoints.down("md")]: {
      minWidth: 0,
    },
  },
  table: {
    "& .MuiTableHead-root": {
      overflow: "hidden",
      borderRadius: theme.shape.borderRadius,
      "& .MuiTableRow-root": {
        backgroundColor: "#4DA1FF",
        "& .MuiTableCell-head": {
          fontWeight: "bold",
          whiteSpace: "nowrap",
          color: theme.palette.common.white,
          [theme.breakpoints.down("md")]: {
            fontSize: 12,
          },
        },
      },
    },
    "& .MuiTableBody-root": {
      overflow: "hidden",
      borderRadius: theme.shape.borderRadius,
      "& .MuiTableRow-root": {
        backgroundColor: "#FFF",
        "& .MuiTableCell-body": {
          fontSize: 16,
          fontWeight: 500,
          whiteSpace: "nowrap",
          [theme.breakpoints.down("md")]: {
            fontSize: 12,
          },
        },
      },
    },
  },
  error: {
    fontSize: 12,
    color: "#c21d12",
  },
}));

const Search = (props) => {
  const classes = useStyles();

  return (
    <TableContainer className={classes.tableContainer}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {props.headers.map((i) => (
              <TableCell key={i} align="center">
                {i}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.values.length === 0 ? (
            <TableRow>
              <TableCell align="center" colSpan={props.headers.length}>
                {props.emptyText || Texts.emptyTable}
              </TableCell>
            </TableRow>
          ) : (
            props.values.map((row, index) => {
              return (
                <TableRow key={row + index}>
                  {row.map((i, index) => {
                    let show = false;
                    if (parseInt(index) === parseInt(props.dateItem - 1)) {
                      let startHour = i.split(" -")[0].split("h")[0];
                      let endHour = i.split("- ")[1].split("h")[0];
                      if (parseInt(startHour) >= 0 && parseInt(startHour) < 8) {
                        show = true;
                      }
                      if (parseInt(endHour) >= 20 && parseInt(endHour) < 24) {
                        show = true;
                      }
                    }
                    return (
                      <TableCell key={i + index} align="center">
                        {i}
                        {show && (
                          <div className={classes.error}>
                            ({Texts.nightHour})
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Search;
