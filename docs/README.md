# Project Docs — SIH-Legal-Metrology

## Problem Statement
**PS 26034** — Software System to check compliance of Packaged Commodities
under Legal Metrology (Packaged Commodities) Rules, 2011, by scanning
products, images, and labels.
Ministry of Consumer Affairs, Food & Public Distribution · Dept of Consumer
Affairs (DoCA) · Category: Software

## Mandatory Declarations Checked (Rule 6)
- Manufacturer/Packer/Importer name & address (+ country of origin if imported)
- Common/generic name of product
- Net quantity (standard unit)
- Month & year of manufacture/packing/import
- MRP (inclusive of all taxes)
- Consumer care details

For e-commerce listings, all of the above apply except month/year of
manufacture (Rule 6(10)). Imported products on e-commerce platforms also
need a country-of-origin filter (Rule 6(10A), 2026 amendment).

## Core Features (build & demo)
1. Label image upload
2. OCR text extraction
3. Compliance check against mandatory declarations
4. Pass/fail report — lists what's missing or wrong
5. Dashboard — scan history + status

## Stretch Features (roadmap)
- Font size / readability check
- E-commerce listing scanner
- PDF/editable report export
- Role-based login
- Search & retrieval of scan history
