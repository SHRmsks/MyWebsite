// engine.js
// The GameEngine orchestrates everything: Three.js scene/renderer, the cannon-es
// world, the player, cat, first-person arm, and the active control scheme. React
// only mounts this and reads state via the onState callback — all the realtime work
// happens here in plain JS so there are no React re-renders in the hot loop.

import * as THREE from "three";
import * as CANNON from "cannon-es";

import { loadGLTF, disposeLoaders } from "./loaders.js";
import { createPhysicsWorld, addRoomColliders } from "./world.js";
import { Player } from "./player.js";
import { Arm } from "./arm.js";
import { Cat } from "./cat.js";
import { evaluatePetTarget } from "./interaction.js";
import { createDesktopControls } from "./controls/desktopControls.js";
import { createMobileControls } from "./controls/mobileControls.js";

const PITCH_LIMIT = 1.3; // radians, ~74°
// The room model is authored ~2.2x human scale (≈6m ceiling). Shrink it so a
// normal 1.7m eye height reads as a human in a normal room (~2.5m ceiling).
const ROOM_SCALE = 0.42;

export class GameEngine {
  /**
   * @param {HTMLElement} container  full-screen mount node
   * @param {{controlMode:'desktop'|'mobile', onState:(s:object)=>void}} opts
   */
  constructor(container, { controlMode = "desktop", onState = () => {} } = {}) {
    this.container = container;
    this.controlMode = controlMode;
    this.onState = onState;
    this.disposed = false;

    // Shared input contract written by the active control scheme.
    this.input = {
      move: { x: 0, y: 0 },
      lookDelta: { x: 0, y: 0 },
      petRequested: false,
    };
    this.yaw = 0;
    this.pitch = 0;
    // Lower = slower, calmer turning (the old values spun too fast).
    this.lookSensitivity = controlMode === "mobile" ? 0.003 : 0.0013;

    this._inRange = false;
    this._clock = new THREE.Clock();
    this._raf = 0;

    // Scratch vectors reused every frame.
    this._eye = new THREE.Vector3();
    this._forward = new THREE.Vector3();

    this._initRenderer();
    this._initScene();
    this._initPhysics();

    // Dev-only handle for debugging/automated checks (stripped in production).
    if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
      window.__gameEngine = this;
    }

