import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { PEOPLE, ROLES, type Person, type Role } from "./mock-data";

type SessionValue = {
  role: Role;
  actor: Person;
  setRole: (r: Role) => void;
  roles: Role[];
  decided: Set<string>;
  markDecided: (ref: string) => void;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("Supply Planner");
  const [decided, setDecided] = useState<Set<string>>(new Set());

  const value = useMemo<SessionValue>(
    () => ({
      role,
      actor: PEOPLE.find((p) => p.role === role) ?? PEOPLE[0],
      setRole,
      roles: ROLES,
      decided,
      markDecided: (ref: string) => setDecided((prev) => new Set(prev).add(ref)),
    }),
    [role, decided],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
