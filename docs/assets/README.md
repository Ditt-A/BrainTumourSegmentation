# Asset placement guide

The asset pack uses cool ivory `#F4F7F6`, ink `#172D38`, and muted teal `#248B8B`, with natural skin tones and restrained warm accents. Generated visuals are intended as supporting imagery for the future landing page. The actual MRI and reference-mask assets come from the repository's sample volumes.

## Editorial visuals

All six were generated separately using the built-in image_gen tool. [Exact prompts](prompts/) and the [editorial manifest](editorial-manifest.json) record the prompt, dimensions, hashes, encoding, and intended placement. Original PNGs are included in the local Downloads asset pack; the repository contains the corresponding WebP files under `assets/images/editorial/`.

| Asset                     | Placement                                | Framing and motion                                                                                                                    |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `01-brain-sculpture.webp` | Hero beside the headline                 | Transparent frosted-glass brain. Keep the entire silhouette visible; a short entrance fade and slight vertical reveal suit it.        |
| `02-mri-room.webp`        | A wide section introducing MRI context   | Landscape photograph. Preserve the scanner and table; use a restrained image reveal as the section enters view.                       |
| `03-radiologist.webp`     | Benefits or closing CTA                  | Transparent fictional person. Anchor to the bottom edge of the section, keeping hands/tablet visible. Use a simple one-time entrance. |
| `04-case-review.webp`     | Collaborative review / use-case section  | Wide two-person scene. Leave the people and their interaction visible; a small hover scale can support a linked card.                 |
| `05-head-coil.webp`       | A compact supporting feature card        | Transparent equipment concept. Show the full object against ivory or pale teal; avoid cropping it into an invented scan interface.    |
| `06-imaging-desk.webp`    | Closing context or documentation section | Wide still life. Pair with a separate text column; preserve the notebook and film lightbox.                                           |

The brain is a decorative sculpture, and the people, rooms, and equipment are fictional editorial imagery. They are not project staff, a partner facility, clinical evidence, or model output. Blurred scan-like material inside generated scene photographs is incidental; it must not be reused as a dataset sample or a prediction result. Three transparent images preserve actual alpha in their WebP encodings.

## Dataset assets

The [dataset manifest](../../assets/images/dataset/manifest.json) records the five unchanged source-volume hashes, canonical affine, selected slices, display windows, and all output hashes. Run `scripts/export_mri_assets.py` to reproduce the 13 exports on the CPU. All files below are under `assets/images/dataset/`.

| Files                                                            | Intended use                                                                    |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `axial-flair`, `axial-t1`, `axial-t1ce`, `axial-t2`              | Four-modality gallery or modality switcher, all aligned at the same axial slice |
| `axial-flair-reference-overlay`                                  | Reference-mask comparison beside the original FLAIR image                       |
| `coronal-flair`, `coronal-flair-reference-overlay`               | Coronal image/reference comparison                                              |
| `sagittal-flair`, `sagittal-flair-reference-overlay`             | Sagittal image/reference comparison                                             |
| `axial-reference-labels`                                         | Transparent categorical annotation layer over the matching axial image          |
| `axial-reference-et`, `axial-reference-tc`, `axial-reference-wt` | Separate transparent region layers for an ET/TC/WT toggle                       |

Each file has a `.webp` extension. Native image dimensions and full framing are preserved; no generative restoration or upscaling was applied. The three selected slice indices maximize reference-mask area independently for each anatomical plane, so they are not a single shared crosshair coordinate.

The mutually exclusive annotation colors are teal for label 2, amber for label 1, and coral for label 4. Region layers are overlapping sets: ET = 4, TC = 1 + 4, WT = 1 + 2 + 4. Preserve these meanings when adding controls or a legend. These are reference annotations, not newly computed predictions. The exported grayscale window and overlay opacity are display choices documented in the manifest.

## Review and handoff

Open [assets/preview.html](../../assets/preview.html) locally for the asset contact sheet. A matching copy is in `Downloads/Brain-Tumour-Assets/index.html`, alongside PNGs, WebPs, prompts, and manifests. The interactive landing/simulation design is now under `design/`; see [its specification](../design.md). The additional 3D hero surface has its own [mesh provenance](../../assets/models/manifest.json) and is derived from MRI on the CPU without a trained model.
