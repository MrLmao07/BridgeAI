from bs4 import BeautifulSoup
from utils import (
    extract_specs_from_page,
    extract_product_name,
    extract_warranty,
    get_spec,
)


def parse_laptops(soup: BeautifulSoup, url: str) -> dict:
    specs = extract_specs_from_page(soup)
    garantie_com, garantie_conf = extract_warranty(soup)

    return {
        "denumire":              extract_product_name(soup),
        "cod_producator":        get_spec(specs, "Cod producător", "Part Number"),
        "garantie_comerciala":   garantie_com,
        "garantie_conformitate": garantie_conf,

        # Notebook Type  
        "tip_garantie":          get_spec(specs, "Tip garanție", "Tip garantie"),
        "platforma":             get_spec(specs, "Platformă", "Platforma"),
        "serie":                 get_spec(specs, "Serie"),
        "categorie":             get_spec(specs, "Categorie"),

        # Display  
        "disp_diagonala":        get_spec(specs, "Diagonală", "Diagonala"),
        "disp_rezolutie":        get_spec(specs, "Rezoluție", "Rezolutie"),
        "disp_format":           get_spec(specs, "Format"),
        "disp_iluminare":        get_spec(specs, "Iluminare"),
        "disp_suprafata":        get_spec(specs, "Suprafață", "Suprafata"),
        "disp_tehnologie":       get_spec(specs, "Tehnologie ecran", "Tehnologie"),
        "disp_gsync":            get_spec(specs, "G-Sync"),
        "disp_low_blue_light":   get_spec(specs, "Low Blue Light"),
        "disp_refresh_rate":     get_spec(specs, "Rată Refresh", "Refresh Rate", "Rata Refresh"),
        "disp_hdr":              get_spec(specs, "HDR"),
        "disp_luminozitate":     get_spec(specs, "Luminozitate"),
        "disp_altele":           get_spec(specs, "Display|Altele"),
        "disp_dci_p3":           get_spec(specs, "DCI-P3"),
        "disp_color_calibrator": get_spec(specs, "Color Calibrator"),

        # Processor  
        "proc_producator":       get_spec(specs, "Procesor|Producător", "Producător procesor"),
        "proc_nume":             get_spec(specs, "Nume"),
        "proc_familie":          get_spec(specs, "Familie"),
        "proc_tip":              get_spec(specs, "Procesor|Tip"),
        "proc_model":            get_spec(specs, "Procesor|Model"),
        "proc_nucleu":           get_spec(specs, "Nucleu"),
        "proc_numar_nuclee":     get_spec(specs, "Număr nuclee", "Numar nuclee"),
        "proc_numar_threaduri":  get_spec(specs, "Număr thread-uri", "Threaduri"),
        "proc_frecventa_turbo":  get_spec(specs, "Frecvență turbo", "Turbo"),
        "proc_grafic_integrat":  get_spec(specs, "Procesor grafic integrat", "GPU integrat"),
        "proc_ai":               get_spec(specs, "Procesor|AI"),
        "proc_altele":           get_spec(specs, "Procesor|Altele"),

        # Memory 
        "mem_capacitate":        get_spec(specs, "Memorie|Capacitate"),
        "mem_tip":               get_spec(specs, "Tip memorie", "Tip RAM"),
        "mem_frecventa":         get_spec(specs, "Memorie|Frecvență", "Frecventa RAM"),
        "mem_sloturi":           get_spec(specs, "Sloturi RAM", "Sloturi"),
        "mem_slot1":             get_spec(specs, "Slot 1"),
        "mem_slot2":             get_spec(specs, "Slot 2"),

        # Storage  
        "ssd":                   get_spec(specs, "Solid State Disk", "SSD"),
        "ssd_capacitate":        get_spec(specs, "Stocare|Capacitate"),
        "ssd_tip":               get_spec(specs, "Tip SSD"),

        # Graphics Card
        "gpu_producator":        get_spec(specs, "Placă Video|Producător", "Chipset producător"),
        "gpu_seria":             get_spec(specs, "Placă Video|Seria", "Seria GPU"),
        "gpu_model":             get_spec(specs, "Placă Video|Model"),
        "gpu_memorie_dedicata":  get_spec(specs, "Memorie dedicată"),
        "gpu_tip":               get_spec(specs, "Placă Video|Tip"),
        "gpu_altele":            get_spec(specs, "Placă Video|Altele"),
        "gpu_directx12":         get_spec(specs, "DirectX 12", "DirectX"),
        "gpu_dedicata":          get_spec(specs, "Placă video (Dedicată)", "GPU Dedicat"),

        # Optical Unit
        "unitate_optica":        get_spec(specs, "Unitate optică", "Unitate optica"),
        "optica_altele":         get_spec(specs, "Optică|Altele"),

        # Sound 
        "sunet":                 get_spec(specs, "Sunet|Sunet"),
        "boxe":                  get_spec(specs, "Boxe"),
        "microfon_incorporat":   get_spec(specs, "Microfon încorporat", "Microfon"),
        "putere_boxe":           get_spec(specs, "Putere boxe"),
        "sistem_sunet":          get_spec(specs, "Sistem"),
        "tehnologii_sunet":      get_spec(specs, "Sunet|Tehnologii"),
        "sunet_altele":          get_spec(specs, "Sunet|Altele"),

        # Conectivity  
        "wireless":              get_spec(specs, "Wireless"),
        "bluetooth":             get_spec(specs, "Bluetooth"),

        # Ports 
        "usb_3gen1":             get_spec(specs, "USB 3.2 Gen 1", "USB 3.0", "USB 3"),
        "usb_c":                 get_spec(specs, "USB-C", "USB Type-C"),
        "hdmi":                  get_spec(specs, "HDMI"),
        "audio_jack":            get_spec(specs, "Audio Jack", "Jack"),
        "thunderbolt4":          get_spec(specs, "Thunderbolt 4", "Thunderbolt"),

        # Battery
        "baterie_putere":        get_spec(specs, "Baterie|Putere"),
        "adaptor":               get_spec(specs, "Adaptor"),

        # Dimensions
        "dimensiuni":            get_spec(specs, "Dimensiuni"),
        "greutate":              get_spec(specs, "Greutate"),

        # Software 
        "sistem_operare":        get_spec(specs, "Sistem de operare", "OS"),

        # Security
        "parola_bios":           get_spec(specs, "Parolă Bios", "Parola BIOS"),
        "parola_hdd":            get_spec(specs, "Parolă HDD", "Parola HDD"),
        "suport_tpm":            get_spec(specs, "Suport TPM", "TPM"),

        # Multimedia  
        "camera_web":            get_spec(specs, "Cameră web", "Webcam"),
        "cititor_carduri":       get_spec(specs, "Cititor carduri"),
        "carduri_suportate":     get_spec(specs, "Carduri suportate"),
        "tastatura":             get_spec(specs, "Tastatură", "Tastatura"),
        "tastatura_numerica":    get_spec(specs, "Tastatură numerică", "Numpad"),
        "tastatura_iluminata":   get_spec(specs, "Tastatură iluminată", "Backlit"),
        "iluminare_rgb":         get_spec(specs, "Iluminare RGB", "RGB"),
        "tastatura_layout":      get_spec(specs, "Tastatură layout", "Layout"),
        "touchpad":              get_spec(specs, "TouchPad", "Touchpad"),

        # Miscellaneous 
        "culoare":               get_spec(specs, "Culoare"),
        "carcasa":               get_spec(specs, "Carcasă", "Carcasa"),
        "drivere":               get_spec(specs, "Drivere"),
        "surface_treatment":     get_spec(specs, "Surface Treatment"),
        "diverse_altele":        get_spec(specs, "Diverse|Altele"),

        # AI Ready 
        "ai_ready":              get_spec(specs, "AI Ready"),
        "tops_procesor":         get_spec(specs, "TOPS Procesor"),
        "tops_placa_video":      get_spec(specs, "TOPS Placă video"),
        "ai_mentiune":           get_spec(specs, "AI Ready|Mențiune"),

        "url": url,
    }
