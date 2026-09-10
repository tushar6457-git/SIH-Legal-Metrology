// Pre-loaded Real World Packaged Commodity Samples for Legal Metrology Testing

export const SAMPLE_PRODUCTS = [
  {
    id: "sample_01",
    name: "Patanjali Dant Kanti Toothpaste 200g",
    category: "FMCG / Personal Care",
    batchId: "PK-DK-2026-B81",
    description: "Inspected from Supermarket Shelf, Connaught Place, New Delhi",
    mockFileName: "patanjali_dantkanti_200g_back_label.jpg",
    fileSize: "1.4 MB",
    fileType: "image/jpeg",
    mockImage: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="280" height="160" viewBox="0 0 280 160">
      <rect width="100%" height="100%" fill="#FFFBEB" stroke="#D97706" stroke-width="3" rx="6"/>
      <rect x="8" y="8" width="264" height="28" fill="#D97706" rx="3"/>
      <text x="140" y="27" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FFF" text-anchor="middle">PATANJALI DANT KANTI</text>
      <text x="140" y="52" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#92400E" text-anchor="middle">Ayurvedic Dental Paste · 200g</text>
      <line x1="15" y1="62" x2="265" y2="62" stroke="#CBD5E1" stroke-width="1"/>
      <text x="16" y="80" font-family="sans-serif" font-size="9.5" fill="#1F2937">Net Wt.: 200 g</text>
      <text x="16" y="96" font-family="sans-serif" font-size="9.5" fill="#1F2937">MRP: Rs 110.00 (Incl. Taxes)</text>
      <text x="16" y="112" font-family="sans-serif" font-size="9" fill="#DC2626" font-weight="bold">Unit Sale Price: NOT DECLARED</text>
      <text x="16" y="128" font-family="sans-serif" font-size="8.5" fill="#4B5563">Mfg: Industrial Area, Haridwar - 249401</text>
      <text x="16" y="144" font-family="sans-serif" font-size="8" fill="#6B7280">Origin: India · Batch: B81</text>
    </svg>`),
    // Rule evaluation flags
    ruleChecks: {
      rule_6_1_a: {
        status: "pass",
        detectedText: "Patanjali Ayurved Ltd., Industrial Area, Haridwar, Uttarakhand - 249401"
      },
      rule_6_1_b: {
        status: "pass",
        detectedText: "Ayurvedic Dental Paste / Toothpaste"
      },
      rule_6_1_c: {
        status: "pass",
        detectedText: "Net Wt.: 200 g"
      },
      rule_6_1_d: {
        status: "pass",
        detectedText: "Mfg. Date: 02/2026 | Exp. Date: 01/2028"
      },
      rule_6_1_e: {
        // VIOLATION: Missing 2026 Mandatory Unit Sale Price!
        status: "fail",
        detectedText: "MRP ₹110.00 (Incl. of all taxes) [No Unit Sale Price (USP) declared]",
        reason: "Non-compliant under 2026 amendment: Mandatory Unit Sale Price (₹/g) is omitted on package."
      },
      rule_6_1_f: {
        status: "pass",
        detectedText: "Toll Free: 1800-180-4108 | Email: feedback@patanjaliayurved.org"
      },
      rule_6_1_g: {
        status: "pass",
        detectedText: "Country of Origin: India"
      },
      rule_9_font: {
        // VIOLATION: Font height
        status: "fail",
        measuredHeightMm: 1.4,
        requiredHeightMm: 2.0,
        packArea: "Display Panel Area 140 sq. cm (>100 to 500 sq. cm requires min 2.0mm numeral height)"
      }
    }
  },
  {
    id: "sample_02",
    name: "GlowGlow Korean Hydrating Essence 120ml",
    category: "Cosmetics",
    batchId: "IMP-KR-9942",
    description: "Sample seized from e-commerce fulfillment warehouse, Gurgaon",
    mockFileName: "korean_essence_imported_label.png",
    fileSize: "2.1 MB",
    fileType: "image/png",
    mockImage: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="280" height="160" viewBox="0 0 280 160">
      <rect width="100%" height="100%" fill="#FDF2F8" stroke="#DB2777" stroke-width="3" rx="6"/>
      <rect x="8" y="8" width="264" height="28" fill="#DB2777" rx="3"/>
      <text x="140" y="27" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FFF" text-anchor="middle">GLOWGLOW KOREAN ESSENCE</text>
      <text x="140" y="52" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#9D174D" text-anchor="middle">Hydrating Facial Serum · 120ml</text>
      <line x1="15" y1="62" x2="265" y2="62" stroke="#CBD5E1" stroke-width="1"/>
      <text x="16" y="80" font-family="sans-serif" font-size="9.5" fill="#1F2937">Net Vol.: 120 ml | MRP: Rs 1,299</text>
      <text x="16" y="96" font-family="sans-serif" font-size="9" fill="#DC2626" font-weight="bold">Country of Origin: NOT DECLARED</text>
      <text x="16" y="112" font-family="sans-serif" font-size="9" fill="#DC2626" font-weight="bold">Importer Address: Missing PIN code</text>
      <text x="16" y="128" font-family="sans-serif" font-size="8.5" fill="#4B5563">Imported by: Glow Retail, Mumbai</text>
      <text x="16" y="144" font-family="sans-serif" font-size="8" fill="#6B7280">USP: Rs 10.82 / ml · Batch: IMP-KR</text>
    </svg>`),
    ruleChecks: {
      rule_6_1_a: {
        // VIOLATION: Importer address missing PIN code and full address
        status: "fail",
        detectedText: "Imported by: Glow Retail, Mumbai",
        reason: "Non-compliant under Rule 6(1)(a): Complete registered postal address, state, and 6-digit PIN code missing."
      },
      rule_6_1_b: {
        status: "pass",
        detectedText: "Facial Hydrating Essence Serum"
      },
      rule_6_1_c: {
        status: "pass",
        detectedText: "Net Vol.: 120 ml"
      },
      rule_6_1_d: {
        status: "pass",
        detectedText: "Date of Import: 01/2026"
      },
      rule_6_1_e: {
        status: "pass",
        detectedText: "MRP ₹1,299.00 (Incl. of all taxes) | USP: ₹10.82 / ml"
      },
      rule_6_1_f: {
        // VIOLATION: No email
        status: "fail",
        detectedText: "Customer query contact: 98110XXXXX (No email or officer designation found)",
        reason: "Non-compliant under Rule 6(1)(f): Digital email contact details missing."
      },
      rule_6_1_g: {
        // VIOLATION: Missing Country of Origin
        status: "fail",
        detectedText: "Origin text unreadable or omitted on primary display panel",
        reason: "Non-compliant under Rule 6(1)(g) & Rule 6(10): Country of Origin declaration missing."
      },
      rule_9_font: {
        status: "pass",
        measuredHeightMm: 2.2,
        requiredHeightMm: 2.0
      }
    }
  },
  {
    id: "sample_03",
    name: "Amul Pure Ghee 1 Litre Carton",
    category: "Packaged Food & Staples",
    batchId: "AMUL-GH-2026-04",
    description: "Routine inspection at Mother Dairy Booth, Sector 14, Rohini",
    mockFileName: "amul_ghee_1l_compliant_label.pdf",
    fileSize: "850 KB",
    fileType: "application/pdf",
    mockImage: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="280" height="160" viewBox="0 0 280 160">
      <rect width="100%" height="100%" fill="#F0FDF4" stroke="#16A34A" stroke-width="3" rx="6"/>
      <rect x="8" y="8" width="264" height="28" fill="#16A34A" rx="3"/>
      <text x="140" y="27" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FFF" text-anchor="middle">AMUL PURE GHEE 1 LITRE</text>
      <text x="140" y="52" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#15803D" text-anchor="middle">Special Grade Dairy Ghee · 905g</text>
      <line x1="15" y1="62" x2="265" y2="62" stroke="#CBD5E1" stroke-width="1"/>
      <text x="16" y="80" font-family="sans-serif" font-size="9.5" fill="#166534" font-weight="bold">Net Qty: 1 L (905 g) | Origin: India</text>
      <text x="16" y="96" font-family="sans-serif" font-size="9.5" fill="#166534" font-weight="bold">MRP: Rs 650.00 | USP: Rs 0.65 / ml</text>
      <text x="16" y="112" font-family="sans-serif" font-size="9" fill="#1F2937">Packed: 03/2026 | Best before 9 months</text>
      <text x="16" y="128" font-family="sans-serif" font-size="8.5" fill="#4B5563">Mfg: GCMMF Ltd., Anand - 388001, Gujarat</text>
      <text x="16" y="144" font-family="sans-serif" font-size="8" fill="#15803D" font-weight="bold">Rule 6 &amp; Rule 9 Compliant (2026 Certified)</text>
    </svg>`),
    ruleChecks: {
      rule_6_1_a: {
        status: "pass",
        detectedText: "Gujarat Co-operative Milk Marketing Federation Ltd., Amul Dairy Road, Anand, Gujarat - 388001"
      },
      rule_6_1_b: {
        status: "pass",
        detectedText: "Pure Ghee / Clarified Butter"
      },
      rule_6_1_c: {
        status: "pass",
        detectedText: "Net Quantity: 1 L (905 g)"
      },
      rule_6_1_d: {
        status: "pass",
        detectedText: "Packed on: 03/2026 | Best before 9 months from packaging"
      },
      rule_6_1_e: {
        status: "pass",
        detectedText: "MRP ₹650.00 (Incl. of all taxes) | Unit Sale Price (USP): ₹0.65 / ml (₹650.00 / L)"
      },
      rule_6_1_f: {
        status: "pass",
        detectedText: "Consumer Care Cell: 1800-258-3333 | customercare@amul.coop | Address: GCMMF Anand - 388001"
      },
      rule_6_1_g: {
        status: "pass",
        detectedText: "Country of Origin: India"
      },
      rule_9_font: {
        status: "pass",
        measuredHeightMm: 4.2,
        requiredHeightMm: 4.0,
        packArea: "Display Panel Area 650 sq. cm (>500 sq. cm requires min 4.0mm height)"
      }
    }
  }
];
