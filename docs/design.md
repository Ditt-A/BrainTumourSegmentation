# Landing and simulation design

A working two-page design preview lives in `design/`. The visual direction combines cool ivory, ink typography, muted teal actions, generous whitespace, thin dividers, and Manrope. Editorial photos provide context; original MRI and reference annotations provide the explorable content. No endorsements, customer logos, testimonials, accuracy numbers, or clinical performance claims were invented.

[Nalagenetics](https://www.nalagenetics.com/en) was inspected as an Indonesian healthcare-company reference for navigation, a left headline beside a large visual, spacing, and primary actions. Its images, wording, branding, and press strip were not reused. The reference screenshot is retained in the local review folder outside the repository.

## Landing

| Area                 | Content and interaction                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------- |
| Navbar               | Brain Tumour wordmark, real section anchors, simulation CTA, mobile menu                  |
| Hero left            | “Jelajahi MRI otak. Pahami lapisannya.”, short explanation, simulation CTA and MRI anchor |
| Hero right           | Actual GLB brain surface, slow rotation, pointer/keyboard rotation, pause/resume          |
| Introduction         | MRI-room image and concise imaging context                                                |
| Modality explorer    | Four keyboard-accessible tabs changing registered MRI images at the same slice            |
| Reference comparison | Range-slider comparison of original FLAIR and dataset reference overlay                   |
| Review context       | Collaborative editorial image and simulation CTA                                          |
| FAQ                  | Model state, dataset origin, and internal-example behavior                                |
| Footer               | Working product/resource destinations, developer link and illustration/reference context  |

On phones, text precedes the 3D view. Sections and controls stack without horizontal overflow.

## Simulation

The desktop workspace places sample/modality selection on the left, the MRI viewer in the center, and reference controls on the right. Annotation controls move below on tablets. On phones, the compact controls sit directly below the image, before image metadata and reset; the single set of controls moves in the DOM without duplicating IDs or resetting selections. Case metadata is collapsed so the image appears sooner.

The example is FeTS21_Training_001, axial slice 67. All four registered modalities are available. Reference layers are visible initially. One stable-label selector, “MRI asli” / “Dengan anotasi”, controls the view; the previous duplicate primary annotation button is removed. Hiding annotations disables the layer and opacity controls with an explanation, while preserving selections. An active-layer count reflects the current state. ET/TC/WT remain overlapping regions, stacked WT then TC then ET. Opacity changes no longer silently switch display mode.

Zoom ranges from 100% to 180%. Pointer drag and arrow keys pan the enlarged image within bounds; the 100% button restores fit. Changing modality preserves the viewed area because the source images are registered. Reset restores FLAIR, reference layers on, all three regions selected, 65% layer strength, and 100% zoom. Slider announcements are deferred until a value is committed rather than repeated for every input event.

The visible notice states that the segmentation model is not loaded. Annotation is existing dataset reference material. There is no upload, login, external-image fetch, model load, inference endpoint, or fabricated confidence score. A live model/API connection is a subsequent implementation step.

## Motion and 3D

The brain completes one vertical-axis rotation in 80 seconds. Dragging orbits the camera; a labelled ordinary action button pauses/resumes rotation. The focusable 3D group also supports arrow keys, which pause automatic motion. The canvas permits native vertical page scrolling on touch devices. Rendering is capped at 30 fps and device-pixel ratio 1.5. Animation stops outside the hero and in hidden browser tabs. Reduced motion disables automatic rotation and page entrance/scroll transitions; the user may explicitly start rotation.

The mesh is approximately 1.29 MB with 53,860 triangles, one standard material, simple lights, and no real-time shadows, postprocessing, or volume ray-marching. Its code loads only on the landing page. A transparent brain image remains as fallback if WebGL or mesh loading is unavailable. [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html) loads the GLB.

The surface comes from the largest nonzero component of the checked-in skull-stripped T1, with closing, hole filling, light smoothing, and marching cubes. It is centered and scaled for presentation, not a tumor prediction or clinical reconstruction. [Provenance](../assets/models/manifest.json) records source/output hashes. `scripts/export_brain_mesh.py` reproduces it on the CPU with `requirements-mesh.txt`.

The brain uses a matte gray-pink tissue palette with slight vertex-color variation, no metalness, and warm neutral lights. The teal cast is removed; this changes presentation material, not the source geometry or any reference annotation.

Hero content enters over 0.8 seconds with a short stagger. Section reveals take about 0.65 seconds. Tab images and reference layers crossfade in 0.2–0.24 seconds. Hover movement is small; the comparison slider follows input directly.

## Typography and control hierarchy

| Role                   | Size and purpose                                                |
| ---------------------- | --------------------------------------------------------------- |
| Landing H1             | 64px on a wide desktop, 37–48px on phones; explicit MRI subject |
| Section H2             | 31–42px; distinct from body and workspace headings              |
| Body copy              | 16–17px with 1.7–1.8 line height and limited line length        |
| Navigation and buttons | 14–15px; main actions have a 44–50px target height              |
| Workspace labels       | 13–18px according to heading/control role                       |
| Metadata               | 12–13px; only the brand descriptor is smaller                   |

Body and secondary text are darker, replacing the earlier pale 6–11px labels. Footer links use 14px text. A single primary landing CTA leads to simulation; the secondary action opens the actual MRI examples. The expected unloaded-model state is presented as information rather than an error. Menu Escape handling only returns focus when the menu was open.

Selected body/action/footer contrast pairs are measured against [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html); checked normal-text pairs exceed 4.5:1. Main buttons use comfortable target sizes, with the [minimum-target guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) as a floor. Display selectors retain stable labels per the [WAI button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/). This is focused verification, not a claim of full WCAG conformance.

## Validation

Checks cover the production build, rendered 3D rotation/pause, reduced motion, local assets, two-page navigation, mobile menu, tab keyboard interaction, image comparison, simulation controls/reset, disabled-state explanations, selection preservation, zoom/pan/fit, contrast samples, touch targets, and 320/390/768/1024/1440px layout. No ML runtime or checkpoint is loaded by these browser checks.
