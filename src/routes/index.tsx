import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AgentMark,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Pill,
  Segmented,
  SectionTitle,
} from "@/components/ui";
import { EXCEPTIONS, PURCHASE_ORDERS, money, poValue, qty } from "@/lib/mock-data";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Work · Wild Supply Automation" },
      {
        name: "description",
        content: "One inbox for the POs, approvals, exceptions and drafts waiting on you today.",
      },
      { property: "og:title", content: "My Work · Wild Supply Automation" },
      {
        property: "og:description",
        content: "One inbox for the POs, approvals, exceptions and drafts waiting on you today.",
      },
    ],
  }),
  component: MyWork,
});

type Task = {
  id: string;
  tab: "Approvals" | "Exceptions" | "Awaiting supplier" | "Drafts";
  icon: string;
  title: string;
  ref: string;
  ageDays: number;
  assignee: string;
  action: string;
  to: string;
  agent?: string;
};

const TASKS: Task[] = [
  {
    id: "t1",
    tab: "Approvals",
    icon: "✓",
    title: "Approve PO2900 · " + money(poValue(PURCHASE_ORDERS[0]), "GBP"),
    ref: "PO2900",
    ageDays: 2,
    assignee: "Alex Turner",
    action: "Approve / Reject",
    to: "/approvals",
  },
  {
    id: "t2",
    tab: "Exceptions",
    icon: "▲",
    title: `Split not fully allocated — ${qty(41440)} of ${qty(91000)} units`,
    ref: "PO2026040301",
    ageDays: 5,
    assignee: "Jordan Lee",
    action: "Resolve",
    to: "/exceptions",
    agent: "Detected by the replication agent during this morning's tracker scan.",
  },
  {
    id: "t3",
    tab: "Exceptions",
    icon: "?",
    title: "Confirm SKU for 300,000 units — PKG8060",
    ref: "PO2900",
    ageDays: 0,
    assignee: "Riley Chen",
    action: "Review",
    to: "/purchase-orders/PO2900",
    agent: "Matched from “corrugated 8060” with 0.94 confidence.",
  },
  {
    id: "t4",
    tab: "Exceptions",
    icon: "⌂",
    title: "“Harbour” is ambiguous — choose a supplier",
    ref: "PO3204",
    ageDays: 1,
    assignee: "Riley Chen",
    action: "Choose",
    to: "/purchase-orders/PO3204",
    agent: "Three approved entities share the name Harbour.",
  },
  {
    id: "t5",
    tab: "Awaiting supplier",
    icon: "✉",
    title: "Awaiting confirmation from Meridian China",
    ref: "PO2664",
    ageDays: 4,
    assignee: "Riley Chen",
    action: "Chase",
    to: "/purchase-orders/PO2664",
  },
  {
    id: "t6",
    tab: "Drafts",
    icon: "▢",
    title: "Draft PO missing a drop-dead ready date",
    ref: "PO3210",
    ageDays: 1,
    assignee: "Riley Chen",
    action: "Finish",
    to: "/purchase-orders/PO3210",
  },
];

function ageTone(days: number) {
  if (days < 1) return "success" as const;
  if (days <= 3) return "attention" as const;
  return "blocked" as const;
}

