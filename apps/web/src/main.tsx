import TimeAgo from "javascript-time-ago";
import "normalize.css";
import React from "react";
import { createRoot } from "react-dom/client";
import type {} from "styled-components/cssprop";
import App from "~/App";

import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
