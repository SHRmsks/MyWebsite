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
import { Terminal } from "./terminal.js";
import { DartMap } from "./dartMap.js";
import { VideoWall } from "./videoWall.js";
import { evaluatePetTarget } from "./interaction.js";
import { createDesktopControls } from "./controls/desktopControls.js";
import { createMobileControls } from "./controls/mobileControls.js";

const PITCH_LIMIT = 1.3; // radians, ~74°
const CENTER = new THREE.Vector2(0, 0); // screen-centre for crosshair raycasts
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
      interactRequested: false, // E / tap / click — context-sensitive
    };
    this.yaw = 0;
    this.pitch = 0;
    // Lower = slower, calmer turning (the old values spun too fast).
    this.lookSensitivity = controlMode === "mobile" ? 0.003 : 0.0013;

    this._interactKind = null; // 'pet' | 'access' | 'dart' | null
    this._dartHit = null;
    this._portaling = false;
    this._clock = new THREE.Clock();
    this._raf = 0;

    // Scratch + raycaster reused every frame.
    this._eye = new THREE.Vector3();
    this._forward = new THREE.Vector3();
    this._tmp = new THREE.Vector3();
    this._raycaster = new THREE.Raycaster();
    this._raycaster.far = 8;

    this._initRenderer();
    this._initScene();
    this._initPhysics();

    // Dev-only handle for debugging/automated checks (stripped in production).
    if (
      process.env.NODE_ENV !== "production" &&
      typeof window !== "undefined"
    ) {
      window.__gameEngine = this;
    }

    this._start();
  }

  _initRenderer() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // Tone mapping tames the neon highlights so textures (the fox!) keep their
    // colour instead of blowing out to white.
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
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
      200,
    );
    camera.rotation.order = "YXZ";
    scene.add(camera); // so the first-person arm (child of camera) renders

    // Moody neon lighting — balanced for ACES tone mapping so textures (the fox!)
    // keep their colour instead of blowing out to white.
    scene.add(new THREE.AmbientLight(0x9fb2c4, 0.8));
    const hemi = new THREE.HemisphereLight(0x9fe9ff, 0x20141f, 0.55);
    scene.add(hemi);
    // Neon accents, repositioned for the now human-scaled (~2.5m) room.
    const cyan = new THREE.PointLight(0x39c4b6, 4, 9, 2);
    cyan.position.set(1.2, 1.9, 0.8);
    scene.add(cyan);

    // A soft fill that rides with the player so whatever you face is lit.
    const playerLight = new THREE.PointLight(0xcfeaff, 2.2, 7, 1.6);
    playerLight.position.set(0, 0.25, -0.2);
    camera.add(playerLight);

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
      }),
    );
  }

  async _start() {
    try {
      this._setState({ phase: "loading", progress: 0 });

      // Room first (the bulk of the download).
      const roomGltf = await loadGLTF("/cyberpunkRoom.glb", (p) =>
        this._setState({ phase: "loading", progress: p * 0.9 }),
      );
      if (this.disposed) return;
      this.room = roomGltf.scene;
      this.room.scale.setScalar(ROOM_SCALE); // human-proportion the oversized model
      this.room.updateMatrixWorld(true);
      this.scene.add(this.room);

      const bounds = addRoomColliders(this.world, this.room, this.envMat);
      this._bounds = bounds;
      this.player = new Player(this.world, bounds, this.playerMat);

      // Cat sits on the floor, centred and a short walk in front of the spawn so
      // it's easy to find and pet.
      const catPos = new THREE.Vector3(
        bounds.center.x,
        bounds.min.y + 0.02,
        bounds.center.z - 0.9,
      );
      this.cat = new Cat();

      // First-person arm + wire its contact moment to the cat reaction.
      this.arm = new Arm(this.camera);
      this.arm.onContact = () => this.cat?.react();

      await this.cat.load(catPos, bounds, this.room);
      if (this.disposed) return;
      this.scene.add(this.cat.root);

      // Floating world-map dartboard on the open (left / -X) side.
      this.dartMap = new DartMap();
      this.dartMap.place(bounds);
      this.scene.add(this.dartMap.root);

      // Free-standing terminal to the right of spawn; tap it to enter the portfolio.
      this.terminal = new Terminal();
      this.terminal.place(
        new THREE.Vector3(
          bounds.center.x + 1.3,
          bounds.min.y + 0.02,
          bounds.center.z + 0.3,
        ),
        new THREE.Vector3(bounds.center.x, bounds.min.y, bounds.center.z),
      );
      this.scene.add(this.terminal.root);

      // Looping cyberpunk video screen on the back (+Z) wall, shifted toward +X so
      // it doesn't cross the dart map in the back-left corner (drop /public/wall.mp4).
      this.videoWall = new VideoWall("/wall.mp4");
      this.videoWall.place(
        new THREE.Vector3(
          bounds.center.x + 0.5,
          bounds.center.y + 0.25,
          bounds.max.z - 0.12,
        ),
        Math.PI,
      );
      this.scene.add(this.videoWall.root);

      this._setState({ phase: "loading", progress: 1 });
      this._initControls();
      this._setState({
        phase: "ready",
        progress: 1,
        locked: false,
        inRange: false,
      });

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
      this.controls = createMobileControls(this.input, {
        container: this.container,
      });
    } else {
      this.controls = createDesktopControls(this.input, {
        canvas: this.canvas,
        onLockChange: (locked) => this._setState({ locked }),
      });
    }
  }

  /** Public: HUD's action button (mobile) triggers the current interaction. */
  requestInteract() {
    this.input.interactRequested = true;
  }

  /** Begin the "jack into portfolio" transition (terminal activation). */
  _portal() {
    if (this._portaling) return;
    this._portaling = true;
    if (typeof document !== "undefined" && document.pointerLockElement) {
      document.exitPointerLock();
    }
    this._setState({ phase: "portal" });
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

    // 2) Move the player, then hard-clamp inside the room (radius-aware, no bounce).
    this.player.update(this.input.move, this.yaw, dt);
    this.world.step(1 / 60, dt, 5);
    this.player.clampToBounds(this._bounds);

    // 3) Camera rides on the player body at eye height.
    this.player.getEyePosition(this._eye);
    this.camera.position.copy(this._eye);

    // 4) Work out the current interaction from aim + proximity.
    this.camera.getWorldDirection(this._forward);
    const { inRange, distance } = evaluatePetTarget(
      this._eye,
      this._forward,
      this.cat.position,
    );
    this.cat.setPlayer(this._eye, distance < 2.4);

    this._raycaster.setFromCamera(CENTER, this.camera);
    const dartHit = this.dartMap ? this.dartMap.raycast(this._raycaster) : null;
    let termAim = false;
    if (this.terminal) {
      const td = this._eye.distanceTo(this.terminal.position);
      termAim =
        td < 2.4 &&
        this._forward.dot(
          this._tmp.copy(this.terminal.position).sub(this._eye).normalize(),
        ) > 0.45;
    }

    // Priority: aiming at the map > terminal in reach > cat in reach.
    let kind = null;
    if (dartHit) kind = "dart";
    else if (termAim) kind = "access";
    else if (inRange) kind = "pet";
    this._dartHit = dartHit;
    if (kind !== this._interactKind) {
      this._interactKind = kind;
      this._setState({ interact: kind });
    }

    // 5) Interaction (edge-triggered).
    if (this.input.interactRequested) {
      this.input.interactRequested = false;
      if (kind === "dart") {
        this.dartMap.throwAt(this.camera, dartHit, (x, y) => {
          this._setState({ phase: "dart_landed", dartX: x, dartY: y });
          if (typeof document !== "undefined" && document.pointerLockElement) {
            document.exitPointerLock(); // Free the mouse so they can click the input!
          }
        });
      } else if (kind === "access") this._portal();
      else if (kind === "pet") this.arm.pet();
    }

    // 6) Animate everything.
    const speed = Math.hypot(
      this.player.body.velocity.x,
      this.player.body.velocity.z,
    );
    this.arm.update(dt, speed);
    this.cat.update(dt);
    this.terminal?.update(dt);
    this.dartMap?.update(dt);
    this.videoWall?.update(dt);

    this.renderer.render(this.scene, this.camera);
  }

  _setState(partial) {
    if (!this.disposed) this.onState(partial);
  }

  confirmDart(name, x, y) {
    this.dartMap?.confirmPendingPin(name, x, y);
    this._setState({ phase: "ready" });
    this.requestLock(); // Auto-lock mouse back to the game
  }

  cancelDart() {
    this.dartMap?.cancelPendingDart();
    this._setState({ phase: "ready" });
    this.requestLock(); // Auto-lock mouse back to the game
  }
  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this._raf);
    if (this._onResize) window.removeEventListener("resize", this._onResize);

    this.controls?.dispose();
    this.arm?.dispose();
    this.cat?.dispose();
    this.terminal?.dispose();
    this.dartMap?.dispose();
    this.videoWall?.dispose();
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
    if (this.canvas?.parentNode)
      this.canvas.parentNode.removeChild(this.canvas);

    disposeLoaders();
  }
}
