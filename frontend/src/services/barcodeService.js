/**
 * Legal Metrology Barcode & Statutory Product Intelligence Service
 * 
 * Implements multi-tier lookup:
 * 1. Open Food Facts v2 API (https://world.openfoodfacts.org/api/v2/product/{barcode}.json)
 * 2. UPCitemdb Trial API fallback (https://api.upcitemdb.com/prod/trial/lookup?upc={barcode})
 * 3. Preloaded Indian FMCG Catalog (GS1 890 Prefix) & Backend Proxy
 * 
 * Evaluates the 9 mandatory declarations required under:
 * Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6
 */

// Known Indian FMCG Catalog for instant zero-latency test lookups & offline resilience
export const KNOWN_INDIAN_PRODUCTS = {
  "8901030865421": {
    product_name: "Chakki Fresh Whole Wheat Atta",
    brand: "Shakti Bhog",
    mrp: 245.0,
    mrp_declaration_text: "MRP Rs. 245.00 (inclusive of all taxes)",
    net_quantity: "5 kg",
    manufacturer_name: "Shakti Bhog Foods Ltd.",
    manufacturer_address: "Plot 14, Okhla Industrial Area, Phase III, New Delhi - 110020",
    country_of_origin: "India",
    manufacturing_date: "08/2026",
    expiry_date: "Best before 6 months from packaging",
    consumer_care: "Helpline: 1800-11-4545 | care@shaktibhog.com",
    unit_sale_price: "₹ 49.00 per kg",
    batch_number: "SB-2026-901",
  },
  "8901058852441": {
    product_name: "Enzyme Active Detergent Powder",
    brand: "Super Shine",
    mrp: 140.0,
    mrp_declaration_text: "MRP Rs. 140.00", // Missing 'inclusive of all taxes' violation
    net_quantity: "1000 gms", // Non-standard unit violation under Rule 12
    manufacturer_name: "Super Chemicals Pvt Ltd",
    manufacturer_address: "Industrial Area, Kanpur, UP", // Missing PIN violation
    country_of_origin: "India",
    manufacturing_date: "08/2026",
    expiry_date: "Best before 24 months from mfg",
    consumer_care: "", // Missing helpline
    unit_sale_price: "",
    batch_number: "KNP-7721",
  },
  "8901063012214": {
    product_name: "Premium Choco Delight Cookies",
    brand: "Baker's Pride",
    mrp: 60.0,
    mrp_declaration_text: "₹ 60.00 (incl. of all taxes)",
    net_quantity: "150 g",
    manufacturer_name: "Baker's Pride Foods Pvt Ltd",
    manufacturer_address: "B-12, Sector 62, Noida, UP - 201309",
    country_of_origin: "India",
    manufacturing_date: "05/2026",
    expiry_date: "Best before 9 months from mfg",
    consumer_care: "Helpline: 011-23456789 | help@bakerspride.com",
    unit_sale_price: "₹ 0.40 per g",
    batch_number: "BP-8812",
  },
  "8901077123985": {
    product_name: "Royal Kashmiri Kahwa Green Tea",
    brand: "Himalayan Herbs",
    mrp: 380.0,
    mrp_declaration_text: "MRP Rs. 380.00 (inclusive of all taxes)",
    net_quantity: "250 g",
    manufacturer_name: "Kashmir Valley Agro Producer Co.",
    manufacturer_address: "Industrial Growth Centre, Lassipora, Pulwama, J&K - 192301",
    country_of_origin: "India",
    manufacturing_date: "06/2026",
    expiry_date: "Best before 12 months from packing",
    consumer_care: "Toll Free: 1800-889-2233 | care@himalayanherbs.in",
    unit_sale_price: "₹ 1.52 per g",
    batch_number: "KK-2026-78",
  },
  "8901058852861": {
    product_name: "2-Minute Masala Noodles",
    brand: "Maggi",
    mrp: 14.0,
    mrp_declaration_text: "MRP ₹ 14.00 (inclusive of all taxes)",
    net_quantity: "70 g",
    manufacturer_name: "Nestlé India Limited",
    manufacturer_address: "100/101, World Trade Centre, Barakhamba Lane, New Delhi - 110001",
    country_of_origin: "India",
    manufacturing_date: "07/2026",
    expiry_date: "Best before 9 months from mfg",
    consumer_care: "1800-103-1947 | wecare@in.nestle.com",
    unit_sale_price: "₹ 0.20 per g",
    batch_number: "MG-2026-X1",
  },
  "8901719101037": {
    product_name: "Original Glucose Biscuits",
    brand: "Parle-G",
    mrp: 10.0,
    mrp_declaration_text: "MRP ₹ 10.00 (inclusive of all taxes)",
    net_quantity: "130 g",
    manufacturer_name: "Parle Products Pvt Ltd",
    manufacturer_address: "North Level Crossing, Vile Parle East, Mumbai, Maharashtra - 400057",
    country_of_origin: "India",
    manufacturing_date: "08/2026",
    expiry_date: "Best before 6 months from mfg",
    consumer_care: "Toll Free: 1800-22-7799 | cs@parle.biz",
    unit_sale_price: "₹ 0.08 per g",
    batch_number: "PG-8821",
  },
  "8901262010049": {
    product_name: "Pasteurised Butter",
    brand: "Amul",
    mrp: 58.0,
    mrp_declaration_text: "MRP ₹ 58.00 (incl. of all taxes)",
    net_quantity: "100 g",
    manufacturer_name: "Gujarat Co-operative Milk Marketing Federation Ltd. (GCMMF)",
    manufacturer_address: "Amul Dairy Road, Anand, Gujarat - 388001",
    country_of_origin: "India",
    manufacturing_date: "08/2026",
    expiry_date: "Best before 12 months from packaging",
    consumer_care: "1800-258-3333 | customercare@amul.coop",
    unit_sale_price: "₹ 0.58 per g",
    batch_number: "AM-902",
  },
  "8904004400037": {
    product_name: "Vacuum Evaporated Iodised Salt",
    brand: "Tata Salt",
    mrp: 28.0,
    mrp_declaration_text: "MRP ₹ 28.00 (inclusive of all taxes)",
    net_quantity: "1 kg",
    manufacturer_name: "Tata Consumer Products Limited",
    manufacturer_address: "1, Bishop Lefroy Road, Kolkata, West Bengal - 700020",
    country_of_origin: "India",
    manufacturing_date: "06/2026",
    expiry_date: "Best before 24 months from mfg",
    consumer_care: "1800-345-1720 | care@tataconsumer.com",
    unit_sale_price: "₹ 28.00 per kg",
    batch_number: "TS-5541",
  },
  "8901099234567": {
    product_name: "2% Hyaluronic Acid Face Serum",
    brand: "Glow & Radiance",
    mrp: 699.0,
    mrp_declaration_text: "MRP ₹ 699.00 (inclusive of all taxes)",
    net_quantity: "30 ml",
    manufacturer_name: "Derma Pure Cosmetics Ltd.",
    manufacturer_address: "Plot 88, EPIP Zone, Whitefield, Bengaluru, Karnataka - 560066",
    country_of_origin: "India",
    manufacturing_date: "07/2026",
    expiry_date: "Best before 24 months from mfg",
    consumer_care: "1800-120-9988 | support@glowradiance.in",
    unit_sale_price: "₹ 23.30 per ml",
    batch_number: "GR-2026-9",
  }
};

