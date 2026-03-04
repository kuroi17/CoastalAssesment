# 📁 Project Structure Documentation

This document explains the organization of the Coastal Assessment System codebase.

## 🏗️ Directory Structure

```
matlabTiff/
├── 📓 notebooks/                    # Jupyter notebooks (main workflow)
│   ├── 00_overview.ipynb           # Project introduction & setup verification
│   ├── 01_data_loading.ipynb       # Load Sentinel-2 bands
│   ├── 02_preprocessing.ipynb      # Calculate indices (NDVI, NDWI, Texture)
│   ├── 03_model_training.ipynb     # Train Random Forest classifier
│   ├── 03b_cnn_comparison.ipynb    # (Optional) Compare RF vs CNN performance
│   ├── 04_prediction_analysis.ipynb # Apply model & generate classification map
│   └── 05_visualization_reports.ipynb # Multi-year trend analysis
│
├── 📊 data/                         # All data files
│   ├── raw/                        # Raw satellite imagery (not modified)
│   │   └── coastalImage/           # Sentinel-2 L2A TIFF files (B02-B12)
│   ├── training/                   # Ground truth labels
│   │   └── trainingdata/           # GPS-labeled CSV files
│   │       ├── Ground_Truth.csv    # Original field survey data
│   │       ├── Ground_TruthFinal.csv
│   │       └── Ground_TruthFinal_with_landmass.csv  # Augmented with Class 5
│   ├── processed/                  # Preprocessed images
│   │   ├── processed_image_with_indices.tif  # 7-band composite (main input)
│   │   └── clipped_bands/          # (Optional) AOI-clipped bands
│   └── aoi/                        # Area of Interest boundaries
│       └── explorer-aoi.geojson    # Region boundary for clipping
│
├── 🤖 models/                       # Trained models & metadata
│   ├── coastal_classifier_model.pkl # Random Forest model
│   ├── feature_scaler.pkl          # StandardScaler for normalization
│   ├── model_metadata.json         # Accuracy, features, classes
│   └── coastal_cnn_model.h5        # (Legacy) CNN model from early testing
│
├── 📈 results/                      # Classification outputs & visualizations
│   ├── final_classification_map.tif     # Classified GeoTIFF (5 classes)
│   ├── final_classification_map.png     # High-res visualization (300 DPI)
│   ├── final_area_report.csv            # Area statistics by class
│   ├── area_distribution.png            # Class distribution chart
│   └── coastal_prediction_results.png   # (Legacy) Old predictions
│
├── 📂 outputs/                      # Intermediate outputs from notebooks
│   ├── loaded_bands.pkl            # From notebook 01
│   ├── 01_spectral_bands.png       # Visualization from notebook 01
│   └── 05_multi_year_trends.png    # From notebook 05
│
├── 🗄️ archive/                     # Old/deprecated files
│   ├── oldTest/                    # Previous test data
│   └── coastal_assessment.ipynb    # (Legacy) Old single-notebook version
│
├── 📖 docs/                         # Documentation
│   ├── README.md                   # Main project documentation (copy)
│   ├── PROJECT_STRUCTURE.md        # This file
│   └── tutorialModuleInstalling.md # Package installation guide
│
├── 🐍 .venv/                        # Python virtual environment (excluded from git)
├── .gitignore                      # Git ignore rules
└── README.md                       # Main project README (root level)
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: DATA LOADING (notebook 01)                                 │
│  Input:  data/raw/coastalImage/*.tiff                               │
│  Output: outputs/loaded_bands.pkl                                   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: PREPROCESSING (notebook 02)                                │
│  Input:  data/raw/coastalImage/*.tiff                               │
│  Output: data/processed/processed_image_with_indices.tif            │
│          (7 bands: B02, B03, B04, B08, NDVI, NDWI, Texture)         │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: MODEL TRAINING (notebook 03)                               │
│  Input:  data/training/trainingdata/Ground_TruthFinal.csv           │
│          data/processed/processed_image_with_indices.tif            │
│  Output: models/coastal_classifier_model.pkl                        │
│          models/feature_scaler.pkl                                  │
│          models/model_metadata.json                                 │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 4: PREDICTION (notebook 04)                                   │
│  Input:  models/coastal_classifier_model.pkl                        │
│          data/processed/processed_image_with_indices.tif            │
│  Output: results/final_classification_map.tif                       │
│          results/final_classification_map.png                       │
│          results/final_area_report.csv                              │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 5: REPORTS (notebook 05)                                      │
│  Input:  results/final_area_report.csv (multiple years)             │
│  Output: outputs/05_multi_year_trends.png                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📝 File Naming Conventions

### Notebooks

- **Prefix with number** for execution order: `01_`, `02_`, etc.
- **Use descriptive names**: `data_loading` not `load`
- **Snake_case format**: `model_training.ipynb`

### Data Files

- **Raw data**: Original filenames from Copernicus (e.g., `B02_(Raw).tiff`)
- **Processed**: Descriptive names like `processed_image_with_indices.tif`
- **Results**: Prefix with `final_` for final outputs

### Models

- **Descriptive names**: `coastal_classifier_model.pkl` (not `model.pkl`)
- **Include algorithm**: `_rf` for Random Forest, `_cnn` for neural networks
- **Version if needed**: `model_v2.pkl`

---

## 🔒 Gitignore Strategy

The following are excluded from version control:

```
.venv/                 # Virtual environment (too large, user-specific)
outputs/               # Intermediate outputs (can be regenerated)
data/raw/             # Raw satellite imagery (users download from Copernicus)
data/processed/       # Processed images (generated by notebook 02)
results/              # Final results (generated by notebook 04)
models/               # Trained models (too large for GitHub, train locally)
*.pkl                 # Pickle files
*.tif, *.tiff         # Large geospatial files
__pycache__/          # Python cache
```

**What IS tracked:**

- All notebooks (`.ipynb`)
- Ground truth CSV files (`data/training/`)
- Documentation (`docs/`, `README.md`)
- Configuration files (`.gitignore`, `requirements.txt`)

---

## 🚀 Quick Start

### For Team Members

1. Clone the repository
2. Create virtual environment: `python -m venv .venv`
3. Activate: `.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (Linux/Mac)
4. Install packages: `pip install -r requirements.txt`
5. Download Sentinel-2 data to `data/raw/coastalImage/`
6. Open `notebooks/00_overview.ipynb` and follow the workflow

