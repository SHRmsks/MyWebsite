// world.js
// The cannon-es physics world plus the static colliders that keep the player
// inside the room. Previously the scene only had a floor, so the player could
// walk straight through the walls ("move randomly"). Here we derive the room's
// axis-aligned bounding box and wrap it in six static boxes (floor, ceiling,
// 4 walls) — real physical boundaries the player body collides against.

import * as CANNON from "cannon-es";
import * as THREE from "three";

const WALL_THICKNESS = 0.5; // metres; thick enough that fast movement can't tunnel
const WALL_INSET = 0.5; // pull walls slightly inward so we stop before clipping art

/** Create the physics world with sane defaults for an FPS walk-around. */
export function createPhysicsWorld() {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = false;
  world.solver.iterations = 8;
  return world;
}

/**
 * Add floor/ceiling/walls derived from the room model's bounding box.
 * @returns {{min:THREE.Vector3, max:THREE.Vector3, center:THREE.Vector3, size:THREE.Vector3}}
 *          room bounds, used to spawn the player and place the cat.
 */
export function addRoomColliders(world, roomModel, material) {
  const box = new THREE.Box3().setFromObject(roomModel);
  const min = box.min.clone();
  const max = box.max.clone();
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  // Helper: add one static box collider centred at (cx,cy,cz) with half-extents.
  const addBox = (hx, hy, hz, cx, cy, cz) => {
    const body = new CANNON.Body({ mass: 0, material });
    body.addShape(new CANNON.Box(new CANNON.Vec3(hx, hy, hz)));
    body.position.set(cx, cy, cz);
    world.addBody(body);
    return body;
  };

  const t = WALL_THICKNESS;
  const inset = WALL_INSET;
  const innerMinX = min.x + inset;
  const innerMaxX = max.x - inset;
  const innerMinZ = min.z + inset;
  const innerMaxZ = max.z - inset;
  const wallH = size.y / 2 + t;

  // Floor & ceiling (sit just outside the visible bounds).
  addBox(size.x / 2 + t, t, size.z / 2 + t, center.x, min.y - t, center.z);
  addBox(size.x / 2 + t, t, size.z / 2 + t, center.x, max.y + t, center.z);

  // Four walls.
  addBox(t, wallH, size.z / 2, innerMinX - t, center.y, center.z); // -X
  addBox(t, wallH, size.z / 2, innerMaxX + t, center.y, center.z); // +X
  addBox(size.x / 2, wallH, t, center.x, center.y, innerMinZ - t); // -Z
  addBox(size.x / 2, wallH, t, center.x, center.y, innerMaxZ + t); // +Z

  return { min, max, center, size };
}
