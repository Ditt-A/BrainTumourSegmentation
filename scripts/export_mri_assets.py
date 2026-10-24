"""Export website-ready images from the checked-in MRI and reference mask.

Only NumPy, NiBabel and Pillow are used. No model is loaded or executed.
"""

import argparse
import hashlib
import json
from pathlib import Path

import nibabel as nib
import numpy as np
from PIL import Image

from project_paths import PROJECT_ROOT, SAMPLE_DIR

CASE_ID = "FeTS21_Training_001"
COLORS = {1: (216, 177, 107), 2: (72, 168, 168), 4: (224, 128, 90)}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def display_plane(volume: np.ndarray, axis: int, index: int) -> np.ndarray:
    # Canonical RAS+: image top is anterior for axial, superior otherwise.
    # X increases left to right on axial/coronal views (neurological convention).
    return np.rot90(np.take(volume, index, axis=axis))


def window_image(volume: np.ndarray) -> tuple[np.ndarray, list[float]]:
    foreground = volume[np.isfinite(volume) & (volume > 0)]
    if not foreground.size:
        raise ValueError("MRI volume has no nonzero finite voxels.")
    lower, upper = np.percentile(foreground, [1, 99])
    if upper <= lower:
        raise ValueError("MRI intensity window is degenerate.")
    normalized = np.nan_to_num((volume - lower) / (upper - lower))
    rendered = np.round(np.clip(normalized, 0, 1) * 255).astype(np.uint8)
    return rendered, [float(lower), float(upper)]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=SAMPLE_DIR)
    parser.add_argument(
        "--output", type=Path, default=PROJECT_ROOT / "assets" / "images" / "dataset"
    )
    parser.add_argument(
        "--png-copy-dir", type=Path,
        help="Optional extra directory for lossless PNG originals and WebP copies.",
    )
    args = parser.parse_args()
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    copy_dir = args.png_copy_dir.resolve() if args.png_copy_dir else None
    if copy_dir:
        copy_dir.mkdir(parents=True, exist_ok=True)

    images, source_records = {}, []
    original_affine, original_shape = None, None
    for suffix in ("flair", "t1", "t1ce", "t2", "seg"):
        path = args.source / f"{CASE_ID}_{suffix}.nii"
        image = nib.load(path)
        if original_affine is None:
            original_affine, original_shape = image.affine, image.shape
        if image.shape != original_shape or not np.allclose(image.affine, original_affine):
            raise ValueError(f"MRI/reference grids are not aligned: {path.name}")
        canonical = nib.as_closest_canonical(image)
        images[suffix] = canonical.get_fdata(dtype=np.float32)
        source_records.append({
            "file": path.name,
            "repository_path": path.resolve().relative_to(PROJECT_ROOT).as_posix()
            if path.resolve().is_relative_to(PROJECT_ROOT) else None,
            "sha256": sha256(path),
            "original_shape": list(image.shape),
            "original_axis_codes": list(nib.aff2axcodes(image.affine)),
            "canonical_axis_codes": list(nib.aff2axcodes(canonical.affine)),
            "canonical_affine": canonical.affine.tolist(),
        })

    raw_labels = images["seg"]
    if not np.array_equal(raw_labels, np.round(raw_labels)):
        raise ValueError("Reference mask contains noninteger labels.")
    labels = raw_labels.astype(np.uint8)
    if not set(np.unique(labels)).issubset({0, 1, 2, 4}):
        raise ValueError("Unexpected BraTS reference-mask label.")
    foreground = labels > 0
    if not foreground.any():
        raise ValueError("Reference mask is empty.")
    indices = {
        "axial": int(np.argmax(foreground.sum(axis=(0, 1)))),
        "coronal": int(np.argmax(foreground.sum(axis=(0, 2)))),
        "sagittal": int(np.argmax(foreground.sum(axis=(1, 2)))),
    }
    rendered, windows = {}, {}
    for modality in ("flair", "t1", "t1ce", "t2"):
        rendered[modality], windows[modality] = window_image(images[modality])
    records = []

    def save(name: str, pixels: np.ndarray, *, plane: str, modality: str,
             kind: str, labels_present: list[int] | None = None) -> None:
        image = Image.fromarray(pixels)
        dest = output / f"{name}.webp"
        image.save(dest, "WEBP", lossless=True, method=6)
        with Image.open(dest) as decoded:
            if decoded.convert(image.mode).tobytes() != image.tobytes():
                raise ValueError(f"WebP pixel roundtrip failed: {name}")
        record = {
            "id": name, "file": dest.name, "width": image.width,
            "height": image.height, "mode": image.mode, "plane": plane,
            "slice_index_canonical": indices[plane], "modality": modality,
            "kind": kind, "labels": labels_present or [],
            "sha256": sha256(dest), "bytes": dest.stat().st_size,
        }
        records.append(record)
        if copy_dir:
            image.save(copy_dir / f"{name}.png")
            (copy_dir / dest.name).write_bytes(dest.read_bytes())

    axial = indices["axial"]
    for modality in ("flair", "t1", "t1ce", "t2"):
        save(f"axial-{modality}", display_plane(rendered[modality], 2, axial),
             plane="axial", modality=modality, kind="source_mri")

    for plane, axis in (("axial", 2), ("coronal", 1), ("sagittal", 0)):
        index = indices[plane]
        gray = display_plane(rendered["flair"], axis, index)
        mask = display_plane(labels, axis, index)
        if plane != "axial":
            save(f"{plane}-flair", gray, plane=plane, modality="flair", kind="source_mri")
        rgb = np.repeat(gray[..., None], 3, axis=2)
        overlay = rgb.copy()
        for label, color in COLORS.items():
            selected = mask == label
            overlay[selected] = np.round(
                rgb[selected] * 0.48 + np.array(color, dtype=float) * 0.52
            ).astype(np.uint8)
        save(f"{plane}-flair-reference-overlay", overlay, plane=plane,
             modality="flair", kind="reference_mask_overlay", labels_present=[1, 2, 4])
        if plane == "axial":
            rgba = np.zeros((*mask.shape, 4), dtype=np.uint8)
            for label, color in COLORS.items():
                rgba[mask == label] = (*color, 200)
            save("axial-reference-labels", rgba, plane=plane,
                 modality="seg", kind="reference_mask", labels_present=[1, 2, 4])
            for region, selected, color, region_labels in (
                ("et", mask == 4, COLORS[4], [4]),
                ("tc", np.isin(mask, [1, 4]), COLORS[1], [1, 4]),
                ("wt", mask > 0, COLORS[2], [1, 2, 4]),
            ):
                layer = np.zeros((*mask.shape, 4), dtype=np.uint8)
                layer[selected] = (*color, 185)
                save(f"axial-reference-{region}", layer, plane=plane,
                     modality="seg", kind="reference_region_layer", labels_present=region_labels)

    manifest = {
        "case_id": CASE_ID,
        "source_commit": "6a8b6e9a701926256e670feee97f8ec988feef4f",
        "source_kind": "Checked-in MRI volumes and dataset reference mask; no inference.",
        "processing": {
            "orientation": "Closest canonical RAS+ using voxel permutation/flips, no resampling.",
            "display": "Neurological convention: +X right; anterior at top of axial, superior at top of coronal/sagittal.",
            "slice_selection": "Maximum reference-mask voxel count independently per anatomical axis.",
            "intensity_window": "Per-modality 1st/99th percentile of positive finite voxels; clipped to uint8.",
            "windows": windows,
            "resizing": "None; native voxel-grid pixels. Voxel spacing is recorded by affine.",
            "output": "Lossless WebP; decoded pixel equality checked against rendered arrays.",
            "reference_overlay_opacity": 0.52,
        },
        "reference_labels": {
            "1": {"name": "Necrotic/non-enhancing tumor core", "rgb": list(COLORS[1])},
            "2": {"name": "Peritumoral edema", "rgb": list(COLORS[2])},
            "4": {"name": "Enhancing tumor", "rgb": list(COLORS[4])},
        },
        "regions": {"ET": [4], "TC": [1, 4], "WT": [1, 2, 4]},
        "slices": indices,
        "sources": source_records,
        "assets": records,
    }
    manifest_path = output / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    if copy_dir:
        (copy_dir / "manifest.json").write_bytes(manifest_path.read_bytes())
    print(f"Exported {len(records)} MRI/reference assets to {output}")
    print(f"Canonical slices: {indices}; model imports: none")


if __name__ == "__main__":
    main()
