// videoWall.js
// A big glowing screen on the back wall that auto-loops a video (your Cyberpunk
// 2077 edit). Drop your clip at /public/wall.mp4 and it plays muted on loop. Until
// a video is present (or while it loads), it shows an animated synthwave fallback
// so the wall always looks alive. Rendered with MeshBasicMaterial so it glows like
// a real screen regardless of room lighting.

import * as THREE from "three";

const NEON = 0x39c4b6;
const ASPECT = 16 / 9;

export class VideoWall {
  /** @param {string} src  path to the looping video (default /wall.mp4) */
  constructor(src = "/wall.mp4") {
    this.root = new THREE.Group();
    this._usingVideo = false;
    this._t = 0;

    const width = 4.0;
    const height = width / ASPECT - 0.2;

    // Screen material — basic + toneMapped:false so it stays bright like a display.
    this._mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      this._mat,
    );
    this.root.add(this.mesh);

    // Neon frame.
    const frameMat = new THREE.MeshStandardMaterial({
      color: NEON,
      emissive: NEON,
      emissiveIntensity: 1.4,
      roughness: 0.3,
    });
    const ft = 0.05;
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(width + ft * 2, ft, ft),
      frameMat,
    );
    top.position.y = height / 2;
    const bot = top.clone();
    bot.position.y = -height / 2;
    const left = new THREE.Mesh(
      new THREE.BoxGeometry(ft, height, ft),
      frameMat,
    );
    left.position.x = -width / 2;
    const right = left.clone();
    right.position.x = width / 2;
    this.root.add(top, bot, left, right);

    // Spill light so the screen lights the room a little.
    const glow = new THREE.PointLight(0x6fd8ff, 2, 6, 2);
    glow.position.set(0, 0, 0.5);
    this.root.add(glow);

    // Animated fallback shown until/unless a real video plays.
    this._initFallback();

    // Try to load the video.
    const video = document.createElement("video");
    video.src = src;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";
    video.crossOrigin = "anonymous";
    this._video = video;

    const useVideo = () => {
      if (this._usingVideo) return;
      const tex = new THREE.VideoTexture(video);
      tex.colorSpace = THREE.SRGBColorSpace;
      this._mat.map = tex;
      this._mat.needsUpdate = true;
      this._usingVideo = true;
      this._fallbackTex?.dispose();
      video.play().catch(() => {});
    };
    video.addEventListener("canplay", useVideo, { once: true });

    // Browsers may block autoplay until a gesture; retry on the first interaction
    // (e.g. the click that locks the pointer to start playing).
    this._kick = () =>
      video
        .play()
        .then(useVideo)
        .catch(() => {});
    window.addEventListener("pointerdown", this._kick, { once: true });

    video.load();
    video.play().catch(() => {});
  }

  _initFallback() {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 288;
    this._fc = c;
    this._fctx = c.getContext("2d");
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    this._fallbackTex = tex;
    this._mat.map = tex;
  }

  _drawFallback(t) {
    const ctx = this._fctx;
    const W = this._fc.width;
    const H = this._fc.height;
    // sky gradient
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0a0420");
    g.addColorStop(0.55, "#2a0b3a");
    g.addColorStop(0.7, "#5e1747");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // neon sun
    const sunY = H * 0.62;
    ctx.fillStyle = "#ff2d8d";
    ctx.beginPath();
    ctx.arc(W / 2, sunY, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = g; // mask lower half with sun-stripes
    for (let i = 0; i < 6; i++) {
      const y = sunY + 6 + i * 9;
      ctx.fillRect(W / 2 - 70, y, 140, 4 + i);
    }

    // perspective grid floor
    const horizon = H * 0.7;
    ctx.strokeStyle = "rgba(57,196,182,0.8)";
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(W / 2 + i * 12, horizon);
      ctx.lineTo(W / 2 + i * 120, H);
      ctx.stroke();
    }
    const scroll = (t * 60) % 24;
    for (let j = 0; j < 14; j++) {
      const y =
        horizon +
        ((j * 24 + scroll) % (H - horizon)) * ((H - horizon) / (H - horizon));
      const yy = horizon + ((j * 24 + scroll) % (H - horizon));
      ctx.beginPath();
      ctx.moveTo(0, yy);
      ctx.lineTo(W, yy);
      ctx.globalAlpha = (yy - horizon) / (H - horizon);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // glitchy title
    ctx.font = "bold 34px monospace";
    ctx.textAlign = "center";
    const jitter = Math.sin(t * 40) > 0.93 ? (Math.random() - 0.5) * 6 : 0;
    ctx.fillStyle = "#39c4b6";
    ctx.fillText("CYBER", W / 2 + jitter, H * 0.32);
    ctx.fillStyle = "#FCEE0A";
    ctx.fillText("PUNK", W / 2 - jitter, H * 0.46);

    // scanlines
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

    this._fallbackTex.needsUpdate = true;
  }

  /** Place on a wall: position `pos`, rotated so its face points by `yaw`. */
  place(pos, yaw = Math.PI) {
    this.root.position.copy(pos);
    this.root.rotation.y = yaw;
  }

  update(dt) {
    if (this._usingVideo) return; // VideoTexture updates itself
    this._t += dt;
    this._drawFallback(this._t);
  }

  dispose() {
    window.removeEventListener("pointerdown", this._kick);
    if (this._video) {
      this._video.pause();
      this._video.removeAttribute("src");
      this._video.load();
    }
    this._mat.map?.dispose();
    this._fallbackTex?.dispose();
    this.root.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => m.dispose());
      }
    });
  }
}
