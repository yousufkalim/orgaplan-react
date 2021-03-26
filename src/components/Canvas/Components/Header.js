import React from "react";
import { Elements } from "./data";
import FormSelect from "../../FormSelect";

export default function Header({ handleElementChange, meanCheck, image }) {
  return (
    <div className=" mr-auto text-center ">
      <div className="row">
        <div className="col-lg-3" />
        <div className="col-lg-3" />
        <div className="col-lg-3" />
        <div className="col-lg-3">
          <FormSelect
            value={meanCheck}
            name={"levelId"}
            values={Elements}
            placeholder="Add an Element"
            onChange={handleElementChange}
            disabled={image == null ? true : false}
          />
        </div>
      </div>
    </div>
  );
}
