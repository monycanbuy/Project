// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import authReducer from "./slices/authSlice";
// import laundryServicesReducer from "./slices/laundryServicesSlice";
// import laundryReducer from "./slices/laundrySlice";
// import paymentMethodsReducer from "./slices/paymentMethodsSlice";
// import dishesReducer from "./slices/dishesSlice";
// import categoryReducer from "./slices/categorySlice"; // Correct import
// import orderItemReducer from "./slices/orderItemSlice"; // Correct import
// import seminarReducer from "./slices/seminarSlice"; // Correct import
// import kabasaReducer from "./slices/kabasaSlice"; // Correct import
// import fontOfficeReducer from "./slices/frontOfficeSlice"; // Correct import
// import roleReducer from "./slices/roleSlice"; // Correct import
// import hallTypesReducer from "./slices/hallTypesSlice"; // Correct import
// import hallReducer from "./slices/hallSlice"; // Correct import
// import unifiedSalesReducer from "./slices/unifiedSalesSlice"; // Correct import
// import supplierReducer from "./slices/suppliersSlice"; // Correct import
// import productReducer from "./slices/productsSlice"; // Correct import
// import salesUnifiedReducer from "./slices/salesUnifiedSlice"; // Correct import
// import aggregateSalesReducer from "./slices/aggregateSalesSlice"; // Correct import
// import locationsReducer from "./slices/locationSlice"; // Correct import
// import inventoriesReducer from "./slices/inventoriesSlice"; // Correct import
// import alertsReducer from "./slices/alertsSlice"; // Correct import
// import auditLogReducer from "./slices/auditLogSlice"; // Correct import
// import inventoryAdjustmentReducer from "./slices/inventoryAdjustmentSlice"; // Correct import
// import purchaseOrderReducer from "./slices/purchaseOrderSlice"; // Correct import
// import stockMovementReducer from "./slices/stockMovementSlice"; // Correct import
// import salesTransactionReducer from "./slices/salesTransactionSlice"; // Correct import
// import customerReducer from "./slices/customerSlice"; // Correct import
// import accountReducer from "./slices/accountSlice"; // Correct import
// import debtorsReducer from "./slices/debtorsSlice"; // Correct import
// import ledgerTransactionReducer from "./slices/ledgerTransactionSlice"; // Correct import
// import accountSaleReducer from "./slices/accountSaleSlice"; // Correct import
// import pettyCashReducer from "./slices/pettyCashSlice"; // Correct import
// import expenseCategoriesReducer from "./slices/expenseCategorySlice"; // Correct import
// import { apiClient } from "../utils/apiClient";

// const persistConfig = {
//   key: "auth",
//   storage,
//   whitelist: ["user", "email", "isVerified", "isAuthenticated"],
//   // blacklist: ["isVerifyingCode", "verificationMessage", "verificationError"],
//   // whitelist: ["user", "email", "isVerified", "isAuthenticated"],
// };

// const laundryServicesPersistConfig = {
//   key: "laundryServices",
//   storage,
//   debug: true,
// };

// const laundryPersistConfig = {
//   key: "laundry",
//   storage,
//   debug: true,
// };

// const paymentMethodsPersistConfig = {
//   key: "paymentMethods",
//   storage,
//   debug: true,
// };

// const dishesPersistConfig = {
//   key: "dishes",
//   storage,
//   debug: true,
// };

// const categoryPersistConfig = {
//   key: "categories",
//   storage,
//   debug: true,
// };

