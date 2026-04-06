import { Toaster } from "react-hot-toast";

export default function ToasterHost() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "rgba(15, 23, 42, 0.85)",
          color: "#e2e8f0",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          backdropFilter: "blur(10px)",
        },
      }}
    />
  );
}

