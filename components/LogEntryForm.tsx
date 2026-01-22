
import React, { useState } from 'react';
import { Translations } from '../types';

interface LogEntryFormProps {
  onSave: (value: number, timestamp: string, note?: string) => void;
  onCancel: () => void;
  t: Translations;
}

const LogEntryForm: React.FC<LogEntryFormProps> = ({ onSave, onCancel, t }) => {
  const [value, setValue] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>(new Date().toISOString().slice(0, 16));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = parseFloat(value.replace(',', '.'));
    if (!isNaN(numericValue) && numericValue > 0) {
      // Note is no longer collected from the UI, passing undefined
      onSave(numericValue, new Date(timestamp).toISOString(), undefined);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">{t.addEntry}</h3>
          <button onClick={onCancel} className="p-2 hover:bg-blue-500 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="text-center pt-2">
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">{t.valueLabel}</label>
            <input 
              type="number" 
              step="0.1" 
              autoFocus
              required
              className="w-full text-6xl font-bold text-center text-blue-600 bg-transparent border-b-2 border-slate-100 focus:border-blue-500 outline-none pb-4 py-4 placeholder:text-slate-100 transition-all"
              placeholder="0.0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t.timestampLabel}</label>
            <input 
              type="datetime-local" 
              className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all shadow-sm"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-blue-700 hover:shadow-blue-200 transition-all active:scale-[0.98] text-lg"
            >
              {t.save}
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full mt-3 text-slate-400 font-medium py-2 hover:text-slate-600 transition-colors"
            >
              {t.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogEntryForm;
