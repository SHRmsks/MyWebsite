"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import "../app/global.css";
import { motion } from "motion/react";

const MatrixText =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*-=+|?むのませおやあいきつしれりらほそひ";

const MatrixEffect = ({ finalText, speed, flickerspeed, callback, text, callback2 }) => {
  const [displayText, setDisplayText] = useState("");
  const [resolved, setResolved] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimated, setIsAnimated] = useState(true);
  const generateText = useCallback(
    (currentIndex) => {
    return(  Array.from({ length: currentIndex + 3 }, (_, i) =>
        i < currentIndex
          ? finalText[i]
          : MatrixText[Math.floor(Math.random() * MatrixText.length)]
      ).join(""));
    },
    [finalText]
  ); //callback for generate text

  useEffect(() => {
    if (currentIndex >= finalText.length) {
      setDisplayText(finalText);
      setIsAnimated(false);
      if (callback2) {
      callback2()
      }
      if (callback) {
        const timeout = setTimeout(callback, 1500);
        return () => clearTimeout(timeout);
      }
      return;
    }

    const updateText = setInterval(() => {
      setDisplayText(generateText(currentIndex));
    }, flickerspeed);

    const updateTime = setInterval(() => {
      setResolved((prev) => prev + finalText[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, speed);

    return () => {
      clearInterval(updateText);
      clearInterval(updateTime);
    };
  }, [finalText, speed, flickerspeed, currentIndex, callback]);

  const matrix = useMemo(
    () => ({
      initial: {
        opacity: 0,
        y: -10,
      },
      matrix: {
        opacity: [1, 0.9, 0.8, 0.9, 1],
        y: [-3, 0, 3],
        x: [0, -1, 1],
        textShadow: [
          "2px 0px 2px rgba(0, 255, 0, 0.7)",
          "-2px 0px 2px rgba(255, 0, 0, 0.7)",
          "-2px 0px 2px rgba(0, 0, 255, 0.7)",
        ],
        transition: {
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
      static: {
        opacity: 1,
        y: 0,
        x: 0,
        textShadow:
          "2px 0px 2px rgba(0, 255, 0, 0.5), -2px 0px 2px rgba(255, 0, 0, 0.5), -2px 0px 2px rgba(0, 0, 255, 0.5)",
        transition: { ease: "easeInOut", duration: 0.5 },
      },
    }),
    []
  );

  return (
    <motion.div
      style={{ fontFamily: text }}
      className="text-[#39c4b6] overflow-x-hidden overflow-y-scroll w-fit max-w-full h-fit text-wrap break-words text-[18px] font-[400] py-[15px]"
      variants={matrix}
      initial="initial"
      animate={isAnimated ? "matrix" : "static"}
    >
      {displayText && displayText.split("\n").map((line, ind,arr) => (
        <React.Fragment key={ind}>
          <p>{line}</p>
         { ind< arr.length-1 && <br />}
        </React.Fragment>
      ))}
    </motion.div>
  );
};
export default MatrixEffect;
