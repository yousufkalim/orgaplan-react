import React, { useState, useEffect } from "react";
import moment from "moment";

import GLOBALS from "../../../../../globals";

import Form from "../../../../../components/Form";
import Button from "../../../../../components/Button";
import FormInput from "../../../../../components/FormInput";
import FormLabel from "../../../../../components/FormLabel";
import TimeInput from "../../../../../components/TimeInput";
import FormSelect from "../../../../../components/FormSelect";
import FormMultiSelect from "../../../../../components/FormMultiSelect";
import MultiAdderInput from "../../../../../components/MultiAdderInput";

export default function AddSiteStep1(props) {
  const [company, setCompany] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [trades, setTrades] = useState([]);
  const [means, setMeans] = useState([]);
  const [liftingMeans, setLiftingMeans] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (props.step1Data) {
      setCompany(props.step1Data.company);
      setDeliveryArea(props.step1Data.deliveryArea);
      setDate(props.step1Data.date);
      props.step1Data.startTime &&
        setStartTime(
          moment(props.step1Data.date)
            .set("hours", props.step1Data.startTime.split(":")[0])
            .set("minutes", props.step1Data.startTime.split(":")[1]),
        );
      props.step1Data.endTime &&
        setEndTime(
          moment(props.step1Data.date)
            .set("hours", props.step1Data.endTime.split(":")[0])
            .set("minutes", props.step1Data.endTime.split(":")[1]),
        );
      setTrades(props.step1Data.trades);
      setMaterials(
        props.step1Data.materials &&
          props.step1Data.materials.map((item, i) => ({ key: i, label: item })),
      );
      setLiftingMeans(props.step1Data.liftingMeans);
      setUpdate((st) => !st);
    } else {
      setDate(props.date);
      setStartTime(moment(props.date).set("hour", props.start));
      setEndTime(moment(props.date).set("hour", props.end));
    }
    // eslint-disable-next-line
  }, [props.step1Data]);

  useEffect(() => {
    setMeans(
      props.means.reduce((accumulator, currentValue) => {
        if (
          currentValue.meanType === "LIFTING" &&
          currentValue.location.find(
            (loc) => loc.deliveryArea && loc.deliveryArea === deliveryArea,
          ) &&
          moment(props.date).isBetween(
            currentValue.availability.start,
            currentValue.availability.end,
            "day",
            "[]",
          )
        ) {
          accumulator.push({
            value: currentValue._id,
            label: currentValue.name,
          });
        }
        return accumulator;
      }, []),
    );
    // eslint-disable-next-line
  }, [deliveryArea]);

  async function onSubmit(e) {
    e.preventDefault();
    const values = {
      company,
      deliveryArea,
      date,
      startTime: moment(startTime).format("HH:mm"),
      endTime: moment(endTime).format("HH:mm"),
      trades,
      liftingMeans,
      materials: materials.map((item) => item.label),
    };
    props.setStep1Data(values);
    props.setStep(2);
  }

  return (
    <Form.Form onSubmit={onSubmit}>
      {update && ""}
      <Form.Row>
        <FormLabel bold primary="COMPANY* :" />
        <FormSelect
          name="company"
          value={company}
          values={props.companies}
          placeholder="Select a Company"
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setCompany(value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="DELIVERY AREA* :" />
        <FormSelect
          name="deliveryArea"
          value={deliveryArea}
          values={props.deliveryAreas}
          style={GLOBALS.Styles.inputWidth}
          placeholder="Select a Delivery Area"
          onChange={({ target: { value } }) => setDeliveryArea(value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="DATE AND TIME* :" />
        <Form.Row width="48%" noMargin>
          <FormInput
            type="date"
            name="date"
            value={date}
            disabled={true}
            placeholder="Date"
            style={{ width: "31%" }}
            min={moment().format("YYYY-MM-DD")}
            onChange={({ target: { value } }) => setDate(value)}
          />
          <TimeInput
            format="HH:mm"
            name="startTime"
            value={startTime}
            placeholder="Start Time"
            style={{ width: "31%" }}
            onChange={(value) => setStartTime(value)}
          />
          <TimeInput
            name="endTime"
            format="HH:mm"
            value={endTime}
            placeholder="End Time"
            style={{ width: "31%" }}
            onChange={(value) => setEndTime(value)}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="SELECT TRADES* :" />
        <FormMultiSelect
          name="trades"
          value={trades}
          placeholder="Trades"
          values={props.trades}
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setTrades(value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="UNLOADING MEANS* :" />
        <FormMultiSelect
          name="means"
          values={means}
          placeholder="Means"
          value={liftingMeans}
          disabled={!deliveryArea}
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setLiftingMeans(value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="MATERIALS DELIVERED* :" />
        <MultiAdderInput
          name="materials"
          values={materials}
          placeholder="Enter Materials"
          style={GLOBALS.Styles.inputWidth}
          onChange={(values) => {
            setMaterials(values);
            setUpdate((st) => !st);
          }}
        />
      </Form.Row>
      <Form.ButtonContainer>
        <Button
          type="submit"
          minWidth={200}
          text="VALIDATE"
          fullWidth={false}
          disabled={
            !company ||
            !deliveryArea ||
            !date ||
            !startTime ||
            !endTime ||
            trades.length === 0 ||
            means.length === 0 ||
            materials.length === 0
          }
        />
      </Form.ButtonContainer>
    </Form.Form>
  );
}
