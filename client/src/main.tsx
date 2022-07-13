import "normalize.css";
import App from "App";
import React from "react";
import type {} from "styled-components/cssprop";
import { createRoot } from "react-dom/client";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
