import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { syncPreferencesToDocumentElement } from "./state/syncPreferences";

// Apply saved theme and motion to <html> before the first render, then keep it in sync.
syncPreferencesToDocumentElement();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
