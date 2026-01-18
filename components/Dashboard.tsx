
import React, { useMemo, useState } from 'react';
import { BloodSugarEntry, Translations } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface DashboardProps {
  entries: BloodSugarEntry[];
  t: Translations;
}

const Dashboard: React.FC<DashboardProps> = ({ entries, t }) => {
  const [range, setRange] = useState<'14d' | '1m' | '3m'>('14d');

  const stats = useMemo(() => {
    if (entries.length === 0) return null;
    const values = entries.map(e => e.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return { avg: avg.toFixed(1), max: max.toFixed(1), min: min.toFixed(1) };
  }, [entries]);

  const filteredData = useMemo(() => {
    const now = new Date();
    const limit = new Date();
    if (range === '14d') limit.setDate(now.getDate() - 14);
    else if (range === '1m') limit.setMonth(now.getMonth() - 1);
    else if (range === '3m') limit.setMonth(now.getMonth() - 3);

    return entries
      .filter(e => new Date(e.timestamp) >= limit)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(e => ({
        time: new Date(e.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
        value: e.value,
        fullDate: new Date(e.timestamp).toLocaleString()
      }));
  }, [entries, range]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <svg className="w-20 h-20 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-lg">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">{t.dashboard}</h2>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
          <button 
            onClick={() => setRange('14d')}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${range === '14d' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
          >
            {t.last14Days}
          </button>
          <button 
            onClick={() => setRange('1m')}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${range === '1m' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
          >
            {t.lastMonth}
          </button>
          <button 
            onClick={() => setRange('3m')}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${range === '3m' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
          >
            {t.last3Months}
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm font-medium mb-1">{t.average}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">{stats?.avg}</span>
            <span className="text-slate-400 text-xs">{t.units}</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm font-medium mb-1">{t.highest}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-500">{stats?.max}</span>
            <span className="text-slate-400 text-xs">{t.units}</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm font-medium mb-1">{t.lowest}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-500">{stats?.min}</span>
            <span className="text-slate-400 text-xs">{t.units}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#94a3b8'}}
                minTickGap={30}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#94a3b8'}}
                domain={[0, 'auto']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                labelClassName="font-semibold text-slate-800 mb-1"
                formatter={(value: number) => [`${value} ${t.units}`, 'Blodsukker']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
