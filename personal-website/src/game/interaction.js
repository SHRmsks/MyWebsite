// interaction.js
// Pure helper that decides whether the player is "able to pet" the cat: close
// enough AND roughly looking at it. The engine uses the result to show/hide the
// HUD prompt and to gate the pet action.

import * as THREE from "three";

const PET_RANGE = 2.4; // metres — forgiving so the cat is easy to interact with
const VIEW_DOT = 0.4; // cos of the half-angle the cat must be within (~66°)

const _toCat = new THREE.Vector3();
const _flatForward = new THREE.Vector3();

/**
 * @param {THREE.Vector3} eyePos     camera/eye world position
 * @param {THREE.Vector3} forward    camera forward (world, normalized)
 * @param {THREE.Vector3} catPos     cat world position
 * @returns {{inRange:boolean, distance:number}}
 */
export function evaluatePetTarget(eyePos, forward, catPos) {
  // Use horizontal (floor-plane) distance: the camera sits ~1.3m above the cat's
  // feet, so including the vertical gap would make you "too far" even when standing
  // right next to it.
  _toCat.copy(catPos).sub(eyePos);
  _toCat.y = 0;
  const distance = _toCat.length();
  if (distance > PET_RANGE) return { inRange: false, distance };

  _toCat.normalize();
  _flatForward.copy(forward);
  _flatForward.y = 0;
  _flatForward.normalize();

  const dot = _flatForward.dot(_toCat);
  return { inRange: dot > VIEW_DOT, distance };
}
