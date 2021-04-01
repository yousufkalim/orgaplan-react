import React from "react";
import { Stage, Layer, Circle } from "react-konva";
import ConvaLine from "./Components/Line";
import Rectangle from "./Components/Rectangle";

export default function Canvas({
  onClick,
  onMouseMove,
  onMouseOverStartPoint,
  onMouseOutStartPoint,
  handleConvaLineMouseOver,
  handleConvaLineMouseOut,
  handleConvaLineClick,
  handleConvaCircleClick,
  // states start
  image,
  points,
  isFinished,
  curMousePos,
  shapes,
  means,
  meanFinish,
  width,
  height,
}) {
  var flattenedPoints = points
    .concat(isFinished ? [] : curMousePos)
    .reduce((a, b) => a.concat(b), []);

  return (
    <>
      <Stage
        width={width}
        height={height}
        onMouseDown={onClick}
        onMouseMove={onMouseMove}
      >
        <Layer>
          {image ? (
            <Rectangle fillPatternImage={image} width={width} height={height} />
          ) : (
            <Rectangle fill={"#ccc"} width={width} height={height} />
          )}
          <ConvaLine
            points={flattenedPoints}
            stroke="black"
            fill="blue"
            strokeWidth={3}
            closed={isFinished}
          />

          {shapes && shapes.length > 0
            ? shapes.map((shape) => {
                let flattenedPoint = [];
                const width = 6;
                let x = 0;
                let y = 0;

                if (shape.type === "MEAN") {
                  x = shape.points[0][0] - width / 2;
                  y = shape.points[0][1] - width / 2;
                } else {
                  flattenedPoint = shape.points.reduce(
                    (a, b) => a.concat(b),
                    [],
                  );
                }

                return (
                  <>
                    {shape.type === "MEAN" ? (
                      shape.image ? (
                        <Circle
                          key={shape._id}
                          x={x}
                          y={y}
                          width={30}
                          height={30}
                          fillPatternImage={shape.image}
                          stroke="red"
                          meanFinish={meanFinish}
                          strokeWidth={3}
                          onClick={(e) => handleConvaCircleClick(shape._id)}
                        />
                      ) : (
                        <Circle
                          key={shape._id}
                          x={x}
                          y={y}
                          width={30}
                          fill={shape.color}
                          meanFinish={meanFinish}
                          stroke="red"
                          strokeWidth={3}
                          onClick={(e) => handleConvaCircleClick(shape._id)}
                        />
                      )
                    ) : (
                      <ConvaLine
                        key={shape._id}
                        points={flattenedPoint}
                        stroke="black"
                        fill={shape.color}
                        opacity={shape.opacity}
                        strokeWidth={3}
                        onMouseOver={() => handleConvaLineMouseOver(shape._id)}
                        onMouseOut={() => handleConvaLineMouseOut(shape._id)}
                        onClick={() => handleConvaLineClick(shape._id)}
                        closed={true}
                      />
                    )}
                    {points.map((point, index) => {
                      const width = 6;
                      const x = point[0] - width / 2;
                      const y = point[1] - width / 2;
                      const startPointAttr =
                        index === 0
                          ? {
                              hitStrokeWidth: 12,
                              onMouseOver: onMouseOverStartPoint,
                              onMouseOut: onMouseOutStartPoint,
                            }
                          : null;

                      return (
                        <React.Fragment key={index}>
                          <Rectangle
                            x={x}
                            y={y}
                            width={width}
                            height={width}
                            fill="blue"
                            stroke="black"
                            strokeWidth={6}
                            startPointAttr={startPointAttr}
                          />
                        </React.Fragment>
                      );
                    })}
                  </>
                );
              })
            : points.map((point, index) => {
                const width = 6;

                const x = point[0] - width / 2;
                const y = point[1] - width / 2;

                const startPointAttr =
                  index === 0
                    ? {
                        hitStrokeWidth: 12,
                        onMouseOver: onMouseOverStartPoint,
                        onMouseOut: onMouseOutStartPoint,
                      }
                    : null;

                return (
                  <React.Fragment key={index}>
                    <Rectangle
                      x={x}
                      y={y}
                      width={width}
                      height={width}
                      fill="blue"
                      stroke="black"
                      strokeWidth={6}
                      startPointAttr={startPointAttr}
                    />
                  </React.Fragment>
                );
              })}
        </Layer>
      </Stage>
    </>
  );
}
