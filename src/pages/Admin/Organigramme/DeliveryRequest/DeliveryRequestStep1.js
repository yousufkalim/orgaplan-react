import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";

import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";

import Form from "../../../../components/Form";
import Button from "../../../../components/Button";
import FormInput from "../../../../components/FormInput";
import FormLabel from "../../../../components/FormLabel";
import TimeInput from "../../../../components/TimeInput";
import FormSelect from "../../../../components/FormSelect";
import FormMultiSelect from "../../../../components/FormMultiSelect";
import MultiAdderInput from "../../../../components/MultiAdderInput";

export default function AddSiteStep1(props) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [company, setCompany] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, stEndTime] = useState("");
  const [trades, setTrades] = useState([]);
  const [means, setMeans] = useState("");
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      // const response = await GLOBALS.API({
      //   uri: `${GLOBALS.Constants.ZACS}`,
      // });

      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const values = {
      trades,
    };
    props.setStep1Data(values);
    props.setStep(2);
  }

  return (
    <Form.Form onSubmit={onSubmit}>
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
            onChange={(value) => stEndTime(value)}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="SELECT TRADES* :" />
        <FormMultiSelect
          name="trades"
          value={trades}
          values={props.trades}
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setTrades(value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="UNLOADING MEANS* :" />
        <FormMultiSelect
          name="means"
          value={means}
          values={props.means}
          placeholder="Means"
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setMeans(value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="MATERIALS DELIVERED* :" />
        <MultiAdderInput
          name="materials"
          values={materials}
          placeholder="Enter Materials"
          style={GLOBALS.Styles.inputWidth}
          onChange={(values) => setMaterials(values)}
        />
      </Form.Row>
      <Form.ButtonContainer>
        <Button
          type="submit"
          minWidth={200}
          text="VALIDATE"
          fullWidth={false}
          loading={loading}
          disabled={
            loading ||
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
