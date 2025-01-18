"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import "../app/global.css";
import Stats from "three/examples/jsm/libs/stats.module";
import { motion } from "motion/react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import * as Cannon from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
const Room = () => {
  const gameRef = useRef(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const world = new Cannon.World({
      gravity: new Cannon.Vec3(0, -9.81, 0),
    });

    const body = new Cannon.Body({
      mass: 20,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    let model;
    let char; // the character

    const loader = new GLTFLoader();
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    loader.load(
      "/cyberpunkRoom.glb",
      (gltf) => {
        model = gltf.scene;
        const boxBounds = new THREE.Box3().setFromObject(model);

        scene.add(model);
      },
      undefined,
      (err) => {
        console.error(err);
      }
    );
    // if (centerx && centery && centerz) {
    loader.load(
      "/human.glb",
      (gltf) => {
        char = gltf.scene;

        char.scale.set(0.01, 0.01, 0.01);
        scene.add(char);
        const boxBounds = new THREE.Box3().setFromObject(char);
        const center = boxBounds.getCenter(new THREE.Vector3());
        const size = boxBounds.getSize(new THREE.Vector3());
        char.position.set(0, 0, 0);
        body.position.set(char.position.x, char.position.y, char.position.z)
        

        const torso = new Cannon.Cylinder(size.x, size.x, 0.8 * size.y, 8);
        const head = new Cannon.Sphere(0.8 * size.x);
        body.addShape(torso, new Cannon.Vec3(0, 0, 0));
        body.addShape(head, new Cannon.Vec3(0, 0.8 * size.y, 0));
        world.addBody(body); // add the humoid body
        console.log("Model loaded:", char);
        camera.position.set(size.x, center.y + 0.3 * size.y, size.z);
      },
      undefined,
      (err) => {
        console.error(err);
      }
    );

    const axisHelper = new THREE.AxesHelper(10);
    scene.add(axisHelper);
    const cameraHelper = new THREE.CameraHelper(camera);
    scene.add(cameraHelper);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (gameRef.current) {
      gameRef.current.appendChild(renderer.domElement);
    }

    const controls = new PointerLockControls(camera, renderer.domElement);
    const control = new OrbitControls(camera, renderer.domElement);
    control.enableDamping = true;
    control.enableDampingFactor = 0.05;
    control.enableZoom = true;
    control.update();
    let keyDowns = {};
    document.addEventListener("click", () => {
      if (locked === false) controls.lock();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        controls.unlock();
      }

      keyDowns[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
      keyDowns[e.key] = false;
    });
    const Action = () => {
      const speed = 1;
      if (keyDowns["w"]) {
 
        const forwardVector = new Cannon.Vec3(
          Math.sin(camera.rotation.y),
          0,
          -Math.cos(camera.rotation.y)
        );
        forwardVector.normalize();
       forwardVector.scale(speed);

       console.log("Moving forward:", forwardVector);
        body.velocity.set(forwardVector.x, body.velocity.y, forwardVector.z);
        console.log("Body velocity:", body.velocity);

      }
    };

    controls.addEventListener("lock", () => {
      console.log("controls+ " + controls.isLocked);
    });

    controls.addEventListener("unlock", () => {
      console.log("controls+ " + controls.islocked);
    });
    controls.enableDamping = true;

    controls.enableDamping = 0.05;
    controls.update();

    const animate = () => {
      world.fixedStep(1 / 60);
      Action();
      if (char && body) {
        char.position.set(body.position.x, body.position.y, body.position.z);
        char.quaternion.set(
          body.quaternion.x,
          body.quaternion.y,
          body.quaternion.z,
          body.quaternion.w
        );
      }

      renderer.render(scene, camera);

  
      requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (ref.current) {
        ref.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      camera.dispose();
    };
  }, []);

  return <div className="w-screen h-screen relatvie" ref={gameRef}></div>;
};
export default Room;
