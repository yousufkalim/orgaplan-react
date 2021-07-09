import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";

import Form from "../../../../components/Form";
import Button from "../../../../components/Button";
import SmallText from "../../../../components/SmallText";
import FormInput from "../../../../components/FormInput";
import FormLabel from "../../../../components/FormLabel";
import FormSelect from "../../../../components/FormSelect";
import RadioButton from "../../../../components/RadioButton";
import MultiAdderInput from "../../../../components/MultiAdderInput";
import FormMultipleUpload from "../../../../components/FormMultipleUpload";
import MultiAdderInputModal from "../../../../components/MultiAdderInputModal";

export default function EditSiteStep1(props) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [zacs, setZacs] = useState([]);
  const [clients, setClients] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [clientName, setClientName] = useState("");
  const [update, setUpdate] = useState(false);

  const [name, setName] = useState("");
  const [logo, setLogo] = useState([]);
  const [zacId, setZacId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [functionality, setFunctionality] = useState("DELIVERY");
  const [addresses, setAddresses] = useState([]);
  const [trades, setTrades] = useState([]);
  const [penaltyforLateDelivery, setPenaltyforLateDelivery] = useState("");
  const [penaltyforUnexpDelivery, setPenaltyforUnexpDelivery] = useState("");

  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [adminError, setAdminError] = useState("");
  const [tradesError, setTradeError] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    clients.map((client) =>
      client.adminIds.map(
        (admin) =>
          admin._id === adminId && setClientName(client.companyId.name),
      ),
    );
  }, [clients, adminId]);

  async function fetchData() {
    try {
      const zacsResult = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ZACS}`,
      });
      const clientsResult = await GLOBALS.API({
        uri: `${GLOBALS.Constants.CLIENTS}`,
      });
      const zacsArray = zacsResult.data.items.map((zac) => ({
        value: zac._id,
        label: zac.name,
      }));
      const adminsArray = [];
      clientsResult.data.items.map((client) => {
        client.adminIds.map((admin) =>
          adminsArray.push({
            value: admin._id,
            label: `${admin.firstName} ${admin.lastName}`,
          }),
        );
        return true;
      });
      setZacs(zacsArray);
      setAdmins(adminsArray);
      setClients(clientsResult.data.items);
      setAdminId(adminsArray.length > 0 ? adminsArray[0].value : "");

      // Filling the fields
      const propData = props.step1Data;
      propData.name && setName(propData.name);
      propData.logo &&
        setLogo([{ key: 0, file: undefined, uri: propData.logo }]);
      propData.zacId && setZacId(propData.zacId);
      propData.adminId && setAdminId(propData.adminId);
      propData.functionality && setFunctionality(propData.functionality);
      propData.addresses && setAddresses(propData.addresses);
      propData.trades && setTrades(propData.trades);
      propData.penaltyforLateDelivery &&
        setPenaltyforLateDelivery(propData.penaltyforLateDelivery);
      propData.penaltyforUnexpDelivery &&
        setPenaltyforUnexpDelivery(propData.penaltyforUnexpDelivery);

      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function handleChange(name, value) {
    if (name === "name") setName(value);
    else if (name === "logo") setLogo(value);
    else if (name === "zacId") setZacId(value);
    else if (name === "adminId") setAdminId(value);
    else if (name === "functionality") setFunctionality(value);
    else if (name === "addresses") {
      setUpdate((st) => !st);
      setAddresses(value);
    } else if (name === "trades") setTrades(value);
    else if (name === "penaltyforLateDelivery")
      setPenaltyforLateDelivery(value);
    else if (name === "penaltyforUnexpDelivery")
      setPenaltyforUnexpDelivery(value);

    validation(name, value);
  }

  const validation = (name, value) => {
    if (name == "name") {
      if (!value) {
        setNameError("Please enter site name");
      } else {
        setNameError("");
      }
    } else if (name == "adminId") {
      if (!value) {
        setAdminError("Please enter site responsible");
      } else {
        setAdminError("");
      }
    } else if (name == "addresses") {
      if (!value.length > 0) {
        setAddressError("Please enter address");
      } else {
        setAddressError("");
      }
    } else if (name == "trades") {
      if (!value || value.length < 1) {
        setTradeError("Please enter atleast one trade");
      } else {
        setTradeError("");
      }
    }
  };

  async function onSubmit(e) {
    e.preventDefault();
    const values = {
      name,
      logo,
      zacId,
      adminId,
      functionality,
      addresses,
      trades,
      penaltyforLateDelivery,
      penaltyforUnexpDelivery,
    };
    props.setStep1Data(values);
    props.setStep(2);
  }

  return (
    <>
      <Form.Form onSubmit={onSubmit}>
        <Form.Row>
          <FormLabel bold primary="SITE NAME* :" />
          <FormInput
            name="name"
            value={name}
            // maxLength="50"
            // error={name}
            placeholder="Site name"
            style={GLOBALS.Styles.inputWidth}
            onChange={({ target: { name, value } }) =>
              handleChange(name, value)
            }
            onBlur={({ target: { name, value } }) => validation(name, value)}
            error={nameError}
          />
        </Form.Row>
        {update && ""}
        <Form.Row>
          <FormLabel bold primary="SITE PICTURE : " />
          <FormMultipleUpload
            name="logo"
            values={logo}
            // error={logo}
            style={GLOBALS.Styles.inputWidth}
            onChange={(values) => handleChange("logo", values)}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="ZAC OF THE SITE : " />
          <Form.Row width="48%" noMargin>
            <FormSelect
              name="zacId"
              values={zacs}
              value={zacId}
              // error={zacId}
              placeholder="Select ZAC"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="SITE RESPONSIBLE* :" />
          <Form.Row
            noMargin
            width="48%"
            alignItems="center"
            justifyContent="flex-start"
          >
            <FormSelect
              name="adminId"
              value={adminId}
              values={admins}
              // error={adminId}
              placeholder="Select Admin"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              error={adminError}
            />
            <SmallText
              noMargin
              style={{ marginLeft: 10 }}
              primary={clientName}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="AVAILABLE FUNCTIONALITY : " />
          <RadioButton
            name="functionality"
            value={functionality}
            // error={functionality}
            style={GLOBALS.Styles.inputWidth}
            items={[{ value: "DELIVERY", label: "Delivery module" }]}
            onChange={({ target: { name, value } }) =>
              handleChange(name, value)
            }
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="SITE ADDRESS(ES)* : " />
          <MultiAdderInputModal
            name="addresses"
            values={addresses}
            // error={addresses}
            style={GLOBALS.Styles.inputWidth}
            placeholder="Enter site addresses"
            onChange={(values) => handleChange("addresses", values)}
            error={addressError}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="TRADES* : " />
          <MultiAdderInput
            name="trades"
            values={trades}
            placeholder="Entert trades"
            style={GLOBALS.Styles.inputWidth}
            onChange={(values) => handleChange("trades", values)}
            onBlur={
              trades.length < 1 &&
              (({ target: { name, value } }) => validation(name, value))
            }
            setTradeError={setTradeError}
            trades={trades}
            error={tradesError}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="COST OF DELIVERY PENALITIES: " />
          <Form.Row width="48%" noMargin>
            <Form.Row width="48%" noMargin alignItems="center">
              <FormInput
                type="number"
                placeholder="Delay"
                name="penaltyforLateDelivery"
                value={penaltyforLateDelivery}
                // error={penaltyforLateDelivery}
                onChange={({ target: { name, value } }) =>
                  value >= 0 && handleChange(name, value)
                }
              />
              <SmallText noMargin primary="€" style={{ marginLeft: 10 }} />
            </Form.Row>
            <Form.Row width="48%" noMargin alignItems="center">
              <FormInput
                type="number"
                placeholder="Unexp delivery"
                name="penaltyforUnexpDelivery"
                value={penaltyforUnexpDelivery}
                // error={penaltyforUnexpDelivery}
                onChange={({ target: { name, value } }) =>
                  value >= 0 && handleChange(name, value)
                }
              />
              <SmallText noMargin primary="€" style={{ marginLeft: 10 }} />
            </Form.Row>
          </Form.Row>
        </Form.Row>
        <Form.ButtonContainer>
          <Button
            type="submit"
            minWidth={200}
            text="VALIDATE"
            fullWidth={false}
            loading={loading}
            disabled={
              !name ||
              nameError ||
              !adminId ||
              adminError ||
              addresses.length === 0 ||
              addressError ||
              !trades ||
              tradesError
            }
          />
        </Form.ButtonContainer>
      </Form.Form>
    </>
  );
}
