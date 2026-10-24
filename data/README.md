# MRI data

`samples/FeTS21_Training_001/` contains the five original files moved from `TestData/Test/`:

| Suffix | Contents |
| --- | --- |
| `_flair.nii` | FLAIR volume |
| `_t1.nii` | T1-weighted volume |
| `_t1ce.nii` | Contrast-enhanced T1 volume; the notebooks also use the key `t1gd` |
| `_t2.nii` | T2-weighted volume |
| `_seg.nii` | Dataset reference segmentation with labels 0, 1, 2, 4 |

All five files are unchanged from [the original repository snapshot](https://github.com/Ditt-A/BrainTumourSegmentation/tree/6a8b6e9a701926256e670feee97f8ec988feef4f/TestData/Test). The sample filenames identify a FeTS21 case; the training notebooks separately reference the BraTS20 Kaggle collection. No new claim is made about equivalence between those dataset releases.

Use `raw/` for the full training dataset. This directory is ignored by Git. Preserve one patient directory per case with its four modalities and segmentation file. Set `BTS_DATA_DIR` before starting Jupyter to use another location. The optional Kaggle cell extracts into that configured training-data directory and uses your existing Kaggle authentication.

The website-ready assets under [assets/images/dataset](../assets/images/dataset) are reproducible display exports of these volumes, not replacement research inputs. Their [manifest](../assets/images/dataset/manifest.json) records the source hashes, affine/orientation, intensity windows, and selected slices. The mask overlays use reference annotations and do not represent newly computed predictions.

BraTS label definitions and dataset attribution are described in the [official BraTS data documentation](https://www.med.upenn.edu/cbica/brats2020/data.html). Refer to that documentation and the original collection for usage terms and citations.
