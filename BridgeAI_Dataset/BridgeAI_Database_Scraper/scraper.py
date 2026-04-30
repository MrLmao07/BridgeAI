import time
import logging

from bs4 import BeautifulSoup

from browser import safe_get, human_delay, create_driver
from config import CATEGORIES, MAX_RETRIES
from database import upsert_product
from utils import get_all_product_urls, extract_specs_from_page

log = logging.getLogger(__name__)

MAX_PRODUCTS_PER_CATEGORY = 2000

# Product scraping
def _parse_product_page(driver) -> dict:
    time.sleep(5)
    soup = BeautifulSoup(driver.page_source, "html.parser")
    return extract_specs_from_page(soup)

def scrape_product(driver, url: str, category_key: str) -> bool:
    log.info("Scraping product: %s", url)

    if not safe_get(driver, url, retries=MAX_RETRIES):
        log.warning("Could not access: %s", url)
        return False

    data = _parse_product_page(driver)
    data["url"] = url

    table_name = CATEGORIES[category_key]["table"]
    upsert_product(table_name, data)
    return True

# Category scraping
def _resolve_categories(categories: list[str] | None) -> list[str]:
    return categories if categories is not None else list(CATEGORIES.keys())

def _scrape_category(driver, cat_key: str) -> None:
    log.info("--- CATEGORY: %s ---", cat_key.upper())

    product_urls = get_all_product_urls(driver, CATEGORIES[cat_key]["url"])
    urls_to_scrape = product_urls[:MAX_PRODUCTS_PER_CATEGORY]

    for idx, url in enumerate(urls_to_scrape, start=1):
        log.info("Product %d / %d", idx, len(urls_to_scrape))
        scrape_product(driver, url, cat_key)
        human_delay(2, 4)

def run_scraper(categories: list[str] | None = None) -> None:
    """Entry point — scrapes all requested categories sequentially."""
    resolved = _resolve_categories(categories)
    driver = create_driver()
    try:
        for cat_key in resolved:
            _scrape_category(driver, cat_key)
    finally:
        driver.quit()