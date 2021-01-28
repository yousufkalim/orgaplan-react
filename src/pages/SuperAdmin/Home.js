import React from "react";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import { makeStyles } from "@material-ui/core/styles";

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
  gridList: {
    width: "100%",
    height: "100%",
  },
}));

const TabsComponent = ({ items }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        textColor="primary"
        variant="fullWidth"
        onChange={handleChange}
        indicatorColor="primary"
      >
        <Tab label={"Per " + items[0].title} />
        <Tab label={"Per " + items[1].title} />
      </Tabs>
      {items[value].items.map((item, index) => (
        <Form.Row key={index} style={{ marginTop: 20 }}>
          <SubHeading primary={Object.keys(item)[0]} />
          <SubHeading primary={Object.values(item)[0]} />
        </Form.Row>
      ))}
    </>
  );
};

const CardComponent = ({ card }) => {
  const classes = useStyles();
  // console.log("card", card);
  return (
    <Card className={classes.cardTemplate}>
      <Form.Row>
        <SubHeading primary={card.title} bold />
        {card.total && <SmallText primary={"Total : " + card.total} bold />}
      </Form.Row>
      {card.tabs ? (
        <TabsComponent items={card.items} />
      ) : (
        card.items.map((item, index) => (
          <Form.Row key={index} style={{ marginTop: 20 }}>
            <SubHeading primary={Object.keys(item)[0]} />
            <SubHeading primary={Object.values(item)[0]} />
          </Form.Row>
        ))
      )}
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
          {GLOBALS.Data.dashboard.map((card, index) =>
            card.multiple ? (
              <Grid item container xs={12} sm={6} md={3} key={index}>
                {card.items.map((item, indexItem) => (
                  <Grid
                    item
                    xs={12}
                    key={indexItem}
                    style={{
                      marginBottom: card.items.length > indexItem + 1 ? 20 : 0,
                    }}
                  >
                    <CardComponent card={item} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <CardComponent card={card} />
              </Grid>
            ),
          )}
        </Grid>
      </div>
    </div>
  );
}
