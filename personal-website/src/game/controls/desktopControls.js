// desktopControls.js
// Mouse-look (via the Pointer Lock API) + WASD movement for desktop. We implement
// pointer lock manually instead of three's PointerLockControls so look state lives
// in one place (the shared `input` object) and works identically to the mobile path.
//
// The shared input contract (mutated here, read + reset by the engine each frame):
//   input.move      : { x, y }  strafe / forward, each -1..1
//   input.lookDelta : { x, y }  accumulated raw pixel deltas since last frame
//   input.interactRequested : boolean  (E key, or click while locked)

export function createDesktopControls(input, { canvas, onLockChange }) {
  const keys = {};

  const syncMove = () => {
    input.move.x = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    input.move.y = (keys.w ? 1 : 0) - (keys.s ? 1 : 0);
  };

  const onKeyDown = (e) => {
    const k = e.key.toLowerCase();
    if (k === "w" || k === "a" || k === "s" || k === "d") {
      keys[k] = true;
      syncMove();
    } else if (k === "e") {
      input.interactRequested = true;
    }
    // Esc is handled by the browser, which exits pointer lock and fires
    // pointerlockchange below — no manual handling needed.
  };

  const onKeyUp = (e) => {
    const k = e.key.toLowerCase();
    if (k === "w" || k === "a" || k === "s" || k === "d") {
      keys[k] = false;
      syncMove();
    }
  };

  const requestLock = () => {
    if (document.pointerLockElement !== canvas) canvas.requestPointerLock();
  };

  // Click locks the view when paused; while playing it fires the interaction
  // (throw dart / access terminal / pet) just like pressing E.
  const onCanvasClick = () => {
    if (document.pointerLockElement === canvas) input.interactRequested = true;
    else requestLock();
  };

  const onMouseMove = (e) => {
    if (document.pointerLockElement !== canvas) return;
    input.lookDelta.x += e.movementX;
    input.lookDelta.y += e.movementY;
  };

  const onPointerLockChange = () => {
    const locked = document.pointerLockElement === canvas;
    if (!locked) {
      // Stop dead when the player tabs out / hits Esc.
      keys.w = keys.a = keys.s = keys.d = false;
      syncMove();
    }
    onLockChange && onLockChange(locked);
  };

  canvas.addEventListener("click", onCanvasClick);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("pointerlockchange", onPointerLockChange);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  return {
    isMobile: false,
    requestLock,
    dispose() {
      canvas.removeEventListener("click", onCanvasClick);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (document.pointerLockElement === canvas) document.exitPointerLock();
    },
  };
}
