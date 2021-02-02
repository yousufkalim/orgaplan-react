import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";

const StyledTableContainer = withStyles((theme) => ({
  root: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.secondary.main,
  },
}))(TableContainer);

const StyledTable = withStyles((theme) => ({
  root: {
    // borderSpacing: "5px",
    backgroundColor: theme.palette.secondary.main,
    // borderCollapse: "separate",
  },
  // table: {
  //   overflow: "hidden",
  //   borderRadius: theme.shape.borderRadius,
  //   "& .MuiTableRow-root": {
  //     display: "flex",
  //     alignItems: "center",
  //     justifyContent: "center",
  //   },
  //   "& .MuiTableCell-root": {
  //     padding: 20,
  //     minWidth: 190,
  //     display: "flex",
  //     flexDirection: "column",
  //     alignItems: "center",
  //     borderBottom: "none",
  //     whiteSpace: "nowrap",
  //     justifyContent: "center",
  //     color: "#000",
  //   },
  //   "& .MuiTableHead-root": {
  //     backgroundColor: "#4DA1FF",
  //     "& .MuiTableCell-root": {
  //       color: "#fff",
  //       fontWeight: "bold",
  //     },
  //   },
  //   "& .MuiTableBody-root": {
  //     backgroundColor: "#FFF",
  //   },
  // },
}))(Table);

const StyledTableRow = withStyles((theme) => ({
  root: {
    height: 20,
    borderRadius: 20,
    backgroundColor: theme.palette.common.white,
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  root: {
    border: "none",
    padding: 6,
  },
  head: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "transparent",
    color: theme.palette.primary.contrastText,
  },
  body: {
    fontSize: 20,
    fontWeight: "normal",
    backgroundColor: "transparent",
    color: theme.palette.primary.contrastText,
  },
}))(TableCell);

export default function DataTable(props) {
  return (
    <StyledTableContainer>
      <StyledTable>
        <TableHead>
          <StyledTableRow>
            {props.headers.map((header, index) => (
              <StyledTableCell align="center" key={index}>
                {header}
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, i) => (
            <StyledTableRow key={i}>
              {row.map((cell, index) => (
                <StyledTableCell
                  component="th"
                  scope="row"
                  key={index}
                  align="center"
                >
                  {cell}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
}
