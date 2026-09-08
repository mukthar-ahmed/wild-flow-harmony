export type Role =
  | "Supply Planner"
  | "PO Approver"
  | "Supply Chain Ops"
  | "Finance"
  | "Master Data (MDM)"
  | "Admin";

export const ROLES: Role[] = [
  "Supply Planner",
  "PO Approver",
  "Supply Chain Ops",
  "Finance",
  "Master Data (MDM)",
  "Admin",
];

export type Person = { id: string; name: string; title: string; role: Role };

export const PEOPLE: Person[] = [
  { id: "u-riley", name: "Riley Chen", title: "Supply Planner", role: "Supply Planner" },
  { id: "u-alex", name: "Alex Turner", title: "Head of Supply Chain", role: "PO Approver" },
  { id: "u-sam", name: "Sam Rivera", title: "Finance Controller", role: "Finance" },
  { id: "u-jordan", name: "Jordan Lee", title: "Supply Chain Ops", role: "Supply Chain Ops" },
  { id: "u-priya", name: "Priya Nair", title: "Master Data", role: "Master Data (MDM)" },
  { id: "u-admin", name: "Dana Okafor", title: "Platform Admin", role: "Admin" },
];

export const PO_STATUSES = [
  "Draft",
  "Validating",
  "Validation Failed",
  "Awaiting Planner Review",
  "Pending Approval",
  "Approved",
  "Confirmed",
  "Sent to Supplier",
  "Supplier Confirmed",
  "Changes Requested",
  "Cancelled",
] as const;
export type POStatus = (typeof PO_STATUSES)[number];

export const SHIPMENT_STATUSES = [
  "Split Replicated",
  "Draft Shipment",
  "Freight Linked",
  "Packing List Validated",
  "ASN Sent",
  "In Transit",
  "Received",
  "Invoice Matched",
  "Landed Cost Allocated",
  "Closed",
  "Exception",
] as const;
export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export type Product = {
  sku: string;
  description: string;
  category: string;
  tier1: string;
  tier2: string;
  variant: string;
  market: string;
  moq: number;
  active: boolean;
  listPrice: number;
  cartonMultiple: number;
};

export const PRODUCTS: Product[] = [
  { sku: "PKG8060", description: "Wild Corrugated Pack 8060", category: "Packaging", tier1: "Secondary Packaging", tier2: "Corrugate", variant: "Standard", market: "UK + EU", moq: 50000, active: true, listPrice: 0.16, cartonMultiple: 500 },
  { sku: "PKG8075", description: "Wild Corrugated Pack 8075", category: "Packaging", tier1: "Secondary Packaging", tier2: "Corrugate", variant: "Large", market: "UK", moq: 40000, active: true, listPrice: 0.19, cartonMultiple: 500 },
  { sku: "CSE4009", description: "Deo Case: Aurora", category: "Cases", tier1: "Primary Packaging", tier2: "Deodorant Case", variant: "Aurora", market: "UK", moq: 10000, active: true, listPrice: 0.74, cartonMultiple: 240 },
  { sku: "CSE4010", description: "Deo Case: Midnight", category: "Cases", tier1: "Primary Packaging", tier2: "Deodorant Case", variant: "Midnight", market: "EU", moq: 10000, active: true, listPrice: 0.76, cartonMultiple: 240 },
  { sku: "RFL2201", description: "Deodorant Refill: Coastal Breeze", category: "Refills", tier1: "Finished Good", tier2: "Deodorant Refill", variant: "Coastal Breeze", market: "UK", moq: 20000, active: true, listPrice: 1.12, cartonMultiple: 144 },
  { sku: "RFL2202", description: "Deodorant Refill: Fresh Linen", category: "Refills", tier1: "Finished Good", tier2: "Deodorant Refill", variant: "Fresh Linen", market: "UK + EU", moq: 20000, active: true, listPrice: 1.1, cartonMultiple: 144 },
  { sku: "LBL1150", description: "Label Sheet: Wild Core Range", category: "Packaging", tier1: "Labelling", tier2: "Self-Adhesive Label", variant: "Core Range", market: "UK + EU", moq: 25000, active: false, listPrice: 0.04, cartonMultiple: 1000 },
];

export type Supplier = {
  id: string;
  name: string;
  region: string;
  leadTimeDays: number;
  moq: number;
  onTimePct: number;
  monthlyCapacity: number;
  status: "Approved/Active" | "Pending approval" | "Inactive";
};

