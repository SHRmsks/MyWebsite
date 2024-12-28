"use client";
import React, { useEffect, useState } from "react";
import "../app/global.css";
import { motion } from "motion/react";

const MatrixText =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*-=+|?><Ξ⟟⩚⨀ʬǃ☲⫷⧖𐋅你烦我乏味啊踢人给我搞了";

const MatrixEffect = ({ finalText, speed, flickerspeed, callback }) => {
  const [displayText, setDisplayText] = useState("");
  const [resolved, setResolved] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimated, setIsAnimated] = useState(true);

  useEffect(() => {
    if (currentIndex >= finalText.length) {
      setDisplayText(finalText);
      setIsAnimated(false);
      if (callback) {
        const timeout = setTimeout(callback, 1500);
        return () => clearTimeout(timeout);
      }
      return;
    }
    const updateText = setInterval(() => {
      const char = finalText[currentIndex];
      const random = Array.from({ length: finalText.length }, (_, i) =>
        i < currentIndex
          ? finalText[i]
          : MatrixText[Math.floor(Math.random() * MatrixText.length)]
      ).join("");
      setDisplayText(random);
    }, flickerspeed);

    const updateTime = setInterval(() => {
      setResolved((prev) => prev + finalText[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, speed);

    return () => {
      clearInterval(updateText);
      clearInterval(updateTime);
    };
  }, [finalText, speed, flickerspeed, currentIndex]);

  const matrix = {
    initial: {
      opacity: 0,
      y: -10,
    },
    matrix: {
      opacity: [1, 0.8, 1],
      y: [-3, 0, 3],
      x: [0, -1, 1],
      textShadow: [
        "-2px 0px 5px rgba(192, 242, 237, 0.9), -2px 5px 10px rgba(95, 146, 251, 0.8)",
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
        "-2px 0px 5px rgba(192, 242, 237, 0.9), -2px 5px 10px rgba(95, 146, 251, 0.8), 1px -2px 3px rgba(221, 134, 237, 0.5)",
      transition: { ease: "easeInOut", duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="text-[#39c4b6] w-fit max-w-full h-fit text-wrap break-words text-[18px] font-[400] font-text py-[15px]"
      variants={matrix}
      initial="initial"
      animate={isAnimated ? "matrix" : "static"}
    >
      <p>{displayText}</p>
    </motion.div>
  );
};
export default MatrixEffect;
