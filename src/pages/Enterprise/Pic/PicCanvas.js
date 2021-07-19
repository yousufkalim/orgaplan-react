import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import _ from "lodash";
import moment from "moment";
import Mean from "./Mean";
// import Building from "./Building";
import GLOBALS from "../../../globals";
// import StorageArea from "./StorageArea";
// import DeliveryArea from "./DeliveryArea";
import Form from "../../../components/Form";
import Actions from "../../../redux/actions";
import Canvas from "../../../components/Canvas";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import deliverIcon from "../../../assets/icons/delivery.png";
import alertIcon from "../../../assets/icons/alerticon.png";
import alertIcon1 from "../../../assets/icons/alerticon1.png";
import { TEXTS } from "../../../assets/languages/french";

import FullScreenModal from "../../../components/FullScreenModal";
import { ReactComponent as Cross } from "../../../assets/icons/Cross.svg";
import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";
import { ReactComponent as Calendar } from "../../../assets/icons/Calendar.svg";

import imggg from "./testpdf.pdf";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
// import { ReactComponent as PICIcon } from "../../../assets/icons/PICIcon.svg";

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
    height: "800px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoDrawerContainer: {
    width: "20%",
    height: "100%",
    marginRight: "12px",
  },
  infoDrawer: {
    width: "100%",
    height: "80%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  infoDrawer3: {
    width: "100%",
    height: "50%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  infoDrawer2: {
    marginTop: "20px",
    display: "flex",

    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  infoIcon: {
    width: 20,
    height: 20,
  },
  pdfstyle: {
    position: "absolute",
  },
  pagee: {
    bottom: "-60px",
  },
}));

