# Landing and simulation design

A working two-page design preview lives in `design/`. The visual direction combines cool ivory, ink typography, muted teal actions, generous whitespace, thin dividers, and Manrope. Editorial photos provide context; original MRI and reference annotations provide the explorable content. No endorsements, customer logos, testimonials, accuracy numbers, or clinical performance claims were invented.

[Nalagenetics](https://www.nalagenetics.com/en) was inspected as an Indonesian healthcare-company reference for navigation, a left headline beside a large visual, spacing, and primary actions. Its images, wording, branding, and press strip were not reused. The reference screenshot is retained in the local review folder outside the repository.

## Landing

| Area                 | Content and interaction                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------- |
| Navbar               | Brain Tumour wordmark, real section anchors, simulation CTA, mobile menu                      |
| Hero left            | “Lihat citranya. Pahami setiap lapisannya.”, short explanation, simulation CTA and MRI anchor |
| Hero right           | Actual GLB brain surface, slow rotation, pointer orbit, pause/resume                          |
| Introduction         | MRI-room image and concise imaging context                                                    |
| Modality explorer    | Four keyboard-accessible tabs changing registered MRI images at the same slice                |
| Reference comparison | Range-slider comparison of original FLAIR and dataset reference overlay                       |
| Review context       | Collaborative editorial image and simulation CTA                                              |
| FAQ                  | Model state, dataset origin, and internal-example behavior                                    |
| Footer               | Working product/resource destinations, developer link and illustration/reference context      |

On phones, text precedes the 3D view. Sections and controls stack without horizontal overflow.

## Simulation

The desktop workspace places sample/modality selection on the left, the MRI viewer in the center, and reference controls on the right. Annotation controls move below on tablets; phones use a vertical sequence.

The example is FeTS21_Training_001, axial slice 67. All four registered modalities are available. “Citra asli” and “Dengan anotasi” switch the reference view. ET/TC/WT toggles select overlapping region layers, stacked WT then TC then ET. Intensity changes opacity; zoom ranges from 100% to 180%. Reset restores FLAIR, 100% zoom, default opacity, and the original-image view.

The visible notice states that the model is not loaded. “Tampilkan referensi” reveals existing dataset annotations. It does not perform inference or fabricate confidence scores. There is no upload, login, external-image fetch, model load, or inference endpoint. A live model/API connection is a subsequent implementation step.

## Motion and 3D

The brain completes one vertical-axis rotation in 80 seconds. Dragging orbits the camera; a labelled button pauses/resumes rotation. Rendering is capped at 30 fps and device-pixel ratio 1.5. Animation stops outside the hero and in hidden browser tabs. Reduced motion disables automatic rotation and page entrance/scroll transitions; the user may explicitly start rotation.

The mesh is approximately 1.29 MB with 53,860 triangles, one standard material, simple lights, and no real-time shadows, postprocessing, or volume ray-marching. Its code loads only on the landing page. A transparent brain image remains as fallback if WebGL or mesh loading is unavailable. [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html) loads the GLB.

The surface comes from the largest nonzero component of the checked-in skull-stripped T1, with closing, hole filling, light smoothing, and marching cubes. It is centered and scaled for presentation, not a tumor prediction or clinical reconstruction. [Provenance](../assets/models/manifest.json) records source/output hashes. `scripts/export_brain_mesh.py` reproduces it on the CPU with `requirements-mesh.txt`.

Hero content enters over 0.9 seconds with a short stagger. Section reveals take about 0.75 seconds. Tab images and reference layers crossfade in 0.24–0.25 seconds. Hover movement is small; the comparison slider follows input directly.

## Validation

Checks cover the production build, rendered 3D rotation/pause, reduced motion, local assets, two-page navigation, mobile menu, tab keyboard interaction, image comparison, simulation controls/reset, and 320/390/768/1440px layout. No ML runtime or checkpoint is loaded by these browser checks.
