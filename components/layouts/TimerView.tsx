"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, AlertCircle, TrendingUp } from "lucide-react";
import { UserSettings } from "@/types";
import { Button } from "../ui/Button ";

type TimerViewProps = {
  settings: UserSettings;
  onSessionComplete: (durationSeconds: number, earnings: number) => void;
};

export const TimerView = ({
  settings,
  onSessionComplete,
}: TimerViewProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  // const [currentEarnings, setCurrentEarnings] = useState<number>(0);

  // Hold interval ID
  const intervalRef = useRef<number | null>(null);

  /**
   * Calculate earnings when time or rate changes
   * Formula: (seconds / 3600) * hourlyRate
   */
  // useEffect(() => {
  //   const earnings =
  //     (elapsedSeconds / 3600) * settings.hourlyRate;
  //   setCurrentEarnings(earnings);
  // }, [elapsedSeconds, settings.hourlyRate]);
  const currentEarnings = (elapsedSeconds / 3600) * settings.hourlyRate;

  /**
   * Timer start / stop logic
   */
  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
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

  const toggleTimer = () => {
    setIsActive((prev) => !prev);
  };

  const stopTimer = () => {
    if (elapsedSeconds <= 0) return;

    const confirmed = window.confirm(
      "Finish this study session and collect your earnings?"
    );

    if (!confirmed) return;

    setIsActive(false);

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    onSessionComplete(elapsedSeconds, currentEarnings);
    setElapsedSeconds(0);
    // setCurrentEarnings(0);
  };

  /**
   * Format seconds -> HH:MM:SS
   */
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-6 space-y-8 animate-in fade-in duration-500">
      {/* Rate Display */}
      <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm border border-indigo-100">
        <TrendingUp size={16} />
        <span>
          Current Rate: ¥
          {settings.hourlyRate.toLocaleString()} / hr
        </span>
      </div>

      {/* Earnings */}
      <div className="text-center space-y-2 w-full max-w-sm">
        <div className="text-slate-500 text-sm font-medium tracking-wide uppercase">
          Current Earnings
        </div>

        <div className="relative">
          <div
            className={`text-6xl sm:text-7xl font-mono font-bold tracking-tighter transition-colors duration-300 ${
              isActive ? "text-emerald-600" : "text-slate-800"
            }`}
          >
            ¥{Math.floor(currentEarnings).toLocaleString()}
          </div>

          {/* Decimal animation */}
          <div className="text-lg text-slate-400 font-mono font-medium absolute -bottom-6 right-0 left-0">
            .{(currentEarnings % 1).toFixed(2).substring(2)}
          </div>
        </div>
      </div>

      {/* Timer */}
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
            {formatTime(elapsedSeconds)}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 w-full max-w-xs">
        {isActive ? (
          <Button
            variant="secondary"
            size="xl"
            fullWidth
            onClick={toggleTimer}
            className="shadow-emerald-200 shadow-lg"
          >
            <Pause className="mr-2" /> Pause
          </Button>
        ) : (
          <Button
            variant="primary"
            size="xl"
            fullWidth
            onClick={toggleTimer}
            className={
              elapsedSeconds > 0
                ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
                : "shadow-indigo-200 shadow-lg"
            }
          >
            <Play className="mr-2" />
            {elapsedSeconds > 0 ? "Resume" : "Start"}
          </Button>
        )}

        {elapsedSeconds > 0 && (
          <Button
            variant="danger"
            size="xl"
            onClick={stopTimer}
            className="w-auto px-6"
            title="Stop & Save"
          >
            <Square fill="currentColor" />
          </Button>
        )}
      </div>

      {/* Tip */}
      <div className="mt-8 text-xs text-slate-400 flex items-center gap-1 max-w-xs text-center leading-relaxed">
        <AlertCircle size={12} />
        <span>
          Keep this tab open to track time. Background tracking
          may be limited by your browser.
        </span>
      </div>
    </div>
  );
};
