export default function reducer(state, action) {
  console.log("Reducer action:", action);
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case "SET_DRAWER_OPEN":
      return {
        ...state,
        isDrawerOpen: action.payload.open,
        isUploadMode: action.payload.uploadMode,
      };
    default:
      return state;
  }
}
