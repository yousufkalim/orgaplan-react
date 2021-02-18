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
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "transparent",
    color: theme.palette.primary.contrastText,
  },
  body: {
    fontSize: 15,
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
                  // noWrap
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
