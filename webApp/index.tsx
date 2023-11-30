import { createRoot } from "react-dom/client";

import "./index.css";

import("./app").then(({ App }) => {
  const rootElement = document.getElementById("billpath")!;
  rootElement.innerHTML = "";

  createRoot(rootElement).render(<App />);
  rootElement.removeAttribute("class");
});