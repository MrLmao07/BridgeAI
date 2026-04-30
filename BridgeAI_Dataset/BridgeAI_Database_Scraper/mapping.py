# ─────────────────────────────────────────────────────────────────────────────
# Field & value translations
#
# Keys are Romanian scraper field names (or their normalised forms).
# Values are canonical English field names used throughout the application.
#
# Cell-value translations (e.g. "da" -> "yes") are intentionally kept in the
# same dict: the lookup logic in translate_data() handles both uniformly.
# ─────────────────────────────────────────────────────────────────────────────

TRANSLATIONS: dict[str, str] = {
    # General / Identification
    "denumire":                   "product_name",
    "cod_producator":             "producer_code",
    "codproducator":              "producer_code",
    "garantie_comerciala":        "commercial_warranty",
    "garantiecomerciala":         "commercial_warranty",
    "garantie_conformitate":      "compliance_warranty",
    "garantiedeconformitate":     "compliance_warranty",
    "garantie_persoane_juridice": "legal_warranty",
    "garantiepersoanejuridice":   "legal_warranty",
    "tip_garantie":               "warranty_type",
    "pret":                       "price",
    "url":                        "url",

    # Laptop & general tech
    "platforma":   "platform",
    "serie":       "series",
    "categorie":   "category",
    "model":       "model",
    "tip":         "type",
    "ai_ready":    "ai_ready",
    "culoare":     "color",
    "carcasa":     "case_material",
    "greutate":    "weight",
    "dimensiuni":  "dimensions",
    "security_lock": "kensington_lock",
    "tpm":         "tpm_security",

    # Display — laptops, monitors, TVs, tablets, phones
    "disp_diagonala":    "display_size",
    "diagonala":         "display_size",
    "diagonala_inch":    "display_size_inch",
    "diagonala_cm":      "display_size_cm",
    "disp_rezolutie":    "resolution",
    "rezolutie":         "resolution",
    "disp_format":       "display_format",
    "format":            "display_format",
    "disp_tehnologie":   "display_technology",
    "tehnologie":        "technology",
    "disp_rata_refresh": "refresh_rate",
    "rata_refresh":      "refresh_rate",
    "refresh_rate":      "refresh_rate",
    "disp_luminozitate": "brightness",
    "luminozitate":      "brightness",
    "disp_timp_raspuns": "response_time",
    "timp_raspuns":      "response_time",
    "disp_touchscreen":  "touchscreen",
    "tip_panel":         "panel_type",
    "aspect_imagine":    "aspect_ratio",
    "hdr":               "hdr",
    "imagine_hd":        "hd_image_type",
    "tip_display":       "display_type",
    "curbura":           "curvature",
    "iluminare":         "backlight",
    "clasa_energetica":  "energy_class",
    "dci_p3":            "color_gamut_p3",
    "srgb":              "color_gamut_srgb",
    "delta_e":           "color_accuracy_delta_e",
    "local_dimming":     "local_dimming_zones",
    "contrast_nativ":    "native_contrast",

    # CPU
    "proc_producator":   "cpu_manufacturer",
    "proc_familie":      "cpu_family",
    "proc_model":        "cpu_model",
    "proc_nuclee":       "cpu_cores",
    "nuclee":            "cores",
    "proc_frecventa":    "cpu_frequency",
    "frecventa":         "frequency",
    "frecventa_procesor":"cpu_frequency",
    "npu":               "npu_performance",

    # Memory & storage
    "mem_capacitate":    "ram_capacity",
    "memorie":           "ram_memory",
    "mem_tip":           "ram_type",
    "stoc_tip":          "storage_type",
    "stoc_capacitate_ssd":"ssd_capacity",
    "capacitate_stocare":"storage_capacity",
    "capacitate":        "capacity",
    "sloturi_libere":    "free_ram_slots",

    # GPU
    "vid_producator": "gpu_manufacturer",
    "vid_model":      "gpu_model",
    "vid_serie":      "gpu_series",
    "vid_tip":        "gpu_type",
    "tgp":            "gpu_power_wattage",

    # Connectivity & ports
    "wireless":           "wireless",
    "bluetooth":          "bluetooth",
    "dual_sim":           "dual_sim",
    "tip_sim":            "sim_type",
    "retea_rj45":         "ethernet_port",
    "hdmi":               "hdmi_ports",
    "usb_20":             "usb_20_ports",
    "usb_30":             "usb_30_ports",
    "usb_c":              "usb_c_ports",
    "thunderbolt":        "thunderbolt_ports",
    "jack_35":            "audio_jack",
    "conectarebluetooth": "bluetooth_connection",
    "conectarewireless":  "wireless_connection",
    "razaactiune":        "operating_range",
    "portincarcare":      "charging_port",
    "lungimecablu":       "cable_length",

    # Audio & multimedia — headphones, TVs, phones
    "sunet":               "sound_system",
    "boxe":                "speakers",
    "microfon":            "microphone",
    "tipcasca":            "headphone_type",
    "noisecanceling":      "noise_canceling",
    "diametrudifuzoare":   "driver_diameter",
    "impedance":           "impedance",
    "frecventejoase":      "low_frequency",
    "frecventeinalte":     "high_frequency",
    "sensitivity":         "sensitivity",
    "butoanecontrol":      "control_buttons",
    "timpdeincarcare":     "charging_time",
    "duratamuzicaconvorbire": "battery_life_music",
    "duratastandby":       "standby_time",
    "camera_web":          "webcam",
    "camera_foto":         "camera_main",
    "camera_secundara":    "camera_selfie",
    "spatial_audio":       "spatial_audio_support",

    # Phones & tablets
    "certificare":       "certification",
    "senzori":           "sensors",
    "amprenta":          "fingerprint_sensor",
    "giroscop":          "gyroscope",
    "accelerometru":     "accelerometer",
    "proximitate":       "proximity_sensor",
    "hall_sensor":       "hall_effect_sensor",
    "suport_stylus":     "stylus_support",
    "incarcare_inversa": "reverse_wireless_charging",

    # Software & battery
    "sistem_operare":      "os",
    "versiune_os":         "os_version",
    "baterie_tip":         "battery_type",
    "baterie_capacitate":  "battery_capacity",
    "incarcare_rapida":    "fast_charging_watts",
    "incarcarewirelessqi": "wireless_charging_qi",

    # Cell-value translations
    "da":      "yes",
    "nu":      "no",
    "nu are":  "none",
    "negru":   "black",
    "alb":     "white",
    "argintiu":"silver",
    "gri":     "grey",
    "albastru":"blue",
    "auriu":   "gold",
    "pliabile":"foldable",
}

def _normalise_key(raw: str) -> str:
    """
    Collapse a raw scraper key to its lookup form.
    Spaces and underscores are stripped so that "Tip Casca" and "tip_casca"
    both resolve to "tipcasca" and hit the same TRANSLATIONS entry.
    """
    return raw.lower().strip().replace(" ", "").replace("_", "")

def _translate_key(raw_key: str) -> str:
    normalised = _normalise_key(raw_key)
    # Try the normalised form first, then the original lowercased key,
    # and fall back to the raw key unchanged.
    return TRANSLATIONS.get(normalised, TRANSLATIONS.get(raw_key.lower().strip(), raw_key))

def _translate_value(value: object) -> object:
    if not isinstance(value, str):
        return value
    return TRANSLATIONS.get(value.lower().strip(), value)

def translate_data(data: dict) -> dict:
    """Translate all keys and string values in a scraped record to their canonical English forms."""
    if not data:
        return {}
    return {_translate_key(k): _translate_value(v) for k, v in data.items()}