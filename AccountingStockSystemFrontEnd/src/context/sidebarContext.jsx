import { createContext, useReducer } from "react";
import reducer from "../reducer/sidebarReducer";
import PropTypes from "prop-types";

const initialState = {
  isSidebarOpen: false,
  isDrawerOpen: false,
  isUploadMode: false,
};

export const SidebarContext = createContext({});
export const SidebarProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const toggleSidebar = () => dispatch({ type: "TOGGLE_SIDEBAR" });
  const toggleDrawer = (open, uploadMode = false) => {
    dispatch({ type: "SET_DRAWER_OPEN", payload: { open, uploadMode } });
  };
  return (
    <SidebarContext.Provider
      value={{
        ...state,
        toggleSidebar,
        toggleDrawer,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

SidebarProvider.propTypes = {
  children: PropTypes.node,
};
