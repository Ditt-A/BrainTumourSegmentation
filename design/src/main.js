import "@fontsource-variable/manrope";
import "./style.css";

const files = import.meta.glob("../../assets/images/**/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});
export function asset(name) {
  const key = "../../assets/images/" + name + ".webp";
  if (!files[key]) throw new Error("Asset not found: " + name);
  return files[key];
}
for (const image of document.querySelectorAll("img[data-asset]")) {
  image.src = asset(image.dataset.asset);
}
const logo =
  '<svg viewBox="0 0 40 40" fill="none"><path d="M19 10c-4-8-13-2-10 3-7 1-7 11 0 12-2 7 8 10 10 4V10Zm2 0c4-8 13-2 10 3 7 1 7 11 0 12 2 7-8 10-10 4V10Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 14c4-1 7 1 6 5m-7 6c4 1 7-1 6-4m15-7c-4-1-7 1-6 5m7 6c-4 1-7-1-6-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
document.querySelectorAll(".brand-mark").forEach((node) => {
  node.innerHTML = logo;
});
document.querySelector(".shared-footer").innerHTML =
  '<div class="container footer-main"><div class="footer-about"><a class="brand" href="./index.html"><span class="brand-mark">' +
  logo +
  '</span><span>Brain Tumour<small>SEGMENTATION</small></span></a><p>Ruang visual untuk menjelajahi<br>citra MRI dan anotasi referensinya.</p></div><div><h2>Eksplorasi</h2><a href="./index.html#modalitas">Modalitas MRI</a><a href="./index.html#referensi">Lapisan anotasi</a><a href="./simulasi.html">Ruang simulasi</a></div><div><h2>Proyek</h2><a href="https://github.com/Ditt-A/BrainTumourSegmentation" target="_blank" rel="noreferrer">Repository ↗</a><a href="https://github.com/Ditt-A/BrainTumourSegmentation/blob/main/docs/research.md" target="_blank" rel="noreferrer">Dokumentasi ↗</a><a href="https://github.com/Ditt-A" target="_blank" rel="noreferrer">Pengembang ↗</a></div><div class="footer-note"><h2>Tentang preview</h2><p>Contoh MRI memakai data asli. Overlay menampilkan anotasi referensi. Visual pendukung bersifat ilustratif.</p></div></div><div class="container footer-bottom"><span>© 2026 Brain Tumour Segmentation</span><span>MRI exploration / Reference annotation</span></div>';

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
if (menu) {
  const closeMenu = () => {
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Buka navigasi");
    nav.classList.remove("open");
  };
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Tutup navigasi" : "Buka navigasi");
    nav.classList.toggle("open", open);
  });
  nav
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (
      menu.getAttribute("aria-expanded") === "true" &&
      !event.target.closest(".site-header")
    )
      closeMenu();
  });
  matchMedia("(min-width: 1001px)").addEventListener("change", closeMenu);
}
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
if (!reduced.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((node) => {
    node.classList.add("reveal-ready");
    observer.observe(node);
  });
}

const tabs = [...document.querySelectorAll("[data-modality]")];
function chooseModality(tab) {
  tabs.forEach((node) => {
    const selected = node === tab;
    node.setAttribute("aria-selected", String(selected));
    node.tabIndex = selected ? 0 : -1;
  });
  const id = tab.dataset.modality;
  const label = id === "t1ce" ? "T1ce" : id.toUpperCase();
  const image = document.querySelector("#modality-image");
  image.src = asset("dataset/axial-" + id);
  image.alt = "MRI " + label + " pada irisan axial 67";
  document.querySelector("#modality-name").textContent = label + " / AXIAL";
  document
    .querySelector("#modality-panel")
    .setAttribute("aria-labelledby", tab.id);
  if (!reduced.matches)
    image.animate([{ opacity: 0.25 }, { opacity: 1 }], { duration: 240 });
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => chooseModality(tab));
  tab.addEventListener("keydown", (event) => {
    let next = null;
    if (event.key === "ArrowDown") next = (index + 1) % tabs.length;
    if (event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== null) {
      event.preventDefault();
      chooseModality(tabs[next]);
      tabs[next].focus();
    }
  });
});
const comparison = document.querySelector("#comparison-range");
comparison?.addEventListener("input", () => {
  document.querySelector("#comparison-overlay").style.clipPath =
    "inset(0 0 0 " + comparison.value + "%)";
  document.querySelector("#comparison-line").style.left =
    comparison.value + "%";
});
if (document.querySelector("#brain-view")) {
  import("./brain.js")
    .then(({ startBrain }) => startBrain())
    .catch(() => {
      document.querySelector("#brain-pause").hidden = true;
    });
}
if (document.querySelector("#simulation-workspace")) import("./simulation.js");
