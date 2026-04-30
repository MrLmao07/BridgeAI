from bs4 import BeautifulSoup
from utils import (
    extract_specs_from_page,
    extract_product_name,
    extract_warranty,
    get_spec,
)


def parse_tablets(soup: BeautifulSoup, url: str) -> dict:
    specs = extract_specs_from_page(soup)
    comm_warranty, conf_warranty = extract_warranty(soup)

    return {
        "name":                  extract_product_name(soup),
        "manufacturer_code":     get_spec(specs, "Manufacturer Code", "Part Number"),
        "commercial_warranty":   comm_warranty,
        "conformity_warranty":   conf_warranty,

        # Display
        "disp_model":            get_spec(specs, "Display|Model"),
        "disp_diagonal":         get_spec(specs, "Diagonal"),
        "disp_resolution":       get_spec(specs, "Resolution"),
        "disp_aspect_ratio":     get_spec(specs, "Aspect Ratio"),
        "disp_format":           get_spec(specs, "Format"),
        "disp_technology":       get_spec(specs, "Screen Technology", "Technology"),
        "disp_hdr":              get_spec(specs, "HDR"),
        "disp_high_refresh_rate":get_spec(specs, "High Refresh Rate"),
        "disp_pixel_density":    get_spec(specs, "Pixel Density", "PPI"),
        "disp_touchscreen_type": get_spec(specs, "Touchscreen Type"),
        "disp_multi_touch":      get_spec(specs, "Multi-touch"),
        "disp_screen_protection":get_spec(specs, "Screen Protection"),

        # Processor
        "proc_manufacturer":     get_spec(specs, "Processor|Manufacturer"),
        "proc_family":           get_spec(specs, "Family"),
        "proc_model":            get_spec(specs, "Processor|Model"),
        "proc_frequency":        get_spec(specs, "Frequency"),
        "proc_turbo_frequency":  get_spec(specs, "Turbo Frequency", "Turbo"),
        "proc_core_count":       get_spec(specs, "Core Count", "Cores"),
        "proc_technology":       get_spec(specs, "Processor|Technology"),

        # Graphics Card
        "gpu_manufacturer":      get_spec(specs, "Graphics Card|Manufacturer"),
        "gpu_series":            get_spec(specs, "Graphics Card|Series"),
        "gpu_model":             get_spec(specs, "Graphics Card|Model"),

        # RAM Memory
        "ram_capacity":          get_spec(specs, "RAM Capacity", "RAM"),

        # Storage
        "storage_capacity":      get_spec(specs, "Storage|Capacity"),

        # Connectivity
        "wireless":              get_spec(specs, "Wireless"),
        "bluetooth":             get_spec(specs, "Bluetooth"),

        # Ports
        "usb_type_c":            get_spec(specs, "USB Type C", "USB-C"),

        # AI
        "ai":                    get_spec(specs, "AI"),
        "ai_technology":         get_spec(specs, "AI|Technology"),

        # Multimedia
        "main_camera":           get_spec(specs, "Main Camera"),
        "secondary_camera":      get_spec(specs, "Secondary Camera"),
        "card_reader":           get_spec(specs, "Card Reader"),
        "built_in_microphone":   get_spec(specs, "Built-in Microphone", "Microphone"),
        "speaker":               get_spec(specs, "Speaker"),
        "sound":                 get_spec(specs, "Sound"),

        # Sensors
        "accelerometer":         get_spec(specs, "Accelerometer"),
        "proximity":             get_spec(specs, "Proximity"),
        "gyroscope":             get_spec(specs, "Gyroscope"),
        "fingerprint":           get_spec(specs, "Fingerprint"),
        "ambient_light":         get_spec(specs, "Ambient Light"),
        "compass":               get_spec(specs, "Compass"),

        # Software
        "operating_system":      get_spec(specs, "Operating System", "OS"),
        "os_version":            get_spec(specs, "Version"),
        "preinstalled":          get_spec(specs, "Preinstalled"),
        "os_mentions":           get_spec(specs, "Software|Mentions"),

        # Battery
        "battery_type":          get_spec(specs, "Battery|Type"),
        "battery_capacity":      get_spec(specs, "Battery|Capacity"),
        "fast_charging":         get_spec(specs, "Fast Charging Support", "Fast Charging"),

        # Dimensions
        "dimensions":            get_spec(specs, "Dimensions"),
        "weight":                get_spec(specs, "Weight"),

        # Miscellaneous
        "color":                 get_spec(specs, "Color"),
        "chassis_material":      get_spec(specs, "Chassis Material", "Material"),
        "misc_others":           get_spec(specs, "Miscellaneous|Others"),

        "url": url,
    }