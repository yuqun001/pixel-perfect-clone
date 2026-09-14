import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createSeed } from "./seed";
import type { Company, DemoDB, Product, Role, UserAccount, Visibility } from "./types";

const DB_KEY = "medmart.db.v1";
const SESSION_KEY = "medmart.session.v1";

interface Ctx {
  db: DemoDB;
  hydrated: boolean;
  update: (fn: (draft: DemoDB) => void) => void;
  reset: () => void;
  session: UserAccount | null;
  signIn: (userId: string) => void;
  signOut: () => void;
  role: Role;
  company: Company | null;
  isMember: boolean;
  canViewFull: (p: Product) => boolean;
  canViewPrice: boolean;
  canDownload: boolean;
  visibilityAllowed: (v: Visibility) => boolean;
}

const DemoContext = createContext<Ctx | null>(null);

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DemoDB>(() => createSeed());
  const [userId, setUserId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) setDb(JSON.parse(raw) as DemoDB);
      const s = localStorage.getItem(SESSION_KEY);
      if (s) setUserId(s);
    } catch {
      /* 忽略损坏的本地数据 */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
      /* 存储不可用时仅保留内存数据 */
    }
  }, [db, hydrated]);

  const update = useCallback((fn: (draft: DemoDB) => void) => {
    setDb((prev) => {
      const draft = clone(prev);
      fn(draft);
      return draft;
    });
  }, []);

  const reset = useCallback(() => {
    setDb(createSeed());
    setUserId(null);
    try {
      localStorage.removeItem(DB_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const signIn = useCallback((id: string) => {
    setUserId(id);
    try {
      localStorage.setItem(SESSION_KEY, id);
    } catch {
      /* noop */
    }
  }, []);

  const signOut = useCallback(() => {
    setUserId(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const value = useMemo<Ctx>(() => {
    const session = db.users.find((u) => u.id === userId) ?? null;
    const role: Role = session?.role ?? "guest";
    const company = session?.companyId ? (db.companies.find((c) => c.id === session.companyId) ?? null) : null;
    const isMember = company?.status === "active";
    const isStaff = ["admin", "product_admin", "order_admin", "finance", "service", "sales"].includes(role);
    const approved = isMember || company?.status === "approved" || company?.status === "awaiting_payment";

    const visibilityAllowed = (v: Visibility) => {
      if (isStaff) return true;
      if (v === "public") return true;
      if (v === "login") return !!session;
      if (v === "approved") return !!approved;
      return isMember;
    };

    const canViewPrice = isStaff || (isMember && (session?.canSeePrice ?? true));

    return {
      db,
      hydrated,
      update,
      reset,
      session,
      signIn,
      signOut,
      role,
      company,
      isMember: !!isMember,
      canViewFull: (p: Product) => visibilityAllowed(p.visibility) && (isStaff || isMember),
      canViewPrice,
      canDownload: isStaff || !!isMember,
      visibilityAllowed,
    };
  }, [db, userId, hydrated, update, reset, signIn, signOut]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo 必须在 DemoProvider 内使用");
  return ctx;
}

export function useCart() {
  const { db, update, company } = useDemo();
  const key = company?.id ?? "guest";
  const items = db.carts[key] ?? [];
  return {
    items,
    add: (productId: string, qty: number) =>
      update((d) => {
        const list = d.carts[key] ?? (d.carts[key] = []);
        const hit = list.find((i) => i.productId === productId);
        if (hit) hit.qty += qty;
        else list.push({ productId, qty });
      }),
    setQty: (productId: string, qty: number) =>
      update((d) => {
        const list = d.carts[key] ?? [];
        const hit = list.find((i) => i.productId === productId);
        if (hit) hit.qty = Math.max(1, qty);
      }),
    remove: (productId: string) =>
      update((d) => {
        d.carts[key] = (d.carts[key] ?? []).filter((i) => i.productId !== productId);
      }),
    clear: () =>
      update((d) => {
        d.carts[key] = [];
      }),
  };
}

export const money = (n: number) =>
  `¥${n.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const dateOf = (s: string) => (s ? s.slice(0, 10) : "—");

export const daysLeft = (end: string) => {
  if (!end) return 0;
  return Math.ceil((new Date(end).getTime() - Date.now()) / 86400000);
};
