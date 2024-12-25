"use client";
import Nav from "@/utility/Nav.js";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import MatrixEffect from "@/utility/randomText.js";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
// import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const Scene = () => {
  const ref = useRef(null);
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(ref.current.offsetWidth, ref.current.offsetHeight);

    ref.current.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0x5ef6ef, 10);
    const pointLight = new THREE.PointLight(0x5ef6ef, 10, 10, 2);
    pointLight.position.set(5, 3, 3);
    const directionalLight = new THREE.DirectionalLight(0x5ef6ef, 20);
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
    outlinePass.edgeStrength = 0.4;
    outlinePass.edgeGlow = 0.5;
    outlinePass.edgeThickness = 0.1;
    outlinePass.visibleEdgeColor.set(0x5ef6ef);
    composer.addPass(outlinePass);

    const loader = new GLTFLoader();
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

        camera.position.z = 4;
        camera.position.y = 5; // controls the height of the camera
        camera.lookAt(0, 2, 0);
      },
      undefined,
      (err) => {
        console.error(err);
      }
    );

    const animate = () => {
      if (model) {
        model.rotation.y += 0.005;
      }

      composer.render();

      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(ref.current.offsetWidth, ref.current.offsetHeight);
      composer.setSize(ref.current.offsetWidth, ref.current.offsetHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (ref.current) {
        ref.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
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
  useEffect(() => {
    fetch("/api/ip")
      .then((res) => res.json())
      .then((data) => {
        setIP(data.ip);
        setOS(data.os);
      })
      .catch((err) => console.error(err));
  }, []);

  const loadingT = "Hacking in ...";
  const intro =
    "I am a studying Maths and Computer Science at Boston University. I have learned the intermediated level of Python, Java, and the basic knowledge of FrontEnd. I am currently a a member of BUCSSA(Boston University Chinese Student Scholar Association) Technological Department, and my job is building web pages and illustrating effects. I am also very thrilled about all the connections to BackEnd, especially building a database with vector search. Feel free to contact me!";
  const [loaded, setLoaded] = useState(false);
  const [done, setDone] = useState(false);

  const loadedCallback = () => {
    setLoaded(true);
  }; // callback for the loaded state

  const doneCallback = () => {
    setDone(true);
  };

  const Sharding = {
    initial: { clipPath: "polygon(0 0, 0 0, 0 0, 0 0 )" },
    shard: {
      clipPath: [
        "polygon(0 0, 0 0, 0 0, 0 0)",
        "polygon(0 0, 100% 0, 0% 100%, 0 100%)",
        "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      ],
      x: [0, -2, 2],
      y: [0, 2, -2],
      z: [0, 0, 0],
      transition: { duration: 2, ease: "easeInOut" },
    },
  };

  const shakeVariants = {
    idle: { x: 0, y: 0 },
    shake: {
      x: [0, -4, 4, -4, 4, 0],
      
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        repeat: 2,
        repeatType: "mirror",
      },
    },
  };
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
        <div className="flex relative  rounded-2xl flex-row w-[60%] h-[80%] justify-around items-start gap-x-[10px] py-[20px] px-[10px] bg-gradient-to-br from-[#701610] via-[#400906] to-[#00060e] overflow-hidden">
          <div className="relative flex flex-col gap-y-[10px] py-[10px] w-[30%] h-full">
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

            <Scene />
          </div>
          <div className=" bg-center bg-cover bg-no-repeat w-[70%] h-full bg-cyber-container  px-[20px] pb-[50px] flex flex-col justify-around ">
            {loaded ? (
              <MatrixEffect
                key={intro}
                finalText={intro}
                speed={30}
                flickerspeed={20}
                callback={doneCallback}
              />
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <MatrixEffect
                  key={loadingT}
                  finalText={loadingT}
                  speed={30}
                  flickerspeed={20}
                  callback={loadedCallback}
                />
              </div>
            )}

            {done ? (
              <motion.div variants={Sharding} initial="initial" animate="shard"  onAnimationComplete={() => setTimeout(() => setShaking(true), 100)}>
                <motion.div className="w-[60%] aspect-[16/9] bg-[url('/map.jpg')] bg-contain bg-center bg-no-repeat rounded-[10px]" variants={shakeVariants} animate={shaking? "shake": "idle"}></motion.div>
              </motion.div>
            ) : null}
            <></>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Main;
