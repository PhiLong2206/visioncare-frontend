import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,
            style: {
              borderRadius: "14px",
              background: "#0f172a",
              color: "#fff",
              padding: "14px 16px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#14b8a6",
                secondary: "#fff",
              },
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);