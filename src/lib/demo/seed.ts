import type {
  AfterSale,
  AuditLog,
  AccessLog,
  Banner,
  Category,
  Company,
  DemoDB,
  FollowUp,
  MembershipPlan,
  MessageItem,
  Order,
  OrderStatus,
  Payment,
  PointOrder,
  PointProduct,
  PointTx,
  Product,
  ProductDocument,
  Quote,
  SourcingRequest,
  UserAccount,
} from "./types";

const day = 86400000;
const now = Date.now();
const iso = (offsetDays: number) => new Date(now + offsetDays * day).toISOString();
const dstr = (offsetDays: number) => iso(offsetDays).slice(0, 10);

export const categories: Category[] = [
  { id: "c1", name: "剪刀类", code: "SCISSORS", description: "手术剪、组织剪、拆线剪等", productCount: 0 },
  { id: "c2", name: "镊子类", code: "FORCEPS", description: "有齿镊、无齿镊、显微镊等", productCount: 0 },
  { id: "c3", name: "钳子类", code: "CLAMPS", description: "止血钳、持针钳、组织钳等", productCount: 0 },
  { id: "c4", name: "手术器械", code: "SURGICAL", description: "拉钩、刀柄、吸引器等", productCount: 0 },
  { id: "c5", name: "医疗耗材", code: "CONSUM", description: "敷料、缝合线、一次性用品", productCount: 0 },
  { id: "c6", name: "灭菌与防护", code: "STERILE", description: "灭菌盒、防护用品、包装材料", productCount: 0 },
];

const brands = ["瑞康医疗", "泰林器械", "康华", "德迈", "安捷"];
const materials = ["医用不锈钢 420", "医用不锈钢 410", "钛合金", "医用 PP", "无纺布"];
const departments = ["普外科", "骨科", "妇产科", "口腔科", "眼科", "急诊科"];

const productNames: Record<string, string[]> = {
  c1: ["手术直剪", "组织弯剪", "眼科精细剪", "拆线剪", "纱布剪"],
  c2: ["有齿镊", "无齿镊", "显微镊", "敷料镊", "眼科镊"],
  c3: ["蚊式止血钳", "弯止血钳", "持针钳", "组织钳", "巾钳"],
  c4: ["甲状腺拉钩", "手术刀柄", "吸引器头", "皮肤牵开器"],
  c5: ["一次性手术包", "医用纱布块", "可吸收缝合线", "无菌敷贴", "一次性手术衣"],
  c6: ["器械灭菌盒", "灭菌指示卡", "医用防护面屏"],
};

function docsFor(name: string, i: number): ProductDocument[] {
  const base: ProductDocument["type"][] = ["说明书", "注册证", "检验报告", "合格证", "灭菌证明"];
  return base.map((t, k) => ({
    id: `doc-${i}-${k}`,
    name: `${name} ${t}`,
    type: t,
    version: `V${1 + (k % 3)}.${i % 5}`,
    validUntil: dstr(365 + i * 3),
    visibility: t === "说明书" ? "approved" : "member",
    downloadable: t !== "注册证",
    }));
}

