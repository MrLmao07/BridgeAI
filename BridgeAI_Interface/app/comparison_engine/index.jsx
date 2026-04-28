import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  ScrollView, ActivityIndicator, StatusBar, Keyboard,
  Platform, Animated, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import styles from './styles';

// Constants 
const DB_DIR  = FileSystem.documentDirectory + 'SQLite/';
const DB_PATH = DB_DIR + 'Clean.db';
const DB_MIN_VALID_SIZE = 1000;

const ALL_TABLES = [
  { key: 'laptops',          label: 'Laptops' },
  { key: 'smartphones',      label: 'Smartphones' },
  { key: 'monitors',         label: 'Monitors' },
  { key: 'tvs',              label: 'Televisions' },
  { key: 'headphones',       label: 'Headphones' },
  { key: 'gaming_headphones',label: 'Gaming Headphones' },
  { key: 'tablets',          label: 'Tablets' },
];

const NAV_ITEMS = [
  { label: 'Account',    icon: require('../../assets/account.png'),    route: '/account' },
  { label: 'Axis',       icon: require('../../assets/chat.png'),       route: '/ai_conversation' },
  { label: 'Comparison', icon: require('../../assets/comparison.png'), route: null },
  { label: 'Help',       icon: require('../../assets/help.png'),       route: '/help' },
];

const SPEC_PRIORITY = {
  laptops: [
    'product_name', 'price', 'category', 'display_size', 'display_format',
    'ratarefresh', 'brightness', 'tehnologieecran', 'producator', 'model',
    'familie', 'numarnuclee', 'numarthreaduri', 'frecventaturbomax',
    'tipmemorie', 'capacity', 'frequency', 'capacitatessd', 'tipssd',
    'placavideo', 'memoriededicata', 'wireless', 'bluetooth',
    'sistemdeoperare', 'dimensions', 'weight', 'color',
  ],
  smartphones: [
    'product_name', 'price', 'model', 'color', 'marimedisplay', 'resolution',
    'ecran', 'highrefreshrate', 'cores', 'gpu', 'ram', 'memorieinternaflash',
    'camerafotoprincipala', 'camerafotosecundara', 'capacitateacumulator',
    'sistemoperare', 'versiune', 'bluetooth', 'wlan', '5g', '4g',
    'usbtipc', 'dimensions', 'weight',
  ],
  monitors: [
    'product_name', 'price', 'tippanel', 'display_size', 'resolution',
    'timpderaspuns', 'refreshrate', 'brightness', 'contrast',
    'freesync', 'hdmi_ports', 'displayport', 'dimensions', 'weight', 'color',
  ],
  tvs: [
    'product_name', 'price', 'tipdisplay', 'diagonalainch', 'imaginehd',
    'resolution', 'smarttv', 'sistemoperare', 'sound_system', 'iesiresunetrms',
    'hdmi_ports', 'usb20', 'wireless', 'bluetooth', 'ratarefresh',
    'dimensiunefarasuport', 'greutatefarasuport',
  ],
  headphones: [
    'product_name', 'price', 'headphone_type', 'sound_system', 'technology',
    'noise_canceling', 'microphone', 'impedanta', 'low_frequency',
    'high_frequency', 'sensibilitate', 'battery_life_music',
    'bluetooth_connection', 'cable_length', 'color', 'weight',
  ],
  gaming_headphones: [
    'product_name', 'price', 'type', 'sound_system', 'technology',
    'noise_canceling', 'microphone', 'driver_diameter', 'impedanta',
    'sensibilitate', 'bluetooth_connection', 'wireless_connection',
    'pc', 'playstation5', 'xboxseriesxxboxseriess', 'color', 'weight',
  ],
  tablets: [
    'product_name', 'price', 'display_size', 'resolution', 'display_format',
    'highrefreshrate', 'procesor', 'familie', 'numarnuclee', 'capacitateram',
    'capacity', 'sistemdeoperare', 'wireless', 'bluetooth',
    'camerafotoprincipala', 'dimensions', 'weight', 'color',
  ],
};

