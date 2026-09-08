import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AssistantPanel } from "@/components/assistant-panel";
import { Pill } from "@/components/ui";
import { EXCEPTIONS, NOTIFICATIONS, PURCHASE_ORDERS, type Role } from "@/lib/mock-data";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const NAV: { group: string; items: { label: string; to: string; icon: string; badge?: number }[] }[] = [
  {
    group: "Work",
    items: [
      { label: "My Work", to: "/", icon: "◍" },
      {
        label: "Approvals",
        to: "/approvals",
        icon: "✓",
        badge: PURCHASE_ORDERS.filter((p) => p.status === "Pending Approval").length,
      },
      { label: "Exceptions", to: "/exceptions", icon: "▲", badge: EXCEPTIONS.length },
    ],
  },
  {
    group: "Purchase Orders",
    items: [
      { label: "All POs", to: "/purchase-orders", icon: "▤" },
      { label: "New PO", to: "/purchase-orders/new", icon: "＋" },
      { label: "Bulk Upload", to: "/purchase-orders/bulk-upload", icon: "⇪" },
    ],
  },
  {
    group: "Shipping",
    items: [
      { label: "Shipments", to: "/shipping/shipments", icon: "▦" },
      { label: "Split Replication", to: "/shipping/split-replication", icon: "⇉" },
      { label: "Freight & Invoices", to: "/shipping/freight", icon: "⛴" },
    ],
  },
  {
    group: "Insights",
    items: [
      { label: "Dashboard", to: "/insights/dashboard", icon: "◔" },
      { label: "Process Tracker", to: "/insights/process-tracker", icon: "⟶" },
      { label: "Landed Cost", to: "/insights/landed-cost", icon: "£" },
    ],
  },
  {
    group: "Data & Admin",
    items: [
      { label: "Products", to: "/data/products", icon: "◇" },
      { label: "Suppliers", to: "/data/suppliers", icon: "⌂" },
      { label: "Master Data Requests", to: "/data/master-data-requests", icon: "?" },
      { label: "Rules & Configuration", to: "/admin/rules", icon: "⚙" },
      { label: "Audit Log", to: "/admin/audit-log", icon: "≡" },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { role, actor, roles, setRole } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [assistant, setAssistant] = useState(true);
  const [bell, setBell] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const poContext = path.startsWith("/purchase-orders/PO") ? path.split("/").pop() : undefined;
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-primary">
          Wild
        </Link>
        <span className="hidden text-xs text-muted-foreground sm:inline">Supply Automation</span>

        <div className="mx-auto hidden w-full max-w-md md:block">
          <input
            placeholder="Search a PO, SKU, supplier or shipment reference…"
            className="h-9 w-full rounded-full border border-input bg-background px-4 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <div className="relative">
            <button
              onClick={() => setBell((b) => !b)}
              className="relative flex size-9 items-center justify-center rounded-full border border-border hover:bg-muted"
              aria-label={`Notifications, ${unread} unread`}
            >
              ☍
              {unread > 0 ? (
                <span className="num absolute -top-1 -right-1 rounded-full bg-accent px-1.5 text-[10px] font-semibold text-accent-foreground">
                  {unread}
                </span>
              ) : null}
            </button>
            {bell ? <NotificationPanel onClose={() => setBell(false)} /> : null}
          </div>

          <label className="hidden items-center gap-2 rounded-full border border-dashed border-accent px-3 py-1.5 lg:flex">
            <span className="text-[10px] font-semibold tracking-wide text-accent uppercase">
              Demo: view as
            </span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="bg-transparent text-xs font-medium outline-none"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-2 rounded-full bg-muted py-1 pr-3 pl-1">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {actor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <span className="hidden text-xs sm:inline">{actor.name}</span>
          </div>

          {!assistant ? (
            <button
              onClick={() => setAssistant(true)}
              className="rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent"
            >
              ✦ Assistant
            </button>
          ) : null}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <nav
          className={cn(
            "hidden shrink-0 overflow-y-auto border-r border-border bg-card py-4 transition-all duration-200 md:block",
            collapsed ? "w-16" : "w-60",
          )}
        >
          {NAV.map((g) => (
            <div key={g.group} className="mb-5">
              {!collapsed ? (
                <div className="px-4 pb-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  {g.group}
                </div>
              ) : null}
              {g.items.map((it) => (
                <Link
                  key={it.to}
                  to={it.to}
                  title={it.label}
                  className="mx-2 flex items-center gap-3 rounded-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground aria-[current=page]:bg-primary-soft aria-[current=page]:font-medium aria-[current=page]:text-primary"
                  activeOptions={{ exact: it.to === "/" }}
                >
                  <span aria-hidden="true" className="w-4 text-center">
                    {it.icon}
                  </span>
                  {!collapsed ? <span className="flex-1 truncate">{it.label}</span> : null}
                  {!collapsed && it.badge ? (
                    <span className="num rounded-full bg-accent-soft px-1.5 text-xs font-semibold text-accent">
                      {it.badge}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          ))}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="mx-2 mt-2 rounded-full px-3 py-2 text-xs text-muted-foreground hover:bg-muted"
          >
            {collapsed ? "»" : "« Collapse"}
          </button>
        </nav>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">{children}</div>
        </main>

        <AssistantPanel
          open={assistant}
          onClose={() => setAssistant(false)}
          context={poContext}
        />
      </div>
    </div>
  );
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const today = NOTIFICATIONS.filter((n) => n.today);
  const earlier = NOTIFICATIONS.filter((n) => !n.today);
  return (
    <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl bg-popover p-3 shadow-lift">
      <div className="flex items-center justify-between pb-2">
        <span className="text-sm font-semibold">Notifications</span>
        <button className="text-xs text-primary hover:underline" onClick={onClose}>
          Mark all read
        </button>
      </div>
      {[
        { label: "Today", items: today },
        { label: "Earlier", items: earlier },
      ].map((grp) => (
        <div key={grp.label} className="mb-2">
          <div className="px-1 py-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            {grp.label}
          </div>
          {grp.items.map((n) => (
            <Link
              key={n.id}
              to={n.href}
              onClick={onClose}
              className="block rounded-lg px-2 py-2 hover:bg-muted"
            >
              <div className="flex items-center justify-between gap-2">
                <Pill tone={n.read ? "neutral" : "agent"} icon={false}>
                  {n.type}
                </Pill>
                <span className="num text-xs text-muted-foreground">{n.when}</span>
              </div>
              <div className="mt-1 text-sm">{n.title}</div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
