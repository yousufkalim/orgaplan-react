import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";

import Logo from "../../assets/images/Logo.svg";
import SmallText from "../../components/SmallText";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f5f7fb",
  },
  header: {
    height: 64,
  },
  content: {
    width: "100vw",
    height: "calc(100vh - 64px)",
    backgroundColor: "#fff",
  },
  toolBar: {
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    height: 35,
  },
}));

export default function Login(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Container maxWidth="lg">
          <Toolbar className={classes.toolBar}>
            <Hidden smDown>
              <SmallText
                to="/"
                primary={<img src={Logo} className={classes.logo} alt="Logo" />}
              />
            </Hidden>
            <Button component={Link} to="/login">
              Login
            </Button>
          </Toolbar>
        </Container>
      </div>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
}
