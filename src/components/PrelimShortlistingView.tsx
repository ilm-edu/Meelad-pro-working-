import React, { useState, useMemo } from 'react';
import { useFest } from '../context/FestContext';
import { 
  Filter, CheckCircle2, Star, Sparkles, Trophy, 
  ArrowRight, Check, X, ShieldAlert, Award, Search
} from 'lucide-react';
import { Program } from '../types';

export const PrelimShortlistingView: React.FC = () => {
  const { 
    programs, updateProgram, togglePrelimQualification, 
    categories, teams, students, genderFilter 
  } = useFest();

  const [selectedProgId, setSelectedProgId] = useState<string>('');
  const [shortlistCutoff, setShortlistCutoff] = useState<number>(3); // e.g. Top 3 or Top 6 to final stage

  // Programs with prelim round enabled or high participation
  const prelimPrograms = useMemo(() => {
    return programs.filter(p => p.hasPrelimRound || p.participants.length >= 3);
  }, [programs]);

  // Active selected program
  const activeProgram = useMemo(() => {
    if (selectedProgId) return programs.find(p => p.id === selectedProgId);
    return prelimPrograms[0] || null;
  }, [selectedProgId, prelimPrograms, programs]);

  // Sort participants by prelimScore or marks
  const sortedContestants = useMemo(() => {
    if (!activeProgram) return [];
    return [...activeProgram.participants].sort((a, b) => {
      const scoreA = a.prelimScore !== undefined ? a.prelimScore : (a.marks || 0);
      const scoreB = b.prelimScore !== undefined ? b.prelimScore : (b.marks || 0);
      return scoreB - scoreA;
    });
  }, [activeProgram]);

  const handleAutoShortlistTopN = () => {
    if (!activeProgram) return;

    sortedContestants.forEach((pt, idx) => {
      const isQualified = idx < shortlistCutoff;
      togglePrelimQualification(activeProgram.id, pt.studentId, isQualified);
    });

    updateProgram({
      ...activeProgram,
      hasPrelimRound: true,
      prelimCompleted: true
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-transparent p-5 rounded-2xl border border-amber-300/60 shadow-xs space-y-2">
        <div className="flex items-center gap-2.5 text-amber-900 font-bold text-base">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm shadow-xs">
            ⚡
          </div>
          <h3>Preliminary Screening & Final Stage Shortlisting Hub</h3>
        </div>
        <p className="text-xs text-slate-700 max-w-3xl leading-relaxed">
          For high-volume programs (Quran recitation, Malayalam speech, Madhu songs, etc.), organize screening rounds on the eve of the fest. Evaluate contestants and shortlist top performers directly to the Grand Public Stage!
        </p>
      </div>

      {/* Program Selector Grid */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="text-xs font-bold text-slate-700">
          Select Event for Screening & Shortlisting:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {prelimPrograms.map(prog => {
            const isSelected = (activeProgram?.id === prog.id);
            const qualifiedCount = prog.participants.filter(pt => pt.isPrelimQualified).length;

            return (
              <div
                key={prog.id}
                onClick={() => setSelectedProgId(prog.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected 
                    ? 'bg-indigo-50/80 border-indigo-500 shadow-xs ring-1 ring-indigo-500' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {prog.code}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">
                      {prog.name}
                    </h4>
                  </div>

                  {prog.prelimCompleted && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                      Completed
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 text-slate-600">
                  <span>{prog.participants.length} Contestants</span>
                  {qualifiedCount > 0 && (
                    <span className="font-bold text-indigo-700">
                      🌟 {qualifiedCount} Finalists
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contestant Screening Manager for Selected Program */}
      {activeProgram && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                  {activeProgram.code}
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  {activeProgram.name}
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Category: <strong>{categories.find(c => c.id === activeProgram.categoryId)?.name}</strong> • Total Entries: <strong>{activeProgram.participants.length}</strong>
              </p>
            </div>

            {/* Auto Shortlist Action Bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Shortlist Top:</span>
              <select
                value={shortlistCutoff}
                onChange={e => setShortlistCutoff(Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800"
              >
                <option value={2}>Top 2 Finalists</option>
                <option value={3}>Top 3 Finalists</option>
                <option value={4}>Top 4 Finalists</option>
                <option value={5}>Top 5 Finalists</option>
                <option value={6}>Top 6 Finalists</option>
                <option value={8}>Top 8 Finalists</option>
              </select>

              <button
                id="auto-shortlist-btn"
                onClick={handleAutoShortlistTopN}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto Qualify Finalists</span>
              </button>
            </div>
          </div>

          {/* Contestants Screening Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-3">CHEST NO</th>
                  <th className="py-3 px-4">STUDENT NAME</th>
                  <th className="py-3 px-3">TEAM</th>
                  <th className="py-3 px-3">SECRET CODE</th>
                  <th className="py-3 px-3 text-center">PRELIM MARKS</th>
                  <th className="py-3 px-4 text-center">STAGE QUALIFICATION STATUS</th>
                  <th className="py-3 px-3 text-right">MANUAL TOGGLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedContestants.map((pt, idx) => {
                  const student = students.find(s => s.id === pt.studentId);
                  const team = teams.find(t => t.id === pt.teamId);
                  const isQualified = !!pt.isPrelimQualified;

                  return (
                    <tr 
                      key={pt.studentId} 
                      className={`transition-colors ${
                        isQualified ? 'bg-indigo-50/40' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        #{pt.chestNo}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {student?.name}
                      </td>
                      <td className="py-3 px-3 font-semibold" style={{ color: team?.color }}>
                        {team?.name}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-700">
                        {pt.codeLetter || '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          placeholder="Marks"
                          value={pt.prelimScore !== undefined ? pt.prelimScore : (pt.marks || '')}
                          onChange={e => {
                            const val = e.target.value === '' ? undefined : Number(e.target.value);
                            togglePrelimQualification(activeProgram.id, pt.studentId, isQualified, val);
                          }}
                          className="w-16 px-2 py-1 text-center border border-slate-300 rounded font-bold text-xs"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isQualified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Shortlisted to Grand Final</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">
                            Preliminary Pool
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => togglePrelimQualification(activeProgram.id, pt.studentId, !isQualified)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            isQualified 
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          }`}
                        >
                          {isQualified ? 'Revoke Final' : 'Qualify Final'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
