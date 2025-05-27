"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";

const Scene = () => {
  let model = null;
  let renderer = null;
  const ref = useRef(null); // this is the div's ref
  const sceneRef = useRef(null); // this is the scene's ref
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const rendererRef = useRef(null);
  const composerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const checkSize = () => {
      setMounted(window.innerWidth > 640);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => {
      window.removeEventListener("resize", checkSize);
    };
  }, []);

  useEffect(() => {
    if (mounted && ref.current) {
      let animationRef = null;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });

      renderer.setSize(ref.current.offsetWidth, ref.current.offsetHeight);
      rendererRef.current = renderer;
      ref.current.appendChild(rendererRef.current.domElement);

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
      sceneRef.current = scene;
      cameraRef.current = camera;

      composerRef.current = composer;

      const loader = new GLTFLoader();

      camera.position.z = 4;
      camera.position.y = 5;

      camera.lookAt(0, 2, 0);

      if (!modelRef.current) {
        loader.load(
          "/globe.glb",
          (gltf) => {
            model = gltf.scene;

            model.scale.set(3.5, 3.5, 3.5);

            modelRef.current = model;

            sceneRef.current ? sceneRef.current.add(modelRef.current) : null;
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
      } else {
        sceneRef.current ? sceneRef.current.add(modelRef.current) : null;
        outlinePass.selectedObjects = [modelRef.current];
      }
      let isDragging = false;
      let previous = { x: 0, y: 0 };
      const onMouseDown = (e) => {
        isDragging = true;
        previous = { x: e.clientX, y: e.clientY };
      };
      const onMouseMove = (e) => {
        if (isDragging && modelRef.current) {
          const dx = e.clientX - previous.x;
          const dy = e.clientY - previous.y;
          modelRef.current.rotation.y += dx * 0.01;
          modelRef.current.rotation.x += dy * 0.01;
          previous = { x: e.clientX, y: e.clientY };
        }
      };
      const onMouseUp = () => {
        isDragging = false;
      };
      rendererRef.current.domElement.addEventListener("mousedown", onMouseDown);
      rendererRef.current.domElement.addEventListener("mouseup", onMouseUp);
      rendererRef.current.domElement.addEventListener("mousemove", onMouseMove);

      const animate = () => {
        if (modelRef.current) {
          modelRef.current.rotation.y += 0.005;
        }
        if (composerRef.current) {
          composerRef.current.render();
        }

        animationRef = requestAnimationFrame(animate);
      };
      animate();

      const handleResize = () => {
        cameraRef.current.aspect =
          ref.current.offsetWidth / ref.current.offsetHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(
          ref.current.offsetWidth,
          ref.current.offsetHeight
        );
        composerRef.current.setSize(
          ref.current.offsetWidth,
          ref.current.offsetHeight
        );
      };
      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(animationRef);
        if (modelRef.current) {
          scene.remove(modelRef.current);
          modelRef.current = null;
        }
        if (rendererRef.current && rendererRef.current.domElement) {
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("mousedown", onMouseDown);
          window.removeEventListener("mouseup", onMouseUp);
          window.removeEventListener("mousemove", onMouseMove);
        }
        if (ref.current) {
          ref.current.removeChild(renderer.domElement);
        }
        if (renderer) {
          renderer.dispose();
        }
        sceneRef.current = null;
        cameraRef.current = null;
      };
    }
  }, [ref, modelRef, sceneRef, cameraRef, rendererRef, composerRef, mounted]);

  return (
    <div
      ref={ref}
      className="sm:h-[200px] sm:w-full sm:min-w-[200px] sm:bg-[rgba(0,6,14,0.5)] sm:rounded-[20px]"
    ></div>
  );
};

export default Scene;
