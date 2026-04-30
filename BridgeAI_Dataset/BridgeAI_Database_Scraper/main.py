import argparse
import logging
import sys

from config import CATEGORIES, DB_PATH, CSV_OUTPUT_DIR
from database import init_database
from scraper import run_scraper
from exporter import export_all, export_table_to_csv

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("scraper.log", encoding="utf-8"),
    ],
)
log = logging.getLogger(__name__)

# CLI
def _build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="PCGarage Scraper — extract product specifications"
    )
    parser.add_argument(
        "--categories",
        nargs="+",
        choices=list(CATEGORIES.keys()),
        default=None,
        metavar="CATEGORY",
        help=(
            "One or more categories to scrape. "
            "If omitted, all categories are processed. "
            f"Available: {', '.join(CATEGORIES.keys())}"
        ),
    )
    parser.add_argument(
        "--export",
        action="store_true",
        help="Export database contents to CSV files after scraping.",
    )
    parser.add_argument(
        "--export-only",
        action="store_true",
        dest="export_only",
        help="Skip scraping and export existing data to CSV only.",
    )
    return parser

def parse_args() -> argparse.Namespace:
    return _build_arg_parser().parse_args()

# Startup banner
def _log_startup_banner() -> None:
    log.info("=" * 60)
    log.info("  PCGarage Scraper started")
    log.info("  Database:   %s", DB_PATH)
    log.info("  CSV output: %s/", CSV_OUTPUT_DIR)
    log.info("=" * 60)

# Export helpers
def _export_selected_categories(categories: list[str]) -> None:
    for cat_key in categories:
        table = CATEGORIES[cat_key]["table"]
        path  = export_table_to_csv(table)
        if path:
            log.info("  -> %s", path)

def _export_all_categories() -> None:
    for path in export_all().values():
        log.info("  -> %s", path)

def _run_export(args: argparse.Namespace) -> None:
    log.info("CSV export...")
    # When specific categories are given and we are not in export-only mode,
    # export only those tables; otherwise export everything.
    if args.categories and not args.export_only:
        _export_selected_categories(args.categories)
    else:
        _export_all_categories()

# Entry point
def main() -> None:
    args = parse_args()

    _log_startup_banner()
    init_database()

    if not args.export_only:
        run_scraper(categories=args.categories)

    if args.export or args.export_only:
        _run_export(args)

    log.info("Done!")

if __name__ == "__main__":
    main()