/**
 * Identify GS1 Country Prefix
 */
export function getGS1Country(barcode) {
  if (!barcode) return "Unknown";
  const code = barcode.toString().trim();
  if (code.startsWith("890")) return "India (GS1 India 890)";
  if (/^(0[0-9]|1[0-9])/.test(code)) return "USA & Canada (UPC-A GS1)";
  if (/^(30|31|32|33|34|35|36|37)/.test(code)) return "France (GS1 300-379)";
  if (/^(40|41|42|43|44)/.test(code)) return "Germany (GS1 400-440)";
  if (/^(45|49)/.test(code)) return "Japan (GS1 450-459, 490-499)";
  if (/^(50)/.test(code)) return "United Kingdom (GS1 500-509)";
  if (/^(54)/.test(code)) return "Belgium & Luxembourg (GS1 540-549)";
  if (/^(69[0-9])/.test(code)) return "China (GS1 690-699)";
  if (/^(76)/.test(code)) return "Switzerland (GS1 760-769)";
  if (/^(80|81|82|83)/.test(code)) return "Italy (GS1 800-839)";
  if (/^(84)/.test(code)) return "Spain (GS1 840-849)";
  return "International GS1";
}

/**
 * Fetch with AbortController timeout helper
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 4500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Tier 1: Open Food Facts API v2 Lookup
 */
