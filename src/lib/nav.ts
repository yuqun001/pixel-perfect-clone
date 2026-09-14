import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  Bell,
  Boxes,
  Building2,
  ClipboardList,
  Coins,
  CreditCard,
  FileText,
  Gift,
  Headphones,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Package,
  PackageSearch,
  Repeat,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Tags,
  Truck,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react";
import type { Role } from "./demo/types";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const buyerNav: NavGroup[] = [
  {
    title: "采购",
    items: [
      { to: "/buyer/dashboard", label: "采购工作台", icon: LayoutDashboard },
      { to: "/buyer/products", label: "产品目录", icon: Package },
      { to: "/buyer/cart", label: "购物车", icon: ShoppingCart },
      { to: "/buyer/orders", label: "我的订单", icon: ClipboardList },
      { to: "/buyer/reorder", label: "常购与再次采购", icon: Repeat },
      { to: "/buyer/quotes", label: "询价与报价", icon: FileText },
    ],
  },
  {
    title: "服务",
    items: [
      { to: "/buyer/points", label: "积分账户", icon: Coins },
      { to: "/buyer/points/mall", label: "积分商城", icon: Gift },
      { to: "/buyer/points/orders", label: "兑换订单", icon: PackageSearch },
      { to: "/buyer/sourcing", label: "代采需求", icon: Boxes },
      { to: "/buyer/after-sales", label: "售后服务", icon: LifeBuoy },
      { to: "/buyer/messages", label: "消息中心", icon: MessageSquare },
    ],
  },
  {
    title: "账户",
    items: [
      { to: "/buyer/company", label: "企业资料", icon: Building2 },
      { to: "/buyer/membership", label: "会员中心", icon: BadgeCheck },
      { to: "/buyer/settings", label: "账号设置", icon: Settings },
    ],
  },
];

export const salesNav: NavGroup[] = [
  {
    title: "客户经营",
    items: [
      { to: "/sales/dashboard", label: "销售工作台", icon: LayoutDashboard },
      { to: "/sales/customers", label: "我的客户", icon: Users },
      { to: "/sales/follow-ups", label: "跟进记录", icon: ClipboardList },
      { to: "/sales/renewals", label: "续费提醒", icon: BadgeCheck },
      { to: "/sales/reorders", label: "复购提醒", icon: Repeat },
    ],
  },
  {
    title: "业务",
    items: [
      { to: "/sales/quotes", label: "询价报价", icon: FileText },
      { to: "/sales/orders", label: "客户订单", icon: ShoppingCart },
      { to: "/sales/after-sales", label: "售后跟进", icon: LifeBuoy },
      { to: "/sales/reports", label: "销售统计", icon: BarChart3 },
    ],
  },
];

export const adminNav: NavGroup[] = [
  {
    title: "概览",
    items: [
      { to: "/admin/dashboard", label: "经营数据看板", icon: LayoutDashboard },
      { to: "/admin/reports", label: "经营分析", icon: BarChart3 },
    ],
  },
  {
    title: "客户与会员",
    items: [
      { to: "/admin/users", label: "用户管理", icon: Users },
      { to: "/admin/companies", label: "企业管理", icon: Building2 },
      { to: "/admin/memberships", label: "会员管理", icon: BadgeCheck },
      { to: "/admin/sales", label: "销售与客户绑定", icon: UserCog },
    ],
  },
  {
    title: "商品",
    items: [
      { to: "/admin/products", label: "产品管理", icon: Package },
      { to: "/admin/categories", label: "产品分类", icon: Tags },
      { to: "/admin/product-documents", label: "说明书与资质", icon: FileText },
      { to: "/admin/prices", label: "价格与折扣", icon: CreditCard },
      { to: "/admin/inventory", label: "库存与供应", icon: Warehouse },
    ],
  },
  {
    title: "交易",
    items: [
      { to: "/admin/orders", label: "订单管理", icon: ClipboardList },
      { to: "/admin/shipments", label: "发货与物流", icon: Truck },
      { to: "/admin/after-sales", label: "售后管理", icon: Headphones },
      { to: "/admin/sourcing", label: "代采管理", icon: Boxes },
      { to: "/admin/finance", label: "财务与发票", icon: CreditCard },
    ],
  },
  {
    title: "运营",
    items: [
      { to: "/admin/points", label: "积分规则与账户", icon: Coins },
      { to: "/admin/points/mall", label: "积分商品", icon: Gift },
      { to: "/admin/content", label: "内容运营", icon: FileText },
      { to: "/admin/notifications", label: "消息与通知", icon: Bell },
    ],
  },
  {
    title: "系统",
    items: [
      { to: "/admin/roles", label: "角色权限", icon: ShieldCheck },
      { to: "/admin/audit-logs", label: "操作与访问日志", icon: Activity },
      { to: "/admin/settings", label: "系统设置", icon: Settings },
    ],
  },
];

export function homeForRole(role: Role): string {
  switch (role) {
    case "buyer":
    case "company_owner":
      return "/buyer/dashboard";
    case "sales":
      return "/sales/dashboard";
    case "admin":
    case "product_admin":
    case "order_admin":
    case "finance":
    case "service":
      return "/admin/dashboard";
    case "registered":
      return "/register/company";
    default:
      return "/";
  }
}

export const buyerRoles: Role[] = ["buyer", "company_owner"];
export const adminRoles: Role[] = ["admin", "product_admin", "order_admin", "finance", "service"];