export const products: Product[] = (() => {
  const list: Product[] = [];
  let i = 0;
  for (const cat of categories) {
    for (const base of productNames[cat.id]) {
      i += 1;
      const listPrice = 60 + i * 17;
      const product: Product = {
        id: `p${i}`,
        name: `${base} ${140 + i}mm`,
        code: `MP-${1000 + i}`,
        sku: `${cat.code}-${100 + i}`,
        categoryId: cat.id,
        brand: brands[i % brands.length],
        model: `${cat.code.slice(0, 3)}-${200 + i}`,
        spec: `${140 + i}mm / 单支装`,
        material: materials[i % materials.length],
        size: `${140 + i} × ${20 + (i % 10)} mm`,
        unit: i % 4 === 0 ? "盒" : "支",
        packing: i % 4 === 0 ? "50 支/盒" : "10 支/盒",
        moq: i % 3 === 0 ? 10 : 5,
        department: departments[i % departments.length],
        scene: i % 2 === 0 ? "手术室" : "门诊处置",
        listPrice,
        nonMemberPrice: Math.round(listPrice * 0.95),
        memberPrice: Math.round(listPrice * 0.82),
        tierPrices: [
          { minQty: 10, price: Math.round(listPrice * 0.8) },
          { minQty: 50, price: Math.round(listPrice * 0.75) },
          { minQty: 200, price: Math.round(listPrice * 0.7) },
        ],
        supply: (["in_stock", "in_stock", "lead_time", "quote_only", "out_of_stock"] as const)[i % 5],
        leadTime: i % 5 === 2 ? "预计 7 个工作日" : "现货 48 小时内发出",
        quoteOnly: i % 7 === 0,
        status: "on",
        visibility: i % 6 === 0 ? "public" : i % 5 === 0 ? "approved" : "member",
        description: `${base}采用${materials[i % materials.length]}整体锻造，刃口精密研磨，适用于${departments[i % departments.length]}常规手术与处置操作。`,
        usage: "使用前确认包装完整并在有效期内，按院感规范清洗、润滑与高压蒸汽灭菌后使用。",
        caution: "禁止用于非医疗用途；出现刃口卷曲、锈斑、闭合不良时立即停用并更换。",
        storage: "阴凉干燥、通风、无腐蚀性气体环境，相对湿度不超过 80%。",
        shelfLife: i % 2 === 0 ? "灭菌有效期 3 年" : "器械类无限制，灭菌后 7 天内使用",
        afterSales: "非人为质量问题 12 个月内免费更换，支持批次追溯。",
        image: `https://picsum.photos/seed/med${i}/600/450`,
        documents: docsFor(base, i),
        views: 30 + ((i * 37) % 400),
      };
      list.push(product);
    }
  }
  return list;
})();

categories.forEach((c) => {
  c.productCount = products.filter((p) => p.categoryId === c.id).length;
});

export const plans: MembershipPlan[] = [
  {
    id: "plan1",
    name: "标准年度会员",
    price: 3800,
    level: "普通",
    discount: "会员价约 8.2 折",
    benefits: ["完整产品资料", "会员价格", "在线采购", "采购积分", "标准售后"],
  },
  {
    id: "plan2",
    name: "银牌年度会员",
    price: 8800,
    level: "银牌",
    discount: "会员价约 7.8 折",
    benefits: ["标准会员全部权益", "专属折扣", "代采服务", "专属客服", "积分 1.2 倍"],
  },
  {
    id: "plan3",
    name: "金牌年度会员",
    price: 18800,
    level: "金牌",
    discount: "会员价约 7.2 折",
    benefits: ["银牌全部权益", "优先供货", "一对一采购顾问", "年度资料培训", "积分 1.5 倍"],
  },
];

const salesNames = ["李维", "陈静", "王海涛", "赵倩", "孙磊", "周敏"];
export const salesUsers: UserAccount[] = salesNames.map((n, i) => ({
  id: `s${i + 1}`,
  name: n,
  email: `sales${i + 1}@medmart.cn`,
  phone: `1380000${1000 + i}`,
  role: "sales",
  canSeePrice: true,
  canUsePoints: false,
  needApproval: false,
  active: true,
  createdAt: iso(-400 + i * 10),
}));

const companyNames = [
  "仁和民营医院",
  "康宁口腔连锁诊所",
  "同德综合门诊部",
  "明视眼科医院",
  "安馨妇产医院",
  "骨康骨科医院",
  "新城社区医疗中心",
  "惠民医疗器械服务中心",
];

const companyStatuses: Company["status"][] = [
  "active",
  "active",
  "pending",
  "active",
  "awaiting_payment",
  "expired",
  "active",
  "need_more",
];

