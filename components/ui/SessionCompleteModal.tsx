"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button ";
import { ModalDismissCheckbox } from "./ModalDismissCheckbox";

type SessionCompleteModalProps = {
  isOpen: boolean;
  earningsYen: number;
  onConfirm: (hideInFuture: boolean) => void;
};

export function SessionCompleteModal({
  isOpen,
  earningsYen,
  onConfirm,
}: SessionCompleteModalProps) {
  const [hideInFuture, setHideInFuture] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHideInFuture(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onConfirm(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onConfirm]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-complete-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-indigo-950/30 backdrop-blur-sm"
        aria-label="閉じる"
        onClick={() => onConfirm(false)}
      />

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <span className="session-sparkle session-sparkle-1">✨</span>
        <span className="session-sparkle session-sparkle-2">⭐</span>
        <span className="session-sparkle session-sparkle-3">✨</span>
        <span className="session-sparkle session-sparkle-4">💫</span>
        <span className="session-sparkle session-sparkle-5">✨</span>
      </div>

      <div className="relative w-full max-w-sm animate-in zoom-in-95 fade-in duration-300">
        <div className="rounded-3xl border border-indigo-100 bg-linear-to-b from-white to-indigo-50 p-8 text-center shadow-2xl shadow-indigo-200/50">
          <p
            className="mb-3 text-5xl animate-bounce"
            style={{ animationDuration: "1.2s" }}
            aria-hidden
          >
            ✨
          </p>
          <h2
            id="session-complete-title"
            className="text-2xl font-bold text-slate-800"
          >
            お疲れ様でした！
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            しっかり記帳できました。
          </p>

          <p className="mt-6 font-mono text-3xl font-bold text-emerald-600">
            +¥{earningsYen.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-400">収支に追加しました</p>

          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            className="mt-8 !font-bold"
            onClick={() => onConfirm(hideInFuture)}
          >
            進む
          </Button>

          <ModalDismissCheckbox
            id="session-complete-hide"
            checked={hideInFuture}
            onChange={setHideInFuture}
          />
        </div>
      </div>
    </div>
  );
}
