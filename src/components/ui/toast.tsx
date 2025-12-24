"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) {
  const config = {
    success: {
      icon: <CheckCircle className="w-6 h-6" />,
      gradient: "from-green-500 to-emerald-500",
      bg: "from-green-50 to-emerald-50",
      border: "border-green-300",
      text: "text-green-900",
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
    },
    error: {
      icon: <XCircle className="w-6 h-6" />,
      gradient: "from-red-500 to-pink-500",
      bg: "from-red-50 to-pink-50",
      border: "border-red-300",
      text: "text-red-900",
      iconBg: "bg-gradient-to-br from-red-500 to-pink-500",
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6" />,
      gradient: "from-orange-500 to-amber-500",
      bg: "from-orange-50 to-amber-50",
      border: "border-orange-300",
      text: "text-orange-900",
      iconBg: "bg-gradient-to-br from-orange-500 to-amber-500",
    },
    info: {
      icon: <AlertCircle className="w-6 h-6" />,
      gradient: "from-purple-500 to-pink-500",
      bg: "from-purple-50 to-pink-50",
      border: "border-purple-300",
      text: "text-purple-900",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
  };

  const style = config[toast.type];

  return (
    <div
      className={`
        relative bg-gradient-to-r ${style.bg} border-2 ${style.border}
        rounded-xl shadow-lg p-4 min-w-[320px] max-w-md
        animate-slideInRight
        hover:shadow-xl transition-all duration-300
      `}
    >
      {/* Gradient top border */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.gradient} rounded-t-xl`}></div>

      <div className="flex items-start gap-3 mt-1">
        {/* Icon */}
        <div
          className={`${style.iconBg} rounded-lg p-2 flex items-center justify-center text-white flex-shrink-0 shadow-md`}
        >
          {style.icon}
        </div>

        {/* Message */}
        <div className={`flex-1 ${style.text} font-medium pt-1`}>
          {toast.message}
        </div>

        {/* Close button */}
        <button
          onClick={onRemove}
          className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
