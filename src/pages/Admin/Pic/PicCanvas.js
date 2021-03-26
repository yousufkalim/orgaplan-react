import React, { useState } from "react";
import Canvas from "../../../components/Canvas";
import { makeStyles } from "@material-ui/core/styles";

import GLOBALS from "../../../globals";

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
  // let dbShapes = [
  //   {
  //     _id: 29,
  //     type: "Building",
  //     color: "black",
  //     opacity: 0.3,
  //     points: [
  //       [353, 134],
  //       [429, 280],
  //       [221, 297],
  //     ],
  //   },
  //   {
  //     _id: 1,
  //     type: "Mean",
  //     color: "black",
  //     points: [[284, 96]],
  //   },
  //   {
  //     _id: 39,
  //     type: "Building",
  //     color: "black",
  //     opacity: 0.3,
  //     points: [
  //       [88, 40],
  //       [173, 48],
  //       [37, 149],
  //       [24, 78],
  //     ],
  //   },
  // ];
  const [shapes, setShapes] = useState([]);
  const [pdf, setPdf] = useState(
    "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
  );

  const handlePdfChange = (pdf) => {
    setPdf(pdf);
  };
  const handleChange = (shapes) => {
    setShapes(shapes);
  };
  const handleClick = (id, shape) => {
    alert("Shape Click", id, shape);
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
    </div>
  );
};

export default App;
