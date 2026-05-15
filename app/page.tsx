"use client";

import { useState, useEffect } from "react";
import { loadState, saveState, recalculateTotals } from "@/services/storageService";
import { AppState, APP_VIEWS, AppView, StudySession, Transaction, UserSettings } from "@/types";
import { Footer } from "@/components/layouts/Footer";
import { TimerView } from "@/components/views/TimerView";
import { WalletView } from "@/components/views/WalletView";
import { AnalysisView } from "@/components/views/AnalysisView";
import { SettingsView } from "@/components/views/SettingsView";
import { Header } from "@/components/layouts/Header";

// Simple ID generator (client-safe)
const generateId = () =>
  Math.random().toString(36).substring(2, 11);

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>(APP_VIEWS.TIMER);
  const [state, setState] = useState<AppState>(() => {
    const loaded = loadState();
    const { balance, earned, spent } = recalculateTotals(loaded.transactions);

    if (balance !== loaded.balance) {
      return {
        ...loaded,
        balance,
        totalEarned: earned,
        totalSpent: spent,
      };
    }

    return loaded;
  });
  
  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const handleSessionComplete = (durationSeconds: number, earnings: number) => {
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

  const handleUpdateSettings = ( newSettings: UserSettings ) => {
    setState((prev) => ({ ...prev, settings: newSettings }));
  };

  if (!state) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-24">
      <Header />
      <main className="h-full">
        {currentView === APP_VIEWS.TIMER && (
          <TimerView
            settings={state.settings}
            onSessionComplete={handleSessionComplete}
            onNavigateToWallet={() => setCurrentView(APP_VIEWS.WALLET)}
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

        {currentView === APP_VIEWS.ANALYSIS && (
          <AnalysisView
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
