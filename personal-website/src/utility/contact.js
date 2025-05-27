"use client";
import React, { useMemo } from "react";
import "../app/global.css";
import { motion } from "motion/react";

import Image from "next/image";
import Link from "next/link"
const Link1 = ({ name, icon, link }) => {
  const transition ={
      initial: {
        scale: 0.8,
        opacity: 0.6,
        x: 0,
        y: 0,
      },
      animate: {
        scale: 1,
        opacity: 1,
        x: 0,
        y: 0,

        transition: { ease: "easeInOut", duration: 0.6 },
      },
      hover: {
        scale: 1.2,
        x: 0,
        y: 0,
        boarderRadius: "0px",
        transition: { ease: "easeInOut", duration: 0.3 },
      },
    };
  return (
    <motion.div
      variants={transition}
      whileHover="hover"
      initial="initial"
      animate="animate"
      className="relative w-[50px] h-[50px] flex flex-1 flex-col justify-around gap-y-[3px] rounded-lg "
    >
      <Link rel="noopener noreferer" target="_blank" href={link} className="w-full h-full hover:cursor-pointer">
        <Image width={50} src={icon} alt={name} className="flex justify-self-center" />
      </Link>
      <p className="font-text text-center break-words text-[10px] text-[#FEE801]">{name}</p>
    </motion.div>
  );
};
export default Link1;
