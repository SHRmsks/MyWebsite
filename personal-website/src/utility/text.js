"use client";
import React, { useState, useEffect } from "react";
import "../app/global.css";

const Text = ({ Title, text, size, icon}) => {
     const [ratio3, setRatio3] = useState(null);
     useEffect(() => {
        const img3= new Image()
        img3.src = icon;
        img3.onload = () => {
            setRatio3(img3.naturalWidth / img3.naturalHeight);
          };
      


     },[ratio3]);
  return (
    <div className="w-full h-full text-start m-0 p-0 gap-1 z-10">
      <div className="border-b-[2px] border-[#f75049]/[0.4] w-fit h-fit">
        <p className="text-[#f75049]/[0.9] text-[10px] font-text text-start text-wrap break-words m-0">
          {Title}
        </p>
      </div>
      <div className="w-full gap-x-[8px] h-fit flex flex-row">
        <img src={icon} className="w-[10px] self-center" style={{height: ratio3? `${10/ratio3}px`: `auto`}}/>
      <p className={`text-[#39c4b6] text-[${size}] font-text text-start gap-1 text-wrap break-words drop-shadow-text_bottom m-0 `}>
        {text&& text.split("\n").map((line, index, arr ) => (
          <React.Fragment key={index}>
            {line}
           { index< arr.length-1 && <br />}
          </React.Fragment>
        ))}
      </p>
      </div>
    </div>
  );
};
export default Text;
