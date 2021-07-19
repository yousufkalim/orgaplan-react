import React, { useState, useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import GLOBALS from "../../../../../globals";
import Actions from "../../../../../redux/actions";
import Form from "../../../../../components/Form";
import Button from "../../../../../components/Button";
import FormLabel from "../../../../../components/FormLabel";
import FormSelect from "../../../../../components/FormSelect";
import FormMultiSelect from "../../../../../components/FormMultiSelect";
import FormCheckbox from "../../../../../components/FormCheckbox";
import { TEXTS } from "../../../../../assets/languages/french";
import unavailabilityCheck from "../../../../../utils/unavailabilityCheck";

export default function AddSiteStep1(props) {
  const {
    LOCATION,
    SELECT_LOCATION,
    LEVEL,
    SELECT_LEVEL,
    STORAGEAREA,
    SELECT_STORAGEAREA,
    TRANSPORTING_MEANS,
    VALIDATE,
    MEANS,
  } = TEXTS;

  const dispatch = useDispatch();
  const adminStore = useSelector((state) => state.admin);
  const store = useSelector((state) => state.auth);
  const [building, setBuilding] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [level, setLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [storageArea, setStorageArea] = useState("");
  const [propsFilterStorageArea, setPropsFilterStorageArea] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [means, setMeans] = useState([]);
  const [routingMeans, setRoutingMeans] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [disableRoutingMeans, setDisableRoutingMeans] = useState("");
  const [delunavaiableMsg, setDelUnavaiableMsg] = useState([]);

  useEffect(() => {
    if (props.step1Data) {
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
    }
  }, []);

  useEffect(() => {
    if (props.step2Data) {
      if (props.step2Data.building) {
        setBuilding(props.step2Data.building);
      } else if (props.eventId) {
        setBuilding("Exterior");
      }
    }
    // eslint-disable-next-line
  }, [props.step2Data]);

  useEffect(() => {
    setBuildings(
      props.buildings.map((item) => ({
        value: item._id,
        label: item.name,
      })),
    );
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getMeans();
    filterUnavailableStorageArea();
    // eslint-disable-next-line
  }, [props, storageArea, startTime, endTime]);

  useEffect(() => {
    if (building) {
      setLevel("");
      setStorageArea("");
      let buil = props.buildings.find((item) => item._id === building);
      if (buil) {
        setLevels(
          buil.levels.map((item) => ({
            value: item._id,
            label: item.number,
          })),
        );
      }
      if (props.step2Data && !rendered) {
        setLevel(props.step2Data.level);
        setStorageArea(props.step2Data.storageArea);

        if (props.step2Data.routingMeans.length === 0) {
          setDisableRoutingMeans(true);
        } else {
          setRoutingMeans(props.step2Data.routingMeans);
        }

        setRendered(true);
      }
    }
    // eslint-disable-next-line
  }, [building]);

  const filterUnavailableStorageArea = () => {
    let currentDate = moment(props.step1Data.date).format("L");
    setPropsFilterStorageArea(
      props.storageAreas.reduce((accumulator, currentValue) => {
        let availability_date = moment(currentValue.availability.end).format(
          "L",
        );

        if (moment(availability_date).isBefore(currentDate)) {
        } else {
          if (
            currentValue.companies.find(
              (company) => company && company === props.step1Data.company,
            ) &&
            currentValue.deliveryArea.find(
              (da) => da && da === props.step1Data.deliveryArea,
            )
          ) {
            let start = props.step1Data.startTime.substring(0, 2);
            let end = props.step1Data.endTime.substring(0, 2);
            //////// Checking unavailabilities
            let result = unavailabilityCheck(
              currentValue,
              currentDate,
              start,
              end,
              routingMeans,
              "storage",
            );
            setRoutingMeans(result.mean);
            if (result.msg === "found") {
              if (!delunavaiableMsg.includes(currentValue.name)) {
                delunavaiableMsg.push(currentValue.name);
              }
            } else if (result.msg === "notFound") {
              if (delunavaiableMsg.includes(currentValue.name)) {
                let i = delunavaiableMsg.indexOf(currentValue.name);
                delunavaiableMsg.splice(i, 1);
              }
            }

            if (result.data[0] === undefined) {
            } else {
              if (
                !accumulator.some(
                  (acc) => acc["value"] === result.data[0].value,
                )
              ) {
                accumulator.push(result.data[0]);
              }
            }
          }
        }

        return accumulator;
      }, []),
    );
  };

  const getMeans = async () => {
    let currentDate = moment(props.step1Data.date).format("L");
    setMeans(
      props.means.reduce((accumulator, currentValue) => {
        if (
          currentValue.meanType === "ROUTING" &&
          currentValue.location.find((loc) =>
            loc.storageArea && loc.storageArea === storageArea
              ? storageArea
              : props.step2Data.storageArea,
          ) &&
          moment(props.date).isBetween(
            currentValue.availability.start,
            currentValue.availability.end,
            "day",
            "[]",
          )
        ) {
          let start = props.step1Data.startTime.substring(0, 2);
          let end = props.step1Data.endTime.substring(0, 2);
          //////// Checking unavailabilities
          let result = unavailabilityCheck(
            currentValue,
            currentDate,
            start,
            end,
            routingMeans,
            "mean",
          );
          setRoutingMeans(result.mean);
          if (result.msg === "found") {
            if (!delunavaiableMsg.includes(currentValue.name)) {
              delunavaiableMsg.push(currentValue.name);
            }
          } else if (result.msg === "notFound") {
            if (delunavaiableMsg.includes(currentValue.name)) {
              let i = delunavaiableMsg.indexOf(currentValue.name);
              delunavaiableMsg.splice(i, 1);
            }
          }

          if (result.data[0] === undefined) {
          } else {
            if (
              !accumulator.some((acc) => acc["value"] === result.data[0].value)
            ) {
              accumulator.push(result.data[0]);
            }
          }
        }
        return accumulator;
      }, []),
    );
  };

  async function onSubmit(e) {
    e.preventDefault();
    let selectedRoutingMeans = means.filter((o1) =>
      routingMeans?.some((o2) => o1.value === o2),
    );
    // console.log("selectedRoutingMeans", selectedRoutingMeans);

    const values = {
      building,
      level,
      storageArea,
      selectedRoutingMeans,
      routingMeans,
    };
    props.setStep2Data(values);
    props.setStep(3);
  }

  // const selectedCompanyId = props.step1Data.company;
  // const filterStorageAreas = [];
  // propsFilterStorageArea?.forEach((val) => {
  //   val.companies.map((cP) => {
  //     if (cP === selectedCompanyId) {
  //       filterStorageAreas.push(val);
  //     }
  //   });
  // });

  return (
    <Form.Form onSubmit={onSubmit}>
      <Form.Row>
        <FormLabel bold primary={`${LOCATION}* :`} />
        <FormSelect
          name="location"
          value={building}
          disabled={props.eventId}
          placeholder={SELECT_LOCATION}
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setBuilding(value)}
          values={[...[{ label: "Exterior", value: "Exterior" }], ...buildings]}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary={`${LEVEL}* :`} />
        <FormSelect
          name="level"
          value={level}
          values={levels}
          placeholder={SELECT_LEVEL}
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setLevel(value)}
          disabled={!building || building === "Exterior" || props.eventId}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary={`${STORAGEAREA}*:`} />
        <Form.Row noMargin width="48%">
          <FormSelect
            name="storageArea"
            value={storageArea}
            placeholder={SELECT_STORAGEAREA}
            values={
              propsFilterStorageArea
              //   filterStorageAreas.filter((item) =>
              //   building && building === "Exterior"
              //     ? !item.level
              //     : item.level === level,
              // )
            }
            onChange={({ target: { value } }) => setStorageArea(value)}
            disabled={
              !building || (building !== "Exterior" && !level) || props.eventId
            }
          />
        </Form.Row>
      </Form.Row>
      {delunavaiableMsg.length > 0 ? (
        <Form.Row>
          <FormLabel bold primary={""} />
          <Form.Row width="48%" noMargin label=" " zIndex={5}>
            <div style={{ color: "red" }}>
              {delunavaiableMsg.join(", ")} is/are unavailable in the selected
              timeslot.
            </div>
          </Form.Row>
        </Form.Row>
      ) : (
        []
      )}
      <Form.Row>
        <FormLabel bold primary={`${TRANSPORTING_MEANS}* :`} />
        <Form.Row noMargin width="48%">
          <FormMultiSelect
            name="means"
            values={means}
            placeholder={MEANS}
            value={routingMeans}
            disabled={!storageArea || disableRoutingMeans}
            onChange={({ target: { value } }) => setRoutingMeans(value)}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <div class="col-sm-6" style={{ paddingLeft: "0px" }}>
          <FormLabel bold primary="" />
        </div>
        <div class="col-sm-6" style={{ paddingLeft: "30px" }}>
          <FormCheckbox
            name={disableRoutingMeans}
            checked={disableRoutingMeans}
            onChange={(event) => {
              setDisableRoutingMeans(event.target.checked);
              setRoutingMeans([]);
            }}
            style={{ color: "#DBB20A" }}
            label="none"
          />
        </div>
      </Form.Row>
      <Form.ButtonContainer>
        <Button
          type="submit"
          minWidth={200}
          text={VALIDATE}
          fullWidth={false}
          disabled={
            !building || (building !== "Exterior" && !level) || !storageArea
          }
        />
      </Form.ButtonContainer>
    </Form.Form>
  );
}
