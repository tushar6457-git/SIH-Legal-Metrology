# SIH-Legal-Metrology
Automated compliance checking system for packaged commodities under Legal Metrology Rules, 2011. Scans labels, detects mandatory declarations, verifies font/MRP compliance, and flags violations via an enforcement dashboard.
Automated Legal Metrology Compliance Checker

An intelligent inspection and audit platform built for enforcement authorities to automate compliance checking of packaged commodities under India's Legal Metrology Act, 2009 and Packaged Commodities Rules, 2011.

Key Capabilities

    Automated OCR & Detection: Scans product images/labels to extract mandatory declarations (MRP, net quantity, manufacturer/packer details, dates, and consumer care info).

    Rule-Based Validation: Analyzes text placement, font size legibility, missing attributes, and non-standard declarations.

    Audit & Reporting: Generates exportable violation summaries (PDF/editable formats) backed by photographic evidence.

    Enforcement Dashboard: Role-based portal providing scan history, centralized product registries, and compliance analytics.


## Tech Stack

- Frontend: React + Tailwind CSS
- Backend: Python + FastAPI
- OCR: Tesseract / EasyOCR
- Database: PostgreSQL

## Project Structure

```text
SIH-Legal-Metrology/
├── frontend/           # Upload flow, results, dashboard UI
├── backend/            # API, rule engine, database integration
├── ocr/                # Label image preprocessing and text extraction
├── docs/               # Problem statement, rules reference, feature scope
└── README.md
