"use client";
import React, { useEffect, useState, useRef } from "react";
import Nav from "@/utility/Nav.js";
import { motion } from "motion/react";
import MatrixEffect from "@/utility/randomText";

const Main = () => {
  const text = 
    "Hello there! I am Haoran, a rising undergraduate senior at Boston University, double majoring in Computer Science and Applied Math. My current professional interest is FullStack Software Development, and I am also passionte about AI and Machine Learning.\nI have learned and practiced different frontEnd frameworks including React, Three.JS, Tailwind, React Native and Flutter, and backEnd framework including Express, SpringBoot and Flask. I also have learned intermediate knowledges of Machine learnin including different Types of Reinforcement Learning, Supervised/Unsupervided Learning, and practiced with Pytorch, YOLO_8.\n I am also eager to learn and practice more from basic software architecture to the high level performance cutting edged frameworks. Feel free to connect me or cooperate with me! :P";
  const [ratio, setRatio] = useState(null);
  const [width, setWidth] = useState(null);
  const imgRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.src = "/haoran.png";
    img.onload = () => {
      setRatio(img.naturalWidth / img.naturalHeight);
      if (imgRef.current) {
        setWidth(imgRef.current.offsetWidth);
      }
      const handleResize = () => {
        if (imgRef.current) setWidth(imgRef.current.offsetWidth);
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    };
  }, []);
  return (
    <div className="relative flex-row  h-screen w-screen bg-[#FEE801] justify-center px-[1%] py-[1%]">
      <div className="relative w-full h-full flex flex-col items-center">
        <div className="relative w-full h-fit flex flex-row justify-between items-center">
          <h1 className="text-[#00060e] font-bold font-slant sm-dpr-1:text-[30px] sm-dpr-2:text-[20px] sm-dpr-3:text-[15px] md-dpr-1:text-[50px] md-dpr-2:text-[40px] md-dpr-3:text-[30px] lg-dpr-1:text-[60px] lg-dpr-2:text-[40px] lg-dpr-3:text-[30px] xl-dpr-1:text-[60px] xl-dpr-2:text-[40px] xl-dpr-3:text-[30px] xxl-dpr-1:text-[60px] xxl-dpr-2:text-[50px] xxl-dpr-3:text-[40px] xxxl-dpr-1:text-[60px] xxxl-dpr-2:text-[50px] xxxl-dpr-3:text-[40px]">
            About Me
          </h1>
          <Nav
            one={{ name: "Home", link: "../" }}
            two={{ name: "Projects", link: "../Projects" }}
            third={{ name: "Contact", link: "../Contact" }}
          />
        </div>
        <div className="flex relative rounded-2xl flex-row w-full h-full justify-around items-start gap-x-[10px] py-[20px] px-[10px] bg-gradient-to-br from-[#701610] via-[#400906] to-[#00060e]">
          <div className="relative w-full h-full px-[2px] py-[5px] flex flex-row justify-between gap-[10px] ">
            <div ref={imgRef} className="w-[20%] h-fit self-start ">
              <img
                src="haoran.png"
                style={{ width: "100%", height: `${width / ratio}px` }}
                className=" flex-auto self-center rounded-lg"
              />
            </div>
            <div className="w-[80%] h-full bg-cyber-container bg-no-repeat bg-cover bg-center flex flex-row justify-start items-start px-[5px] py-[10px]">
              <MatrixEffect
                finalText={text}
                speed={30}
                flickerspeed={30}
                text={"introText"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Main;
