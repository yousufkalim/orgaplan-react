import React, { useState, useEffect } from "react";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import GLOBALS from "../../globals";
import Actions from "../../redux/actions";

import Card from "../../components/Card";
import Form from "../../components/Form";
import Button from "../../components/Button";
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
  tab: {
    minWidth: 80,
    fontSize: 12,
  },
}));

const TabsComponent = ({ items }) => {
  const classes = useStyles();
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
        scrollButtons="auto"
      >
        <Tab label={"Per " + items[0].title} className={classes.tab} />
        <Tab label={"Per " + items[1].title} className={classes.tab} />
      </Tabs>
      {items[value].items.map((item, index) => (
        <Form.Row key={index}>
          <SmallText
            noWrap
            primary={Object.keys(item)[0]}
            style={{
              width: "80%",
            }}
          />
          <SmallText
            noWrap
            style={{
              width: "20%",
              textAlign: "right",
            }}
            primary={Object.values(item)[0]}
          />
        </Form.Row>
      ))}
    </>
  );
};

const CardComponent = ({ card }) => {
  return (
    <Card>
      <div>
        <Form.Row>
          <SubHeading primary={card.title} bold noWrap />
          {card.total && (
            <SmallText primary={"Total : " + card.total} bold noWrap />
          )}
        </Form.Row>
        {card.tabs ? (
          <TabsComponent items={card.items} />
        ) : (
          card.items.map((item, index) => (
            <Form.Row key={index}>
              <SmallText
                noWrap
                primary={Object.keys(item)[0]}
                style={{
                  width: "80%",
                }}
              />
              <SmallText
                noWrap
                style={{
                  width: "20%",
                  textAlign: "right",
                }}
                primary={Object.values(item)[0]}
              />
            </Form.Row>
          ))
        )}
      </div>
      <div style={{ display: "grid", placeItems: "center" }}>
        {card.path && (
          <Button
            to={card.path}
            text={card.text}
            fullWidth={false}
            component={NavLink}
          />
        )}
      </div>
    </Card>
  );
};

