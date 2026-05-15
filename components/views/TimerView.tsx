"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, AlertCircle, TrendingUp } from "lucide-react";
import { UserSettings } from "@/types";
import { Button } from "../ui/Button ";
import { ConfirmModal } from "../ui/ConfirmModal";

type TimerViewProps = {
  settings: UserSettings;
  onSessionComplete: (durationSeconds: number, earnings: number) => void;
  onNavigateToWallet: () => void;
};

export const TimerView = ({
  settings,
  onSessionComplete,
  onNavigateToWallet,
}: TimerViewProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [passedSeconds, setPassedSeconds] = useState<number>(0);
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

  const stopTimer = () => {
    setIsActive((prev) => !prev);
  };

  const openModal = () => {
    setIsConfirmModalOpen(true)
    stopTimer()
  }

  const recordEarnings = () => {
    setIsActive(false);

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    onSessionComplete(passedSeconds, currentEarnings);
    setPassedSeconds(0);
    setIsConfirmModalOpen(false);
    onNavigateToWallet();
  };

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

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
            ¥{Math.floor(currentEarnings).toLocaleString()}
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
              isActive
                ? "text-indigo-600"
                : "text-slate-400"
            }`}
          >
            {formatTime(passedSeconds)}
          </div>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-4">
        {isActive ? (
          <Button
            variant="danger"
            size="xl"
            fullWidth
            onClick={stopTimer}
          >
            <Pause className="mr-2" /> 一時停止
          </Button>
        ) : (
          <Button
            variant="primary"
            size="xl"
            fullWidth
            onClick={stopTimer}
          >
            <Play className="mr-2" />
            {passedSeconds > 0 ? "再開" : "開始"}
          </Button>
        )}

        {passedSeconds > 0 && (
          <Button
            variant="secondary"
            size="xl"
            fullWidth
            onClick={openModal}
          >
            記帳する
          </Button>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="本当に記帳しますか？"
        description={`¥${Math.floor(currentEarnings).toLocaleString()} を収支に記録します。`}
        onConfirm={recordEarnings}
        onCancel={() => setIsConfirmModalOpen(false)}
      />

      <div className="mt-8 text-xs text-slate-400 flex items-center max-w-sm text-center leading-relaxed">
        <AlertCircle size={12} />
        <span>
          このタブを開いたまま、時間を計測してください。
        </span>
      </div>
    </div>
  );
};
