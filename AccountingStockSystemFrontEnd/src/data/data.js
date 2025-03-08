import { iconsImgs } from "../utils/images";
import { personsImgs } from "../utils/images";

export const navigationLinks = [
  {
    id: 1,
    title: "Profile",
    image: iconsImgs.report,
    route: "/admin/profile",
  },
  { id: 2, title: "Users", image: iconsImgs.home, route: "/admin/users" },
  {
    id: 3,
    title: "LaundryService",
    image: iconsImgs.plane,
    route: "/admin/laundryservice",
  },
  {
    id: 4,
    title: "Laundries",
    image: iconsImgs.budget,
    route: "/admin/laundries",
  },
  {
    id: 5,
    title: "Dishes",
    image: iconsImgs.wallet,
    route: "/admin/dishes",
  },
  {
    id: 6,
    title: "Categories",
    image: iconsImgs.bills,
    route: "/admin/category",
  },
  {
    id: 7,
    title: "OrderItems",
    image: iconsImgs.report,
    route: "/admin/orderitem",
  },
  {
    id: 8,
    title: "Seminars",
    image: iconsImgs.wallet,
    route: "/admin/seminar",
  },
  { id: 9, title: "Kabsa", image: iconsImgs.wealth, route: "/admin/kabsa" },
  {
    id: 10,
    title: "FrontOffice",
    image: iconsImgs.user,
    route: "/admin/front-office",
  },
  { id: 11, title: "Roles", image: iconsImgs.gears, route: "/admin/roles" },
  {
    id: 12,
    title: "PaymentMethod",
    image: iconsImgs.report,
    route: "/admin/payment-methods",
  },
  {
    id: 13,
    title: "HallTypes",
    image: iconsImgs.bills,
    route: "/admin/hall-types",
  },
  { id: 14, title: "Hall", image: iconsImgs.wallet, route: "/admin/hall" },
  {
    id: 15,
    title: "Unified Sales",
    image: iconsImgs.bills,
    route: "/admin/sales-unified",
  },
  {
    id: 16,
    title: "Suppliers",
    image: iconsImgs.wealth,
    route: "/admin/suppliers",
  },
  {
    id: 17,
    title: "Inventory",
    image: iconsImgs.bills,
    route: "/admin/inventory",
  },
  {
    id: 18,
    title: "Dashboard",
    image: iconsImgs.report,
    route: "/admin/dashboard",
  },
  {
    id: 19,
    title: "Locations",
    image: iconsImgs.wealth,
    route: "/admin/locations",
  },
  {
    id: 20,
    title: "Alerts",
    image: iconsImgs.wallet,
    route: "/admin/alerts",
  },
  {
    id: 21,
    title: "AuditLogs",
    image: iconsImgs.report,
    route: "/admin/audit-logs",
  },
  {
    id: 22,
    title: "InventoryAdjustment",
    image: iconsImgs.bills,
    route: "/admin/inventory-adjustment",
  },
  {
    id: 23,
    title: "PurchaseOrders",
    image: iconsImgs.wealth,
    route: "/admin/purchase-order",
  },
  {
    id: 24,
    title: "StockMovement",
    image: iconsImgs.report,
    route: "/admin/stock-movement",
  },
  {
    id: 25,
    title: "SalesTransactions",
    image: iconsImgs.report,
    route: "/admin/unified-transaction",
  },

  //{ id: 4, title: "Subscriptions", image: iconsImgs.wallet },
  // { id: 5, title: "Loans", image: iconsImgs.bills },
  // { id: 6, title: "Reports", image: iconsImgs.report },
  // { id: 7, title: "Savings", image: iconsImgs.wallet },
  // { id: 8, title: "Financial Advice", image: iconsImgs.wealth },
  // { id: 9, title: "Account", image: iconsImgs.user },
  // { id: 10, title: "Settings", image: iconsImgs.gears },
];

export const transactions = [
  {
    id: 11,
    name: "Sarah Parker",
    image: personsImgs.person_four,
    date: "23/12/04",
    amount: 22000,
  },
  {
    id: 12,
    name: "Krisitine Carter",
    image: personsImgs.person_three,
    date: "23/07/21",
    amount: 20000,
  },
  {
    id: 13,
    name: "Irene Doe",
    image: personsImgs.person_two,
    date: "23/08/25",
    amount: 30000,
  },
];

export const reportData = [
  {
    id: 14,
    month: "Jan",
    value1: 45,
    value2: null,
  },
  {
    id: 15,
    month: "Feb",
    value1: 45,
    value2: 60,
  },
  {
    id: 16,
    month: "Mar",
    value1: 45,
    value2: null,
  },
  {
    id: 17,
    month: "Apr",
    value1: 45,
    value2: null,
  },
  {
    id: 18,
    month: "May",
    value1: 45,
    value2: null,
  },
];

export const budget = [
  {
    id: 19,
    title: "Subscriptions",
    type: "Automated",
    amount: 22000,
  },
  {
    id: 20,
    title: "Loan Payment",
    type: "Automated",
    amount: 16000,
  },
  {
    id: 21,
    title: "Foodstuff",
    type: "Automated",
    amount: 20000,
  },
  {
    id: 22,
    title: "Subscriptions",
    type: null,
    amount: 10000,
  },
  {
    id: 23,
    title: "Subscriptions",
    type: null,
    amount: 40000,
  },
];

export const subscriptions = [
  {
    id: 24,
    title: "LinkedIn",
    due_date: "23/12/04",
    amount: 20000,
  },
  {
    id: 25,
    title: "Netflix",
    due_date: "23/12/10",
    amount: 5000,
  },
  {
    id: 26,
    title: "DSTV",
    due_date: "23/12/22",
    amount: 2000,
  },
];

export const savings = [
  {
    id: 27,
    image: personsImgs.person_one,
    saving_amount: 250000,
    title: "Pay kid bro’s fees",
    date_taken: "23/12/22",
    amount_left: 40000,
  },
];
