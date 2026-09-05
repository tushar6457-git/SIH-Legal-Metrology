# Frontend
Owner: Prashant Pandey
Built with: React + Vite (AI-assisted build via AntiGravity)

## What's live
- Home — portal landing: hero section, live stats (commodities/rules/
  inspections/violations/verifications), pre-loaded sandbox with 4 sample
  commodities (2 compliant, 2 flagged) as a guaranteed demo path
  independent of live scanning
- Verify Package Label — core compliance-check screen (needs backend
  wiring — currently unconnected)
- Statutory Rules (LMR 2011) — in-app reference table of Rule 6
  mandatory declarations
- Inspection Register — enforcement officer log of past inspections
- Consumer Grievance (NCH) — MRP overcharge reporting tied to National
  Consumer Helpline 1915
- Officer Sandbox / Officer Login — role-based access shell
- Bilingual (English/Hindi) toggle + accessibility text-size controls
- Live audit-trail feed

## Known gaps — in priority order
1. Backend not connected yet ("API Disconnected" on the live server) —
   Verify Package Label needs to actually call OCR + the rule engine
2. Rule 6 Checklist table has at least one wrong citation — see below
3. Feature set has grown past the original 3-screen MVP — freeze new
   pages, put remaining time into #1

## Status
Frontend UI: built. Backend integration: pending.