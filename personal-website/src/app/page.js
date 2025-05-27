"use client";
import Nav from "@/utility/Nav.js";
import React, { useEffect, useState, useRef, useMemo, Suspense, useCallback } from "react";
import { motion } from "motion/react";
import MatrixEffect from "@/utility/randomText.js";

import Room from "@/utility/game.js";
import Scene from "@/utility/room";

const Main = () => {
  const [IP, setIP] = useState("");
  const [os, setOS] = useState("unknown");
  const [shaking, setShaking] = useState(false);
  const [hover, setHover] = useState(false);
  const [Glitter, setGlitter] = useState("glitter");
  const [LoadingNumber, setLoadingNumber] = useState(-1);
  const [doneL, setDoneL] = useState(false);
  const one = { name: "Projects", link: "./Projects" };
  const two = { name: "About Me", link: "./About" };
  const three = { name: "Contact", link: "./Contact" };
  const [svgContent, setSvgContent] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [done, setDone] = useState(false);
  const [initial, setInitial] = useState(true);
  const [small, setSmall] = useState(false);
  
  const clickHandler = useCallback(() => {
    setInitial(false);
  },[]);
  useEffect(() => {
    const handleResize = () => {
      setSmall(window.innerWidth < 640);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  },[])
  useEffect(() => {
    
    const controller = new AbortController();

    const signal = controller.signal;
    (async () => {
      const res = await fetch("/api/ip", { signal: signal });
      const data = await res.json();
      try {
        if (data) {
          // console.log(data);
          setIP(data.ip);
          setOS(data.os);
        }
      } catch (err) {
        setIP("unavaliable");
        setOS("unavaliable");
        console.error(err);
      }
    })();

    fetch("/world.svg")
      .then((response) => response.text())
      .then((data) => {
        let replaced = data
          .replace(/width="[\d.]+"/, `width="100%"`)
          .replace(/height="[\d.]+"/, `height="100%"`)
          .replace(
            /<svg/,
            `<svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 1009.6727 665.96301"`
          );
        replaced = replaced.replace(
          /(<path[^>]*\sid=["']CN["'][^>]*)(\/>)/i,
          `$1 style="transform-box: fill-box; transform-origin: center;">
  <animate
    attributeName="fill"
    values="#5ecaeb;#020230;#5ecaeb"
    dur="2s"
    repeatCount="indefinite"
  />
  <animateTransform
    attributeName="transform"w
    attributeType="XML"
    type="scale"
    values="1;1.1;1"
    dur="2s"
    additive="replace"
    repeatCount="indefinite"
  />
  </path>`
        );
        setSvgContent(replaced);
      })
      .catch((error) => console.error("Error loading SVG:", error));
    console.log(svgContent);
    return () => controller.abort();
  }, []);

  const loadingT = "Hacking in ...";
  const loadingN = `Data Breaching: ${LoadingNumber}%`;
  const finishedText = "Target position is located...";
  const intro = "Target has been initialized\n\nSearching the Map... ";

  const loadedCallback = () => {
    setLoaded(true);
    loadingNumberHandler();
  }; // callback for the loaded state

  const loadingNumberHandler = () => {
    if (!doneL) {
      const interval = setInterval(() => {
        setLoadingNumber((prev) => {
          if (prev < 100) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => setDoneL(true), 2000);
            return prev;
          }
        });
      }, 50);
    }
  };

  const doneCallback = () => {
    setDone(true);
    setIsFinished(true);
  };

  const Sharding = {
    initial: { clipPath: "polygon(0 0, 0 0, 0 0, 0 0 )" },
    shard: {
      clipPath: [
        "polygon(0 0, 0 0, 0 0, 0 0)",
        "polygon(0 0, 50% 0, 0 50%, 0 50%)",
        "polygon(0 0, 100% 0, 0% 100%, 0 100%)",
       
        "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      ],
      x: [0, 5, -5, 5, 0],
      y: [0, 5, -5, 5, 0],
      z: [0, 0, 0, 0, 0],
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };
  const glitter = {
    initial: { opacity: 0 },
    glitter: {
      opacity: [0, 0.3, 0.2, 0.5, 0.3, 0.8, 1],
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

  const shakeVariants = {
    idle: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    shake: {
      opacity: [0, 0.3, 0.6, 0.5, 0.3, 0.8, 1],
      x: [0, -1, 1, -2, 2, -1, 0],
      y: [0, -1, 1, -2, 2, -1, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  useEffect(() => {
    let glitterTimeout = null;
    let shakingTimeout = null;
    if (hover) {
      glitterTimeout = setTimeout(() => {
        setGlitter("static");
      }, 1000);
    } else {
      setGlitter("glitter");
    }
    if (shaking) {
      shakingTimeout = setTimeout(() => {
        setShaking(false);
      }, 600);
    }
    return () => {
      if (glitterTimeout) clearTimeout(glitterTimeout);
      if (shakingTimeout) clearTimeout(shakingTimeout);
    };
  }, [hover, shaking, doneL]);

  return initial && !small ? (
    <Room clickHandler={clickHandler} />
  ) : (
    <div className="relative h-screen w-screen bg-[#FEE801] overflow-auto justify-center px-[1%] py-[1%]">
      <div className="relative w-full h-full">
        <div className="relative w-full h-fit flex flex-row justify-between items-center ">
          <h1 className="text-[#00060e] font-bold font-slant sm-dpr-1:text-[30px] sm-dpr-2:text-[20px] sm-dpr-3:text-[15px] md-dpr-1:text-[50px] md-dpr-2:text-[40px] md-dpr-3:text-[30px] lg-dpr-1:text-[60px] lg-dpr-2:text-[40px] lg-dpr-3:text-[30px] xl-dpr-1:text-[60px] xl-dpr-2:text-[40px] xl-dpr-3:text-[30px] xxl-dpr-1:text-[60px] xxl-dpr-2:text-[50px] xxl-dpr-3:text-[40px] xxxl-dpr-1:text-[60px] xxxl-dpr-2:text-[50px] xxxl-dpr-3:text-[40px]">
            Welcome to Haoran's Website
          </h1>

          <Nav one={one} two={two} third={three} />
        </div>

        <div className="flex relative  rounded-2xl flex-row w-full h-full flex-1 overflow-auto justify-around items-start gap-x-[10px] py-[20px] px-[10px] bg-gradient-to-br from-[#701610] via-[#400906] to-[#00060e]">
          <div className="relative flex flex-col gap-y-[10px] py-[10px] w-[30%] h-full">
            <div className="bg-contain bg-no-repeat bg-center w-[80px] h-[80px] bg-[url('/deco.png')]"></div>

            <MatrixEffect
              finalText={IP ? `IP detected: ${IP}` : ""}
              speed={50}
              text={"text"}
              flickerspeed={30}
            ></MatrixEffect>

            <MatrixEffect
              finalText={IP ? `OS detected: ${os}` : ""}
              speed={50}
              text={"text"}
              flickerspeed={30}
            ></MatrixEffect>

            <Scene />
          </div>
          <div className=" bg-center bg-cover bg-no-repeat w-[70%] h-full bg-cyber-container  px-[20px] pb-[50px] flex flex-col justify-center items-start sm:gap-y-[20px] md:gap-y-[30px] xl:gap-y-[60px] ">
            {loaded ? (
              !doneL ? (
                <div className="flex w-fit h-fit gap-y-2 flex-col items-center self-center text-center text-[#18d95f] font-glitch text-[20px]">
                  {loadingN}
                  <motion.div className="relative w-[200px] h-[15px] border-2 border-[#39c4b6] bg-transparent z-[1] p-[1px] overflow-hidden ">
                    <div
                      style={{
                        width: `${LoadingNumber}%`,
                        transition: "width 0.3s ease",
                      }}
                      className=" z-[2] h-full bg-[#39c4b6]"
                    ></div>
                  </motion.div>
                </div>
              ) : isFinished ? (
                <MatrixEffect
                  key={finishedText}
                  finalText={finishedText}
                  speed={30}
                  text={"text"}
                  flickerspeed={20}
                />
              ) : (
                <MatrixEffect
                  key={intro}
                  finalText={intro}
                  speed={30}
                  text={"text"}
                  flickerspeed={20}
                  callback={doneCallback}
                />
              )
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <MatrixEffect
                  key={loadingT}
                  text={"text"}
                  finalText={loadingT}
                  speed={30}
                  flickerspeed={20}
                  callback={loadedCallback}
                />
              </div>
            )}

            {done ? (
              <div className="relative flex flex-row w-full h-auto py-1 gap-x-2">
                <motion.div
                  className="w-2/3 h-fit"
                  variants={Sharding}
                  initial="initial"
                  animate="shard"
                  onAnimationComplete={() =>
                    setTimeout(() => setShaking(true), 100)
                  }
                >
                  <motion.div
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    className="relative z-[5] w-full
         bg-contain bg-center bg-no-repeat rounded-[10px] border border-blue-500  shadow-bottom"
                    variants={shakeVariants}
                    animate={shaking ? "shake" : "idle"}
                  >
                    {svgContent && (
                      <div
                        className="overflow-auto overflow-x-auto flex-1 justify-center items-center"
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                      />
                    )}
                  </motion.div>
                </motion.div>
                {hover && (
                  <div className="flex flex-col justify-center items-center w-1/3 h-full">
                    <motion.div
                      key={Glitter}
                      className="  flex flex-col justify-center py-4 gap-y-4 items-center text-start  bg-[url('/Card.png')] bg-no-repeat bg-cover bg-center w-full  h-full z-10"
                      variants={glitter}
                      initial="initial"
                      animate={Glitter}
                    >
                      <p className="text-[5px] sm:text-[8px] md:text[10px] lg:text[12px] xl:text[14px] font-text text-[#39c4b6] text-wrap break-words">
                        Info detected: <br />
                      </p>
                      <p className="text-[5px] sm:text-[8px] md:text[10px] lg:text[12px] xl:text[14px] font-text text-[#39c4b6] text-wrap break-words flex-col ">
                        Name: Haoran <br />
                        Age: 21 <br />
                        Gender: Male <br />
                        Location: China <br />
                        Affiliation: BU <br />
                        Title: Noobie <br />
                      </p>
                    </motion.div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Main;
