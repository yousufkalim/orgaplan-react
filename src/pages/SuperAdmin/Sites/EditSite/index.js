import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import { TEXTS } from "../../../../assets/languages/french";

import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";

import EditSiteStep1 from "./EditSiteStep1";
import EditSiteStep2 from "./EditSiteStep2";
import EditSiteStep3 from "./EditSiteStep3";
import Stepper from "../../../../components/Stepper";
import Heading from "../../../../components/Heading";
import { ReactComponent as BackArrow } from "../../../../assets/icons/BackArrow.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

export default function EditSite(props) {
  const { EDIT_SITE, General_Information } = TEXTS;
  const classes = useStyles();
  const dispatch = useDispatch();
  // const store = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [step1Data, setStep1Data] = useState("");
  const [step2Data, setStep2Data] = useState("");
  const [step2SubmittedData, setStep2SubmittedData] = useState("");

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      let response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITE_GET}/${props.match.params.siteId}`,
      });
      response = response.data;

      const materials = response.materials.map((trade, index) => ({
        key: index,
        label: trade,
      }));

      const trades = response.trades.map((trade, index) => ({
        key: index,
        label: trade,
      }));
      const addresses = response.addresses.map((address, index) => ({
        _id: index,
        street: address.street,
        city: address.city,
        postal: address.postal,
        label: `${address.street} ${address.city} ${address.postal}`,
      }));

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

      setStep1Data({
        name: response.name,
        logo: response.logo,
        zacId: response.zacId?._id,
        clientAdmin: response.clientAdmin,
        functionality: response.functionality,
        addresses: addresses,
        trades: trades,
        materials: materials,

        penaltyforLateDelivery: response.penaltyforLateDelivery,
        penaltyforUnexpDelivery: response.penaltyforUnexpDelivery,
        zacsArray: zacsArray,
        adminsArray: adminsArray,
        clientsResult: clientsResult.data.items,
      });

      const openingHours = {};
      response.openingHours.map((day) => {
        openingHours[`day${day.day}Start`] = day.startHour;
        openingHours[`day${day.day}End`] = day.endHour;
        openingHours[`day${day.day}Off`] = day.dayOff;
        return true;
      });
      const unavailabilityDates = [];

      response.unavailabilityDates.map((key) => {
        unavailabilityDates.push({
          date: key.date,
          dayOff: key.dayOff,
          endHour: key.endHour,
          reason: key.reason,
          startHour: key.startHour,
        });
        return true;
      });
      const notificationToArray = response.notificationTo.map(
        (notification, index) => ({
          key: index,
          label: notification,
        }),
      );
      setStep2Data({
        start: moment(response.start).format("YYYY-MM-DD"),
        end: moment(response.end).format("YYYY-MM-DD"),
        openingHours: openingHours,
        pdf: response.pdf,
        pdfFileName: response.pdfFileName,
        unavailabilityDates: unavailabilityDates,
        additionalInfo: response.additionalInfo,
        notificationPriorToDays: response.notificationPriorToDays,
        notificationTo: notificationToArray,
      });

      setData(response);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary={EDIT_SITE} />
      <Stepper
        step={step}
        setStep={!disabled && setStep}
        steps={[
          `Step 1: ${General_Information}`,
          "Step 2: Dates",
          "Step 3: Plan",
        ]}
      />
      <div className={classes.content}>
        {!loading &&
          (step === 1 ? (
            <EditSiteStep1
              {...props}
              data={data}
              step={step}
              setStep={setStep}
              step1Data={step1Data}
              step2Data={step2Data}
              setStep1Data={setStep1Data}
              setStep2Data={setStep2Data}
              setDisabled={setDisabled}
              disabled={disabled}
            />
          ) : step === 2 ? (
            <EditSiteStep2
              {...props}
              data={data}
              step={step}
              setStep={setStep}
              step1Data={step1Data}
              step2Data={step2Data}
              setStep1Data={setStep1Data}
              setStep2Data={setStep2Data}
              step2SubmittedData={step2SubmittedData}
              setStep2SubmittedData={setStep2SubmittedData}
              setDisabled={setDisabled}
              disabled={disabled}
            />
          ) : (
            <EditSiteStep3
              {...props}
              data={data}
              step={step}
              setStep={setStep}
              step1Data={step1Data}
              step2Data={step2Data}
              setStep1Data={setStep1Data}
              setStep2Data={setStep2Data}
            />
          ))}
      </div>
    </div>
  );
}
