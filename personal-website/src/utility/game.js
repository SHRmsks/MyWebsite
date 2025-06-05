"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import "../app/global.css";
import Stats from "three/examples/jsm/libs/stats.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import PlayButton from "./play.js";
import * as Cannon from "cannon-es";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
const Room = ({ clickHandler }) => {
  const gameRef = useRef(null);
  const minY = useRef(null);
  const [locked, setLocked] = useState(false);
  const [UI, setUI] = useState(true);
  const [first, setFirst] = useState(true);
  const cameraRef = useRef(null);
  const cameraOffset = useRef();
  let animationRef = null;
  useEffect(() => {
    let cancelled = false;
    const world = new Cannon.World({
      gravity: new Cannon.Vec3(0, -9.81, 0),
    });

    const body = new Cannon.Body({
      mass: 20,
      type: Cannon.BODY_TYPES.DYNAMIC,
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
    let cat;
    let boxLength;
    let boxWidth;
    const loader = new GLTFLoader();
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);


    const LoadRoom = () =>
      new Promise((resolve, reject) => {
        loader.load(
          "/cyberpunkRoom.glb",
          (gltf) => {
            if (cancelled) return;
            model = gltf.scene;
            const boxBounds = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            minY.current = boxBounds.min.y;

            boxBounds.getSize(size);
            boxWidth = size.x;
            boxLength = size.z;

            scene.add(model);

            const floor = new Cannon.Body({
              mass: 0,
              shape: new Cannon.Box(
                new Cannon.Vec3(boxWidth / 2, boxLength / 2, 0.001)
              ),
            });
            floor.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
            world.addBody(floor);
            resolve();
          },
          undefined,
          (err) => {
            console.error(err);
            if (cancelled) return;
            reject(err);
          }
        );
      });
    const LoadChar = () =>
      new Promise((resolve, reject) => {
        loader.load(
          "/human.glb",
          (gltf) => {
            if (cancelled) return;
            char = gltf.scene;

            char.scale.set(0.01, 0.01, 0.01);
            char.updateWorldMatrix(true, true);
            scene.add(char);
            const boxBounds = new THREE.Box3().setFromObject(char);

            const min = boxBounds.min;

            // console.log("Test Min"+ min.y+ " "+ max.y)
            const size = new THREE.Vector3();

            const sizeCenter = new THREE.Vector3();
            boxBounds.getCenter(sizeCenter);
            boxBounds.getSize(size);

            cameraOffset.current = sizeCenter.z + 0.2;

          
            char.position.set(0, 0.01 + Math.abs(min.y + minY.current), 0);
           
            body.position.set(
              char.position.x,
              char.position.y,
              char.position.z
            );

            const torso = new Cannon.Cylinder(size.x, size.x, 0.8 * size.y, 8);

            const head = new Cannon.Sphere(0.4 * size.x);
            body.addShape(torso, new Cannon.Vec3(0, 0, 0));
            body.addShape(head, new Cannon.Vec3(0, 0.8 * size.y, 0));
            world.addBody(body); // add the humoid body

            // console.log("Model loaded:", char);
            cameraRef.current = 0.7 * size.y + Math.abs(min.y + minY.current);
            // console.log("height: " + cameraRef.current);
            camera.position.set(size.x, cameraRef.current, size.z);
            resolve();
          },
          undefined,
          (err) => {
            if (cancelled) return;
            console.error(err);
            reject(err);
          }
        );
      });
      const Cat = ()=> {
        new Promise((res, rej)=> {
          loader.load("/cat.glb",
            (gltf)=> {
  if (cancelled) return;
  cat = gltf.scene;
   cat.scale.set(2, 2, 2);
  cat.updateWorldMatrix(true, true);
  scene.add(cat);
  res();
            },
            undefined,
            (err) => {
              if (cancelled) return;
              console.error(err);
              rej(err);
            }
          )
        })
      }
      
     
       (async function loading (){
        try {
          await LoadRoom();
          await LoadChar();
          await Cat();
          console.log("Model loaded");
        } catch (err) {
          console.error(err);
        }
      })()
    


   

    const axisHelper = new THREE.AxesHelper(10);
    scene.add(axisHelper);
    const cameraHelper = new THREE.CameraHelper(camera);
    scene.add(cameraHelper);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (gameRef.current) {
      gameRef.current.appendChild(renderer.domElement);
    }

    const MAX_YAW = Math.PI / 4;
    const MIN_YAW = -Math.PI / 4;
    const MAX_PITCH = Math.PI / 6;
    const MIN_PITCH = -Math.PI / 6;
    const controls = new PointerLockControls(camera, renderer.domElement);
    controls.addEventListener("unlock", () => {
      setUI(true);
      console.log("unlocked");
    });
    controls.addEventListener("lock", () => {
      setUI(false);
      console.log("locked");
    });
    let keyDowns = {};
    const ClickHandler = () => {
      if (first) setFirst(false);
      if (!locked && renderer.domElement.isConnected) controls.lock();
    };
    const keyDown = (e) => {
      if (e.key === "Escape") {
        controls.unlock();
      }
      keyDowns[e.key.toLowerCase()] = true;
    };
    const keyUp = (e) => {
      keyDowns[e.key.toLowerCase()] = false;
    };
    document.body.addEventListener("keyup", keyUp);
    document.body.addEventListener("keydown", keyDown);
    document.addEventListener("click", ClickHandler);

    const Action = () => {
      const speed = 1;
      const deltaTime = 1 / 60;

      // console.log("rotation: " + camera.rotation.y);
      const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(
        body.quaternion
      );
      const leftVector = new THREE.Vector3(1, 0, 0).applyQuaternion(
        body.quaternion
      );
      leftVector.normalize();
      forwardVector.normalize();

      let movePosition = new Cannon.Vec3(0, 0, 0);
      if (keyDowns["w"]) {
        movePosition = movePosition.vadd(
          forwardVector.multiplyScalar(speed * deltaTime)
        );
      }
      if (keyDowns["s"]) {
        movePosition = movePosition.vadd(
          forwardVector.multiplyScalar(-speed * deltaTime)
        );
      }
      if (keyDowns["a"]) {
        movePosition = movePosition.vadd(
          leftVector.multiplyScalar(-speed * deltaTime)
        );
      }

      if (keyDowns["d"]) {
        movePosition = movePosition.vadd(
          leftVector.multiplyScalar(speed * deltaTime)
        );
      }
      body.angularFactor.set(0, 1, 0);

      body.position.set(
        body.position.x + movePosition.x,
        body.position.y + movePosition.y,
        body.position.z + movePosition.z
      );

      if (char) {
        const bodyYaw = camera.rotation.y;

        const rotationQuaternion = new THREE.Quaternion();
        rotationQuaternion.setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          bodyYaw
        );
        body.quaternion.x += (rotationQuaternion.x - body.quaternion.x) * 1.4;
        body.quaternion.y += (rotationQuaternion.y - body.quaternion.y) * 1.4;
        body.quaternion.z += (rotationQuaternion.z - body.quaternion.z) * 1.4;
        body.quaternion.w += (rotationQuaternion.w - body.quaternion.w) * 1.4;

        body.quaternion.copy(rotationQuaternion);
      }
    };

    controls.enableDamping = true;

    controls.enableDamping = 0.05;
    controls.update();

    const animate = () => {
      const before = body.quaternion;
      world.fixedStep(1 / 60);

      Action();
      camera.rotation.x = Math.max(
        MIN_PITCH,
        Math.min(MAX_PITCH, camera.rotation.x)
      );
      camera.rotation.y = Math.max(
        MIN_YAW,
        Math.min(MAX_YAW, camera.rotation.y)
      );
      camera.rotation.z = 0;
      if (char && body && cameraRef.current) {
        char.position.copy(body.position);
        const bodyQuaternion = new THREE.Quaternion(
          body.quaternion.x,
          body.quaternion.y,
          body.quaternion.z,
          body.quaternion.w
        );
        const flipQua = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          Math.PI
        );
        const newCameraQua = bodyQuaternion.clone().multiply(flipQua);

        char.quaternion.copy(newCameraQua);
        camera.position.set(
          body.position.x,
          cameraRef.current,
          body.position.z - cameraOffset.current
        );
        //   const bodyEuler = new THREE.Euler().setFromQuaternion(body.quaternion);
        //   const bodyYaw = bodyEuler.y; // Body's yaw angle in radians
        //  console.log("body: "+ bodyYaw )
        const charEuler = new THREE.Euler().setFromQuaternion(char.quaternion);
        const charYaw = charEuler.y;
        // console.log("char: "+ charYaw )
      }

      renderer.render(scene, camera);

      animationRef = requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      controls.unlock();
      controls.dispose();
      cancelAnimationFrame(animationRef);
      document.body.removeEventListener("keyup", keyUp);
      document.body.removeEventListener("keydown", keyDown);

      document.removeEventListener("click", ClickHandler);
      window.removeEventListener("resize", handleResize);
      if (gameRef.current) {
        gameRef.current.removeChild(renderer.domElement);
      }
      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [clickHandler, gameRef]);

  return (
    <div className="w-screen h-screen flex flex-1 relative">
      <div className="w-screen h-screen absolute z-0" ref={gameRef}></div>
      {UI && (
        <PlayButton
          begin={first}
          clickHandler={() => {
            console.log("clickHandlerGame", clickHandler);
            clickHandler();
          }}
        />
      )}
    </div>
  );
};
export default Room;
