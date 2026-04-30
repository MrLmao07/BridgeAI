from bs4 import BeautifulSoup
from utils import (
    extract_specs_from_page,
    extract_product_name,
    extract_warranty,
    get_spec,
)


def parse_headphones(soup: BeautifulSoup, url: str) -> dict:
    """
    Extracts the specifications of a Headphones product.
    Returns a dict with keys corresponding to the table columns.
    """
    specs = extract_specs_from_page(soup)
    commercial_warranty, conformity_warranty = extract_warranty(soup)

    return {
        "name":                       extract_product_name(soup),
        "manufacturer_code":          get_spec(specs, "Manufacturer code", "Part Number", "SKU"),
        "commercial_warranty":        commercial_warranty,
        "conformity_warranty":        conformity_warranty,

        # Headphones
        "technology":                 get_spec(specs, "Technology"),
        "sound":                      get_spec(specs, "Sound"),
        "type":                       get_spec(specs, "Type"),
        "microphone":                 get_spec(specs, "Microphone"),
        "driver_diameter":            get_spec(specs, "Driver diameter", "Diameter"),
        "impedance":                  get_spec(specs, "Impedance"),
        "frequency_response":         get_spec(specs, "Frequency response"),
        "sensitivity":                get_spec(specs, "Sensitivity"),
        "color":                      get_spec(specs, "Color"),

        # Microphone 
        "microphone_frequency_response": get_spec(specs, "Microphone|Frequency response"),

        # Connectivity  
        "bluetooth_connection":       get_spec(specs, "Bluetooth connection", "Bluetooth"),
        "wireless_connection":        get_spec(specs, "Wireless connection", "Wireless"),

        # Compatibility 
        "compat_laptop_pc":           get_spec(specs, "Laptop", "PC", "Laptop / PC"),
        "compat_ps4":                 get_spec(specs, "PlayStation 4", "PS4"),
        "compat_smartphone_tablet":   get_spec(specs, "Smartphone", "Tablet"),
        "compat_nintendo":            get_spec(specs, "Nintendo"),
        "compat_ps5":                 get_spec(specs, "PlayStation 5", "PS5"),

        "url": url,
    }