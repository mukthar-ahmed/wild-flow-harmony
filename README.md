# Wildstone Approval

Brand kit

No logo file yet — please render the wordmark as text ("Wild") in the primary colour, so it can be swapped for an SVG later.

Token

Value

Primary

#1E7D73

Primary hover

#165E57

Accent (AI/agent output)

#FF6038

Success

#12A150 · Warning #F5A524 · Danger #E5484D · Info #0A7AFF

Neutrals

#181818 text · #5C5C5C muted · #E2E2E2 border · #F9F0F2 surface · #FFFFFF card

Font

Harmonia Sans / Futura (fallback: system sans). Tabular numerals for all quantities, prices and dates.

Radius / shadow

24px radius (pill-style buttons / rounded cards), subtle drop shadow, no heavy borders

Dark mode: invert neutrals (#F9F0F2 text, #181818 surface/card), keep the same accents.

2. Access rules
Six roles as proposed, with these exceptions:
Approval limits (placeholder values, currency-agnostic — display in the PO's own currency):
Up to 25,000 → 1 approver
25,000–100,000 → 2 approvers, sequential
Over 100,000 → 2 approvers, second must be Head of Supply Chain
Hard rules:
Self-approval is prohibited — the requester can never approve their own PO. Show it blocked with a tooltip, not hidden.
Approved POs are never edited in place. A material change (quantity, price, supplier, dates) creates a new version and re-triggers validation and approval. Non-material changes may fast-path only where configured. The PO reference never changes across versions.
Approval actions must be idempotent — reject stale, duplicate or superseded clicks.
Visibility:
Finance: yes, sees all costs across all POs and shipments — invoices, landed cost, overrides.
Planners see pricing on their own POs; landed-cost detail is read-only to them.
Ops sees shipments and freight; no PO approval rights.
MDM sees only master data and the SKU request queue.
Admin sees everything and owns rules, matrix and role assignment.
3. Workflow specifics
PO statuses (in order): Draft → Validating → Validation Failed → Awaiting Planner Review → Pending Approval → Approved → Confirmed → Sent to Supplier → Supplier Confirmed. Plus: Changes Requested and Cancelled.
Shipment statuses (in order): Split Replicated → Draft Shipment → Freight Linked → Packing List Validated → ASN Sent → In Transit → Received → Invoice Matched → Landed Cost Allocated → Closed. Plus Exception at any stage.
Approval steps: planner reviews validation → 1 or 2 approvers by value → PO confirmed and sent to the supplier. Approvers can Approve, Reject or Request Changes; the last two require a reason.
Mandatory fields — PO request (all five): SKU · Quantity · PO date · Supplier · Drop-dead ready date. The form must block submission until all five are present. Line level also needs Destination and Unit price + currency.
Mandatory — shipment split: PO Ref · SKU · Origin · Destination · Confirmed Qty · Ready Date.
SKU fields used for search/matching (show all six on match cards): Description · Category · Tier 1 · Tier 2 · Variant · Market. A SKU must be Active to be ordered.
Supplier fields to display: Region · Lead time (days) · MOQ · On-time % · Monthly capacity. Supplier must be Approved/Active.
Blocking vs warning — important for the UI:
Blocks: missing mandatory field, inactive SKU, unapproved supplier, self-approval, duplicate PO.
Warnings only (never block, always visible): quantity below MOQ, lead time missing the ready date, carton-multiple rounding, capacity shortfall, price differing from the price list, split quantities not adding up to the PO total.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a12547f7-4507-4673-9543-187f6b319d45).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