export const companies: Company[] = companyNames.map((name, i) => ({
  id: `co${i + 1}`,
  name,
  creditCode: `9134010${String(10000000 + i * 137).slice(0, 8)}X${i}`,
  type: i % 3 === 0 ? "民营医院" : i % 3 === 1 ? "连锁诊所" : "门诊部",
  contact: ["张敏", "刘洋", "吴强", "何雪", "郑凯", "林芳", "许洋", "程亮"][i],
  phone: `1390000${2000 + i}`,
  address: ["上海市浦东新区", "杭州市西湖区", "南京市鼓楼区", "苏州市工业园区", "合肥市蜀山区", "宁波市鄞州区", "无锡市新吴区", "常州市天宁区"][i] + "健康路 " + (10 + i) + " 号",
  shipAddress: `${["上海", "杭州", "南京", "苏州", "合肥", "宁波", "无锡", "常州"][i]}市 ${name} 采购部收`,
  invoiceTitle: name,
  status: companyStatuses[i],
  salesId: salesUsers[i % salesUsers.length].id,
  level: i % 3 === 0 ? "金牌" : i % 3 === 1 ? "银牌" : "普通",
  membershipStart: dstr(-300 + i * 10),
  membershipEnd: dstr([65, 220, 0, 12, 0, -30, 340, 0][i]),
  plan: plans[i % 3].name,
  points: [12400, 6800, 0, 2300, 0, 500, 9100, 0][i],
  totalAmount: [286000, 142000, 0, 52000, 0, 31000, 198000, 0][i],
  lastOrderAt: dstr(-[3, 12, 0, 45, 0, 120, 6, 0][i]),
  tags: [["重点客户", "高复购"], ["连锁"], ["新客"], ["需跟进"], ["待缴费"], ["流失风险"], ["重点客户"], ["资料待补"]][i],
  note: "",
  createdAt: iso(-320 + i * 12),
}));

export const buyerUsers: UserAccount[] = Array.from({ length: 12 }).map((_, i) => {
  const co = companies[i % companies.length];
  const owner = i < companies.length;
  return {
    id: `b${i + 1}`,
    name: ["张敏", "刘洋", "吴强", "何雪", "郑凯", "林芳", "许洋", "程亮", "苏晴", "马俊", "范宁", "高翔"][i],
    email: `buyer${i + 1}@${co.id}.cn`,
    phone: `1370000${3000 + i}`,
    role: owner ? "company_owner" : "buyer",
    companyId: co.id,
    canSeePrice: i % 5 !== 4,
    canUsePoints: i % 3 !== 2,
    needApproval: i % 4 === 0,
    active: i !== 10,
    createdAt: iso(-280 + i * 9),
  };
});

export const staffUsers: UserAccount[] = [
  { id: "a1", name: "系统管理员", email: "admin@medmart.cn", phone: "13600000001", role: "admin", canSeePrice: true, canUsePoints: false, needApproval: false, active: true, createdAt: iso(-500) },
  { id: "a2", name: "产品管理员 郭琳", email: "product@medmart.cn", phone: "13600000002", role: "product_admin", canSeePrice: true, canUsePoints: false, needApproval: false, active: true, createdAt: iso(-480) },
  { id: "a3", name: "订单管理员 沈涛", email: "order@medmart.cn", phone: "13600000003", role: "order_admin", canSeePrice: true, canUsePoints: false, needApproval: false, active: true, createdAt: iso(-470) },
  { id: "a4", name: "财务 韩雪", email: "finance@medmart.cn", phone: "13600000004", role: "finance", canSeePrice: true, canUsePoints: false, needApproval: false, active: true, createdAt: iso(-460) },
  { id: "a5", name: "客服 邱月", email: "service@medmart.cn", phone: "13600000005", role: "service", canSeePrice: true, canUsePoints: false, needApproval: false, active: true, createdAt: iso(-450) },
  { id: "u1", name: "王琦（未认证）", email: "new@clinic.cn", phone: "13600000006", role: "registered", canSeePrice: false, canUsePoints: false, needApproval: false, active: true, createdAt: iso(-4) },
];

