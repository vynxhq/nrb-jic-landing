import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { nutBodyGeometry, nutThreadRing, insertGeometry, ferruleGeometry, tubeGeometry, dashDims } from "./three/jicGeometry";
import { dimensionsFor } from "./three/modelDimensions";

const steel = new THREE.MeshStandardMaterial({ color: 0xc6cbcf, metalness: 0.9, roughness: 0.33, side: THREE.DoubleSide });
const steelFlat = new THREE.MeshStandardMaterial({ color: 0xc6cbcf, metalness: 0.9, roughness: 0.33, side: THREE.DoubleSide, flatShading: true });

const KINDS: { key: string; title: string; blurb: string }[] = [
  { key: "nut", title: "JIC Nut, DASH-08", blurb: "Across-flats, height, thread series (SAE J514, pending confirmation)." },
  { key: "insert", title: "JIC Insert, DASH-08", blurb: "Overall length, flare diameter, external thread series." },
  { key: "ferrule", title: "Ferrule (Collar), DASH-08", blurb: "Outside diameter and collar length." },
  { key: "tube", title: "Steel Tube End, DASH-08", blurb: "Outside diameter (½\" tube) and length." },
];

let dimsVisible = true;
const dimsGroups: THREE.Group[] = [];
const tickers: (() => void)[] = [];

function buildCard(kind: string, title: string, blurb: string) {
  const card = document.createElement("div");
  card.className = "card";
  const canvas = document.createElement("canvas");
  canvas.className = "canvas";
  const body = document.createElement("div");
  body.className = "body";
  body.innerHTML = `<h3>${title}</h3><p>${blurb}</p>`;
  card.appendChild(canvas);
  card.appendChild(body);
  document.getElementById("grid")!.appendChild(card);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, logarithmicDepthBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth || 560, 340);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101214);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-3, 4, 2); scene.add(key);
  const fill = new THREE.DirectionalLight(0xbfd4e4, 0.5); fill.position.set(3, -1, 2); scene.add(fill);
  {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = new THREE.Scene();
    const room = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ color: 0x9aa4ae, side: THREE.BackSide }));
    env.add(room);
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    panel.position.set(-5, 6, 4); panel.lookAt(0, 0, 0); env.add(panel);
    scene.environment = pmrem.fromScene(env, 0.04).texture;
    pmrem.dispose();
  }

  const camera = new THREE.PerspectiveCamera(38, (canvas.clientWidth || 560) / 340, 0.05, 60);
  camera.position.set(1.15, 0.85, 1.9);
  camera.lookAt(0, 0, 0);

  const model = new THREE.Group();
  model.rotation.z = -Math.PI / 2; // geometry axis Y -> X
  const dims = dashDims(8);
  const steelM = steel;

  if (kind === "nut") {
    model.add(new THREE.Mesh(nutBodyGeometry(dims), steelFlat));
    const ring = nutThreadRing(dims);
    const tooth = new THREE.BoxGeometry(dims.tubeOD * 0.2, dims.tubeOD * 0.11, dims.tubeOD * 0.05);
    const teeth = new THREE.InstancedMesh(tooth, steelM, ring.count * ring.rows);
    const dummy = new THREE.Object3D();
    let i = 0;
    for (let r = 0; r < ring.rows; r++) {
      const y = -dims.tubeOD * 1.15 * 0.28 + (r / (ring.rows - 1)) * dims.tubeOD * 1.15 * 0.42;
      for (let c = 0; c < ring.count; c++) {
        const th = (c / ring.count) * Math.PI * 2;
        dummy.position.set(ring.radius * Math.sin(th), y, ring.radius * Math.cos(th));
        dummy.rotation.set(0, th, 0);
        dummy.updateMatrix();
        teeth.setMatrixAt(i++, dummy.matrix);
      }
    }
    model.add(teeth);
  } else if (kind === "insert") {
    model.add(new THREE.Mesh(insertGeometry(dims), steelM));
  } else if (kind === "ferrule") {
    model.add(new THREE.Mesh(ferruleGeometry(dims), steelM));
  } else {
    model.add(new THREE.Mesh(tubeGeometry(dims, dims.tubeOD * 2.2), steelM));
  }

  const dimsGroup = dimensionsFor(kind);
  model.add(dimsGroup);
  dimsGroups.push(dimsGroup);
  scene.add(model);

  // Full orbit interaction: drag rotates, wheel zooms. Gentle auto-spin runs
  // until the first interaction and resumes after 4 seconds of idle.
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 0.8;
  controls.maxDistance = 8;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.7;
  let idleTimer = 0;
  controls.addEventListener("start", () => {
    controls.autoRotate = false;
    window.clearTimeout(idleTimer);
  });
  controls.addEventListener("end", () => {
    idleTimer = window.setTimeout(() => (controls.autoRotate = true), 4000);
  });

  function tick() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

for (const k of KINDS) buildCard(k.key, k.title, k.blurb);

const btn = document.getElementById("toggle") as HTMLButtonElement;
btn.addEventListener("click", () => {
  dimsVisible = !dimsVisible;
  btn.textContent = dimsVisible ? "Hide dimensions" : "Show dimensions";
  for (const g of dimsGroups) g.visible = dimsVisible;
});