export const SUPPLIERS: Supplier[] = [
  { id: "s-baltic", name: "Baltic Pack Germany", region: "EU", leadTimeDays: 30, moq: 50000, onTimePct: 94, monthlyCapacity: 400000, status: "Approved/Active" },
  { id: "s-meridian", name: "Meridian China", region: "APAC", leadTimeDays: 42, moq: 20000, onTimePct: 88, monthlyCapacity: 900000, status: "Approved/Active" },
  { id: "s-harbour-hk", name: "Harbour (HK) Packaging Ltd", region: "APAC", leadTimeDays: 45, moq: 10000, onTimePct: 90, monthlyCapacity: 250000, status: "Approved/Active" },
  { id: "s-harbour-cn", name: "Harbour China", region: "APAC", leadTimeDays: 38, moq: 10000, onTimePct: 86, monthlyCapacity: 500000, status: "Approved/Active" },
  { id: "s-harbour-th", name: "Harbour Thailand", region: "APAC", leadTimeDays: 34, moq: 15000, onTimePct: 95, monthlyCapacity: 200000, status: "Pending approval" },
  { id: "s-northgate", name: "Northgate UK", region: "UK", leadTimeDays: 21, moq: 15000, onTimePct: 97, monthlyCapacity: 300000, status: "Approved/Active" },
];

export const DESTINATIONS = [
  "DC Netherlands",
  "Hub EU",
  "Hub UK",
  "DC US",
  "Hub AU",
  "HQ",
] as const;

export type POLine = {
  sku: string;
  qty: number;
  unitPrice: number;
  destination: string;
};

export type PurchaseOrder = {
  ref: string;
  version: number;
  status: POStatus;
  supplier: string;
  currency: string;
  poDate: string;
  readyDate: string;
  owner: string;
  requesterId: string;
  lines: POLine[];
  nextAction: string;
  hasException: boolean;
  approvalsGiven: { id: string; person: string; level: number; at: string; comment?: string }[];
  riskFlags: string[];
};

export const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    ref: "PO2900", version: 1, status: "Pending Approval", supplier: "Baltic Pack Germany", currency: "GBP",
    poDate: "2026-08-24", readyDate: "2026-10-02", owner: "Riley Chen", requesterId: "u-riley",
    lines: [
      { sku: "PKG8060", qty: 300000, unitPrice: 0.156, destination: "DC Netherlands" },
      { sku: "PKG8075", qty: 0, unitPrice: 0.19, destination: "Hub EU" },
    ].filter((l) => l.qty > 0),
    nextAction: "Approval level 1 — Alex Turner",
    hasException: false,
    approvalsGiven: [],
    riskFlags: ["Price 8% above list", "Lead time misses ready date by 4 days"],
  },
  {
    ref: "PO3176", version: 2, status: "Approved", supplier: "Northgate UK", currency: "GBP",
    poDate: "2026-08-18", readyDate: "2026-09-20", owner: "Riley Chen", requesterId: "u-riley",
    lines: [{ sku: "CSE4009", qty: 120000, unitPrice: 0.74, destination: "Hub UK" }],
    nextAction: "Send to supplier",
    hasException: false,
    approvalsGiven: [
      { id: "a1", person: "Alex Turner", level: 1, at: "2026-08-19T09:12:00Z" },
      { id: "a2", person: "Sam Rivera", level: 2, at: "2026-08-19T14:02:00Z", comment: "Within budget." },
    ],
    riskFlags: [],
  },
  {
    ref: "PO2664", version: 1, status: "Sent to Supplier", supplier: "Meridian China", currency: "USD",
    poDate: "2026-08-04", readyDate: "2026-10-28", owner: "Riley Chen", requesterId: "u-riley",
    lines: [{ sku: "RFL2202", qty: 210000, unitPrice: 1.08, destination: "DC US" }],
    nextAction: "Awaiting supplier confirmation",
    hasException: false,
    approvalsGiven: [
      { id: "a3", person: "Alex Turner", level: 1, at: "2026-08-05T08:30:00Z" },
      { id: "a4", person: "Sam Rivera", level: 2, at: "2026-08-05T11:44:00Z" },
    ],
    riskFlags: ["Capacity shortfall vs monthly capacity"],
  },
  {
    ref: "PO2026040301", version: 3, status: "Supplier Confirmed", supplier: "Harbour China", currency: "USD",
    poDate: "2026-07-22", readyDate: "2026-09-30", owner: "Jordan Lee", requesterId: "u-jordan",
    lines: [{ sku: "CSE4010", qty: 91000, unitPrice: 0.76, destination: "Hub EU" }],
    nextAction: "Resolve split allocation (41,440 of 91,000)",
    hasException: true,
    approvalsGiven: [
      { id: "a5", person: "Alex Turner", level: 1, at: "2026-07-23T10:00:00Z" },
      { id: "a6", person: "Sam Rivera", level: 2, at: "2026-07-23T16:20:00Z" },
    ],
    riskFlags: ["Split quantities do not add up to PO total"],
  },
  {
    ref: "PO2507", version: 1, status: "Confirmed", supplier: "Harbour (HK) Packaging Ltd", currency: "USD",
    poDate: "2026-07-02", readyDate: "2026-09-12", owner: "Riley Chen", requesterId: "u-riley",
    lines: [{ sku: "RFL2201", qty: 64000, unitPrice: 1.14, destination: "DC US" }],
    nextAction: "Shipment splits in progress",
    hasException: false,
    approvalsGiven: [{ id: "a7", person: "Alex Turner", level: 1, at: "2026-07-03T09:05:00Z" }],
    riskFlags: [],
  },
  {
    ref: "PO-0230", version: 1, status: "Confirmed", supplier: "Baltic Pack Germany", currency: "EUR",
    poDate: "2026-06-28", readyDate: "2026-08-30", owner: "Riley Chen", requesterId: "u-riley",
    lines: [{ sku: "PKG8075", qty: 38000, unitPrice: 0.191, destination: "Hub EU" }],
    nextAction: "Awaiting packing list",
    hasException: false,
    approvalsGiven: [{ id: "a8", person: "Alex Turner", level: 1, at: "2026-06-29T08:40:00Z" }],
    riskFlags: ["Quantity below MOQ (40,000)"],
  },
  {
    ref: "PO3204", version: 1, status: "Validation Failed", supplier: "Harbour Thailand", currency: "USD",
    poDate: "2026-09-01", readyDate: "2026-10-10", owner: "Riley Chen", requesterId: "u-riley",
    lines: [{ sku: "LBL1150", qty: 30000, unitPrice: 0.041, destination: "Hub UK" }],
    nextAction: "Fix 2 blocking rules",
    hasException: true,
    approvalsGiven: [],
    riskFlags: ["SKU inactive", "Supplier not approved"],
  },
  {
    ref: "PO3210", version: 1, status: "Draft", supplier: "Northgate UK", currency: "GBP",
    poDate: "2026-09-05", readyDate: "2026-11-01", owner: "Riley Chen", requesterId: "u-riley",
    lines: [{ sku: "CSE4009", qty: 45000, unitPrice: 0.74, destination: "Hub UK" }],
    nextAction: "Complete drop-dead ready date",
    hasException: false,
    approvalsGiven: [],
    riskFlags: [],
  },
];