const orderStatuses: OrderStatus[] = [
  "pending_payment",
  "preparing",
  "shipped",
  "completed",
  "after_sales",
  "pending_approval",
  "completed",
  "cancelled",
  "paid",
  "received",
  "completed",
  "pending_confirm",
];

export const orders: Order[] = orderStatuses.map((status, i) => {
  const co = companies[i % companies.length];
  const buyer = buyerUsers[i % buyerUsers.length];
  const items = [products[(i * 3) % products.length], products[(i * 5 + 1) % products.length]].map((p) => ({
    productId: p.id,
    name: p.name,
    code: p.code,
    qty: 10 + ((i * 7) % 40),
    price: p.memberPrice,
  }));
  const amount = items.reduce((s, it) => s + it.qty * it.price, 0);
  return {
    id: `o${i + 1}`,
    no: `PO${dstr(-i * 3).replace(/-/g, "")}${100 + i}`,
    companyId: co.id,
    buyerId: buyer.id,
    items,
    amount,
    status,
    address: co.shipAddress,
    contact: `${co.contact} ${co.phone}`,
    payMethod: i % 2 === 0 ? "对公转账" : "在线支付",
    invoice: "增值税专用发票 / " + co.invoiceTitle,
    note: i % 3 === 0 ? "请随货提供批次合格证" : "",
    trackingNo: status === "shipped" || status === "received" || status === "completed" ? `SF${900000000 + i}` : undefined,
    carrier: status === "shipped" || status === "received" || status === "completed" ? "顺丰速运" : undefined,
    createdAt: iso(-i * 3 - 1),
    logs: [
      { at: iso(-i * 3 - 1), by: buyer.name, action: "提交订单" },
      { at: iso(-i * 3 - 0.8), by: "订单管理员 沈涛", action: "订单确认" },
    ],
  };
});

export const quotes: Quote[] = Array.from({ length: 6 }).map((_, i) => {
  const co = companies[i % companies.length];
  const p = products[(i * 4) % products.length];
  return {
    id: `q${i + 1}`,
    no: `RFQ${dstr(-i * 4).replace(/-/g, "")}${10 + i}`,
    companyId: co.id,
    productId: p.id,
    qty: 100 + i * 50,
    requirement: "需提供批次检验报告，含税含运。",
    status: (["待报价", "已报价", "已接受", "待报价", "已转订单", "已拒绝"] as const)[i],
    price: i % 2 === 1 ? Math.round(p.memberPrice * 0.92) : undefined,
    salesId: co.salesId,
    createdAt: iso(-i * 4 - 2),
  };
});

export const pointProducts: PointProduct[] = [
  { id: "pp1", name: "农夫山泉整箱 12×1.5L", category: "饮品", points: 800, stock: 120, limit: 5, image: "https://picsum.photos/seed/gift1/400/300", status: "on" },
  { id: "pp2", name: "精品挂耳咖啡礼盒", category: "饮品", points: 1500, stock: 80, limit: 3, image: "https://picsum.photos/seed/gift2/400/300", status: "on" },
  { id: "pp3", name: "五常大米 10kg", category: "食品", points: 2600, stock: 60, limit: 2, image: "https://picsum.photos/seed/gift3/400/300", status: "on" },
  { id: "pp4", name: "医用级抽纸 24 包", category: "日用品", points: 1200, stock: 150, limit: 6, image: "https://picsum.photos/seed/gift4/400/300", status: "on" },
  { id: "pp5", name: "中秋月饼礼盒", category: "礼品", points: 3200, stock: 40, limit: 2, image: "https://picsum.photos/seed/gift5/400/300", status: "on" },
  { id: "pp6", name: "保温杯商务套装", category: "礼品", points: 4200, stock: 25, limit: 1, image: "https://picsum.photos/seed/gift6/400/300", status: "on" },
];

