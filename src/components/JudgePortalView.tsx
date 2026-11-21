import React, { useState, useMemo } from 'react';
import { useFest } from '../context/FestContext';
import { Scale, Search, CheckCircle2, Award, User, BookOpen, Check, ArrowLeft, Star } from 'lucide-react';
import { Grade, ProgramParticipant } from '../types';

interface JudgePortalViewProps {
  onBackToAdmin?: () => void;
}

export const JudgePortalView: React.FC<JudgePortalViewProps> = ({ onBackToAdmin }) => {
  const { judges, programs, updateProgramParticipants, categories, students } = useFest();

  const [selectedJudgeId, setSelectedJudgeId] = useState<string>('');
  const [programSearch, setProgramSearch] = useState<string>('');
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [participantSearch, setParticipantSearch] = useState<string>(''); // Lot no or Chest no or name
  
  // Local marks state for the active program
  const [marksState, setMarksState] = useState<Record<string, { marks?: number; grade?: Grade; rank?: 1|2|3|null }>>({});
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const selectedJudge = judges.find(j => j.id === selectedJudgeId);
  const selectedProgram = programs.find(p => p.id === selectedProgramId);

  // Filtered programs for judge to search code/name
  const filteredPrograms = useMemo(() => {
    return programs.filter(prog => {
      const q = programSearch.toLowerCase();
      return prog.code.toLowerCase().includes(q) || prog.name.toLowerCase().includes(q);
    });
  }, [programs, programSearch]);

  // Handle program selection
  const handleSelectProgram = (progId: string) => {
    setSelectedProgramId(progId);
    const prog = programs.find(p => p.id === progId);
    if (prog) {
      const data: typeof marksState = {};
      prog.participants.forEach(pt => {
        data[pt.studentId] = {
          marks: pt.marks,
          grade: pt.grade || 'None',
          rank: pt.rank || null
        };
      });
      setMarksState(data);
    }
    setSaveSuccess(false);
  };

  const calculateAutoGrade = (marks?: number): Grade => {
    if (marks === undefined || isNaN(marks)) return 'None';
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    return 'None';
  };

  const handleMarkChange = (studentId: string, val: string) => {
    const num = val === '' ? undefined : Math.min(100, Math.max(0, Number(val)));
    const grade = calculateAutoGrade(num);

    const updated = {
      ...marksState,
      [studentId]: {
        ...marksState[studentId],
        marks: num,
        grade
      }
    };

    // Auto calculate ranks
    const scoredList = Object.entries(updated).map(([sId, d]: [string, any]) => ({
      studentId: sId,
      marks: d.marks || 0
    })).sort((a, b) => b.marks - a.marks);

    if (scoredList.length > 0 && scoredList[0].marks > 0) {
      scoredList.forEach((item, idx) => {
        if (idx === 0 && item.marks > 0) updated[item.studentId].rank = 1;
        else if (idx === 1 && item.marks > 0) updated[item.studentId].rank = 2;
        else if (idx === 2 && item.marks > 0) updated[item.studentId].rank = 3;
        else updated[item.studentId].rank = null;
      });
    }

    setMarksState(updated);
  };

  const handleSaveMarks = () => {
    if (!selectedProgram) return;

    const updatedParticipants: ProgramParticipant[] = selectedProgram.participants.map(pt => {
      const entry = marksState[pt.studentId];
      return {
        ...pt,
        marks: entry?.marks,
        grade: entry?.grade,
        rank: entry?.rank
      };
    });

    updateProgramParticipants(selectedProgram.id, updatedParticipants);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  // Filter participants by Lot No, Chest No, or Name
  const filteredParticipants = useMemo(() => {
    if (!selectedProgram) return [];
    return selectedProgram.participants.filter(pt => {
      if (!participantSearch.trim()) return true;
      const q = participantSearch.toLowerCase();
      const student = students.find(s => s.id === pt.studentId);
      const chestStr = pt.chestNo ? String(pt.chestNo) : (student?.chestNo ? String(student.chestNo) : '');
      const lotStr = pt.lotNo ? String(pt.lotNo) : '';
      const nameStr = student?.name ? student.name.toLowerCase() : '';

      return chestStr.toLowerCase().includes(q) || lotStr.toLowerCase().includes(q) || nameStr.includes(q);
    });
  }, [selectedProgram, participantSearch, students]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[10px] uppercase">
              Official Judge Portal
            </span>
            <span className="text-xs text-indigo-200">Melad Fest Digital Evaluation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">⚖️ Judge Mark Entry System</h1>
          <p className="text-xs text-indigo-200">Select your name, search program code, and input marks by Lot / Chest number.</p>
        </div>

        {onBackToAdmin && (
          <button
            onClick={onBackToAdmin}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-md transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Dashboard</span>
          </button>
        )}
      </div>

      {/* STEP 1: SELECT JUDGE NAME */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Step 1: Select Your Name (ജഡ്ജിയുടെ പേര് തിരഞ്ഞെടുക്കുക) *</span>
        </label>
        <select
          value={selectedJudgeId}
          onChange={e => setSelectedJudgeId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 bg-slate-50"
        >
          <option value="">-- Click here to select your judge name --</option>
          {judges.map(j => (
            <option key={j.id} value={j.id}>
              {j.name} {j.specialization ? `(${j.specialization})` : ''}
            </option>
          ))}
        </select>
        {selectedJudge && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Logged in as Judge: <strong>{selectedJudge.name}</strong> ({selectedJudge.phone || 'No phone'})</span>
          </div>
        )}
      </div>

      {selectedJudgeId && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* STEP 2: SEARCH & SELECT PROGRAM */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Step 2: Search Program Code or Name (പ്രോഗ്രാം കോഡ് അല്ലെങ്കിൽ പേര് നൽകി തിരയുക) *</span>
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Type program code (e.g. P-01) or name (e.g. Quran)..."
                value={programSearch}
                onChange={e => setProgramSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Quick Program Suggestions / Dropdown list */}
            {programSearch.trim() && (
              <div className="max-h-60 overflow-y-auto space-y-1.5 pt-2 border-t border-slate-100">
                {filteredPrograms.length === 0 ? (
                  <p className="text-xs text-slate-500 p-2 text-center">No matching programs found.</p>
                ) : (
                  filteredPrograms.map(prog => {
                    const cat = categories.find(c => c.id === prog.categoryId);
                    const isSelected = prog.id === selectedProgramId;
                    return (
                      <div
                        key={prog.id}
                        onClick={() => handleSelectProgram(prog.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'bg-indigo-50 border-indigo-300 shadow-xs' 
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-900 text-white">
                              {prog.code}
                            </span>
                            <span className="font-extrabold text-slate-900 text-sm">{prog.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {cat?.name || 'General'} • {prog.type} ({prog.location}) • {prog.participants.length} Participants
                          </div>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-indigo-600" />}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {selectedProgram && (
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-indigo-900 font-bold block text-sm">Selected: {selectedProgram.code} - {selectedProgram.name}</span>
                  <span className="text-indigo-700">Total Participants: {selectedProgram.participants.length}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                  selectedProgram.status === 'Evaluated' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  Status: {selectedProgram.status}
                </span>
              </div>
            )}
          </div>

          {/* STEP 3: SEARCH BY LOT / CHEST NO & ENTER MARKS */}
          {selectedProgram && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <span>Step 3: Search Lot / Chest Number & Enter Marks</span>
                  </h3>
                  <p className="text-xs text-slate-500">Search participant by Lot number, chest number, or name, then input marks (0 - 100).</p>
                </div>
                
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Lot No / Chest No..."
                    value={participantSearch}
                    onChange={e => setParticipantSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              {selectedProgram.participants.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
                  No participants are assigned to this program yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                        <th className="py-3 px-3">LOT NO</th>
                        <th className="py-3 px-3">CHEST NO</th>
                        <th className="py-3 px-3">STUDENT NAME</th>
                        <th className="py-3 px-3">TEAM</th>
                        <th className="py-3 px-3 text-center">MARKS (0-100)</th>
                        <th className="py-3 px-3 text-center">GRADE</th>
                        <th className="py-3 px-3 text-center">RANK</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredParticipants.map(pt => {
                        const student = students.find(s => s.id === pt.studentId);
                        const entry = marksState[pt.studentId] || {};
                        const chestNo = pt.chestNo || student?.chestNo || '-';
                        const lotNo = pt.lotNo || '-';

                        return (
                          <tr key={pt.studentId} className="hover:bg-slate-50/80">
                            <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                              #{lotNo}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">
                              #{chestNo}
                            </td>
                            <td className="py-3 px-3 font-extrabold text-slate-900">
                              {student?.name || 'Unknown Student'}
                            </td>
                            <td className="py-3 px-3 text-slate-600 font-medium">
                              {student?.teamId ? student.teamId.replace('team-', 'Team ').toUpperCase() : '-'}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Marks"
                                value={entry.marks !== undefined ? entry.marks : ''}
                                onChange={e => handleMarkChange(pt.studentId, e.target.value)}
                                className="w-20 px-3 py-1.5 rounded-xl border border-slate-300 font-black text-center text-indigo-700 bg-indigo-50/50 focus:ring-2 focus:ring-indigo-500 text-sm"
                              />
                            </td>
                            <td className="py-3 px-3 text-center font-black">
                              <span className={`px-2.5 py-1 rounded-lg text-xs ${
                                entry.grade === 'A+' ? 'bg-purple-100 text-purple-800' :
                                entry.grade === 'A' ? 'bg-indigo-100 text-indigo-800' :
                                entry.grade === 'B+' ? 'bg-blue-100 text-blue-800' :
                                entry.grade === 'B' ? 'bg-teal-100 text-teal-800' :
                                entry.grade === 'C' ? 'bg-amber-100 text-amber-800' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {entry.grade || 'None'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center font-black text-slate-900">
                              {entry.rank ? (
                                <span className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs text-white ${
                                  entry.rank === 1 ? 'bg-amber-500 shadow-sm' :
                                  entry.rank === 2 ? 'bg-slate-400' : 'bg-amber-700'
                                }`}>
                                  {entry.rank}
                               </span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {saveSuccess ? (
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Marks successfully saved and updated on live scoreboard!</span>
                  </div>
                ) : <div />}

                <button
                  onClick={handleSaveMarks}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Marks & Update Grades</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
