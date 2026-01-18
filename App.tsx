
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BloodSugarEntry, View, Language } from './types';
import { TRANSLATIONS } from './constants';
import Dashboard from './components/Dashboard';
import LogList from './components/LogList';
import AIAssistant from './components/AIAssistant';
import Settings from './components/Settings';
import LogEntryForm from './components/LogEntryForm';

const STORAGE_KEY = 'blood_sugar_logs';
const LANG_KEY = 'blood_sugar_lang';

const App: React.FC = () => {
  const [entries, setEntries] = useState<BloodSugarEntry[]>([]);
  const [view, setView] = useState<View>('dashboard');
  const [lang, setLang] = useState<Language>('da');
  const [showAddForm, setShowAddForm] = useState(false);

  const t = TRANSLATIONS[lang];

  // Initialize data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load entries", e);
      }
    }
    const savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang === 'en' || savedLang === 'da') {
      setLang(savedLang);
    }
  }, []);

  // Sync data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const addEntry = useCallback((value: number, timestamp: string, note?: string) => {
    const newEntry: BloodSugarEntry = {
      id: crypto.randomUUID(),
      value,
      timestamp,
      note
    };
    setEntries(prev => [newEntry, ...prev]);
    setShowAddForm(false);
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const importData = useCallback((newData: BloodSugarEntry[]) => {
    setEntries(newData);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Mobile Header / Desktop Sidebar */}
      <nav className="bg-blue-600 text-white w-full md:w-64 flex-shrink-0 flex flex-col shadow-lg sticky top-0 z-50 md:h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold leading-tight">{t.title}</h1>
        </div>

        <div className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-blue-700 font-semibold' : 'hover:bg-blue-500'}`}
          >
            {t.dashboard}
          </button>
          <button 
            onClick={() => setView('logs')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'logs' ? 'bg-blue-700 font-semibold' : 'hover:bg-blue-500'}`}
          >
            {t.logs}
          </button>
          <button 
            onClick={() => setView('assistant')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'assistant' ? 'bg-blue-700 font-semibold' : 'hover:bg-blue-500'}`}
          >
            {t.assistant}
          </button>
          <button 
            onClick={() => setView('settings')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'settings' ? 'bg-blue-700 font-semibold' : 'hover:bg-blue-500'}`}
          >
            {t.settings}
          </button>
        </div>

        <div className="p-4 border-t border-blue-500 hidden md:block">
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl shadow-md hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span> {t.addEntry}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 relative h-full">
        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-32 md:pb-8">
          {view === 'dashboard' && <Dashboard entries={entries} t={t} />}
          {view === 'logs' && <LogList entries={entries} deleteEntry={deleteEntry} t={t} />}
          {view === 'assistant' && <AIAssistant entries={entries} lang={lang} t={t} />}
          {view === 'settings' && <Settings entries={entries} importData={importData} setLang={setLang} lang={lang} t={t} />}
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="md:hidden fixed bottom-6 right-6">
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-3xl font-bold hover:bg-blue-700 active:scale-95 transition-all"
          >
            +
          </button>
        </div>
      </main>

      {/* Entry Modal */}
      {showAddForm && (
        <LogEntryForm 
          onSave={addEntry} 
          onCancel={() => setShowAddForm(false)} 
          t={t}
        />
      )}
    </div>
  );
};

export default App;
