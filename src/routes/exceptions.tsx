import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AgentMark,
  Button,
  Card,
  CardHeader,
  Pill,
  SectionTitle,
  Segmented,
  Table,
  TD,
  TH,
  WarningNote,
} from "@/components/ui";
import { EXCEPTIONS, type Exception } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/exceptions")({
  head: () => ({
    meta: [
      { title: "Exceptions queue · Wild Supply Automation" },
      {
        name: "description",
        content:
          "Every stuck PO, split, receipt and invoice in one queue with severity, SLA ageing and one-click resolution.",
      },
      { property: "og:title", content: "Exceptions queue · Wild Supply Automation" },
      {
        property: "og:description",
        content: "Severity, SLA ageing, assignment and agent explanations for every exception.",
      },
    ],
  }),
  component: Exceptions,
});

const COLUMNS = ["High", "Medium", "Low"] as const;

function ageTone(days: number) {
  if (days < 1) return "success" as const;
  if (days <= 3) return "attention" as const;
  return "blocked" as const;
}

function Exceptions() {
  const [view, setView] = useState("Kanban");
  const [open, setOpen] = useState<Exception | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div>
      <SectionTitle sub={`${EXCEPTIONS.length} open · ${EXCEPTIONS.filter((e) => e.slaBreached).length} past SLA`}>
        Exceptions
      </SectionTitle>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Segmented options={["Kanban", "Table"]} value={view} onChange={setView} />
        <Button size="sm">Type</Button>
        <Button size="sm">Assignee</Button>
        <Button size="sm">SLA breach</Button>
        {selected.length > 0 ? (
          <div className="ml-auto flex gap-2">
            <Button size="sm">Bulk assign</Button>
            <Button size="sm" variant="primary">
              Bulk resolve ({selected.length})
            </Button>
          </div>
        ) : null}
      </div>

      {view === "Kanban" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {COLUMNS.map((sev) => (
            <div key={sev}>
              <div className="mb-2 flex items-center gap-2 px-1">
                <h2 className="text-sm font-semibold">{sev} severity</h2>
                <Pill tone={sev === "High" ? "blocked" : sev === "Medium" ? "attention" : "neutral"} icon={false}>
                  {EXCEPTIONS.filter((e) => e.severity === sev).length}
                </Pill>
              </div>
              <div className="space-y-3">
                {EXCEPTIONS.filter((e) => e.severity === sev).map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setOpen(e)}
                    className={cn(
                      "w-full rounded-xl bg-card p-4 text-left shadow-soft hover:shadow-lift",
                      e.slaBreached && "ring-2 ring-danger-soft",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="num text-xs text-muted-foreground">{e.id}</span>
                      <Pill tone={ageTone(e.ageDays)}>{e.ageDays === 0 ? "today" : `${e.ageDays}d`}</Pill>
                    </div>
                    <div className="mt-1.5 text-sm font-semibold">{e.type}</div>
                    <div className="num mt-0.5 text-xs text-muted-foreground">{e.record}</div>
                    <p className="mt-2 text-sm">{e.what}</p>
                    <div className="mt-2">
                      <AgentMark why={e.recommended}>Recommended fix</AgentMark>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{e.assignee}</span>
                      {e.slaBreached ? <Pill tone="blocked">SLA breached</Pill> : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <thead>
              <tr>
                <TH />
                <TH>Exception</TH>
                <TH>Type</TH>
                <TH>Record</TH>
                <TH>Severity</TH>
                <TH>Age</TH>
                <TH>Assignee</TH>
                <TH />
              </tr>
            </thead>
            <tbody>
              {EXCEPTIONS.map((e) => (
                <tr key={e.id} className="hover:bg-muted">
                  <TD>
                    <input
                      type="checkbox"
                      aria-label={`Select ${e.id}`}
                      checked={selected.includes(e.id)}
                      onChange={(ev) =>
                        setSelected((s) => (ev.target.checked ? [...s, e.id] : s.filter((x) => x !== e.id)))
                      }
                      className="size-4"
                    />
                  </TD>
                  <TD className="num">{e.id}</TD>
                  <TD className="font-medium">{e.type}</TD>
                  <TD className="num">{e.record}</TD>
                  <TD>
                    <Pill tone={e.severity === "High" ? "blocked" : e.severity === "Medium" ? "attention" : "neutral"}>
                      {e.severity}
                    </Pill>
                  </TD>
                  <TD>
                    <Pill tone={ageTone(e.ageDays)}>{e.ageDays}d</Pill>
                  </TD>
                  <TD>{e.assignee}</TD>
                  <TD className="text-right">
                    <Button size="sm" onClick={() => setOpen(e)}>
                      Open
                    </Button>
                  </TD>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {open ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-foreground/20" onClick={() => setOpen(null)}>
          <div
            className="h-full w-full max-w-md overflow-y-auto bg-card p-6 shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="num text-xs text-muted-foreground">{open.id}</div>
                <h2 className="text-lg font-semibold">{open.type}</h2>
                <div className="num text-sm text-muted-foreground">{open.record}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setOpen(null)}>
                ✕
              </Button>
            </div>

            <p className="mt-4 text-sm">{open.what}</p>

            <div className="mt-4 rounded-xl bg-accent-soft p-3">
              <AgentMark why="The agent's reasoning is stored with the exception for audit.">
                Agent explanation
              </AgentMark>
              <p className="mt-2 text-sm">{open.recommended}</p>
            </div>

            {open.slaBreached ? (
              <div className="mt-4">
                <WarningNote tone="blocked">Past SLA by {open.ageDays - 3} days — escalate if you cannot resolve it today.</WarningNote>
              </div>
            ) : null}

            <div className="mt-5 space-y-2">
              <Button variant="primary" className="w-full">
                Accept recommended fix
              </Button>
              <Button className="w-full">Override with a reason</Button>
              <Button className="w-full">Reassign</Button>
              <Button variant="ghost" className="w-full">
                Escalate
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold">Comments</h3>
              <div className="mt-2 space-y-2 text-sm">
                <div className="rounded-lg bg-muted px-3 py-2">
                  <span className="font-medium">Jordan Lee</span> · yesterday
                  <p className="mt-1">Chasing the tracker owner for the missing destination row.</p>
                </div>
              </div>
              <textarea
                rows={3}
                placeholder="Add a comment…"
                className="mt-3 w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
