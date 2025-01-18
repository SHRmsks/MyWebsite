"use client";
import Nav from "@/utility/Nav.js";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "motion/react";
import MatrixEffect from "@/utility/randomText.js";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import Room from "@/utility/game.js";
const Scene = () => {
  const ref = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(ref.current.offsetWidth, ref.current.offsetHeight);

    ref.current.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0x5ef6ef, 1);
    const pointLight = new THREE.PointLight(0x5ef6ef, 10, 10, 2);
    pointLight.position.set(5, 3, 3);
    const directionalLight = new THREE.DirectionalLight(0x5ef6ef, 5);
    directionalLight.position.set(10, 10, 10); // Position it above and to the side
    scene.add(directionalLight);

    scene.add(pointLight);
    scene.add(light);

    const composer = new EffectComposer(
      renderer,
      new THREE.WebGLRenderTarget(
        ref.current.offsetWidth,
        ref.current.offsetHeight,
        { format: THREE.RGBAFormat, transparent: true }
      )
    );
    composer.setSize(ref.current.offsetWidth, ref.current.offsetHeight);
    composer.addPass(new RenderPass(scene, camera));

    const outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      scene,
      camera
    );
    outlinePass.edgeStrength = 0.34;
    outlinePass.edgeGlow = 0.35;
    outlinePass.edgeThickness = 0.1;
    outlinePass.visibleEdgeColor.set(0x5ef6ef);
    composer.addPass(outlinePass);
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    const loader = new GLTFLoader();

    camera.position.z = 4;
    camera.position.y = 5;

    camera.lookAt(0, 2, 0);

    let model;
    loader.load(
      "/globe.glb",
      (gltf) => {
        model = gltf.scene;

        model.scale.set(3.5, 3.5, 3.5);
        scene.add(model);
        outlinePass.selectedObjects = [model];
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        model.position.y += model.position.y - center.y;
        model.position.z += model.position.z - center.z;
      },
      undefined,
      (err) => {
        console.error(err);
      }
    );
    let isDragging = false;
    let previous = { x: 0, y: 0 };
    const onMouseDown = (e) => {
      isDragging = true;
      previous = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e) => {
      if (isDragging && model) {
        const dx = e.clientX - previous.x;
        const dy = e.clientY - previous.y;
        model.rotation.y += dx * 0.01;
        model.rotation.x += dy * 0.01;
        previous = { x: e.clientX, y: e.clientY };
      }
    };
    const onMouseUp = () => {
      isDragging = false;
    };
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      if (model) {
        model.rotation.y += 0.005;
        // controller.update()
      }

      composer.render();

      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = ref.current.offsetWidth / ref.current.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(ref.current.offsetWidth, ref.current.offsetHeight);
      composer.setSize(ref.current.offsetWidth, ref.current.offsetHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);

      if (ref.current) {
        ref.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
      camera.dispose();
    };
  }, []);
  return (
    <div
      ref={ref}
      className="h-[200px] w-full bg-[rgba(0,6,14,0.5)] rounded-[20px]"
    ></div>
  );
};

