import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import SmallText from "../../../components/SmallText";
import SubHeading from "../../../components/SubHeading";
import RadioButton from "../../../components/RadioButton";
import SearchInput from "../../../components/SearchInput";
import AvatarUpload from "../../../components/AvatarUpload";

import { ReactComponent as Plus } from "../../../assets/icons/Plus.svg";
import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";
import { ReactComponent as Report } from "../../../assets/icons/Report.svg";

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

export default function Clients(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(false);

  const [avatar, setAvatar] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [notifyDays, setNotifyDays] = useState("");
  const [information, setInformation] = useState("");
  const [functionality, setFunctionality] = useState("DELIVERY");
  const [typeOfContract, setTypeOfContract] = useState("CLIENTPERSITE");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_CLIENTS}?page=${page}`,
      });
      let resultArray = result.data.items.map((item) => [
        item.companyId.name,
        item.companyId.incharge.firstName +
          " " +
          item.companyId.incharge.lastName,
        item.companyId.incharge.phone,
        2,
        moment(item.contractStartDate).format("DD/MM/YY"),
        moment(item.contractEndDate).format("DD/MM/YY"),
        item.isPendingResponse ? "Requested" : item.companyId.type,
      ]);
      setClients(resultArray);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err, "error"),
        ),
      );
    }
  }

  return (
    <>
      <div className={classes.root}>
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
        <Form.Row noMargin>
          <SearchInput placeholder="Name of Client" />
        </Form.Row>
        <div className={classes.content}>
          <Table
            headers={GLOBALS.Data.clients.headings}
            rows={clients.map((item) =>
              item[6] === "Requested"
                ? [
                    ...item,
                    <IconButton>
                      <Plus style={{ width: 18, height: 18 }} />
                    </IconButton>,
                  ]
                : [
                    ...item,
                    <>
                      <IconButton onClick={() => setModal(true)}>
                        <Pencil style={{ width: 18, height: 18 }} />
                      </IconButton>
                      <IconButton component={NavLink} to="/clients/invoices">
                        <Report style={{ width: 18, height: 18 }} />
                      </IconButton>
                    </>,
                  ],
            )}
          />
        </div>
      </div>
      <Modal
        open={modal}
        title={"EDIT CLIENT"}
        onClose={() => setModal((st) => !st)}
        body={
          <Form.Form>
            <Form.Row justifyContent="center">
              <AvatarUpload
                onChange={(file) => {
                  const uri = URL.createObjectURL(file);
                  setAvatar({ file, uri });
                }}
                value={avatar}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormInput
                placeholder="Color"
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
            <Form.Row>
              <FormInput
                placeholder="First Name"
                style={GLOBALS.Styles.inputWidth}
              />
              <FormInput
                placeholder="Last Name"
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
            <Form.Row>
              <FormInput
                placeholder="E-mail"
                style={GLOBALS.Styles.inputWidth}
              />
              <FormInput
                placeholder="Phone"
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
            <Form.Row>
              <FormInput
                type="date"
                value={startDate}
                placeholder="Start date"
                style={GLOBALS.Styles.inputWidth}
                onChance={({ target: { value } }) => setStartDate(value)}
              />
              <FormInput
                type="date"
                value={endDate}
                placeholder="End date"
                style={GLOBALS.Styles.inputWidth}
                onChance={({ target: { value } }) => setEndDate(value)}
              />
            </Form.Row>
            <Form.Row>
              <RadioButton
                value={typeOfContract}
                onChange={({ target: { value } }) => setTypeOfContract(value)}
                items={[
                  { value: "CLIENTPERSITE", label: "Per Site" },
                  { value: "MASTERCLIENT", label: "Master Contract" },
                ]}
              />
            </Form.Row>
            <Form.Row>
              <RadioButton
                value={functionality}
                onChange={({ target: { value } }) => setFunctionality(value)}
                items={[{ value: "DELIVERY", label: "Delivery module" }]}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <Form.Row noMargin alignItems="center" width="150px">
                <FormInput
                  type="number"
                  value={notifyDays}
                  placeholder="Price"
                  style={{ ...GLOBALS.Styles.inputWidth, maxWidth: 100 }}
                  onChange={({ target: { value } }) => setNotifyDays(value)}
                />
                <SmallText primary="€/month" />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <FormInput
                textArea
                rows={3}
                value={information}
                // style={GLOBALS.Styles.inputWidth}
                placeholder="Additional information"
                onChange={({ target: { value } }) => setInformation(value)}
              />
            </Form.Row>
          </Form.Form>
        }
        actions={
          <Form.Column alignItems="center">
            <Form.Row justifyContent="center">
              <Button text="VALIDATE" fullWidth={false} minWidth="30%" />
            </Form.Row>
            <Form.Row justifyContent="center">
              <Button
                text="DELETE"
                fullWidth={false}
                minWidth="30%"
                color={theme.palette.error.main}
              />
            </Form.Row>
          </Form.Column>
        }
      />
    </>
  );
}
