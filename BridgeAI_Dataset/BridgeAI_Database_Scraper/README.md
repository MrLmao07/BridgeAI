# PCGarage Scraper

Automatically extracts technical specifications of products from **pcgarage.ro**
across 6 categories: Headphones, Laptops, Tablets, Smartphones, Monitors, TVs.

---

## Project Structure

```
pcgarage_scraper/
│
├── main.py          ← entry point, CLI
├── config.py        ← URLs, settings, parameters
├── browser.py       ← Chrome with CloudFlare bypass (undetected-chromedriver)
├── scraper.py       ← orchestration: URL collection → parsing → saving
├── database.py      ← SQLite: table creation, insert/update data
├── exporter.py      ← export tables → CSV files
├── utils.py         ← shared functions (spec extraction, pagination, text)
│
├── parsers/
│   ├── __init__.py      ← category → parser function mapping
│   ├── headphones.py    ← Headphones parser
│   ├── laptops.py       ← Laptops parser
│   ├── tablets.py       ← Tablets parser
│   ├── smartphones.py   ← Smartphones parser
│   ├── monitors.py      ← Monitors parser
│   └── tvs.py           ← TVs parser
│
├── requirements.txt
├── pcgarage.db      ← auto-generated (SQLite)
└── output_csv/      ← auto-generated, contains .csv files
```

---

## Installation

### 1. System Requirements
- **Python 3.10+**
- **Google Chrome** installed (current version)

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

> `undetected-chromedriver` automatically downloads the ChromeDriver version
> compatible with the Chrome version installed on your system.

---

## Usage


### Scrape a single category
```bash
python main.py --categorii headphones
python main.py --categorii gaming_headphones
python main.py --categorii laptops
python main.py --categorii tablets
python main.py --categorii smartphones
python main.py --categorii monitors
python main.py --categorii tvs
```

### Scrape + automatic CSV export
```bash
python main.py --export
python main.py --categorii headphones --export
```

### Export CSV from already saved data (no scraping)
```bash
python main.py --doar-export
```

### Available Categories
| Key           | Category        |
|---------------|-----------------|
| `casti`       | Headphones      |
| `laptopuri`   | Laptops         |
| `tablete`     | Tablets         |
| `smartphone`  | Smartphones     |
| `monitoare`   | Monitors        |
| `televizoare` | TVs             |

---

## How the CloudFlare Bypass Works

We use **`undetected-chromedriver`** which:
- Modifies Chrome's fingerprint to avoid bot detection
- Removes Selenium signatures from JS (`navigator.webdriver = false`)
- Simulates human behaviour: slow scrolling, random pauses between requests

> ⚠️ Keep `HEADLESS = False` in `config.py` (the default value).
> Headless mode increases the risk of CloudFlare detection.

---

## Database

Data is saved in `pcgarage.db` (SQLite).
You can inspect the database with any SQLite client (e.g. **DB Browser for SQLite**).

```sql
-- Examples
SELECT denumire, culoare, bluetooth FROM casti LIMIT 10;
SELECT denumire, proc_model, ram FROM laptopuri WHERE sistem_operare LIKE '%Windows%';
```

---

## CSV Files

Exported to the `output_csv/` folder:
- `casti.csv`
- `laptopuri.csv`
- `tablete.csv`
- `smartphone.csv`
- `monitoare.csv`
- `televizoare.csv`

Files use **UTF-8 with BOM** and `;` as delimiter → open correctly in Excel.

---

## Logging

All actions are displayed in the console and saved to `scraper.log`.