export const poValue = (po: PurchaseOrder) =>
  po.lines.reduce((t, l) => t + l.qty * l.unitPrice, 0);

export type Shipment = {
  ref: string;
  poRef: string;
  sku: string;
  origin: string;
  destination: string;
  confirmedQty: number;
  readyDate: string;
  status: ShipmentStatus;
  isRef?: string;
  freightRef?: string;
};

export const SHIPMENTS: Shipment[] = [
  { ref: "SS2556", poRef: "PO2507", sku: "RFL2201", origin: "Hong Kong", destination: "DC US", confirmedQty: 40000, readyDate: "2026-09-12", status: "In Transit", isRef: "IS68298", freightRef: "FWD-3900091" },
  { ref: "SS2565", poRef: "PO2507", sku: "RFL2201", origin: "Hong Kong", destination: "Hub AU", confirmedQty: 24000, readyDate: "2026-09-20", status: "ASN Sent", isRef: "IS87831", freightRef: "FWD-3985599" },
  { ref: "SS2663", poRef: "PO2026040301", sku: "CSE4010", origin: "Shenzhen", destination: "Hub EU", confirmedQty: 41440, readyDate: "2026-09-30", status: "Exception", isRef: "IS102678" },
  { ref: "SS2671", poRef: "PO-0230", sku: "PKG8075", origin: "Hamburg", destination: "Hub EU", confirmedQty: 38000, readyDate: "2026-08-30", status: "Received", freightRef: "Haulier 2401-3" },
  { ref: "SS2688", poRef: "PO2664", sku: "RFL2202", origin: "Ningbo", destination: "DC US", confirmedQty: 210000, readyDate: "2026-10-28", status: "Draft Shipment" },
  { ref: "SS2690", poRef: "PO3176", sku: "CSE4009", origin: "Manchester", destination: "Hub UK", confirmedQty: 120000, readyDate: "2026-09-20", status: "Split Replicated", freightRef: "Courier 1778132366" },
];

export type Exception = {
  id: string;
  type: string;
  record: string;
  severity: "High" | "Medium" | "Low";
  ageDays: number;
  assignee: string;
  what: string;
  recommended: string;
  slaBreached: boolean;
};

