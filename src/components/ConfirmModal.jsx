import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận thao tác", 
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "primary" // primary, danger, warning
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    primary: {
      icon: "bg-teal-50 text-teal-600",
      button: "bg-teal-600 hover:bg-teal-700 shadow-teal-100",
    },
    danger: {
      icon: "bg-red-50 text-red-600",
      button: "bg-red-600 hover:bg-red-700 shadow-red-100",
    },
    warning: {
      icon: "bg-amber-50 text-amber-600",
      button: "bg-amber-600 hover:bg-amber-700 shadow-amber-100",
    }
  };

  const config = typeConfig[type] || typeConfig.primary;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl transition-all animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-slate-50 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] ${config.icon}`}>
            <AlertCircle size={40} strokeWidth={1.5} />
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
            {title}
          </h3>
          
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            {message}
          </p>

          <div className="grid w-full grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white py-4 font-bold text-slate-600 transition hover:bg-slate-50 active:scale-95"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`rounded-2xl py-4 font-bold text-white shadow-lg transition active:scale-95 ${config.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
