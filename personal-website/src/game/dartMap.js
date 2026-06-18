// dartMap.js
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { addFootstep, loadFootsteps, hasThrown } from "@/lib/guestbook.js"; // Added hasThrown import

const W = 3.4;
const SVG_W = 1009.673;
const SVG_H = 665.963;
// Automatically calculate perfect Height so the 3D plane matches the SVG exactly
const H = W * (SVG_H / SVG_W);
const PIN = new THREE.Color(0xfcee0a);

function svgToLocal(x, y) {
  return [(x / SVG_W - 0.5) * W, (0.5 - y / SVG_H) * H];
}

async function buildContinents() {
  try {
    const text = await fetch("/world.svg").then((r) => r.text());
    const data = new SVGLoader().parse(text);
    const positions = [];
    for (const path of data.paths) {
      for (const sub of path.subPaths) {
        const pts = sub.getPoints();
        for (let i = 0; i < pts.length - 1; i++) {
          const [ax, ay] = svgToLocal(pts[i].x, pts[i].y);
          const [bx, by] = svgToLocal(pts[i + 1].x, pts[i + 1].y);
          positions.push(ax, ay, 0, bx, by, 0);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    const lines = new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({
        color: 0x5ef6ef,
        transparent: true,
        opacity: 0.9,
      }),
    );
    lines.position.z = 0.015;
    return lines;
  } catch {
    return new THREE.Group();
  }
}

async function buildMapTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#06121b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(57,196,182,0.12)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class DartMap {
  constructor() {
    this.root = new THREE.Group();
    this._t = 0;
    this._darts = [];
    this._pins = new THREE.Group();
    this._isThrowing = false; // Prevents spam clicking while dart is in-flight

    this._mat = new THREE.MeshStandardMaterial({
      color: 0x0a141c,
      emissive: 0x0a141c,
      roughness: 1.0, //
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), this._mat);
    this.root.add(this.mesh);

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x39c4b6,
      emissive: 0x39c4b6,
      emissiveIntensity: 1.4,
      roughness: 0.3,
    });
    const ft = 0.04;
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(W + ft * 2, ft, ft),
      frameMat,
    );
    top.position.y = H / 2;
    const bot = top.clone();
    bot.position.y = -H / 2;
    const left = new THREE.Mesh(new THREE.BoxGeometry(ft, H, ft), frameMat);
    left.position.x = -W / 2;
    const right = left.clone();
    right.position.x = W / 2;
    this.root.add(top, bot, left, right);

    this.root.add(this._pins);

    const glow = new THREE.PointLight(0x39c4b6, 2.5, 5, 2);
    glow.position.set(0, 0, 0.6);
    this.root.add(glow);

    this._baseY = 0;

    buildMapTexture().then((tex) => {
      this._mat.map = tex;
      this._mat.emissiveMap = tex;
      this._mat.emissive = new THREE.Color(0xffffff);
      this._mat.emissiveIntensity = 1.0;
      this._mat.needsUpdate = true;
    });

    buildContinents().then((lines) => this.root.add(lines));
  }

  place(bounds) {
    this.root.position.set(
      bounds.min.x + 0.55,
      bounds.center.y + 0.15,
      bounds.center.z,
    );
    this.root.rotation.y = Math.PI / 2;
    this._baseY = this.root.position.y;
    loadFootsteps().then((d) => this._renderPins(d));
  }

  _renderPins(footsteps) {
    footsteps.forEach((f) => this._addPin(f.x, f.y, false, f.is_owner));
  }

  _addPin(x, y, fresh, isOwner = false) {
    const lx = (x / 100 - 0.5) * W;
    const ly = (0.5 - y / 100) * H;
    const pinColor = isOwner ? new THREE.Color(0x00ff00) : PIN;
    const pin = new THREE.Mesh(
      new THREE.CircleGeometry(0.004, 16), // <-- FIX: Thinner and smaller dots
      new THREE.MeshBasicMaterial({ color: pinColor }),
    );
    pin.position.set(lx, ly, 0.015); // Pushed closer to the map to feel thinner
    pin.userData.fresh = fresh ? 0.6 : 0;
    this._pins.add(pin);
    return pin;
  }

  raycast(raycaster) {
    const hits = raycaster.intersectObject(this.mesh, false);
    if (!hits.length || !hits[0].uv) return null;
    const uv = hits[0].uv;
    return {
      point: hits[0].point.clone(),
      x: uv.x * 100,
      y: (1 - uv.y) * 100,
    };
  }

  throwAt(camera, hit, onLandCallback) {
    if (hasThrown() || this._isThrowing) return; // Prevent multiple throws
    this._isThrowing = true;

    const dart = this._makeDart();
    const from = new THREE.Vector3();
    camera.getWorldPosition(from);
    dart.position.copy(from);
    dart.lookAt(hit.point);
    this.root.parent.add(dart);
    this._darts.push({
      mesh: dart,
      from,
      to: hit.point.clone(),
      t: 0,
      landed: false,
      onLand: () => {
        this._pendingDartMesh = dart;
        if (onLandCallback) onLandCallback(hit.x, hit.y);
      },
    });
  }

  async confirmPendingPin(name, x, y) {
    const fs = await addFootstep({ name: name || "Anonymous", x, y });
    if (fs) {
      this._addPin(fs.x, fs.y, true);
    }
    this._pendingDartMesh = null;
    this._isThrowing = false; // Reset lock
  }

  cancelPendingDart() {
    if (this._pendingDartMesh) {
      this._pendingDartMesh.parent?.remove(this._pendingDartMesh);
      this._pendingDartMesh = null;
    }
    this._isThrowing = false; // Allow them to throw again
  }

  _makeDart() {
    const g = new THREE.Group();
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.16, 6),
      new THREE.MeshStandardMaterial({ color: 0xcfeae5 }),
    );
    shaft.rotation.x = Math.PI / 2;
    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.012, 0.05, 8),
      new THREE.MeshStandardMaterial({
        color: PIN,
        emissive: PIN,
        emissiveIntensity: 1.2,
      }),
    );
    tip.rotation.x = -Math.PI / 2;
    tip.position.z = 0.1;
    g.add(shaft, tip);
    return g;
  }

  update(dt) {
    this._t += dt;
    // (Map stays perfectly still — the old gentle float read as "bouncing".)
    this._pins.children.forEach((p) => {
      if (p.userData.fresh > 0) {
        p.userData.fresh -= dt;
        const k = Math.max(0, p.userData.fresh / 0.6);
        p.scale.setScalar(1 + k * 1.5);
      }
    });
    for (let i = this._darts.length - 1; i >= 0; i--) {
      const d = this._darts[i];
      if (d.landed) continue;
      d.t += dt / 0.32;
      if (d.t >= 1) {
        d.mesh.position.copy(d.to);
        d.landed = true;
        d.onLand();
      } else {
        d.mesh.position.lerpVectors(d.from, d.to, d.t);
      }
    }
  }

  dispose() {
    this._mat.map?.dispose();
    this.root.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => m.dispose());
      }
    });
    this._darts.forEach((d) => d.mesh.parent?.remove(d.mesh));
  }
}
