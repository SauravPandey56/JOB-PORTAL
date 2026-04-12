import { Toaster } from "react-hot-toast";

export default function ToasterHost() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#ffffff",
          color: "#0F172A",
          border: "1px solid #e2e8f0",
          boxShadow: "0 12px 40px rgba(15, 23, 42, 0.1)",
        },
        success: { iconTheme: { primary: "#2563EB", secondary: "#fff" } },
        error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
      }}
    />
  );
}
