import React from 'react';
import GLOBALS from "../../../globals";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import SubHeading from "../../../components/SubHeading";


import { NavLink } from "react-router-dom";


import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";


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

const Companies = () => {
    const classes = useStyles();
    return (
        <div  className={classes.root}>
            <Form.Row alignItems="center">
          <Heading primary="CLIENTS LIST" noWrap />
          <div>
            <Form.Row alignItems="center" noMargin>
              <SubHeading disableMargin primary="Total : 234 Clients" bold />
              <Button
                fullWidth={false}
                component={NavLink}
                text="CREATE A CLIENT"
                style={{ marginLeft: "20px" }}
                to={"/clients/add-client"}
              />
            </Form.Row>
          </div>
        </Form.Row>
        </div>
    )
}
export default Companies
