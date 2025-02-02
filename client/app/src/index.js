import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

export const serverURL = "http://127.0.0.1:8000/api";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
