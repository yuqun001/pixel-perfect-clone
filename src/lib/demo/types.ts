export type Role =
  | "guest"
  | "registered"
  | "company_owner"
  | "buyer"
  | "sales"
  | "service"
  | "product_admin"
  | "order_admin"
  | "finance"
  | "admin";

export const ROLE_LABEL: Record<Role, string> = {
  guest: "游客",
  registered: "普通注册用户",
  company_owner: "企业主账号",
  buyer: "企业采购人员",
  sales: "销售人员",
  service: "客服人员",
  product_admin: "产品管理员",
  order_admin: "订单管理员",
  finance: "财务人员",
  admin: "系统管理员",
};

export type CompanyStatus =
  | "draft"
  | "pending"
  | "need_more"
  | "approved"
  | "rejected"
  | "awaiting_payment"
  | "active"
  | "expired"
  | "suspended";

export const COMPANY_STATUS_LABEL: Record<CompanyStatus, string> = {
  draft: "待提交",
  pending: "待审核",
  need_more: "补充资料",
  approved: "审核通过",
  rejected: "审核驳回",
  awaiting_payment: "待缴费",
  active: "已生效",
  expired: "已过期",
  suspended: "已暂停",
};

export type OrderStatus =
  | "draft"
  | "pending_approval"
  | "pending_confirm"
  | "pending_payment"
  | "paid"
  | "preparing"
  | "shipped"
  | "received"
  | "completed"
  | "cancelled"
  | "after_sales"
  | "refunded";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  draft: "草稿",
  pending_approval: "待审核",
  pending_confirm: "待确认",
  pending_payment: "待付款",
  paid: "已付款",
  preparing: "备货中",
  shipped: "已发货",
  received: "已收货",
  completed: "已完成",
  cancelled: "已取消",
  after_sales: "售后处理中",
  refunded: "已退款",
};

export type AfterSaleStatus =
  | "submitted"
  | "reviewing"
  | "need_more"
  | "approved"
  | "processing"
  | "resent"
  | "refunded"
  | "completed"
  | "rejected";

export const AFTER_SALE_STATUS_LABEL: Record<AfterSaleStatus, string> = {
  submitted: "待审核",
  reviewing: "检测中",
  need_more: "补充资料",
  approved: "审核通过",
  processing: "处理中",
  resent: "已补发",
  refunded: "已退款",
  completed: "已完成",
  rejected: "已驳回",
};

export type Visibility = "public" | "login" | "approved" | "member" | "assigned";

export const VISIBILITY_LABEL: Record<Visibility, string> = {
  public: "公开可见",
  login: "登录可见",
  approved: "审核客户可见",
  member: "会员可见",
  assigned: "指定企业可见",
};

export type SupplyStatus = "in_stock" | "out_of_stock" | "quote_only" | "lead_time";

export const SUPPLY_STATUS_LABEL: Record<SupplyStatus, string> = {
  in_stock: "有货",
  out_of_stock: "缺货",
  quote_only: "需询价",
  lead_time: "预计交期",
};

export interface Category {
  id: string;
  name: string;
  code: string;
  description: string;
  productCount: number;
}

export interface ProductDocument {
  id: string;
  name: string;
  type: "说明书" | "注册证" | "检验报告" | "合格证" | "灭菌证明" | "材料证明" | "生产许可证";
  version: string;
  validUntil: string;
  visibility: Visibility;
  downloadable: boolean;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  sku: string;
  categoryId: string;
  brand: string;
  model: string;
  spec: string;
  material: string;
  size: string;
  unit: string;
  packing: string;
  moq: number;
  department: string;
  scene: string;
  listPrice: number;
  nonMemberPrice: number;
  memberPrice: number;
  tierPrices: { minQty: number; price: number }[];
  supply: SupplyStatus;
  leadTime: string;
  quoteOnly: boolean;
  status: "on" | "off";
  visibility: Visibility;
  description: string;
  usage: string;
  caution: string;
  storage: string;
  shelfLife: string;
  afterSales: string;
  image: string;
  documents: ProductDocument[];
  views: number;
}

