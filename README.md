# Brain Tumor Segmentation Research Repository

This repository contains research experiments for brain tumor segmentation from MRI volumes using U-Net and U-Net++ models. It includes training notebooks, inference notebooks, pretrained checkpoints, and experiment reports.

## Research Scope

- Train and evaluate U-Net and U-Net++ for medical image segmentation.
- Compare multiple training strategies (raw baseline, warmup + freeze, warmup + LR strategy).
- Store and review experiment outputs in CSV format.
- Run prediction workflows on sample FeTS/BRATS-style NIfTI data.

## Repository Structure

| Path | Description |
| --- | --- |
| `intern_unet.ipynb` | Main notebook for U-Net experiment pipeline. |
| `intern_unetpp.ipynb` | Main notebook for U-Net++ experiment pipeline. |
| `prediksi.ipynb` | Inference notebook for segmentation prediction. |
| `Pretrained/resnet_18_23dataset.pth` | Pretrained checkpoint used in experiments. |
| `ReportHasil/` | Experiment result files for U-Net and U-Net++ variants. |
| `TestData/Test/` | Sample MRI modalities and segmentation mask in `.nii` format. |

## Experiment Outputs

The `ReportHasil/` folder stores comparative reports from different setups:

- `Unet_raw.csv`
- `Unet_warmupFreeze.csv`
- `Unet_warmupLR.csv`
- `UnetPP_raw.csv`
- `UnetPP_warmupFreeze.csv`
- `UnetPP_warmupLR.csv`

These files are useful for tracking model performance and analyzing training strategy impact.

## External Resources

- **Model Weights**: [Google Drive Folder](https://drive.google.com/drive/folders/1Ex-VJU2JZhVH5xDOLeAC9zpanTRjwBAz?usp=sharing)
	- Note: use model files with the `best` label when available.
- **Dataset**: [BRATS20 Training and Validation Dataset (Kaggle)](https://www.kaggle.com/datasets/awsaf49/brats20-dataset-training-validation)
- **Documentation**: [Project Documentation (Google Docs)](https://docs.google.com/document/d/16BIlUN7SLs_-bPmNUNn9Qt092HVJ4UgH8-pk1ObLxmg/edit?usp=sharing)

## Quick Start

1. Download dataset from the Dataset link above.
2. Download model checkpoints from the Model Weights link.
3. Prepare your local folder paths to match notebook configuration.
4. Run notebooks in order based on your goal:
	 - `intern_unet.ipynb` for U-Net experiments.
	 - `intern_unetpp.ipynb` for U-Net++ experiments.
	 - `prediksi.ipynb` for prediction/inference.

## Notes

- This repository is intended for research and experimentation workflows.
- Paths, environment setup, and runtime parameters may need local adjustments.
