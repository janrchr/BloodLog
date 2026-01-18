
export interface BloodSugarEntry {
  id: string;
  value: number; // mmol/L
  timestamp: string; // ISO string
  note?: string;
}

export type Language = 'da' | 'en';

export interface Translations {
  title: string;
  dashboard: string;
  logs: string;
  assistant: string;
  settings: string;
  addEntry: string;
  valueLabel: string;
  timestampLabel: string;
  noteLabel: string;
  save: string;
  cancel: string;
  delete: string;
  exportData: string;
  importData: string;
  average: string;
  highest: string;
  lowest: string;
  last14Days: string;
  lastMonth: string;
  last3Months: string;
  noData: string;
  aiPrompt: string;
  aiPlaceholder: string;
  languageToggle: string;
  confirmDelete: string;
  units: string;
}

export type View = 'dashboard' | 'logs' | 'assistant' | 'settings';