// const orderItemPersistConfig = {
//   key: "orderItems",
//   storage,
//   debug: true,
// };
// const seminarPersistConfig = {
//   key: "orderItems",
//   storage,
//   debug: true,
// };
// const kabasaPersistConfig = {
//   key: "kabasa",
//   storage,
//   debug: true,
// };
// const frontOfficePersistConfig = {
//   key: "frontOffice",
//   storage,
//   debug: true,
// };
// const rolePersistConfig = {
//   key: "roles",
//   storage,
//   debug: true,
// };
// const hallTypesPersistConfig = {
//   key: "hallTypes",
//   storage,
//   debug: true,
// };
// const hallPersistConfig = {
//   key: "hallTransactions",
//   storage,
//   debug: true,
// };
// const unifiedSalesPersistConfig = {
//   key: "unifiedSales",
//   storage,
//   debug: true,
// };
// const supplierPersistConfig = {
//   key: "suppliers",
//   storage,
//   debug: true,
// };
// const productPersistConfig = {
//   key: "products",
//   storage,
//   debug: true,
// };
// const salesUnifiedPersistConfig = {
//   key: "anotherUnifiedSales",
//   storage,
//   debug: true,
// };
// const aggregateSalesPersistConfig = {
//   key: "aggregateSales",
//   storage,
//   debug: true,
// };
// const locationsPersistConfig = {
//   key: "locations",
//   storage,
//   debug: true,
// };
// const inventoriesPersistConfig = {
//   key: "inventories",
//   storage,
//   debug: true,
// };
// const alertsPersistConfig = {
//   key: "alerts",
//   storage,
//   debug: true,
// };
// const auditLogPersistConfig = {
//   key: "auditlogs",
//   storage,
//   debug: true,
// };
// const inventoryAdjustmentPersistConfig = {
//   key: "inventoryAdjustments",
//   storage,
//   debug: true,
// };
// const purchaseOrderPersistConfig = {
//   key: "purchaseOrders",
//   storage,
//   debug: true,
// };
// const stockMovementPersistConfig = {
//   key: "stockMovements",
//   storage,
//   debug: true,
// };
// const salesTransactionPersistConfig = {
//   key: "salesTransactions",
//   storage,
//   debug: true,
// };
// const customerPersistConfig = {
//   key: "customers",
//   storage,
//   debug: true,
// };
// const accountPersistConfig = {
//   key: "accounts",
//   storage,
//   debug: true,
// };
// const debtorsPersistConfig = {
//   key: "debtors",
//   storage,
//   debug: true,
// };
// const ledgerTransactionPersistConfig = {
//   key: "ledgerTransactions",
//   storage,
//   debug: true,
// };
// const accountSalePersistConfig = {
//   key: "accountSales",
//   storage,
//   debug: true,
// };
// const pettyCashPersistConfig = {
//   key: "pettyCash",
//   storage,
//   debug: true,
// };
// const expenseCategoriesPersistConfig = {
//   key: "expenseCategories",
//   storage,
//   debug: true,
// };

