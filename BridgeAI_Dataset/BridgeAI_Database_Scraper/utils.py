import re
import json
import logging
import time

from bs4 import BeautifulSoup

log = logging.getLogger(__name__)

BASE_URL         = "https://www.pcgarage.ro"
PAGE_LOAD_DELAY  = 10
NO_RESULTS_SELECTORS = ".no-results, .empty-category, [class*='no-product']"
SPEC_ROW_SELECTORS   = ".specification-row, .spec-row, [class*='specification']"

# URL helpers
def _build_page_url(category_url: str, page: int) -> str:
    # PCGarage uses /paginaN/ path segments, not ?p=N query params.
    if page == 1:
        return category_url
    return f"{category_url.rstrip('/')}/pagina{page}/"

def _clean_url(raw_url: str) -> str:
    return raw_url.split("?")[0].strip("/")

def _is_redirect(driver, expected_url: str) -> bool:
    return expected_url.rstrip("/") not in driver.current_url.rstrip("/")

def _absolute_url(href: str) -> str:
    if href.startswith("http"):
        return href
    return BASE_URL + (href if href.startswith("/") else f"/{href}")

# Product URL extraction strategies
def _extract_urls_from_json_ld(soup: BeautifulSoup) -> list[str]:
    urls = []
    for script in soup.find_all("script", {"type": "application/ld+json"}):
        try:
            content = json.loads(script.string)
            if content.get("@type") == "ItemList" and "itemListElement" in content:
                for item in content["itemListElement"]:
                    url = item.get("item", {}).get("url")
                    if url:
                        urls.append(_clean_url(url))
        except (json.JSONDecodeError, TypeError):
            continue
    return urls

def _extract_urls_from_css(soup: BeautifulSoup) -> list[str]:
    urls = []
    for a in soup.select("a.product-title, .product-box-container a[href*='/p/']"):
        href = a.get("href")
        if not href:
            continue
        clean = _clean_url(_absolute_url(href))
        if "/p/" in clean:
            urls.append(clean)
    return urls

def _extract_page_urls(soup: BeautifulSoup) -> list[str]:
    """Try JSON-LD first; fall back to CSS selectors when unavailable."""
    return _extract_urls_from_json_ld(soup) or _extract_urls_from_css(soup)

# Pagination
def _load_page(driver, url: str) -> BeautifulSoup:
    driver.get(url)
    time.sleep(PAGE_LOAD_DELAY)
    return BeautifulSoup(driver.page_source, "html.parser")

def _page_has_no_results(soup: BeautifulSoup) -> bool:
    return soup.select_one(NO_RESULTS_SELECTORS) is not None

def get_all_product_urls(driver, category_url: str, max_pages: int = 100) -> list[str]:
    """Paginate through a category and return all unique product URLs."""
    all_urls: set[str] = set()
    collected: list[str] = []

    for page in range(1, max_pages + 1):
        page_url = _build_page_url(category_url, page)
        log.info("Scanning page %d: %s", page, page_url)

        soup = _load_page(driver, page_url)

        if page > 1 and _is_redirect(driver, page_url):
            log.info("Redirect detected at page %d — end of category.", page)
            break

        if _page_has_no_results(soup):
            log.info("Page %d is empty. Stopping.", page)
            break

        page_urls  = _extract_page_urls(soup)
        new_urls   = [u for u in page_urls if u not in all_urls]

        if not page_urls:
            log.info("No products on page %d. Stopping pagination.", page)
            break

        if not new_urls:
            log.info("Page %d returned only already-seen products. Stopping.", page)
            break

        log.info("  Page %d: %d new products found.", page, len(new_urls))
        all_urls.update(new_urls)
        collected.extend(new_urls)

    log.info("Total URLs collected: %d", len(collected))
    return collected

# Spec extraction
def _normalise_key(raw: str) -> str:
    return re.sub(r"[^a-z0-9_]", "", raw.strip().lower())

def _safe_text(tag) -> str:
    return tag.get_text(strip=True) if tag else "N/A"

def _extract_title(soup: BeautifulSoup) -> str:
    tag = soup.find("h1") or soup.select_one(".product-title, [class*='product-name']")
    return _safe_text(tag)

def _extract_price(soup: BeautifulSoup) -> str | None:
    tag = soup.select_one(".pret-nou, .price, [class*='price']")
    return tag.get_text(strip=True) if tag else None

def _extract_table_specs(soup: BeautifulSoup) -> dict[str, str]:
    specs = {}
    for table in soup.find_all("table"):
        for row in table.find_all("tr"):
            cols = row.find_all(["td", "th"])
            if len(cols) == 2:
                key = _normalise_key(cols[0].get_text(strip=True))
                val = cols[1].get_text(strip=True)
                if key:
                    specs[key] = val or "N/A"
    return specs

def _extract_div_specs(soup: BeautifulSoup, existing_keys: set[str]) -> dict[str, str]:
    """
    Parse the modern PCGarage specification layout (div-based rows).
    Keys already present from table extraction are skipped to preserve priority.
    """
    specs = {}
    for row in soup.select(SPEC_ROW_SELECTORS):
        children = row.find_all(["span", "div"], recursive=False)
        if len(children) >= 2:
            key = _normalise_key(children[0].get_text(strip=True))
            val = children[1].get_text(strip=True)
            if key and key not in existing_keys:
                specs[key] = val or "N/A"
    return specs

def extract_specs_from_page(soup: BeautifulSoup) -> dict[str, str]:
    specs: dict[str, str] = {"denumire": _extract_title(soup)}

    price = _extract_price(soup)
    if price:
        specs["pret"] = price

    table_specs = _extract_table_specs(soup)
    specs.update(table_specs)

    div_specs = _extract_div_specs(soup, existing_keys=set(specs.keys()))
    specs.update(div_specs)

    return specs