export interface Company {
  id: string;
  name: string;
  creditCode: string;
  type: string;
  contact: string;
  phone: string;
  address: string;
  shipAddress: string;
  invoiceTitle: string;
  status: CompanyStatus;
  salesId: string;
  level: "普通" | "银牌" | "金牌";
  membershipEnd: string;
  membershipStart: string;
  plan: string;
  points: number;
  totalAmount: number;
  lastOrderAt: string;
  tags: string[];
  note: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  companyId?: string;
  canSeePrice: boolean;
  canUsePoints: boolean;
  needApproval: boolean;
  active: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  code: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  no: string;
  companyId: string;
  buyerId: string;
  items: OrderItem[];
  amount: number;
  status: OrderStatus;
  address: string;
  contact: string;
  payMethod: string;
  invoice: string;
  note: string;
  trackingNo?: string;
  carrier?: string;
  createdAt: string;
  logs: { at: string; by: string; action: string }[];
}

export interface Quote {
  id: string;
  no: string;
  companyId: string;
  productId: string;
  qty: number;
  requirement: string;
  status: "待报价" | "已报价" | "已接受" | "已拒绝" | "已转订单";
  price?: number;
  salesId: string;
  createdAt: string;
}

export interface PointTx {
  id: string;
  companyId: string;
  type: "订单赠送" | "续费赠送" | "活动赠送" | "兑换扣减" | "退款回收" | "人工调整" | "过期";
  amount: number;
  balance: number;
  note: string;
  createdAt: string;
}

export interface PointProduct {
  id: string;
  name: string;
  category: "饮品" | "食品" | "日用品" | "礼品";
  points: number;
  stock: number;
  limit: number;
  image: string;
  status: "on" | "off";
}

export interface PointOrder {
  id: string;
  no: string;
  companyId: string;
  productId: string;
  qty: number;
  points: number;
  status: "待发货" | "已发货" | "已完成";
  address: string;
  createdAt: string;
}

export interface SourcingRequest {
  id: string;
  no: string;
  companyId: string;
  productName: string;
  brand: string;
  spec: string;
  qty: number;
  budget: number;
  expectedAt: string;
  status: "待受理" | "询价中" | "已报价" | "客户确认" | "采购中" | "已完成" | "已取消";
  quotedPrice?: number;
  progress: { at: string; text: string }[];
  createdAt: string;
}

export interface AfterSale {
  id: string;
  no: string;
  companyId: string;
  orderId: string;
  type: "退货" | "换货" | "补发" | "质量问题";
  reason: string;
  status: AfterSaleStatus;
  createdAt: string;
  logs: { at: string; text: string }[];
}

export interface FollowUp {
  id: string;
  companyId: string;
  salesId: string;
  type: "电话" | "拜访" | "微信" | "续费" | "复购";
  content: string;
  nextAt: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  role: Role;
  action: string;
  target: string;
  ip: string;
  createdAt: string;
}

export interface AccessLog {
  id: string;
  companyId: string;
  user: string;
  productId: string;
  action: "查看详情" | "预览文件" | "下载文件";
  createdAt: string;
}

export interface MessageItem {
  id: string;
  companyId: string;
  title: string;
  body: string;
  kind: "订单" | "会员" | "积分" | "售后" | "系统";
  read: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  level: "普通" | "银牌" | "金牌";
  discount: string;
  benefits: string[];
}

export interface Payment {
  id: string;
  no: string;
  companyId: string;
  kind: "会员费" | "订单货款" | "退款";
  amount: number;
  method: "在线支付" | "对公转账";
  status: "待确认" | "已确认" | "已退款";
  invoice: "未申请" | "已申请" | "已开具";
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  status: "on" | "off";
}

export interface DemoDB {
  categories: Category[];
  products: Product[];
  companies: Company[];
  users: UserAccount[];
  orders: Order[];
  quotes: Quote[];
  pointTxs: PointTx[];
  pointProducts: PointProduct[];
  pointOrders: PointOrder[];
  sourcing: SourcingRequest[];
  afterSales: AfterSale[];
  followUps: FollowUp[];
  auditLogs: AuditLog[];
  accessLogs: AccessLog[];
  messages: MessageItem[];
  carts: Record<string, CartItem[]>;
  plans: MembershipPlan[];
  payments: Payment[];
  banners: Banner[];
}
