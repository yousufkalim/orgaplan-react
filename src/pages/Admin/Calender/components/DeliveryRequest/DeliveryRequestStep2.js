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

export default function AddSiteStep1(props) {
  const dispatch = useDispatch();
  const adminStore = useSelector((state) => state.admin);
  const [building, setBuilding] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [level, setLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [storageArea, setStorageArea] = useState("");
  const [means, setMeans] = useState([]);
  const [routingMeans, setRoutingMeans] = useState([]);
  const [rendered, setRendered] = useState(false);
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
    setMeans(
      props.means.reduce((accumulator, currentValue) => {
        if (
          currentValue.meanType === "ROUTING" &&
          currentValue.location.find(
            (loc) => loc.storageArea && loc.storageArea === storageArea,
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
  }, [storageArea]);

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
        setRoutingMeans(props.step2Data.routingMeans);
        setRendered(true);
      }
    }
    // eslint-disable-next-line
  }, [building]);
  async function onSubmit(e) {
    e.preventDefault();
    const values = {
      building,
      level,
      storageArea,
      routingMeans,
    };
    props.setStep2Data(values);
    props.setStep(3);
  }

  return (
    <Form.Form onSubmit={onSubmit}>
      <Form.Row>
        <FormLabel bold primary="LOCATION* :" />
        <FormSelect
          name="location"
          value={building}
          disabled={props.eventId}
          placeholder="Select a location"
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setBuilding(value)}
          values={[...[{ label: "Exterior", value: "Exterior" }], ...buildings]}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="LEVEL* :" />
        <FormSelect
          name="level"
          value={level}
          values={levels}
          placeholder="Select a Level"
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setLevel(value)}
          disabled={!building || building === "Exterior" || props.eventId}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="STORAGE AREA* :" />
        <Form.Row noMargin width="48%">
          <FormSelect
            name="storageArea"
            value={storageArea}
            placeholder="Select Storage Area"
            values={props.storageAreas.filter((item) =>
              building && building === "Exterior"
                ? !item.level
                : item.level === level,
            )}
            onChange={({ target: { value } }) => setStorageArea(value)}
            disabled={
              !building || (building !== "Exterior" && !level) || props.eventId
            }
          />
        </Form.Row>
      </Form.Row>

      <Form.Row>
        <FormLabel bold primary="TRANSPORTING MEANS* :" />
        <Form.Row noMargin width="48%">
          <FormMultiSelect
            name="means"
            values={means}
            placeholder="Means"
            value={routingMeans}
            disabled={!storageArea}
            onChange={({ target: { value } }) => setRoutingMeans(value)}
          />
        </Form.Row>
      </Form.Row>
      <Form.ButtonContainer>
        <Button
          type="submit"
          minWidth={200}
          text="VALIDATE"
          fullWidth={false}
          disabled={
            !building ||
            (building !== "Exterior" && !level) ||
            !storageArea ||
            routingMeans.length === 0
          }
        />
      </Form.ButtonContainer>
    </Form.Form>
  );
}
