import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: "danger" | "warning" | "default";
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  cancelText = "Bekor qilish",
  confirmText = "Tasdiqlash",
  confirmVariant = "danger",
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const confirmButtonStyles = {
    danger: "bg-red-500 hover:bg-red-600",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    default: "bg-brand-500 hover:bg-brand-600",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-400 mb-6">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all font-semibold"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg text-white transition-all font-semibold ${confirmButtonStyles[confirmVariant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