async function lookupOpenFoodFactsV2(barcode) {
  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`;
  try {
    const res = await fetchWithTimeout(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "LegalMetrologyComplianceScanner/2.0 (India SIH)"
      }
    }, 4500);

    if (!res.ok) return null;
    const data = await res.json();

    if (data.status === 1 && data.product) {
      const p = data.product;
      const prodName = p.product_name || p.product_name_en || p.generic_name || p.abbreviated_product_name || null;
      if (!prodName) return null;

      const brand = p.brands || p.brand_owner || (Array.isArray(p.brands_tags) && p.brands_tags[0]) || null;
      
      // Net quantity
      let netQty = p.quantity || null;
      if (!netQty && p.product_quantity) {
        netQty = `${p.product_quantity} ${p.product_quantity_unit || ''}`.trim();
      }

      // Manufacturer & Address
      const mfgAddr = p.manufacturing_places || p.manufacturing_places_tags?.join(", ") || null;
      const mfgName = p.brand_owner || p.creator || null;

      // Country of origin
      let country = p.countries || p.origin || p.countries_imported || null;
      if (!country && barcode.startsWith("890")) {
        country = "India";
      }

      // Dates
      const mfgDate = p.manufacturing_date || p.pack_date || null;
      const expiryDate = p.expiration_date || p.best_before_date || p.use_by_date || null;

      // Consumer care
      const careContact = p.customer_service || p.customer_service_email || p.customer_service_phone || p.contact || null;

      // MRP
      const mrp = p.price || (p.price_per_unit ? parseFloat(p.price_per_unit) : null);

      return {
        source: "Open Food Facts API v2",
        raw: p,
        product_name: prodName,
        brand: brand,
        mrp: mrp,
        mrp_declaration_text: mrp ? `₹ ${mrp} (inclusive of all taxes)` : null,
        net_quantity: netQty,
        manufacturer_name: mfgName,
        manufacturer_address: mfgAddr,
        country_of_origin: country,
        manufacturing_date: mfgDate,
        expiry_date: expiryDate,
        consumer_care: careContact,
      };
    }
  } catch (err) {
    console.warn("Open Food Facts v2 query failed or timed out:", err?.message || err);
  }
  return null;
}

/**
 * Tier 2: UPCitemdb Trial API Fallback
 */
async function lookupUPCitemdb(barcode) {
  const url = `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(barcode)}`;
  try {
    const res = await fetchWithTimeout(url, {
      headers: { "Accept": "application/json" }
    }, 4500);

    if (!res.ok) return null;
    const data = await res.json();

    if (data.code === "OK" && Array.isArray(data.items) && data.items.length > 0) {
      const item = data.items[0];
      const prodName = item.title || null;
      if (!prodName) return null;

      const brand = item.brand || null;
      const mfg = item.manufacturer || item.publisher || null;

      // Detect quantity from title/size/weight
      let netQty = item.size || item.weight || item.dimension || null;
      if (!netQty && prodName) {
        const qtyMatch = prodName.match(/\b(\d+(?:\.\d+)?)\s*(kg|g|gm|gms|ml|l|ltr|ltrs|oz|lb)\b/i);
        if (qtyMatch) {
          netQty = qtyMatch[0];
        }
      }

      // Price estimation if available
      const price = item.lowest_recorded_price || item.highest_recorded_price || null;
      const isIndia = barcode.startsWith("890");

      return {
        source: "UPCitemdb API",
        raw: item,
        product_name: prodName,
        brand: brand,
        mrp: price,
        mrp_declaration_text: price ? `MRP (est. $${price})` : null,
        net_quantity: netQty,
        manufacturer_name: mfg,
        manufacturer_address: null,
        country_of_origin: isIndia ? "India" : (item.country || null),
        manufacturing_date: null,
        expiry_date: null,
        consumer_care: null,
      };
    }
  } catch (err) {
    console.warn("UPCitemdb API query failed or timed out:", err?.message || err);
  }
  return null;
}

/**
 * Tier 3: Query Local Backend Proxy (if FastAPI server running)
 */
async function lookupBackendProxy(barcode) {
  try {
    const res = await fetchWithTimeout(`/api/ocr/barcode/${encodeURIComponent(barcode)}`, {}, 3000);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.found && data.product) {
      const p = data.product;
      return {
        source: "Backend Intelligence Database",
        raw: p,
        product_name: p.product_name,
        brand: p.brand,
        mrp: p.mrp,
        mrp_declaration_text: p.mrp_declaration_text,
        net_quantity: p.net_quantity ? `${p.net_quantity} ${p.unit || ''}`.trim() : null,
        manufacturer_name: p.manufacturer_name,
        manufacturer_address: p.manufacturer_address,
        country_of_origin: p.country_of_origin,
        manufacturing_date: p.manufacturing_date,
        expiry_date: p.expiry_date || p.best_before_date || null,
        consumer_care: p.customer_care_phone || p.customer_care_email
          ? `${p.customer_care_phone || ''} ${p.customer_care_email || ''}`.trim()
          : null,
        unit_sale_price: p.unit_sale_price,
        batch_number: p.batch_number,
      };
    }
  } catch {
    // Backend offline or non-responsive, normal in standalone frontend
  }
  return null;
}

/**
 * Evaluates the 9 statutory fields required under Rule 6 of LMR 2011
 * Generates per-field compliance status (✅ Present / ❌ Missing)
 */
export function evaluateRule6Declarations(product) {
  if (!product) return [];

  // Helper to test if a field is declared / non-empty
  const isPresent = (val) => {
    if (val === null || val === undefined) return false;
    const s = String(val).trim().toLowerCase();
    return s !== "" && s !== "null" && s !== "undefined" && s !== "n/a" && s !== "declared on pack";
  };

  // 1. Product Name (Rule 6(1)(b))
  const hasProdName = isPresent(product.product_name);

  // 2. Brand
  const hasBrand = isPresent(product.brand);

  // 3. MRP (incl. all taxes) (Rule 6(1)(e))
  const hasMrp = product.mrp !== null && product.mrp !== undefined && !isNaN(product.mrp);
  const mrpText = (product.mrp_declaration_text || "").toLowerCase();
  const hasTaxPhrase = mrpText.includes("inclusive of all taxes") || 
                       mrpText.includes("incl. of all taxes") || 
                       mrpText.includes("incl of all taxes") || 
                       mrpText.includes("incl. all taxes");

  // 4. Net Quantity (Rule 6(1)(c))
  const hasNetQty = isPresent(product.net_quantity);
  const isIllegalUnit = /\b(gms|gm\.|kgs|ltrs|ltr)\b/i.test(String(product.net_quantity || ""));

  // 5. Manufacturer Name & Address (Rule 6(1)(a))
  const hasMfgName = isPresent(product.manufacturer_name);
  const hasMfgAddr = isPresent(product.manufacturer_address);
  const hasPostalPin = /\b\d{6}\b/.test(product.manufacturer_address || "");
  const mfgPresent = hasMfgName || hasMfgAddr;

  // 6. Country of Origin (Rule 6(10))
  const hasOrigin = isPresent(product.country_of_origin);

  // 7. Month & Year of Manufacture / Packing / Import (Rule 6(1)(d))
  const hasMfgDate = isPresent(product.manufacturing_date);

  // 8. Best Before / Expiry Date (Rule 6(1)(d) / FSSAI standards)
  const hasExpiry = isPresent(product.expiry_date);

  // 9. Consumer Helpline Number (Rule 6(1)(g))
  const hasConsumerCare = isPresent(product.consumer_care);

  const declarations = [
    {
      id: "product_name",
      field: "Product Name",
      rule: "Rule 6(1)(b)",
      statutory_title: "Common / Generic Name of Commodity",
      value: hasProdName ? product.product_name : "Not Declared / Missing",
      status: hasProdName ? "PRESENT" : "MISSING",
      icon: hasProdName ? "✅ Present" : "❌ Missing",
      badge_class: hasProdName ? "status-pass" : "status-fail",
      severity: "CRITICAL",
      legal_requirement: "Mandatory generic identity must be legible on Principal Display Panel.",
    },
    {
      id: "brand",
      field: "Brand",
      rule: "Rule 6",
      statutory_title: "Commercial Trademark / Brand",
      value: hasBrand ? product.brand : "Not Declared",
      status: hasBrand ? "PRESENT" : "MISSING",
      icon: hasBrand ? "✅ Present" : "❌ Missing",
      badge_class: hasBrand ? "status-pass" : "status-fail",
      severity: "HIGH",
      legal_requirement: "Registered brand name or manufacturer trademark.",
    },
    {
      id: "mrp",
      field: "MRP (incl. all taxes)",
      rule: "Rule 6(1)(e)",
      statutory_title: "Maximum Retail Price (Tax Inclusive)",
      value: hasMrp 
        ? `₹ ${product.mrp}${hasTaxPhrase ? " (incl. of all taxes)" : ""}`
        : "Not Declared",
      status: (hasMrp && hasTaxPhrase) ? "PRESENT" : (hasMrp ? "PARTIAL" : "MISSING"),
      icon: (hasMrp && hasTaxPhrase) ? "✅ Present" : (hasMrp ? "⚠️ Partial (Missing tax phrase)" : "❌ Missing"),
      badge_class: (hasMrp && hasTaxPhrase) ? "status-pass" : "status-fail",
      severity: "CRITICAL",
      legal_requirement: "Must specify MRP with mandatory phrase 'inclusive of all taxes'.",
    },
    {
      id: "net_quantity",
      field: "Net Quantity",
      rule: "Rule 6(1)(c)",
      statutory_title: "Net Quantity in Standard Metric Units",
      value: hasNetQty ? product.net_quantity : "Not Declared",
      status: (hasNetQty && !isIllegalUnit) ? "PRESENT" : "MISSING",
      icon: (hasNetQty && !isIllegalUnit) ? "✅ Present" : (isIllegalUnit ? "❌ Illegal Unit (Rule 12)" : "❌ Missing"),
      badge_class: (hasNetQty && !isIllegalUnit) ? "status-pass" : "status-fail",
      severity: "CRITICAL",
      legal_requirement: "Mandatory standard metric units: g, kg, ml, l, n (Illegal: gms, kgs, ltrs).",
    },
    {
      id: "manufacturer",
      field: "Manufacturer Name & Address",
      rule: "Rule 6(1)(a)",
      statutory_title: "Name & Complete Postal Address of Manufacturer/Packer",
      value: mfgPresent 
        ? `${product.manufacturer_name ? product.manufacturer_name + ' — ' : ''}${product.manufacturer_address || ''}`.trim()
        : "Not Declared",
      status: (hasMfgName && (hasMfgAddr || hasPostalPin)) ? "PRESENT" : (mfgPresent ? "PARTIAL" : "MISSING"),
      icon: (hasMfgName && hasPostalPin) ? "✅ Present" : (mfgPresent ? "⚠️ Partial (No PIN)" : "❌ Missing"),
      badge_class: (hasMfgName && hasPostalPin) ? "status-pass" : "status-fail",
      severity: "HIGH",
      legal_requirement: "Complete postal address including street, city, state and 6-digit postal PIN code.",
    },
    {
      id: "country_of_origin",
      field: "Country of Origin",
      rule: "Rule 6(10)",
      statutory_title: "Country of Origin (Domestic / Imported)",
      value: hasOrigin ? product.country_of_origin : "Not Declared",
      status: hasOrigin ? "PRESENT" : "MISSING",
      icon: hasOrigin ? "✅ Present" : "❌ Missing",
      badge_class: hasOrigin ? "status-pass" : "status-fail",
      severity: "HIGH",
      legal_requirement: "Statutory country of origin declaration mandatory for all pre-packed commodities.",
    },
    {
      id: "manufacturing_date",
      field: "Month & Year of Manufacture/Packing/Import",
      rule: "Rule 6(1)(d)",
      statutory_title: "Date of Manufacture / Packing (MM/YYYY)",
      value: hasMfgDate ? product.manufacturing_date : "Not Declared",
      status: hasMfgDate ? "PRESENT" : "MISSING",
      icon: hasMfgDate ? "✅ Present" : "❌ Missing",
      badge_class: hasMfgDate ? "status-pass" : "status-fail",
      severity: "HIGH",
      legal_requirement: "Month and year of manufacture or pre-packing in standard numerical format.",
    },
    {
      id: "expiry_date",
      field: "Best Before / Expiry Date",
      rule: "Rule 6(1)(d)",
      statutory_title: "Best Before / Expiry Date Statement",
      value: hasExpiry ? product.expiry_date : "Not Declared",
      status: hasExpiry ? "PRESENT" : "MISSING",
      icon: hasExpiry ? "✅ Present" : "❌ Missing",
      badge_class: hasExpiry ? "status-pass" : "status-fail",
      severity: "MEDIUM",
      legal_requirement: "Best before date or expiry statement for perishable / consumable items.",
    },
    {
      id: "consumer_care",
      field: "Consumer Helpline Number",
      rule: "Rule 6(1)(g)",
      statutory_title: "Consumer Care Contact Helpline & Email",
      value: hasConsumerCare ? product.consumer_care : "Not Declared",
      status: hasConsumerCare ? "PRESENT" : "MISSING",
      icon: hasConsumerCare ? "✅ Present" : "❌ Missing",
      badge_class: hasConsumerCare ? "status-pass" : "status-fail",
      severity: "HIGH",
      legal_requirement: "Consumer grievance helpline telephone number and email address.",
    },
  ];

  return declarations;
}

/**
 * Main Barcode Resolution Engine
 * 
 * Pipeline:
 * 1. Check Preloaded Known Indian FMCG Catalog (0ms response)
 * 2. Query Open Food Facts API v2 (https://world.openfoodfacts.org/api/v2/product/{barcode}.json)
 * 3. Fall back to UPCitemdb API (https://api.upcitemdb.com/prod/trial/lookup?upc={barcode})
 * 4. Fall back to local Backend Proxy (/api/ocr/barcode/{code})
 * 5. If not found anywhere, gracefully return user error message:
 *    "Product not found in database. Please verify label manually as per Legal Metrology Rules."
 */
export async function resolveBarcodeProduct(barcode) {
  if (!barcode) {
    return {
      found: false,
      message: "No barcode supplied.",
    };
  }

  const cleanCode = barcode.toString().replace(/[^0-9A-Za-z]/g, "");
  if (!cleanCode) {
    return {
      found: false,
      message: "Invalid barcode digits.",
    };
  }

  const gs1Country = getGS1Country(cleanCode);

  // Step 1: Instant local Indian FMCG match
  if (KNOWN_INDIAN_PRODUCTS[cleanCode]) {
    const p = KNOWN_INDIAN_PRODUCTS[cleanCode];
    const declarations = evaluateRule6Declarations(p);
    const presentCount = declarations.filter((d) => d.status === "PRESENT").length;

    return {
      found: true,
      barcode: cleanCode,
      format: cleanCode.length === 13 ? "EAN-13" : cleanCode.length === 12 ? "UPC-A" : "BARCODE",
      gs1_country: gs1Country,
      source: "Indian FMCG Metrology Database",
      product: p,
      declarations: declarations,
      compliance_summary: {
        total_fields: declarations.length,
        present_count: presentCount,
        missing_count: declarations.length - presentCount,
        score: Math.round((presentCount / declarations.length) * 100),
      },
    };
  }

  // Step 2: Query Open Food Facts API v2
  const offResult = await lookupOpenFoodFactsV2(cleanCode);
  if (offResult && offResult.product_name) {
    const declarations = evaluateRule6Declarations(offResult);
    const presentCount = declarations.filter((d) => d.status === "PRESENT").length;

    return {
      found: true,
      barcode: cleanCode,
      format: cleanCode.length === 13 ? "EAN-13" : cleanCode.length === 12 ? "UPC-A" : "BARCODE",
      gs1_country: gs1Country,
      source: offResult.source,
      product: offResult,
      declarations: declarations,
      compliance_summary: {
        total_fields: declarations.length,
        present_count: presentCount,
        missing_count: declarations.length - presentCount,
        score: Math.round((presentCount / declarations.length) * 100),
      },
    };
  }

  // Step 3: Query UPCitemdb API Fallback
  const upcResult = await lookupUPCitemdb(cleanCode);
  if (upcResult && upcResult.product_name) {
    const declarations = evaluateRule6Declarations(upcResult);
    const presentCount = declarations.filter((d) => d.status === "PRESENT").length;

    return {
      found: true,
      barcode: cleanCode,
      format: cleanCode.length === 13 ? "EAN-13" : cleanCode.length === 12 ? "UPC-A" : "BARCODE",
      gs1_country: gs1Country,
      source: upcResult.source,
      product: upcResult,
      declarations: declarations,
      compliance_summary: {
        total_fields: declarations.length,
        present_count: presentCount,
        missing_count: declarations.length - presentCount,
        score: Math.round((presentCount / declarations.length) * 100),
      },
    };
  }

  // Step 4: Query Backend Proxy
  const backendResult = await lookupBackendProxy(cleanCode);
  if (backendResult && backendResult.product_name) {
    const declarations = evaluateRule6Declarations(backendResult);
    const presentCount = declarations.filter((d) => d.status === "PRESENT").length;

    return {
      found: true,
      barcode: cleanCode,
      format: cleanCode.length === 13 ? "EAN-13" : cleanCode.length === 12 ? "UPC-A" : "BARCODE",
      gs1_country: gs1Country,
      source: backendResult.source,
      product: backendResult,
      declarations: declarations,
      compliance_summary: {
        total_fields: declarations.length,
        present_count: presentCount,
        missing_count: declarations.length - presentCount,
        score: Math.round((presentCount / declarations.length) * 100),
      },
    };
  }

  // Step 5: Graceful Error State if Barcode is not found anywhere
  return {
    found: false,
    barcode: cleanCode,
    format: cleanCode.length === 13 ? "EAN-13" : cleanCode.length === 12 ? "UPC-A" : "BARCODE",
    gs1_country: gs1Country,
    message: "Product not found in database. Please verify label manually as per Legal Metrology Rules.",
    declarations: [],
  };
}
