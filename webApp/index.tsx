import { createRoot } from "react-dom/client";

import "./index.css";

import("./app").then(({ App }) => {
  const rootElement = document.getElementById("billpath")!;

  rootElement.removeAttribute("class");
  rootElement.innerHTML = "";

  createRoot(rootElement).render(<App />);
});