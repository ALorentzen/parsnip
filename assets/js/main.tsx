import React from "react";
import { createRoot } from "react-dom/client";
import Hello from "./components/Hello";

const el = document.getElementById("react-root");
if (el) createRoot(el).render(<Hello />);
