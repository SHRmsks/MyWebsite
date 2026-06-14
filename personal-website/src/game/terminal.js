// terminal.js
// An in-room terminal you walk up to and activate to "jack into" the portfolio
// (instead of hitting Esc → menu). Built procedurally as a proper multi-part model:
// a pedestal, an angled monitor with a glowing animated screen, and neon trim.
// The engine handles proximity/aim + the activation flash; this owns the visuals.

import * as THREE from "three";

const NEON = 0x39c4b6;

function makeScreenTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 192;
  const ctx = c.getContext("2d");
  const draw = (t) => {
    ctx.fillStyle = "#04130f";
    ctx.fillRect(0, 0, c.width, c.height);
    // scrolling code rain
    ctx.font = "12px monospace";
    const glyphs = "01<>[]{}#$ABCDEFアイウ";
    for (let i = 0; i < 16; i++) {
      const x = 8 + i * 15;
      const yOff = (t * 40 + i * 37) % c.height;
      for (let j = 0; j < 8; j++) {
        const y = (yOff + j * 22) % c.height;
        ctx.fillStyle = j === 0 ? "#aeffe6" : `rgba(57,196,182,${0.5 - j * 0.05})`;
        ctx.fillText(glyphs[(i * 3 + j + Math.floor(t * 6)) % glyphs.length], x, y);
      }
    }
    // header
    ctx.fillStyle = "#FCEE0A";
    ctx.font = "bold 14px monospace";
    ctx.fillText("// PORTFOLIO", 10, 18);
    ctx.fillStyle = "#39c4b6";
    ctx.font = "11px monospace";
    ctx.fillText("[ ACCESS ]", 10, c.height - 12);
  };
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, ctx, c, draw };
}

export class Terminal {
  constructor() {
    this.root = new THREE.Group();
    this.position = new THREE.Vector3();
    this._t = 0;

    const metal = new THREE.MeshStandardMaterial({ color: 0x12202a, metalness: 0.7, roughness: 0.4 });
    const trim = new THREE.MeshStandardMaterial({ color: NEON, emissive: NEON, emissiveIntensity: 1.2, roughness: 0.3 });

    // Pedestal.
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.12, 16), metal);
    base.position.y = 0.06;
    this.root.add(base);
    const stem = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.95, 0.12), metal);
    stem.position.y = 0.55;
    this.root.add(stem);

    // Monitor housing, tilted back slightly.
    const housing = new THREE.Group();
    housing.position.set(0, 1.15, 0);
    housing.rotation.x = -0.18;
    this.root.add(housing);

    const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.5, 0.06), metal);
    housing.add(bezel);

    // Glowing animated screen.
    this._screen = makeScreenTexture();
    const screenMat = new THREE.MeshStandardMaterial({
      map: this._screen.tex,
      emissive: 0xffffff,
      emissiveMap: this._screen.tex,
      emissiveIntensity: 1.0,
    });
    this._screenMat = screenMat;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.42), screenMat);
    screen.position.z = 0.031;
    housing.add(screen);

    // Neon under-glow strip.
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 0.02), trim);
    strip.position.set(0, -0.27, 0.03);
    housing.add(strip);

    // A point light so it reads as a glowing object in the room.
    const glow = new THREE.PointLight(NEON, 2, 2.5, 2);
    glow.position.set(0, 1.2, 0.3);
    this.root.add(glow);
  }

  /** Place against a wall, facing toward `lookAt` (room centre). */
  place(pos, lookAt) {
    this.root.position.copy(pos);
    this.position.copy(pos);
    this.position.y += 1.15; // aim proximity at screen height
    this.root.lookAt(lookAt.x, pos.y, lookAt.z);
  }

  update(dt) {
    this._t += dt;
    this._screen.draw(this._t);
    this._screen.tex.needsUpdate = true;
    // gentle screen breathing
    this._screenMat.emissiveIntensity = 0.85 + Math.sin(this._t * 3) * 0.15;
  }

  dispose() {
    this._screen.tex.dispose();
    this.root.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => m.dispose());
      }
    });
  }
}