// // Create persisted reducers
// const persistedAuthReducer = persistReducer(persistConfig, authReducer);
// const persistedLaundryServicesReducer = persistReducer(
//   laundryServicesPersistConfig,
//   laundryServicesReducer
// );
// const persistedLaundryReducer = persistReducer(
//   laundryPersistConfig,
//   laundryReducer
// );
// const persistedPaymentMethodsReducer = persistReducer(
//   paymentMethodsPersistConfig,
//   paymentMethodsReducer
// );
// const persistedDishesReducer = persistReducer(
//   dishesPersistConfig,
//   dishesReducer
// );
// const persistedCategoryReducer = persistReducer(
//   categoryPersistConfig,
//   categoryReducer
// );
// const persistedOrderItemReducer = persistReducer(
//   orderItemPersistConfig,
//   orderItemReducer
// );
// const persistedSeminarReducer = persistReducer(
//   seminarPersistConfig,
//   seminarReducer
// );
// const persistedKabasaReducer = persistReducer(
//   kabasaPersistConfig,
//   kabasaReducer
// );
// const persistedfrontOfficeReducer = persistReducer(
//   frontOfficePersistConfig,
//   fontOfficeReducer
// );
// const persistedroleReducer = persistReducer(rolePersistConfig, roleReducer);
// const persistedhallTypesReducer = persistReducer(
//   hallTypesPersistConfig,
//   hallTypesReducer
// );
// const persistedhallReducer = persistReducer(hallPersistConfig, hallReducer);
// const persistedunifiedSalesReducer = persistReducer(
//   unifiedSalesPersistConfig,
//   unifiedSalesReducer
// );
// const persistedSupplierReducer = persistReducer(
//   supplierPersistConfig,
//   supplierReducer
// );
// const persistedProductReducer = persistReducer(
//   productPersistConfig,
//   productReducer
// );
// const persistedSalesUnifiedReducer = persistReducer(
//   salesUnifiedPersistConfig,
//   salesUnifiedReducer
// );
// const persistedAggregateSalesReducer = persistReducer(
//   aggregateSalesPersistConfig,
//   aggregateSalesReducer
// );
// const persistedlocationsReducer = persistReducer(
//   locationsPersistConfig,
//   locationsReducer
// );
// const persistedinventoriesReducer = persistReducer(
//   inventoriesPersistConfig,
//   inventoriesReducer
// );
// const persistedalertsReducer = persistReducer(
//   alertsPersistConfig,
//   alertsReducer
// );
// const persistedAuditLogReducer = persistReducer(
//   auditLogPersistConfig,
//   auditLogReducer
// );
// const persistedInventoryAdjustmentReducer = persistReducer(
//   inventoryAdjustmentPersistConfig,
//   inventoryAdjustmentReducer
// );
// const persistedpurchaseOrderReducer = persistReducer(
//   purchaseOrderPersistConfig,
//   purchaseOrderReducer
// );
// const persistedstockMovementReducer = persistReducer(
//   stockMovementPersistConfig,
//   stockMovementReducer
// );
// const persistedsalesTransactionReducer = persistReducer(
//   salesTransactionPersistConfig,
//   salesTransactionReducer
// );
// const persistedCustomerReducer = persistReducer(
//   customerPersistConfig,
//   customerReducer
// );
// const persistedAccountReducer = persistReducer(
//   accountPersistConfig,
//   accountReducer
// );
// const persistedDebtorsReducer = persistReducer(
//   debtorsPersistConfig,
//   debtorsReducer
// );
// const persistedledgerTransactionReducer = persistReducer(
//   ledgerTransactionPersistConfig,
//   ledgerTransactionReducer
// );
// const persistedaccountSaleeducer = persistReducer(
//   accountSalePersistConfig,
//   accountSaleReducer
// );
// const persistedpettyCashReducer = persistReducer(
//   pettyCashPersistConfig,
//   pettyCashReducer
// );
// const persistedexpenseCategoriesReducer = persistReducer(
//   expenseCategoriesPersistConfig,
//   expenseCategoriesReducer
// );

// const rootReducer = combineReducers({
//   auth: persistedAuthReducer,
//   laundryServices: persistedLaundryServicesReducer,
//   laundry: persistedLaundryReducer,
//   paymentMethods: persistedPaymentMethodsReducer,
//   dishes: persistedDishesReducer,
//   categories: persistedCategoryReducer, // Correct reducer for categories
//   orderItems: persistedOrderItemReducer,
//   seminar: persistedSeminarReducer,
//   kabasa: persistedKabasaReducer,
//   frontOffice: persistedfrontOfficeReducer,
//   roles: persistedroleReducer,
//   hallTypes: persistedhallTypesReducer,
//   hallTransactions: persistedhallReducer,
//   unifiedSales: persistedunifiedSalesReducer,
//   suppliers: persistedSupplierReducer, // Correct reducer for suppliers
//   products: persistedProductReducer, // Correct reducer for products
//   anotherUnifiedSales: persistedSalesUnifiedReducer,
//   aggregateSales: persistedAggregateSalesReducer,
//   locations: persistedlocationsReducer,
//   inventories: persistedinventoriesReducer, // Correct reducer for inventories
//   alerts: persistedalertsReducer, // Correct reducer for alerts
//   auditlogs: persistedAuditLogReducer,
//   inventoryAdjustments: persistedInventoryAdjustmentReducer, // Correct reducer for audit logs
//   purchaseOrders: persistedpurchaseOrderReducer, // Correct reducer for purchase orders
//   stockMovements: persistedstockMovementReducer, // Correct reducer for stock movements
//   salesTransactions: persistedsalesTransactionReducer, // Correct reducer for stock movements
//   customers: persistedCustomerReducer, // Correct reducer for stock movements
//   accounts: persistedAccountReducer, // Correct reducer for stock movements
//   debtors: persistedDebtorsReducer, // Correct reducer for stock movements
//   ledgerTransactions: persistedledgerTransactionReducer, // Correct reducer for stock movements
//   accountSales: persistedaccountSaleeducer, // Correct reducer for stock movements
//   pettyCash: persistedpettyCashReducer, // Correct reducer for stock movements
//   expenseCategories: persistedexpenseCategoriesReducer,
// });

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
//       },
//     }),
// });