const Main = () => {
  const [IP, setIP] = useState("");
  const [os, setOS] = useState("unknown");
  const [shaking, setShaking] = useState(false);
  const [hover, setHover] = useState(false);
  const [Glitter, setGlitter] = useState("glitter");
  const [LoadingNumber, setLoadingNumber] = useState(-1);
  const [doneL, setDoneL] = useState(false);
  const one = useMemo(() => ({ name: "Projects", link: "./Projects" }), []);
  const two = useMemo(() => ({ name: "About Me", link: "./About" }), []);
  const three = useMemo(() => ({ name: "Contact", link: "./Contact" }), []);
  const [svgContent, setSvgContent] = useState(null);
  const [isFinished, setIsFinished]= useState(false);
  const [loaded, setLoaded] = useState(false);
  const [done, setDone] = useState(false);
  const [initial, setInitial] = useState(true);
  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/ip")
      .then((res) => res.json())
      .then((data) => {
        setIP(data.ip);
        setOS(data.os);
      })
      .catch((err) => console.error(err));

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
        console.log("replaced" + replaced);
        setSvgContent(replaced);
      })
      .catch((error) => console.error("Error loading SVG:", error));
    console.log(svgContent);
    return () => controller.abort();
  }, []);

  const loadingT = useMemo(() => "Hacking in ...", []);
  const loadingN = `Data Breaching: ${LoadingNumber}%`;
  const finishedText = useMemo(() =>"Target position is located...", []);
  const intro = useMemo(
    () => "Target has been initialized\n\nSearching the Map... ",
    []
  );

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

  const Sharding = useMemo(
    () => ({
      initial: { clipPath: "polygon(0 0, 0 0, 0 0, 0 0 )" },
      shard: {
        clipPath: [
          "polygon(0 0, 0 0, 0 0, 0 0)",
          "polygon(0 0, 50% 0, 0 50%, 0 50%)",
          "polygon(0 0, 100% 0, 0% 100%, 0 100%)",
          // "polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 0)",
          "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        ],
        x: [0, 5, -5, 5, 0],
        y: [0, 5, -5, 5, 0],
        z: [0, 0, 0, 0, 0],
        transition: { duration: 0.8, ease: "easeInOut" },
      },
    }),
    []
  );
  const glitter = useMemo(
    () => ({
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
    }),
    []
  );

  const shakeVariants = useMemo(
    () => ({
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
    }),
    []
  );

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

  return (
    initial? <Room />: 

    <div className="relative h-screen w-screen bg-[#FEE801] overflow-auto justify-center px-[1%] py-[1%]">
      <div className="relative w-full h-full">
        <div className="relative w-full h-fit flex flex-row justify-between items-center ">
          <h1 className="text-[#00060e] font-bold font-slant sm-dpr-1:text-[30px] sm-dpr-2:text-[20px] sm-dpr-3:text-[15px] md-dpr-1:text-[50px] md-dpr-2:text-[40px] md-dpr-3:text-[30px] lg-dpr-1:text-[60px] lg-dpr-2:text-[40px] lg-dpr-3:text-[30px] xl-dpr-1:text-[60px] xl-dpr-2:text-[40px] xl-dpr-3:text-[30px] xxl-dpr-1:text-[60px] xxl-dpr-2:text-[50px] xxl-dpr-3:text-[40px] xxxl-dpr-1:text-[60px] xxxl-dpr-2:text-[50px] xxxl-dpr-3:text-[40px]">
            Welcome to Haoran's Website
          </h1>

          <Nav one={one} two={two} third={three} />
        </div>

        {/* the div */}
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
          <div className=" bg-center bg-cover bg-no-repeat w-[70%] h-full bg-cyber-container  px-[20px] pb-[50px] flex flex-col justify-around ">
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
              ) : 
                isFinished? (
                  <MatrixEffect
                  key={finishedText}
                  finalText={finishedText}
                  speed={30}
                  text={"text"}
                  flickerspeed={20}
                 
                />
                ):
              
              
              (
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
              <div className="relative w-full h-auto py-1  gap-x-2">
                <motion.div
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
                    className="relative z-[5] w-[60%]
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
                  <motion.div
                    key={Glitter}
                    className=" absolute flex flex-col justify-center py-4 gap-y-4 items-center text-start top-0 right-[2px] bg-[url('/Card.png')] bg-no-repeat bg-cover bg-center w-[30%] min-w-[200px] h-full z-10"
                    variants={glitter}
                    initial="initial"
                    animate={Glitter}
                  >
                    <p className="text-[12px] font-text text-[#39c4b6] text-wrap break-words">
                      {" "}
                      Info detected: <br />
                    </p>
                    <p className="text-[12px] font-text text-[#39c4b6] text-wrap break-words flex-col ">
                      Name: Haoran <br />
                      Age: 21 <br />
                      Gender: Male <br />
                      Location: China <br />
                      Affiliation: BU <br />
                      Title: Noobie <br />
                    </p>
                  </motion.div>
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
