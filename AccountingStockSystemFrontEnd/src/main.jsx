// main.jsx
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material"; // Optional: Normalize CSS
import App from "./App.jsx";
import { SidebarProvider } from "./context/sidebarContext.jsx";
import store, { persistor } from "./redux/store.js"; // Adjust path if needed
import { CircularProgress, Box } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#2e7d32" }, // Green for spinner
    background: { default: "#1a1a1a" }, // Dark background
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate
      loading={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background:
              "linear-gradient(114.07deg, rgba(57, 53, 51, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
          }}
        >
          <CircularProgress color="#fe6c00" size={60} />
        </Box>
      }
      persistor={persistor}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Optional: Ensures consistent styling */}
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
