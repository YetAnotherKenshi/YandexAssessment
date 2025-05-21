import React from "react";
import AssesmentOption from "./AssesmentOption";

const Assesment = ({ fragments, updateFragment, deleteFragment }) => {
  return (
    <div className="assessment-container">
      {fragments.length > 0 &&
        fragments.map((fragment, id) => {
          return (
            <AssesmentOption
              fragment={fragment}
              fid={id}
              updateFragment={updateFragment}
              deleteFragment={deleteFragment}
            />
          );
        })}
    </div>
  );
};

export default Assesment;
