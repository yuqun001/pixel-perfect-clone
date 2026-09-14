import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox, type LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const toneCls = {
    default: "bg-info/10 text-info",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    danger: "bg-destructive/10 text-destructive",
  }[tone];
  return (
    <Card className="flex flex-row items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {Icon ? (
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", toneCls)}>
          <Icon className="size-5" />
        </span>
      ) : null}
    </Card>
  );
}

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClass: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-transparent",
  success: "bg-success/15 text-success border-transparent",
  warning: "bg-warning/20 text-warning-foreground border-transparent",
  danger: "bg-destructive/10 text-destructive border-transparent",
  info: "bg-info/10 text-info border-transparent",
};

export function StatusPill({ label, tone = "neutral" }: { label: string; tone?: Tone }) {
  return (
    <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 font-medium", toneClass[tone])}>
      {label}
    </Badge>
  );
}

export function toneForStatus(status: string): Tone {
  if (["已生效", "已完成", "已付款", "已收货", "已确认", "有货", "已接受", "已开具", "on"].includes(status))
    return "success";
  if (
    ["待审核", "待缴费", "补充资料", "待付款", "待确认", "备货中", "待报价", "待发货", "预计交期", "已申请", "待受理", "询价中", "处理中", "检测中"].includes(
      status,
    )
  )
    return "warning";
  if (["已过期", "审核驳回", "已取消", "已暂停", "缺货", "已驳回", "已退款", "异常订单"].includes(status))
    return "danger";
  if (["已发货", "已报价", "需询价", "审核通过", "已转订单", "售后处理中"].includes(status)) return "info";
  return "neutral";
}

export function EmptyState({
  title = "暂无数据",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="size-6" />
      </span>
      <div>
        <p className="font-medium">{title}</p>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function LoadingRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 overflow-hidden p-0", className)}>
      {title ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5">
          <div>
            <h2 className="text-sm font-semibold sm:text-base">{title}</h2>
            {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}
      <div className="p-4 sm:p-5">{children}</div>
    </Card>
  );
}

export function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium break-words">{value ?? "—"}</p>
    </div>
  );
}

export function LockedHint({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed bg-muted/60 px-4 py-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
