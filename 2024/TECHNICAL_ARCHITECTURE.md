
# 🔧 Technical Architecture - 2024 Comparison System

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    COASTAL ASSESSMENT SYSTEM                │
│                 Using Continuous Model Reuse                │
└─────────────────────────────────────────────────────────────┘

PHASE 1: TRAINING (2020 Data) - DONE ✓
─────────────────────────────────────

Source Data (2020)
  ├─ B02.tiff (Blue)   ──┐
  ├─ B03.tiff (Green)  ──┤
  ├─ B04.tiff (Red)    ──┼─→ 01_data_loading.ipynb
  └─ B08.tiff (NIR)    ──┘
                       
Preprocessing (2020)
  ├─ Calculate NDVI   ──┐
  ├─ Calculate NDWI   ──┤
  ├─ Calculate Texture ├─→ 02_preprocessing.ipynb
  └─ Stack 7 bands    ──┘
                       
Training Data
  ├─ Ground_Truth.csv  ──┐
  └─ 7-band image     ──┼─→ 03_model_training.ipynb
                       │
                       └─→ Trained Components:
                           ├─ coastal_classifier_model.pkl 🔑
                           ├─ feature_scaler.pkl 🔑
                           └─ model_metadata.json
                       
Classification (2020)
  ├─ {trained model}  ──┐
  └─ {scaler}        ──┼─→ 04_prediction_analysis.ipynb
                       │
                       └─→ Output:
                           ├─ final_classification_map.tif
                           ├─ final_area_report.csv
                           └─ Visualizations


PHASE 2: COMPARISON (2024 Data) - NEW ✨
─────────────────────────────────────

Source Data (2024)
  ├─ B02.tiff (Blue)   ──┐
  ├─ B03.tiff (Green)  ──┤
  ├─ B04.tiff (Red)    ──┼─→ 01_data_loading_2024.ipynb
  └─ B08.tiff (NIR)    ──┘
                       
Preprocessing (2024)
  ├─ Calculate NDVI   ──┐
  ├─ Calculate NDWI   ──┤
  ├─ Calculate Texture ├─→ 02_preprocessing_2024.ipynb
  └─ Stack 7 bands    ──┘
                       
                    ⚠️ NOTE: No Ground Truth needed!
                       Model is reused from PHASE 1
                       
Classification (2024)
  ├─ {REUSED model}   ──┐
  ├─ {REUSED scaler}  ──┼─→ 04_prediction_analysis_2024.ipynb
  ├─ 2024 7-band img  ──┘
                       
                       └─→ Output:
                           ├─ final_classification_map_2024.tif
                           ├─ final_area_report_2024.csv
                           └─ Visualizations


PHASE 3: COMPARISON ANALYSIS
─────────────────────────────

Data Integration
  ├─ final_area_report.csv (2020)    ──┐
  ├─ final_area_report_2024.csv (2024)─┼─→ 05_visualization_reports.ipynb
  └─ metadata                          ──┘
                       
                       └─→ Output:
                           ├─ Trend Analysis
                           ├─ Change Metrics
                           ├─ Comparison Visualizations
                           └─ Government Recommendations
```

---

## Data Flow Diagram

```python
# TRAINING PHASE (2020)
Sentinel2_Bands_2020 → [Preprocess] → 7_Band_Image → [Train] → Model.pkl
Ground_Truth_CSV →────────────────────────────────────────────↑

# COMPARISON PHASE (2024)
Sentinel2_Bands_2024 → [Preprocess] → 7_Band_Image → [Predict] → Classification_2024
                                          ↑                          ↓
                                       [Reuse]                    Area_Report_2024
                                     Model.pkl
                                   Scaler.pkl

# ANALYSIS PHASE
Area_Report_2020 → [Merge] → Comparison_DataFrame → [Visualize] → Trends_PNG
Area_Report_2024 →─────────────────────────────────→           Government_Report
```

---

## Module Specifications

### 1. Data Loading (01_data_loading_2024.ipynb)

**Input:** Raw Sentinel-2 TIFF files in `coastalImage_2024/`
```
B02.tiff (Blue,  490 nm, 10m)
B03.tiff (Green, 560 nm, 10m)
B04.tiff (Red,   665 nm, 10m)
B08.tiff (NIR,   842 nm, 10m)
```

**Process:**
```python
import rasterio
bands = {}
for band_id in ['B02', 'B03', 'B04', 'B08']:
    with rasterio.open(f"coastalImage_2024/{band_id}.tiff") as src:
        bands[band_id] = src.read(1).astype(float)
