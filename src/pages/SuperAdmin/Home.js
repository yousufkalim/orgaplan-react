import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import GLOBALS from "../../globals";
import Card from "../../components/Card";
import Form from "../../components/Form";
import Heading from "../../components/Heading";
import SmallText from "../../components/SmallText";
import SubHeading from "../../components/SubHeading";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "40px 15px",
  },
  content: {
    padding: 15,
    marginTop: 10,
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.secondary.main,
  },
  cardTemplate: {},
}));

const CardTemplate = ({ card }) => {
  const classes = useStyles();
  console.log("card", card);
  return (
    <Card className={classes.cardTemplate}>
      <Form.Row>
        <SubHeading primary={card.title} />
        <SmallText primary={card.total} />
      </Form.Row>
    </Card>
  );
};

export default function Profile(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Heading primary="Dashboard" />
      <div className={classes.content}>
        <Grid container spacing={2}>
          {GLOBALS.Data.dashboard.map((card) => (
            <Grid item xs={12} sm={6} md={3}>
              <CardTemplate card={card} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}
