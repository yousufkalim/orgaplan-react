import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";

import GLOBALS from "../../../../../globals";
import { useSelector, useDispatch } from "react-redux";
import { TEXTS } from "../../../../../assets/languages/french";

import Form from "../../../../../components/Form";
import Button from "../../../../../components/Button";
import FormInput from "../../../../../components/FormInput";
import FormLabel from "../../../../../components/FormLabel";
import TimeInput from "../../../../../components/TimeInput";
import FormSelect from "../../../../../components/FormSelect";
import FormMultiSelect from "../../../../../components/FormMultiSelect";
import MultiAdderInput from "../../../../../components/MultiAdderInput";
import Checkbox from "@material-ui/core/Checkbox";
import FormCheckbox from "../../../../../components/FormCheckbox";
import { getTime } from "date-fns";
import unavailabilityCheck from "../../../../../utils/unavailabilityCheck";

export default function AddSiteStep1(props) {
  const {
    COMPANY,
    VALIDATE,
    DELIVERYAREA,
    STORAGEAREA,
    Please_select_a_company,
    Please_select_Delivery_Area,
    DATE_AND_TIME,
    Start_time,
    End_time,
    SELECT_TRADES,
    TRADES,
    UNLOADING_MEANS,
    MEANS,
    MATERIALS_DELIVERED,
    ENTER_MATERIALS,
    NONE,
  } = TEXTS;

  const adminStore = useSelector((state) => state.admin);
  const store = useSelector((state) => state.auth);
  const [company, setCompany] = useState("");
  let { deliveryArea, setDeliveryArea } = props;
  const [filterdeliveryArea, setFilterdeliveryArea] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [trades, setTrades] = useState([]);
  const [means, setMeans] = useState([]);
  const [liftingMeans, setLiftingMeans] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [update, setUpdate] = useState(false);
  const [disableMean, setDisableMean] = useState("");
  const [siteAvailabilityStart] = useState(adminStore.site.siteId.start);
  const [siteAvailabilityEnd] = useState(adminStore.site.siteId.end);
  const [disableLiftingMeans, setDisableLiftingMeans] = useState(false);
  let endTimeDisabledHours = [];
  let startTimeDisabledHours = [];
  var minutes = [];
  const [unavailableMsg, setunavailableMsg] = useState([]);

  const getDisabledHoursEndTime = () => {
    let startTimeIs = moment(startTime).toDate().getHours();
    for (var i = 0; i <= startTimeIs; i++) {
      endTimeDisabledHours.push(i);
    }
    return endTimeDisabledHours;
  };

  // Function to disable previous time on current date
  var d = new Date();
  const getDisabledHoursStartTime = () => {
    for (var i = 0; i <= d.getHours(); i++) {
      startTimeDisabledHours.push(i);
    }
    return startTimeDisabledHours;
  };

  const checkavailability = (value) => {
    let customDate = "2021-06-06";
    return true;
  };
  // filter delivery area Which are not availbile
  const filterUnavailableDeliveryArea = () => {
    let result = [];
    let currentDate = moment(props.date).format("L");
    setFilterdeliveryArea(
      props.deliveryAreas.reduce((accumulator, currentValue) => {
        let start = moment(startTime).format("HH:mm").substring(0, 2);
        let end = moment(endTime).format("HH:mm").substring(0, 2);
        //////// Checking unavailabilities
        result = unavailabilityCheck(
          currentValue,
          currentDate,
          start,
          end,
          liftingMeans,
          "deliveryArea",
        );
        if (result.msg === "found") {
          if (!unavailableMsg.includes(currentValue.name)) {
            unavailableMsg.push(currentValue.name);
          }
        } else if (result.msg === "notFound") {
          if (unavailableMsg.includes(currentValue.name)) {
            let i = unavailableMsg.indexOf(currentValue.name);
            unavailableMsg.splice(i, 1);
          }
        }
        if (result.data.length > 0) {
          if (
            !accumulator.some((acc) => acc["value"] === result.data[0].value)
          ) {
            accumulator.push(result.data[0]);
          }
        }
        return accumulator;
      }, []),
    );
  };

  const getMeans = async () => {
    try {
      let result = [];
      let currentDate = moment(props.date).format("L");
      const bookings = await GLOBALS.API({
        uri: `${GLOBALS.Constants.BOOKINGS_BY_SITE}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

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
            //////// Setting times to 00 format

            let start = startTime
              ? moment(startTime).format("HH:mm").substring(0, 2)
              : "";
            let end = endTime
              ? moment(endTime).format("HH:mm").substring(0, 2)
              : "";

            ///////// filter out booked means
            let isMeanBooked = false;
            let bookedMeans = bookings.data.bookings.filter((booking) => {
              ///////// checking if mean is in meansBooking table
              if (booking.meanId === currentValue._id) {
                let bookingDate = moment(booking.startDate).format("L");
                let formattedDate = moment(currentDate).format("L");
                let bookingStartTime = booking.startTime.substring(0, 2);
                let bookingEndTime = booking.endTime.substring(0, 2);

                ///////// check if the mean found are on the same day
                if (moment(bookingDate).isSame(formattedDate)) {
                  ///////// if selected date is same as the booking date, we hide the values and show unavailable message
                  if (
                    start >= bookingStartTime &&
                    start <= bookingEndTime &&
                    end <= bookingEndTime &&
                    end >= bookingStartTime
                  ) {
                    return booking;
                  }
                  ///////// if the booking date is in range of the selected date, we show the values and show unavailable message
                  else if (
                    (bookingStartTime >= start && bookingStartTime < end) ||
                    (bookingEndTime <= end && bookingEndTime > start)
                  ) {
                    isMeanBooked = true;
                  }
                }
              }
            });

            //////// Checking unavailabilities
            if (bookedMeans.length === 0) {
              result = unavailabilityCheck(
                currentValue,
                currentDate,
                start,
                end,
                liftingMeans,
                "mean",
              );

              //////// If mean already booked
              if (isMeanBooked) {
                if (!unavailableMsg.includes(currentValue.name)) {
                  unavailableMsg.push(currentValue.name);
                }
              }
              //////// if mean is unavailable
              else if (result.msg === "found") {
                if (!unavailableMsg.includes(currentValue.name)) {
                  unavailableMsg.push(currentValue.name);
                }
              }
              //////// if mean is available
              else if (result.msg === "notFound") {
                if (unavailableMsg.includes(currentValue.name)) {
                  let i = unavailableMsg.indexOf(currentValue.name);
                  unavailableMsg.splice(i, 1);
                }
              }

              if (result.data[0]) {
                if (
                  !accumulator.some(
                    (acc) => acc["value"] === result.data[0].value,
                  )
                ) {
                  accumulator.push(result.data[0]);
                }
              }
            } else {
              if (!unavailableMsg.includes(currentValue.name)) {
                unavailableMsg.push(currentValue.name);
              }
            }
          }
          return accumulator;
        }, []),
      );
      if (props.step1Data) {
        if (props.step1Data.liftingMeans.length === 0) {
          setDisableLiftingMeans(true);
        } else setLiftingMeans(props.step1Data.liftingMeans);
      }
    } catch (error) {}
  };
  useEffect(async () => {
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
      if (props.step1Data.liftingMeans.length === 0) {
        setDisableLiftingMeans(true);
      } else {
        setLiftingMeans(props.step1Data.liftingMeans);
      }

      setUpdate((st) => !st);
    } else {
      setCompany(props.companies[0]);
      setDeliveryArea(props.selectedDeliverArea._id);
      setDate(props.date);
      setStartTime(moment(props.date).set("hour", props.start));
      setEndTime(moment(props.date).set("hour", props.end));
    }
    // eslint-disable-next-line
  }, [props.step1Data]);

  useEffect(() => {
    getMeans();
    filterUnavailableDeliveryArea();
    // eslint-disable-next-line
  }, [deliveryArea, date, startTime, endTime]);

  async function onSubmit(e) {
    e.preventDefault();
    let selectedMeans = means.filter((o1) =>
      liftingMeans?.some((o2) => o1.value === o2),
    );
    const values = {
      company: company,
      deliveryArea,
      date,
      selectedMeans,
      startTime: moment(startTime).format("HH:mm"),
      endTime: moment(endTime).format("HH:mm"),
      trades,
      liftingMeans,
      materials: materials.map((item) => item.label),
    };
    props.setStep1Data(values);
    props.setStep(2);
  }
  function disabledDate2(current) {
    let customDate = "2021-6-6";
    return (
      (current && current < moment(customDate, "YYYY-MM-DD")) ||
      current > moment(customDate, "YYYY-MM-DD")
    );
  }

  return (
    <Form.Form onSubmit={onSubmit}>
      {update && ""}
      <Form.Row>
        <FormLabel bold primary={`${COMPANY}: `} />
        <Form.Row noMargin width="48%">
          <FormInput
            name="company"
            disabled={true}
            value={company.label}
            style={{ ...GLOBALS.Styles.inputWidth, marginRight: "10px" }}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary={`${DELIVERYAREA}* :`} />
        <FormSelect
          name="deliveryArea"
          value={deliveryArea}
          disabled={props.eventId}
          // values={props.deliveryAreas}
          values={filterdeliveryArea}
          style={GLOBALS.Styles.inputWidth}
          placeholder={Please_select_Delivery_Area}
          onChange={({ target: { value } }) => setDeliveryArea(value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary={`${DATE_AND_TIME}* :`} />
        <Form.Row width="48%" noMargin>
          <FormInput
            type="date"
            name="date"
            value={date}
            disabled={true}
            placeholder="Date"
            style={{ width: "31%" }}
            min={moment().format("YYYY-MM-DD")}
            // disabledDate={disabledDate}
            onChange={({ target: { value } }) => {
              checkavailability(value) && setDate(value);

              // Setting current time on current date and previous time
              if (
                moment(d).format("yyyy-DD-MM") ==
                moment(value).format("yyyy-DD-MM")
              ) {
                if (
                  moment(startTime).format("HH") <
                  parseInt(moment(d).format("HH")) + 1
                ) {
                  const hour = new Date().getHours();
                  setStartTime(
                    moment(d)
                      .set("hours", hour + 1)
                      .set("minutes", 0),
                  );
                  setEndTime(
                    moment(d)
                      .set("hours", hour + 2)
                      .set("minutes", 0),
                  );
                }
              }
            }}
          />
          <TimeInput
            format="HH:mm"
            minuteStep={15}
            name="startTime"
            value={startTime}
            // disabling previous time on current date
            disabledHours={
              moment(d).format("yyyy-DD-MM") ==
                moment(date).format("yyyy-DD-MM") && getDisabledHoursStartTime()
            }
            // disabledMinutes={(a) => getDisabledMinutes(a)}
            placeholder={Start_time}
            style={{ width: "31%" }}
            onChange={(value) => setStartTime(value)}
          />
          <TimeInput
            name="endTime"
            format="HH:mm"
            minuteStep={15}
            value={endTime}
            disabledHours={getDisabledHoursEndTime()}
            // disabledMinutes={(a) => getDisabledEndMinutes(a)}
            placeholder={End_time}
            style={{ width: "31%" }}
            onChange={(value) => setEndTime(value)}
          />
        </Form.Row>
      </Form.Row>
      {unavailableMsg.length > 0 ? (
        <Form.Row>
          <FormLabel bold primary={""} />
          <Form.Row width="48%" noMargin label=" " zIndex={5}>
            <div style={{ color: "red" }}>
              {unavailableMsg.join(", ")} is/are unavailable in the selected
              timeslot.
            </div>
          </Form.Row>
        </Form.Row>
      ) : (
        []
      )}
      <Form.Row>
        <FormLabel bold primary={`${SELECT_TRADES}* :`} />
        <FormMultiSelect
          name="trades"
          value={trades}
          placeholder={TRADES}
          values={props.trades}
          disabled={props.eventId}
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setTrades(value)}
        />
      </Form.Row>

      <Form.Row>
        <FormLabel bold primary={`${UNLOADING_MEANS}* :`} />
        <FormMultiSelect
          name="means"
          values={means}
          placeholder={MEANS}
          value={liftingMeans}
          disabled={!deliveryArea || disableLiftingMeans}
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setLiftingMeans(value)}
        />
      </Form.Row>
      <Form.Row>
        <div class="col-sm-6" style={{ paddingLeft: "0px" }}>
          <FormLabel bold primary="" />
        </div>
        <div class="col-sm-6" style={{ paddingLeft: "30px" }}>
          <FormCheckbox
            name={disableLiftingMeans}
            checked={disableLiftingMeans}
            onChange={(event) => {
              setDisableLiftingMeans(event.target.checked);
              setLiftingMeans([]);
            }}
            style={{ color: "#DBB20A" }}
            label={NONE}
          />
        </div>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary={`${MATERIALS_DELIVERED}* :`} />
        <MultiAdderInput
          name="materials"
          values={materials}
          disabled={props.eventId}
          placeholder={ENTER_MATERIALS}
          style={GLOBALS.Styles.inputWidth}
          onChange={(values) => {
            setMaterials(values);
            setUpdate((st) => !st);
          }}
        />
        {/* {
              !props.eventId && setMaterials(values);
              !props.eventId && setUpdate((st) => !st);
            } */}
      </Form.Row>
      <Form.ButtonContainer>
        <Button
          type="submit"
          minWidth={200}
          text={VALIDATE}
          fullWidth={false}
          disabled={
            !company ||
            !deliveryArea ||
            !date ||
            !startTime ||
            !endTime ||
            trades.length === 0 ||
            materials.length === 0
          }
        />
      </Form.ButtonContainer>
    </Form.Form>
  );
}
