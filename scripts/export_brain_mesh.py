"""Build a lightweight presentation mesh from a skull-stripped MRI on the CPU.

This is a surface illustration, not a tumor prediction or volumetric viewer.
"""

import hashlib
import json
import nibabel as nib
import numpy as np
import trimesh
from scipy import ndimage
from skimage import measure

from project_paths import PROJECT_ROOT, SAMPLE_DIR


def main():
    source = SAMPLE_DIR / "FeTS21_Training_001_t1.nii"
    image = nib.as_closest_canonical(nib.load(source))
    volume = image.get_fdata(dtype=np.float32)
    mask = np.isfinite(volume) & (volume > 0)
    connected, _ = ndimage.label(mask)
    sizes = np.bincount(connected.ravel())
    sizes[0] = 0
    mask = connected == sizes.argmax()
    mask = ndimage.binary_closing(mask, iterations=1)
    mask = ndimage.binary_fill_holes(mask)
    surface = ndimage.gaussian_filter(mask.astype(np.float32), sigma=0.65)
    vertices, faces, _, _ = measure.marching_cubes(
        surface, level=0.5, step_size=2, allow_degenerate=False
    )
    # MRI canonical axes X/Y/Z -> Three.js X/Z/-Y (Y-up).
    vertices = vertices[:, [0, 2, 1]]
    vertices[:, 2] *= -1
    vertices -= (vertices.max(axis=0) + vertices.min(axis=0)) / 2
    vertices *= 2.7 / np.ptp(vertices, axis=0).max()
    mesh = trimesh.Trimesh(vertices=vertices, faces=faces, process=True)
    if mesh.volume < 0:
        mesh.invert()
    output = PROJECT_ROOT / "assets" / "models"
    output.mkdir(parents=True, exist_ok=True)
    path = output / "brain-surface.glb"
    mesh.export(path, file_type="glb", include_normals=True)
    manifest = {
        "source": source.relative_to(PROJECT_ROOT).as_posix(),
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "output": path.relative_to(PROJECT_ROOT).as_posix(),
        "output_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "vertices": len(mesh.vertices), "triangles": len(mesh.faces),
        "bytes": path.stat().st_size,
        "processing": "Largest nonzero connected component of skull-stripped T1; binary closing/fill holes; Gaussian sigma 0.65; marching cubes level 0.5 step 2; centered and scaled for display.",
        "usage": "Decorative surface mesh for the landing-page hero. Not a segmentation-model prediction, tumor visualization, or clinical reconstruction.",
        "runtime": "CPU-only scientific processing; no ML runtime or checkpoint loaded.",
    }
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Saved {path.name}: {len(mesh.faces):,} triangles; {path.stat().st_size:,} bytes.")


if __name__ == "__main__":
    main()
