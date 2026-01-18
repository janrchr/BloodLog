
import React from 'react';
import { BloodSugarEntry, Translations, Language } from '../types';

interface SettingsProps {
  entries: BloodSugarEntry[];
  importData: (data: BloodSugarEntry[]) => void;
  setLang: (l: Language) => void;
  lang: Language;
  t: Translations;
}

const Settings: React.FC<SettingsProps> = ({ entries, importData, setLang, lang, t }) => {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blood_sugar_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawData = JSON.parse(event.target?.result as string);
        let importedEntries: BloodSugarEntry[] = [];

        // Support both direct array and the specific "sugarLogs" object format
        if (Array.isArray(rawData)) {
          importedEntries = rawData;
        } else if (rawData && typeof rawData === 'object' && Array.isArray(rawData.sugarLogs)) {
          importedEntries = rawData.sugarLogs;
        } else {
          throw new Error('Invalid format');
        }

        // Basic validation: ensure entries have at least value and timestamp
        const isValid = importedEntries.every(entry => 
          typeof entry.value === 'number' && 
          typeof entry.timestamp === 'string'
        );

        if (isValid) {
          importData(importedEntries);
          alert(lang === 'da' ? 'Data importeret succesfuldt!' : 'Data imported successfully!');
        } else {
          throw new Error('Data validation failed');
        }
      } catch (err) {
        alert(lang === 'da' 
          ? 'Fejl ved import af data. Sørg for at filen er i det korrekte format.' 
          : 'Error importing data. Please ensure the file is in the correct format.');
      }
    };
    reader.readAsText(file);
    // Reset target value so the same file can be selected again if needed
    e.target.value = '';
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">{t.settings}</h2>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802m3.37 1.172A17.935 17.935 0 0112 18.174m-3.128-2.09A18.041 18.041 0 0111 11H9m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Sprog / Language
        </h3>
        <button 
          onClick={() => setLang(lang === 'da' ? 'en' : 'da')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-6 py-3 rounded-xl transition-colors"
        >
          {t.languageToggle}
        </button>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Backup & Data
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          {lang === 'da' 
            ? 'Alt din data gemmes lokalt i din browser. Sørg for at tage en backup jævnligt. Appen understøtter nu import fra dine eksisterende log-filer.' 
            : 'All your data is stored locally in your browser. Make sure to export a backup regularly. The app now supports importing from your existing log files.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleExport}
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            {t.exportData}
          </button>
          <label className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors shadow-md text-center cursor-pointer">
            {t.importData}
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Om Appen
        </h3>
        <div className="prose prose-sm text-slate-600">
          <p>
            {lang === 'da' 
              ? 'Blodsukker Log Assistent er designet til at give dig et hurtigt overblik over dit helbred uden at kompromittere din data.' 
              : 'Blood Sugar Log Assistant is designed to provide you with a quick overview of your health without compromising your data.'}
          </p>
          <p className="mt-2 text-xs opacity-50">Version 1.0.1 • Support for external log formats added</p>
        </div>
      </section>
    </div>
  );
};

export default Settings;
