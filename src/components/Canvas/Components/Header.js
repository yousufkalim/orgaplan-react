import React from "react";
import { Buildings, Levels, Elements } from "./data";
import FormSelect from "../../FormSelect";

export default function Header({ handleElementChange, meanCheck, image }) {
  return (
    <div className=" mr-auto text-center ">
      <div className="row">
        <div className="col-lg-3">
          <FormSelect
            value={""}
            name="companyId"
            values={Buildings}
            placeholder={"Select building"}
            disabled={image == null ? true : false}
            onChange={({ target: { name, value } }) =>
              console.log("values", value, name)
            }
          />
        </div>
        <div className="col-lg-3">
          <FormSelect
            value={""}
            name="levelId"
            values={Levels}
            placeholder={"Select level"}
            disabled={image == null ? true : false}
            onChange={({ target: { name, value } }) =>
              console.log("values", value, name)
            }
          />
        </div>
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
