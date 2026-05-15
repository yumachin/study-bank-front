import React from 'react';
import { Landmark } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 left-0 right-0 z-50 px-6 py-6">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-sm shadow-indigo-200">
             <Landmark size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight font-mono text-slate-900">StudyBank</span>
        </div>
        
        <button className="w-8 h-8 rounded-full bg-linear-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm active:scale-95 transition-transform">
          Icon
        </button>
      </div>
    </header>
  );
};
