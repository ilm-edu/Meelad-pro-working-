import React, { useState } from 'react';
import { useFest } from '../context/FestContext';
import { 
  Settings, DollarSign, Plus, Trash2, Edit2, 
  TrendingUp, TrendingDown, Wallet, Check, AlertCircle, Sparkles, X,
  RotateCcw, RefreshCw, ShieldAlert, FileText, CheckCircle
} from 'lucide-react';
import { FestSettings, FinanceEntry, ParticipationLimits } from '../types';

export const SettingsFinanceView: React.FC = () => {
  const { 
    festSettings, updateFestSettings, financeEntries, 
    addFinanceEntry, deleteFinanceEntry,
    factoryResetToFresh, factoryResetToDefault, clearAllResultsAndMarks,
    students, programs, teams,
    limits, setLimits
  } = useFest();

  const [activeTab, setActiveTab] = useState<'settings' | 'finance' | 'reset'>('settings');

  // Fest Settings & Limits Form State
  const [settingsForm, setSettingsForm] = useState<FestSettings>({ ...festSettings });
  const [limitsForm, setLimitsForm] = useState<ParticipationLimits>({ ...limits });
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Reset Confirmation States
  const [resetModal, setResetModal] = useState<'fresh' | 'default' | 'marks' | null>(null);
  const [confirmInput, setConfirmInput] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Finance Entry Modal
  const [isAddFinanceOpen, setIsAddFinanceOpen] = useState(false);
  const [financeForm, setFinanceForm] = useState({
    title: '',
    type: 'Income' as 'Income' | 'Expense',
    category: 'Donations / Sponsorships',
    amount: 1000,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Calculate totals
  const totalIncome = financeEntries
    .filter(e => e.type === 'Income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = financeEntries
    .filter(e => e.type === 'Expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateFestSettings(settingsForm);
    setLimits(limitsForm);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const handleExecuteReset = () => {
    if (resetModal === 'fresh') {
      factoryResetToFresh();
      setResetSuccessMessage('Festival has been successfully reset to a Clean Slate! All student records, marks, and ledger entries have been cleared.');
    } else if (resetModal === 'default') {
      factoryResetToDefault();
      setResetSuccessMessage('Standard demo madrassa dataset restored successfully!');
    } else if (resetModal === 'marks') {
      clearAllResultsAndMarks();
      setResetSuccessMessage('All evaluated marks, grades, and positions have been cleared. Students & Programs remain intact.');
    }
    setResetModal(null);
    setConfirmInput('');
    setTimeout(() => setResetSuccessMessage(null), 5000);
  };

  const handleSaveFinance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!financeForm.title.trim()) return;

    addFinanceEntry({
      title: financeForm.title,
      type: financeForm.type,
      category: financeForm.category,
      amount: Number(financeForm.amount) || 0,
      date: financeForm.date,
      notes: financeForm.notes
    });

    setIsAddFinanceOpen(false);
    setFinanceForm({
      title: '',
      type: 'Income',
      category: 'Donations / Sponsorships',
      amount: 1000,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Notification Banner if Reset */}
      {resetSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-xs font-bold">{resetSuccessMessage}</p>
          </div>
          <button onClick={() => setResetSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Toggle */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          ⚙️ Festival Configuration & Point Rules
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'finance'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          💰 Income & Expense Account Book
        </button>

        <button
          onClick={() => setActiveTab('reset')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'reset'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-rose-600 hover:bg-rose-50'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Factory Reset / ഡാറ്റ റീസെറ്റ്</span>
        </button>
      </div>

      {/* VIEW 1: FEST SETTINGS & POINT RULES */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Festival General Settings</h3>
              <p className="text-xs text-slate-600">Customize organization titles, academic year, and point values.</p>
            </div>
            {isSavedAlert && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved successfully!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">FESTIVAL TITLE *</label>
              <input
                type="text"
                required
                value={settingsForm.festName}
                onChange={e => setSettingsForm({ ...settingsForm, festName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">MADRASSA / INSTITUTION NAME *</label>
              <input
                type="text"
                required
                value={settingsForm.madrassaName}
                onChange={e => setSettingsForm({ ...settingsForm, madrassaName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ACADEMIC YEAR</label>
              <input
                type="text"
                value={settingsForm.academicYear}
                onChange={e => setSettingsForm({ ...settingsForm, academicYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">VENUE / LOCATION</label>
              <input
                type="text"
                value={settingsForm.venue}
                onChange={e => setSettingsForm({ ...settingsForm, venue: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Point System Rules */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Scoring System Configuration (Rank & Grade Point Weightage) / പോയിന്റ് മാനദണ്ഡങ്ങൾ
            </h4>

            {/* Individual Rank Points */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-900 block">👤 Individual Event Rank Points (വ്യക്തിഗത ഇനങ്ങൾ)</label>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="font-bold text-amber-800 block mb-1">🥇 1st Place</label>
                  <input
                    type="number"
                    value={settingsForm.rankPoints?.[1] ?? 10}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      rankPoints: { ...settingsForm.rankPoints, 1: Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="font-bold text-slate-700 block mb-1">🥈 2nd Place</label>
                  <input
                    type="number"
                    value={settingsForm.rankPoints?.[2] ?? 8}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      rankPoints: { ...settingsForm.rankPoints, 2: Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="font-bold text-amber-900 block mb-1">🥉 3rd Place</label>
                  <input
                    type="number"
                    value={settingsForm.rankPoints?.[3] ?? 6}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      rankPoints: { ...settingsForm.rankPoints, 3: Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Group Rank Points */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-900 block">👥 Group Event Rank Points (ഗ്രൂപ്പ് ഇനങ്ങൾ)</label>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                  <label className="font-bold text-amber-800 block mb-1">🥇 1st Place</label>
                  <input
                    type="number"
                    value={settingsForm.groupRankPoints?.[1] ?? 15}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      groupRankPoints: { ...settingsForm.groupRankPoints, 1: Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-300 font-bold text-slate-900 bg-white"
                  />
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                  <label className="font-bold text-slate-700 block mb-1">🥈 2nd Place</label>
                  <input
                    type="number"
                    value={settingsForm.groupRankPoints?.[2] ?? 12}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      groupRankPoints: { ...settingsForm.groupRankPoints, 2: Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-300 font-bold text-slate-900 bg-white"
                  />
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                  <label className="font-bold text-amber-900 block mb-1">🥉 3rd Place</label>
                  <input
                    type="number"
                    value={settingsForm.groupRankPoints?.[3] ?? 10}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      groupRankPoints: { ...settingsForm.groupRankPoints, 3: Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-300 font-bold text-slate-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* General Event Rank Points */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-purple-900 block">🌐 General / Open Event Rank Points (ജനറൽ / ഓപ്പൺ ഇനങ്ങൾ)</label>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                  <label className="font-bold text-amber-800 block mb-1">🥇 1st Place</label>
                  <input
                    type="number"
                    value={settingsForm.generalRankPoints?.[1] ?? 10}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      generalRankPoints: { ...settingsForm.generalRankPoints, 1: Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 font-bold text-slate-900 bg-white"
                  />
                </div>
                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                  <label className="font-bold text-slate-700 block mb-1">🥈 2nd Place</label>
                  <input
                    type="number"
                    value={settingsForm.generalRankPoints?.[2] ?? 8}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      generalRankPoints: { ...settingsForm.generalRankPoints, 2: Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 font-bold text-slate-900 bg-white"
                  />
                </div>
                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                  <label className="font-bold text-amber-900 block mb-1">🥉 3rd Place</label>
                  <input
                    type="number"
                    value={settingsForm.generalRankPoints?.[3] ?? 6}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      generalRankPoints: { ...settingsForm.generalRankPoints, 3: Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 font-bold text-slate-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Grade Points */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 block">🌟 Grade Point Weightage (A+, A, B+, B, C, D)</label>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="font-bold text-indigo-700 block mb-1">Grade A+</label>
                  <input
                    type="number"
                    value={settingsForm.gradePoints?.['A+'] ?? 5}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      gradePoints: { ...settingsForm.gradePoints, 'A+': Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="font-bold text-indigo-700 block mb-1">Grade A</label>
                  <input
                    type="number"
                    value={settingsForm.gradePoints?.['A'] ?? 4}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      gradePoints: { ...settingsForm.gradePoints, 'A': Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="font-bold text-indigo-700 block mb-1">Grade B+</label>
                  <input
                    type="number"
                    value={settingsForm.gradePoints?.['B+'] ?? 3}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      gradePoints: { ...settingsForm.gradePoints, 'B+': Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="font-bold text-indigo-700 block mb-1">Grade B</label>
                  <input
                    type="number"
                    value={settingsForm.gradePoints?.['B'] ?? 2}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      gradePoints: { ...settingsForm.gradePoints, 'B': Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="font-bold text-indigo-700 block mb-1">Grade C</label>
                  <input
                    type="number"
                    value={settingsForm.gradePoints?.['C'] ?? 1}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      gradePoints: { ...settingsForm.gradePoints, 'C': Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="font-bold text-indigo-700 block mb-1">Grade D</label>
                  <input
                    type="number"
                    value={settingsForm.gradePoints?.['D'] ?? 0}
                    onChange={e => setSettingsForm({
                      ...settingsForm,
                      gradePoints: { ...settingsForm.gradePoints, 'D': Number(e.target.value) }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Participation Limits Configuration */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Participation Limits / മത്സരം പങ്കെടുക്കൽ പരിധികൾ
                </h4>
                <p className="text-[11px] text-slate-600">Set maximum participation limits per student for Stage, Off-Stage, Sports, General & Group events.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={limitsForm.enabled}
                  onChange={e => setLimitsForm({ ...limitsForm, enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-700">Enable Limits Enforcement</span>
              </label>
            </div>

            <div className={`grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs ${!limitsForm.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <label className="font-bold text-purple-900 block mb-1">🎭 Max Stage</label>
                <input
                  type="number"
                  value={limitsForm.defaultIndividualStage}
                  onChange={e => setLimitsForm({ ...limitsForm, defaultIndividualStage: Number(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 font-bold text-slate-900 bg-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
                <label className="font-bold text-teal-900 block mb-1">✍️ Max Off Stage</label>
                <input
                  type="number"
                  value={limitsForm.defaultIndividualOffStage}
                  onChange={e => setLimitsForm({ ...limitsForm, defaultIndividualOffStage: Number(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-teal-300 font-bold text-slate-900 bg-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <label className="font-bold text-amber-900 block mb-1">⚽ Max Sports</label>
                <input
                  type="number"
                  value={limitsForm.defaultSports}
                  onChange={e => setLimitsForm({ ...limitsForm, defaultSports: Number(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 font-bold text-slate-900 bg-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <label className="font-bold text-indigo-900 block mb-1">🌐 Max General Open</label>
                <input
                  type="number"
                  value={limitsForm.defaultGeneral}
                  onChange={e => setLimitsForm({ ...limitsForm, defaultGeneral: Number(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-indigo-300 font-bold text-slate-900 bg-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <label className="font-bold text-emerald-900 block mb-1">👥 Max Group</label>
                <input
                  type="number"
                  value={limitsForm.defaultGroup}
                  onChange={e => setLimitsForm({ ...limitsForm, defaultGroup: Number(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-300 font-bold text-slate-900 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm"
            >
              Save Configuration
            </button>
          </div>
        </form>
      )}

      {/* VIEW 2: INCOME & EXPENSE ACCOUNT BOOK */}
      {activeTab === 'finance' && (
        <div className="space-y-5">
          {/* Finance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>TOTAL INCOME (SPONSORSHIPS)</span>
              </div>
              <div className="text-2xl font-black text-emerald-600">
                ₹{totalIncome.toLocaleString()}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                <span>TOTAL FEST EXPENSES</span>
              </div>
              <div className="text-2xl font-black text-rose-600">
                ₹{totalExpense.toLocaleString()}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-indigo-600" />
                <span>NET ACCOUNT BALANCE</span>
              </div>
              <div className={`text-2xl font-black ${netBalance >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                ₹{netBalance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Financial Ledger Entries</h3>
                <p className="text-xs text-slate-600">Track all receipts, stage sound system, food, stage decoration, and gifts.</p>
              </div>

              <button
                onClick={() => setIsAddFinanceOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Transaction</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-3 px-4">DATE</th>
                    <th className="py-3 px-4">TRANSACTION TITLE</th>
                    <th className="py-3 px-3">CATEGORY</th>
                    <th className="py-3 px-3">TYPE</th>
                    <th className="py-3 px-4 text-right">AMOUNT</th>
                    <th className="py-3 px-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {financeEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-slate-600 font-medium">{entry.date}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div>{entry.title}</div>
                        {entry.notes && <div className="text-[11px] text-slate-600 font-normal">{entry.notes}</div>}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{entry.category}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          entry.type === 'Income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-right font-black text-sm ${
                        entry.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {entry.type === 'Income' ? '+' : '-'}₹{entry.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => deleteFinanceEntry(entry.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD TRANSACTION */}
      {isAddFinanceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">+ Record Transaction</h3>
              <button 
                onClick={() => setIsAddFinanceOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFinance} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">TRANSACTION TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stage Sound & Lighting / Local Sponsor"
                  value={financeForm.title}
                  onChange={e => setFinanceForm({ ...financeForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">TYPE *</label>
                  <select
                    value={financeForm.type}
                    onChange={e => setFinanceForm({ ...financeForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
                  >
                    <option value="Income">💰 Income (Receipt)</option>
                    <option value="Expense">💸 Expense (Payment)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">AMOUNT (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={financeForm.amount}
                    onChange={e => setFinanceForm({ ...financeForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">CATEGORY</label>
                <input
                  type="text"
                  placeholder="e.g. Sound, Food, Prizes, Stage"
                  value={financeForm.category}
                  onChange={e => setFinanceForm({ ...financeForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">DATE</label>
                <input
                  type="date"
                  value={financeForm.date}
                  onChange={e => setFinanceForm({ ...financeForm, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFinanceOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                >
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* VIEW 3: FACTORY RESET & DATA MANAGEMENT */}
      {activeTab === 'reset' && (
        <div className="space-y-6">
          <div className="bg-rose-50/70 border border-rose-200 p-5 rounded-2xl">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-950">Festival Data Management & Reset</h3>
                <p className="text-xs text-rose-800/90 mt-0.5">
                  ഫെസ്റ്റ് ആരംഭിക്കുന്നതിന് മുൻപോ അല്ലെങ്കിൽ പുതിയ ഫെസ്റ്റ് തുടങ്ങുമ്പോഴോ ഡാറ്റ റീസെറ്റ് ചെയ്യാനുള്ള ക്രമീകരണങ്ങൾ ഇവിടെ ലഭ്യമാണ്.
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-rose-900 mt-2">
                  <span>Current Students: <strong>{students.length}</strong></span>
                  <span>•</span>
                  <span>Total Programs: <strong>{programs.length}</strong></span>
                  <span>•</span>
                  <span>Active Teams: <strong>{teams.length}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Clean Slate Reset */}
            <div className="bg-white rounded-2xl border-2 border-rose-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold mb-3">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">പുതിയ ഫെസ്റ്റ് ആരംഭിക്കാൻ (Clean Slate)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  എല്ലാ വിദ്യാർത്ഥികളുടെ പേരുകൾ, മാർക്കുകൾ, സ്പെഷ്യൽ അവാർഡുകൾ, ഫിനാൻസ് എൻട്രികൾ എന്നിവ പൂർണ്ണമായും ഒഴിവാക്കി പുതിയ ഫെസ്റ്റിനായി സജ്ജമാക്കുന്നു.
                </p>
                <div className="mt-3 p-2 rounded-xl bg-slate-50 text-[11px] text-slate-700 space-y-1">
                  <div>✓ Clears all students ({students.length})</div>
                  <div>✓ Clears all marks & points</div>
                  <div>✓ Clears accounts & special awards</div>
                  <div>✓ Keeps categories & teams ready</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setResetModal('fresh');
                  setConfirmInput('');
                }}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Start Fresh (Clear All Data)</span>
              </button>
            </div>

            {/* Card 2: Reset to Demo / Sample Data */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-3">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">ഡെമോ ഡാറ്റ റീസ്റ്റോർ ചെയ്യാൻ (Sample Dataset)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  സിസ്റ്റം ടെസ്റ്റ് ചെയ്യുന്നതിനായി സ്റ്റാൻഡേർഡ് മദ്റസ സാമ്പിൾ ഡാറ്റ (കുട്ടികൾ, മത്സരങ്ങൾ, ടീമുകൾ, മാർക്കുകൾ) റീസ്റ്റോർ ചെയ്യുന്നു.
                </p>
                <div className="mt-3 p-2 rounded-xl bg-slate-50 text-[11px] text-slate-700 space-y-1">
                  <div>✓ Restores 36+ sample students</div>
                  <div>✓ Restores 14+ standard programs</div>
                  <div>✓ Restores evaluated marks & sample ledger</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setResetModal('default');
                  setConfirmInput('');
                }}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restore Sample Madrassa Data</span>
              </button>
            </div>

            {/* Card 3: Clear Marks & Results Only */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">മാർക്കുകൾ മാത്രം ഒഴിവാക്കാൻ (Clear Marks Only)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  രജിസ്റ്റർ ചെയ്ത വിദ്യാർത്ഥികളെയും പ്രോഗ്രാമുകളെയും നിലനിർത്തിക്കൊണ്ട് എല്ലാ ഇവാലുവേഷൻ മാർക്കുകളും പബ്ലിഷ് സ്റ്റാറ്റസും മാത്രം റീസെറ്റ് ചെയ്യാം.
                </p>
                <div className="mt-3 p-2 rounded-xl bg-slate-50 text-[11px] text-slate-700 space-y-1">
                  <div>✓ Keeps all registered students</div>
                  <div>✓ Keeps all programs & team lists</div>
                  <div>✓ Resets scores & grades back to Pending</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setResetModal('marks');
                  setConfirmInput('');
                }}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Marks & Ranks</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {resetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <button
                onClick={() => setResetModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {resetModal === 'fresh' && 'Confirm Clean Slate Reset'}
                {resetModal === 'default' && 'Confirm Restore Demo Data'}
                {resetModal === 'marks' && 'Confirm Clear All Marks & Results'}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {resetModal === 'fresh' && 'Are you sure you want to delete all student records, marks, and ledger entries? This action cannot be undone.'}
                {resetModal === 'default' && 'This will replace all current data with the standard sample Madrassa dataset. Do you want to proceed?'}
                {resetModal === 'marks' && 'This will reset all scores, grades, and positions for all programs back to pending. Students and programs will remain.'}
              </p>
            </div>

            {resetModal === 'fresh' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Type <strong className="text-rose-600">RESET</strong> to confirm:
                </label>
                <input
                  type="text"
                  placeholder="RESET"
                  value={confirmInput}
                  onChange={e => setConfirmInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setResetModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReset}
                disabled={resetModal === 'fresh' && confirmInput.trim().toUpperCase() !== 'RESET'}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all ${
                  resetModal === 'fresh'
                    ? (confirmInput.trim().toUpperCase() === 'RESET' ? 'bg-rose-600 hover:bg-rose-700 cursor-pointer' : 'bg-slate-300 cursor-not-allowed')
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Yes, Proceed With Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
