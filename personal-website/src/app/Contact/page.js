"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import Nav from "@/utility/Nav.js";
import { motion } from "motion/react";
import Link from "@/utility/contact.js";
const Main = () => {
  const one = useMemo(() => ({ name: "Home", link: "../" }), []);
  const two = useMemo(() => ({ name: "Projects", link: "../Projects " }), []);
  const three = useMemo(() => ({ name: "About me", link: "../About" }), []);
  return (
    <div className="relative h-screen  w-screen bg-[#FEE801] justify-center px-[1%] pt-[1%] overflow-auto">
      <div className="relative w-full h-fit flex flex-row justify-between xl:px-20">
        <h1 className="text-[#00060e] font-bold font-slant sm-dpr-1:text-[30px] sm-dpr-2:text-[20px] sm-dpr-3:text-[15px] md-dpr-1:text-[50px] md-dpr-2:text-[40px] md-dpr-3:text-[30px] lg-dpr-1:text-[60px] lg-dpr-2:text-[40px] lg-dpr-3:text-[30px] xl-dpr-1:text-[60px] xl-dpr-2:text-[40px] xl-dpr-3:text-[30px] xxl-dpr-1:text-[60px] xxl-dpr-2:text-[50px] xxl-dpr-3:text-[40px] xxxl-dpr-1:text-[60px] xxxl-dpr-2:text-[50px] xxxl-dpr-3:text-[40px]">
          Contact Me
        </h1>
        <Nav
          one={one}
          two={two}
          third={three}
        />
      </div >
        <div className="overflow-auto flex-1 bg-[url('/background.png')] w-full h-full justify-center items-start py-[20px] px-[10px] rounded-2xl flex-row ">

          <Link name="Github" link ="https://github.com/SHRmsks" icon="github.svg"/>
        </div>


    </div>
  );
};
export default Main;
