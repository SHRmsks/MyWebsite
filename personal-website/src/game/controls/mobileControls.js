// mobileControls.js
// Touch controls for phones/tablets: a nipplejs virtual joystick (left half) drives
// movement, and dragging anywhere on the right half drives look. The "Pet" button
// lives in the React HUD and calls engine.requestPet(), so it isn't handled here.
//
// Writes into the same shared `input` contract as desktopControls.

import nipplejs from "nipplejs";

const LOOK_ZONE_START = 0.42; // touches starting right of this fraction = look

export function createMobileControls(input, { container }) {
  // Joystick lives in its own zone element on the lower-left.
  const zone = document.createElement("div");
  Object.assign(zone.style, {
    position: "absolute",
    left: "0",
    bottom: "0",
    width: "45%",
    height: "55%",
    zIndex: "20",
    touchAction: "none",
  });
  container.appendChild(zone);

  const joystick = nipplejs.create({
    zone,
    mode: "dynamic",
    color: "#39c4b6",
    size: 110,
    fadeTime: 100,
  });

  joystick.on("move", (_evt, data) => {
    if (!data.vector) return;
    const f = Math.min(data.force ?? 1, 1.4);
    input.move.x = data.vector.x * f;
    input.move.y = data.vector.y * f; // up on stick = forward
  });
  joystick.on("end", () => {
    input.move.x = 0;
    input.move.y = 0;
  });

  // Look: track a single touch that began on the right side of the screen.
  let lookId = null;
  let lastX = 0;
  let lastY = 0;

  const isLookTouch = (t) => t.clientX > window.innerWidth * LOOK_ZONE_START;

  const onTouchStart = (e) => {
    if (lookId !== null) return;
    for (const t of e.changedTouches) {
      if (isLookTouch(t)) {
        lookId = t.identifier;
        lastX = t.clientX;
        lastY = t.clientY;
        break;
      }
    }
  };

  const onTouchMove = (e) => {
    if (lookId === null) return;
    for (const t of e.changedTouches) {
      if (t.identifier === lookId) {
        input.lookDelta.x += t.clientX - lastX;
        input.lookDelta.y += t.clientY - lastY;
        lastX = t.clientX;
        lastY = t.clientY;
        break;
      }
    }
  };

  const onTouchEnd = (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === lookId) {
        lookId = null;
        break;
      }
    }
  };

  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("touchcancel", onTouchEnd, { passive: true });

  return {
    isMobile: true,
    requestLock: () => {}, // no pointer lock on touch
    dispose() {
      joystick.destroy();
      zone.remove();
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    },
  };
}
