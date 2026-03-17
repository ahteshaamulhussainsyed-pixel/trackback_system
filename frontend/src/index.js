// ─────────────────────────────────────────────
// src/index.js  –  React Entry Point
// This is where React starts up
// ─────────────────────────────────────────────

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Mount the React app into the <div id="root"> in index.html
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);