```

**Output:** `outputs/bands_2024.pkl` (pickled dictionary)

**Why Pickle?** Preserves floating-point precision and structure between notebooks

---

### 2. Preprocessing (02_preprocessing_2024.ipynb)

**Input:** `outputs/bands_2024.pkl`

**Process:**
```python
# Load bands
B02, B03, B04, B08 = unpickle_bands()

# Calculate indices
NDVI = (B08 - B04) / (B08 + B04 + ε)    # Vegetation
NDWI = (B03 - B08) / (B03 + B08 + ε)    # Water
Texture = local_variance(B08)             # Edges

# Stack all 7 bands
image_7_band = np.stack([
    B02, B03, B04, B08,  # Original spectra
    NDVI, NDWI, Texture   # Derived features
])

# Save as georeferenced GeoTIFF
with rasterio.open("processed_image_with_indices_2024.tif", 'w', **profile):
    dst.write(image_7_band)
```

**Output:** `processed_image_with_indices_2024.tif`

**Why 7 Bands?** Matches training data structure exactly for model compatibility

---

### 3. Prediction (04_prediction_analysis_2024.ipynb)

**Input:**
- `processed_image_with_indices_2024.tif` (7 bands)
- `outputs/coastal_classifier_model.pkl` (trained)
- `outputs/feature_scaler.pkl` (training scaler)

**Process:**
```python
# CRITICAL: Use SAME scaler as training
model = joblib.load("coastal_classifier_model.pkl")
scaler = joblib.load("feature_scaler.pkl")

# Reshape for prediction
X_2024 = image_7band.reshape(7, -1).T  # (H×W, 7)

# Scale using TRAINING distribution
X_scaled = scaler.transform(X_2024)

# Predict
y_pred = model.predict(X_scaled)  # (H×W,) with class labels

# Reshape back to map
classification_map = y_pred.reshape(height, width)

# Apply cleanup
classification_map_clean = majority_filter(classification_map, size=3)
```

**Output:** 
- `final_classification_map_2024.tif` (GeoTIFF)
- `final_area_report_2024.csv` (Statistics)

**Key Insight:** StandardScaler must use TRAINING statistics, not testing data!

---

### 4. Analysis (05_visualization_reports.ipynb)

**Input:** 
- `final_area_report.csv` (2020)
- `final_area_report_2024.csv` (2024)

**Process:**
```python
# Load both reports as DataFrames
df_2020 = pd.read_csv('final_area_report.csv')
df_2024 = pd.read_csv('final_area_report_2024.csv')

# Combine
df_combined = pd.concat([df_2020, df_2024])

# Calculate changes
for class_name in classes:
    area_2020 = df_2020[df_2020['Class Name'] == class_name]['Area (km²)']
    area_2024 = df_2024[df_2024['Class Name'] == class_name]['Area (km²)']
    
    change_km2 = area_2024 - area_2020
    change_pct = (change_km2 / area_2020) × 100
    
    trend = "📈" if change_pct > 0 else "📉"
    print(f"{trend} {class_name}: {area_2020:.2f} → {area_2024:.2f} km²")
