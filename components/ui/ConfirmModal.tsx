"use client";

import { useEffect } from "react";
import { Button } from "./Button ";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "はい",
  cancelLabel = "いいえ",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        aria-label="閉じる"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-indigo-100/40 animate-in zoom-in-95 duration-200">
        <p className="mb-2 text-center text-3xl" aria-hidden>
          📝
        </p>
        <h2
          id="confirm-modal-title"
          className="text-center text-lg font-bold text-slate-800"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-center text-sm text-slate-500">{description}</p>
        ) : null}

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            className="!font-bold text-xs"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            className="!font-bold text-xs"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
