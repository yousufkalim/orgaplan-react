import React, { useEffect, useState } from "react";
import Canvas from "../../../components/Canvas";
import { makeStyles } from "@material-ui/core/styles";

import Mean from "./Mean";
import Building from "./Building";
import GLOBALS from "../../../globals";
import StorageArea from "./StorageArea";
import DeliveryArea from "./DeliveryArea";
import FullScreenModal from "../../../components/FullScreenModal";

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
  const [shape, setShape] = useState("");
  const [shapes, setShapes] = useState([]);
  const [pdf, setPdf] = useState(
    "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
  );

  const handlePdfChange = (pdf) => {
    setPdf(pdf);
  };
  // const handleChange = (shapes) => {
  // setShapes(shapes);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    shape && setModal(true);
  }, [shape]);

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
        <Canvas
          shapes={shapes}
          onClick={handleClick}
          onChange={handleChange}
          onPdfChange={handlePdfChange}
          pdf={pdf}
        />
      </div>
      {console.log("shapes", shapes)}
      {console.log("shape", shape)}
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
              />
            }
          />
        ) : (
          ""
        ))}
    </div>
  );
};

export default App;