export const pointTxs: PointTx[] = (() => {
  const list: PointTx[] = [];
  companies.forEach((co, ci) => {
    let balance = 0;
    const seeds: [PointTx["type"], number, string][] = [
      ["续费赠送", 2000, "年度会员续费赠送"],
      ["订单赠送", 3600, "订单完成按 1% 赠送"],
      ["活动赠送", 800, "季度采购活动"],
      ["兑换扣减", -1200, "积分商城兑换"],
      ["订单赠送", 2400, "订单完成按 1% 赠送"],
    ];
    seeds.forEach(([type, amount, note], i) => {
      if (co.points === 0 && i > 1) return;
      balance += amount;
      list.push({
        id: `pt-${co.id}-${i}`,
        companyId: co.id,
        type,
        amount,
        balance,
        note,
        createdAt: iso(-60 + i * 9 - ci),
      });
    });
  });
  return list;
})();

export const pointOrders: PointOrder[] = [
  { id: "po1", no: "PT20260101001", companyId: "co1", productId: "pp1", qty: 2, points: 1600, status: "已完成", address: companies[0].shipAddress, createdAt: iso(-25) },
  { id: "po2", no: "PT20260112002", companyId: "co2", productId: "pp4", qty: 1, points: 1200, status: "已发货", address: companies[1].shipAddress, createdAt: iso(-12) },
  { id: "po3", no: "PT20260120003", companyId: "co1", productId: "pp5", qty: 1, points: 3200, status: "待发货", address: companies[0].shipAddress, createdAt: iso(-3) },
];

export const sourcing: SourcingRequest[] = [
  {
    id: "sr1",
    no: "SR2026001",
    companyId: "co1",
    productName: "腹腔镜专用抓钳",
    brand: "进口品牌优先",
    spec: "5mm × 330mm",
    qty: 20,
    budget: 68000,
    expectedAt: dstr(30),
    status: "已报价",
    quotedPrice: 62500,
    progress: [
      { at: iso(-10), text: "需求已受理，分配采购顾问" },
      { at: iso(-6), text: "完成 3 家供应商询价" },
      { at: iso(-2), text: "已向客户提交报价" },
    ],
    createdAt: iso(-11),
  },
  {
    id: "sr2",
    no: "SR2026002",
    companyId: "co4",
    productName: "眼科显微手术剪",
    brand: "不限",
    spec: "105mm 弯头",
    qty: 12,
    budget: 24000,
    expectedAt: dstr(45),
    status: "询价中",
    progress: [{ at: iso(-4), text: "需求已受理" }],
    createdAt: iso(-5),
  },
];

export const afterSales: AfterSale[] = [
  {
    id: "as1",
    no: "AS2026001",
    companyId: "co1",
    orderId: "o5",
    type: "质量问题",
    reason: "收到的止血钳有 3 支闭合不良",
    status: "processing",
    createdAt: iso(-6),
    logs: [
      { at: iso(-6), text: "客户提交售后申请并上传图片" },
      { at: iso(-5), text: "客服受理，安排寄回检测" },
      { at: iso(-2), text: "检测确认为批次问题，安排补发" },
    ],
  },
  {
    id: "as2",
    no: "AS2026002",
    companyId: "co2",
    orderId: "o2",
    type: "换货",
    reason: "规格下错，需更换 160mm",
    status: "submitted",
    createdAt: iso(-1),
    logs: [{ at: iso(-1), text: "客户提交售后申请" }],
  },
];

export const followUps: FollowUp[] = companies.flatMap((co, i) => [
  {
    id: `f${i}a`,
    companyId: co.id,
    salesId: co.salesId,
    type: (["电话", "拜访", "微信", "续费", "复购"] as const)[i % 5],
    content: "沟通下季度采购计划，客户关注缝合线与止血钳价格。",
    nextAt: dstr(3 + i),
    createdAt: iso(-7 - i),
  },
]);

