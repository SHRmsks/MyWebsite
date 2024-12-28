"use client";
import React, { useState, useEffect } from "react";
import "../app/global.css";
import { motion } from "motion/react";
import Text from "./text";
const SKdiv = ({ pjName, pjLink, skills }) => {
  const [ratio, setRatio] = useState(null);
  useEffect(() => {
    const img = new Image();
    img.src = "/skillT1.png";
    img.onload = () => {
      setRatio(img.naturalWidth / img.naturalHeight);
    };
  }, [ratio]);
  const [load, setLoad] = useState(false);
  const glitter = {
    initial: {
      opacity: 0,
      x: 0,
    },
    glitter: {
      opacity: [0.1, 0.3, 0.5, 0.5, 0.7, 0.8],
      x: [0.1, 0.3, -0.3, -0.1, 0.2, 0],
      y: 0,
      transition: {
        repeat: Infinity,
        duration: 0.8,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };
  useEffect(() => {
    if (!load) {
      setTimeout(() => {
        setLoad(true);
      }, 800);
    }
  }, [load]);

  const [tap, setTap] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const Taphandler = () => {
    setTap(true);
  };
  const VideoAnimation = {
    initial: { opacity: 0, scale: 0 },
    animate: {
      opacity: 1,
      scale: 1.1,

      transition: {
        duration: 0.8,

        ease: "easeInOut",
      },
    },
  };
  const keydownHandler = (e) => {
    if (e.key == "Escape") {
      setTap(false);
    }
  };
  // const HoverHandler = ()=> {

  // }
  useEffect(() => {
    if (tap) {
      window.addEventListener("keydown", keydownHandler);
    }
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [tap]);
  const frontEndPTS = skills.frontEndPTS || 0;
  const backEndPTS = skills.backEndPTS || 0;
  const databasePTS = skills.databasePTS || 0;
  const designPTS = skills.designPTS || 0;
  const managementPTS = skills.managementPTS || 0;
  const AlgoPTS = skills.algoPTS || 0;


  return (
    <>
      {ratio && (
        <div
          style={{ height: ratio ? `${500 / ratio}px` : "auto" }}
          className="z-0 relative bg-[url('/skillT1.png')] flex flex-row justify-center items-start bg-no-repeat bg-contain bg-center w-[500px]  overflow-hidden"
        >
          <motion.div
            variants={glitter}
            initial="initial"
            animate={load ? "exit" : "glitter"}
            whileHover={"glitter"}
            onTap={Taphandler}
            // onHoverStart={HoverHandler}
            // onHoverEnd={EndHandler}
            className="flex flex-row justify-center items-center w-[60%] h-[90%]  "
          >
            <div className="relative w-[90%] h-[90%] flex flex-col justify-around items-center sm:py-3">
              <Text Title={"Project Name: "} text={pjName} />
              <Text Title={"Attributes of SkillPoints"} text={
               `Front-end: 7\nBack-end: 6\nDatabase: 4\nDesign: 2\nManagement: 3\nAlgorithms: 0`
              }/>

              <div className="self-center bg-[url('/int.png')] bg-no-repeat bg-contain w-[20px] h-[20px]"></div>
            </div>
          </motion.div>
        </div>
      )}
      {tap && (
        <div
          onClick={() => setTap(false)}
          className="bg-opacity-30 backdrop-blur-md bg-slate-400 flex absolute inset-0 z-10 w-full h-full justify-center items-center rounded-sm"
        >
          <motion.div className="w-[80%] flex justify-center items-center h-[80%] z-20 rounded-md overflow-hidden">
            {isPreview && (
              <motion.video
                src={pjLink}
                autoPlay
                autoFocus
                controls
                className="w-[90%] h-[90%] py-1 object-contain"
                variants={VideoAnimation}
                initial="initial"
                animate="animate"
              ></motion.video>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};
const SkillTree = ({link, skills}) => {
  return (
    <div className="bg-[url('/background.png')] bg-cover h-full w-full bg-no-repeat  bg-center flex rounded-sm px-2 py-[5px]">
      <SKdiv pjName={"Work Shifts Management"} pjLink={link} skills={skills}/>
    </div>
  );
};
export default SkillTree;