function MyWork() {
  const { actor } = useSession();
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);

  const visible = tab === "All" ? TASKS : TASKS.filter((t) => t.tab === tab);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div>
        <SectionTitle
          sub={`${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} · ${TASKS.length} items are waiting on you`}
        >
          Good morning, {actor.name.split(" ")[0]}
        </SectionTitle>

        <div className="mb-4">
          <Segmented
            options={["All", "Approvals", "Exceptions", "Awaiting supplier", "Drafts"]}
            value={tab}
            onChange={(v) => {
              setTab(v);
              setSelected([]);
            }}
          />
        </div>

        <Card>
          <CardHeader
            title="Task inbox"
            subtitle="Ordered by age. Anything an agent produced is marked."
            right={<Button size="sm">Density</Button>}
          />
          {visible.length === 0 ? (
            <EmptyState
              title="You're all clear."
              body="Nothing in this queue needs you right now."
              action={
                <Link to="/purchase-orders/new">
                  <Button variant="primary" size="sm">
                    Raise a PO
                  </Button>
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <input
                    type="checkbox"
                    aria-label={`Select ${t.ref}`}
                    checked={selected.includes(t.id)}
                    onChange={(e) =>
                      setSelected((s) =>
                        e.target.checked ? [...s, t.id] : s.filter((x) => x !== t.id),
                      )
                    }
                    className="size-4 accent-[oklch(0.534_0.086_184.5)]"
                  />
                  <span
                    aria-hidden="true"
                    className="flex size-8 items-center justify-center rounded-full bg-muted text-sm"
                  >
                    {t.icon}
                  </span>
                  <div className="min-w-[220px] flex-1">
                    <div className="text-sm font-medium">{t.title}</div>
                    <div className="num mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Link to="/purchase-orders/$poRef" params={{ poRef: t.ref }} className="text-primary hover:underline">
                        {t.ref}
                      </Link>
                      <span>· {t.assignee}</span>
                      {t.agent ? <AgentMark why={t.agent} /> : null}
                    </div>
                  </div>
                  <Pill tone={ageTone(t.ageDays)}>
                    {t.ageDays === 0 ? "today" : `${t.ageDays}d old`}
                  </Pill>
                  <Link to={t.to}>
                    <Button size="sm" variant="primary">
                      {t.action}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {selected.length > 0 ? (
            <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-b-xl border-t border-border bg-muted px-5 py-3">
              <span className="num text-sm">{selected.length} selected</span>
              <div className="flex gap-2">
                <Button size="sm">Reassign</Button>
                <Button size="sm">Snooze</Button>
                <Button size="sm" variant="primary">
                  Resolve selected
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader title="Agents did this for you today" />
          <ul className="space-y-3 px-5 pb-5 text-sm">
            <li className="rounded-lg bg-accent-soft px-3 py-2">
              <AgentMark why="Replication agent, tracker scan at 06:05.">Replication</AgentMark>
              <p className="mt-1">Replicated 15 shipment splits · flagged 2 exceptions</p>
            </li>
            <li className="rounded-lg bg-accent-soft px-3 py-2">
              <AgentMark why="Intake agent matched 6 phrases to SKUs, 1 needed a human.">Intake</AgentMark>
              <p className="mt-1">Resolved 6 SKUs from Slack messages · 1 sent to master data</p>
            </li>
            <li className="rounded-lg bg-accent-soft px-3 py-2">
              <AgentMark why="Scoring weights: price 30, lead time 25, on-time 20, capacity 10, region 10, contract 5.">
                Sourcing
              </AgentMark>
              <p className="mt-1">Ranked suppliers for 4 POs · 2 carry lead-time warnings</p>
            </li>
          </ul>
        </Card>

        <Card>
          <CardHeader title="Activity" />
          <ul className="space-y-3 px-5 pb-5 text-sm">
            {[
              ["08:12", "PO2900 submitted for approval by Riley Chen"],
              ["07:41", "SS2663 flagged — split not allocated"],
              ["06:58", "PKG8060 matched for PO2900"],
              ["Yesterday", "PO3176 approved at level 2 by Sam Rivera"],
            ].map(([when, what]) => (
              <li key={what} className="flex gap-3">
                <span className="num w-16 shrink-0 text-xs text-muted-foreground">{when}</span>
                <span>{what}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Open exceptions" subtitle={`${EXCEPTIONS.filter((e) => e.slaBreached).length} past SLA`} />
          <div className="px-5 pb-5">
            <Link to="/exceptions">
              <Button size="sm" className="w-full">
                Open the queue
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
