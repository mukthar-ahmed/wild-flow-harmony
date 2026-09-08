import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------- Button ---------- */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger" | "success" | "accent";
  size?: "sm" | "md";
};

export function Button({ variant = "outline", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft",
        variant === "accent" && "bg-accent text-accent-foreground hover:opacity-90",
        variant === "outline" && "border border-border bg-card text-foreground hover:bg-muted",
        variant === "ghost" && "text-muted-foreground hover:bg-muted hover:text-foreground",
        variant === "danger" && "bg-danger-soft text-danger hover:bg-danger hover:text-primary-foreground",
        variant === "success" && "bg-success-soft text-success hover:bg-success hover:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

/* ---------- Card ---------- */

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl bg-card shadow-soft", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
  preview,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  preview?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-3">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-2">
        {preview ? <PreviewPill /> : null}
        {right}
      </div>
    </div>
  );
}

/* ---------- Pills ---------- */

export type Tone = "neutral" | "progress" | "attention" | "success" | "blocked" | "agent";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-neutral-soft text-muted-foreground",
  progress: "bg-info-soft text-info",
  attention: "bg-warning-soft text-warning",
  success: "bg-success-soft text-success",
  blocked: "bg-danger-soft text-danger",
  agent: "bg-accent-soft text-accent",
};

const TONE_ICON: Record<Tone, string> = {
  neutral: "○",
  progress: "◐",
  attention: "▲",
  success: "✓",
  blocked: "✕",
  agent: "✦",
};

export function Pill({
  tone = "neutral",
  children,
  className,
  icon = true,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  icon?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        TONE_CLASS[tone],
        className,
      )}
    >
      {icon ? <span aria-hidden="true">{TONE_ICON[tone]}</span> : null}
      {children}
    </span>
  );
}

const PO_TONE: Record<string, Tone> = {
  Draft: "neutral",
  Validating: "progress",
  "Validation Failed": "blocked",
  "Awaiting Planner Review": "attention",
  "Pending Approval": "attention",
  Approved: "success",
  Confirmed: "success",
  "Sent to Supplier": "progress",
  "Supplier Confirmed": "success",
  "Changes Requested": "attention",
  Cancelled: "blocked",
  "Split Replicated": "neutral",
  "Draft Shipment": "neutral",
  "Freight Linked": "progress",
  "Packing List Validated": "progress",
  "ASN Sent": "progress",
  "In Transit": "progress",
  Received: "success",
  "Invoice Matched": "success",
  "Landed Cost Allocated": "success",
  Closed: "success",
  Exception: "attention",
};

export function StatusPill({ status }: { status: string }) {
  return <Pill tone={PO_TONE[status] ?? "neutral"}>{status}</Pill>;
}

export function AgentMark({ why, children }: { why: string; children?: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent"
      title={why}
    >
      <span aria-hidden="true">✦</span>
      {children ?? "Agent"}
      <span className="underline decoration-dotted">why</span>
    </span>
  );
}

export function PreviewPill() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
      title="Showing sample data. This step goes live in a later release."
    >
      Preview · not yet connected
    </span>
  );
}

export function WarningNote({ children, tone = "attention" }: { children: ReactNode; tone?: Tone }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg px-3 py-2 text-xs",
        tone === "attention" && "bg-warning-soft text-warning",
        tone === "blocked" && "bg-danger-soft text-danger",
        tone === "agent" && "bg-accent-soft text-accent",
        tone === "progress" && "bg-info-soft text-info",
      )}
    >
      <span aria-hidden="true">{tone === "blocked" ? "✕" : "▲"}</span>
      <span className="text-foreground/85">{children}</span>
    </div>
  );
}

/* ---------- Table ---------- */

export function Table({ children, dense }: { children: ReactNode; dense?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          "w-full border-collapse text-left text-sm",
          dense ? "[&_td]:py-2 [&_th]:py-2" : "[&_td]:py-3.5 [&_th]:py-3",
        )}
      >
        {children}
      </table>
    </div>
  );
}

export function TH({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "sticky top-0 z-10 bg-card px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TD({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("border-t border-border px-4 align-middle", className)}>{children}</td>;
}

/* ---------- Misc ---------- */

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-4">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{children}</h1>
      {sub ? <p className="mt-1 text-sm text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary-soft text-xl text-primary">
        ✓
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
      {action}
    </div>
  );
}

export function Field({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div>
      <div className="text-xs tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="num mt-1 text-sm font-medium">{value}</div>
      {hint ? <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

export function Bar({ pct, tone = "primary" }: { pct: number; tone?: "primary" | "warning" }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-soft">
      <div
        className={cn("h-full rounded-full", tone === "primary" ? "bg-primary" : "bg-warning")}
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-full bg-muted p-1">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          aria-pressed={value === o}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-medium",
            value === o
              ? "bg-card text-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "num h-10 w-full rounded-full border border-input bg-card px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-full border border-input bg-card px-4 text-sm outline-none focus:border-primary",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {children}
      {required ? <span className="text-danger"> *</span> : null}
    </label>
  );
}
