"use client";
import React, { useEffect, useState, useRef } from "react";
import Nav from "@/utility/Nav.js";
import { motion } from "motion/react";
import SkillTree from "@/utility/SkillTree";
const Main = () => {
  const MobileSkills = {
    frontEndPTS: 7,
    backEndPTS: 6,
    databasePTS: 4,
    designPTS: 2,
    managementPTS: 3,
    algoPTS: 0,
  }
  return (
    <div className="relative h-screen  w-screen bg-[#FEE801] justify-center px-[1%] pt-[1%]">
      <div className="relative w-full h-fit flex flex-row justify-between xl:px-20">
        <h1 className="text-[#00060e] text-[60px] font-bold font-slant">
          Projects
        </h1>
        <Nav
          one={{ name: "Home", link: "../" }}
          two={{ name: "About me", link: "../About" }}
          third={{ name: "Contact", link: "../Contact" }}
        />
      </div>
      <SkillTree link={"/demo.mp4"} skills={MobileSkills} />
    </div>
  );
};
export default Main;
