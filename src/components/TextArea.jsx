import React, { useEffect, useRef, useState } from "react";

const TextArea = ({ text, noReviews }) => {
  return (
    <>
      <div className="text-area">
        {noReviews ? "Нет неразмеченных отзывов" : text}
      </div>
    </>
  );
};

export default TextArea;
