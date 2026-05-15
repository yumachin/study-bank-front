"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button ";
import { DEFAULT_SESSION_NOTE } from "@/lib/constants";
import { ModalDismissCheckbox } from "./ModalDismissCheckbox";
import {
  StudyNoteHistoryPicker,
} from "./StudyNoteHistoryPicker";

type SessionStartModalProps = {
  isOpen: boolean;
  studyNoteHistory: string[];
  onConfirm: (note: string, hideInFuture: boolean) => void;
  onCancel: () => void;
  onRemoveStudyNote: (note: string) => void;
};

export function SessionStartModal({
  isOpen,
  studyNoteHistory,
  onConfirm,
  onCancel,
  onRemoveStudyNote,
}: SessionStartModalProps) {
  const [note, setNote] = useState("");
  const [hideInFuture, setHideInFuture] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNote("");
      setHideInFuture(false);
    }
  }, [isOpen]);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = note.trim();
    onConfirm(trimmed.length > 0 ? trimmed : DEFAULT_SESSION_NOTE, hideInFuture);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-start-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-indigo-950/30 backdrop-blur-sm"
        aria-label="閉じる"
        onClick={onCancel}
      />

      <div className="relative z-10 w-full max-w-sm overflow-visible animate-in zoom-in-95 fade-in duration-300">
        <form
          onSubmit={handleSubmit}
          className="overflow-visible rounded-3xl border border-indigo-100 bg-linear-to-b from-white to-indigo-50 p-8 shadow-2xl shadow-indigo-200/50"
        >
          <p className="mb-3 text-center text-4xl" aria-hidden>
            📚
          </p>
          <h2
            id="session-start-title"
            className="text-center text-xl font-bold text-slate-800"
          >
            どんな学習をしますか？
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            履歴に表示される名前を入力してください
          </p>

          <label className="mt-6 block">
            <span className="sr-only">学習内容</span>
            <input
              type="text"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="例: 英語、プログラミング、数学"
              className="w-full rounded-xl text-sm border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              autoFocus
              maxLength={50}
            />
          </label>

          <StudyNoteHistoryPicker
            history={studyNoteHistory}
            onSelect={setNote}
            onRemove={onRemoveStudyNote}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="mt-12 !font-bold"
          >
            開始する
          </Button>

          <ModalDismissCheckbox
            id="session-start-hide"
            checked={hideInFuture}
            onChange={setHideInFuture}
          />
        </form>
      </div>
    </div>
  );
}
