from bs4 import BeautifulSoup
from utils import (
    extract_specs_from_page,
    extract_product_name,
    extract_warranty,
    get_spec,
)


def parse_monitors(soup: BeautifulSoup, url: str) -> dict:
    specs = extract_specs_from_page(soup)
    comm_warranty, conf_warranty = extract_warranty(soup)

    return {
        "name":                  extract_product_name(soup),
        "manufacturer_code":     get_spec(specs, "Manufacturer code", "Part Number"),
        "commercial_warranty":   comm_warranty,
        "conformity_warranty":   conf_warranty,

        # Features  
        "streaming_recommended": get_spec(specs, "Recommended for Streaming"),
        "recommended_for":       get_spec(specs, "Recommended for"),
        "panel_type":            get_spec(specs, "Panel type", "Panel"),
        "diagonal":              get_spec(specs, "Diagonal"),
        "resolution":            get_spec(specs, "Resolution"),
        "response_time":         get_spec(specs, "Response time"),
        "refresh_rate":          get_spec(specs, "Refresh Rate", "Refresh rate"),
        "aspect_ratio":          get_spec(specs, "Aspect ratio", "Aspect"),
        "contrast":              get_spec(specs, "Contrast"),
        "brightness":            get_spec(specs, "Brightness"),
        "viewing_angle":         get_spec(specs, "Viewing angle"),
        "standards":             get_spec(specs, "Standards"),
        "color":                 get_spec(specs, "Color"),
        "power_consumption":     get_spec(specs, "Power consumption", "Consumption"),
        "built_in_speakers":     get_spec(specs, "Built-in speakers", "Speakers"),
        "dimensions":            get_spec(specs, "Dimensions"),
        "weight":                get_spec(specs, "Weight"),
        "wall_mount":            get_spec(specs, "Wall mount", "VESA"),
        "plug_and_play":         get_spec(specs, "Plug and play"),
        "included_accessories":  get_spec(specs, "Included accessories"),
        "technologies":          get_spec(specs, "Technologies"),
        "curved":                get_spec(specs, "Curved"),
        "curvature":             get_spec(specs, "Curvature"),
        "backlight":             get_spec(specs, "Backlight", "Lighting"),
        "energy_class":          get_spec(specs, "Energy class"),

        # Technologies  
        "freesync":              get_spec(specs, "FreeSync", "AMD FreeSync"),
        "flicker_free":          get_spec(specs, "Flicker Free"),
        "blue_light_reducer":    get_spec(specs, "Blue Light Reducer", "Blue Light"),
        "hdr":                   get_spec(specs, "HDR"),
        "smart":                 get_spec(specs, "Smart"),
        "smart_functions":       get_spec(specs, "Smart functions"),

        # Ergonomics  
        "tilt":                  get_spec(specs, "Tilt"),
        "swivel":                get_spec(specs, "Swivel", "Swivel stand"),
        "pivot":                 get_spec(specs, "Pivot", "Pivot screen"),
        "adjustable_height":     get_spec(specs, "Adjustable height", "Height Adjust"),

        # Ports  
        "hdmi":                  get_spec(specs, "HDMI"),
        "display_port":          get_spec(specs, "Display Port", "DisplayPort"),
        "usb":                   get_spec(specs, "USB"),
        "jack":                  get_spec(specs, "Jack"),
        "rj45":                  get_spec(specs, "RJ-45", "Ethernet"),

        "url": url,
    }