const FIELD_LABELS = {
  product_name: 'Product name',       price: 'Price (RON)',
  category: 'Category',               display_size: 'Screen size (inch)',
  display_format: 'Display format',   ratarefresh: 'Refresh rate (Hz)',
  brightness: 'Brightness (cd/m²)',   tehnologieecran: 'Screen technology',
  producator: 'CPU manufacturer',     model: 'CPU model',
  familie: 'CPU family',              numarnuclee: 'Cores',
  numarthreaduri: 'Threads',          frecventaturbomax: 'Turbo frequency (GHz)',
  tipmemorie: 'RAM type',             capacity: 'RAM capacity (GB)',
  frequency: 'RAM frequency (MHz)',   capacitatessd: 'SSD (GB)',
  tipssd: 'SSD type',                 placavideo: 'GPU',
  memoriededicata: 'VRAM (GB)',        wireless: 'Wireless',
  bluetooth: 'Bluetooth',             sistemdeoperare: 'OS',
  dimensions: 'Dimensions',           weight: 'Weight (g)',
  color: 'Color',                     marimedisplay: 'Screen size (inch)',
  ecran: 'Screen type',               highrefreshrate: 'Refresh rate (Hz)',
  cores: 'CPU cores',                 gpu: 'GPU',
  ram: 'RAM (GB)',                    memorieinternaflash: 'Internal storage (GB)',
  camerafotoprincipala: 'Main camera',camerafotosecundara: 'Selfie camera',
  capacitateacumulator: 'Battery (mAh)', sistemoperare: 'OS',
  versiune: 'OS version',             wlan: 'Wi-Fi',
  '5g': '5G',                         '4g': '4G',
  usbtipc: 'USB-C',                   tippanel: 'Panel type',
  timpderaspuns: 'Response time (ms)',refreshrate: 'Refresh rate (Hz)',
  contrast: 'Contrast',               freesync: 'FreeSync',
  hdmi_ports: 'HDMI ports',           displayport: 'DisplayPort',
  tipdisplay: 'Display type',         diagonalainch: 'Diagonal (inch)',
  imaginehd: 'Image resolution',      smarttv: 'Smart TV',
  iesiresunetrms: 'Sound output (W)', sound_system: 'Sound system',
  usb20: 'USB 2.0',                   dimensiunefarasuport: 'Dimensions (no stand)',
  greutatefarasuport: 'Weight (no stand)',
  headphone_type: 'Headphone type',   technology: 'Connection technology',
  noise_canceling: 'Noise canceling', microphone: 'Microphone',
  impedanta: 'Impedance (Ω)',         low_frequency: 'Low frequency (Hz)',
  high_frequency: 'High frequency (kHz)', sensibilitate: 'Sensitivity (dB)',
  battery_life_music: 'Music battery life (h)',
  bluetooth_connection: 'Bluetooth version',
  cable_length: 'Cable length (m)',   driver_diameter: 'Driver diameter (mm)',
  wireless_connection: 'Wireless connection', pc: 'PC compatible',
  playstation5: 'PS5 compatible',     xboxseriesxxboxseriess: 'Xbox Series compatible',
  procesor: 'Processor',              capacitateram: 'RAM (GB)',
  resolution: 'Resolution',           dualsim: 'Dual SIM',
};

const INVALID_VALUES = new Set([null, undefined, -1, '-1', 'N/A', 'n/a', '', 'None', 'none']);

const KNOWN_BRANDS = [
  'Apple', 'Samsung', 'Lenovo', 'Dell', 'HP', 'Asus', 'Acer', 'MSI',
  'LG', 'Sony', 'Xiaomi', 'OnePlus', 'Motorola', 'Huawei', 'Nokia',
  'Logitech', 'SteelSeries', 'HyperX', 'Razer', 'JBL', 'Bose',
  'Phillips', 'Philips', 'Hisense', 'TCL', 'Metz', 'Gigabyte', 'AOC',
  'BenQ', 'ViewSonic', 'Alienware', 'Microsoft',
];

