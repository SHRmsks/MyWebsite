"use client";
import React, { useState, useEffect } from "react";
import "../app/global.css";

const Text = ({ Title, text }) => {
  return (
    <div className="w-full h-full text-start gap-y-1 ">
      <div className="border-b-[2px] border-[#f75049]/[0.4] w-fit h-fit">
        <p className="text-[#f75049]/[0.9] text-[10px] font-text text-start text-wrap break-words">
          {Title}
        </p>
      </div>
      <p className="text-[#39c4b6] text-[10px] font-text text-start text-wrap break-words drop-shadow-text_bottom">
        {text.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>
    </div>
  );
};
export default Text;