### For New Data Analysis

1. Place new satellite imagery in `data/raw/coastalImage/`
2. (Optional) Add AOI GeoJSON to `data/aoi/`
3. Run notebooks 01 → 02 → 04 (skip 03 if model already trained)
4. Find results in `results/` folder

### For Model Retraining

1. Edit ground truth CSV in `data/training/trainingdata/`
2. Run notebook 03 to retrain
3. Run notebook 04 to generate new predictions

---

## 📊 Expected File Sizes

| Folder            | Size       | Notes                                |
| ----------------- | ---------- | ------------------------------------ |
| `data/raw/`       | 100-500 MB | Depends on image extent              |
| `data/processed/` | 50-200 MB  | 7-band composite                     |
| `models/`         | 5-20 MB    | Random Forest models are lightweight |
| `results/`        | 10-50 MB   | GeoTIFF + PNG visualizations         |
| `outputs/`        | 1-10 MB    | Pickled arrays                       |

---

## 🛠️ Maintenance

### Adding New Notebooks

- Place in `notebooks/` folder
- Follow numbering scheme if part of main workflow
- Update `00_overview.ipynb` with new step

### Adding New Data Sources

- Raw data → `data/raw/[source_name]/`
- Update notebook 01 to handle new format

### Exporting for Presentation

- Classification maps: `results/final_classification_map.png` (300 DPI)
- Trends: `outputs/05_multi_year_trends.png`
- Statistics: `results/final_area_report.csv` → Import to Excel/PowerPoint

---

## 🔍 Troubleshooting

### "FileNotFoundError: data/raw/coastalImage/"

**Cause**: Notebooks expect data in new folder structure  
**Solution**: Ensure Sentinel-2 files are in `data/raw/coastalImage/`, not root `coastalImage/`

### "Cannot find processed_image_with_indices.tif"

**Cause**: Notebook 02 hasn't been run yet  
**Solution**: Run notebooks in order (01 → 02 → 03 → 04)

### "Model file not found"

**Cause**: Notebook 03 hasn't run, or model saved to wrong location  
**Solution**: Run notebook 03 first, check `models/` folder exists

---

## 📚 Additional Resources

- **Jupyter Notebook Guide**: See `00_overview.ipynb`
- **Installation Help**: See `docs/tutorialModuleInstalling.md`
- **Main README**: See `README.md` in root folder
- **Copernicus Data**: https://dataspace.copernicus.eu/

---

**Last Updated**: March 4, 2026  
**Maintained By**: Coastal Assessment Team
