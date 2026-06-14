// cat.js
import * as THREE from "three";
import { loadGLTF } from "./loaders.js";

const MODEL_URL = "/fox.glb";
const TARGET_LENGTH = 1.0;
const WALK_SPEED = 0.8;
const RUN_SPEED = 1.9;
const DOWN = new THREE.Vector3(0, -1, 0);

function pickClip(clips, candidates) {
  for (const c of candidates) {
    const hit = clips.find((a) => a.name.toLowerCase().includes(c));
    if (hit) return hit;
  }
  return null;
}

function makeHeartTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#ff4d8d";
  ctx.beginPath();
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

    this._state = "idle";
    this._yaw = 0;
    this._scale = 1;
    this._petTime = 0;

    this._actions = {};
    this._current = null;

    this._playerPos = new THREE.Vector3();

    // Raycaster to keep the fox's feet perfectly planted on the floor
    this._floor = null;
    this._floorRay = new THREE.Raycaster();
    this._floorRay.far = 2.5;
    this._rayOrigin = new THREE.Vector3();

    this._hearts = new THREE.Group();
    this.root.add(this._hearts);
    this._heartTex = makeHeartTexture();
    this._heartMat = new THREE.SpriteMaterial({
      map: this._heartTex,
      transparent: true,
      depthWrite: false,
    });
    this._particles = [];
  }

  async load(pos, bounds, floor) {
    this._floor = floor;

    const gltf = await loadGLTF(MODEL_URL);
    this.model = gltf.scene;

    const box = new THREE.Box3().setFromObject(this.model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const longest = Math.max(size.x, size.z) || 1;
    this._scale = TARGET_LENGTH / longest;
    this.model.scale.setScalar(this._scale);
    this.model.position.y = -box.min.y * this._scale;
    this.model.traverse((o) => {
      if (o.isMesh) o.frustumCulled = false;
    });
    this.root.add(this.model);

    this.root.position.copy(pos);
    this.position.copy(pos);
    this._snapToFloor();

    if (gltf.animations?.length) {
      this.mixer = new THREE.AnimationMixer(this.model);
      const idle =
        pickClip(gltf.animations, ["survey", "idle", "look"]) ||
        gltf.animations[0];
      const walk = pickClip(gltf.animations, ["walk"]) || idle;
      const run = pickClip(gltf.animations, ["run", "gallop"]) || walk;
      this._actions.idle = this.mixer.clipAction(idle);
      this._actions.walk = this.mixer.clipAction(walk);
      this._actions.run = this.mixer.clipAction(run);
      Object.values(this._actions).forEach((a) =>
        a.play().setEffectiveWeight(0),
      );
      this._setAction("idle", true);
    }

    return this;
  }

  setPlayer(pos) {
    this._playerPos.copy(pos);
  }

  react() {
    this._state = "pet";
    this._petTime = 1.6;
    this._petBaseX = this.root.position.x;
    this._petBaseZ = this.root.position.z;
    this._setAction("idle");
    if (this._actions.idle) this._actions.idle.timeScale = 1.8;
    this._spawnHearts(9);
  }

  _setAction(name, instant = false) {
    const next = this._actions[name];
    if (!next || this._current === next) return;
    next.enabled = true;
    next.setEffectiveTimeScale(1).setEffectiveWeight(1).reset().play();
    if (this._current && !instant) this._current.crossFadeTo(next, 0.3, false);
    else if (this._current) this._current.setEffectiveWeight(0);
    this._current = next;
  }

  update(dt) {
    if (this.mixer) this.mixer.update(dt);
    this._snapToFloor();

    // 1. Process Pet Animation
    if (this._state === "pet") {
      this._petTime -= dt;
      this._faceTo(this._playerPos.x, this._playerPos.z, dt * 6); // Smoothly look at player while being pet

      const k = Math.max(0, this._petTime / 1.6);
      const prog = 1 - k;
      const pop = 1 + Math.sin(k * Math.PI) * 0.14;
      this.model.scale.set(
        this._scale / Math.sqrt(pop),
        this._scale * pop,
        this._scale / Math.sqrt(pop),
      );

      const lean = Math.sin(prog * Math.PI * 4) * 0.13;
      let dx = this._playerPos.x - this._petBaseX;
      let dz = this._playerPos.z - this._petBaseZ;
      const dl = Math.hypot(dx, dz) || 1;
      this.root.position.x = this._petBaseX + (dx / dl) * lean;
      this.root.position.z = this._petBaseZ + (dz / dl) * lean;
      this.position.copy(this.root.position);

      if (this._petTime <= 0) {
        this.root.position.x = this._petBaseX;
        this.root.position.z = this._petBaseZ;
        this.model.scale.setScalar(this._scale);
        if (this._actions.idle) this._actions.idle.timeScale = 1;
        this._state = "idle";
      }
      this._updateHearts(dt);
      return;
    }

    // 2. Pure Follow AI (No Wandering)
    const dx = this._playerPos.x - this.root.position.x;
    const dz = this._playerPos.z - this.root.position.z;
    const dist = Math.hypot(dx, dz);

    // If player is more than 1.2 meters away, move towards them
    if (dist > 1.2) {
      this._state = dist > 3.0 ? "run" : "walk";
      this._setAction(this._state);

      const speed = this._state === "run" ? RUN_SPEED : WALK_SPEED;
      const step = Math.min(speed * dt, dist - 1.0); // Stop 1m away from the player

      this.root.position.x += (dx / dist) * step;
      this.root.position.z += (dz / dist) * step;

      // Delicately rotate to face the player while moving
      this._faceTo(this._playerPos.x, this._playerPos.z, dt * 4);
    } else {
      // Close enough. Sit still and look directly up at the player.
      this._setAction("idle");
      this._faceTo(this._playerPos.x, this._playerPos.z, dt * 3);
    }

    this.position.copy(this.root.position);
    this._updateHearts(dt);
  }

  // Smoothly rotate to look toward a world point
  _faceTo(x, z, lerpSpeed) {
    const dx = x - this.root.position.x;
    const dz = z - this.root.position.z;
    if (dx * dx + dz * dz < 1e-4) return;

    // Fixed the math orientation for the Khronos Fox
    const targetYaw = Math.atan2(dx, dz);

    // Calculates the shortest angular distance and applies a soft interpolation (lerpSpeed)
    let diff = ((targetYaw - this._yaw + Math.PI) % (Math.PI * 2)) - Math.PI;
    this._yaw += diff * Math.min(1, lerpSpeed);
    this.root.rotation.y = this._yaw;
  }

  _snapToFloor() {
    if (!this._floor) return;
    this._rayOrigin.set(
      this.root.position.x,
      this.root.position.y + 0.8,
      this.root.position.z,
    );
    this._floorRay.set(this._rayOrigin, DOWN);
    const hits = this._floorRay.intersectObject(this._floor, true);
    if (hits.length) this.root.position.y = hits[0].point.y;
  }

  _spawnHearts(n) {
    for (let i = 0; i < n; i++) {
      const sprite = new THREE.Sprite(this._heartMat.clone());
      sprite.scale.setScalar(0.18 + Math.random() * 0.12);
      sprite.position.set(
        (Math.random() - 0.5) * 0.3,
        0.45 + Math.random() * 0.15,
        (Math.random() - 0.5) * 0.3,
      );
      this._hearts.add(sprite);
      this._particles.push({
        sprite,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          0.6 + Math.random() * 0.4,
          (Math.random() - 0.5) * 0.3,
        ),
        life: 0,
        maxLife: 1.1 + Math.random() * 0.4,
      });
    }
  }

  _updateHearts(dt) {
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
      p.vel.y -= dt * 0.5;
      p.sprite.material.opacity = 1 - t;
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
