"use client";

import { useState } from "react";
import { UserSettings } from "@/types";
import { Save, DollarSign } from "lucide-react";
import { Button } from "../ui/Button ";

type SettingsViewProps = {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
};

export const SettingsView = ({
  settings,
  onUpdateSettings,
}: SettingsViewProps) => {
  const [hourlyRate, setHourlyRate] = useState<string>(
    settings.hourlyRate.toString()
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rate = Number(hourlyRate);

    if (!Number.isNaN(rate) && rate > 0) {
      onUpdateSettings({
        ...settings,
        hourlyRate: rate,
      });

      alert("Settings saved successfully!");
    } else {
      alert("Please enter a valid positive number.");
    }
  };

  return (
    <div className="p-6 pb-24 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm">
          Customize your experience
        </p>
      </header>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2">
          <DollarSign size={18} className="text-slate-400" />
          <h2 className="font-bold text-slate-700">Value of Time</h2>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-6">
          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hourly Wage (¥)
            </label>
            <p className="text-xs text-slate-500 mb-3">
              How much is one hour of your study time worth? This determines how
              fast your balance grows.
            </p>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">
                ¥
              </span>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-lg"
              />
            </div>
          </div>

          {/* Note */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs text-amber-800 font-medium">
              Note: Changing the rate only affects future study sessions. Your
              current balance will remain unchanged.
            </p>
          </div>

          {/* Save Button */}
          <Button type="submit" fullWidth size="lg">
            <Save size={18} className="mr-2" />
            Save Changes
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-300 mt-8">
        StudyBank v1.0.0
        <br />
        Concept MVP
      </div>
    </div>
  );
};
