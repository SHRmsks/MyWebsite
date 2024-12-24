"use client";
import Nav from "@/utility/Nav.js";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import MatrixEffect from "@/utility/randomText.js";
import * as THREE from "three";


const Scene = () => {
  const ref = useRef(null);
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z= 5;
  const renderer = new THREE.WebGLRenderer();

}



const Main = () => {
  const [IP, setIP] = useState("");
  const [os, setOS] = useState("unknown"); 
  useEffect(() => {
    fetch("/api/ip")
      .then((res) => res.json())
      .then((data) => {setIP(data.ip); setOS(data.os);})
      .catch((err) => console.error(err));
     
  }, []);

  const loadingT = "Hacking in ...";
  const intro =
    "I am a studying Maths and Computer Science at Boston University. I have learned the intermediated level of Python, Java, and the basic knowledge of FrontEnd. I am currently a a member of BUCSSA(Boston University Chinese Student Scholar Association) Technological Department, and my job is building web pages and illustrating effects. I am also very thrilled about all the connections to BackEnd, especially building a database with vector search. Feel free to contact me!";
  const [loaded, setLoaded] = useState(false);
  const loadedCallback = () => {
    setLoaded(true);
  }; // callback for the loaded state
  return (
    <div className="relative h-screen  w-screen bg-[#FEE801] justify-center px-[1%] pt-[1%]">
      <div className="relative w-full h-full">
        <div className="relative w-full h-fit flex flex-row justify-between xl:px-20">
          <h1 className="text-[#00060e] text-[60px] font-bold font-slant">
            Welcome to Haoran's Website
          </h1>
          <Nav />
        </div>

        {/* the div */}
        <div className="flex relative  rounded-2xl flex-row w-[50%] h-[80%] justify-around items-start gap-x-[10px] py-[20px] px-[10px] bg-gradient-to-br from-[#701610] via-[#400906] to-[#00060e] overflow-hidden">
          <div className="flex flex-col gap-y-[10px] py-[10px] w-[20%] h-full">
            <div className="bg-contain bg-no-repeat bg-center w-[80px] h-[80px] bg-[url('/deco.png')]"></div>

            <MatrixEffect
              finalText={IP ? `user detected: ${IP}` : ""}
              speed={50}
              flickerspeed={30}
            ></MatrixEffect>

             <MatrixEffect
              finalText={IP ? `OS detected: ${os}` : ""}
              speed={50}
              flickerspeed={30}
            ></MatrixEffect>

          </div>
          <div className=" bg-center bg-cover bg-no-repeat w-[80%] h-full bg-cyber-container  px-[20px] pb-[50px] flex flex-row justify-center ">
            {loaded ? (
              <MatrixEffect
                key={intro}
                finalText={intro}
                speed={30}
                flickerspeed={20}
              />
            ) : (
              <MatrixEffect
                key={loadingT}
                finalText={loadingT}
                speed={30}
                flickerspeed={20}
                callback={loadedCallback}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Main;
