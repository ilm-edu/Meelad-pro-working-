import React, { useState, useMemo } from 'react';
import { useFest } from '../context/FestContext';
import { 
  BookOpen, Plus, Search, Filter, Edit2, Trash2, 
  Users, CheckCircle2, Clock, X, AlertCircle, 
  MapPin, Check, Sparkles, Filter as FilterIcon, ShieldCheck
} from 'lucide-react';
import { Program, ProgramLocation, ProgramType, ProgramStatus } from '../types';

export const ProgramsView: React.FC = () => {
  const { 
    programs, addProgram, updateProgram, deleteProgram, 
    updateProgramParticipants, categories, teams, students, stages,
    genderFilter, setGenderFilter 
  } = useFest();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>(genderFilter === 'All' ? 'All' : genderFilter);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [progForm, setProgForm] = useState<{
    name: string;
    malayalamName: string;
    categoryId: string;
    isGeneralOpen: boolean;
    gender: 'Male' | 'Female' | 'Mix';
    location: ProgramLocation;
    type: ProgramType;
    maxParticipantsPerTeam: number;
    durationMinutes: number;
    stageId: string;
    hasPrelimRound: boolean;
  }>({
    name: '',
    malayalamName: '',
    categoryId: categories[0]?.id || '',
    isGeneralOpen: false,
    gender: 'Male',
    location: 'Stage',
    type: 'Individual',
    maxParticipantsPerTeam: 2,
    durationMinutes: 20,
    stageId: stages[0]?.id || '',
    hasPrelimRound: false
  });

  // Program-wise Participant Assignment Modal
  const [assignModalProgram, setAssignModalProgram] = useState<Program | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [participantCodeLetters, setParticipantCodeLetters] = useState<Record<string, string>>({});
  const [teamLimitError, setTeamLimitError] = useState<string | null>(null);

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return programs.filter(prog => {
      // Search
      const matchSearch = 
        prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prog.malayalamName && prog.malayalamName.includes(searchQuery));
      if (!matchSearch) return false;

      // Category
      if (selectedCategory !== 'All' && prog.categoryId !== selectedCategory && !prog.isGeneralOpen) return false;

      // Gender
      if (selectedGender !== 'All' && prog.gender !== selectedGender && prog.gender !== 'Mix') return false;

      // Location
      if (selectedLocation !== 'All' && prog.location !== selectedLocation) return false;

      // Status
      if (selectedStatus !== 'All' && prog.status !== selectedStatus) return false;

      return true;
    });
  }, [programs, searchQuery, selectedCategory, selectedGender, selectedLocation, selectedStatus]);

  // Open Create/Edit Program
  const handleOpenAddModal = (program?: Program) => {
    if (program) {
      setEditingProgram(program);
      setProgForm({
        name: program.name,
        malayalamName: program.malayalamName || '',
        categoryId: program.categoryId,
        isGeneralOpen: !!program.isGeneralOpen,
        gender: program.gender,
        location: program.location,
        type: program.type,
        maxParticipantsPerTeam: program.maxParticipantsPerTeam,
        durationMinutes: program.durationMinutes,
        stageId: program.stageId || stages[0]?.id || '',
        hasPrelimRound: !!program.hasPrelimRound
      });
    } else {
      setEditingProgram(null);
      setProgForm({
        name: '',
        malayalamName: '',
        categoryId: categories[0]?.id || '',
        isGeneralOpen: false,
        gender: 'Male',
        location: 'Stage',
        type: 'Individual',
        maxParticipantsPerTeam: 2,
        durationMinutes: 20,
        stageId: stages[0]?.id || '',
        hasPrelimRound: false
      });
    }
    setIsAddModalOpen(true);
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progForm.name.trim()) return;

    if (editingProgram) {
      updateProgram({
        ...editingProgram,
        name: progForm.name,
        malayalamName: progForm.malayalamName,
        categoryId: progForm.categoryId,
        isGeneralOpen: progForm.isGeneralOpen,
        gender: progForm.gender,
        location: progForm.location,
        type: progForm.type,
        maxParticipantsPerTeam: Number(progForm.maxParticipantsPerTeam) || 2,
        durationMinutes: Number(progForm.durationMinutes) || 20,
        stageId: progForm.stageId,
        hasPrelimRound: progForm.hasPrelimRound
      });
    } else {
      addProgram({
        name: progForm.name,
        malayalamName: progForm.malayalamName,
        categoryId: progForm.categoryId,
        isGeneralOpen: progForm.isGeneralOpen,
        gender: progForm.gender,
        location: progForm.location,
        type: progForm.type,
        status: 'Pending',
        maxParticipantsPerTeam: Number(progForm.maxParticipantsPerTeam) || 2,
        durationMinutes: Number(progForm.durationMinutes) || 20,
        stageId: progForm.stageId,
        hasPrelimRound: progForm.hasPrelimRound,
        judgesAssigned: [],
        participants: []
      });
    }
    setIsAddModalOpen(false);
  };

  // Open Program-wise Student Assignment
  const handleOpenAssignModal = (program: Program) => {
    setAssignModalProgram(program);
    setSelectedStudentIds(program.participants.map(pt => pt.studentId));
    const codes: Record<string, string> = {};
    program.participants.forEach(pt => {
      if (pt.codeLetter) codes[pt.studentId] = pt.codeLetter;
    });
    setParticipantCodeLetters(codes);
    setTeamLimitError(null);
  };

  const handleToggleStudent = (studentId: string) => {
    setTeamLimitError(null);
    setSelectedStudentIds(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSaveProgramParticipants = () => {
    if (!assignModalProgram) return;

    // Check team limits
    const teamCounts: Record<string, number> = {};
    selectedStudentIds.forEach(sId => {
      const student = students.find(s => s.id === sId);
      if (student?.teamId) {
        teamCounts[student.teamId] = (teamCounts[student.teamId] || 0) + 1;
      }
    });

    for (const [teamId, count] of Object.entries(teamCounts)) {
      if (count > assignModalProgram.maxParticipantsPerTeam) {
        const teamName = teams.find(t => t.id === teamId)?.name || 'Team';
        setTeamLimitError(`${teamName} has ${count} students selected (Maximum limit is ${assignModalProgram.maxParticipantsPerTeam} per team).`);
        return;
      }
    }

    // Build new participant list preserving existing marks if any
    const existingMap = new Map<string, any>(assignModalProgram.participants.map(pt => [pt.studentId, pt]));
    const defaultLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M'];

    const newParticipants = selectedStudentIds.map((studentId, idx) => {
      const student = students.find(s => s.id === studentId)!;
      const existing = existingMap.get(studentId) as any;
      return {
        studentId,
        chestNo: student.chestNo,
        teamId: student.teamId,
        codeLetter: participantCodeLetters[studentId] || existing?.codeLetter || defaultLetters[idx % defaultLetters.length],
        marks: existing?.marks,
        grade: existing?.grade,
        rank: existing?.rank,
        isPrelimQualified: existing?.isPrelimQualified
      };
    });

    updateProgramParticipants(assignModalProgram.id, newParticipants);
    setAssignModalProgram(null);
  };

  // Eligible students for current program
  const eligibleStudentsForProgram = useMemo(() => {
    if (!assignModalProgram) return [];
    return students.filter(s => {
      const matchGender = assignModalProgram.gender === 'Mix' || s.gender === assignModalProgram.gender;
      const matchCategory = assignModalProgram.isGeneralOpen || s.categoryId === assignModalProgram.categoryId;
      return matchGender && matchCategory;
    });
  }, [assignModalProgram, students]);

  const getStatusBadge = (status: ProgramStatus) => {
    switch (status) {
      case 'Published':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">✅ Published</span>;
      case 'Evaluated':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">⚡ Evaluated</span>;
      case 'In Progress':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">⏳ In Progress</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Pending</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls (Matching PDF page 7) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Manage Programs</h2>
            <p className="text-xs text-slate-600">
              Manage competition, stage and general programs with Malayalam typography & screening options.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="add-prog-btn"
              onClick={() => handleOpenAddModal(undefined)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Program</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search program or code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={selectedGender}
            onChange={e => setSelectedGender(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
          >
            <option value="All">All Genders</option>
            <option value="Male">👦 Boys Section</option>
            <option value="Female">👧 Girls Section</option>
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
          >
            <option value="All">All Stages / Locations</option>
            <option value="Stage">🎭 On Stage</option>
            <option value="Off Stage">✍️ Off Stage</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Evaluated">Evaluated (Ready to Publish)</option>
            <option value="Published">Published</option>
          </select>
        </div>
      </div>

      {/* Programs Table (Matching PDF page 7) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>Showing <strong>{filteredPrograms.length}</strong> of {programs.length} programs</span>
          <span className="text-[11px] text-slate-600">
            Click <strong>"Add Students"</strong> on any row to register competitors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
                <th className="py-3 px-3 w-12 text-center">SL NO.</th>
                <th className="py-3 px-3">PROG NO.</th>
                <th className="py-3 px-4">PROGRAM NAME</th>
                <th className="py-3 px-3">TYPE</th>
                <th className="py-3 px-3">LOCATION</th>
                <th className="py-3 px-3">CATEGORY</th>
                <th className="py-3 px-3 text-center">PARTICIPANTS</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-600">
                    No programs match your search filters.
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((prog, index) => {
                  const category = categories.find(c => c.id === prog.categoryId);

                  return (
                    <tr key={prog.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3 text-center text-slate-600 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {prog.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{prog.name}</span>
                          {prog.hasPrelimRound && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              Prelims
                            </span>
                          )}
                        </div>
                        {prog.scheduledTime && (
                          <div className="text-[10px] text-slate-600 font-normal mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-600" />
                            <span>{prog.scheduledTime}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700">
                        {prog.type}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          prog.location === 'Stage'
                            ? 'bg-purple-100 text-purple-800'
                            : (prog.location === 'Sports' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800')
                        }`}>
                          {prog.location}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-700 font-medium">
                        {prog.isGeneralOpen ? (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 text-[10px]">
                            🌐 General Open
                          </span>
                        ) : (
                          category?.name || 'General Event'
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => handleOpenAssignModal(prog)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <Users className="w-3 h-3 text-indigo-600" />
                          <span>{prog.participants.length} Participants</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {getStatusBadge(prog.status)}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenAddModal(prog)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Program"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete program "${prog.name}"?`)) {
                                deleteProgram(prog.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Program"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: PROGRAM-WISE PARTICIPANT ASSIGNMENT */}
      {assignModalProgram && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl p-5 space-y-4 shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    {assignModalProgram.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">
                    {assignModalProgram.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Category: <strong>{categories.find(c => c.id === assignModalProgram.categoryId)?.name || 'General'}</strong> • Limit: <strong>{assignModalProgram.maxParticipantsPerTeam} per team</strong>
                </p>
              </div>
              <button 
                onClick={() => setAssignModalProgram(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error if team limit exceeded */}
            {teamLimitError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{teamLimitError}</span>
              </div>
            )}

            {/* Eligible Students List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              <div className="text-xs font-bold text-slate-700 pb-1 flex items-center justify-between">
                <span>Select registered students for this event:</span>
                <span className="text-indigo-600 font-semibold">{selectedStudentIds.length} Selected</span>
              </div>

              {eligibleStudentsForProgram.length === 0 ? (
                <div className="text-center py-8 text-slate-600 text-xs">
                  No eligible students found for this category and gender.
                </div>
              ) : (
                eligibleStudentsForProgram.map(student => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  const team = teams.find(t => t.id === student.teamId);

                  return (
                    <div
                      key={student.id}
                      onClick={() => handleToggleStudent(student.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-indigo-50/80 border-indigo-300 shadow-xs' 
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by parent onClick
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-800">#{student.chestNo}</span>
                            <span className="font-bold text-xs text-slate-900">{student.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-0.5">
                            <span>Class {student.classNumber}</span>
                            <span>•</span>
                            <span className="font-semibold" style={{ color: team?.color }}>
                              {team?.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Secret Code Letter for Fair Judge Scoring */}
                      {isSelected && (
                        <div 
                          onClick={e => e.stopPropagation()} 
                          className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200"
                        >
                          <span className="text-[10px] text-slate-600 font-semibold">Code:</span>
                          <input
                            type="text"
                            maxLength={3}
                            value={participantCodeLetters[student.id] || ''}
                            placeholder="A"
                            onChange={e => setParticipantCodeLetters({
                              ...participantCodeLetters,
                              [student.id]: e.target.value.toUpperCase()
                            })}
                            className="w-8 h-6 text-center font-bold text-xs bg-slate-50 border border-slate-300 rounded uppercase focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-600">
                Secret codes (A, B, C...) conceal identities from judges.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalProgram(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProgramParticipants}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Participants</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT PROGRAM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingProgram ? 'Edit Program' : 'Create New Program'}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">PROGRAM NAME (ENGLISH / MALAYALAM) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ഖുർആൻ പാരായണം (Quran Recitation)"
                  value={progForm.name}
                  onChange={e => setProgForm({ ...progForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* General / Open Event Checkbox */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="is-general-open-checkbox"
                  checked={progForm.isGeneralOpen}
                  onChange={e => setProgForm({ ...progForm, isGeneralOpen: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="is-general-open-checkbox" className="text-xs text-slate-700 cursor-pointer">
                  <strong className="text-indigo-900 block font-bold">🌐 General / Open Event (പൊതു മത്സരം)</strong>
                  <span>Kids, Sub-Junior, Junior, Senior വ്യത്യാസമില്ലാതെ <strong>എല്ലാവർക്കും</strong> പങ്കെടുക്കാവുന്ന ഇവന്റ്.</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    CATEGORY {progForm.isGeneralOpen ? '(N/A - General Open)' : '*'}
                  </label>
                  <select
                    value={progForm.categoryId}
                    disabled={progForm.isGeneralOpen}
                    onChange={e => setProgForm({ ...progForm, categoryId: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 ${progForm.isGeneralOpen ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GENDER / SECTION *</label>
                  <select
                    value={progForm.gender}
                    onChange={e => setProgForm({ ...progForm, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
                  >
                    <option value="Male">👦 Boys Section</option>
                    <option value="Female">👧 Girls Section</option>
                    <option value="Mix">⚡ Mix / Common (കോമൺ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">VENUE TYPE (സ്റ്റേജ് / ഓഫ്-സ്റ്റേജ് / സ്പോർട്സ്) *</label>
                  <select
                    value={progForm.location}
                    onChange={e => setProgForm({ ...progForm, location: e.target.value as ProgramLocation })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
                  >
                    <option value="Stage">🎭 On Stage</option>
                    <option value="Off Stage">✍️ Off Stage</option>
                    <option value="Sports">⚽ Sports / മത്സരയിനങ്ങൾ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PROGRAM TYPE *</label>
                  <select
                    value={progForm.type}
                    onChange={e => setProgForm({ ...progForm, type: e.target.value as ProgramType })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
                  >
                    <option value="Individual">Individual Event</option>
                    <option value="Group">Group Event</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">MAX ENTRIES / TEAM</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={progForm.maxParticipantsPerTeam}
                    onChange={e => setProgForm({ ...progForm, maxParticipantsPerTeam: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">DURATION (MINUTES)</label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={progForm.durationMinutes}
                    onChange={e => setProgForm({ ...progForm, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Preliminary Screening Toggle (User requirement for crowded events) */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="has-prelim-checkbox"
                  checked={progForm.hasPrelimRound}
                  onChange={e => setProgForm({ ...progForm, hasPrelimRound: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="has-prelim-checkbox" className="text-xs text-slate-700 cursor-pointer">
                  <strong className="text-amber-900 block font-bold">Enable Preliminary / Pre-screening Round</strong>
                  <span>For crowded events (many participants), enables pre-fest screening to shortlist finalists for the main public stage.</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                >
                  {editingProgram ? 'Save Changes' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
