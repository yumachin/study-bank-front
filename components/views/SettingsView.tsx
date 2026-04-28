"use client";

import { useState } from "react";
import { APP_VIEWS, UserSettings } from "@/types";
import { Save } from "lucide-react";
import { Button } from "../ui/Button ";
import { Heading } from "../ui/Heading";

type SettingsViewProps = {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
};

export const SettingsView = ({
  settings,
  onUpdateSettings,
}: SettingsViewProps) => {
  const [_, setUser] = useState(null);
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

  const handleSave2 = async() => {
    try {
      const res = await fetch("http://localhost:8080/api/users/me")
      const user = await res.json()
      return user
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const handleSave3 = async() => {
    try {
      const user = await handleSave2()
      console.log("Fetched user:", user)
      setUser(user)
    } catch (error) {
      console.error("Error in handleSave3:", error);
    }
  }


  return (
    <div className="p-6 pb-24 space-y-6 max-w-md mx-auto">
      <Heading currentView={APP_VIEWS.SETTINGS} />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex flex-col justify-center gap-2">
          <h2 className="font-bold text-slate-700">時給 (¥)</h2>
          <p className="text-xs text-slate-500 mb-3">
            残高がどれくらいの速さで増えるかが決まります。
          </p>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-6">
          <div>
            

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

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs text-amber-800 font-medium">
              注意: レートの変更は今後の勉強セッションにのみ影響します。現在の残高は変更されません。
            </p>
          </div>

          <Button type="submit" fullWidth size="lg" onClick={handleSave3}>
            <Save size={18} className="mr-2" />
            保存
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
