import React, { useEffect, useState } from "react";
import Canvas from "../../../components/Canvas";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { useSelector, useDispatch } from "react-redux";

import Mean from "./Mean";
import Building from "./Building";
import GLOBALS from "../../../globals";
import StorageArea from "./StorageArea";
import DeliveryArea from "./DeliveryArea";
import Form from "../../../components/Form";
import Actions from "../../../redux/actions";
import Loader from "../../../components/Loader";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import FullScreenModal from "../../../components/FullScreenModal";
import { ReactComponent as Cross } from "../../../assets/icons/Cross.svg";
import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";
// import { ReactComponent as PICIcon } from "../../../assets/icons/PICIcon.svg";
import { ReactComponent as Calendar } from "../../../assets/icons/Calendar.svg";

// "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
    backgroundColor: theme.palette.secondary.main,
  },
  canvasRow: {
    height: "735px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoDrawerContainer: {
    width: "20%",
    height: "100%",
  },
  infoDrawer: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  infoIcon: {
    width: 20,
    height: 20,
  },
}));

const App = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [sitePic, setSitePic] = useState([]);
  const [loading, setLoading] = useState(true);

  const [shape, setShape] = useState("");
  const [shapes, setShapes] = useState([]);
  const [pdf, setPdf] = useState(undefined);
  const [modal, setModal] = useState(false);
  const [selectedShape, setSelectedShape] = useState("");

  const [allLeves, setAllLevels] = useState([]);
  const [levels, setLevels] = useState([]);
  const [level, setLevel] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      let response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_PIC_BY_SITE}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      setSitePic(response.data);
      setPdf(
        response.data?.exteriorBuilding?.levels[0]?.image
          ? GLOBALS.Constants.BASE_URL +
              response.data.exteriorBuilding.levels[0].image
          : undefined,
      );
      setShapes(response.data.shapes);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const handlePdfChange = (pdfUri, pdf) => {
    console.log("pdf", pdfUri, pdf);
    setPdf(pdfUri);
  };

  const handleChange = (shapesArray) => {
    let getShape = shapesArray[shapesArray.length - 1];
    setSelectedShape("");
    getShape && setShape(getShape);
    setShapes(shapesArray);
    setModal(true);
  };

  const handleClick = (id, shape) => {
    setSelectedShape(shape);
    if (shape.type === "BUILDING") {
      setAllLevels(shape.building.levels);
      let levs = [{ label: "Exterior", value: "Exterior" }];
      shape.building.levels.map((le) =>
        levs.push({
          label: le.number,
          value: le._id,
        }),
      );
      setLevels(levs);
    }
  };

  const checkShape = () => {
    if (shape && modal) {
      if (!shape.name) {
        let shp = shapes.filter(
          (item) => String(item._id) !== String(shape._id),
        );
        setShapes(shp);
        setShape("");
      } else {
        setShape("");
      }
    }
    // eslint-disable-next-line
  };

  const onClear = () => {
    setSelectedShape("");
  };

  const setShapesFn = (newShapes, shape, modalDecision) => {
    setShapes(newShapes);
    if (!modalDecision) {
      setModal(modalDecision);
      if (shape) {
        setShape("");
      } else if (selectedShape) {
        setSelectedShape(shape);
      }
    }
  };

  // InfoDrawer
  const onDeleteShape = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this shape?")) {
        let response = await GLOBALS.API({
          method: "DELETE",
          uri: `${GLOBALS.Constants.ADMIN_PIC_SHAPE}/${sitePic._id}/${selectedShape._id}`,
          token: store.token,
        });
        setSitePic(response.data);
        setShapes(response.data.shapes);
        setSelectedShape("");
        setLoading(false);
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.canvasRow}>
          {loading ? (
            <Loader.Progress />
          ) : (
            <Canvas
              shapes={shapes}
              onClick={handleClick}
              onChange={handleChange}
              onClear={onClear}
              onPdfChange={handlePdfChange}
              pdf={pdf}
            />
          )}
          {console.log("shapes ", shapes)}
          <div className={classes.infoDrawerContainer}>
            {selectedShape && (
              <div className={classes.infoDrawer}>
                <SubHeading primary={selectedShape.name} bold fontSize={22} />
                <SubHeading primary={`Type : ${selectedShape.type}`} />
                {selectedShape.type === "BUILDING" && (
                  <FormSelect
                    name="level"
                    value={level}
                    values={levels}
                    placeholder="Select Level"
                    onChange={({ target: { value } }) => {
                      setLevel(value);
                      if (value === "Exterior" || !value) {
                        setPdf(
                          sitePic?.exteriorBuilding?.levels[0]?.image
                            ? GLOBALS.Constants.BASE_URL +
                                sitePic.exteriorBuilding.levels[0].image
                            : undefined,
                        );
                      } else {
                        const leve = allLeves.find((lev) => lev._id === value);
                        setPdf(
                          leve?.image
                            ? GLOBALS.Constants.BASE_URL + leve.image
                            : undefined,
                        );
                      }
                    }}
                  />
                )}
                <Form.Row>
                  <IconButton
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal(true);
                    }}
                  >
                    <Pencil className={classes.infoIcon} />
                  </IconButton>
                  {/* <IconButton
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <PICIcon className={classes.infoIcon} />
                  </IconButton> */}
                  <IconButton
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Calendar className={classes.infoIcon} />
                  </IconButton>
                  <IconButton
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteShape();
                    }}
                  >
                    <Cross className={classes.infoIcon} />
                  </IconButton>
                </Form.Row>
              </div>
            )}
          </div>
        </div>
      </div>
      <>
        {modal &&
          (shape || selectedShape) &&
          ((
            shape
              ? shape.type === "DELIVERYAREA"
              : selectedShape.type === "DELIVERYAREA"
          ) ? (
            <FullScreenModal
              title="ADD DELIVERY AREA"
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
              }}
              body={
                <DeliveryArea
                  shape={shape}
                  pic={sitePic}
                  shapes={shapes}
                  setShapes={setShapesFn}
                  selectedShape={selectedShape}
                />
              }
            />
          ) : (
              shape
                ? shape.type === "STORAGEAREA"
                : selectedShape.type === "STORAGEAREA"
            ) ? (
            <FullScreenModal
              title="ADD STORAGE AREA"
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
              }}
              body={
                <StorageArea
                  shape={shape}
                  pic={sitePic}
                  shapes={shapes}
                  setShapes={setShapesFn}
                  selectedShape={selectedShape}
                />
              }
            />
          ) : (
              shape
                ? shape.type === "BUILDING"
                : selectedShape.type === "BUILDING"
            ) ? (
            <FullScreenModal
              title="ADD Building"
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
              }}
              body={
                <Building
                  shape={shape}
                  pic={sitePic}
                  shapes={shapes}
                  setShapes={setShapesFn}
                  selectedShape={selectedShape}
                />
              }
            />
          ) : (
              shape ? shape.type === "MEAN" : selectedShape.type === "MEAN"
            ) ? (
            <FullScreenModal
              title="ADD MEAN"
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
              }}
              body={
                <Mean
                  shape={shape}
                  pic={sitePic}
                  shapes={shapes}
                  setShapes={setShapesFn}
                  selectedShape={selectedShape}
                />
              }
            />
          ) : (
            ""
          ))}
      </>
    </div>
  );
};

export default App;
