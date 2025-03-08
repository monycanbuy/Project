import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import authReducer from "../slices/authSlice";

const persistConfig = {
  key: "auth",
  storage,
  blacklist: ["isVerifyingCode", "verificationMessage", "verificationError"], // Example
  whitelist: ["user", "isAuthenticated", "isVerified", "email", "roles"],
  debug: true,
};
const authReducer = (state, action) => {
  if (action.type === "persist/REHYDRATE") {
    const incoming = action.payload.auth;
    if (incoming) {
      state = {
        ...state,
        user: incoming.user || state.user,
        isAuthenticated: incoming.isAuthenticated || state.isAuthenticated,
        // ... handle other fields
      };
    }
  }
  return persistedAuthReducer(state, action); // Forward to the persisted reducer
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
export default persistedAuthReducer;