export const EXCEPTIONS: Exception[] = [
  { id: "EX-1041", type: "Split not allocated", record: "PO2026040301", severity: "High", ageDays: 5, assignee: "Jordan Lee", what: "Splits cover 41,440 of 91,000 confirmed units.", recommended: "Add a split for the remaining 49,560 units to Hub EU.", slaBreached: true },
  { id: "EX-1044", type: "SKU not found", record: "Request from Riley Chen", severity: "Medium", ageDays: 2, assignee: "Priya Nair", what: '"deo case midnight 500ml" did not match a single SKU.', recommended: "Link the phrase to CSE4010.", slaBreached: false },
  { id: "EX-1047", type: "Validation failed", record: "PO3204", severity: "High", ageDays: 1, assignee: "Riley Chen", what: "LBL1150 is inactive and Harbour Thailand is not approved.", recommended: "Swap to an active SKU or request supplier approval.", slaBreached: false },
  { id: "EX-1049", type: "Quantity variance", record: "SS2671", severity: "Low", ageDays: 0, assignee: "Jordan Lee", what: "Receipt of 37,600 against 38,000 shipped.", recommended: "Accept within 2% tolerance.", slaBreached: false },
  { id: "EX-1052", type: "Invoice mismatch", record: "FWD-3900091", severity: "Medium", ageDays: 4, assignee: "Sam Rivera", what: "Invoice is 320.00 above the booking.", recommended: "Dispute with the forwarder.", slaBreached: true },
  { id: "EX-1055", type: "Duplicate tracker rows", record: "Tracker row 118–119", severity: "Low", ageDays: 3, assignee: "Jordan Lee", what: "Two identical rows for PO2664 / DC US.", recommended: "Ignore the duplicate — replication is idempotent.", slaBreached: false },
];

export type Notification = {
  id: string;
  type: string;
  title: string;
  when: string;
  today: boolean;
  href: string;
  read: boolean;
};

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "Approval requested", title: "PO2900 · £46,800 needs your approval", when: "08:12", today: true, href: "/approvals", read: false },
  { id: "n2", type: "Exception raised", title: "Split not allocated — PO2026040301", when: "07:40", today: true, href: "/exceptions", read: false },
  { id: "n3", type: "Job completed", title: "Replicated 15 shipment splits · flagged 2 exceptions", when: "06:05", today: true, href: "/shipping/split-replication", read: true },
  { id: "n4", type: "Supplier replied", title: "Mark at Harbour proposed a new ready date on PO2507", when: "Yesterday", today: false, href: "/purchase-orders/PO2507", read: true },
  { id: "n5", type: "Shipment received", title: "SS2671 received at Hub EU", when: "2 days ago", today: false, href: "/shipping/shipments", read: true },
];

export type AuditEntry = {
  id: string;
  at: string;
  actor: string;
  isAgent: boolean;
  agentMeta?: string;
  action: string;
  record: string;
  before?: string;
  after?: string;
};

export const AUDIT_LOG: AuditEntry[] = [
  { id: "al1", at: "2026-09-08T07:41:00Z", actor: "Split Replication Agent", isAgent: true, agentMeta: "replication-agent v2.4 · prompt v11", action: "Replicated splits", record: "PO2026040301", before: "0 splits", after: "1 split (41,440)" },
  { id: "al2", at: "2026-09-08T06:58:00Z", actor: "Intake Agent", isAgent: true, agentMeta: "intake-agent v3.1 · prompt v19", action: "Matched SKU", record: "PO2900", before: '"corrugated 8060"', after: "PKG8060" },
  { id: "al3", at: "2026-09-07T16:20:00Z", actor: "Riley Chen", isAgent: false, action: "Submitted for approval", record: "PO2900", before: "Awaiting Planner Review", after: "Pending Approval" },
  { id: "al4", at: "2026-09-07T14:02:00Z", actor: "Sam Rivera", isAgent: false, action: "Approved (level 2)", record: "PO3176", before: "Pending Approval", after: "Approved" },
  { id: "al5", at: "2026-09-06T11:11:00Z", actor: "Riley Chen", isAgent: false, action: "Changed quantity — new version created", record: "PO3176 v1 → v2", before: "110,000", after: "120,000" },
];

export const ALIASES = [
  { phrase: "corrugated 8060", sku: "PKG8060", uses: 42 },
  { phrase: "aurora case", sku: "CSE4009", uses: 18 },
  { phrase: "coastal refill", sku: "RFL2201", uses: 27 },
  { phrase: "big box", sku: "PKG8075", uses: 3 },
];

export const CURRENCY_SYMBOL: Record<string, string> = { GBP: "£", USD: "$", EUR: "€" };

export const money = (value: number, currency: string) =>
  `${CURRENCY_SYMBOL[currency] ?? ""}${value.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const qty = (value: number) => value.toLocaleString("en-GB");

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
