"""Repository paths shared by notebooks; importing this never loads a model."""

import os
from pathlib import Path


def get_project_root() -> Path:
    return Path(__file__).resolve().parents[1]


PROJECT_ROOT = get_project_root()


def configured_path(variable: str, default: Path) -> Path:
    value = os.environ.get(variable, "").strip()
    path = Path(value).expanduser() if value else default
    if not path.is_absolute():
        path = PROJECT_ROOT / path
    return path.resolve()


RAW_DATA_DIR = configured_path("BTS_DATA_DIR", PROJECT_ROOT / "data" / "raw")
SAMPLE_DIR = configured_path(
    "BTS_SAMPLE_DIR", PROJECT_ROOT / "data" / "samples" / "FeTS21_Training_001"
)
PRETRAINED_PATH = configured_path(
    "BTS_PRETRAINED_PATH",
    PROJECT_ROOT / "models" / "pretrained" / "resnet_18_23dataset.pth",
)
CHECKPOINT_ROOT = configured_path(
    "BTS_CHECKPOINT_DIR", PROJECT_ROOT / "models" / "checkpoints"
)
REPORT_DIR = PROJECT_ROOT / "reports" / "experiments"
