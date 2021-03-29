import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import FormLabel from "../../../components/FormLabel";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import SmallButton from "../../../components/SmallButton";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: 15,
    marginTop: 10,
    width: "100%",
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.secondary.main,
  },
}));

const levelNumberList = [
  { value: -10, label: -10 },
  { value: -9, label: -9 },
  { value: -8, label: -8 },
  { value: -7, label: -7 },
  { value: -6, label: -6 },
  { value: -5, label: -5 },
  { value: -4, label: -4 },
  { value: -3, label: -3 },
  { value: -2, label: -2 },
  { value: -1, label: -1 },
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
  { value: 7, label: 7 },
  { value: 8, label: 8 },
  { value: 9, label: 9 },
  { value: 10, label: 10 },
];

export default function AddSiteStep3(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const storeAdmin = useSelector((state) => state.admin);

  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [levelNumber, setLevelNumber] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [activeBuilding, setActiveBuilding] = useState("");

  const handleChange = (name, value) => {
    if (name === "buildingName") setBuildingName(value);
    else if (name === "levelNumber") setLevelNumber(value);
  };

  function resetStates() {
    setBuildingName("");
    setLevelNumber("");
  }

  async function onCreateBuilding() {
    try {
      setLoading(true);
      const formdata = JSON.stringify({
        name: buildingName,
        siteId: storeAdmin.site.siteId._id,
      });

      // JSON.stringify Creation
      const response = await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.BUILDINGS,
        token: store.token,
        body: formdata,
      });

      setActiveBuilding(response.data);
      resetStates();
      let propShapes = props.shapes;
      let propShape = props.shape;
      let inde = propShapes.findIndex((item) => item._id === propShape._id);
      propShapes[inde]._id = response.data._id;
      propShapes[inde].name = buildingName;
      propShapes[inde].levels = [];
      propShape._id = response.data._id;
      propShape.name = buildingName;
      propShape.levels = [];
      props.setShapes(propShapes);
      props.setShape(propShape);

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.ADMIN_PIC_ADD_SHAPE,
        token: store.token,
        body: JSON.stringify({
          picId: props.pic._id,
          building: response.data._id,
          ...propShape,
        }),
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function onCreateLevel() {
    try {
      setLoading(true);

      // FormData Creation
      const formdata = new FormData();
      formdata.append("number", Number(levelNumber));
      formdata.append("building", activeBuilding._id);

      const response = await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.LEVELS,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      const activeBuildingObj = activeBuilding;
      activeBuildingObj.levels.push(response.data);

      let propShapes = props.shapes;
      let propShape = props.shape;
      let inde = propShapes.findIndex((item) => item._id === propShape._id);

      propShapes[inde].levels = activeBuildingObj.levels;
      propShape.levels = activeBuildingObj.levels;
      props.setShapes(propShapes);
      props.setShape(propShape);

      setActiveBuilding(activeBuildingObj);
      setLoading(false);
      resetStates();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function onAddLevelImage(levelId, file, index) {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("image", file);
      formdata.append("levelId", levelId);
      // FormData Creation
      const response = await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.LEVEL_IMAGE,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      const activeBuildingObj = activeBuilding;
      activeBuildingObj.levels[index].image = response.data.image;
      setActiveBuilding(activeBuildingObj);
      setLoading(false);
      setUpdate((st) => !st);

      let propShapes = props.shapes;
      let propShape = props.shape;
      let inde = propShapes.findIndex((item) => item._id === propShape._id);
      propShapes[inde].levels = activeBuildingObj.levels;
      propShape.levels = activeBuildingObj.levels;
      props.setShapes(propShapes);
      props.setShape(propShape);

      resetStates();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const levelRows = [];
  activeBuilding.levels?.map((level, index) =>
    activeBuilding.name === "Exterior"
      ? levelRows.push([
          level.image,
          <Form.Row style={{ justifyContent: "center" }}>
            <SmallButton
              text="Add Plan"
              disabled={loading}
              color={theme.palette.primary.contrastText}
              onClick={() => {
                if (level.image) {
                  if (
                    window.confirm(
                      "Are you sure? The current file will be deleted",
                    )
                  ) {
                    document.getElementById(`fileinput${index}`).click();
                  }
                } else {
                  document.getElementById(`fileinput${index}`).click();
                }
              }}
              style={{
                marginLeft: 10,
                borderRadius: 4,
              }}
            />
            <input
              hidden
              type="file"
              id={`fileinput${index}`}
              onChange={(e) => {
                const file = e.target.files[0];
                if (
                  file &&
                  file.size <= 1000000 &&
                  file.type === "application/pdf"
                ) {
                  onAddLevelImage(level._id, file, index);
                  e.target.value = "";
                } else {
                  dispatch(
                    Actions.notistack.enqueueSnackbar(
                      Actions.notistack.snackbar(
                        "Max size can be 10MB of type: PDF",
                        "error",
                      ),
                    ),
                  );
                }
              }}
            />
          </Form.Row>,
        ])
      : levelRows.push([
          level.number === 0 ? "RDC" : level.number,
          level.image,
          <Form.Row style={{ justifyContent: "center" }}>
            <SmallButton
              text="Add Plan"
              disabled={loading}
              color={theme.palette.primary.contrastText}
              onClick={() => {
                if (level.image) {
                  if (
                    window.confirm(
                      "Are you sure? The current file will be deleted",
                    )
                  ) {
                    document.getElementById(`fileinput${index}`).click();
                  }
                } else {
                  document.getElementById(`fileinput${index}`).click();
                }
              }}
              style={{
                marginLeft: 10,
                borderRadius: 4,
              }}
            />
            <input
              hidden
              type="file"
              id={`fileinput${index}`}
              onChange={(e) => {
                const file = e.target.files[0];
                if (
                  file &&
                  file.size <= 1000000 &&
                  file.type === "application/pdf"
                ) {
                  onAddLevelImage(level._id, file, index);
                  e.target.value = "";
                } else {
                  dispatch(
                    Actions.notistack.enqueueSnackbar(
                      Actions.notistack.snackbar(
                        "Max size can be 10MB of type: PDF",
                        "error",
                      ),
                    ),
                  );
                }
              }}
            />
          </Form.Row>,
        ]),
  );

  return (
    <div>
      {!activeBuilding && (
        <Form.Form>
          <Form.Row>
            <Form.Row noMargin>
              <FormLabel noMargin bold primary="Building Name" />
            </Form.Row>
            <FormInput
              name="buildingName"
              value={buildingName}
              maxLength="30"
              placeholder="Building Name"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row justifyContent="center">
            <Button
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              onClick={onCreateBuilding}
              disabled={loading || !buildingName}
            />
          </Form.Row>
        </Form.Form>
      )}
      {activeBuilding && (
        <>
          <Form.Form>
            <Form.Row alignItems="center">
              <Form.Row noMargin>
                <FormLabel noMargin bold primary="Level Number" />
              </Form.Row>
              {activeBuilding && (
                <FormSelect
                  name="levelNumber"
                  value={levelNumber}
                  // error={levelNumber}
                  style={GLOBALS.Styles.inputWidth}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                  values={levelNumberList.filter(
                    (item) =>
                      !activeBuilding.levels.some(
                        (item2) => item2.number === item.value,
                      ),
                  )}
                />
              )}
            </Form.Row>
            <Form.Row justifyContent="center">
              <Button
                minWidth={200}
                text="VALIDATE"
                fullWidth={false}
                onClick={onCreateLevel}
                disabled={loading || !levelNumber}
              />
            </Form.Row>
          </Form.Form>
          <Divider />
          <FormLabel
            bold
            noMargin
            primary={`Building: ${activeBuilding.name}`}
          />
          <Divider />
          <div className={classes.content}>
            <Table rows={levelRows} headers={GLOBALS.Data.levels.headings} />
          </div>
        </>
      )}
      {update && ""}
    </div>
  );
}
