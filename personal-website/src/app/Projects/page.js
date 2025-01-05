"use client";
import React, { useEffect, useState, useRef } from "react";
import Nav from "@/utility/Nav.js";
import { motion } from "motion/react";
import SkillTree from "@/utility/SkillTree";
import TreeMap from "@/utility/TreeMap";
import SkillWeb from "@/utility/skillDiagram";

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
const vals = [8,6,5,4,4,6,5,4,7];

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
const Main = () => {
  const [Glitter,setGlitter] = useState('glitter');
  useEffect(
    () => {
      setTimeout(() => {
        setGlitter('static');
      }, 3000);
    },[]
  );
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

  return (
    <div className="relative h-screen  w-screen bg-[#FEE801] justify-center px-[1%] pt-[1%] m-0">
      <div className="relative w-full h-fit max-h-[20%] flex flex-row justify-between items-center ">
        <h1 className="text-[#00060e] font-bold font-slant sm-dpr-1:text-[30px] sm-dpr-2:text-[20px] sm-dpr-3:text-[15px] md-dpr-1:text-[50px] md-dpr-2:text-[40px] md-dpr-3:text-[30px] lg-dpr-1:text-[60px] lg-dpr-2:text-[40px] lg-dpr-3:text-[30px] xl-dpr-1:text-[60px] xl-dpr-2:text-[40px] xl-dpr-3:text-[30px] xxl-dpr-1:text-[60px] xxl-dpr-2:text-[50px] xxl-dpr-3:text-[40px] xxxl-dpr-1:text-[60px] xxxl-dpr-2:text-[50px] xxxl-dpr-3:text-[40px]">
          Projects
        </h1>
        <Nav
          one={{ name: "Home", link: "../" }}
          two={{ name: "About me", link: "../About" }}
          third={{ name: "Contact", link: "../Contact" }}
        />
      </div>
      <div className="bg-[url('/background.png')] relative bg-cover h-[80%] flex-grow w-full bg-no-repeat rounded-lg bg-center  px-[5px] py-[8px] flex flex-col justify-around gap-y-[10px]">
        {/* <SkillTree local={true} pjName={'Work Shift Management'} link={"/demo.mp4"} skills={MobileSkills} framework={'Flutter'} Icon={"/flutter.svg"} intro={'An easy team-managemnt App that derived from website'}/>
      
      
      
      <SkillTree  local={false} skills={Hackthon} link={'https://www.youtube.com/embed/ysVSmk_bnWM'} pjName={'Recycle Master'} framework={'React Native'} Icon={'/react.svg'} intro={'A recyclable detection mobile App that is powered with YOLO_8 in 24hrs'}/>
        */}
          <div className='w-full h-[500px] z-0'>
        <TreeMap />
        </div>
        <motion.div 
        variants={glitter}
        initial="initial"
          animate={Glitter}
        className="bottom-0 right-0 absolute w-fit h-fit z-20 bg-[url('/background.png')] flex justify-center bg-no-repeat bg-center items-center ">
          <SkillWeb skills={skills} />
        </motion.div>
      </div>
    </div>
  );
};
export default Main;
