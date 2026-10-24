import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export async function startBrain() {
  const host = document.querySelector("#brain-view");
  const button = document.querySelector("#brain-pause");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    button.hidden = true;
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
  camera.position.set(3.8, 0.9, 4.4);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x536f65, 1.25));
  const key = new THREE.DirectionalLight(0xfff6e9, 2.5);
  key.position.set(-3, 5, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x74c7c2, 1.4);
  rim.position.set(4, 2, -3);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 0.65);
  fill.position.set(0, -2, 4);
  scene.add(fill);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = false;
  controls.minPolarAngle = Math.PI * 0.18;
  controls.maxPolarAngle = Math.PI * 0.82;
  const material = new THREE.MeshStandardMaterial({
    color: 0x8fb5aa,
    roughness: 0.48,
    metalness: 0.08,
  });
  let gltf;
  try {
    gltf = await new GLTFLoader().loadAsync(
      new URL("../../assets/models/brain-surface.glb", import.meta.url).href,
    );
  } catch {
    renderer.dispose();
    renderer.domElement.remove();
    button.hidden = true;
    return;
  }
  const brain = gltf.scene;
  brain.traverse((item) => {
    if (item.isMesh) {
      item.material = material;
      item.geometry.computeVertexNormals();
    }
  });
  brain.rotation.y = -0.5;
  brain.rotation.z = -0.035;
  scene.add(brain);
  let visible = true,
    running = !reduced.matches,
    frame = 0,
    previous = 0,
    lastPaint = 0;
  const draw = () => {
    renderer.render(scene, camera);
    host.dataset.angle = brain.rotation.y.toFixed(4);
  };
  const resize = () => {
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
    draw();
  };
  const updateButton = () => {
    button.setAttribute("aria-pressed", String(!running));
    button.setAttribute(
      "aria-label",
      running ? "Jeda putaran otak" : "Putar otak",
    );
    button.innerHTML = running
      ? "Ⅱ <span>Jeda animasi</span>"
      : "▷ <span>Putar animasi</span>";
  };
  function tick(now) {
    frame = 0;
    if (!running || !visible || document.hidden) return;
    frame = requestAnimationFrame(tick);
    if (now - lastPaint < 1000 / 30) return;
    const delta = previous ? Math.min((now - previous) / 1000, 0.1) : 0;
    brain.rotation.y += (delta * Math.PI * 2) / 80;
    previous = now;
    lastPaint = now;
    draw();
  }
  function schedule() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    if (running && visible && !document.hidden)
      frame = requestAnimationFrame(tick);
  }
  button.addEventListener("click", () => {
    running = !running;
    updateButton();
    schedule();
  });
  controls.addEventListener("change", draw);
  let wasRunning = false;
  controls.addEventListener("start", () => {
    wasRunning = running;
    running = false;
    schedule();
  });
  controls.addEventListener("end", () => {
    running = wasRunning;
    schedule();
  });
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    },
    { threshold: 0 },
  ).observe(host);
  document.addEventListener("visibilitychange", schedule);
  reduced.addEventListener("change", () => {
    running = !reduced.matches;
    updateButton();
    schedule();
  });
  addEventListener("pagehide", () => {
    running = false;
    schedule();
    renderer.dispose();
    material.dispose();
    controls.dispose();
  });
  resize();
  updateButton();
  host.dataset.ready = "true";
  schedule();
}
