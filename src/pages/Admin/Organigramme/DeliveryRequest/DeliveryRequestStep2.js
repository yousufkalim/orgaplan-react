import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";

import Form from "../../../../components/Form";
import Button from "../../../../components/Button";
import FormLabel from "../../../../components/FormLabel";
import FormSelect from "../../../../components/FormSelect";
import FormMultiSelect from "../../../../components/FormMultiSelect";

export default function AddSiteStep1(props) {
  const dispatch = useDispatch();

  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [level, setLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [storageArea, setStorageArea] = useState("");
  const [storageAreas, setStorageAreas] = useState([]);
  const [means, setMeans] = useState("");
  const [allMeans, setAllMeans] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ZACS}`,
      });
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
      means,
    };
    props.setStep2Data(values);
    props.setStep(2);
  }

  return (
    <Form.Form onSubmit={onSubmit}>
      {update && ""}
      <Form.Row>
        <FormLabel bold primary="LOCATION* :" />
        <FormSelect
          name="location"
          value={location}
          values={locations}
          placeholder="Select a location"
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setLocation(value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="LEVEL* :" />
        <FormSelect
          name="level"
          value={level}
          values={levels}
          style={GLOBALS.Styles.inputWidth}
          placeholder="Select a Level"
          onChange={({ target: { value } }) => setLevel(value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="STORAGE AREA* :" />
        <Form.Row noMargin width="48%">
          <FormSelect
            name="storageArea"
            value={storageArea}
            values={storageAreas}
            placeholder="Storage Area"
            style={GLOBALS.Styles.inputWidth}
            onChange={({ target: { value } }) => setStorageArea(value)}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="TRANSPORTING MEANS* :" />
        <Form.Row noMargin width="48%">
          <FormMultiSelect
            name="means"
            value={means}
            values={allMeans}
            placeholder="Means"
            style={GLOBALS.Styles.inputWidth}
            onChange={({ target: { value } }) => setMeans(value)}
          />
        </Form.Row>
      </Form.Row>
      <Form.ButtonContainer>
        <Button
          type="submit"
          minWidth={200}
          text="VALIDATE"
          fullWidth={false}
          loading={loading}
          disabled={
            loading || !location || !level || !storageArea || means.length === 0
          }
        />
      </Form.ButtonContainer>
    </Form.Form>
  );
}
