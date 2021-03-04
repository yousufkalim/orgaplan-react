import React, { useState, useEffect } from "react";
import GLOBALS from "../../../globals";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import Actions from "../../../redux/actions";

// import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Heading from "../../../components/Heading";
import FormSelect from "../../../components/FormSelect";

import { Images } from "../../../assets/Assets";

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
  link: {
    marginRight: 20,
    whiteSpace: "nowrap",
    color: theme.palette.primary.contrastText,
  },
  image: {
    height: 70,
    borderRadius: theme.shape.borderRadius,
  },
}));

const Historic = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const store = useSelector((state) => state.auth);

  const [page] = useState(1);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITE}?page=${page}`,
      });
      // setItems(result.data.items);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const rows = GLOBALS.Data.meansOfHistoric.items.map((item) => {
    return [...item];
  });

  return (
    <div className={classes.root}>
      <Form.Row alignItems="center">
        <Heading primary="LIST OF MEANS - HISTORIC" noWrap />
        <div>
          <Form.Row
            alignItems="flex-start"
            noMargin
            justifyContent="flex-end"
            style={{ paddingRight: "50px" }}
          >
            <Form.Column style={{ width: "50%", marginRight: "50px" }}>
              <img src={Images.site} alt="" />
            </Form.Column>
          </Form.Row>
        </div>
      </Form.Row>
      <Form.Row alignItems="center" noMargin>
        <Form.Row justifyContent="flex-start" noMargin>
          {/* <SearchInput
            placeholder="Site name"
            style={{ marginRight: "20px", maxWidth: 250 }}
          /> */}
          <FormSelect
            placeholder="Company"
            values={[
              { value: "green", label: "Green" },
              { value: "Yellow", label: "Yellow" },
              { value: "Red", label: "Red" },
              { value: "Blue", label: "Blue" },
              { value: "Orange", label: "Orange" },
              { value: "Purple", label: "Purple" },
              { value: "Magenta", label: "Magenta" },
            ]}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Mean"
            values={[
              { value: "green", label: "Green" },
              { value: "Yellow", label: "Yellow" },
              { value: "Red", label: "Red" },
              { value: "Blue", label: "Blue" },
              { value: "Orange", label: "Orange" },
              { value: "Purple", label: "Purple" },
              { value: "Magenta", label: "Magenta" },
            ]}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
        </Form.Row>
        {/* <NavLink className={classes.link} to="/sites/archives">
          See archived sites
        </NavLink> */}
      </Form.Row>
      <div className={classes.content}>
        <Table headers={GLOBALS.Data.meansOfHistoric.headings} rows={rows} />
      </div>
    </div>
  );
};

export default Historic;
