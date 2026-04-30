# BridgeAI — Complete Step-by-Step Guide

## System Architecture

```
User: "Gaming laptop for 5000 RON"
        │
        ▼
┌─────────────────┐
│   NLP Bridge    │  ← Claude API extracts structured intent
│  (main.py)      │    { category, purpose, budget }
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Feature Engine │  ← Transforms DB products into numbers (0-1)
│  (features.py)  │    RAM 16GB → 0.8, Price 5000 → 0.6, etc.
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Random Forest  │  ← Scores EVERY product: "how suitable is it?"
│  (recommender)  │    Laptop A: 0.601 | Laptop B: 0.598 | ...
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Presentation   │  ← Claude API formulates a natural response
│  (main.py)      │    "I recommend X because it has a dedicated GPU..."
└─────────────────┘
```

---

## Project Files

| File                | Role                              | When to run              |
| ------------------- | --------------------------------- | ------------------------ |
| `features.py`       | Defines and normalizes features   | Automatically (imported) |
| `data_generator.py` | Generates synthetic training data | Once                     |
| `train_rf.py`       | Trains the Random Forest models   | Once                     |
| `recommender.py`    | Scores products with trained RF   | On every request         |
| `main.py`           | NLP + conversational interface    | Run by user              |

---

## How to Run (from scratch)

```bash
# 1. Install dependencies
pip install scikit-learn pandas numpy

# 2. Generate training data (once)
python3 data_generator.py

# 3. Train RF models (once, ~30 seconds)
python3 train_rf.py

# 4. Start the chatbot
python3 main.py

# OPTIONAL: For natural presentation (Claude API)
export ANTHROPIC_API_KEY="sk-ant-..."
python3 main.py
```

---

## Understanding Random Forest — Why It Works

### Our Problem

We have 948 laptops and a user saying "I want something good for gaming".
We need to rank those 948 laptops from "most suitable" to "least suitable".

### The RF Solution

**Step 1 — Feature engineering** (`features.py`):
We transform each laptop from "text in DB" to "vector of numbers":

```
Acer Gaming Laptop → [0.60, 0.80, 1.00, 0.45, ...] ← 12 numbers between 0-1
                       price RAM  GPU   weight
```

**Step 2 — Synthetic data** (`data_generator.py`):
We create scenarios like:

```
"GAMER profile + Laptop with Dedicated GPU + 16GB RAM + 165Hz → score 0.85"
"GAMER profile + Laptop without GPU + 8GB RAM + 60Hz → score 0.23"
```

We generate 1800 such examples for laptops.

**Step 3 — RF training** (`train_rf.py`):
RF builds 200 decision trees, each on a random subset of the data.
At prediction time, it averages the scores from all trees.

```
Tree 1: "Has dedicated GPU? YES → score 0.7"
Tree 2: "Refresh > 144Hz? YES → score 0.8"
Tree 3: "RAM > 16GB? NO → score 0.5"
...
AVERAGE → 0.67 (final score for that laptop)
```

**Step 4 — Inference** (`recommender.py`):
At runtime, RF scores EVERY real product in the DB and returns the top N.

### Why RF and Not Other Models?

| Criterion          | Random Forest                | Neural Network       | KNN     |
| ------------------ | ---------------------------- | -------------------- | ------- |
| Data needed        | **Few (OK with 1000)**       | Many (>10k)          | Medium  |
| Interpretable      | **YES** (feature importance) | No                   | Partial |
| Training time      | **Fast (seconds)**           | Slow (minutes-hours) | Instant |
| Overfitting risk   | **Low** (by design)          | High                 | Medium  |
| Parameters to tune | Few                          | Many                 | Few     |

---

## Training Results

```
Category           R² Test    RMSE     OOB
laptops            0.9239    0.0401   0.9275  ✅ Excellent
monitors           0.9462    0.0341   0.9381  ✅ Excellent
smartphones        0.9498    0.0353   0.9562  ✅ Excellent
headphones         0.9307    0.0427   0.9395  ✅ Excellent
gaming_headphones  0.9615    0.0313   0.9575  ✅ Excellent
```

**R² = 0.92** means RF explains 92% of the variation in scores.
**RMSE = 0.04** means it errs by an average of 4 percentage points (on a 0-1 scale).

---

## How to Improve the System

### 1. Add More User Profiles

In `data_generator.py`, add a new profile to `LAPTOP_PROFILES`:

```python
{
    "name": "streamer",
    "description": "Content creator, live streaming",
    "weights": {
        "feat_capacity": 2.0,           # Lots of RAM for OBS
        "feat_frecventaturbomax": 1.8,
        "feat_cameraweb": 2.0,          # Webcam is important
        "feat_placavideo": 1.5,
    },
    "budget_max": 8000,
    "category_prefer": "Multimedia",
}
```

Then run `data_generator.py` and `train_rf.py` again.

### 2. Collect Real Feedback

When a user picks a product, save:

```python
{"request": intent, "chosen_product": product_id, "rf_score": score}
```

And you can retrain RF with this real data (better than synthetic).

### 3. Tune RF Hyperparameters

In `train_rf.py`, experiment with:

```python
model = RandomForestRegressor(
    n_estimators=500,   # more trees = more stable
    max_depth=12,       # deeper = more complex (overfitting risk)
    min_samples_leaf=1, # allows more specific leaves
)
```

### 4. Add Tablets and TVs

Define profiles in `data_generator.py` for `tvs` and `tablets`
(currently using a generic score).

---

## Key Concepts to Remember

**Overfitting**: The model memorizes training data but doesn't generalize.
Sign: R² train >> R² test. Fix: increase `min_samples_leaf`, reduce `max_depth`.

**Feature importance**: RF tells you which features matter most.
Ex: for laptops, `capacitatessd` and `budget_tier` are the most important.

**Out-of-Bag (OOB) score**: A "free" evaluation — each tree is tested
on data it didn't see during training. Equivalent to cross-validation.

**Synthetic vs. real data**: Synthetic data is sufficient to start,
but real data from real users significantly improves accuracy.
