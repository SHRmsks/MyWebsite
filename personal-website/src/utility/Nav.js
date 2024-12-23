
"use client";
import React from 'react';
import "../app/global.css";





const Nav = () => {
    return (
      <div className="xl:w-[40%] xl:relative xl:h-[80px] flex flex-col justify-around gap-y-2 px-[10px] ">
        <div className="  flex flex-row justify-end items-center">
          <div className=" absolute flex flex-row w-[80%] justify-evenly gap-x-2 right-0 py-3">
            <a className="text-center text-nowrap font-cyberpunk text-[20px] text-[#54c1e6]" href="./About">
              {" "}
              About Me
            </a>
            <a className="text-center text-nowrap font-cyberpunk text-[20px] text-[#54c1e6]" href="./Projects">
              Projects
            </a>
            <a className="text-center text-nowrap font-cyberpunk text-[20px] text-[#54c1e6]" href = "./Contact">
              {" "}
              Contact me
            </a>
          </div>
        </div>
        <div className="border-b-[4px] border-[#54c1e6]"></div>
      </div>
    );
  };
  export default Nav;
  