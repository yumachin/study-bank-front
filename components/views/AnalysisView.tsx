'use client';

import React, { useMemo } from 'react';
import { APP_VIEWS, type StudySession } from '../../types/index';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from 'recharts';
import { Calendar, Clock, Award } from 'lucide-react';
import { Heading } from '../ui/Heading';

interface AnalysisViewProps {
  sessions: StudySession[];
  totalEarned: number;
}

interface ChartDataItem {
  name: string;
  hours: number;
  fullDate: string;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ sessions, totalEarned }) => {
  const RenderCustomBar = (props: any) => {
    const { fill, payload, ...rest } = props;
    // payload の中に各データの塊（entry）が入っています
    const barColor = payload.hours > 0 ? '#4f46e5' : '#e2e8f0';
  
    // Recharts標準のRectangle（四角形）コンポーネントにプロップを引き継ぎ、色だけ上書きします
    // ※ 'recharts' から Rectangle をインポートしてください
    return <Rectangle {...rest} fill={barColor} />;
  };
  
  const chartData: ChartDataItem[] = useMemo(() => {
    const days: ChartDataItem[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const dayLabel = d.toLocaleDateString('ja-JP', { weekday: 'short' });
      const fullDate = d.toDateString();

      const daySessions = sessions.filter(
        (s) => new Date(s.startTime).toDateString() === fullDate
      );

      const totalHours =
        daySessions.reduce(
          (acc, curr) => acc + curr.durationSeconds, 0
        ) / 3600;

      days.push({
        name: dayLabel,
        hours: Number(totalHours.toFixed(1)),
        fullDate,
      });
    }

    return days;
  }, [sessions]);

  const totalStudyHours = useMemo(() => {
    return (
      sessions.reduce((acc, curr) => acc + curr.durationSeconds, 0) / 3600
    );
  }, [sessions]);

  return (
    <div className="px-6 pb-24 space-y-6 max-w-md mx-auto">
      <Heading currentView={APP_VIEWS.ANALYSIS} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
            <Clock size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              合計時間
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-slate-800">
            {totalStudyHours.toFixed(1)}
            <span className="text-sm font-sans text-slate-400 ml-1">時間</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Award size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              累計獲得額
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-slate-800">
            ¥{(totalEarned / 1000).toFixed(1)}
            <span className="text-sm font-sans text-slate-400 ml-1">k</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Calendar size={18} className="text-slate-400" />
          <h3 className="font-bold text-slate-800">
            過去７日間 (時間)
          </h3>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow:
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar 
                dataKey="hours" 
                radius={[6, 6, 6, 6]} 
                barSize={32}
                shape={<RenderCustomBar />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
