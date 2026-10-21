
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./redux/store";
import { AppearanceProvider } from "./context/AppearanceContext";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppearanceProvider>
        <App />
      </AppearanceProvider>
    </Provider>
  </StrictMode>
);
