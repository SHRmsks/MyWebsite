"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import Nav from "@/utility/Nav.js";
import { motion } from "motion/react";

const Main = () => {
  const one = useMemo(() => ({ name: "Home", link: "../" }), []);
  const two = useMemo(() => ({ name: "Projects", link: "../Projects " }), []);
  const three = useMemo(() => ({ name: "About me", link: "../About" }), []);
  return (
    <div className="relative h-screen  w-screen bg-[#FEE801] justify-center px-[1%] pt-[1%]">
      <div className="relative w-full h-fit flex flex-row justify-between xl:px-20">
        <h1 className="text-[#00060e] text-[60px] font-bold font-slant">
          Projects
        </h1>
        <Nav
          one={one}
          two={two}
          third={three}
        />
      </div>
    </div>
  );
};
export default Main;