const SCREENS = { SEARCH: 'SEARCH', DETAIL: 'DETAIL', COMPARE: 'COMPARE' };

const EXCLUDED_KEYS = new Set(['url', 'producer_code']);

// Helpers 
const isValid = (val) => !INVALID_VALUES.has(val) && val !== null && val !== undefined;

function formatValue(val) {
  if (!isValid(val)) return '—';
  if (typeof val === 'number') return val % 1 === 0 ? String(val) : val.toFixed(2);
  return String(val);
}

function formatPrice(price) {
  return `${typeof price === 'number' ? price.toFixed(2) : price} RON`;
}

function getBrandFromName(name) {
  if (!name) return '';
  const match = KNOWN_BRANDS.find((b) => name.toLowerCase().includes(b.toLowerCase()));
  return match || name.split(' ')[0] || '';
}

function getSpecsForProduct(product, tableKey) {
  const priority = SPEC_PRIORITY[tableKey] || [];
  const result   = [];
  const seen     = new Set();

  for (const field of priority) {
    if (product[field] !== undefined && isValid(product[field]) && !seen.has(field)) {
      seen.add(field);
      result.push({ key: field, label: FIELD_LABELS[field] || field, value: formatValue(product[field]) });
    }
  }
  for (const [key, val] of Object.entries(product)) {
    if (!seen.has(key) && isValid(val) && !EXCLUDED_KEYS.has(key)) {
      seen.add(key);
      result.push({ key, label: FIELD_LABELS[key] || key, value: formatValue(val) });
    }
  }
  return result;
}

function buildCompareRows(p1, p2) {
  const allKeys = new Set([
    ...(SPEC_PRIORITY[p1.tableKey] || []),
    ...(SPEC_PRIORITY[p2.tableKey] || []),
    ...Object.keys(p1),
    ...Object.keys(p2),
  ]);

  const rows = [];
  for (const key of allKeys) {
    if (EXCLUDED_KEYS.has(key)) continue;
    const v1 = p1[key], v2 = p2[key];
    if (!isValid(v1) && !isValid(v2)) continue;
    rows.push({
      key,
      label:  FIELD_LABELS[key] || key,
      v1:     formatValue(v1),
      v2:     formatValue(v2),
      isDiff: String(v1) !== String(v2),
    });
  }
  return rows;
}

// Database helpers 
async function ensureDbFile() {
  const dirInfo = await FileSystem.getInfoAsync(DB_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(DB_DIR, { intermediates: true });
  }

  const fileInfo = await FileSystem.getInfoAsync(DB_PATH);
  const needsCopy = !fileInfo.exists || !fileInfo.size || fileInfo.size < DB_MIN_VALID_SIZE;

  if (needsCopy) {
    if (fileInfo.exists) await FileSystem.deleteAsync(DB_PATH, { idempotent: true });

    const asset = Asset.fromModule(require('../../assets/Clean.db'));
    await asset.downloadAsync();
    await FileSystem.copyAsync({ from: asset.localUri, to: DB_PATH });

    const verify = await FileSystem.getInfoAsync(DB_PATH);
    if (!verify.size || verify.size < DB_MIN_VALID_SIZE) {
      throw new Error('DB copy failed — file is still empty');
    }
  }
}

