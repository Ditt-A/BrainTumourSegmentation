# Research setup and path migration

The notebooks implement 3D U-Net / U-Net++ decoders with a MedicalNet ResNet18 encoder using PyTorch and MONAI. Four MRI channels are combined in the order FLAIR, T1, T1Gd/T1ce, T2. Targets follow the original notebook logic: ET is label 4, TC is labels 1 and 4, and WT is labels 1, 2 and 4. Region masks overlap by design.

## Working directories

Open Jupyter from the repository root or `notebooks/`. The first code cell locates `scripts/project_paths.py` by searching the current directory and its parents. The shared module anchors paths to its own repository location, so later training or prediction cells do not depend on the notebook directory.

| Previous location | Current location |
| --- | --- |
| Root `.ipynb` files | `notebooks/` with original filenames |
| `TestData/Test/` | `data/samples/FeTS21_Training_001/` |
| Full training `data/` contents | Local `data/raw/` |
| `Pretrained/` | `models/pretrained/` |
| Experiment checkpoint folders | Local `models/checkpoints/<experiment>/` |
| `ReportHasil/` | `reports/experiments/` |
| Embedded notebook PNG outputs | `reports/figures/` with a source manifest |

The prediction notebook no longer refers to an absolute path on the original research machine. Its default sample folder points to the checked-in case. Each experiment has its own checkpoint directory and override variable. Trained checkpoint filenames are preserved, and absent checkpoints still need to be supplied before running prediction cells.

## Optional configuration

Set environment variables before starting the notebook kernel. Relative values resolve from the repository root; blank values use defaults. `.env.example` documents the variable names but is not automatically loaded.

| Variable | Default |
| --- | --- |
| `BTS_DATA_DIR` | `data/raw` |
| `BTS_SAMPLE_DIR` | `data/samples/FeTS21_Training_001` |
| `BTS_PRETRAINED_PATH` | `models/pretrained/resnet_18_23dataset.pth` |
| `BTS_CHECKPOINT_DIR` | `models/checkpoints` |
| `BTS_UNETPP_LR_CHECKPOINT` | Historical filename in `unetpp_warmup_lr` |
| `BTS_UNETPP_FREEZE_CHECKPOINT` | Historical filename in `unetpp_warmup_freeze` |
| `BTS_UNET_LR_CHECKPOINT` | Historical filename in `unet_warmup_lr` |
| `BTS_UNET_FREEZE_CHECKPOINT` | Historical filename in `unet_warmup_freeze` |
| `BTS_UNETPP_RAW_CHECKPOINT` | Historical filename in `unetpp_raw` |
| `BTS_UNET_RAW_CHECKPOINT` | Historical filename in `unet_raw` |

The optional Kaggle download cell uses existing environment authentication or `~/.kaggle/kaggle.json`. The previous hardcoded username and placeholder key were removed. There was no active key to revoke in that cell.

## Dependencies and execution

`requirements-assets.txt` is only for the CPU asset exporter. Full research additionally requires a compatible PyTorch/MONAI environment, NumPy, matplotlib, pandas, scikit-learn, nibabel, tqdm, and optional Kaggle tooling as imported by the notebooks. The original repository does not provide a locked ML environment; dependency compatibility, dataset availability, and GPU memory requirements have not been revalidated by running training or inference.

The organization fixes one pre-existing invalid assertion in the U-Net notebook: a dangling line-continuation after the condition now has an explicit assertion message. Training logic and recorded experiment values were otherwise preserved apart from path/configuration changes. Code cells are checked with Python's AST parser without executing ML imports.

MRI exports use [NiBabel's canonical orientation handling](https://nipy.org/nibabel/image_orientation.html) to permute/flip voxel axes to RAS+ without interpolation. Display exports are windowed for visibility; original NIfTI files remain unchanged. Label meanings follow the [official BraTS data description](https://www.med.upenn.edu/cbica/brats2020/data.html).
