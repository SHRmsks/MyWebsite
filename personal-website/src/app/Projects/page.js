"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Nav from "@/utility/Nav.js";
import { motion } from "motion/react";
import SkillTree from "@/utility/SkillTree";
import TreeMap from "@/utility/TreeMap";
import SkillWeb from "@/utility/skillDiagram";

const Main = () => {
  const skills = useMemo(
    () => [
      "FrontEnd",
      "BackEnd",
      "Database",
      "Design",
      "Management",
      "Algorithm",
      "Machine Learning",
      "UI",
      "Coding",
    ],
    []
  );
  const vals = useMemo(() => [8, 6, 5, 4, 4, 6, 5, 4, 7], []);

  const glitter = useMemo(
    () => ({
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
    }),
    []
  );
  const [Glitter, setGlitter] = useState("glitter");
  const one = useMemo(() => ({ name: "Home", link: "../" }), []);
  const two = useMemo(() => ({ name:  "About Me", link: "/About" }), []);
  const three = useMemo(() => ({ name: "Contact", link: "/Contact" }), []);

  useEffect(() => {
    const glitterEffect = setTimeout(() => {
      setGlitter("static");
    }, 3000);
    return () => clearTimeout(glitterEffect);
  }, []);
  const MobileSkills = useMemo(
    () => ({
      frontEndPTS: 7,
      backEndPTS: 6,
      databasePTS: 4,
      designPTS: 2,
      managementPTS: 3,
      algoPTS: 0,
    }),
    []
  );
  const Hackthon = useMemo(
    () => ({
      frontEndPTS: 5,
      backEndPTS: 5,
      databasePTS: 0,
      designPTS: 2,
      managementPTS: 1,
      algoPTS: 7,
    }),
    []
  );

  const srcarr = useMemo(() => ["/react.svg", "/react.svg", "/react.svg"], []);
  const labelarr = useMemo(() => ["Skill Tree", "react", "react"], []);
  const props = useMemo(
    () => [
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
    ],
    []
  );
  const parentRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const update = useCallback(() => {
    if (parentRef.current) {
      // console.log('parent '+ parentRef.current.offsetHeight )
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
        className="bg-[url('/background.png')] relative bg-cover h-[90%] overflow-auto flex-1 w-full bg-no-repeat rounded-lg bg-center  px-[5px] py-[8px] flex flex-col justify-between gap-y-[10px]"
      >
        {isReady && (
          <div style={{ height: `${height}px` }} className="w-full z-0">
            <TreeMap srcArr={srcarr} labelArr={labelarr} props={props} />
          </div>
        )}
        <div className="bottom-0 right-0 absolute w-[20%] h-[20%] z-10 bg-black backdrop-opacity-[30px] backdrop-blur-md rounded-md">
          <motion.div
            variants={glitter}
            initial="initial"
            animate={Glitter}
            className="bottom-[5px] right-0 absolute w-fit h-fit z-20 bg-[url('/background.png')] backdrop-blur-sm backdrop-opacity-20 rounded-md flex justify-center bg-no-repeat bg-center items-center "
          >
            <SkillWeb skills={skills} vals={vals} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default Main;
