"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  AlertCircle,
  TrendingUp,
  BanknoteArrowDown,
} from "lucide-react";
import { UserSettings } from "@/types";
import { DEFAULT_SESSION_NOTE } from "@/lib/constants";
import { Button } from "../ui/Button ";
import { ConfirmModal } from "../ui/ConfirmModal";
import { SessionStartModal } from "../ui/SessionStartModal";

type TimerViewProps = {
  settings: UserSettings;
  studyNoteHistory: string[];
  onUpdateSettings: (newSettings: UserSettings) => void;
  onAddStudyNote: (note: string) => void;
  onRemoveStudyNote: (note: string) => void;
  onSessionComplete: (
    durationSeconds: number,
    earnings: number,
    note: string
  ) => void;
  onNavigateToWallet: (earningsYen: number) => void;
};

export const TimerView = ({
  settings,
  studyNoteHistory,
  onUpdateSettings,
  onAddStudyNote,
  onRemoveStudyNote,
  onSessionComplete,
  onNavigateToWallet,
}: TimerViewProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hasSessionStarted, setHasSessionStarted] = useState<boolean>(false);
  const [passedSeconds, setPassedSeconds] = useState<number>(0);
  const [sessionNote, setSessionNote] = useState<string>(DEFAULT_SESSION_NOTE);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setPassedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive]);

  const currentEarnings = (passedSeconds / 3600) * settings.hourlyRate;
  const flooredEarnings = Math.floor(currentEarnings);

  const beginSession = (note: string) => {
    setSessionNote(note);
    setHasSessionStarted(true);
    setIsActive(true);
  };

  const handleStartClick = () => {
    if (settings.showSessionStartModal) {
      setIsStartModalOpen(true);
      return;
    }
    beginSession(DEFAULT_SESSION_NOTE);
  };

  const handleStartConfirm = (note: string, hideInFuture: boolean) => {
    if (hideInFuture) {
      onUpdateSettings({
        ...settings,
        showSessionStartModal: false,
      });
    }
    onAddStudyNote(note);
    beginSession(note);
    setIsStartModalOpen(false);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const openModal = () => {
    setIsActive(false);
    setIsConfirmModalOpen(true);
  };

  const recordEarnings = () => {
    setIsActive(false);

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    onSessionComplete(passedSeconds, flooredEarnings, sessionNote);
    setPassedSeconds(0);
    setHasSessionStarted(false);
    setSessionNote(DEFAULT_SESSION_NOTE);
    setIsConfirmModalOpen(false);
    onNavigateToWallet(flooredEarnings);
  };

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (number: number) => number.toString().padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-500">
      <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm border border-indigo-100">
        <TrendingUp size={16} />
        <span>
          現在のレート: ¥
          {settings.hourlyRate.toLocaleString()} / 時
        </span>
      </div>

      {hasSessionStarted && (
        <p className="text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
          {sessionNote}
        </p>
      )}

      <div className="text-center space-y-2 w-full max-w-sm">
        <div className="text-slate-500 text-sm font-bold tracking-wide uppercase">
          現在の収益
        </div>
        <div className="relative">
          <div
            className={`text-6xl sm:text-7xl font-mono font-bold tracking-tighter transition-colors duration-300 ${
              isActive ? "text-emerald-600" : "text-slate-800"
            }`}
          >
            ¥{flooredEarnings.toLocaleString()}
          </div>

          <div className="text-lg text-slate-400 font-mono font-medium absolute -bottom-6 right-0 left-0">
            .{(currentEarnings % 1).toFixed(2).substring(2)}
          </div>
        </div>
      </div>

      <div className="py-8 w-full max-w-xs flex justify-center">
        <div className="relative">
          {isActive && (
            <div className="absolute inset-0 rounded-full animate-ping bg-indigo-100 opacity-75 scale-125" />
          )}

          <div
            className={`text-4xl font-mono font-medium tabular-nums px-8 py-4 rounded-2xl bg-white shadow-xl border border-slate-100 z-10 relative ${
              isActive ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            {formatTime(passedSeconds)}
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm">
        {!hasSessionStarted ? (
          <Button variant="primary" size="xl" fullWidth onClick={handleStartClick}>
            <Play className="mr-2" />
            開始
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              variant={isActive ? "danger" : "primary"}
              size="xl"
              className="min-w-0 flex-1 text-xs font-bold"
              onClick={isActive ? pauseSession : resumeSession}
            >
              {isActive ? (
                <>
                  <Pause className="mr-2 shrink-0" />
                  一時停止
                </>
              ) : (
                <>
                  <Play className="mr-2 shrink-0" />
                  再開
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              size="xl"
              className="min-w-0 flex-1 text-xs font-bold"
              onClick={openModal}
            >
              <BanknoteArrowDown className="mr-2 shrink-0" />
              記帳
            </Button>
          </div>
        )}
      </div>

      <SessionStartModal
        isOpen={isStartModalOpen}
        studyNoteHistory={studyNoteHistory}
        onConfirm={handleStartConfirm}
        onCancel={() => setIsStartModalOpen(false)}
        onRemoveStudyNote={onRemoveStudyNote}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="本当に記帳しますか？"
        description={`「${sessionNote}」を ¥${flooredEarnings.toLocaleString()} で記録します。`}
        onConfirm={recordEarnings}
        onCancel={() => setIsConfirmModalOpen(false)}
      />

      <div className="mt-8 text-xs text-slate-400 flex items-center max-w-sm text-center leading-relaxed">
        <AlertCircle size={12} />
        <span>このタブを開いたまま時間を計測してください。</span>
        
      </div>
    </div>
  );
};
