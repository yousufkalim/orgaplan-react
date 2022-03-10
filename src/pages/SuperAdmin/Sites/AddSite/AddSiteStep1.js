import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";
import { TEXTS } from "../../../../assets/languages/french";

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
import FormMultiSelect from "../../../../components/FormMultiSelect";
export default function AddSiteStep1(props) {
  const dispatch = useDispatch();
  const {
    Please_enter_site_name,
    Please_enter_site_responsible,
    Please_enter_address,
    Please_enter_atleast_one_trade,
    SITE_NAME,
    SITE_PICTURE,
    ZAC_OF_SITE,
    SELECT_ZAC,
    SITE_RESPONSIBLE,
    SELECT_ADMIN,
    AVAILABLE_FUNCTIONALITY,
    Delivery_Module,
    Site_address,
    Enter_site_addresses,
    TRADES,
    ENTER_TRADES,
    COST_OF_DELIVERY_PENALITIES,
    UNEXPECTED_DELIVERY,
    VALIDATE,
    DELAY,
  } = TEXTS;

  const [loading, setLoading] = useState(false);
  const [zacs, setZacs] = useState([]);
  const [clients, setClients] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [clientName, setClientName] = useState("");
  const [update, setUpdate] = useState(false);

  const [name, setName] = useState("");
  const [logo, setLogo] = useState([]);
  const [zacId, setZacId] = useState("");
  const [adminId, setAdminId] = useState([]);
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
    fetchStateData();
    // eslint-disable-next-line
  }, [props.setStep1Data]);

  const fetchStateData = () => {
    if (props.step1Data) {
      Object.keys(props.step1Data).map((key) => {
        handleChange(key, props.step1Data[key]);
      });
    }
  };
  useEffect(() => {
    clients.map((client) =>
      client.adminIds.map((admin) =>
        adminId !== ""
          ? admin._id === adminId && setClientName(client.companyId.name)
          : setClientName(""),
      ),
    );
  }, [clients, adminId]);

  async function fetchData() {
    try {
      const zacsResult = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ZACS}`,
      });

      const clientsResult = await GLOBALS.API({
        uri: `${GLOBALS.Constants.CLIENTS_GET_ALL}`,
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
            label: `${admin.firstName} ${admin.lastName} (${client.companyId.name})`,
            clientId: client._id,
            companyId: client.companyId._id,
          }),
        );

        return true;
      });

      setZacs(zacsArray);
      setAdmins(adminsArray);
      setClients(clientsResult.data.items);
      // setAdminId(adminsArray.length > 0 ? adminsArray[0].value : "");
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
    else if (name === "adminId") {
      setUpdate((st) => !st);
      setAdminId(value);
    } else if (name === "functionality") setFunctionality(value);
    else if (name === "addresses") {
      setUpdate((st) => !st);
      setAddresses(value);
    } else if (name === "trades") {
      setUpdate((st) => !st);
      setTrades(value);
    } else if (name === "penaltyforLateDelivery")
      setPenaltyforLateDelivery(value);
    else if (name === "penaltyforUnexpDelivery")
      setPenaltyforUnexpDelivery(value);

    validation(name, value);
  }

  // Form Validation

  const validation = (name, value) => {
    if (name == "name") {
      if (!value) {
        setNameError(Please_enter_site_name);
      } else {
        setNameError("");
      }
    } else if (name == "adminId") {
      if (!value) {
        setAdminError(Please_enter_site_responsible);
      } else {
        setAdminError("");
      }
    } else if (name == "addresses") {
      if (!value.length > 0) {
        setAddressError(Please_enter_address);
      } else {
        setAddressError("");
      }
    } else if (name == "trades") {
      if (!value || value.length < 1) {
        setTradeError(Please_enter_atleast_one_trade);
      } else {
        setTradeError("");
      }
    }
  };

  async function onSubmit(e) {
    e.preventDefault();
    let clientAdmin = [];
    admins.map((array, index) => {
      adminId.map((select) => {
        if (array.value.toString() === select.toString()) {
          clientAdmin.push({
            adminId: array.value,
            clientId: array.clientId,
            companyId: array.companyId,
          });
        }
      });
    });
    const values = {
      name,
      logo,
      zacId,
      clientAdmin,
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
          <FormLabel bold primary={`${SITE_NAME}* :`} />
          <FormInput
            name="name"
            value={name}
            // maxLength="50"
            // error={name}
            placeholder={SITE_NAME}
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
          <FormLabel bold primary={`${SITE_PICTURE} : `} />
          <FormMultipleUpload
            name="logo"
            values={logo}
            // error={logo}
            style={GLOBALS.Styles.inputWidth}
            onChange={(values) => handleChange("logo", values)}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary={`${ZAC_OF_SITE} : `} />
          <Form.Row width="48%" noMargin>
            <FormSelect
              name="zacId"
              values={zacs}
              value={zacId}
              // error={zacId}
              placeholder={SELECT_ZAC}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary={`${SITE_RESPONSIBLE}* :`} />
          <FormMultiSelect
            name="adminId"
            value={adminId}
            placeholder={SELECT_ADMIN}
            values={admins}
            condition={true}
            style={GLOBALS.Styles.inputWidth}
            onChange={({ target: { value } }) => handleChange("adminId", value)}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary={`${AVAILABLE_FUNCTIONALITY}  : `} />
          <RadioButton
            name="functionality"
            value={functionality}
            // error={functionality}
            style={GLOBALS.Styles.inputWidth}
            items={[{ value: "DELIVERY", label: Delivery_Module }]}
            onChange={({ target: { name, value } }) =>
              handleChange(name, value)
            }
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary={`${Site_address}* : `} />
          <MultiAdderInputModal
            name="addresses"
            values={addresses}
            // error={addresses}
            style={GLOBALS.Styles.inputWidth}
            placeholder={Enter_site_addresses}
            onChange={(values) => handleChange("addresses", values)}
            error={addressError}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary={`${TRADES}* : `} />
          <MultiAdderInput
            name="trades"
            values={trades}
            placeholder={ENTER_TRADES}
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
          <FormLabel bold primary={`${COST_OF_DELIVERY_PENALITIES}: `} />
          <Form.Row width="48%" noMargin>
            <Form.Row width="48%" noMargin alignItems="center">
              <FormInput
                type="number"
                placeholder={DELAY}
                name="penaltyforLateDelivery"
                value={penaltyforLateDelivery}
                // error={penaltyforLateDelivery}
                onChange={({ target: { name, value } }) =>
                  value >= 0 && handleChange(name, value)
                }
              />
              <SmallText noMargin style={{ marginLeft: 10 }} primary="€" />
            </Form.Row>
            <Form.Row width="48%" noMargin alignItems="center">
              <FormInput
                type="number"
                placeholder={UNEXPECTED_DELIVERY}
                name="penaltyforUnexpDelivery"
                value={penaltyforUnexpDelivery}
                // error={penaltyforUnexpDelivery}
                onChange={({ target: { name, value } }) =>
                  value >= 0 && handleChange(name, value)
                }
              />
              <SmallText noMargin style={{ marginLeft: 10 }} primary="€" />
            </Form.Row>
          </Form.Row>
        </Form.Row>
        <Form.ButtonContainer>
          <Button
            type="submit"
            minWidth={200}
            text={VALIDATE}
            fullWidth={false}
            loading={loading}
            disabled={
              !name ||
              nameError ||
              adminId.length === 0 ||
              adminError ||
              addresses.length === 0 ||
              addressError ||
              trades.length < 1
            }
          />
        </Form.ButtonContainer>
      </Form.Form>
    </>
  );
}