// Custom hooks 
function useDatabase() {
  const dbRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        await ensureDbFile();
        dbRef.current = await SQLite.openDatabaseAsync('Clean.db');
        setIsReady(true);
      } catch (err) {
        console.error('[DB] Init error:', err);
        setDbError(String(err));
      }
    };
    init();
  }, []);

  const searchProducts = useCallback(async (query, limit = 8) => {
    if (!dbRef.current || !query || query.trim().length < 2) return [];
    const pattern = `%${query.trim()}%`;
    const results = [];

    for (const table of ALL_TABLES) {
      try {
        const rows = await dbRef.current.getAllAsync(
          `SELECT url, product_name, price FROM "${table.key}" WHERE product_name LIKE ? LIMIT ?`,
          [pattern, limit]
        );
        rows.forEach((row) => results.push({ ...row, tableKey: table.key, tableLabel: table.label }));
      } catch {
        // Table may not exist in the current DB version — skip silently
      }
    }

    const lq = query.toLowerCase();
    results.sort((a, b) => {
      const aStarts = a.product_name?.toLowerCase().startsWith(lq) ? 0 : 1;
      const bStarts = b.product_name?.toLowerCase().startsWith(lq) ? 0 : 1;
      return aStarts - bStarts;
    });

    return results.slice(0, 10);
  }, []);

  const getProductByUrl = useCallback(async (url, tableKey) => {
    if (!dbRef.current) return null;
    try {
      return await dbRef.current.getFirstAsync(
        `SELECT * FROM "${tableKey}" WHERE url = ?`, [url]
      );
    } catch (err) {
      console.error('getProductByUrl error:', err);
      return null;
    }
  }, []);

  return { isReady, dbError, searchProducts, getProductByUrl };
}

function useMenuAnimation() {
  const rotateAnim  = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.timing(rotateAnim, { toValue, duration: 300, useNativeDriver: true }).start();
    setIsOpen((prev) => !prev);
  };

  const rotation = rotateAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['90deg', '0deg'],
  });

  return { isOpen, toggle, rotation };
}

