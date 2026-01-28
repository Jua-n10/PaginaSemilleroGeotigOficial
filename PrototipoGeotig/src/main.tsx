import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { app } from "./firabase.ts"; // 👈 agrega esto
console.log("Firebase listo:", app); // 👈 y esto

createRoot(document.getElementById("root")!).render(<App />);
