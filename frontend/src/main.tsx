import { createRoot } from "react-dom/client";
import App from "./pages/App";
import { ToastProvider } from "./context/toast-context";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <App />
  </ToastProvider>,
);
