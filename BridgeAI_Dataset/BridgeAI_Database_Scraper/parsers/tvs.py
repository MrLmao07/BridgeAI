from bs4 import BeautifulSoup
from utils import (
    extract_specs_from_page,
    extract_product_name,
    extract_warranty,
    get_spec,
)


def parse_tvs(soup: BeautifulSoup, url: str) -> dict:
    specs = extract_specs_from_page(soup)
    comm_warranty, conf_warranty = extract_warranty(soup)

    return {
        "name":                  extract_product_name(soup),
        "manufacturer_code":     get_spec(specs, "Manufacturer Code", "Part Number"),
        "commercial_warranty":   comm_warranty,
        "conformity_warranty":   conf_warranty,

        # Screen 
        "series":                get_spec(specs, "Series"),
        "display_type":          get_spec(specs, "Display Type", "Panel"),
        "hd_image":              get_spec(specs, "HD Image", "HD"),
        "diagonal_inch":         get_spec(specs, "Diagonal inch"),
        "diagonal_cm":           get_spec(specs, "Diagonal cm"),
        "resolution":            get_spec(specs, "Resolution"),
        "aspect_ratio":          get_spec(specs, "Image Aspect Ratio", "Aspect ratio"),
        "hdr":                   get_spec(specs, "HDR"),
        "image_processor":       get_spec(specs, "Image Processor"),
        "screen_share_support":  get_spec(specs, "Screen Share Support"),
        "internet_tv":           get_spec(specs, "Internet TV"),
        "smart_tv":              get_spec(specs, "Smart TV"),
        "operating_system":      get_spec(specs, "Operating System", "OS"),

        # Audio 
        "sound_output_rms":      get_spec(specs, "Sound Output (RMS)", "RMS"),
        "sound":                 get_spec(specs, "Sound"),
        "speakers":              get_spec(specs, "Speakers"),
        "speaker_system":        get_spec(specs, "Speaker System"),
        "dts_support":           get_spec(specs, "DTS Sound Support", "DTS"),
        "dolby_support":         get_spec(specs, "Dolby Sound Support", "Dolby"),

        # Connectivity 
        "usb_2_0":               get_spec(specs, "USB 2.0", "USB"),
        "hdmi":                  get_spec(specs, "HDMI"),
        "spdif":                 get_spec(specs, "S/PDIF"),
        "ci_slot_support":       get_spec(specs, "CI Slot Support", "CI+"),
        "lan_rj45":              get_spec(specs, "LAN RJ-45", "Ethernet"),
        "wireless":              get_spec(specs, "Wireless", "Wi-Fi"),
        "bluetooth":             get_spec(specs, "Bluetooth"),

        # General Features 
        "refresh_rate":          get_spec(specs, "Refresh Rate"),
        "multimedia_player":     get_spec(specs, "Integrated Multimedia Player"),
        "functions":             get_spec(specs, "Functions"),
        "tv_system":             get_spec(specs, "TV System"),
        "dim_with_stand":        get_spec(specs, "Dimension (with stand)"),
        "dim_without_stand":     get_spec(specs, "Dimension (without stand)"),
        "weight_with_stand":     get_spec(specs, "Weight (with stand)"),
        "weight_without_stand":  get_spec(specs, "Weight (without stand)"),
        "operating_consumption": get_spec(specs, "Operating Power Consumption"),
        "standby_consumption":   get_spec(specs, "Stand-by Consumption"),
        "vesa_mount":            get_spec(specs, "VESA Wall Mount", "VESA"),
        "color":                 get_spec(specs, "Color"),
        "smart_content":         get_spec(specs, "Smart Content"),
        "range":                 get_spec(specs, "Range"),
        "energy_class":          get_spec(specs, "Energy Class (EU)", "Energy class"),

        # Accessories 
        "included_accessories":  get_spec(specs, "Included accessories"),

        "url": url,
    }