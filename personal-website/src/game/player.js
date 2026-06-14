// player.js
// The player is a single dynamic sphere body. Crucially, movement is applied as
// *velocity* (not by writing body.position directly like the old code did) so the
// physics solver resolves collisions against the wall colliders — you simply stop
// at walls instead of drifting through them. Look direction (yaw/pitch) is owned by
// the engine and shared by both desktop and mobile controls.

import * as CANNON from "cannon-es";
import * as THREE from "three";

const RADIUS = 0.3; // player "capsule" radius in metres
const EYE_HEIGHT = 1.72; // camera height above the floor — adult human height
const MOVE_SPEED = 3.2; // metres/second
const ACCEL = 12; // how quickly we reach target velocity (higher = snappier)

export class Player {
  /**
   * @param {CANNON.World} world
   * @param {{min:THREE.Vector3, center:THREE.Vector3}} bounds room bounds for spawn
   * @param {CANNON.Material} material physics material (friction tuned in engine)
   */
  constructor(world, bounds, material) {
    this.world = world;
    this.radius = RADIUS;

    const body = new CANNON.Body({
      mass: 70,
      material,
      shape: new CANNON.Sphere(RADIUS),
      fixedRotation: true, // never topple
      linearDamping: 0.9, // glide to a stop quickly when input releases
    });
    body.updateMassProperties();

    // Spawn a touch above the floor near the room centre.
    body.position.set(
      bounds.center.x,
      bounds.min.y + RADIUS + 0.05,
      bounds.center.z + 0.5
    );
    world.addBody(body);
    this.body = body;

    // Reusable temporaries (avoid per-frame allocation).
    this._forward = new THREE.Vector3();
    this._right = new THREE.Vector3();
    this._desired = new THREE.Vector3();
  }

  /** World-space eye position for the camera. */
  getEyePosition(target) {
    target.set(
      this.body.position.x,
      this.body.position.y + (EYE_HEIGHT - RADIUS),
      this.body.position.z
    );
    return target;
  }

  /**
   * @param {{x:number,y:number}} move  strafe (x) / forward (y), each -1..1
   * @param {number} yaw                current camera yaw in radians
   * @param {number} dt                 seconds since last frame
   */
  update(move, yaw, dt) {
    // Build horizontal forward/right from yaw only (pitch shouldn't affect walking).
    this._forward.set(-Math.sin(yaw), 0, -Math.cos(yaw));
    this._right.set(Math.cos(yaw), 0, -Math.sin(yaw));

    this._desired
      .set(0, 0, 0)
      .addScaledVector(this._forward, move.y)
      .addScaledVector(this._right, move.x);

    if (this._desired.lengthSq() > 1) this._desired.normalize();
    this._desired.multiplyScalar(MOVE_SPEED);

    // Smoothly approach the target horizontal velocity; leave Y to gravity.
    const v = this.body.velocity;
    const lerp = 1 - Math.exp(-ACCEL * dt); // frame-rate independent smoothing
    v.x += (this._desired.x - v.x) * lerp;
    v.z += (this._desired.z - v.z) * lerp;
  }

  dispose() {
    this.world.removeBody(this.body);
  }
}