export const payments: Payment[] = companies.slice(0, 6).map((co, i) => ({
  id: `pay${i + 1}`,
  no: `PAY${dstr(-i * 7).replace(/-/g, "")}${20 + i}`,
  companyId: co.id,
  kind: i % 3 === 0 ? "会员费" : i % 3 === 1 ? "订单货款" : "退款",
  amount: i % 3 === 0 ? 8800 : 12600 + i * 800,
  method: i % 2 === 0 ? "对公转账" : "在线支付",
  status: i === 2 ? "待确认" : i === 5 ? "已退款" : "已确认",
  invoice: i % 2 === 0 ? "已开具" : "已申请",
  createdAt: iso(-i * 7 - 1),
}));

export const auditLogs: AuditLog[] = Array.from({ length: 14 }).map((_, i) => ({
  id: `al${i + 1}`,
  actor: [...staffUsers, ...salesUsers][i % 11].name,
  role: [...staffUsers, ...salesUsers][i % 11].role,
  action: ["修改产品价格", "审核企业资料", "确认会员收款", "上传资质文件", "订单状态变更", "调整积分", "新增客户"][i % 7],
  target: ["产品 MP-1003", "企业 仁和民营医院", "会员费 8800 元", "注册证 V1.2", "订单 PO2026010101", "积分 +500", "客户 新城社区医疗中心"][i % 7],
  ip: `10.20.${i}.${20 + i}`,
  createdAt: iso(-i * 0.6),
}));

export const accessLogs: AccessLog[] = Array.from({ length: 16 }).map((_, i) => ({
  id: `ac${i + 1}`,
  companyId: companies[i % companies.length].id,
  user: buyerUsers[i % buyerUsers.length].name,
  productId: products[(i * 3) % products.length].id,
  action: (["查看详情", "预览文件", "下载文件"] as const)[i % 3],
  createdAt: iso(-i * 0.4),
}));

export const messages: MessageItem[] = companies.slice(0, 4).flatMap((co, i) => [
  { id: `m${i}a`, companyId: co.id, title: "订单已发货", body: "您的订单已由顺丰速运发出，请注意查收。", kind: "订单" as const, read: i > 0, createdAt: iso(-2 - i) },
  { id: `m${i}b`, companyId: co.id, title: "会员到期提醒", body: "您的年度会员将于 60 天后到期，可提前续费并获赠积分。", kind: "会员" as const, read: false, createdAt: iso(-5 - i) },
]);

export const banners: Banner[] = [
  { id: "bn1", title: "会员专属价格全面上新", subtitle: "1000+ 医疗器械与手术耗材，会员低至 7.2 折", status: "on" },
  { id: "bn2", title: "代采服务上线", subtitle: "平台目录外产品，48 小时给出比价方案", status: "on" },
];

export function createSeed(): DemoDB {
  return {
    categories: JSON.parse(JSON.stringify(categories)),
    products: JSON.parse(JSON.stringify(products)),
    companies: JSON.parse(JSON.stringify(companies)),
    users: [...buyerUsers, ...salesUsers, ...staffUsers],
    orders: JSON.parse(JSON.stringify(orders)),
    quotes: JSON.parse(JSON.stringify(quotes)),
    pointTxs: JSON.parse(JSON.stringify(pointTxs)),
    pointProducts: JSON.parse(JSON.stringify(pointProducts)),
    pointOrders: JSON.parse(JSON.stringify(pointOrders)),
    sourcing: JSON.parse(JSON.stringify(sourcing)),
    afterSales: JSON.parse(JSON.stringify(afterSales)),
    followUps: JSON.parse(JSON.stringify(followUps)),
    auditLogs: JSON.parse(JSON.stringify(auditLogs)),
    accessLogs: JSON.parse(JSON.stringify(accessLogs)),
    messages: JSON.parse(JSON.stringify(messages)),
    carts: { co1: [{ productId: "p2", qty: 20 }, { productId: "p9", qty: 10 }] },
    plans: JSON.parse(JSON.stringify(plans)),
    payments: JSON.parse(JSON.stringify(payments)),
    banners: JSON.parse(JSON.stringify(banners)),
  };
}
