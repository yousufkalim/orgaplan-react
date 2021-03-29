import React, { useEffect, useState } from "react";
import Canvas from "../../../components/Canvas";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

import Mean from "./Mean";
import Building from "./Building";
import GLOBALS from "../../../globals";
import StorageArea from "./StorageArea";
import DeliveryArea from "./DeliveryArea";
import Form from "../../../components/Form";
import Actions from "../../../redux/actions";
import Loader from "../../../components/Loader";
import FullScreenModal from "../../../components/FullScreenModal";

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

  useEffect(() => {
    shape && setModal(true);
  }, [shape]);

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

  const handlePdfChange = (pdf) => {
    setPdf(pdf);
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
<<<<<<< Updated upstream
  };
=======
  }

  // const handleClick = (id, shape) => {
  //   console.log("Shape Click", id, shape);
  // };
>>>>>>> Stashed changes

  const handleChange = (shapesArray) => {
    let getShape = shapesArray[shapesArray.length - 1];
    getShape && setShape(getShape);
    setShapes(shapesArray);
    setModal((st) => !st);
  };

  const handleClick = (id, shape) => {
    console.log("Shape Click", id, shape);
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Form.Row>
          <div style={{ width: 800 }}>
            {loading ? (
              <Loader.Progress />
            ) : (
              <Canvas
                shapes={shapes}
                onClick={handleClick}
                onChange={handleChange}
                onPdfChange={handlePdfChange}
                pdf={pdf}
              />
            )}
          </div>
          <div>asdas</div>
        </Form.Row>
      </div>
      <>
        {shape &&
          (shape.type === "DELIVERYAREA" ? (
            <FullScreenModal
              title="ADD DELIVERY AREA"
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
              }}
              body={
                <DeliveryArea
                  shapes={shapes}
                  setShapes={setShapes}
                  shape={shape}
                  setShape={setShape}
                  setModal={setModal}
                  pic={sitePic}
                  setSitePic={setSitePic}
                />
              }
            />
          ) : shape.type === "STORAGEAREA" ? (
            <FullScreenModal
              title="ADD STORAGE AREA"
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
              }}
              body={
                <StorageArea
                  shapes={shapes}
                  setShapes={setShapes}
                  shape={shape}
                  setShape={setShape}
                  setModal={setModal}
                  pic={sitePic}
                  setSitePic={setSitePic}
                />
              }
            />
          ) : shape.type === "BUILDING" ? (
            <FullScreenModal
              title="ADD Building"
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
              }}
              body={
                <Building
                  shapes={shapes}
                  setShapes={setShapes}
                  shape={shape}
                  setShape={setShape}
                  setModal={setModal}
                  pic={sitePic}
                  setSitePic={setSitePic}
                />
              }
            />
          ) : shape.type === "MEAN" ? (
            <FullScreenModal
              title="ADD MEAN"
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
              }}
              body={
                <Mean
                  shapes={shapes}
                  setShapes={setShapes}
                  shape={shape}
                  setShape={setShape}
                  setModal={setModal}
                  pic={sitePic}
                  setSitePic={setSitePic}
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
