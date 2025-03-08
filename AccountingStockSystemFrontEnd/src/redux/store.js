import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import laundryServicesReducer from "./slices/laundryServicesSlice";
import laundryReducer from "./slices/laundrySlice";
import paymentMethodsReducer from "./slices/paymentMethodsSlice";
import dishesReducer from "./slices/dishesSlice";
import categoryReducer from "./slices/categorySlice"; // Correct import
import orderItemReducer from "./slices/orderItemSlice"; // Correct import
import seminarReducer from "./slices/seminarSlice"; // Correct import
import kabasaReducer from "./slices/kabasaSlice"; // Correct import
import fontOfficeReducer from "./slices/frontOfficeSlice"; // Correct import
import roleReducer from "./slices/roleSlice"; // Correct import
import hallTypesReducer from "./slices/hallTypesSlice"; // Correct import
import hallReducer from "./slices/hallSlice"; // Correct import
import unifiedSalesReducer from "./slices/unifiedSalesSlice"; // Correct import
import supplierReducer from "./slices/suppliersSlice"; // Correct import
import productReducer from "./slices/productsSlice"; // Correct import
import salesUnifiedReducer from "./slices/salesUnifiedSlice"; // Correct import
import aggregateSalesReducer from "./slices/aggregateSalesSlice"; // Correct import
import locationsReducer from "./slices/locationSlice"; // Correct import
import inventoriesReducer from "./slices/inventoriesSlice"; // Correct import
import alertsReducer from "./slices/alertsSlice"; // Correct import
import auditLogReducer from "./slices/auditLogSlice"; // Correct import
import inventoryAdjustmentReducer from "./slices/inventoryAdjustmentSlice"; // Correct import
import purchaseOrderReducer from "./slices/purchaseOrderSlice"; // Correct import
import stockMovementReducer from "./slices/stockMovementSlice"; // Correct import
import salesTransactionReducer from "./slices/salesTransactionSlice"; // Correct import

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "email", "isVerified", "isAuthenticated"],
  // blacklist: ["isVerifyingCode", "verificationMessage", "verificationError"],
  // whitelist: ["user", "email", "isVerified", "isAuthenticated"],
};

const laundryServicesPersistConfig = {
  key: "laundryServices",
  storage,
  debug: true,
};

const laundryPersistConfig = {
  key: "laundry",
  storage,
  debug: true,
};

const paymentMethodsPersistConfig = {
  key: "paymentMethods",
  storage,
  debug: true,
};

const dishesPersistConfig = {
  key: "dishes",
  storage,
  debug: true,
};

const categoryPersistConfig = {
  key: "categories",
  storage,
  debug: true,
};

const orderItemPersistConfig = {
  key: "orderItems",
  storage,
  debug: true,
};
const seminarPersistConfig = {
  key: "orderItems",
  storage,
  debug: true,
};
const kabasaPersistConfig = {
  key: "kabasa",
  storage,
  debug: true,
};
const frontOfficePersistConfig = {
  key: "frontOffice",
  storage,
  debug: true,
};
const rolePersistConfig = {
  key: "roles",
  storage,
  debug: true,
};
const hallTypesPersistConfig = {
  key: "hallTypes",
  storage,
  debug: true,
};
const hallPersistConfig = {
  key: "hallTransactions",
  storage,
  debug: true,
};
const unifiedSalesPersistConfig = {
  key: "unifiedSales",
  storage,
  debug: true,
};
const supplierPersistConfig = {
  key: "suppliers",
  storage,
  debug: true,
};
const productPersistConfig = {
  key: "products",
  storage,
  debug: true,
};
const salesUnifiedPersistConfig = {
  key: "anotherUnifiedSales",
  storage,
  debug: true,
};
const aggregateSalesPersistConfig = {
  key: "aggregateSales",
  storage,
  debug: true,
};
const locationsPersistConfig = {
  key: "locations",
  storage,
  debug: true,
};
const inventoriesPersistConfig = {
  key: "inventories",
  storage,
  debug: true,
};
const alertsPersistConfig = {
  key: "alerts",
  storage,
  debug: true,
};
const auditLogPersistConfig = {
  key: "auditlogs",
  storage,
  debug: true,
};
const inventoryAdjustmentPersistConfig = {
  key: "inventoryAdjustments",
  storage,
  debug: true,
};
const purchaseOrderPersistConfig = {
  key: "purchaseOrders",
  storage,
  debug: true,
};
const stockMovementPersistConfig = {
  key: "stockMovements",
  storage,
  debug: true,
};
const salesTransactionPersistConfig = {
  key: "salesTransactions",
  storage,
  debug: true,
};

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
const persistedfrontOfficeReducer = persistReducer(
  frontOfficePersistConfig,
  fontOfficeReducer
);
const persistedroleReducer = persistReducer(rolePersistConfig, roleReducer);
const persistedhallTypesReducer = persistReducer(
  hallTypesPersistConfig,
  hallTypesReducer
);
const persistedhallReducer = persistReducer(hallPersistConfig, hallReducer);
const persistedunifiedSalesReducer = persistReducer(
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
const persistedlocationsReducer = persistReducer(
  locationsPersistConfig,
  locationsReducer
);
const persistedinventoriesReducer = persistReducer(
  inventoriesPersistConfig,
  inventoriesReducer
);
const persistedalertsReducer = persistReducer(
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
const persistedpurchaseOrderReducer = persistReducer(
  purchaseOrderPersistConfig,
  purchaseOrderReducer
);
const persistedstockMovementReducer = persistReducer(
  stockMovementPersistConfig,
  stockMovementReducer
);
const persistedsalesTransactionReducer = persistReducer(
  salesTransactionPersistConfig,
  salesTransactionReducer
);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  laundryServices: persistedLaundryServicesReducer,
  laundry: persistedLaundryReducer,
  paymentMethods: persistedPaymentMethodsReducer,
  dishes: persistedDishesReducer,
  categories: persistedCategoryReducer, // Correct reducer for categories
  orderItems: persistedOrderItemReducer,
  seminar: persistedSeminarReducer,
  kabasa: persistedKabasaReducer,
  frontOffice: persistedfrontOfficeReducer,
  roles: persistedroleReducer,
  hallTypes: persistedhallTypesReducer,
  hallTransactions: persistedhallReducer,
  unifiedSales: persistedunifiedSalesReducer,
  suppliers: persistedSupplierReducer, // Correct reducer for suppliers
  products: persistedProductReducer, // Correct reducer for products
  anotherUnifiedSales: persistedSalesUnifiedReducer,
  aggregateSales: persistedAggregateSalesReducer,
  locations: persistedlocationsReducer,
  inventories: persistedinventoriesReducer, // Correct reducer for inventories
  alerts: persistedalertsReducer, // Correct reducer for alerts
  auditlogs: persistedAuditLogReducer,
  inventoryAdjustments: persistedInventoryAdjustmentReducer, // Correct reducer for audit logs
  purchaseOrders: persistedpurchaseOrderReducer, // Correct reducer for purchase orders
  stockMovements: persistedstockMovementReducer, // Correct reducer for stock movements
  salesTransactions: persistedsalesTransactionReducer, // Correct reducer for stock movements
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
