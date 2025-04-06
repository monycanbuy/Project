import { iconsImgs } from "../utils/images";
import { personsImgs } from "../utils/images";

export const navigationLinks = [
  {
    id: 1,
    title: "Profile",
    image: iconsImgs.user,
    route: "/admin/profile",
  },
  { id: 2, title: "Users", image: iconsImgs.userdetail, route: "/admin/users" },
  {
    id: 3,
    title: "LaundryService",
    displayTitle: "Laundry Service",
    image: iconsImgs.plane,
    route: "/admin/laundryservice",
  },
  {
    id: 4,
    title: "Laundries",
    image: iconsImgs.washer,
    route: "/admin/laundries",
  },
  {
    id: 5,
    title: "Dishes",
    image: iconsImgs.dish,
    route: "/admin/dishes",
  },
  {
    id: 6,
    title: "Categories",
    image: iconsImgs.category,
    route: "/admin/category",
  },
  {
    id: 7,
    title: "OrderItems",
    displayTitle: "Order Items",
    image: iconsImgs.foodmenu,
    route: "/admin/orderitem",
  },
  {
    id: 8,
    title: "Seminars",
    image: iconsImgs.wallet,
    route: "/admin/seminar",
  },
  // { id: 9, title: "Kabsa", image: iconsImgs.wealth, route: "/admin/kabsa" },
  {
    id: 9,
    title: "FrontOffice",
    displayTitle: "Front Office",
    image: iconsImgs.user,
    route: "/admin/front-office",
  },
  { id: 10, title: "Roles", image: iconsImgs.gears, route: "/admin/roles" },
  {
    id: 11,
    title: "PaymentMethod",
    displayTitle: "Payment Method",
    image: iconsImgs.report,
    route: "/admin/payment-methods",
  },
  {
    id: 12,
    title: "HallTypes",
    displayTitle: "Hall Types",
    image: iconsImgs.bills,
    route: "/admin/hall-types",
  },
  { id: 13, title: "Hall", image: iconsImgs.wallet, route: "/admin/hall" },
  {
    id: 14,
    title: "Suppliers",
    image: iconsImgs.wealth,
    route: "/admin/suppliers",
  },
  {
    id: 15,
    title: "Inventory",
    image: iconsImgs.truck,
    route: "/admin/inventory",
  },
  {
    id: 16,
    title: "Dashboard",
    image: iconsImgs.dashboard,
    route: "/admin/dashboard",
  },
  {
    id: 17,
    title: "Locations",
    image: iconsImgs.location,
    route: "/admin/locations",
  },
  {
    id: 18,
    title: "Alerts",
    image: iconsImgs.alarm,
    route: "/admin/alerts",
  },
  {
    id: 19,
    title: "AuditLogs",
    displayTitle: "Audit Logs",
    image: iconsImgs.report,
    route: "/admin/audit-logs",
  },
  {
    id: 20,
    title: "InventoryAdjustment",
    displayTitle: "Inventory Adjustment",
    image: iconsImgs.store,
    route: "/admin/inventory-adjustment",
  },
  {
    id: 21,
    title: "PurchaseOrders",
    displayTitle: "Purchase Orders",
    image: iconsImgs.wealth,
    route: "/admin/purchase-order",
  },
  {
    id: 22,
    title: "StockMovement",
    displayTitle: "Stock Movement",
    image: iconsImgs.truck,
    route: "/admin/stock-movement",
  },
  {
    id: 23,
    title: "SalesTransactions",
    displayTitle: "Sales Transactions",
    image: iconsImgs.report,
    route: "/admin/unified-transaction",
  },
  {
    id: 100,
    title: "Accounting",
    displayTitle: "Accounting Section",
    image: iconsImgs.budget, // Choose an appropriate icon
    children: [
      {
        id: 101,
        title: "Accounts",
        displayTitle: "Accounts",
        image: iconsImgs.bills,
        route: "/admin/accounts",
      },
      {
        id: 102,
        title: "LedgerTransactions",
        displayTitle: "Ledger Transactions",
        image: iconsImgs.report,
        route: "/admin/ledger-transactions",
      },
      {
        id: 103,
        title: "Debtors",
        image: iconsImgs.wallet,
        route: "/admin/debtors",
      },
      {
        id: 104,
        title: "Sales",
        image: iconsImgs.wealth,
        route: "/admin/sales",
      },
      {
        id: 105,
        title: "PettyCash",
        displayTitle: "Petty Cash",
        image: iconsImgs.bills,
        route: "/admin/petty-cash",
      },
      {
        id: 106,
        title: "Customer",
        displayTitle: "Customers",
        image: iconsImgs.wealth,
        route: "/admin/customer",
      },
    ],
  },
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
