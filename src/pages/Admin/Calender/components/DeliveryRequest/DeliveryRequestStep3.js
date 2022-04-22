import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import GLOBALS from "../../../../../globals";
import Actions from "../../../../../redux/actions";

import Form from "../../../../../components/Form";
import Button from "../../../../../components/Button";
import FormLabel from "../../../../../components/FormLabel";
import FormInput from "../../../../../components/FormInput";
import FormCheckbox from "../../../../../components/FormCheckbox";
import { TEXTS } from "../../../../../assets/languages/french";

export default function DeliveryRequestStep3(props) {
  const {
    IDENTITY,
    DATE_AND_TIME,
    DELIVERYAREA,
    MEAN,
    STORAGEAREA,
    MATERIALS_DELIVERED,
    COMMENTS,
    VALIDATE,
    MEANS,
    Receive_Summary_by_email,
  } = TEXTS;
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState("");
  const [receiveSummary, setReceiveSummary] = useState(false);

  const [company, setCompany] = useState("");
  const [storageArea, setStorageArea] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [liftingMeans, setLiftingMeans] = useState([]);
  const [routingMeans, setRoutingMeans] = useState([]);
  useEffect(() => {
    let comp = props.companies.find(
      (item) => item.value === props.step1Data.company,
    );

    comp && setCompany(comp.label);
    let deliv = props.deliveryAreas.find(
      (item) => item._id === props.step1Data.deliveryArea,
    );
    deliv && setDeliveryArea(deliv.name);
    let stor = props.storageAreas.find(
      (item) => item._id === props.step2Data.storageArea,
    );
    stor && setStorageArea(stor.name);
    if (props.step1Data.liftingMeans) {
      let liftMea = props.means.filter((item) =>
        props.step1Data.liftingMeans.includes(item._id),
      );
      liftMea && setLiftingMeans(liftMea.map((item) => item.name));
    }
    if (props.step2Data.routingMeans) {
      let routMeans = props.means.filter((item) =>
        props.step2Data.routingMeans.includes(item._id),
      );
      routMeans && setRoutingMeans(routMeans.map((item) => item.name));
    }
    if (props.step3Data) {
      setComments(props.step3Data.comment);
      setReceiveSummary(props.step3Data.sendDeliverySummary);
    }
    // eslint-disable-next-line
  }, [props]);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formdata = {
        siteId: adminStore.site.siteId._id,
        companyId: props.step1Data.company,
        userId: store.user._id,
        deliveryArea: props.step1Data.deliveryArea,
        storageArea: props.step2Data.storageArea,
        comment: comments,
        sendDeliverySummary: receiveSummary,
        userEmail: store.user.email,
        trades: props.step1Data.trades,
        liftingMeans: props.step1Data.liftingMeans,
        routingMeans: props.step2Data.routingMeans,
        materials: props.step1Data.materials,
        date: props.step1Data.date,
        sDate: moment(props.step1Data.date)
          .set("hours", props.step1Data.startTime.split(":")[0])
          .set("minutes", props.step1Data.startTime.split(":")[1]),
        eDate: moment(props.step1Data.date)
          .set("hours", props.step1Data.endTime.split(":")[0])
          .set("minutes", props.step1Data.endTime.split(":")[1]),
        startTime: props.step1Data.startTime,
        endTime: props.step1Data.endTime,
        type: "SCHEDULED",
        status:
          props.eventId && !props.editDelivery
            ? "MODIFIED"
            : props?.event?.status
            ? props.event.status
            : "VALIDATED",
      };
      if (props.event) {
      } else {
        if (props.step1Data.selectedMeans.length >= 1) {
          const response = await GLOBALS.API({
            uri: `${GLOBALS.Constants.GET_LIST_OF_MEANS}/${adminStore.site.siteId._id}`,
            token: store.token,
          });
          if (props.step2Data.selectedRoutingMeans.length >= 1) {
            props.step2Data.selectedRoutingMeans.map(async (m) => {
              let startHour = moment(props.step1Data.date)
                .set("hours", props.step1Data.startTime.split(":")[0])
                .format("H");
              let endHour = moment(props.step1Data.date)
                .set("hours", props.step1Data.endTime.split(":")[0])
                .format("H");

              const mean = response.data.meanList.find(
                (mean) => mean._id == m.value,
              );
              // create invoive
              var formdata1 = new FormData();
              formdata1.append("name", mean?.name);
              formdata1.append(
                "date",
                moment(props.step1Data.date).format("YYYY-MM-DD"),
              );
              mean?.isInside
                ? formdata1.append(
                    "meanLocation",
                    mean.levelName + "/" + mean.buildingName,
                  )
                : formdata1.append("meanLocation", "Exterior");

              formdata1.append("time", props.step1Data.date);
              formdata1.append("type", "MEAN");
              formdata1.append("isBillable", true);
              formdata1.append(
                "price",
                mean.pricePerHour * (endHour - startHour),
              );
              formdata1.append("isPaid", false);
              formdata1.append("companyId", props.step1Data?.company);
              formdata1.append("siteId", mean.siteId);

              // for (let [key, value] of formdata1) {
              //   console.log(
              //     `formdata1 in meanbook2 delivery invoice ${key}: ${value}`,
              //   );
              // }
              await GLOBALS.API({
                method: "POST",
                uri: GLOBALS.Constants.POST_ADD_SITE_INCIDENTS,
                headers: {
                  Authorization: `Bearer ${store.token}`,
                },
                body: formdata1,
              });
              // invice end
            });
          }
          if (props.step1Data.selectedMeans.length >= 1) {
            props.step1Data.selectedMeans.map(async (m) => {
              let startHour = moment(props.step1Data.date)
                .set("hours", props.step1Data.startTime.split(":")[0])
                .format("H");
              let endHour = moment(props.step1Data.date)
                .set("hours", props.step1Data.endTime.split(":")[0])
                .format("H");

              const mean = response.data.meanList.find(
                (mean) => mean._id == m.value,
              );

              // create invoive
              var formdata1 = new FormData();
              formdata1.append("name", mean.name);
              formdata1.append(
                "date",
                moment(props.step1Data.date).format("YYYY-MM-DD"),
              );
              mean?.isInside
                ? formdata1.append(
                    "meanLocation",
                    mean.levelName + "/" + mean.buildingName,
                  )
                : formdata1.append("meanLocation", "Exterior");

              formdata1.append("time", props.step1Data.date);
              formdata1.append("type", "MEAN");
              formdata1.append("isBillable", true);
              formdata1.append(
                "price",
                mean.pricePerHour * (endHour - startHour),
              );
              formdata1.append("isPaid", false);
              formdata1.append("companyId", props.step1Data?.company);
              formdata1.append("siteId", mean.siteId);

              // for (let [key, value] of formdata1) {
              //   console.log(
              //     `formdata1 in meanbook1 delivery invoice ${key}: ${value}`,
              //   );
              // }
              await GLOBALS.API({
                method: "POST",
                uri: GLOBALS.Constants.POST_ADD_SITE_INCIDENTS,
                headers: {
                  Authorization: `Bearer ${store.token}`,
                },
                body: formdata1,
              });
              // invice end
            });
          }
        }
      }

      props.step2Data.building !== "Exterior" &&
        (formdata["building"] = props.step2Data.building);
      props.step2Data.level && (formdata["level"] = props.step2Data.level);
      await GLOBALS.API({
        method: props.eventId ? "PUT" : "POST",
        uri: props.eventId
          ? `${GLOBALS.Constants.DELIVERY}/${props.eventId}`
          : GLOBALS.Constants.DELIVERY,
        token: store.token,
        body: JSON.stringify(formdata),
      });

      setLoading(false);
      props.onClose();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  return (
    <Form.Form onSubmit={onSubmit}>
      <Form.Row>
        <FormLabel
          bold
          primary={`${IDENTITY} :`}
          style={GLOBALS.Styles.inputWidth}
        />
        <FormLabel primary={company || "-"} style={GLOBALS.Styles.inputWidth} />
      </Form.Row>
      <Form.Row>
        <FormLabel
          bold
          primary={`${DATE_AND_TIME} :`}
          style={GLOBALS.Styles.inputWidth}
        />
        <FormLabel
          primary={`${
            props.step1Data.date
              ? moment(props.step1Data.date).format("DD-MM-YYYY")
              : moment(props.date).format("DD-MM-YYYY")
          } between ${
            props.step1Data.startTime
              ? moment(props.step1Data.date)
                  .set("hours", props.step1Data.startTime.split(":")[0])
                  .set("minutes", props.step1Data.startTime.split(":")[1])
                  .format("HH:mm")
              : moment(moment(props.date).set("hour", props.start)).format(
                  "HH:mm",
                )
          }h and ${
            props.step1Data.endTime
              ? moment(props.step1Data.date)
                  .set("hours", props.step1Data.endTime.split(":")[0])
                  .set("minutes", props.step1Data.endTime.split(":")[1])
                  .format("HH:mm")
              : moment(moment(props.date).set("hour", props.end)).format(
                  "HH:mm",
                )
          }h`}
          style={GLOBALS.Styles.inputWidth}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel
          bold
          primary={`${DELIVERYAREA} / ${MEAN} :`}
          style={GLOBALS.Styles.inputWidth}
        />
        <FormLabel
          primary={`${deliveryArea || "-"} / ${liftingMeans.join(", ") || "-"}`}
          style={GLOBALS.Styles.inputWidth}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel
          bold
          primary={`${STORAGEAREA} / ${MEAN} :`}
          style={GLOBALS.Styles.inputWidth}
        />
        <FormLabel
          primary={`${storageArea || "-"} / ${routingMeans.join(", ") || "-"}`}
          style={GLOBALS.Styles.inputWidth}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel
          bold
          primary={`${MATERIALS_DELIVERED} :`}
          style={GLOBALS.Styles.inputWidth}
        />
        <FormLabel
          primary={
            props.step1Data.materials
              ? props.step1Data.materials.join(", ")
              : "-"
          }
          style={GLOBALS.Styles.inputWidth}
        />
      </Form.Row>
      <Form.Row alignItems="flex-start">
        <FormLabel bold primary={`${COMMENTS}:`} />
        <FormInput
          textArea
          rows={3}
          name="comments"
          value={comments}
          placeholder={COMMENTS}
          // disabled={props.eventId}
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setComments(value)}
        />
      </Form.Row>
      <Form.Row>
        <div />
        <Form.Row style={GLOBALS.Styles.inputWidth} noMargin>
          <FormCheckbox
            name="receiveSummary"
            checked={receiveSummary}
            disabled={props.eventId}
            label={Receive_Summary_by_email}
            onChange={({ target: { checked } }) => setReceiveSummary(checked)}
          />
        </Form.Row>
      </Form.Row>
      <Form.ButtonContainer>
        <Button
          type="submit"
          minWidth={200}
          text={VALIDATE}
          fullWidth={false}
          loading={loading}
          disabled={loading || !company || !storageArea || !deliveryArea}
        />
      </Form.ButtonContainer>
    </Form.Form>
  );
}
