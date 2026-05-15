"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

const DELETE_ACTION_WIDTH_PX = 64;
const SWIPE_OPEN_THRESHOLD_PX = 32;
const DROPDOWN_MAX_HEIGHT_PX = 150;

export const STUDY_NOTE_HISTORY_LABEL = "過去の履歴名から選択する";

type StudyNoteHistoryPickerProps = {
  history: string[];
  onSelect: (note: string) => void;
  onRemove: (note: string) => void;
};

type SwipeableRowProps = {
  label: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: () => void;
  onDelete: () => void;
};

function SwipeableHistoryRow({
  label,
  isOpen,
  onOpen,
  onClose,
  onSelect,
  onDelete,
}: SwipeableRowProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const didSwipe = useRef(false);

  const displayOffset =
    isOpen && dragOffset === 0
      ? -DELETE_ACTION_WIDTH_PX
      : dragOffset;

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dragStartX.current = event.clientX;
    dragStartOffset.current = isOpen
      ? -DELETE_ACTION_WIDTH_PX
      : dragOffset;
    didSwipe.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const deltaX = event.clientX - dragStartX.current;
    if (Math.abs(deltaX) > 4) {
      didSwipe.current = true;
    }
    const next = Math.max(
      -DELETE_ACTION_WIDTH_PX,
      Math.min(0, dragStartOffset.current + deltaX)
    );
    setDragOffset(next);
    if (!isOpen && next < -SWIPE_OPEN_THRESHOLD_PX) {
      onOpen();
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (isOpen) {
      if (dragOffset > -SWIPE_OPEN_THRESHOLD_PX) {
        onClose();
      }
      setDragOffset(0);
      return;
    }

    if (dragOffset < -SWIPE_OPEN_THRESHOLD_PX) {
      onOpen();
    } else {
      onClose();
    }
    setDragOffset(0);
  };

  const handleRowClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (didSwipe.current || isOpen) {
      return;
    }
    onSelect();
  };

  return (
    <div className="relative overflow-hidden border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
        className="absolute inset-y-0 right-0 z-0 flex w-16 items-center justify-center bg-red-500 text-white"
        aria-label={`${label}を削除`}
      >
        <X size={18} />
      </button>
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleRowClick}
        style={{ transform: `translateX(${displayOffset}px)` }}
        className="relative z-10 w-full touch-pan-y bg-white px-4 py-3.5 text-left text-sm font-medium text-slate-700 transition-transform active:bg-indigo-50"
      >
        {label}
      </button>
    </div>
  );
}

export function StudyNoteHistoryPicker({
  history,
  onSelect,
  onRemove,
}: StudyNoteHistoryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDownOutside = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setOpenRowIndex(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDownOutside);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDownOutside);
  }, [isOpen]);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen((prev) => !prev);
    setOpenRowIndex(null);
  };

  return (
    <div ref={containerRef} className="relative mt-3">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 py-3 text-left text-sm transition-all ${
          isOpen
            ? "border-indigo-400 ring-2 ring-indigo-100"
            : "border-slate-200 hover:border-indigo-200"
        }`}
      >
        <span className={history.length === 0 ? "text-slate-400" : "text-slate-600"}>
          {STUDY_NOTE_HISTORY_LABEL}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/80 animate-in fade-in slide-in-from-top-1 duration-150"
          style={{ maxHeight: DROPDOWN_MAX_HEIGHT_PX }}
        >
          {history.length === 0 ? (
            <p className="px-4 py-4 text-center text-sm text-slate-400">
              履歴はまだありません
            </p>
          ) : (
            <div
              className="overflow-y-auto overscroll-contain"
              style={{ maxHeight: DROPDOWN_MAX_HEIGHT_PX }}
            >
              {history.map((item, index) => (
                <SwipeableHistoryRow
                  key={item}
                  label={item}
                  isOpen={openRowIndex === index}
                  onOpen={() => setOpenRowIndex(index)}
                  onClose={() => setOpenRowIndex(null)}
                  onSelect={() => {
                    onSelect(item);
                    setIsOpen(false);
                    setOpenRowIndex(null);
                  }}
                  onDelete={() => {
                    onRemove(item);
                    setOpenRowIndex(null);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
