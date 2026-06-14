// loaders.js
// A single, shared GLTF loader wired for Draco-compressed meshes (our models are
// optimized with `gltf-transform optimize --compress draco`). Decoders are
// self-hosted under /public/decoders so we never depend on a third-party CDN.

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

let sharedLoader = null;

// Lazily build one loader for the whole app so the Draco worker pool is reused.
function getLoader() {
  if (sharedLoader) return sharedLoader;

  const draco = new DRACOLoader();
  draco.setDecoderPath("/decoders/draco/");

  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  loader.setMeshoptDecoder(MeshoptDecoder); // harmless if a model isn't meshopt-packed

  sharedLoader = loader;
  return loader;
}

// In-memory cache so a model is only fetched/decoded once per session.
const cache = new Map();

/**
 * Load a .glb and resolve with its parsed gltf object.
 * @param {string} url            path under /public, e.g. "/cat.glb"
 * @param {(p:number)=>void} [onProgress]  0..1 download progress
 * @returns {Promise<import("three/examples/jsm/loaders/GLTFLoader.js").GLTF>}
 */
export function loadGLTF(url, onProgress) {
  if (cache.has(url)) return cache.get(url);

  const promise = new Promise((resolve, reject) => {
    getLoader().load(
      url,
      resolve,
      (evt) => {
        if (onProgress && evt.total) onProgress(evt.loaded / evt.total);
      },
      reject
    );
  });

  cache.set(url, promise);
  return promise;
}

// Free the Draco worker pool when the engine is torn down for good.
export function disposeLoaders() {
  if (sharedLoader?.dracoLoader) sharedLoader.dracoLoader.dispose();
  sharedLoader = null;
  cache.clear();
}
