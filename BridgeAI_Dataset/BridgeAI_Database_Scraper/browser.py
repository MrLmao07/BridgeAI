import random
import time
import logging
import undetected_chromedriver as uc
from config import MIN_DELAY, MAX_DELAY, HEADLESS

log = logging.getLogger(__name__)

def create_driver() -> uc.Chrome:
    options = uc.ChromeOptions()
    if HEADLESS:
        options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--lang=ro-RO")
    try:
        driver = uc.Chrome(options=options, version_main=146, use_subprocess=True)
    except Exception as e:
        log.error(f"Eroare uc.Chrome: {e}")
        driver = uc.Chrome(options=options, use_subprocess=True)
    return driver

def human_delay(min_d=MIN_DELAY, max_d=MAX_DELAY):
    time.sleep(random.uniform(min_d, max_d))

def scroll_page_slowly(driver):
    total_height = driver.execute_script("return document.body.scrollHeight")
    curr = 0
    while curr < total_height:
        curr += random.randint(300, 600)
        driver.execute_script(f"window.scrollTo(0, {curr});")
        time.sleep(random.uniform(0.2, 0.4))
        total_height = driver.execute_script("return document.body.scrollHeight")

def safe_get(driver, url, retries=3):
    for attempt in range(1, retries + 1):
        try:
            driver.get(url)
            time.sleep(3)
            if "just a moment" not in driver.title.lower():
                scroll_page_slowly(driver)
                return True
        except Exception:
            pass
    return False