"use client";
import React, { useState, useEffect } from "react";
import "../app/global.css";
import { motion } from "motion/react";
import Text from "./text";
const SKdiv = ({ local, pjName, pjLink, skills, framework, Icon, intro }) => {
  const [ratio, setRatio] = useState(null);
  const [ratio2, setRatio2] = useState(null);

  useEffect(() => {
    const img = new Image();
    const img2 = new Image();
    const img3 = new Image();
    img3.src = Icon;
    // console.log("icon", Icon);
    img.src = "/skillT1.png";
    img2.src = "/int.png";
    img.onload = () => {
      setRatio(img.naturalWidth / img.naturalHeight);
    };
    img2.onload = () => {
      setRatio2(img2.naturalWidth / img2.naturalHeight);
    };
  }, [ratio, ratio2]);
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
    let LoadEffect = null; 
    if (!load) {
     LoadEffect = setTimeout(() => {
        setLoad(true);
      }, 800);
    }
    if (LoadEffect) clearTimeout(LoadEffect);
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
            <div className="relative w-[90%] h-[90%] flex flex-col justify-center items-center">
              <Text Title={"Project Name: "} text={pjName} size={"10px"} />
              <>
                <Text
                  Title={"Framework: "}
                  size={"12px"}
                  text={framework}
                  icon={Icon}
                />
                <p className="text-[#39c4b6] m-0 text-[10px] font-text text-start text-wrap break-words drop-shadow-text_bottom">
                  {intro}
                </p>
              </>
              <Text
                Title={"Attributes of SkillPoints"}
                size={"10px"}
                text={`Front-end: ${frontEndPTS}\nBack-end: ${backEndPTS}\nDatabase: ${databasePTS}\nDesign: ${designPTS}\nManagement: ${managementPTS}\nAlgorithms: ${AlgoPTS}\n`}
              />

              <img
                src="/int.png"
                style={{ height: ratio2 ? `${20 / ratio2}px` : `auto` }}
                className="w-[20px] "
              />
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
            {isPreview && local && (
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
            {isPreview && !local && (
              <iframe
                
                src={pjLink}
                title={"pjName"}
                className="w-[90%] h-[90%] py-1 ob"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};
const SkillTree = ({ link, skills, framework, Icon, intro, pjName, local }) => {
  return (
    <SKdiv
      local={local}
      pjName={pjName}
      pjLink={link}
      skills={skills}
      framework={framework}
      Icon={Icon}
      intro={intro}
    />
  );
};
export default SkillTree;
