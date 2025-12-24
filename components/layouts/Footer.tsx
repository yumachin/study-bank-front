'use client';

import { Timer, Wallet, BarChart3, Settings } from 'lucide-react';
import { APP_VIEWS, AppView } from '../../types/index';

interface BottomNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Footer = ({
  currentView,
  setView,
}: BottomNavProps) => {
  const navItems = [
    { view: APP_VIEWS.TIMER, icon: Timer, label: 'Timer' },
    { view: APP_VIEWS.WALLET, icon: Wallet, label: 'Wallet' },
    { view: APP_VIEWS.DASHBOARD, icon: BarChart3, label: 'Stats' },
    { view: APP_VIEWS.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-6 pt-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-md items-center justify-between pb-4">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          const Icon = item.icon;

          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
                isActive
                  ? 'text-indigo-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              type="button"
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span
                className={`text-xs font-medium ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
