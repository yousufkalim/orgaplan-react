import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles((theme) => ({
  table: {
    overflow: "hidden",
    borderRadius: 10,
    "& .MuiTableRow-root": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    "& .MuiTableCell-root": {
      padding: 20,
      minWidth: 190,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderBottom: "none",
      whiteSpace: "nowrap",
      justifyContent: "center",
      color: "#000",
    },
    "& .MuiTableHead-root": {
      backgroundColor: "#4DA1FF",
      "& .MuiTableCell-root": {
        color: "#fff",
        fontWeight: "bold",
      },
    },
    "& .MuiTableBody-root": {
      backgroundColor: "#FFF",
    },
  },
  error: {
    fontSize: 12,
    color: "#c21d12",
  },
}));

const TableComponent = (props) => {
  const classes = useStyles();

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {props.headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
      </Table>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {props.rows.map((row) => (
            <TableRow key={row}>
              {Array.from({ length: row.length - 1 }, (_, key) => {
                let show = false;
                if (parseInt(key) === parseInt(props.dateItem)) {
                  let startHour = row[key + 1].split(" -")[0];
                  let endHour = row[key + 1].split("- ")[1];
                  if (parseInt(startHour.split("h")[0]) < 8) show = true;
                  if (parseInt(endHour.split("h")[0]) >= 21) show = true;
                }
                return (
                  <>
                    <TableCell key={key}>
                      <div>{row[key + 1]}</div>
                      {show && (
                        <div className={classes.error}>
                          (Inclut tarif de nuit)
                        </div>
                      )}
                    </TableCell>
                  </>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