// Shared components
function NavigationMenu({ headerHeight, onClose, router }) {
  return (
    <View style={[styles.menuOverlay, { top: headerHeight }]}>
      {NAV_ITEMS.map(({ label, icon, route }) => (
        <TouchableOpacity
          key={label}
          style={styles.menuItem}
          onPress={() => { onClose(); if (route) router.push(route); }}
        >
          <Image source={icon} style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function SpecRow({ label, value, highlight }) {
  return (
    <View style={[styles.specRow, highlight && styles.specRowHighlight]}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

function ProductCard({ product }) {
  const brand = getBrandFromName(product.product_name);
  return (
    <View style={styles.productCard}>
      <View style={styles.brandBanner}>
        <Text style={styles.brandBannerText}>{brand.toUpperCase()}</Text>
      </View>
      <View style={styles.productCardBody}>
        <Text style={styles.productTitle}>{product.product_name}</Text>
        {isValid(product.price) && (
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
        )}
      </View>
    </View>
  );
}

function DbStatusIndicator({ isReady, dbError }) {
  if (isReady) return null;

  if (dbError) {
    return (
      <View style={[styles.loadingDb, { backgroundColor: styles.colors.dangerLight, borderRadius: 8, padding: 12 }]}>
        <Text style={[styles.loadingDbText, { color: styles.colors.danger }]}>
          DB Error: {dbError}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.loadingDb}>
      <ActivityIndicator size="small" color={styles.colors.accent} />
      <Text style={styles.loadingDbText}>Initializing database...</Text>
    </View>
  );
}

// Search Screen 
function SearchScreen({ onProductsSelected }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 78; // top padding (15) + icon (48) + bottom padding (15)

  const { isReady, dbError, searchProducts, getProductByUrl } = useDatabase();
  const { isOpen: menuOpen, toggle: toggleMenu, rotation: menuRotation } = useMenuAnimation();

  const [query, setQuery]               = useState('');
  const [suggestions, setSuggestions]   = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSearching, setIsSearching]   = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const searchTimeout = useRef(null);
  const fadeAnim      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (query.trim().length < 2) { setSuggestions([]); return; }

    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      const results = await searchProducts(query);
      setSuggestions(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [query, searchProducts]);

  const handleSelectSuggestion = useCallback((item) => {
    if (selectedItems.some((s) => s.url === item.url)) return;
    setSelectedItems((prev) => [...prev, item]);
    setQuery('');
    setSuggestions([]);
    Keyboard.dismiss();
  }, [selectedItems]);

  const handleRemoveSelected = useCallback((url) => {
    setSelectedItems((prev) => prev.filter((s) => s.url !== url));
  }, []);

  const fetchSelectedProducts = useCallback(async () => {
    const products = await Promise.all(
      selectedItems.map((item) => getProductByUrl(item.url, item.tableKey))
    );
    return products
      .map((p, i) => p ? { ...p, tableKey: selectedItems[i].tableKey } : null)
      .filter(Boolean);
  }, [selectedItems, getProductByUrl]);

  const handleCompare = useCallback(async () => {
    if (selectedItems.length < 2) return;
    onProductsSelected(await fetchSelectedProducts());
  }, [selectedItems.length, fetchSelectedProducts, onProductsSelected]);

  const handleViewSingle = useCallback(async () => {
    if (selectedItems.length !== 1) return;
    onProductsSelected(await fetchSelectedProducts());
  }, [selectedItems.length, fetchSelectedProducts, onProductsSelected]);

  const showSuggestions = inputFocused && suggestions.length > 0;
  const canCompare      = selectedItems.length >= 2;
  const canViewSingle   = selectedItems.length === 1;

  return (
    <View style={{ flex: 1, backgroundColor: styles.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.colors.background} />

      <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
        <TouchableOpacity onPress={() => router.push('/main_menu')} activeOpacity={0.8}>
          <Image source={require('../../assets/logo2.png')} style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMenu} activeOpacity={0.8}>
          <Animated.Image
            source={require('../../assets/Meniu.png')}
            style={[styles.headerIcon, { transform: [{ rotate: menuRotation }] }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {menuOpen && (
        <NavigationMenu headerHeight={headerHeight} onClose={toggleMenu} router={router} />
      )}

      <Animated.View style={[{ flex: 1, paddingHorizontal: 16 }, { opacity: fadeAnim }]}>
        <Text style={styles.headline}>What would you{'\n'}like to compare?</Text>

        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search: Apple, Lenovo, Samsung..."
            placeholderTextColor={styles.colors.textMuted}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 150)}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {isSearching && (
            <ActivityIndicator size="small" color={styles.colors.accent} style={styles.searchSpinner} />
          )}
        </View>

        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.url}
              keyboardShouldPersistTaps="always"
              style={styles.suggestionsList}
              renderItem={({ item }) => {
                const alreadyAdded = selectedItems.some((s) => s.url === item.url);
                return (
                  <TouchableOpacity
                    style={[styles.suggestionItem, alreadyAdded && styles.suggestionItemDisabled]}
                    onPress={() => !alreadyAdded && handleSelectSuggestion(item)}
                    activeOpacity={alreadyAdded ? 1 : 0.7}
                  >
                    <View style={styles.suggestionContent}>
                      <Text style={styles.suggestionName} numberOfLines={2}>
                        {item.product_name}
                      </Text>
                      <View style={styles.suggestionMeta}>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryBadgeText}>{item.tableLabel}</Text>
                        </View>
                        {isValid(item.price) && (
                          <Text style={styles.suggestionPrice}>{formatPrice(item.price)}</Text>
                        )}
                      </View>
                    </View>
                    {alreadyAdded && <Text style={styles.alreadyAddedTag}>Added</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        {selectedItems.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={styles.selectedLabel}>Selected products:</Text>
            {selectedItems.map((item) => (
              <View key={item.url} style={styles.selectedChip}>
                <View style={styles.selectedDot} />
                <Text style={styles.selectedChipText} numberOfLines={1}>{item.product_name}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveSelected(item.url)}
                  style={styles.removeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.removeBtnText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.actionRow}>
              {canViewSingle && (
                <TouchableOpacity style={styles.btnPrimary} onPress={handleViewSingle}>
                  <Text style={styles.btnPrimaryText}>View specifications</Text>
                </TouchableOpacity>
              )}
              {canCompare && (
                <TouchableOpacity style={styles.btnPrimary} onPress={handleCompare}>
                  <Text style={styles.btnPrimaryText}>Compare ({selectedItems.length})</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <DbStatusIndicator isReady={isReady} dbError={dbError} />
      </Animated.View>
    </View>
  );
}

// Detail Screen 
function DetailScreen({ product, onBack, onAddForComparison }) {
  const specs      = getSpecsForProduct(product, product.tableKey);
  const tableLabel = ALL_TABLES.find((t) => t.key === product.tableKey)?.label || '';

  return (
    <View style={{ flex: 1, backgroundColor: styles.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.colors.background} />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{tableLabel}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <ProductCard product={product} />

          <View style={styles.specsCard}>
            {specs
              .filter((spec) => spec.key !== 'product_name' && spec.key !== 'price')
              .map((spec, idx) => (
                <SpecRow key={spec.key} label={spec.label} value={spec.value} highlight={idx % 2 === 0} />
              ))}
          </View>

          <TouchableOpacity style={styles.compareAddBtn} onPress={onAddForComparison}>
            <Text style={styles.compareAddBtnText}>+ Add for comparison</Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </View>
  );
}

// Compare Screen 
function CompareScreen({ products, onBack }) {
  const [p1, p2] = products;
  const brand1   = getBrandFromName(p1.product_name);
  const brand2   = getBrandFromName(p2.product_name);
  const rows     = buildCompareRows(p1, p2);

  return (
    <View style={{ flex: 1, backgroundColor: styles.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.colors.background} />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.compareTitle}>Comparison</Text>
        </View>

        <View style={styles.compareHeader}>
          {[{ product: p1, brand: brand1, margin: { marginRight: 4 } },
            { product: p2, brand: brand2, margin: { marginLeft:  4 } }].map(({ product, brand, margin }) => (
            <View key={product.url} style={[styles.compareProductHeader, margin]}>
              <View style={styles.brandBannerSmall}>
                <Text style={styles.brandBannerSmallText}>{brand.toUpperCase()}</Text>
              </View>
              <Text style={styles.compareProductName} numberOfLines={3}>{product.product_name}</Text>
              {isValid(product.price) && (
                <Text style={styles.compareProductPrice}>{formatPrice(product.price)}</Text>
              )}
            </View>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {rows.map((row, idx) => (
            <View
              key={row.key}
              style={[
                styles.compareRow,
                idx % 2 === 0 && styles.compareRowAlt,
                row.isDiff && styles.compareRowDiff,
              ]}
            >
              <Text style={styles.compareRowLabel}>{row.label}</Text>
              <View style={styles.compareRowValues}>
                <Text style={[styles.compareRowValue, row.isDiff && styles.compareRowValueDiff]} numberOfLines={2}>
                  {row.v1}
                </Text>
                <Text style={styles.compareRowDivider}>|</Text>
                <Text style={[styles.compareRowValue, row.isDiff && styles.compareRowValueDiff]} numberOfLines={2}>
                  {row.v2}
                </Text>
              </View>
            </View>
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </View>
  );
}

// Root Navigator 
export default function ComparisonEngine() {
  const [screen, setScreen]                 = useState(SCREENS.SEARCH);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleProductsSelected = useCallback((products) => {
    setSelectedProducts(products);
    setScreen(products.length === 1 ? SCREENS.DETAIL : SCREENS.COMPARE);
  }, []);

  const handleBack = useCallback(() => {
    setScreen(SCREENS.SEARCH);
    setSelectedProducts([]);
  }, []);

  if (screen === SCREENS.DETAIL && selectedProducts.length === 1) {
    return (
      <DetailScreen
        product={selectedProducts[0]}
        onBack={handleBack}
        onAddForComparison={handleBack}
      />
    );
  }

  if (screen === SCREENS.COMPARE && selectedProducts.length >= 2) {
    return <CompareScreen products={selectedProducts} onBack={handleBack} />;
  }

  return <SearchScreen onProductsSelected={handleProductsSelected} />;
}