
import React, { useState, useEffect, useCallback } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const navigateTo = (newView: View) => {
    setView(newView);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header with Dropdown Menu */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-[60] px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
              aria-label="Menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            <div className="flex items-center gap-2">
               <div className="bg-blue-600 p-1.5 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight hidden sm:block">{t.title}</h1>
            </div>

            {/* Dropdown Content */}
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsMenuOpen(false)}
                ></div>
                <div className="absolute top-12 left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 pb-2 mb-2 border-b border-slate-50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3">Navigation</p>
                  </div>
                  <button 
                    onClick={() => navigateTo('dashboard')}
                    className={`w-full text-left px-6 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 ${view === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    {t.dashboard}
                  </button>
                  <button 
                    onClick={() => navigateTo('logs')}
                    className={`w-full text-left px-6 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 ${view === 'logs' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    {t.logs}
                  </button>
                  <button 
                    onClick={() => navigateTo('assistant')}
                    className={`w-full text-left px-6 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 ${view === 'assistant' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    {t.assistant}
                  </button>
                  <button 
                    onClick={() => navigateTo('settings')}
                    className={`w-full text-left px-6 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 ${view === 'settings' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {t.settings}
                  </button>
                  <div className="mt-2 pt-2 border-t border-slate-50 px-3">
                    <button 
                      onClick={() => { setShowAddForm(true); setIsMenuOpen(false); }}
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-xl">+</span> {t.addEntry}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAddForm(true)}
              className="hidden md:flex bg-blue-600 text-white px-5 py-2 rounded-xl font-bold shadow-sm hover:bg-blue-700 transition-all active:scale-[0.98] items-center gap-2"
            >
              <span>+</span> {t.addEntry}
            </button>
            <div className="text-slate-400 text-sm font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Lokal Log
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        <div className="max-w-6xl mx-auto p-4 md:p-10 pb-32">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {view === 'dashboard' && <Dashboard entries={entries} t={t} />}
            {view === 'logs' && <LogList entries={entries} deleteEntry={deleteEntry} t={t} />}
            {view === 'assistant' && <AIAssistant entries={entries} lang={lang} t={t} />}
            {view === 'settings' && <Settings entries={entries} importData={importData} setLang={setLang} lang={lang} t={t} />}
          </div>
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="md:hidden fixed bottom-8 right-8 z-40">
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center text-3xl font-bold hover:bg-blue-700 active:scale-90 transition-all hover:rotate-90 duration-300"
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
