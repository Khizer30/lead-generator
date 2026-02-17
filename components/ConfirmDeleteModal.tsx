import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 pointer-events-auto">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-red-100 bg-red-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600" />
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
          </div>
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors inline-flex items-center gap-2"
          >
            <Trash2 size={15} />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
