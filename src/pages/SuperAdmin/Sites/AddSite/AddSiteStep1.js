import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import * as Yup from "yup";

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

// const addSiteYup = Yup.object().shape({
//   name: Yup.string().required("Required"),
//   logo: Yup.array().min(1, "Required").required("Required"),
//   zacId: Yup.string().optional(),
//   adminId: Yup.string().optional(),
//   functionality: Yup.string().required("Required"),
//   addresses: Yup.array()
//     .of(
//       Yup.object().shape({
//         key: Yup.number().required("Required"),
//         street: Yup.string().required("Required"),
//         city: Yup.string().required("Required"),
//         postal: Yup.string().required("Required"),
//       }),
//     )
//     .min(1, "At least one address is required")
//     // .max(3)
//     .required("Required"),
//   trades: Yup.array().of(Yup.string()).optional(),
//   penaltyforLateDelivery: Yup.number()
//     .min(1, "Value should be greater than 0")
//     .max(9999)
//     .required("Required"),
//   penaltyforUnexpDelivery: Yup.number()
//     .min(1, "Value should be greater than 0")
//     .max(9999)
//     .required("Required"),
// });

export default function AddSiteStep1(props) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [zacs, setZacs] = useState([]);
  const [clientsOriginal, setClientsOriginal] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientName, setClientName] = useState("");
  const [update, setUpdate] = useState(false);

  const [name, setName] = useState("");
  const [logo, setLogo] = useState([]);
  const [zacId, setZacId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [functionality, setFunctionality] = useState("DELIVERY");
  const [addresses, setAddresses] = useState([]);
  const [trades, setTrades] = useState([]);
  const [penaltyforLateDelivery, setPenaltyforLateDelivery] = useState("0");
  const [penaltyforUnexpDelivery, setPenaltyforUnexpDelivery] = useState("0");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    clientsOriginal.map((client) => {
      if (client._id === adminId) setClientName(client.companyId.name);
      return true;
    });
  }, [clientsOriginal, adminId]);

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
      const clientsArray = [];
      clientsResult.data.items.map((client) => {
        if (client.userId) {
          // if (client.companyId.type !== "MASTERCLIENT") {
          clientsArray.push({
            value: client._id,
            label: `${client.userId.firstName} ${client.userId.lastName}`,
          });
          // }
          return true;
        }
        return true;
      });
      setClientsOriginal(clientsResult.data.items);
      setZacs(zacsArray);
      setClients(clientsArray);
      setAdminId(clientsArray[0].value);
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
  }

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
            // error={name}
            placeholder="Site name"
            style={GLOBALS.Styles.inputWidth}
            onChange={({ target: { name, value } }) =>
              handleChange(name, value)
            }
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
            onChange={(values) => handleChange("profile", values)}
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
              placeholder="Select a ZAC"
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
            width="48%"
            noMargin
            alignItems="center"
            justifyContent="flex-start"
          >
            <FormSelect
              name="adminId"
              value={adminId}
              values={clients}
              // error={adminId}
              // placeholder="Admin"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
            <SmallText style={{ marginLeft: 10 }} primary={clientName} />
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
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="TRADES : " />
          <MultiAdderInput
            name="trades"
            values={trades}
            placeholder="Entert trades"
            style={GLOBALS.Styles.inputWidth}
            onChange={(values) => handleChange("trades", values)}
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
                  handleChange(name, value)
                }
              />
              <SmallText style={{ marginLeft: 10 }} primary="€" />
            </Form.Row>
            <Form.Row width="48%" noMargin alignItems="center">
              <FormInput
                type="number"
                placeholder="Unexp delivery"
                name="penaltyforUnexpDelivery"
                value={penaltyforUnexpDelivery}
                // error={penaltyforUnexpDelivery}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <SmallText style={{ marginLeft: 10 }} primary="€" />
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
            disabled={loading || !name || !adminId || addresses.length === 0}
          />
        </Form.ButtonContainer>
      </Form.Form>
    </>
  );
}
