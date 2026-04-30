from bs4 import BeautifulSoup
from utils import (
    extract_specs_from_page,
    extract_product_name,
    extract_warranty,
    get_spec,
)


def parse_laptops(soup: BeautifulSoup, url: str) -> dict:
    specs = extract_specs_from_page(soup)
    comm_warranty, conf_warranty = extract_warranty(soup)

    return {
        "name":                  extract_product_name(soup),
        "manufacturer_code":     get_spec(specs, "Manufacturer Code", "Part Number"),
        "commercial_warranty":   comm_warranty,
        "conformity_warranty":   conf_warranty,

        # Notebook Type
        "warranty_type":         get_spec(specs, "Warranty Type"),
        "platform":              get_spec(specs, "Platform"),
        "series":                get_spec(specs, "Series"),
        "category":              get_spec(specs, "Category"),

        # Display 
        "disp_diagonal":         get_spec(specs, "Diagonal"),
        "disp_resolution":       get_spec(specs, "Resolution"),
        "disp_format":           get_spec(specs, "Format"),
        "disp_lighting":         get_spec(specs, "Lighting", "Backlight"),
        "disp_surface":          get_spec(specs, "Surface"),
        "disp_technology":       get_spec(specs, "Screen Technology", "Technology"),
        "disp_gsync":            get_spec(specs, "G-Sync"),
        "disp_low_blue_light":   get_spec(specs, "Low Blue Light"),
        "disp_refresh_rate":     get_spec(specs, "Refresh Rate"),
        "disp_hdr":              get_spec(specs, "HDR"),
        "disp_brightness":       get_spec(specs, "Brightness"),
        "disp_others":           get_spec(specs, "Display|Others"),
        "disp_dci_p3":           get_spec(specs, "DCI-P3"),
        "disp_color_calibrator": get_spec(specs, "Color Calibrator"),

        # Processor 
        "proc_manufacturer":     get_spec(specs, "Processor|Manufacturer", "Processor Manufacturer"),
        "proc_name":             get_spec(specs, "Name"),
        "proc_family":           get_spec(specs, "Family"),
        "proc_type":             get_spec(specs, "Processor|Type"),
        "proc_model":            get_spec(specs, "Processor|Model"),
        "proc_core":             get_spec(specs, "Core"),
        "proc_core_count":       get_spec(specs, "Core Count", "Number of Cores"),
        "proc_thread_count":     get_spec(specs, "Thread Count", "Threads"),
        "proc_turbo_frequency":  get_spec(specs, "Turbo Frequency", "Turbo"),
        "proc_integrated_gpu":   get_spec(specs, "Integrated Graphics Processor", "Integrated GPU"),
        "proc_ai":               get_spec(specs, "Processor|AI"),
        "proc_others":           get_spec(specs, "Processor|Others"),

        # Memory
        "mem_capacity":          get_spec(specs, "Memory|Capacity"),
        "mem_type":              get_spec(specs, "Memory Type", "RAM Type"),
        "mem_frequency":         get_spec(specs, "Memory|Frequency", "RAM Frequency"),
        "mem_slots":             get_spec(specs, "RAM Slots", "Slots"),
        "mem_slot1":             get_spec(specs, "Slot 1"),
        "mem_slot2":             get_spec(specs, "Slot 2"),

        # Storage 
        "ssd":                   get_spec(specs, "Solid State Disk", "SSD"),
        "ssd_capacity":          get_spec(specs, "Storage|Capacity"),
        "ssd_type":              get_spec(specs, "SSD Type"),

        # Graphics Card 
        "gpu_manufacturer":      get_spec(specs, "Graphics Card|Manufacturer", "Chipset Manufacturer"),
        "gpu_series":            get_spec(specs, "Graphics Card|Series", "GPU Series"),
        "gpu_model":             get_spec(specs, "Graphics Card|Model"),
        "gpu_dedicated_memory":  get_spec(specs, "Dedicated Memory"),
        "gpu_type":              get_spec(specs, "Graphics Card|Type"),
        "gpu_others":            get_spec(specs, "Graphics Card|Others"),
        "gpu_directx12":         get_spec(specs, "DirectX 12", "DirectX"),
        "gpu_dedicated":         get_spec(specs, "Graphics Card (Dedicated)", "Dedicated GPU"),

        # Optical Drive 
        "optical_drive":         get_spec(specs, "Optical Drive"),
        "optical_others":        get_spec(specs, "Optical|Others"),

        # Sound 
        "sound":                 get_spec(specs, "Sound|Sound"),
        "speakers":              get_spec(specs, "Speakers"),
        "built_in_mic":          get_spec(specs, "Built-in Microphone", "Microphone"),
        "speaker_power":         get_spec(specs, "Speaker Power"),
        "sound_system":          get_spec(specs, "System"),
        "sound_technologies":    get_spec(specs, "Sound|Technologies"),
        "sound_others":          get_spec(specs, "Sound|Others"),

        # Connectivity 
        "wireless":              get_spec(specs, "Wireless"),
        "bluetooth":             get_spec(specs, "Bluetooth"),

        # Ports 
        "usb_3gen1":             get_spec(specs, "USB 3.2 Gen 1", "USB 3.0", "USB 3"),
        "usb_c":                 get_spec(specs, "USB-C", "USB Type-C"),
        "hdmi":                  get_spec(specs, "HDMI"),
        "audio_jack":            get_spec(specs, "Audio Jack", "Jack"),
        "thunderbolt4":          get_spec(specs, "Thunderbolt 4", "Thunderbolt"),

        # Battery  
        "battery_power":         get_spec(specs, "Battery|Power"),
        "adapter":               get_spec(specs, "Adapter"),

        # Dimensions  
        "dimensions":            get_spec(specs, "Dimensions"),
        "weight":                get_spec(specs, "Weight"),

        # Software 
        "operating_system":      get_spec(specs, "Operating System", "OS"),

        # Security 
        "bios_password":         get_spec(specs, "Bios Password", "BIOS Password"),
        "hdd_password":          get_spec(specs, "HDD Password"),
        "tpm_support":           get_spec(specs, "TPM Support", "TPM"),

        # Multimedia 
        "webcam":                get_spec(specs, "Webcam", "Web Camera"),
        "card_reader":           get_spec(specs, "Card Reader"),
        "supported_cards":       get_spec(specs, "Supported Cards"),
        "keyboard":              get_spec(specs, "Keyboard"),
        "numeric_keypad":        get_spec(specs, "Numeric Keypad", "Numpad"),
        "backlit_keyboard":      get_spec(specs, "Backlit Keyboard", "Backlit"),
        "rgb_lighting":          get_spec(specs, "RGB Lighting", "RGB"),
        "keyboard_layout":       get_spec(specs, "Keyboard Layout", "Layout"),
        "touchpad":              get_spec(specs, "TouchPad", "Touchpad"),

        # Miscellaneous 
        "color":                 get_spec(specs, "Color"),
        "chassis":               get_spec(specs, "Chassis", "Case"),
        "drivers":               get_spec(specs, "Drivers"),
        "surface_treatment":     get_spec(specs, "Surface Treatment"),
        "misc_others":           get_spec(specs, "Miscellaneous|Others"),

        # AI Ready
        "ai_ready":              get_spec(specs, "AI Ready"),
        "processor_tops":        get_spec(specs, "Processor TOPS"),
        "gpu_tops":              get_spec(specs, "Graphics Card TOPS"),
        "ai_mention":            get_spec(specs, "AI Ready|Mention"),

        "url": url,
    }