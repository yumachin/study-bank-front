"use client";

import { useState, useEffect } from "react";
import {
  loadState,
  saveState,
  recalculateTotals,
} from "@/services/storageService";
import {
  AppState,
  APP_VIEWS,
  AppView,
  StudySession,
  Transaction,
  UserSettings,
} from "@/types";
import { Footer } from "@/components/layouts/Footer";
import { TimerView } from "@/components/layouts/TimerView";
import { WalletView } from "@/components/layouts/WalletView";
import { DashboardView } from "@/components/layouts/DashboardView";
import { SettingsView } from "@/components/layouts/SettingsView";

// Simple ID generator (client-safe)
const generateId = () =>
  Math.random().toString(36).substring(2, 11);

export default function HomePage() {
  const [state, setState] = useState<AppState | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(
    APP_VIEWS.TIMER
  );
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Load persisted state (client only)
   */
  useEffect(() => {
    const loaded = loadState();

    // Verify totals
    const { balance, earned, spent } =
      recalculateTotals(loaded.transactions);

    if (balance !== loaded.balance) {
      console.warn("Recalculating corrupted balance...");
      loaded.balance = balance;
      loaded.totalEarned = earned;
      loaded.totalSpent = spent;
    }

    // setState(loaded);
    // setIsLoaded(true);
  }, []);

  /**
   * Persist state on change
   */
  useEffect(() => {
    if (isLoaded && state) {
      saveState(state);
    }
  }, [state, isLoaded]);

  /**
   * Timer completed
   */
  const handleSessionComplete = (
    durationSeconds: number,
    earnings: number
  ) => {
    if (!state) return;

    const now = Date.now();

    const newSession: StudySession = {
      id: generateId(),
      startTime: now - durationSeconds * 1000,
      endTime: now,
      durationSeconds,
      earnings,
      hourlyRateSnapshot: state.settings.hourlyRate,
    };

    const newTransaction: Transaction = {
      id: generateId(),
      amount: earnings,
      type: "EARN",
      note: "Study Session",
      createdAt: now,
    };

    setState((prev) =>
      prev
        ? {
            ...prev,
            balance: prev.balance + earnings,
            totalEarned: prev.totalEarned + earnings,
            sessions: [...prev.sessions, newSession],
            transactions: [
              ...prev.transactions,
              newTransaction,
            ],
          }
        : prev
    );
  };

  /**
   * Withdraw money
   */
  const handleWithdraw = (amount: number, note: string) => {
    if (!state) return;

    const newTransaction: Transaction = {
      id: generateId(),
      amount,
      type: "SPEND",
      note,
      createdAt: Date.now(),
    };

    setState((prev) =>
      prev
        ? {
            ...prev,
            balance: prev.balance - amount,
            totalSpent: prev.totalSpent + amount,
            transactions: [
              ...prev.transactions,
              newTransaction,
            ],
          }
        : prev
    );
  };

  /**
   * Update settings
   */
  const handleUpdateSettings = (
    newSettings: UserSettings
  ) => {
    setState((prev) =>
      prev
        ? {
            ...prev,
            settings: newSettings,
          }
        : prev
    );
  };

  // Loading (SSR-safe)
  if (!isLoaded || !state) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <main className="h-full">
        {currentView === APP_VIEWS.TIMER && (
          <TimerView
            settings={state.settings}
            onSessionComplete={handleSessionComplete}
          />
        )}

        {currentView === APP_VIEWS.WALLET && (
          <WalletView
            balance={state.balance}
            totalEarned={state.totalEarned}
            transactions={state.transactions}
            onWithdraw={handleWithdraw}
          />
        )}

        {currentView === APP_VIEWS.DASHBOARD && (
          <DashboardView
            sessions={state.sessions}
            totalEarned={state.totalEarned}
          />
        )}

        {currentView === APP_VIEWS.SETTINGS && (
          <SettingsView
            settings={state.settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

      <Footer
        currentView={currentView}
        setView={setCurrentView}
      />
    </div>
  );
}
