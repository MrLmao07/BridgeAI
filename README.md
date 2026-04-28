# Bridge-AI

Bridge-AI is a multi-part recommendation platform that combines:

- dataset scraping and CSV export from PCGarage.ro,
- data cleaning and embedding tools,
- a Python-based AI recommendation engine,
- and a React Native / Expo mobile interface.

## Project Overview

This repository is organized into three main domains:

1. **BridgeAI_Dataset** — data collection, cleaning, storage, and embedding.
2. **BridgeAI_AI** — synthetic training data, feature engineering, random forest recommendation models, and conversational inference.
3. **BridgeAI_Interface** — mobile UI built with Expo and React Native.

## Folder Structure

- `BridgeAI_Dataset/`
  - `BridgeAI_Database_Scraper/` — PCGarage scraping project with parsers, browser automation, SQLite export, and CSV output.
  - `BridgeAI_Database/` — saved database files and database artifacts.
  - `Data Cleaner/` — scripts for cleaning database records and working with extracted data.
  - `Embedding/` — embedding generation and visualization utilities.
- `BridgeAI_AI/`
  - `api.py` — API endpoint definitions and backend service logic.
  - `main.py` — main recommendation and conversational entry point.
  - `features.py` — feature extraction and normalization.
  - `data_generator.py` — synthetic training data generation.
  - `train_rf.py` — random forest training pipeline.
  - `recommender.py` — scoring engine for product recommendations.
  - `models/` — persisted model artifacts.
  - `training_data/` — raw / generated training CSV data.
- `BridgeAI_Interface/`
  - `app/` — Expo app source code and screens.
  - `package.json` — app dependencies and Expo scripts.
  - `tsconfig.json` — TypeScript configuration.

## Quick Start

### 1. Scrape product data

Use the scraper in `BridgeAI_Dataset/BridgeAI_Database_Scraper/` to extract product specifications from PCGarage.ro.

```bash
cd BridgeAI_Dataset/BridgeAI_Database_Scraper
pip install -r requirements.txt
python main.py --categorii laptops --export
```

Available categories include:

- `casti` / headphones
- `gaming_headphones`
- `laptopuri` / laptops
- `tablete` / tablets
- `smartphone` / smartphones
- `monitoare` / monitors
- `televizoare` / TVs

Use `python main.py --export` to scrape and export CSV files automatically.

### 2. Clean and prepare data

The `BridgeAI_Dataset/Data Cleaner/` folder contains scripts for cleaning and transforming exported data.

```bash
cd BridgeAI_Dataset/Data Cleaner
python cleaner.py
```

Adjust the cleaning scripts as needed for your dataset and file paths.

### 3. Train the AI recommendation engine

The AI backend is located in `BridgeAI_AI/`.

```bash
cd BridgeAI_AI
pip install fastapi uvicorn[standard] scikit-learn pandas joblib
python data_generator.py
python train_rf.py
```

Then start the recommendation backend:

```bash
uvicorn api:app --reload
```

### 4. Run the Expo mobile interface

The app is in `BridgeAI_Interface/`.

```bash
cd BridgeAI_Interface
npm install
npx expo start
```

Open the app via Android/iOS/emulator or Expo Go.

## Subproject Notes

### BridgeAI_Dataset

- `BridgeAI_Database_Scraper` is a focused PCGarage scraper with category-specific parsers.
- `Data Cleaner` includes local cleanup scripts and SQL helpers.
- `Embedding` stores embedding creation and visualization for semantic search or analysis.

### BridgeAI_AI

- `features.py` extracts product features and normalizes values into model-ready vectors.
- `data_generator.py` synthesizes user profiles and labeled training examples.
- `train_rf.py` trains random forest regressors for product scoring.
- `recommender.py` scores catalog items and returns the top matches.
- `api.py` exposes any backend endpoints needed by the interface.

### BridgeAI_Interface

- Built with Expo + React Native.
- Uses file-based routing under `app/`.
- Includes account, AI conversation, comparison engine, help, sign-in, and sign-up screens.

## Recommended Workflow

1. Scrape fresh product data.
2. Clean and normalize the dataset.
3. Train or retrain the recommendation models.
4. Run the Python backend.
5. Start the mobile interface and connect it to the backend.

## Useful Commands

### Python backend

```bash
cd BridgeAI_AI
pip install fastapi uvicorn scikit-learn pandas joblib
python data_generator.py
python train_rf.py
uvicorn api:app --reload
```

### Expo app

```bash
cd BridgeAI_Interface
npm install
npx expo start
```

## Notes

- The backend is built for Python 3.14+.
- The Expo app is configured for React Native 0.81.x and Expo SDK 54.
- If you want to improve the system, add real user feedback, refine profiles, or extend the product categories.

## Additional Documentation

Refer to the subproject READMEs for more detailed instructions:

- `BridgeAI_AI/README.md`
- `BridgeAI_Interface/README.md`
- `BridgeAI_Dataset/BridgeAI_Database_Scraper/README.md`
