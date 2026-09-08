import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  Field,
  Pill,
  StatusPill,
  Table,
  TD,
  TH,
  WarningNote,
  SectionTitle,
} from "@/components/ui";
import { PURCHASE_ORDERS, money, poValue, qty, shortDate } from "@/lib/mock-data";
import { checkApproval, bandFor } from "@/lib/rbac";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/approvals")({
  head: () => ({
    meta: [
      { title: "Approvals inbox · Wild Supply Automation" },
      {
        name: "description",
        content:
          "Approve, reject or request changes on purchase orders in bulk, with self-approval visibly blocked.",
      },
      { property: "og:title", content: "Approvals inbox · Wild Supply Automation" },
      {
        property: "og:description",
        content: "High-volume PO approvals with value bands, risk flags and keyboard shortcuts.",
      },
    ],
  }),
  component: Approvals,
});

const QUEUE = PURCHASE_ORDERS.filter((p) =>
  ["Pending Approval", "Approved", "Awaiting Planner Review"].includes(p.status),
);

function Approvals() {
  const { actor, decided, markDecided } = useSession();
  const [index, setIndex] = useState(0);
  const [reasonFor, setReasonFor] = useState<null | "Reject" | "Request changes">(null);
  const [reason, setReason] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const po = QUEUE[index];
  const value = poValue(po);
  const check = checkApproval(po, value, actor, decided);
  const band = bandFor(value);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (reasonFor) return;
      if (e.key === "j") setIndex((i) => Math.min(QUEUE.length - 1, i + 1));
      if (e.key === "k") setIndex((i) => Math.max(0, i - 1));
      if (e.key === "a" && check.allowed) decide("Approved");
      if (e.key === "r") setReasonFor("Reject");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function decide(what: string) {
    if (decided.has(po.ref)) {
      setToast(`${po.ref} was already decided — this click was ignored.`);
      return;
    }
    markDecided(po.ref);
    setToast(`${po.ref} ${what.toLowerCase()} · level ${check.level} of ${check.required}`);
    setReasonFor(null);
    setReason("");
  }

  return (
    <div>
      <SectionTitle sub="J / K to move · A to approve · R to reject. Reject and request-changes need a reason.">
        Approvals inbox
      </SectionTitle>

      <div className="mb-4 rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary">
        Acting as <strong>{actor.name}</strong> ({actor.role}). Delegated approvals appear with the
        delegator's name on the card.
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card className="overflow-hidden">
          <CardHeader title={`Queue · ${QUEUE.length}`} />
          <ul className="divide-y divide-border">
            {QUEUE.map((p, i) => {
              const v = poValue(p);
              const blockedSelf = p.requesterId === actor.id;
              return (
                <li key={p.ref}>
                  <button
                    onClick={() => setIndex(i)}
                    className={cn(
                      "w-full px-5 py-4 text-left hover:bg-muted",
                      i === index && "bg-primary-soft",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="num text-sm font-semibold">{p.ref}</span>
                      <span className="num text-sm">{money(v, p.currency)}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {p.supplier} · raised by {p.owner}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <StatusPill status={p.status} />
                      {decided.has(p.ref) ? <Pill tone="success">Decided</Pill> : null}
                      {blockedSelf ? <Pill tone="blocked">Self-approval</Pill> : null}
                      {p.riskFlags.map((f) => (
                        <Pill key={f} tone="attention">
                          {f}
                        </Pill>
                      ))}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title={<span className="num">{po.ref} · v{po.version}</span>}
            subtitle={`${po.supplier} · raised by ${po.owner}`}
            right={<StatusPill status={po.status} />}
          />

          <div className="grid grid-cols-2 gap-4 px-5 pb-4 md:grid-cols-4">
            <Field label="Total value" value={money(value, po.currency)} hint={`In the PO's own currency (${po.currency})`} />
            <Field label="PO date" value={shortDate(po.poDate)} />
            <Field label="Drop-dead ready" value={shortDate(po.readyDate)} />
            <Field label="Approval rule" value={`${band.approvers} approver${band.approvers > 1 ? "s" : ""}`} hint={check.rule} />
          </div>

          <div className="px-5">
            <Table dense>
              <thead>
                <tr>
                  <TH>SKU</TH>
                  <TH>Destination</TH>
                  <TH className="text-right">Qty</TH>
                  <TH className="text-right">Unit price</TH>
                  <TH className="text-right">Line total</TH>
                </tr>
              </thead>
              <tbody>
                {po.lines.map((l) => (
                  <tr key={l.sku}>
                    <TD className="num font-medium">{l.sku}</TD>
                    <TD>{l.destination}</TD>
                    <TD className="num text-right">{qty(l.qty)}</TD>
                    <TD className="num text-right">{money(l.unitPrice, po.currency)}</TD>
                    <TD className="num text-right">{money(l.qty * l.unitPrice, po.currency)}</TD>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {po.riskFlags.length > 0 ? (
            <div className="space-y-2 px-5 pt-4">
              {po.riskFlags.map((f) => (
                <WarningNote key={f}>{f} — visible on purpose, it does not block approval.</WarningNote>
              ))}
            </div>
          ) : null}

          {!check.allowed ? (
            <div className="px-5 pt-4">
              <WarningNote tone="blocked">{check.reason}</WarningNote>
            </div>
          ) : (
            <div className="px-5 pt-4">
              <WarningNote tone="progress">
                This process is waiting on you — approval level {check.level} of {check.required}.
              </WarningNote>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 px-5 py-5">
            <span title={check.allowed ? undefined : check.reason}>
              <Button variant="primary" disabled={!check.allowed} onClick={() => decide("Approved")}>
                Approve
              </Button>
            </span>
            <Button variant="danger" onClick={() => setReasonFor("Reject")}>
              Reject
            </Button>
            <Button onClick={() => setReasonFor("Request changes")}>Request changes</Button>
            <Button variant="ghost" onClick={() => setToast("Bulk approve: 2 POs, £58,300 total — confirm in the summary.")}>
              Bulk approve…
            </Button>
          </div>

          {reasonFor ? (
            <div className="mx-5 mb-5 rounded-xl bg-muted p-4">
              <label className="mb-2 block text-sm font-medium">{reasonFor} — reason required</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-input bg-card p-3 text-sm outline-none focus:border-primary"
                placeholder="Explain the decision for the audit trail…"
              />
              <div className="mt-3 flex gap-2">
                <Button variant="primary" disabled={reason.trim().length < 5} onClick={() => decide(reasonFor)}>
                  Submit {reasonFor.toLowerCase()}
                </Button>
                <Button variant="ghost" onClick={() => setReasonFor(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      </div>

      {toast ? (
        <div className="fixed right-6 bottom-6 z-40 rounded-full bg-foreground px-4 py-3 text-sm text-background shadow-lift">
          {toast}
          <button className="ml-3 underline" onClick={() => setToast(null)}>
            dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}