    this._start();
  }

  _initRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;
    this.canvas = renderer.domElement;
  }

  _initScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070d);
    scene.fog = new THREE.FogExp2(0x05070d, 0.06);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.05,
      200
    );
    camera.rotation.order = "YXZ";
    scene.add(camera); // so the first-person arm (child of camera) renders

    // Moody neon lighting to sell the cyberpunk room.
    scene.add(new THREE.AmbientLight(0x6a7b8c, 0.7));
    const hemi = new THREE.HemisphereLight(0x39c4b6, 0x10060f, 0.5);
    scene.add(hemi);
    const cyan = new THREE.PointLight(0x39c4b6, 8, 18, 2);
    cyan.position.set(2.5, 2.6, 1.5);
    scene.add(cyan);
    const magenta = new THREE.PointLight(0xff2d8d, 6, 16, 2);
    magenta.position.set(-2.5, 2.2, -1.5);
    scene.add(magenta);

    this.scene = scene;
    this.camera = camera;
  }

  _initPhysics() {
    this.world = createPhysicsWorld();
    this.playerMat = new CANNON.Material("player");
    this.envMat = new CANNON.Material("env");
    this.world.addContactMaterial(
      new CANNON.ContactMaterial(this.playerMat, this.envMat, {
        friction: 0,
        restitution: 0,
      })
    );
  }

  async _start() {
    try {
      this._setState({ phase: "loading", progress: 0 });

      // Room first (the bulk of the download).
      const roomGltf = await loadGLTF("/cyberpunkRoom.glb", (p) =>
        this._setState({ phase: "loading", progress: p * 0.9 })
      );
      if (this.disposed) return;
      this.room = roomGltf.scene;
      this.room.scale.setScalar(ROOM_SCALE); // human-proportion the oversized model
      this.room.updateMatrixWorld(true);
      this.scene.add(this.room);

      const bounds = addRoomColliders(this.world, this.room, this.envMat);
      this.player = new Player(this.world, bounds, this.playerMat);

      // Cat sits on the floor, centred and a short walk in front of the spawn so
      // it's easy to find and pet.
      const catPos = new THREE.Vector3(
        bounds.center.x,
        bounds.min.y + 0.02,
        bounds.center.z - 0.9
      );
      this.cat = new Cat();

      // First-person arm + wire its contact moment to the cat reaction.
      this.arm = new Arm(this.camera);
      this.arm.onContact = () => this.cat?.react();

      await this.cat.load(catPos);
      if (this.disposed) return;
      this.scene.add(this.cat.root);

      this._setState({ phase: "loading", progress: 1 });
      this._initControls();
      this._setState({ phase: "ready", progress: 1, locked: false, inRange: false });

      this._onResize = this._resize.bind(this);
      window.addEventListener("resize", this._onResize);

      this._loop();
    } catch (err) {
      console.error("[game] failed to start:", err);
      this._setState({ phase: "error", message: String(err?.message || err) });
    }
  }

  _initControls() {
    if (this.controlMode === "mobile") {
      this.controls = createMobileControls(this.input, { container: this.container });
    } else {
      this.controls = createDesktopControls(this.input, {
        canvas: this.canvas,
        onLockChange: (locked) => this._setState({ locked }),
      });
    }
  }

  /** Public: let the HUD's Pet button (mobile) trigger a pet. */
  requestPet() {
    this.input.petRequested = true;
  }

  /** Public: let the HUD prompt the desktop pointer lock from a button. */
  requestLock() {
    this.controls?.requestLock();
  }

  _resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _loop() {
    this._raf = requestAnimationFrame(() => this._loop());
    const dt = Math.min(this._clock.getDelta(), 0.05);

    // 1) Apply accumulated look, then reset the delta.
    this.yaw -= this.input.lookDelta.x * this.lookSensitivity;
    this.pitch -= this.input.lookDelta.y * this.lookSensitivity;
    this.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, this.pitch));
    this.input.lookDelta.x = 0;
    this.input.lookDelta.y = 0;
    this.camera.rotation.set(this.pitch, this.yaw, 0);

    // 2) Move the player (velocity-based; physics resolves wall collisions).
    this.player.update(this.input.move, this.yaw, dt);
    this.world.step(1 / 60, dt, 5);

    // 3) Camera rides on the player body at eye height.
    this.player.getEyePosition(this._eye);
    this.camera.position.copy(this._eye);

    // 4) Can we pet the cat right now?
    this.camera.getWorldDirection(this._forward);
    const { inRange } = evaluatePetTarget(this._eye, this._forward, this.cat.position);
    if (inRange !== this._inRange) {
      this._inRange = inRange;
      this._setState({ inRange });
    }
    this.cat.faceToward(this._eye); // the cat always watches the player

    // 5) Pet request (edge-triggered): only when in range and not mid-gesture.
    if (this.input.petRequested) {
      if (inRange) this.arm.pet();
      this.input.petRequested = false;
    }

    // 6) Animate arm + cat.
    const speed = Math.hypot(this.player.body.velocity.x, this.player.body.velocity.z);
    this.arm.update(dt, speed);
    this.cat.update(dt);

    this.renderer.render(this.scene, this.camera);
  }

  _setState(partial) {
    if (!this.disposed) this.onState(partial);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this._raf);
    if (this._onResize) window.removeEventListener("resize", this._onResize);

    this.controls?.dispose();
    this.arm?.dispose();
    this.cat?.dispose();
    this.player?.dispose();

    // Dispose all GPU resources still in the scene.
    this.scene?.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          Object.values(m).forEach((v) => v?.isTexture && v.dispose());
          m.dispose();
        });
      }
    });

    this.renderer?.dispose();
    if (this.canvas?.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    disposeLoaders();
  }
}
