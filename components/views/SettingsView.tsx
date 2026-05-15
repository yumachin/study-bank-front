"use client";

import { useEffect, useMemo, useState } from "react";
import { APP_VIEWS, UserSettings } from "@/types";
import { Save } from "lucide-react";
import { Button } from "../ui/Button ";
import { Heading } from "../ui/Heading";

const SECONDS_PER_HOUR = 60 * 60;

type SettingsViewProps = {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
};

/** 秒を「X時間Y分」風に整形（目標達成に必要な勉強時間の表示用） */
function formatDurationJapanese(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds / 60) * 60;
  const hours = Math.floor(rounded / SECONDS_PER_HOUR);
  const minutes = Math.round((rounded % SECONDS_PER_HOUR) / 60);
  if (hours === 0 && minutes === 0) {
    return "1分未満";
  }
  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}時間`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}分`);
  }
  return parts.join("") || "1分未満";
}

export const SettingsView = ({
  settings,
  onUpdateSettings,
}: SettingsViewProps) => {
  const [_, setUser] = useState(null);
  const [hourlyRate, setHourlyRate] = useState<string>(
    settings.hourlyRate.toString()
  );
  const [targetIncomeYen, setTargetIncomeYen] = useState<string>(
    settings.targetIncomeYen.toString()
  );

  useEffect(() => {
    setHourlyRate(settings.hourlyRate.toString());
    setTargetIncomeYen(settings.targetIncomeYen.toString());
  }, [settings.hourlyRate, settings.targetIncomeYen]);

  const requiredStudyPreview = useMemo(() => {
    const rate = Number(hourlyRate);
    const target = Number(targetIncomeYen);
    if (
      Number.isNaN(rate) ||
      Number.isNaN(target) ||
      rate <= 0 ||
      target <= 0
    ) {
      return null;
    }
    const seconds = (target / rate) * SECONDS_PER_HOUR;
    return formatDurationJapanese(seconds);
  }, [hourlyRate, targetIncomeYen]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rate = Number(hourlyRate);
    const target = Number(targetIncomeYen);

    if (Number.isNaN(rate) || rate <= 0) {
      alert("時給は正の数で入力してください。");
      return;
    }
    if (Number.isNaN(target) || target < 0) {
      alert("目標収入は0以上の数で入力してください。");
      return;
    }

    onUpdateSettings({
      ...settings,
      hourlyRate: rate,
      targetIncomeYen: target,
    });

    alert("設定を保存しました。");
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
    <div className="px-6 pb-24 space-y-6 max-w-md mx-auto">
      <Heading currentView={APP_VIEWS.SETTINGS} />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex flex-col justify-center gap-2">
          <h2 className="font-bold text-slate-700">時給 (¥)</h2>
          <p className="text-xs text-slate-500">
            残高がどれくらいの速さで増えるかが決まります。
          </p>
        </div>

        <form onSubmit={handleSave} className="px-5 pb-5 space-y-6">
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

          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              <h2 className="font-bold text-slate-700">目標月収 (¥)</h2>
              <p className="text-xs text-slate-500">
                目標を決めると、必要な勉強時間が分かります。
              </p>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">
                ¥
              </span>
              <input
                type="number"
                min={0}
                value={targetIncomeYen}
                onChange={(e) => setTargetIncomeYen(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-lg"
              />
            </div>
            {requiredStudyPreview ? (
              <p className="text-sm text-indigo-700 bg-indigo-50 rounded-xl px-3 py-2">
                必要な勉強時間:{" "}
                <span className="font-semibold ml-1">{requiredStudyPreview} / 月</span>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                時給と目標収入（1円以上）を入力すると、ここに目安が表示されます。
              </p>
            )}
          </div>

          <Button type="submit" fullWidth size="lg" onClick={handleSave3}>
            <Save size={18} className="mr-2" />
            <span className="font-bold text-sm">保存</span>
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-300 mt-8">
        StudyBank v1.0.0
      </div>
    </div>
  );
};
