import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-[#FBE6EF] shadow-2xl space-y-4 relative scale-in-95 duration-150">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8C7582] hover:text-[#3D2C35] hover:bg-[#FFF0F5] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              variant === 'danger'
                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                : 'bg-amber-50 text-amber-600 border border-amber-100'
            }`}
          >
            {variant === 'danger' ? (
              <Trash2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-[#241A20]">{title}</h3>
            <p className="text-xs text-[#6B5563] mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F8D8E4]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-[#F0D5DF] text-xs font-semibold text-[#5D4753] hover:bg-[#FFF0F5] transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all cursor-pointer ${
              variant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700 hover:shadow-md'
                : 'bg-[#C4436A] hover:bg-[#A83254] hover:shadow-md'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
