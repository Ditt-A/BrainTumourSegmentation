# Experiment reports and saved figures

`experiments/` contains all six original CSV reports, unchanged:

| Architecture | Baseline | Warmup + freeze | Warmup + LR |
| --- | --- | --- | --- |
| U-Net | `Unet_raw.csv` | `Unet_warmupFreeze.csv` | `Unet_warmupLR.csv` |
| U-Net++ | `UnetPP_raw.csv` | `UnetPP_warmupFreeze.csv` | `UnetPP_warmupLR.csv` |

Columns record epoch, training loss, validation loss, and mean/ET/TC/WT Dice. These are historical experiment logs, not newly reproduced results or a clinical validation claim.

`figures/` preserves every embedded PNG from the original three notebooks: 11 from U-Net training, 9 from U-Net++ training, and 24 from prediction. Images are decoded byte for byte from saved outputs. They include training plots, predicted contours, reference masks, and comparison views.

The [manifest](figures/manifest.json) records the original commit, notebook name, zero-based cell/output index, and SHA-256 for all 44 images. Cell indices refer to the original notebooks before the new setup cells were added. The notebooks themselves now retain lightweight source without execution counts or stored outputs.

The dataset reference overlays prepared for the website live separately under [assets/images/dataset](../assets/images/dataset). They are derived from the checked-in reference mask; the historical prediction figures above are saved model outputs from the earlier experiments. No new prediction was run during this organization.
