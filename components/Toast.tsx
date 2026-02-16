import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import React, { useEffect } from "react";

type ToastType = "success" | "error" | "info";

type ToastProps = {
  isOpen: boolean;
  type?: ToastType;
  message: string;
  onClose: () => void;
  durationMs?: number;
};

const TOAST_STYLES: Record<ToastType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-red-200 bg-red-50 text-red-700",
  info: "border-blue-200 bg-blue-50 text-blue-700"
};

const ToastIcon: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={16} />,
  error: <AlertCircle size={16} />,
  info: <Info size={16} />
};

const Toast: React.FC<ToastProps> = ({ isOpen, type = "info", message, onClose, durationMs = 3500 }) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, isOpen, onClose]);

  if (!isOpen || !message) return null;

  return (
    <div className="fixed top-4 right-4 z-[120] max-w-sm w-[calc(100%-2rem)] sm:w-full">
      <div className={`border rounded-xl px-4 py-3 shadow-lg flex items-start gap-2 ${TOAST_STYLES[type]}`}>
        <span className="mt-0.5">{ToastIcon[type]}</span>
        <p className="text-sm font-semibold flex-1">{message}</p>
        <button type="button" onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
