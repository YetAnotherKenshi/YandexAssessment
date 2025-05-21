import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${Math.min((progress / 3000) * 100, 100)}%` }}
        ></div>
      </div>
      {/* <p className="progress-text">Всего размечено отзывов: {progress}/3000</p> */}
    </div>
  );
};

export default ProgressBar;
