import { asset } from "./main.js";

const initial = () => ({
  modality: "flair",
  annotation: true,
  opacity: 65,
  zoom: 1,
  pan: { x: 0, y: 0 },
  regions: { et: true, tc: true, wt: true },
});
let state = initial();
const viewer = document.querySelector("#medical-viewer");
const stack = document.querySelector("#scan-stack");
const name = () =>
  state.modality === "t1ce" ? "T1ce" : state.modality.toUpperCase();

function drawViewport() {
  const maxX =
    state.zoom > 1
      ? Math.max(
          0,
          (stack.offsetWidth * state.zoom - viewer.clientWidth) / 2 + 12,
        )
      : 0;
  const maxY =
    state.zoom > 1
      ? Math.max(
          0,
          (stack.offsetHeight * state.zoom - viewer.clientHeight) / 2 + 12,
        )
      : 0;
  state.pan.x = Math.max(-maxX, Math.min(maxX, state.pan.x));
  state.pan.y = Math.max(-maxY, Math.min(maxY, state.pan.y));
  stack.style.transform =
    "translate(" +
    state.pan.x +
    "px," +
    state.pan.y +
    "px) scale(" +
    state.zoom +
    ")";
  viewer.dataset.zoomed = String(state.zoom > 1);
}

function announce() {
  const count = Object.values(state.regions).filter(Boolean).length;
  document.querySelector("#workspace-status").textContent =
    "Menampilkan " +
    name() +
    (state.annotation
      ? " dengan " + count + " lapisan anotasi referensi."
      : " tanpa anotasi.") +
    (state.zoom > 1
      ? " Perbesaran " + Math.round(state.zoom * 100) + "%."
      : "");
}

function render({ speak = true } = {}) {
  document.querySelectorAll("[data-sim-modality]").forEach((button) => {
    const selected = button.dataset.simModality === state.modality;
    button.setAttribute("aria-pressed", String(selected));
    button.querySelector("i").textContent = selected ? "✓" : "";
  });
  const image = document.querySelector("#sim-base");
  const url = asset("dataset/axial-" + state.modality);
  if (image.getAttribute("src") !== url) image.src = url;
  image.alt = "MRI " + name() + " pada irisan axial 67";
  document.querySelector("#viewer-title").textContent = name();
  document.querySelector("#image-caption").textContent =
    name() + " · axial · irisan 67";
  const count = Object.values(state.regions).filter(Boolean).length;
  document.querySelector("#viewer-mode").textContent = !state.annotation
    ? "MRI asli"
    : count
      ? "Anotasi referensi"
      : "Tanpa lapisan aktif";
  document
    .querySelector("#view-original")
    .setAttribute("aria-pressed", String(!state.annotation));
  document
    .querySelector("#view-overlay")
    .setAttribute("aria-pressed", String(state.annotation));
  for (const region of ["et", "tc", "wt"]) {
    document.querySelector("#layer-" + region).style.opacity =
      state.annotation && state.regions[region] ? state.opacity / 100 : 0;
    document.querySelector('[data-region="' + region + '"]').checked =
      state.regions[region];
  }
  document.querySelector("#region-controls").disabled = !state.annotation;
  document.querySelector("#overlay-opacity").disabled = !state.annotation;
  document.querySelector("#controls-hint").hidden = state.annotation;
  document.querySelector("#region-count").textContent = state.annotation
    ? count + " lapisan aktif"
    : "Disembunyikan";
  document.querySelector("#zoom-level").textContent =
    Math.round(state.zoom * 100) + "%";
  document.querySelector("#zoom-out").disabled = state.zoom <= 1;
  document.querySelector("#zoom-in").disabled = state.zoom >= 1.8;
  document.querySelector("#overlay-opacity").value = state.opacity;
  document.querySelector("#opacity-value").textContent = state.opacity + "%";
  document.querySelector("#viewer-instructions").textContent =
    state.zoom > 1
      ? "Geser citra atau gunakan tombol panah. Tekan 100% untuk kembali."
      : "Gunakan + untuk melihat citra lebih dekat.";
  drawViewport();
  if (speak) announce();
}

document.querySelectorAll("[data-sim-modality]").forEach((button) =>
  button.addEventListener("click", () => {
    state.modality = button.dataset.simModality;
    render();
  }),
);
document.querySelectorAll("[data-region]").forEach((input) =>
  input.addEventListener("change", () => {
    state.regions[input.dataset.region] = input.checked;
    render();
  }),
);
document.querySelector("#view-original").addEventListener("click", () => {
  state.annotation = false;
  render();
});
document.querySelector("#view-overlay").addEventListener("click", () => {
  state.annotation = true;
  render();
});
document
  .querySelector("#overlay-opacity")
  .addEventListener("input", (event) => {
    state.opacity = Number(event.target.value);
    render({ speak: false });
  });
document.querySelector("#overlay-opacity").addEventListener("change", announce);
document.querySelector("#zoom-in").addEventListener("click", () => {
  state.zoom = Math.min(1.8, Math.round((state.zoom + 0.2) * 10) / 10);
  render();
});
document.querySelector("#zoom-out").addEventListener("click", () => {
  state.zoom = Math.max(1, Math.round((state.zoom - 0.2) * 10) / 10);
  render();
});
document.querySelector("#zoom-fit").addEventListener("click", () => {
  state.zoom = 1;
  state.pan = { x: 0, y: 0 };
  render();
});
document.querySelector("#reset-view").addEventListener("click", () => {
  state = initial();
  render();
});

let drag = null;
viewer.addEventListener("pointerdown", (event) => {
  if (
    state.zoom <= 1 ||
    event.target.closest("button") ||
    (event.pointerType === "mouse" && event.button !== 0)
  )
    return;
  drag = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    panX: state.pan.x,
    panY: state.pan.y,
  };
  viewer.setPointerCapture(event.pointerId);
  viewer.classList.add("dragging");
});
viewer.addEventListener("pointermove", (event) => {
  if (!drag || drag.id !== event.pointerId) return;
  state.pan.x = drag.panX + event.clientX - drag.x;
  state.pan.y = drag.panY + event.clientY - drag.y;
  drawViewport();
});
function endDrag() {
  drag = null;
  viewer.classList.remove("dragging");
}
viewer.addEventListener("pointerup", endDrag);
viewer.addEventListener("pointercancel", endDrag);
viewer.addEventListener("lostpointercapture", endDrag);
viewer.addEventListener("keydown", (event) => {
  if (state.zoom <= 1 || event.target !== viewer) return;
  const moves = {
    ArrowLeft: [-32, 0],
    ArrowRight: [32, 0],
    ArrowUp: [0, -32],
    ArrowDown: [0, 32],
  };
  if (!moves[event.key]) return;
  event.preventDefault();
  state.pan.x += moves[event.key][0];
  state.pan.y += moves[event.key][1];
  drawViewport();
});
new ResizeObserver(drawViewport).observe(viewer);

const narrow = matchMedia("(max-width: 820px)");
const panel = document.querySelector("#layers-panel");
const slot = document.querySelector("#mobile-controls");
function placeControls() {
  const active = document.activeElement;
  const restore = panel.contains(active);
  if (narrow.matches) {
    slot.hidden = false;
    slot.append(panel);
    panel.classList.add("compact");
  } else {
    document.querySelector("#layers-home").before(panel);
    panel.classList.remove("compact");
    slot.hidden = true;
  }
  if (restore) active.focus({ preventScroll: true });
}
narrow.addEventListener("change", placeControls);
placeControls();
render();
