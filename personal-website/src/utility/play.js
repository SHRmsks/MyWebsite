"use client";
import React, { useMemo, useEffect, useState } from "react";
import { motion } from "motion/react";
import MatrixEffect from "./randomText";
import "../app/global.css";

const PlayButton = ({ begin, clickHandler }) => {
  const [svg, setSvg] = useState(null);
  const [done, setDone] = useState(false);
  const [connected, setConnected] = useState(begin);
  const Btext = useMemo(() => "Click To Visit", []);
  const text1 = useMemo(() => "Neuro Connection Established...", []);
  const text2 = useMemo(() => "Main", []);
  const donehandler = () => {
    if (!done) {
      setDone(true);
    }
  };

  useEffect(() => {
    if (begin) {
      const timeout = setTimeout(() => {
        setConnected(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [begin]);

  useEffect(() => {
    fetch("/play.svg")
      .then((res) => res.text())
      .then((data) => {
        console.log("data", data);
        const updatedSvg = data.replace(
          /<svg([^>]+)>/,
          '<svg$1 fill="#05d9e8">'
        );
        setSvg(updatedSvg);
      })
      .catch((err) => console.error("Error fetching SVG:", err));
  }, []);

  return (
    <div className="relative w-full h-full flex flex-row justify-center items-center ">
      <div className="absolute z-40 right-10 top-3 text-[#05d9e8] font-text text-[20px]">
        <button
          onClick={(e) => {
            // console.log("clicked")
            e.stopPropagation();
            console.log("clickHandler", clickHandler)
            clickHandler();
          }}
        >
          {" "}
          {text2}
        </button>
      </div>
      {connected && (
        <p className=" text-center text-[#05d9e8] font-text text-[20px]">
          {text1}
        </p>
      )}
      <div></div>
      <div className="absolute z-30 right-0 bottom-3 border-dashed p-[2px] rounded-lg  border-[2px] bg-transparent border-[#a0ffe3] w-[300px] h-[100px] flex flex-row flex-1 justify-center items-center ">
        <div className="w-fit h-fit gap-x-3 flex flex-row justify-start items-center">
          {""}

          <MatrixEffect
            finalText={Btext}
            flickerspeed={30}
            text="text"
            speed={30}
            callback2={donehandler}
          />
          {svg && done && (
            <div
              className="w-[30px] h-[30px]"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayButton;