// // apiClient.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     const status = error.response?.status;
// //     console.log("Interceptor caught error:", { status, error });
// //     if (status === 401 || status === 403) {
// //       store.dispatch(setSessionExpired(true));
// //       window.location.href = "/login"; // Immediate redirect
// //       return Promise.reject({ message: "Unauthorized - Redirecting to login" });
// //     }
// //     return Promise.reject(error.response?.data || error.message);
// //   }
// // );
// // apiClient.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     const status = error.response?.status;
// //     const url = error.config?.url;
// //     console.log("Interceptor caught error:", {
// //       status,
// //       url,
// //       error: error.message,
// //     });
// //     if (status === 401 || status === 403) {
// //       console.log("Unauthorized, redirecting to /login for URL:", url);
// //       window.location.href = "/login"; // Immediate redirect
// //       //return Promise.reject({ message: "Unauthorized - Redirecting to login" });
// //     }
// //     return Promise.reject(error.response?.data || error.message);
// //   }
// // );

// export const persistor = persistStore(store);
// export default store;

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import laundryServicesReducer from "./slices/laundryServicesSlice";
import laundryReducer from "./slices/laundrySlice";
import paymentMethodsReducer from "./slices/paymentMethodsSlice";
import dishesReducer from "./slices/dishesSlice";
import categoryReducer from "./slices/categorySlice";
import orderItemReducer from "./slices/orderItemSlice";
import seminarReducer from "./slices/seminarSlice";
import kabasaReducer from "./slices/kabasaSlice";
import fontOfficeReducer from "./slices/frontOfficeSlice";
import roleReducer from "./slices/roleSlice";
import hallTypesReducer from "./slices/hallTypesSlice";
import hallReducer from "./slices/hallSlice";
import unifiedSalesReducer from "./slices/unifiedSalesSlice";
import supplierReducer from "./slices/suppliersSlice";
import productReducer from "./slices/productsSlice";
import salesUnifiedReducer from "./slices/salesUnifiedSlice";
import aggregateSalesReducer from "./slices/aggregateSalesSlice";
import locationsReducer from "./slices/locationSlice";
import inventoriesReducer from "./slices/inventoriesSlice";
import alertsReducer from "./slices/alertsSlice";
import auditLogReducer from "./slices/auditLogSlice";
import inventoryAdjustmentReducer from "./slices/inventoryAdjustmentSlice";
import purchaseOrderReducer from "./slices/purchaseOrderSlice";
import stockMovementReducer from "./slices/stockMovementSlice";
import salesTransactionReducer from "./slices/salesTransactionSlice";
import customerReducer from "./slices/customerSlice";
import accountReducer from "./slices/accountSlice";
import debtorsReducer from "./slices/debtorsSlice";
import ledgerTransactionReducer from "./slices/ledgerTransactionSlice";
import accountSaleReducer from "./slices/accountSaleSlice";
import pettyCashReducer from "./slices/pettyCashSlice";
import expenseCategoriesReducer from "./slices/expenseCategorySlice";

