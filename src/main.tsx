import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";

/**
 * React uygulamasının giriş noktası
 * - StrictMode: Development'ta potansiyel sorunları tespit eder
 * - ErrorBoundary: Uygulama genelinde hataları yakalar
 */
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