let selectedShapeReserver;
const PicCanvas = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const [userId, setUserId] = useState(store.user._id);
  const SITE_ID = adminStore.site.siteId._id;

  const [sitePic, setSitePic] = useState("");
  const [storageArea, setStorageArea] = useState("");
  const [requestFound, setRequestFound] = useState(false);
  const [storageAreaData, setstorageAreaData] = useState("");
  const [company, setCompany] = useState("");
  const [levelPic, setlevelPic] = useState("");
  const [loading, setLoading] = useState(true);
  const [deliveryCount, setDeliveryCount] = useState("");
  const [alertCount, setAlertCount] = useState("");
  const [rendering, setRendering] = useState("");
  const [shape, setShape] = useState("");
  const [openStorageModal, setOpenStorageModal] = useState(false);

  // state to open delivery area model
  const [openDeliveryModal, setOpenDeliveryModal] = useState(false);

  const [shapes, setShapes] = useState([]);
  const [pdf, setPdf] = useState(undefined);
  const [modal, setModal] = useState(false);
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedBuilding, setselectedBuilding] = useState("");
  const [levelName, setLevelName] = useState("");
  const [level, setLevel] = useState("");
  const [allLeves, setAllLevels] = useState([]);
  const [levelsDropdown, setLevelsDropdown] = useState([]);
  const {
    SHOW_EXTERIOR,
    SELECT_LEVEL,
    ADD,
    EDIT,
    DELIVERYAREA,
    STORAGEAREA,
    BUILDING,
    MEANS,
    update_shape_error,
    Are_you_sure_You_want_to_delete_this_shape,
    DELIVERIES,
    ALERTS,
  } = TEXTS;

  useEffect(() => {
    if (level) {
      fetchLevelPic(level);
    } else {
      fetchSitePic();
    }
    // eslint-disable-next-line
  }, [adminStore, rendering, level]);
  useEffect(() => {
    filterBookingCalendar();
    // eslint-disable-next-line
  }, []);
  const findlevelName = (value) => {
    let name = levelsDropdown.find((a) => a.value == value);
    if (name) {
      setLevelName(name.label);
    }
  };
  const expiredShapes = (shapes) => {
    let array = [];

    shapes.map((sp) => {
      if (sp.storageArea && Object.keys(sp.storageArea).length > 0) {
        let isExist = sp?.storageArea?.availability?.end;
        if (isExist) {
          let check = moment(isExist).isSame(new Date(), "day");
          if (check == false) {
            array.push(sp);
          }
        }
      } else if (sp.mean && Object.keys(sp.mean).length > 0) {
        let isExist = sp?.mean?.availability?.end;
        if (isExist) {
          let check = moment(isExist).isSame(new Date(), "day");
          if (check == false) {
            array.push(sp);
          }
        }
      } else if (sp.deliveryArea && Object.keys(sp.deliveryArea).length > 0) {
        let isExist = sp?.deliveryArea?.availability?.end;
        if (isExist) {
          let check = Date.now() > new Date(isExist);
          if (check == false) {
            array.push(sp);
          }
        }
      } else if (sp.building && Object.keys(sp.building).length > 0) {
        array.push(sp);
      }
    });

    return array;
  };
  const handleColorAndNameOfShape = (shape) => {
    if (shape.deliveryArea && Object.keys(shape?.deliveryArea).length > 0) {
      shape.name = shape?.deliveryArea.name;
      shape.color = shape.deliveryArea.color;
    } else if (
      shape.storageArea &&
      Object.keys(shape?.storageArea).length > 0
    ) {
      shape.name = shape.storageArea.name;
      shape.color = shape.storageArea.color;
    } else if (shape.building && Object.keys(shape?.building).length > 0) {
      shape.name = shape.building.name;
      shape.color = shape.building.color;
    } else if (shape.mean && Object.keys(shape?.mean).length > 0) {
      if (shape.mean.image) {
        shape.image = shape.mean.image;
      } else {
        shape.color = shape.mean.color;
      }
    }
  };

  const fetchSitePic = async () => {
    try {
      setPdf(
        adminStore.site.siteId?.plan
          ? GLOBALS.Constants.BASE_URL + adminStore.site.siteId?.plan
          : undefined,
      );
      let response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_PIC_BY_SITE}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      let shapes = response.data.shapes;
      let newShapes = expiredShapes(shapes);

      if (newShapes) {
        newShapes.map((st) => handleColorAndNameOfShape(st));

        setShapes(newShapes);
      } else {
        shapes.map((st) => handleColorAndNameOfShape(st));
        setShapes(shapes);
      }
      // setShapes(response.data.shapes);

      setSitePic(response.data);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const fetchLevelPic = async (levelId) => {
    try {
      let response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_LEVEL_PIC_BY_LEVEL}/${levelId}`,
        token: store.token,
      });
      setlevelPic(response.data);
      let shapes = response.data.shapes;
      shapes.map((st) => handleColorAndNameOfShape(st));
      setShapes(shapes);
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
    setPdf(pdfUri);
    level ? onAddLevelPlan(pdf) : onAddSitePlan(pdf);
  };

  const onAddSitePlan = async (file) => {
    try {
      const formdata = new FormData();
      formdata.append("image", file);
      formdata.append("siteId", adminStore.site.siteId._id);

      const response = await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.ADMIN_PIC_PDF,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });

      dispatch(
        Actions.admin.set_site({ ...adminStore.site, siteId: response.data }),
      );
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  // for delviry count
  const filterBookingCalendar = async () => {
    const companyResponse = await GLOBALS.API({
      uri: `${GLOBALS.Constants.GET_COMPANY_USER}/${adminStore.site.siteId._id}/${userId}`,
      token: store.token,
    });
    setCompany(companyResponse?.data?.company);
    // alert count api
    const getAlertData = await GLOBALS.API({
      uri: `${GLOBALS.Constants.PIC_ALERT_COUNT}/${adminStore.site.siteId._id}`,
      token: store.token,
      method: "GET",
    });
    setAlertCount(getAlertData?.data?.count);

    // alert count api end

    let count = 0;
    let alerts = 0;
    let tempEvent;
    try {
      const response = await GLOBALS.API({
        method: "POST",
        token: store.token,
        uri: `${GLOBALS.Constants.filterBookingCalendar}`,
        body: JSON.stringify({
          siteId: adminStore.site.siteId._id,
          // companyId: enterprise,
          typeOfPlaning: "Deliveries",
          status: "ALERT",
          // typeOfPlace: typeOfPlacevalue,
          // placeId: placeId,
        }),
      });

      if (response.success) {
        tempEvent = response.data.Deliveries.map((key, index) => {
          // if (key.userId._id === userId) {
          count++;
          // }
        });
        response.data?.Deliveries.map((item) => {
          item.alert && alerts++;
        });
        setDeliveryCount(count);
        // setAlertCount(alerts);
      }
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  // end
  const checkStorageArea = async (item) => {
    setstorageAreaData(item);
    let found = item.storageArea.companies.find(
      (item2) => String(item2) === String(company._id),
    );
    if (found) {
      setOpenStorageModal(true);
      setStorageArea(found);
    } else {
      setRequestFound(false);
      const checkAccess = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_SITE_STORAGE_AREA}/${adminStore.site.siteId._id}`,
        token: store.token,
        method: "GET",
      });
      checkAccess.data.map((item2) => {
        if (
          item2?.companyId?._id === company?._id &&
          item2?.storageAreaId?._id === storageAreaData.storageArea._id
        ) {
          setRequestFound(true);
        }
      });
      setStorageArea("");
      setOpenStorageModal(true);
    }
  };

  const onStorageClick = async () => {
    try {
      await GLOBALS.API({
        uri: GLOBALS.Constants.GET_SITE_STORAGE_AREA,
        token: store.token,
        method: "POST",
        body: JSON.stringify({
          siteId: adminStore.site.siteId._id,
          userId,
          companyId: company._id,
          storageAreaId: storageAreaData.storageArea._id,
        }),
      });
      setOpenStorageModal(false);
      dispatch(
        Actions.notistack.enqueueSnackbar({
          visible: true,
          messageType: "success",
          message: "Request sent successfully",
        }),
      );
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
      console.log("err", err);
    }
  };

  const onAddLevelPlan = async (file) => {
    try {
      const formdata = new FormData();
      formdata.append("image", file);
      formdata.append("levelId", level);

      const response = await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.ADMIN_PIC_PDF,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });

      const buildingIndex = sitePic.shapes.findIndex(
        (shp) => shp._id === response.data.building,
      );
      let buildingFind = sitePic.shapes[buildingIndex];
      if (buildingFind) {
        let buildingCloned = _.cloneDeep(buildingFind);

        let levelIn = buildingCloned.building.levels.findIndex(
          (lev) => lev._id === level,
        );
        buildingCloned.building.levels[levelIn].plan = response.data.plan;
        let sitePicCloned = _.cloneDeep(sitePic);
        sitePicCloned.shapes[buildingIndex] = buildingCloned;

        let levelsArr = _.cloneDeep(buildingCloned.building.levels);
        setSitePic(sitePicCloned);
        setSelectedShape(buildingCloned);
        setAllLevels(_.cloneDeep(levelsArr));
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const handleChange = (shapesArray) => {
    let getShape = shapesArray[shapesArray.length - 1];
    if (
      selectedShape &&
      getShape.type !== "MEAN" &&
      Object.keys(selectedShape).length > 0 &&
      level === ""
    ) {
      let newShape = selectedShape;

      var removeIndex = shapesArray
        ?.map(function (item) {
          return item._id;
        })
        .indexOf(newShape._id);
      shapesArray[removeIndex].points = getShape.points;

      let updatedShape = shapesArray[removeIndex];
      level && (selectedShapeReserver = selectedShape);
      updatedShape && setShape(updatedShape);
      setShapes(shapesArray);
      updateShape(updatedShape);
      // remove object
      // removeIndex && shapesArray.splice(removeIndex, 1);
      setSelectedShape("");
    } else if (
      selectedShape &&
      getShape.type !== "MEAN" &&
      getShape.type === "STORAGEAREA" &&
      selectedShape.type !== "BUILDING" &&
      Object.keys(selectedShape).length > 0 &&
      level
    ) {
      let newShape = selectedShape;
      var removeIndex = shapesArray
        ?.map(function (item) {
          return item._id;
        })
        .indexOf(newShape._id);
      shapesArray[removeIndex].points = getShape.points;

      let updatedShape = shapesArray[removeIndex];
      level && (selectedShapeReserver = selectedShape);
      updatedShape && setShape(updatedShape);
      setShapes(shapesArray);
      updateLevelShape(updatedShape);
      // remove object
      // removeIndex && shapesArray.splice(removeIndex, 1);
      setSelectedShape("");
    } else {
      level && (selectedShapeReserver = selectedShape);

      getShape && setShape(getShape);

      setShapes(shapesArray);
      setModal(true);
      setSelectedShape("");
    }
  };
  // update Building

  const updateShape = async (newShape) => {
    try {
      let response = await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.ADMIN_PIC_SHAPE_POINTS}/${SITE_ID}`,
        token: store.token,
        body: JSON.stringify({
          points: newShape.points,
          picID: newShape._id,
        }),
      });
      setRendering(response);
    } catch (error) {
      console.log(error, update_shape_error);
    }
  };
  const updateLevelShape = async (newShape) => {
    try {
      let response = await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.ADMIN_LEVEL_PIC_SHAPE_POINTS}/${level}`,
        token: store.token,
        body: JSON.stringify({
          points: newShape.points,
          picID: newShape._id,
        }),
      });
      setRendering(response);
    } catch (error) {
      console.log(error, update_shape_error);
    }
  };

  const handleClick = (id, shape) => {
    if (shape.type == "STORAGEAREA") {
      checkStorageArea(shape);
    }
    if (shape.type == "DELIVERYAREA") {
      setOpenDeliveryModal(true);
    }
    setSelectedShape(shape);
    if (shape.type === "BUILDING") {
      setselectedBuilding(shape);
      let levelsArr = _.cloneDeep(shape.building.levels);
      setAllLevels(_.cloneDeep(levelsArr));
      let levs = [];

      levelsArr.map((le) =>
        levs.push({
          label: le.number === 0 ? "RDC" : le.number,
          value: le._id,
        }),
      );

      setLevelsDropdown(levs);
    }
  };
  const checkShape = () => {
    level && setSelectedShape(selectedShapeReserver);
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
      if (selectedShapeReserver) {
        setSelectedShape(selectedShapeReserver);
      }
    }
  };
  // InfoDrawer
  const onDeleteShape = async () => {
    try {
      if (window.confirm(Are_you_sure_You_want_to_delete_this_shape)) {
        if (level) {
          let response = await GLOBALS.API({
            method: "DELETE",
            uri: `${GLOBALS.Constants.ADMIN_LEVEL_PIC_SHAPE}/${levelPic._id}/${selectedShape._id}`,
            token: store.token,
          });
          setlevelPic(response.data);

          let shapes = response.data.shapes;
          let newShapes = expiredShapes(shapes);

          if (newShapes) {
            newShapes.map((st) => handleColorAndNameOfShape(st));

            setShapes(newShapes);
          } else {
            shapes.map((st) => handleColorAndNameOfShape(st));
            setShapes(shapes);
          }
          setSelectedShape("");
          setLoading(false);
        } else {
          let response = await GLOBALS.API({
            method: "DELETE",
            uri: `${GLOBALS.Constants.ADMIN_PIC_SHAPE}/${sitePic._id}/${selectedShape._id}`,
            token: store.token,
          });
          setSitePic(response.data);
          let shapes = response.data.shapes;
          let newShapes = expiredShapes(shapes);

          if (newShapes) {
            newShapes.map((st) => handleColorAndNameOfShape(st));

            setShapes(newShapes);
          } else {
            shapes.map((st) => handleColorAndNameOfShape(st));
            setShapes(shapes);
          }
          setSelectedShape("");
          setLoading(false);
        }
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const BuildingComponent = () => {
    return (
      <>
        <SubHeading primary={selectedBuilding.name} bold fontSize={22} />
        <SubHeading primary={`Type : ${selectedBuilding.type}`} />
        <FormSelect
          name="level"
          value={level}
          values={levelsDropdown}
          placeholder={SELECT_LEVEL}
          onChange={({ target: { value } }) => {
            setLevel(value);
            if (value) {
              // console.log();
              const leve = allLeves.find((lev) => lev._id === value);
              fetchLevelPic(leve);
              setPdf(
                leve?.plan ? GLOBALS.Constants.BASE_URL + leve.plan : undefined,
              );
            }
          }}
        />
      </>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.canvasRow}>
          {loading ? (
            <Loader.Progress />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Document className={classes.pdfstyle} file={pdf ? pdf : imggg}>
                <Page className={classes.pagee} pageNumber={1} height="680" />
              </Document>
              <Canvas
                shapes={shapes}
                role={adminStore?.site?.role}
                onClick={handleClick}
                onChange={handleChange}
                setSelectedShape={setSelectedShape}
                selectedShape={selectedShape}
                onClear={onClear}
                pdf={pdf}
                setRendering={setRendering}
                onPdfChange={handlePdfChange}
                level={level ? true : false}
              />
            </div>
          )}
          <div className={classes.infoDrawerContainer}>
            {selectedShape && selectedShape.type === "BUILDING" && level && (
              <Button
                text={SHOW_EXTERIOR}
                className="mt-2"
                onClick={() => {
                  setPdf(
                    adminStore.site.siteId?.plan
                      ? GLOBALS.Constants.BASE_URL +
                          adminStore.site.siteId?.plan
                      : undefined,
                  );

                  setShapes(sitePic.shapes);
                  setLevel("");
                  setSelectedShape("");
                  setselectedBuilding("");
                  selectedShapeReserver = null;
                }}
              />
            )}
            {selectedBuilding && selectedShape.type !== "BUILDING" && level && (
              <>
                <Button
                  text={SHOW_EXTERIOR}
                  className="mt-2"
                  onClick={() => {
                    setPdf(
                      adminStore.site.siteId?.plan
                        ? GLOBALS.Constants.BASE_URL +
                            adminStore.site.siteId?.plan
                        : undefined,
                    );

                    setShapes(sitePic.shapes);
                    setLevel("");
                    setSelectedShape("");
                    setselectedBuilding("");
                    selectedShapeReserver = null;
                  }}
                />
                <div className={classes.infoDrawer2}>{BuildingComponent()}</div>
              </>
            )}
            <div
              style={{
                backgroundColor: "#47A7EE",
                textAlign: "center",
                color: "white",
                padding: "5px",
                margin: "5px",
              }}
            >
              <div style={{ textAlign: "left", padding: "5px" }}>
                {" "}
                <img
                  src={deliverIcon}
                  style={{ width: 25, height: 25 }}
                  alt="Icon"
                />
              </div>
              <h3 className="font-weight-bold" style={{ color: "white" }}>
                {deliveryCount}
              </h3>
              <h6 style={{ color: "white" }}>{DELIVERIES}</h6>
            </div>
            <div
              style={{
                backgroundColor: "#E15141",
                textAlign: "center",
                color: "white",
                padding: "5px",
                margin: "5px",
              }}
            >
              <div style={{ textAlign: "left", padding: "5px" }}>
                {" "}
                <img
                  src={alertIcon1}
                  style={{ width: 25, height: 25 }}
                  alt="Icon"
                />
                <img
                  src={alertIcon}
                  style={{
                    width: "5px",
                    height: "18px",
                    position: "relative",
                    right: "15px",
                  }}
                  alt="Icon"
                />
              </div>
              <h3 className="font-weight-bold" style={{ color: "white" }}>
                {alertCount}
              </h3>
              <h6 style={{ color: "white" }}>{ALERTS}</h6>
            </div>
            {selectedShape && (
              <div
                className={
                  selectedShape && selectedShape.type !== "BUILDING" && level
                    ? classes.infoDrawer3
                    : classes.infoDrawer
                }
              >
                {/* <SubHeading primary={selectedShape.name} bold fontSize={22} />
                <SubHeading primary={`Type1 : ${selectedShape.type}`} /> */}
                {selectedShape.type === "BUILDING" && (
                  <FormSelect
                    name="level"
                    value={level}
                    values={levelsDropdown}
                    placeholder="Select Level"
                    onChange={({ target: { value } }) => {
                      setLevel(value);
                      findlevelName(value);
                      if (value) {
                        fetchLevelPic(value);
                        const leve = allLeves.find((lev) => lev._id === value);
                        setPdf(
                          leve?.plan
                            ? GLOBALS.Constants.BASE_URL + leve.plan
                            : undefined,
                        );
                      }
                    }}
                  />
                )}
                <Form.Row>
                  {/* {level === "" ? (
                    <IconButton
                      disabled={loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModal(true);
                      }}
                    >
                      <Pencil className={classes.infoIcon} />
                    </IconButton>
                  ) : selectedShape.type === "BUILDING" ? (
                    ""
                  ) : (
                    <IconButton
                      disabled={loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModal(true);
                      }}
                    >
                      <Pencil className={classes.infoIcon} />
                    </IconButton>
                  )} */}

                  {selectedShape.type === "MEAN" ? (
                    <>
                      <NavLink
                        disabled={loading}
                        to={{
                          pathname: "/means/calendar",
                          selectedShape: selectedShape,
                        }}
                      >
                        <IconButton>
                          <Calendar className={classes.infoIcon} />
                        </IconButton>
                      </NavLink>
                    </>
                  ) : selectedShape.type === "DELIVERYAREA" ? (
                    <>
                      {/* <NavLink
                        disabled={loading}
                        to={{
                          pathname: "/pic-interactive/calendar",
                          selectedShape: selectedShape,
                          company: company,
                        }}
                      >
                        <IconButton>
                          <Calendar className={classes.infoIcon} />
                        </IconButton>
                      </NavLink> */}
                    </>
                  ) : (
                    <>
                      <NavLink
                        disabled={loading}
                        to={{
                          pathname: "/pic-interactive/calendar",
                          selectedShape: selectedShape,
                        }}
                      ></NavLink>
                    </>
                  )}

                  {/* <IconButton
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteShape();
                    }}
                  >
                    <Cross className={classes.infoIcon} />
                  </IconButton> */}
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
              title={`${shape ? ADD : EDIT} ${DELIVERYAREA}`}
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
                setSelectedShape("");
              }}
              // body={
              //   <DeliveryArea
              //     shape={shape}
              //     pic={level ? levelPic : sitePic}
              //     level={level}
              //     shapes={shapes}
              //     setShapes={setShapesFn}
              //     selectedShape={selectedShape}
              //     setSelectedShape={setSelectedShape}
              //   />
              // }
            />
          ) : (
              shape
                ? shape.type === "STORAGEAREA"
                : selectedShape.type === "STORAGEAREA"
            ) ? (
            <FullScreenModal
              title={`${shape ? ADD : EDIT} ${STORAGEAREA}`}
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
                setSelectedShape("");
              }}
              // body={
              //   <StorageArea
              //     shape={shape}
              //     pic={level ? levelPic : sitePic}
              //     level={level}
              //     shapes={shapes}
              //     setShapes={setShapesFn}
              //     selectedShape={selectedShape}
              //     setSelectedShape={setSelectedShape}
              //   />
              // }
            />
          ) : (
              shape
                ? shape.type === "BUILDING"
                : selectedShape.type === "BUILDING"
            ) ? (
            <FullScreenModal
              title={`${shape ? ADD : EDIT} ${BUILDING}`}
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
                setSelectedShape("");
              }}
              // body={
              //   <Building
              //     shape={shape}
              //     pic={level ? levelPic : sitePic}
              //     level={level}
              //     shapes={shapes}
              //     setShapes={setShapesFn}
              //     selectedShape={selectedShape}
              //     setSelectedShape={setSelectedShape}
              //   />
              // }
            />
          ) : (
              shape ? shape.type === "MEAN" : selectedShape.type === "MEAN"
            ) ? (
            <FullScreenModal
              title={`${shape ? ADD : EDIT} ${MEANS}`}
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
                setSelectedShape("");
              }}
              body={
                <Mean
                  shape={shape}
                  pic={level ? levelPic : sitePic}
                  level={level}
                  levelName={levelName}
                  selectedBuilding={selectedBuilding}
                  shapes={shapes}
                  setShapes={setShapesFn}
                  selectedShape={selectedShape}
                  setSelectedShape={setSelectedShape}
                />
              }
            />
          ) : (
            ""
          ))}
      </>
      <Dialog
        open={openStorageModal}
        onClose={() => setOpenStorageModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <h5 style={{ color: "#DBB20A" }}>{selectedShape?.name}</h5>
          {storageArea ? (
            <>
              <p
                style={{
                  fontSize: 15,
                }}
              >
                Vous avez accès à cette zone de stockage.
              </p>
            </>
          ) : requestFound ? (
            <p
              style={{
                fontSize: 15,
              }}
            >
              Your Previous Request is Still Pending
            </p>
          ) : (
            <>
              <p
                style={{
                  fontSize: 15,
                }}
              >
                Vous n'avez pas accès à cette zone de stockage.
              </p>
              <Button
                // text="Demander Accès"
                className="mt-2 "
                disabled={requestFound}
                style={{ width: "42%", marginLeft: "24%", fontSize: "12px" }}
                onClick={onStorageClick}
              >
                Demander Accès
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDeliveryModal}
        onClose={() => setOpenDeliveryModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <h4 style={{ color: "#DBB20A", textAlign: "center" }}>
            {selectedShape?.name}
          </h4>
          <SubHeading primary={`Type1 : ${selectedShape.type}`} />
          <div style={{ textAlign: "center" }}>
            <NavLink
              disabled={loading}
              to={{
                pathname: "/pic-interactive/calendar",
                selectedShape: selectedShape,
                company: company,
              }}
            >
              <IconButton>
                <Calendar className={classes.infoIcon} />
              </IconButton>
            </NavLink>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PicCanvas;
