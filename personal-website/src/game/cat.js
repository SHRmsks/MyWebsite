// cat.js
// Loads the cat model, plays its embedded idle clip ("Take 001"), and reacts when
// petted: a happy squash-and-stretch "pop", a brief speed-up of the idle, and a
// burst of floating heart particles. The cat also gently turns to face the player
// when they're close, so petting feels acknowledged.

import * as THREE from "three";
import { loadGLTF } from "./loaders.js";

const SCALE = 0.9; // realistic cat size in the human-scaled room

// Build a small heart sprite texture once (drawn on a canvas, no asset needed).
function makeHeartTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#ff4d8d";
  ctx.beginPath();
  // Two lobes + point — a classic heart path.
  ctx.moveTo(32, 20);
  ctx.bezierCurveTo(32, 14, 24, 8, 16, 14);
  ctx.bezierCurveTo(6, 22, 14, 36, 32, 50);
  ctx.bezierCurveTo(50, 36, 58, 22, 48, 14);
  ctx.bezierCurveTo(40, 8, 32, 14, 32, 20);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class Cat {
  constructor() {
    this.root = new THREE.Group();
    this.model = null;
    this.mixer = null;
    this.position = new THREE.Vector3();

    this._hearts = new THREE.Group();
    this.root.add(this._hearts);
    this._heartTex = makeHeartTexture();
    this._heartMat = new THREE.SpriteMaterial({
      map: this._heartTex,
      transparent: true,
      depthWrite: false,
    });
    this._particles = []; // { sprite, vel, life, maxLife }

    this._popTime = 0; // remaining "happy pop" animation time
    this._faceTarget = null; // when set, cat slowly yaws to look here
    this._t = 0; // animation clock
    this._nuzzleTime = 0; // remaining petting-nuzzle time
    this._baseY = 0; // resting floor height for idle/nuzzle bob
  }

  /** Load the model and place it on the floor at `pos`. */
  async load(pos) {
    const gltf = await loadGLTF("/cat.glb");
    this.model = gltf.scene;
    this.model.scale.setScalar(SCALE);
    this.model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = false;
        o.frustumCulled = true;
      }
    });
    this.root.add(this.model);
    this.root.position.copy(pos);
    this.position.copy(pos);
    this._baseY = pos.y;

    if (gltf.animations?.length) {
      this.mixer = new THREE.AnimationMixer(this.model);
      this._action = this.mixer.clipAction(gltf.animations[0]);
      this._action.timeScale = 0.6; // calm idle
      this._action.play();
    }
    return this;
  }

  /** Cat should slowly turn to look toward this world position (or null). */
  faceToward(worldPos) {
    this._faceTarget = worldPos;
  }

  /** Trigger the happy reaction — called when the hand makes contact. */
  react() {
    this._popTime = 0.5;
    this._nuzzleTime = 1.3; // sustained happy wiggle during the pet
    if (this._action) this._action.timeScale = 1.8; // excited
    this._spawnHearts(9);
  }

  _spawnHearts(n) {
    for (let i = 0; i < n; i++) {
      const sprite = new THREE.Sprite(this._heartMat.clone());
      const s = 0.18 + Math.random() * 0.12;
      sprite.scale.setScalar(s);
      // Start just above the cat's head.
      sprite.position.set(
        (Math.random() - 0.5) * 0.3,
        0.35 + Math.random() * 0.12,
        (Math.random() - 0.5) * 0.3
      );
      this._hearts.add(sprite);
      this._particles.push({
        sprite,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          0.6 + Math.random() * 0.4,
          (Math.random() - 0.5) * 0.3
        ),
        life: 0,
        maxLife: 1.1 + Math.random() * 0.4,
      });
    }
  }

  update(dt) {
    this._t += dt;
    if (this.mixer) this.mixer.update(dt);

    // Ease the idle clip speed back down after a reaction.
    if (this._action && this._action.timeScale > 0.6) {
      this._action.timeScale = Math.max(0.6, this._action.timeScale - dt * 2);
    }

    // Model scale = base * happy-pop * breathing.
    if (this.model) {
      let popY = 1;
      let popXZ = 1;
      if (this._popTime > 0) {
        this._popTime -= dt;
        const k = Math.max(0, this._popTime / 0.5);
        const pop = 1 + Math.sin(k * Math.PI) * 0.22;
        popY = pop;
        popXZ = 1 / Math.sqrt(pop);
      }
      const breath = 1 + Math.sin(this._t * 2.2) * 0.02; // gentle breathing
      this.model.scale.set(SCALE * popXZ, SCALE * popY * breath, SCALE * popXZ);
    }

    // Idle sway, plus a natural back-and-forth nuzzle while being petted.
    let bob = Math.sin(this._t * 1.8) * 0.006;
    let tiltX = 0;
    let rollZ = Math.sin(this._t * 1.3) * 0.015;
    if (this._nuzzleTime > 0) {
      this._nuzzleTime -= dt;
      const fade = Math.min(1, this._nuzzleTime / 0.3); // ease out at the end
      bob += Math.abs(Math.sin(this._t * 12)) * 0.05 * fade; // happy little hops
      tiltX = Math.sin(this._t * 10) * 0.12 * fade; // head rocks up into the hand
      rollZ += Math.sin(this._t * 8) * 0.06 * fade; // side-to-side wiggle
    }
    this.root.position.y = this._baseY + bob;
    this.root.rotation.x = tiltX;
    this.root.rotation.z = rollZ;

    // Slowly yaw toward the player.
    if (this._faceTarget) {
      const dx = this._faceTarget.x - this.root.position.x;
      const dz = this._faceTarget.z - this.root.position.z;
      const targetYaw = Math.atan2(dx, dz);
      const cur = this.root.rotation.y;
      const diff = ((targetYaw - cur + Math.PI) % (Math.PI * 2)) - Math.PI;
      this.root.rotation.y = cur + diff * Math.min(1, dt * 2.5);
    }

    // Advance heart particles; recycle dead ones.
    for (let i = this._particles.length - 1; i >= 0; i--) {
      const p = this._particles[i];
      p.life += dt;
      const t = p.life / p.maxLife;
      if (t >= 1) {
        this._hearts.remove(p.sprite);
        p.sprite.material.dispose();
        this._particles.splice(i, 1);
        continue;
      }
      p.sprite.position.addScaledVector(p.vel, dt);
      p.vel.y -= dt * 0.5; // slight gravity so they arc
      p.sprite.material.opacity = 1 - t;
      p.sprite.scale.setScalar((0.2 + t * 0.12) * (1 - t * 0.3));
    }
  }

  dispose() {
    this.mixer?.stopAllAction();
    this._particles.forEach((p) => p.sprite.material.dispose());
    this.root.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          Object.values(m).forEach((v) => v?.isTexture && v.dispose());
          m.dispose();
        });
      }
    });
    this._heartTex.dispose();
    this._heartMat.dispose();
  }
}
