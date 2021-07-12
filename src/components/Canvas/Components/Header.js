import React from "react";
import { Elements, LevelElements } from "./data";
import FormSelect from "../../FormSelect";
import {TEXTS} from "../../../assets/languages/french";

export default function Header({
  handleElementChange,
  meanCheck,
  image,
  level,
}) {
  const {Select_an_element_first}=TEXTS
  return (
    <div className=" mr-auto text-center ">
      <div className="row pr-4 pt-2">
        <div className="col-lg-3" />
        <div className="col-lg-3" />
        <div className="col-lg-3" />
        <div className="col-lg-3">
          <FormSelect
            value={meanCheck}
            name={"levelId"}
            values={level ? LevelElements : Elements}

            placeholder={Select_an_element_first}
            onChange={handleElementChange}
            disabled={image == null ? true : false}
          />
        </div>
      </div>
    </div>
  );
}