```

**Output:** `05_multi_year_trends.png` (Publication-ready visualization)

---

## Model Reuse Strategy

### Why Retraining is NOT Necessary

1. **Domain Consistency**
   - Both 2020 and 2024 use Sentinel-2 (same sensor, same bands)
   - Same spectral signatures for land cover classes
   - Coastal environment patterns stable over 4 years

2. **Feature Robustness**
   - NDVI works anywhere vegetation exists
   - NDWI works for any water body
   - Texture captures local variation universally

3. **Statistical Justification**
   ```
   If P(Class | Spectral Features) is learned from 2020 data,
   and 2024 data has similar feature distributions,
   then model generalizes with confidence
   ```

### When to Retrain

❌ **Don't retrain if:**
- Using same sensor (Sentinel-2)
- Study area hasn't fundamentally changed
- Classes are consistent year-to-year

✅ **Retrain if:**
- Switching to different satellite (Landsat, MODIS, etc.)
- Major land cover conversion (e.g., massive deforestation)
- Adding new classes not seen in training data

---

## Performance Metrics

### Computational Requirements

| Step | Memory | CPU | Time | Output Size |
|------|--------|-----|------|-------------|
| 01_load_2024 | 200 MB | Low | 1-2 min | 50 MB |
| 02_preprocess_2024 | 400 MB | Medium | 2-3 min | 150 MB |
| 04_predict_2024 | 800 MB | High | 3-5 min | 50 MB |
| 05_analysis | 100 MB | Low | 2-3 min | 5 MB |
| **Total** | ~1 GB | Medium | ~10-15 min | ~255 MB |

### Accuracy Metrics Reused from Training

```json
{
  "test_accuracy": 0.87,          // Model trained on 2020
  "training_samples": 5000,       // From Ground_Truth.csv
  "classes": [1,2,3,4,5],        
  "feature_count": 7              // 4 spectral + 3 derived
}
```

These metrics are **metadata** from step 03, reused for reference in final reports.

---

## Configuration Files

### Required (Pre-existing from Phase 1)
```
outputs/
├── coastal_classifier_model.pkl      ← Random Forest model
├── feature_scaler.pkl                ← StandardScaler (CRITICAL!)
├── model_metadata.json               ← Accuracy & training info
└── final_area_report.csv             ← 2020 baseline
```

### Created in Phase 2
```
outputs/
├── bands_2024.pkl                    ← Intermediate (can delete)
├── processed_image_with_indices_2024.tif
├── final_classification_map_2024.tif
├── final_classification_map_2024.png
├── final_area_report_2024.csv        ← NEW comparison baseline
└── 05_multi_year_trends.png          ← Final output
```

---

## Data Validation Checklist

For each phase, validate:

```python
# Phase 1: Raw Data
assert B02.shape == (height, width), "Band dimensions correct"
assert B02.min() >= 0 and B02.max() <= 10000, "Value range reasonable"
assert ~np.any(np.isnan(B02)), "No NaN values"

# Phase 2: Processed Data
assert stacked_image.shape == (7, height, width), "7 bands stacked"
assert isinstance(stacked_image, np.ndarray), "NumPy array"
assert stacked_image.dtype == np.float32, "Float32 precision"

# Phase 3: Predictions
assert np.all(np.isin(pred_map, [0,1,2,3,4,5])), "Valid class IDs"
assert pred_map.shape == (height, width), "Map shape preserved"
assert np.sum(pred_map == 0) < 0.5 * np.product(pred_map.shape), ">50% valid"
```

---

## Troubleshooting by Phase

### Phase 1: Loading
```
Error: "coastalImage_2024 not found"
→ Create folder and place B02, B03, B04, B08 TIFFs

Error: "rasterio.errors.RasterioIOError"
→ TIFF file corrupted; try with gdal_translate to reprocess
```

### Phase 2: Preprocessing
```
Error: "NDVI contains NaN"
→ Check for divide by zero; add epsilon (1e-10)

Error: "Output TIF unreadable in QGIS"
→ Ensure rasterio profile.update() includes CRS and transform
```

### Phase 3: Prediction
```
Error: "Shape mismatch in scaler.transform()"
→ Ensure exactly 7 bands; check stacking order matches training

Error: "Model accuracy seems low"
→ Check if you're using RIGHT scaler (must match training data stats)
```

### Phase 4: Analysis
```
Error: "final_area_report_2024.csv not found"
→ Run 04_prediction_analysis_2024.ipynb first

Error: "Empty plot with no legend"
→ Check if any classes had zero pixels in classification
```

---

## Future Enhancements

Potential improvements for operational use:

- [ ] Automated change detection confidence intervals
- [ ] Time-series anomaly detection (outlier years)
- [ ] Class-specific accuracy reporting (per-class metrics)
- [ ] Export to GeoJSON for web mapping
- [ ] Cloud-optimized GeoTIFF (COG) for streaming
- [ ] Uncertainty quantification (probabilistic predictions)
- [ ] Batch processing multiple years in parallel

---

**This system is designed for reproducibility, scalability, and minimal overhead.** 🎯

