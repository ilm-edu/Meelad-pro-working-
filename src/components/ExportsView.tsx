import React, { useState, useMemo } from 'react';
import { useFest } from '../context/FestContext';
import { 
  FileDown, Printer, Users, Trophy, BookOpen, 
  Layers, Check, Sparkles, Filter, ShieldCheck, Tag
} from 'lucide-react';

export const ExportsView: React.FC = () => {
  const { 
    festSettings, teams, categories, students, programs, stages,
    genderFilter, getTeamScores, getStudentScores 
  } = useFest();

  const [activeExportType, setActiveExportType] = useState<'badges' | 'score-sheet' | 'team-chart' | 'category-chart'>('badges');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedProgramId, setSelectedProgramId] = useState<string>(programs[0]?.id || '');

  // Filter students for chest number badges
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (selectedCategory !== 'All' && s.categoryId !== selectedCategory) return false;
      if (selectedTeam !== 'All' && s.teamId !== selectedTeam) return false;
      if (genderFilter !== 'All' && s.gender !== genderFilter) return false;
      return true;
    });
  }, [students, selectedCategory, selectedTeam, genderFilter]);

  const selectedProgram = useMemo(() => {
    return programs.find(p => p.id === selectedProgramId) || programs[0];
  }, [programs, selectedProgramId]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Sub Tabs (Matching PDF pages 14, 15, 16) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Event Documentation & Badge Generator</h2>
            <p className="text-xs text-slate-600">
              Print Chest Number Badges, Judge Score Sheets, Team Assignment Charts, and Category Master Lists.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Current Document</span>
          </button>
        </div>

        {/* Export Mode Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 text-xs">
          <button
            onClick={() => setActiveExportType('badges')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeExportType === 'badges'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Chest No Badges ({filteredStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveExportType('score-sheet')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeExportType === 'score-sheet'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Judge Score Sheet (Mark Sheet)</span>
          </button>

          <button
            onClick={() => setActiveExportType('team-chart')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeExportType === 'team-chart'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team-wise Roster Chart</span>
          </button>

          <button
            onClick={() => setActiveExportType('category-chart')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeExportType === 'category-chart'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Category Master Chart</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CHEST NO BADGES GENERATOR (Print ready cards) */}
      {activeExportType === 'badges' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Filter Team:</span>
              <select
                value={selectedTeam}
                onChange={e => setSelectedTeam(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold"
              >
                <option value="All">All Teams</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Filter Category:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold"
              >
                <option value="All">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Badges Grid (Designed for direct A4 paper printing) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 print:grid-cols-3 print:gap-3">
            {filteredStudents.map(student => {
              const team = teams.find(t => t.id === student.teamId);
              const category = categories.find(c => c.id === student.categoryId);

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl border-2 border-slate-900 p-4 flex flex-col items-center justify-between text-center space-y-3 shadow-xs relative overflow-hidden print:border-black"
                >
                  {/* Top Ribbon */}
                  <div className="w-full py-1 bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg">
                    {festSettings.festName}
                  </div>

                  {/* Chest Number Giant Box */}
                  <div className="my-1">
                    <div className="text-[10px] font-bold text-slate-600 uppercase">CHEST NO</div>
                    <div className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                      #{student.chestNo}
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="w-full border-t border-slate-200 pt-2 space-y-0.5">
                    <h4 className="font-bold text-xs text-slate-900 truncate">
                      {student.name}
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Class {student.classNumber} • {category?.name}
                    </p>
                    <div 
                      className="text-[11px] font-extrabold truncate"
                      style={{ color: team?.color }}
                    >
                      {team?.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: JUDGE SCORE SHEET (Score Sheet for evaluation) */}
      {activeExportType === 'score-sheet' && selectedProgram && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">Select Event:</span>
            <select
              value={selectedProgramId}
              onChange={e => setSelectedProgramId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-indigo-700"
            >
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.code} - {p.name} ({categories.find(c => c.id === p.categoryId)?.name})</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-xs space-y-6 print:border-none print:p-0">
            {/* Header Document */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <h2 className="text-lg font-black text-slate-900">{festSettings.festName} ({festSettings.academicYear})</h2>
              <p className="text-xs text-slate-600">{festSettings.madrassaName} • {festSettings.venue}</p>
              <div className="inline-block mt-2 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-800 border border-slate-300">
                OFFICIAL JUDGE VALUATION SHEET
              </div>
            </div>

            {/* Event Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
              <div>Program: <strong className="text-slate-900 font-bold">{selectedProgram.name}</strong></div>
              <div>Code: <strong className="font-mono text-slate-900">{selectedProgram.code}</strong></div>
              <div>Category: <strong className="text-slate-900">{categories.find(c => c.id === selectedProgram.categoryId)?.name}</strong></div>
              <div>Location: <strong className="text-slate-900">{selectedProgram.location}</strong></div>
            </div>

            {/* Valuation Table */}
            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2.5 border border-slate-300 w-12 text-center">SL</th>
                  <th className="p-2.5 border border-slate-300 w-20 text-center">CODE</th>
                  <th className="p-2.5 border border-slate-300 w-28">CHEST NO</th>
                  <th className="p-2.5 border border-slate-300">CRITERIA 1 (40M)</th>
                  <th className="p-2.5 border border-slate-300">CRITERIA 2 (30M)</th>
                  <th className="p-2.5 border border-slate-300">CRITERIA 3 (30M)</th>
                  <th className="p-2.5 border border-slate-300 w-24 text-center">TOTAL (100)</th>
                  <th className="p-2.5 border border-slate-300 w-20 text-center">RANK</th>
                </tr>
              </thead>
              <tbody>
                {selectedProgram.participants.map((pt, idx) => (
                  <tr key={pt.studentId} className="border-b border-slate-300 h-10">
                    <td className="p-2.5 border border-slate-300 text-center font-semibold">{idx + 1}</td>
                    <td className="p-2.5 border border-slate-300 text-center font-bold font-mono">{pt.codeLetter || '-'}</td>
                    <td className="p-2.5 border border-slate-300 font-mono font-bold">#{pt.chestNo}</td>
                    <td className="p-2.5 border border-slate-300"></td>
                    <td className="p-2.5 border border-slate-300"></td>
                    <td className="p-2.5 border border-slate-300"></td>
                    <td className="p-2.5 border border-slate-300 text-center font-bold text-sm">{pt.marks || ''}</td>
                    <td className="p-2.5 border border-slate-300 text-center font-bold">{pt.rank ? `${pt.rank}` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature Area */}
            <div className="pt-8 flex items-center justify-between text-xs text-slate-700 font-semibold">
              <div>Judge Name: _______________________</div>
              <div>Signature: _______________________</div>
              <div>Convener Signature: _______________________</div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: TEAM-WISE ROSTER CHART */}
      {activeExportType === 'team-chart' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map(team => {
              const teamStudents = students.filter(s => s.teamId === team.id);

              return (
                <div key={team.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: team.color }} />
                      <h4 className="font-bold text-sm text-slate-900">{team.name}</h4>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{teamStudents.length} Students</span>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    {teamStudents.map(st => (
                      <div key={st.id} className="py-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-600 font-bold">#{st.chestNo}</span>
                          <span className="font-bold text-slate-900">{st.name}</span>
                        </div>
                        <span className="text-slate-600 text-[11px]">Class {st.classNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: CATEGORY MASTER CHART */}
      {activeExportType === 'category-chart' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(cat => {
              const catStudents = students.filter(s => s.categoryId === cat.id);
              const catPrograms = programs.filter(p => p.categoryId === cat.id);

              return (
                <div key={cat.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{cat.name}</h4>
                      <p className="text-[11px] text-slate-600">{cat.classes.join(', ')}</p>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-bold text-slate-800">{catStudents.length} Students</div>
                      <div className="text-slate-600">{catPrograms.length} Events</div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="font-semibold text-slate-700">Events in this Category:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {catPrograms.map(p => (
                        <span key={p.id} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                          {p.code} - {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
