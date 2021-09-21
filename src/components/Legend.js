import React from "react";
import "antd/dist/antd.css";
import { List } from "antd";
import GLOBALS from "../globals";
import { Divider } from "antd";

const ledger = (props) => {
  return (
    <>
      <Divider orientation="center">Legend</Divider>
      <div
        style={{
          height: "85.5%",
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <List
          dataSource={props.shapes}
          split={false}
          renderItem={(item) => (
            <List.Item style={{ marginBottom: -16 }}>
              <div
                style={{
                  display: "flex",
                  opacity: props.selectedShape._id === item._id && 0.8,
                }}
                onClick={() => props.onClick(item._id)}
              >
                {item.type !== "MEAN" ? (
                  <div
                    style={{
                      width: 40,
                      height: 16,
                      backgroundColor: item.color,
                      border: item.type === "BUILDING" && "2px dotted black",
                      marginTop: "auto",
                      marginBottom: "auto",
                      marginRight: 26,
                    }}
                  ></div>
                ) : (
                  <div>
                    <img
                      style={{
                        width: 40,
                        height: 16,
                        marginRight: 26,
                        objectFit: "fill",
                      }}
                      src={`${GLOBALS.Constants.BASE_URL}${item.mean.image}`}
                      alt="MOYEN"
                    />
                  </div>
                )}
                <p
                  style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                >
                  {item.name}
                </p>
              </div>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default ledger;