// Base persist config with conditional debug
const createPersistConfig = (key) => ({
  key,
  storage,
  debug: process.env.NODE_ENV === "development", // Debug only in development
});

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "email", "isVerified", "isAuthenticated"],
  debug: process.env.NODE_ENV === "development",
};

// Create persisted configs for each reducer
const laundryServicesPersistConfig = createPersistConfig("laundryServices");
const laundryPersistConfig = createPersistConfig("laundry");
const paymentMethodsPersistConfig = createPersistConfig("paymentMethods");
const dishesPersistConfig = createPersistConfig("dishes");
const categoryPersistConfig = createPersistConfig("categories");
const orderItemPersistConfig = createPersistConfig("orderItems");
const seminarPersistConfig = createPersistConfig("seminars"); // Fixed key to avoid duplication
const kabasaPersistConfig = createPersistConfig("kabasa");
const frontOfficePersistConfig = createPersistConfig("frontOffice");
const rolePersistConfig = createPersistConfig("roles");
const hallTypesPersistConfig = createPersistConfig("hallTypes");
const hallPersistConfig = createPersistConfig("hallTransactions");
const unifiedSalesPersistConfig = createPersistConfig("unifiedSales");
const supplierPersistConfig = createPersistConfig("suppliers");
const productPersistConfig = createPersistConfig("products");
const salesUnifiedPersistConfig = createPersistConfig("anotherUnifiedSales");
const aggregateSalesPersistConfig = createPersistConfig("aggregateSales");
const locationsPersistConfig = createPersistConfig("locations");
const inventoriesPersistConfig = createPersistConfig("inventories");
const alertsPersistConfig = createPersistConfig("alerts");
const auditLogPersistConfig = createPersistConfig("auditlogs");
const inventoryAdjustmentPersistConfig = createPersistConfig(
  "inventoryAdjustments"
);
const purchaseOrderPersistConfig = createPersistConfig("purchaseOrders");
const stockMovementPersistConfig = createPersistConfig("stockMovements");
const salesTransactionPersistConfig = createPersistConfig("salesTransactions");
const customerPersistConfig = createPersistConfig("customers");
const accountPersistConfig = createPersistConfig("accounts");
const debtorsPersistConfig = createPersistConfig("debtors");
const ledgerTransactionPersistConfig =
  createPersistConfig("ledgerTransactions");
const accountSalePersistConfig = createPersistConfig("accountSales");
const pettyCashPersistConfig = createPersistConfig("pettyCash");
const expenseCategoriesPersistConfig = createPersistConfig("expenseCategories");

