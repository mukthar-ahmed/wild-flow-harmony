import type { Role, PurchaseOrder } from "./mock-data";

export type Capability =
  | "po.create"
  | "po.approve"
  | "po.viewPricing"
  | "cost.viewAll"
  | "cost.edit"
  | "shipments.manage"
  | "masterData.manage"
  | "admin.configure";

const MATRIX: Record<Role, Capability[]> = {
  "Supply Planner": ["po.create", "po.viewPricing", "shipments.manage"],
  "PO Approver": ["po.approve", "po.viewPricing"],
  "Supply Chain Ops": ["shipments.manage"],
  Finance: ["cost.viewAll", "cost.edit", "po.viewPricing"],
  "Master Data (MDM)": ["masterData.manage"],
  Admin: [
    "po.create",
    "po.approve",
    "po.viewPricing",
    "cost.viewAll",
    "cost.edit",
    "shipments.manage",
    "masterData.manage",
    "admin.configure",
  ],
};

export const can = (role: Role, cap: Capability) => MATRIX[role].includes(cap);

export const LANDING: Record<Role, string> = {
  "Supply Planner": "/",
  "PO Approver": "/approvals",
  "Supply Chain Ops": "/shipping/shipments",
  Finance: "/insights/landed-cost",
  "Master Data (MDM)": "/data/master-data-requests",
  Admin: "/admin/rules",
};

/** Approval matrix — placeholder bands, currency-agnostic, shown in the PO's own currency. */
export const APPROVAL_BANDS = [
  { label: "Up to 25,000", max: 25000, approvers: 1, note: "1 approver" },
  { label: "25,000 – 100,000", max: 100000, approvers: 2, note: "2 approvers, sequential" },
  {
    label: "Over 100,000",
    max: Infinity,
    approvers: 2,
    note: "2 approvers, sequential — second must be Head of Supply Chain",
  },
];

export const bandFor = (value: number) => APPROVAL_BANDS.find((b) => value <= b.max)!;

export type ApprovalCheck = {
  allowed: boolean;
  reason?: string;
  level: number;
  required: number;
  rule: string;
};

/** Idempotent, self-approval-aware approval gate. */
export function checkApproval(
  po: PurchaseOrder,
  value: number,
  actor: { id: string; name: string; role: Role },
  decided: Set<string>,
): ApprovalCheck {
  const band = bandFor(value);
  const level = po.approvalsGiven.length + 1;
  const base = { level, required: band.approvers, rule: `Value ${band.label} → ${band.note}` };

  if (decided.has(po.ref))
    return { ...base, allowed: false, reason: "Already decided in this session — duplicate clicks are ignored." };
  if (po.status !== "Pending Approval")
    return { ...base, allowed: false, reason: `This PO is ${po.status} — the approval step is superseded.` };
  if (po.requesterId === actor.id)
    return {
      ...base,
      allowed: false,
      reason: "Self-approval is prohibited. You raised this PO, so it must be approved by someone else.",
    };
  if (!can(actor.role, "po.approve"))
    return { ...base, allowed: false, reason: `${actor.role} does not hold PO approval rights.` };
  if (po.approvalsGiven.some((a) => a.person === actor.name))
    return { ...base, allowed: false, reason: "You already approved this PO at an earlier level." };
  if (level === 2 && band.max === Infinity && actor.name !== "Alex Turner")
    return {
      ...base,
      allowed: false,
      reason: "Over 100,000 the second approver must be the Head of Supply Chain (Alex Turner).",
    };

  return { ...base, allowed: true };
}