export default function Home(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.DASHBOARD}`,
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

  let renderArray = [
    {
      multiple: true,
      items: [
        {
          title: "CLIENTS",
          tabs: false,
          total: data && data.clients.total,
          path: "/clients",
          text: "Clients list",
          items: [
            { "Delivery Module": data && data.clients.delivery },
            { "Lockers module": data && data.clients.lockers },
          ],
        },
        {
          title: "INVOICE",
          total: data && data.invoices.total,
          tabs: false,
          path: "/clients/invoices",
          text: "Invoices list",
          items: [
            { "Marché couvert ULYS": "11,392" },
            { "Démolition usine VUC": "1,391" },
            { "Extension bâtiment c": "101" },
            { "Réalisation châtelet": "101" },
            { "Démolition usine VIC": "0" },
            { "Extension bâtiment carc": "0" },
            { "Réalisation Bâtiment C": "0" },
            { "Extension usine Réglais": "0" },
          ],
        },
      ],
      cols: 4,
    },
    {
      title: "DELIVERIES",
      total: "235",
      tabs: true,
      items: [
        {
          title: "site",
          items: [
            { "Marché couvert ULYSSES": 190 },
            { "Démolition usine VUC": 149 },
            { "Extension bâtiment carc": 120 },
            { "Réalisation châtelet ": 110 },
            { "Démolition usine VIC": 10 },
            { "Marché couvert REGAL": 10 },
            { "Démolition usine VIX": 10 },
            { "Extension bâtiment carc": 10 },
            { "Réalisation Bâtiment C": 10 },
            { "Extension usine Réglais": 10 },
            { "Marché couvert REGAL": 10 },
            { "Démolition usine VIX": 10 },
            { "Extension bâtiment carc": 10 },
            { "Réalisation Bâtiment C": 10 },
            { "Extension usine Réglais": 10 },
          ],
        },
        {
          title: "client",
          items: [
            { "Marché couvert ULYSSES": 90 },
            { "Démolition usine VUC": 49 },
            { "Extension bâtiment carc": 20 },
            { "Réalisation châtelet ": 10 },
            { "Démolition usine VIC": 0 },
            { "Marché couvert REGAL": 0 },
            { "Démolition usine VIX": 0 },
            { "Extension bâtiment carc": 0 },
            { "Réalisation Bâtiment C": 0 },
            { "Extension usine Réglais": 0 },
            { "Marché couvert REGAL": 0 },
            { "Démolition usine VIX": 0 },
            { "Extension bâtiment carc": 0 },
            { "Réalisation Bâtiment C": 0 },
            { "Extension usine Réglais": 0 },
          ],
        },
      ],
      cols: 4,
    },
    {
      title: "INCIDENTS",
      total: 203,
      tabs: true,
      items: [
        {
          title: "site",
          items: [
            { "Marché couvert ULYSSES": 190 },
            { "Démolition usine VUC": 149 },
            { "Extension bâtiment carc": 120 },
            { "Réalisation châtelet ": 110 },
            { "Démolition usine VIC": 10 },
            { "Marché couvert REGAL": 10 },
            { "Démolition usine VIX": 10 },
            { "Extension bâtiment carc": 0 },
            { "Réalisation Bâtiment C": 0 },
            { "Extension usine Réglais": 0 },
            { "Marché couvert REGAL": 0 },
            { "Démolition usine VIX": 0 },
            { "Extension bâtiment carc": 0 },
            { "Réalisation Bâtiment C": 0 },
            { "Extension usine Réglais": 0 },
          ],
        },
        {
          title: "client",
          items: [
            { "Marché couvert ULYSSES": 90 },
            { "Démolition usine VUC": 49 },
            { "Extension bâtiment carc": 20 },
            { "Réalisation châtelet ": 10 },
            { "Démolition usine VIC": 0 },
            { "Marché couvert REGAL": 0 },
            { "Démolition usine VIX": 0 },
            { "Extension bâtiment carc": 0 },
            { "Réalisation Bâtiment C": 0 },
            { "Extension usine Réglais": 0 },
            { "Marché couvert REGAL": 0 },
            { "Démolition usine VIX": 0 },
            { "Extension bâtiment carc": 0 },
            { "Réalisation Bâtiment C": 0 },
            { "Extension usine Réglais": 0 },
          ],
        },
      ],
      cols: 4,
    },
    {
      title: "MEANS",
      total: 104,
      tabs: true,
      items: [
        {
          title: "site",
          items: [
            { "Marché couvert ULYSSES": 90 },
            { "Démolition usine VUC": 49 },
            { "Extension bâtiment carc": 20 },
            { "Réalisation châtelet ": 10 },
            { "Démolition usine VIC": 0 },
            { "Marché couvert REGAL": 0 },
            { "Démolition usine VIX": 0 },
            { "Extension bâtiment carc": 0 },
            { "Réalisation Bâtiment C": 0 },
            { "Extension usine Réglais": 0 },
            { "Marché couvert REGAL": 0 },
            { "Démolition usine VIX": 0 },
            { "Extension bâtiment carc": 0 },
            { "Réalisation Bâtiment C": 0 },
            { "Extension usine Réglais": 0 },
          ],
        },
        {
          title: "client",
          items: [
            { "Marché couvert ULYSSES": 90 },
            { "Démolition usine VUC": 49 },
            { "Extension bâtiment carc": 20 },
            { "Réalisation châtelet ": 10 },
            { "Démolition usine VIC": 0 },
            { "Marché couvert REGAL": 0 },
            { "Démolition usine VIX": 0 },
            { "Extension bâtiment carc": 0 },
            { "Réalisation Bâtiment C": 0 },
            { "Extension usine Réglais": 0 },
            { "Marché couvert REGAL": 0 },
            { "Démolition usine VIX": 0 },
            { "Extension bâtiment carc": 0 },
            { "Réalisation Bâtiment C": 0 },
            { "Extension usine Réglais": 0 },
          ],
        },
      ],
      cols: 4,
    },
    {
      title: "END OF SUBSCRIPTION",
      total: null,
      tabs: true,
      items: [
        {
          title: "site",
          items: [
            { "Marché couvert ULYSSES": 2 },
            { "Démolition usine VUC": 4 },
            { "Extension bâtiment carc": 8 },
            { "Réalisation châtelet ": 20 },
            { "Démolition usine VIC": 32 },
            { "Marché couvert REGAL": 60 },
          ],
        },
        {
          title: "client",
          items: [
            { "Marché couvert ULYSSES": 2 },
            { "Démolition usine VUC": 4 },
            { "Extension bâtiment carc": 8 },
            { "Réalisation châtelet ": 20 },
            { "Démolition usine VIC": 32 },
            { "Marché couvert REGAL": 60 },
          ],
        },
      ],
      cols: 4,
    },
    {
      title: "TARIFICATION CLIENTS",
      total: null,
      tabs: true,
      items: [
        {
          title: "site",
          items: [{ VINCI: 24 }, { BOUYGUES: 34 }, { EIFFAGE: 20 }],
        },
        {
          title: "client",
          items: [{ VINCI: 24 }, { BOUYGUES: 34 }, { EIFFAGE: 20 }],
        },
      ],
      cols: 4,
    },
  ];

  return (
    <div className={classes.root}>
      {loading && ""}
      <Heading primary="DASHBOARD" />
      <div className={classes.content}>
        <Grid container spacing={2}>
          {renderArray.map((card, index) =>
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
