// Legal Metrology (Packaged Commodities) Rules, 2011 (Amended up to 2024-2026)
// Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution

export const LEGAL_METROLOGY_RULES_2026 = {
  version: "2026.1",
  amendmentTitle: "Legal Metrology (Packaged Commodities) Amendment Rules, 2024-2026",
  authority: "Department of Consumer Affairs, Government of India",
  
  // Rule 6: Mandatory Declarations
  mandatoryDeclarations: [
    {
      id: "rule_6_1_a",
      ruleNo: "Rule 6(1)(a)",
      title: "Name and Complete Address of Manufacturer / Packer / Importer",
      description: "Must state full postal address along with 6-digit Postal PIN Code and State. Mere city name is non-compliant.",
      criticality: "High",
      penaltySection: "Section 36(1) of Legal Metrology Act, 2009"
    },
    {
      id: "rule_6_1_b",
      ruleNo: "Rule 6(1)(b)",
      title: "Generic / Common Name of Commodity",
      description: "Must clearly disclose the common or generic name of the commodity contained in the package.",
      criticality: "Medium",
      penaltySection: "Section 36(1)"
    },
    {
      id: "rule_6_1_c",
      ruleNo: "Rule 6(1)(c)",
      title: "Net Quantity in Standard Legal Metric Units",
      description: "Standard units: g, kg, ml, l, or numbers (no non-metric units like lbs, oz, or gross weight qualifiers).",
      criticality: "High",
      penaltySection: "Section 36(1) & Section 30"
    },
    {
      id: "rule_6_1_d",
      ruleNo: "Rule 6(1)(d)",
      title: "Month and Year of Manufacture / Pre-packing / Import",
      description: "Must be clearly displayed in MM/YYYY or Month Year format.",
      criticality: "High",
      penaltySection: "Section 36(1)"
    },
    {
      id: "rule_6_1_e",
      ruleNo: "Rule 6(1)(e) [2026 Amendment]",
      title: "Maximum Retail Price (MRP) & Unit Sale Price (USP)",
      description: "MRP must be inclusive of all taxes. 2026 Mandatory USP: If net qty > 1kg/1L, state price per kg/L; if net qty < 1kg/1L, state price per g/ml (rounded to two decimal places).",
      criticality: "Critical",
      penaltySection: "Section 36(1) & Rule 18"
    },
    {
      id: "rule_6_1_f",
      ruleNo: "Rule 6(1)(f)",
      title: "Consumer Care Details (Digital & Postal)",
      description: "Must contain Name/Designation of contact officer, Postal Address, Helpline Telephone Number, and a Valid Email ID.",
      criticality: "High",
      penaltySection: "Section 36(1)"
    },
    {
      id: "rule_6_1_g",
      ruleNo: "Rule 6(1)(g) & 6(10)",
      title: "Country of Origin (and Importer details if applicable)",
      description: "Mandatory country of origin declaration in English or Hindi on both physical retail and e-commerce listings.",
      criticality: "High",
      penaltySection: "Section 36(1)"
    }
  ],

  // Rule 9 & Schedule II: Minimum Height of Numerals & Letters
  scheduleII_FontHeights: [
    { areaRange: "Upto 50 sq. cm", minNormalHeightMm: 1.0, minMouldedHeightMm: 2.0, netQtyLimit: "Upto 50g / ml" },
    { areaRange: "50 to 100 sq. cm", minNormalHeightMm: 1.5, minMouldedHeightMm: 3.0, netQtyLimit: "50g to 100g / ml" },
    { areaRange: "100 to 500 sq. cm", minNormalHeightMm: 2.0, minMouldedHeightMm: 4.0, netQtyLimit: "100g to 500g / ml" },
    { areaRange: "500 to 2500 sq. cm", minNormalHeightMm: 4.0, minMouldedHeightMm: 6.0, netQtyLimit: "500g to 1kg / 1L" },
    { areaRange: "Above 2500 sq. cm", minNormalHeightMm: 6.0, minMouldedHeightMm: 6.0, netQtyLimit: "Above 1kg / 1L" }
  ],

  // Verification Evaluator Function
  evaluateProductCompliance: function(productData, extractedRules) {
    const violations = [];
    const passedDeclarations = [];

    this.mandatoryDeclarations.forEach(rule => {
      const itemCheck = extractedRules[rule.id];
      if (!itemCheck || itemCheck.status === "fail") {
        violations.push({
          ruleId: rule.id,
          ruleNo: rule.ruleNo,
          title: rule.title,
          detectedText: itemCheck?.detectedText || "Not detected / Missing on label",
          reason: itemCheck?.reason || "Mandatory declaration missing or illegible under PCR Rules 2011/2026",
          criticality: rule.criticality,
          penaltySection: rule.penaltySection
        });
      } else {
        passedDeclarations.push({
          ruleId: rule.id,
          ruleNo: rule.ruleNo,
          title: rule.title,
          detectedText: itemCheck.detectedText,
          notes: itemCheck.notes || "Verified compliant with 2026 amendment standards"
        });
      }
    });

    // Font height check
    const fontCheck = extractedRules["rule_9_font"];
    if (fontCheck && fontCheck.status === "fail") {
      violations.push({
        ruleId: "rule_9_font",
        ruleNo: "Rule 9 & Schedule II",
        title: "Minimum Height of Numerals & Letters Violation",
        detectedText: `Measured Height: ${fontCheck.measuredHeightMm} mm (Required: ${fontCheck.requiredHeightMm} mm)`,
        reason: `Numerals on Principal Display Panel fail minimum height requirement for ${fontCheck.packArea || "package area"}`,
        criticality: "Medium",
        penaltySection: "Section 36(1)"
      });
    }

    const isPass = violations.length === 0;
    const score = Math.round((passedDeclarations.length / (passedDeclarations.length + violations.length)) * 100);

    return {
      isPass,
      score,
      violations,
      passedDeclarations,
      timestamp: new Date().toISOString(),
      verifiedUnder: "Legal Metrology (Packaged Commodities) Rules, 2011 (Amended 2026)"
    };
  }
};
