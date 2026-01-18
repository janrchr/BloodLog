
import React from 'react';
import { BloodSugarEntry, Translations } from '../types';

interface LogListProps {
  entries: BloodSugarEntry[];
  deleteEntry: (id: string) => void;
  t: Translations;
}

const LogList: React.FC<LogListProps> = ({ entries, deleteEntry, t }) => {
  const sorted = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">{t.logs}</h2>
      <div className="grid gap-3">
        {sorted.map(entry => {
          const date = new Date(entry.timestamp);
          const isHigh = entry.value > 10;
          const isLow = entry.value < 4;
          
          return (
            <div key={entry.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  isHigh ? 'bg-red-50 text-red-600' : isLow ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {entry.value}
                </div>
                <div>
                  <div className="text-slate-900 font-semibold">
                    {date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    {entry.note && <span className="ml-2 italic text-slate-500">• {entry.note}</span>}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (confirm(t.confirmDelete)) {
                    deleteEntry(entry.id);
                  }
                }}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label={t.delete}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LogList;
