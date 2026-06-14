// arm.js
// A first-person human arm/hand, parented to the camera. It rests in the lower view
// and, on pet(), sweeps forward and does a clearly visible stroking motion over the
// cat; at the stroke it fires onContact so the cat reacts. The hand is skin-toned
// with a glowing cyber wrist-gauntlet, and it carries its OWN light so it stays
// clearly visible no matter how dark the room is (room lights don't follow the
// camera, which is why the old near-black arm was invisible).

import * as THREE from "three";

const NEON = 0x39c4b6;
const SKIN = 0xe7b48c;
const REACH_DURATION = 1.25; // seconds for a full reach + strokes + return
const CONTACT_AT = 0.4; // progress (0..1) where the hand reaches the cat

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export class Arm {
  /** @param {THREE.Camera} camera  arm is parented here so it tracks the view */
  constructor(camera) {
    this.group = new THREE.Group();

    const skin = new THREE.MeshStandardMaterial({
      color: SKIN,
      roughness: 0.7,
      metalness: 0.0,
      emissive: SKIN,
      emissiveIntensity: 0.25, // self-lit a touch so it's never pitch black
    });
    const glove = new THREE.MeshStandardMaterial({
      color: 0x10212a,
      roughness: 0.4,
      metalness: 0.6,
      emissive: NEON,
      emissiveIntensity: 0.4,
    });

    // Forearm (sleeve/gauntlet) pointing into the screen.
    const forearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.32, 8, 14), glove);
    forearm.rotation.x = Math.PI / 2;
    forearm.position.set(0, -0.04, 0.14);
    this.group.add(forearm);

    // Glowing wrist band.
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.062, 0.014, 10, 24),
      new THREE.MeshStandardMaterial({
        color: NEON,
        emissive: NEON,
        emissiveIntensity: 1.6,
        roughness: 0.3,
      })
    );
    band.rotation.x = Math.PI / 2;
    band.position.set(0, -0.01, 0.0);
    this.group.add(band);

    // Palm.
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.045, 0.13), skin);
    palm.position.set(0, 0, -0.08);
    this.group.add(palm);

    // Four fingers, slightly curled forward.
    const fingerGeo = new THREE.CapsuleGeometry(0.016, 0.07, 4, 8);
    this.fingers = [];
    for (let i = 0; i < 4; i++) {
      const f = new THREE.Mesh(fingerGeo, skin);
      f.position.set(-0.042 + i * 0.028, -0.005, -0.16);
      f.rotation.x = Math.PI / 2.6;
      this.group.add(f);
      this.fingers.push(f);
    }
    // Thumb.
    const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.06, 4, 8), skin);
    thumb.position.set(-0.07, 0, -0.07);
    thumb.rotation.set(Math.PI / 2.4, 0, Math.PI / 4);
    this.group.add(thumb);

    // The hand's own light so it's always visible (short range = mostly lights the hand).
    const light = new THREE.PointLight(0xffe6c8, 3.2, 2.2, 2);
    light.position.set(0.02, 0.06, -0.12);
    this.group.add(light);

    // Rest / reach poses (camera space). Sits in the lower view, comfortably visible.
    this._restPos = new THREE.Vector3(0.24, -0.34, -0.52);
    this._restRot = new THREE.Euler(-0.35, 0.45, 0.1);
    this._reachPos = new THREE.Vector3(0.07, -0.26, -0.82);
    this._reachRot = new THREE.Euler(0.55, 0.12, 0.0); // palm tips down to pet

    this.group.position.copy(this._restPos);
    this.group.rotation.copy(this._restRot);
    this.group.renderOrder = 999;
    camera.add(this.group);

    this._t = 0;
    this._active = false;
    this._contacted = false;
    this._bob = 0;
    this.onContact = null;
  }

  pet() {
    if (this._active) return false;
    this._active = true;
    this._t = 0;
    this._contacted = false;
    return true;
  }

  get isPetting() {
    return this._active;
  }

  /** @param {number} dt seconds  @param {number} speed current move speed (idle bob) */
  update(dt, speed = 0) {
    this._bob += dt * (3 + speed * 2);
    const bobY = Math.sin(this._bob) * 0.006 * (0.4 + Math.min(speed, 3));
    const bobX = Math.cos(this._bob * 0.5) * 0.004 * (0.4 + Math.min(speed, 3));

    if (this._active) {
      this._t += dt / REACH_DURATION;
      if (this._t >= 1) {
        this._t = 0;
        this._active = false;
      }
    }

    // Out-and-back progress.
    const tri = this._active ? 1 - Math.abs(this._t * 2 - 1) : 0;
    const p = easeInOut(tri);

    if (this._active && !this._contacted && this._t >= CONTACT_AT) {
      this._contacted = true;
      this.onContact && this.onContact();
    }

    // Visible stroking: a few downward sweeps while the hand is near the cat.
    const stroke = this._active ? Math.sin(this._t * Math.PI * 6) * 0.06 * p : 0;

    this.group.position.lerpVectors(this._restPos, this._reachPos, p);
    this.group.position.x += bobX;
    this.group.position.y += bobY + stroke;

    this.group.rotation.x =
      THREE.MathUtils.lerp(this._restRot.x, this._reachRot.x, p) + stroke * 1.5;
    this.group.rotation.y = THREE.MathUtils.lerp(this._restRot.y, this._reachRot.y, p);
    this.group.rotation.z = THREE.MathUtils.lerp(this._restRot.z, this._reachRot.z, p);
  }

  dispose() {
    this.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    this.group.parent?.remove(this.group);
  }
}
