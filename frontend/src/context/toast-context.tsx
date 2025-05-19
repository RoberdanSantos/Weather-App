import { createContext, useContext, useState } from "react";
import { ToastContextType, ToastOptions, Toast } from "@/types/genereic-types";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({
    title,
    description,
    variant = "default",
    duration = 4000,
  }: ToastOptions) => {
    const id = crypto.randomUUID();

    setToasts((prev) => [
      ...prev,
      { id, title, description, variant, duration },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-6 rounded shadow-md text-white ${
              t.variant === "success"
                ? "bg-green-600"
                : t.variant === "error" || t.variant === "destructive"
                  ? "bg-red-600"
                  : "bg-sky-600"
            }`}
          >
            <strong>{t.title}</strong>
            {t.description && <p className="text-sm">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