// Create persisted reducers
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedLaundryServicesReducer = persistReducer(
  laundryServicesPersistConfig,
  laundryServicesReducer
);
const persistedLaundryReducer = persistReducer(
  laundryPersistConfig,
  laundryReducer
);
const persistedPaymentMethodsReducer = persistReducer(
  paymentMethodsPersistConfig,
  paymentMethodsReducer
);
const persistedDishesReducer = persistReducer(
  dishesPersistConfig,
  dishesReducer
);
const persistedCategoryReducer = persistReducer(
  categoryPersistConfig,
  categoryReducer
);
const persistedOrderItemReducer = persistReducer(
  orderItemPersistConfig,
  orderItemReducer
);
const persistedSeminarReducer = persistReducer(
  seminarPersistConfig,
  seminarReducer
);
const persistedKabasaReducer = persistReducer(
  kabasaPersistConfig,
  kabasaReducer
);
const persistedFrontOfficeReducer = persistReducer(
  frontOfficePersistConfig,
  fontOfficeReducer
);
const persistedRoleReducer = persistReducer(rolePersistConfig, roleReducer);
const persistedHallTypesReducer = persistReducer(
  hallTypesPersistConfig,
  hallTypesReducer
);
const persistedHallReducer = persistReducer(hallPersistConfig, hallReducer);
const persistedUnifiedSalesReducer = persistReducer(
  unifiedSalesPersistConfig,
  unifiedSalesReducer
);
const persistedSupplierReducer = persistReducer(
  supplierPersistConfig,
  supplierReducer
);
const persistedProductReducer = persistReducer(
  productPersistConfig,
  productReducer
);
const persistedSalesUnifiedReducer = persistReducer(
  salesUnifiedPersistConfig,
  salesUnifiedReducer
);
const persistedAggregateSalesReducer = persistReducer(
  aggregateSalesPersistConfig,
  aggregateSalesReducer
);
const persistedLocationsReducer = persistReducer(
  locationsPersistConfig,
  locationsReducer
);
const persistedInventoriesReducer = persistReducer(
  inventoriesPersistConfig,
  inventoriesReducer
);
const persistedAlertsReducer = persistReducer(
  alertsPersistConfig,
  alertsReducer
);
const persistedAuditLogReducer = persistReducer(
  auditLogPersistConfig,
  auditLogReducer
);
const persistedInventoryAdjustmentReducer = persistReducer(
  inventoryAdjustmentPersistConfig,
  inventoryAdjustmentReducer
);
const persistedPurchaseOrderReducer = persistReducer(
  purchaseOrderPersistConfig,
  purchaseOrderReducer
);
const persistedStockMovementReducer = persistReducer(
  stockMovementPersistConfig,
  stockMovementReducer
);
const persistedSalesTransactionReducer = persistReducer(
  salesTransactionPersistConfig,
  salesTransactionReducer
);
const persistedCustomerReducer = persistReducer(
  customerPersistConfig,
  customerReducer
);
const persistedAccountReducer = persistReducer(
  accountPersistConfig,
  accountReducer
);
const persistedDebtorsReducer = persistReducer(
  debtorsPersistConfig,
  debtorsReducer
);
const persistedLedgerTransactionReducer = persistReducer(
  ledgerTransactionPersistConfig,
  ledgerTransactionReducer
);
const persistedAccountSaleReducer = persistReducer(
  accountSalePersistConfig,
  accountSaleReducer
);
const persistedPettyCashReducer = persistReducer(
  pettyCashPersistConfig,
  pettyCashReducer
);
const persistedExpenseCategoriesReducer = persistReducer(
  expenseCategoriesPersistConfig,
  expenseCategoriesReducer
);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  laundryServices: persistedLaundryServicesReducer,
  laundry: persistedLaundryReducer,
  paymentMethods: persistedPaymentMethodsReducer,
  dishes: persistedDishesReducer,
  categories: persistedCategoryReducer,
  orderItems: persistedOrderItemReducer,
  seminar: persistedSeminarReducer,
  kabasa: persistedKabasaReducer,
  frontOffice: persistedFrontOfficeReducer,
  roles: persistedRoleReducer,
  hallTypes: persistedHallTypesReducer,
  hallTransactions: persistedHallReducer,
  unifiedSales: persistedUnifiedSalesReducer,
  suppliers: persistedSupplierReducer,
  products: persistedProductReducer,
  anotherUnifiedSales: persistedSalesUnifiedReducer,
  aggregateSales: persistedAggregateSalesReducer,
  locations: persistedLocationsReducer,
  inventories: persistedInventoriesReducer,
  alerts: persistedAlertsReducer,
  auditlogs: persistedAuditLogReducer,
  inventoryAdjustments: persistedInventoryAdjustmentReducer,
  purchaseOrders: persistedPurchaseOrderReducer,
  stockMovements: persistedStockMovementReducer,
  salesTransactions: persistedSalesTransactionReducer,
  customers: persistedCustomerReducer,
  accounts: persistedAccountReducer,
  debtors: persistedDebtorsReducer,
  ledgerTransactions: persistedLedgerTransactionReducer,
  accountSales: persistedAccountSaleReducer,
  pettyCash: persistedPettyCashReducer,
  expenseCategories: persistedExpenseCategoriesReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
