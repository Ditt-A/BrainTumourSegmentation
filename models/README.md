# Model files

`pretrained/resnet_18_23dataset.pth` is the original MedicalNet pretrained checkpoint pointer, preserved through Git LFS. Its binary is 131,992,196 bytes; the source checkout can retain the small pointer without downloading the binary. The existing `*.pth` LFS rule still applies after the move.

Only fetch the binary when you intend to run research:

```bash
git lfs pull --include="models/pretrained/resnet_18_23dataset.pth"
```

Place trained segmentation checkpoints under the ignored `checkpoints/` directory:

```text
checkpoints/
├── unet_warmup_lr/
├── unet_warmup_freeze/
├── unet_raw/
├── unetpp_warmup_lr/
├── unetpp_warmup_freeze/
└── unetpp_raw/
```

Training saves into these separate experiment directories. Prediction defaults retain the historical checkpoint filenames, including their original `unetpp_` prefix for U-Net experiments. Those trained checkpoint binaries are not included in Git. The [original model collection](https://huggingface.co/ditt-a/3D_UnetPlusPlus_Brain_Tumour_Segmentation) remains an external resource; it was not downloaded while preparing the assets.

Use `BTS_PRETRAINED_PATH`, `BTS_CHECKPOINT_DIR`, or the per-experiment overrides in [.env.example](../.env.example) to point notebooks at existing files. Importing `scripts/project_paths.py` only resolves paths; it does not load weights or create a model.
