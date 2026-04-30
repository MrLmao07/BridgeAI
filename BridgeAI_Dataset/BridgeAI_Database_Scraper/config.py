BASE_URL = "https://www.pcgarage.ro"

CATEGORIES = {
    "headphones": {
        "url": f"{BASE_URL}/casti/",
        "name": "Căști Audio",
        "table": "headphones",
    },
    "gaming_headphones": {
        "url": f"{BASE_URL}/casti-gaming/",
        "name": "Căști Gaming",
        "table": "gaming_headphones",
    },
    "laptops": {
        "url": f"{BASE_URL}/notebook-laptop/",
        "name": "Laptop-uri",
        "table": "laptops",
    },
    "tablets": {
        "url": f"{BASE_URL}/tablete/",
        "name": "Tablete",
        "table": "tablets",
    },
    "smartphones": {
        "url": f"{BASE_URL}/smartphone/",
        "name": "Smartphone-uri",
        "table": "smartphones",
    },
    "monitors": {
        "url": f"{BASE_URL}/monitoare-led/",
        "name": "Monitoare",
        "table": "monitors",
    },
    "tvs": {
        "url": f"{BASE_URL}/televizoare-led/",
        "name": "Televizoare",
        "table": "tvs",
    },
}

MIN_DELAY   = 2.5  
MAX_DELAY   = 6.0   
MAX_RETRIES = 3     
HEADLESS    = False  

DB_PATH        = "pcgarage.db"   
CSV_OUTPUT_DIR = "output_csv"  