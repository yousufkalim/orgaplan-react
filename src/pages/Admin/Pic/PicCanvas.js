import React, { useState } from "react";
import Canvas from "../../../components/Canvas";
import { makeStyles } from "@material-ui/core/styles";

import Mean from "./Mean";
import Building from "./Building";
import GLOBALS from "../../../globals";
import DeliveryArea from "./DeliveryArea";
// import StorgaeArea from './StorageArea';
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

let formType = "";
const App = (props) => {
  const classes = useStyles();
  const [shapes, setShapes] = useState([]);
  const [modal, setModal] = useState(false);

  const handleChange = (shapes) => {
    console.log("shapes", shapes);
    setShapes(shapes);
    setModal((st) => !st);
  };

  const handleClick = (id, shape) => {
    alert("Shape Click", id, shape);
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Canvas shapes={shapes} onClick={handleClick} onChange={handleChange} />
      </div>
      {formType && formType === "DELIVERYAREA" ? (
        <FullScreenModal
          title="ADD DELIVERY AREA"
          open={modal}
          onClose={() => {
            setModal((st) => !st);
          }}
          body={<DeliveryArea />}
        />
      ) : formType === "STORAGEAREA" ? (
        <FullScreenModal
          title="ADD STORAGE AREA"
          open={modal}
          onClose={() => {
            setModal((st) => !st);
          }}
          body={<DeliveryArea />}
        />
      ) : formType === "BUILDING" ? (
        <FullScreenModal
          title="ADD Building"
          open={modal}
          onClose={() => {
            setModal((st) => !st);
          }}
          body={<Building />}
        />
      ) : formType === "MEAN" ? (
        <FullScreenModal
          title="ADD MEAN"
          open={modal}
          onClose={() => {
            setModal((st) => !st);
          }}
          body={<Mean />}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
