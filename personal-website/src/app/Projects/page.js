"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Nav from "@/utility/Nav.js";
import { motion } from "motion/react";
import SkillTree from "@/utility/SkillTree";
import TreeMap from "@/utility/TreeMap";
import SkillWeb from "@/utility/skillDiagram";

const Main = () => {
  const skills = [
    "FrontEnd",
    "BackEnd",
    "Database",
    "Design",
    "Management",
    "Algorithm",
    "Machine Learning",
    "UI",
    "Coding",
  ];
  const vals = [8, 6, 5, 4, 4, 6, 5, 4, 7];

  const glitter = {
    initial: { opacity: 0 },
    glitter: {
      opacity: [0, 0.4, 0.3, 0.6, 0.4, 0.8, 1],
      x: [0, -1, 1, -2, 2, -1, 0],
      y: [0, -1, 1, -2, 2, -1, 0],
      transition: {
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
    static: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  const [Glitter, setGlitter] = useState("glitter");
  const one = { name: "Home", link: "../" };
  const two = { name: "About Me", link: "/About" };
  const three = { name: "Contact", link: "/Contact" };

  useEffect(() => {
    const glitterEffect = setTimeout(() => {
      setGlitter("static");
    }, 3000);
    return () => clearTimeout(glitterEffect);
  }, []);
  const MobileSkills = {
    frontEndPTS: 7,
    backEndPTS: 6,
    databasePTS: 4,
    designPTS: 2,
    managementPTS: 3,
    algoPTS: 0,
  };

  const Hackthon = {
    frontEndPTS: 5,
    backEndPTS: 5,
    databasePTS: 0,
    designPTS: 2,
    managementPTS: 1,
    algoPTS: 7,
  };

  const srcarr = ["/skill1.png", "/skill2.png", "/skill3.png"];
  const labelarr = ["Skill Tree", "Flutter", "React Native"];
  const props = [
    {},
    {
      local: true,
      pjName: "Work Shift Management",
      link: "/demo.mp4",
      skills: MobileSkills,
      framework: "Flutter",
      Icon: "/flutter.svg",
      intro: "An easy team-managemnt App that derived from website",
    },
    {
      local: false,
      skills: Hackthon,
      link: "https://www.youtube.com/embed/ysVSmk_bnWM",
      pjName: "Recycle Master",
      framework: "React Native",
      Icon: "/react.svg",
      intro:
        "A recyclable detection mobile App that is powered with YOLO_8 in 24hrs",
    },
  ];

  const parentRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const update = useCallback(() => {
    if (parentRef.current) {
      setHeight(parentRef.current.offsetHeight);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return (
    <div className="relative h-screen  w-screen bg-[#FEE801] overflow-auto flex-col justify-between items-center px-[1%] pt-[1%] m-0">
      <div className="relative w-full h-fit max-h-[20%] flex flex-row justify-between items-center">
        <h1 className="text-[#00060e] font-bold font-slant sm-dpr-1:text-[30px] sm-dpr-2:text-[20px] sm-dpr-3:text-[15px] md-dpr-1:text-[50px] md-dpr-2:text-[40px] md-dpr-3:text-[30px] lg-dpr-1:text-[60px] lg-dpr-2:text-[40px] lg-dpr-3:text-[30px] xl-dpr-1:text-[60px] xl-dpr-2:text-[40px] xl-dpr-3:text-[30px] xxl-dpr-1:text-[60px] xxl-dpr-2:text-[50px] xxl-dpr-3:text-[40px] xxxl-dpr-1:text-[60px] xxxl-dpr-2:text-[50px] xxxl-dpr-3:text-[40px]">
          Projects
        </h1>
        <Nav one={one} two={two} third={three} />
      </div>

      <div
        ref={parentRef}
        className="bg-[url('/background.png')] z-0 relative bg-cover h-[90%] overflow-auto flex-1 w-full bg-no-repeat rounded-lg bg-center  px-[5px] py-[8px] flex flex-col justify-between gap-y-[10px]"
      >
        {isReady && (
          <div style={{ height: `${height}px` }} className="w-full z-10">
            <TreeMap srcArr={srcarr} labelArr={labelarr} props={props} />
          </div>
        )}
        <div className="bottom-0 right-0 absolute w-[400px] h-[200px] z-20 bg-[url('/background.png')] backdrop-opacity-[30px] backdrop-blur-md rounded-md bg-no-repeat bg-fixed bg-cover bg-center">
          <motion.div
            variants={glitter}
            initial="initial"
            animate={Glitter}
            className="bottom-[5px] right-0 absolute  max-w-[100px] lg:max-w-[300px] xl:max-w-[400px] md:max-w-[200px] sm:max-w-[150px] h-fit z-30 items-center "
          >
            <SkillWeb skills={skills} vals={vals} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default Main;
