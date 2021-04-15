import React, { useState, useEffect } from "react";

import GLOBALS from "../../../../globals";

import Form from "../../../../components/Form";
import Button from "../../../../components/Button";
import FormLabel from "../../../../components/FormLabel";
import FormSelect from "../../../../components/FormSelect";
import FormMultiSelect from "../../../../components/FormMultiSelect";

export default function AddSiteStep1(props) {
  const [building, setBuilding] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [level, setLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [storageArea, setStorageArea] = useState("");
  const [means, setMeans] = useState([]);
  const [routingMeans, setRoutingMeans] = useState([]);

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
          values={buildings}
          placeholder="Select a location"
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setBuilding(value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="LEVEL* :" />
        <FormSelect
          name="level"
          value={level}
          values={levels}
          disabled={!building}
          placeholder="Select a Level"
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setLevel(value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="STORAGE AREA* :" />
        <Form.Row noMargin width="48%">
          <FormSelect
            disabled={!level}
            name="storageArea"
            value={storageArea}
            placeholder="Storage Area"
            values={props.storageAreas}
            onChange={({ target: { value } }) => setStorageArea(value)}
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
            !building || !level || !storageArea || routingMeans.length === 0
          }
        />
      </Form.ButtonContainer>
    </Form.Form>
  );
}
