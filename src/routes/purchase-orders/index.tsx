import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  Pill,
  SectionTitle,
  Segmented,
  Select,
  StatusPill,
  Table,
  TD,
  TH,
} from "@/components/ui";
import { PO_STATUSES, PURCHASE_ORDERS, SUPPLIERS, money, poValue, qty, shortDate } from "@/lib/mock-data";

export const Route = createFileRoute("/purchase-orders/")({
  head: () => ({
    meta: [
      { title: "All purchase orders · Wild Supply Automation" },
      {
        name: "description",
        content:
          "Filter, sort and export every purchase order with status, supplier, value and the next action owed.",
      },
      { property: "og:title", content: "All purchase orders · Wild Supply Automation" },
      {
        property: "og:description",
        content: "Saved views, value bands, exception flags and bulk actions across all POs.",
      },
    ],
  }),
  component: AllPOs,
});

function AllPOs() {
  const [view, setView] = useState("My open POs");
  const [status, setStatus] = useState("All");
  const [supplier, setSupplier] = useState("All");
  const [density, setDensity] = useState("Comfortable");
  const [selected, setSelected] = useState<string[]>([]);

  const rows = PURCHASE_ORDERS.filter((p) => {
    if (view === "Awaiting approval" && p.status !== "Pending Approval") return false;
    if (view === "Exceptions" && !p.hasException) return false;
    if (status !== "All" && p.status !== status) return false;
    if (supplier !== "All" && p.supplier !== supplier) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle sub={`${rows.length} of ${PURCHASE_ORDERS.length} purchase orders`}>
          All POs
        </SectionTitle>
        <div className="flex gap-2 pb-4">
          <Button size="sm">Export CSV</Button>
          <Link to="/purchase-orders/new">
            <Button size="sm" variant="primary">
              New PO
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Segmented
          options={["My open POs", "Awaiting approval", "Exceptions", "All"]}
          value={view}
          onChange={setView}
        />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-48">
          <option value="All">Any status</option>
          {PO_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
        <Select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="w-56">
          <option value="All">Any supplier</option>
          {SUPPLIERS.map((s) => (
            <option key={s.id}>{s.name}</option>
          ))}
        </Select>
        <Segmented options={["Comfortable", "Compact"]} value={density} onChange={setDensity} />
      </div>

      <Card>
        <CardHeader
          title="Purchase orders"
          subtitle="Click a row to open the record. Hover for quick actions."
          right={
            selected.length > 0 ? (
              <div className="flex gap-2">
                <Button size="sm">Reassign</Button>
                <Button size="sm">Remind approver</Button>
                <Button size="sm" variant="primary">
                  Export {selected.length}
                </Button>
              </div>
            ) : undefined
          }
        />
        <Table dense={density === "Compact"}>
          <thead>
            <tr>
              <TH />
              <TH>PO ref</TH>
              <TH>Status</TH>
              <TH>Supplier</TH>
              <TH className="text-right">SKUs</TH>
              <TH className="text-right">Total value</TH>
              <TH>PO date</TH>
              <TH>Ready date</TH>
              <TH>Owner</TH>
              <TH>Next action</TH>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.ref} className="group hover:bg-muted">
                <TD>
                  <input
                    type="checkbox"
                    aria-label={`Select ${p.ref}`}
                    checked={selected.includes(p.ref)}
                    onChange={(e) =>
                      setSelected((s) => (e.target.checked ? [...s, p.ref] : s.filter((x) => x !== p.ref)))
                    }
                    className="size-4"
                  />
                </TD>
                <TD className="num font-medium">
                  <Link
                    to="/purchase-orders/$poRef"
                    params={{ poRef: p.ref }}
                    className="text-primary hover:underline"
                  >
                    {p.ref}
                  </Link>
                  {p.version > 1 ? (
                    <span className="ml-2 text-xs text-muted-foreground">v{p.version}</span>
                  ) : null}
                </TD>
                <TD>
                  <div className="flex flex-wrap gap-1.5">
                    <StatusPill status={p.status} />
                    {p.hasException ? <Pill tone="attention">Exception</Pill> : null}
                  </div>
                </TD>
                <TD>{p.supplier}</TD>
                <TD className="num text-right">{p.lines.length}</TD>
                <TD className="num text-right font-medium">{money(poValue(p), p.currency)}</TD>
                <TD className="num">{shortDate(p.poDate)}</TD>
                <TD className="num">{shortDate(p.readyDate)}</TD>
                <TD>{p.owner}</TD>
                <TD className="text-muted-foreground">
                  <span className="group-hover:hidden">{p.nextAction}</span>
                  <span className="hidden gap-2 group-hover:flex">
                    <Link to="/purchase-orders/$poRef" params={{ poRef: p.ref }}>
                      <Button size="sm">Open</Button>
                    </Link>
                    <Button size="sm">Remind</Button>
                  </span>
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="num px-5 py-4 text-xs text-muted-foreground">
          Total shown: {qty(rows.reduce((t, p) => t + p.lines.reduce((s, l) => s + l.qty, 0), 0))} units
        </div>
      </Card>
    </div>
  );
}
