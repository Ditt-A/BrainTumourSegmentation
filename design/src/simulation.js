import { asset } from "./main.js";

const initial = () => ({
  modality: "flair",
  annotation: false,
  opacity: 65,
  zoom: 1,
  regions: { et: true, tc: true, wt: true },
});
let state = initial();
const name = () =>
  state.modality === "t1ce" ? "T1ce" : state.modality.toUpperCase();
function render() {
  document
    .querySelectorAll("[data-sim-modality]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.simModality === state.modality),
      ),
    );
  const image = document.querySelector("#sim-base");
  image.src = asset("dataset/axial-" + state.modality);
  image.alt = "MRI " + name() + " pada irisan axial 67";
  document.querySelector("#viewer-title").textContent = name();
  document.querySelector("#viewer-mode").textContent = state.annotation
    ? "ANOTASI REFERENSI"
    : "MRI ASLI";
  document
    .querySelector("#view-original")
    .setAttribute("aria-pressed", String(!state.annotation));
  document
    .querySelector("#view-overlay")
    .setAttribute("aria-pressed", String(state.annotation));
  document
    .querySelector("#show-reference")
    .setAttribute("aria-pressed", String(state.annotation));
  document.querySelector("#show-reference").innerHTML =
    (state.annotation ? "Sembunyikan referensi" : "Tampilkan referensi") +
    ' <span aria-hidden="true">↗</span>';
  for (const region of ["et", "tc", "wt"]) {
    document.querySelector("#layer-" + region).style.opacity =
      state.annotation && state.regions[region] ? state.opacity / 100 : 0;
    document.querySelector('[data-region="' + region + '"]').checked =
      state.regions[region];
  }
  document.querySelector("#scan-stack").style.transform =
    "scale(" + state.zoom + ")";
  document.querySelector("#zoom-level").textContent =
    Math.round(state.zoom * 100) + "%";
  document.querySelector("#zoom-out").disabled = state.zoom <= 1;
  document.querySelector("#zoom-in").disabled = state.zoom >= 1.8;
  document.querySelector("#overlay-opacity").value = state.opacity;
  document.querySelector("#opacity-value").textContent = state.opacity + "%";
  document.querySelector("#workspace-status").textContent =
    "Menampilkan " +
    name() +
    (state.annotation
      ? " dengan anotasi referensi dataset."
      : " tanpa anotasi.");
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
    state.annotation = true;
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
document.querySelector("#show-reference").addEventListener("click", () => {
  state.annotation = !state.annotation;
  render();
});
document
  .querySelector("#overlay-opacity")
  .addEventListener("input", (event) => {
    state.opacity = Number(event.target.value);
    state.annotation = true;
    render();
  });
document.querySelector("#zoom-in").addEventListener("click", () => {
  state.zoom = Math.min(1.8, Math.round((state.zoom + 0.2) * 10) / 10);
  render();
});
document.querySelector("#zoom-out").addEventListener("click", () => {
  state.zoom = Math.max(1, Math.round((state.zoom - 0.2) * 10) / 10);
  render();
});
document.querySelector("#reset-view").addEventListener("click", () => {
  state = initial();
  render();
});
render();
