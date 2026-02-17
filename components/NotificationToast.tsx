import { BellRing, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import React, { useEffect } from "react";

type NotificationToastProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  durationMs?: number;
};

const TYPE_STYLES: Record<NonNullable<NotificationToastProps["type"]>, string> = {
  success: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white",
  error: "bg-gradient-to-r from-red-600 to-rose-600 text-white",
  info: "bg-gradient-to-r from-slate-800 to-slate-700 text-white"
};

const TYPE_ICON: Record<NonNullable<NotificationToastProps["type"]>, React.ReactNode> = {
  success: <CheckCircle2 size={16} />,
  error: <AlertTriangle size={16} />,
  info: <Info size={16} />
};

const NotificationToast: React.FC<NotificationToastProps> = ({
  isOpen,
  title = "Notification",
  message,
  type = "info",
  onClose,
  durationMs = 4500
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, isOpen, onClose]);

  if (!isOpen || !message) return null;

  return (
    <div className="fixed top-4 right-4 z-[130] w-[calc(100%-2rem)] max-w-md">
      <div className={`rounded-2xl px-4 py-3 shadow-2xl border border-white/20 ${TYPE_STYLES[type]}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex items-center gap-2">
            <BellRing size={16} />
            {TYPE_ICON[type]}
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider opacity-90">{title}</p>
            <p className="text-sm font-semibold mt-0.5">{message}</p>
          </div>
          <button type="button" className="opacity-80 hover:opacity-100 transition-opacity" onClick={onClose}>
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
