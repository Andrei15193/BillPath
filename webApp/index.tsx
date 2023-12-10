import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import("./app").then(({ WebApp }) => {
  createRoot(document.getElementById("billpath")!).render(React.createElement(WebApp));
});