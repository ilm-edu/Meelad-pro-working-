import React, { useState, useMemo } from 'react';
import { useFest } from '../context/FestContext';
import { 
  PenTool, Search, Filter, Users, Scale, 
  CheckCircle2, AlertCircle, X, Check, Edit2, 
  Trash2, Plus, Sparkles, Award, Star, ShieldCheck,
  Trophy, GraduationCap, Calendar, Printer, FileText, ChevronRight,
  QrCode, ExternalLink, Copy
} from 'lucide-react';
import { Program, ProgramParticipant, Judge, Grade, ClassAward } from '../types';

export const MarkEntryView: React.FC = () => {
  const { 
    programs, updateProgramParticipants, updateProgram, categories, 
    teams, students, judges, addJudge, updateJudge, deleteJudge,
    classAwards, addClassAward, updateClassAward, deleteClassAward,
    genderFilter 
  } = useFest();

  const [activeEntryMode, setActiveEntryMode] = useState<'programs' | 'class-awards'>('programs');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>(genderFilter === 'All' ? 'All' : genderFilter);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Judge QR Modal state
  const [isJudgeQrModalOpen, setIsJudgeQrModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Mark Entry Modal for Programs
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const [participantMarks, setParticipantMarks] = useState<Record<string, {
    marks?: number;
    grade?: Grade;
    rank?: 1 | 2 | 3 | null;
    codeLetter?: string;
    remarks?: string;
  }>>({});
  const [selectedJudgeId, setSelectedJudgeId] = useState<string>('');

  // Judges Management Modal
  const [isJudgesModalOpen, setIsJudgesModalOpen] = useState(false);
  const [isAddJudgeOpen, setIsAddJudgeOpen] = useState(false);
  const [editingJudge, setEditingJudge] = useState<Judge | null>(null);
  const [judgeForm, setJudgeForm] = useState({
    name: '',
    phone: '',
    specialization: '',
    notes: ''
  });

  // Class & Special Awards State
  const [classAwardSearch, setClassAwardSearch] = useState('');
  const [selectedAwardFilter, setSelectedAwardFilter] = useState<string>('All');
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<ClassAward | null>(null);
  const [selectedAwardForPrint, setSelectedAwardForPrint] = useState<ClassAward | null>(null);
  
  const [awardForm, setAwardForm] = useState<{
    awardType: string;
    customAwardType: string;
    classStandard: string;
    date: string;
    winner1Name: string;
    winner1ChestNo: string;
    winner1TeamId: string;
    winner2Name: string;
    winner2ChestNo: string;
    winner2TeamId: string;
    winner3Name: string;
    winner3ChestNo: string;
    winner3TeamId: string;
  }>({
    awardType: '100% Attendance Proficiency',
    customAwardType: '',
    classStandard: 'Class 5',
    date: new Date().toISOString().split('T')[0],
    winner1Name: '',
    winner1ChestNo: '',
    winner1TeamId: '',
    winner2Name: '',
    winner2ChestNo: '',
    winner2TeamId: '',
    winner3Name: '',
    winner3ChestNo: '',
    winner3TeamId: ''
  });

  // Filtered programs
  const filteredPrograms = useMemo(() => {
    return programs.filter(prog => {
      const matchSearch = 
        prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.code.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      if (selectedCategory !== 'All' && prog.categoryId !== selectedCategory) return false;
      if (selectedGender !== 'All' && prog.gender !== selectedGender) return false;
      if (selectedLocation !== 'All' && prog.location !== selectedLocation) return false;
      if (selectedStatus !== 'All' && prog.status !== selectedStatus) return false;

      return true;
    });
  }, [programs, searchQuery, selectedCategory, selectedGender, selectedLocation, selectedStatus]);

  // Filtered class awards
  const filteredClassAwards = useMemo(() => {
    return classAwards.filter(award => {
      const matchSearch = 
        award.awardType.toLowerCase().includes(classAwardSearch.toLowerCase()) ||
        award.classStandard.toLowerCase().includes(classAwardSearch.toLowerCase()) ||
        award.winners.some(w => w.studentName.toLowerCase().includes(classAwardSearch.toLowerCase()));
      if (!matchSearch) return false;

      if (selectedAwardFilter !== 'All' && award.awardType !== selectedAwardFilter) return false;

      return true;
    });
  }, [classAwards, classAwardSearch, selectedAwardFilter]);

  // Helper student picker handler
  const handleStudentSelectForWinner = (place: 1 | 2 | 3, studentId: string) => {
    if (!studentId) return;
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (place === 1) {
      setAwardForm(prev => ({
        ...prev,
        winner1Name: student.name,
        winner1ChestNo: student.chestNo ? String(student.chestNo) : '',
        winner1TeamId: student.teamId || ''
      }));
    } else if (place === 2) {
      setAwardForm(prev => ({
        ...prev,
        winner2Name: student.name,
        winner2ChestNo: student.chestNo ? String(student.chestNo) : '',
        winner2TeamId: student.teamId || ''
      }));
    } else if (place === 3) {
      setAwardForm(prev => ({
        ...prev,
        winner3Name: student.name,
        winner3ChestNo: student.chestNo ? String(student.chestNo) : '',
        winner3TeamId: student.teamId || ''
      }));
    }
  };

  // Open Award Modal for Create or Edit
  const handleOpenAwardModal = (award?: ClassAward) => {
    if (award) {
      setEditingAward(award);
      const isPredefined = [
        '100% Attendance Proficiency',
        'Annual Examination Topper',
        'Hifz Al-Quran Proficiency',
        'Best Disciplined Student',
        'Moral Science Topper',
        'General Proficiency Award',
        'Alumni / Passed Out Special Award'
      ].includes(award.awardType);

      const w1 = award.winners.find(w => w.place === 1);
      const w2 = award.winners.find(w => w.place === 2);
      const w3 = award.winners.find(w => w.place === 3);

      setAwardForm({
        awardType: isPredefined ? award.awardType : 'Other / Custom',
        customAwardType: isPredefined ? '' : award.awardType,
        classStandard: award.classStandard,
        date: award.date || new Date().toISOString().split('T')[0],
        winner1Name: w1?.studentName || '',
        winner1ChestNo: w1?.chestNo ? String(w1.chestNo) : '',
        winner1TeamId: w1?.teamId || '',
        winner2Name: w2?.studentName || '',
        winner2ChestNo: w2?.chestNo ? String(w2.chestNo) : '',
        winner2TeamId: w2?.teamId || '',
        winner3Name: w3?.studentName || '',
        winner3ChestNo: w3?.chestNo ? String(w3.chestNo) : '',
        winner3TeamId: w3?.teamId || ''
      });
    } else {
      setEditingAward(null);
      setAwardForm({
        awardType: '100% Attendance Proficiency',
        customAwardType: '',
        classStandard: 'Class 5',
        date: new Date().toISOString().split('T')[0],
        winner1Name: '',
        winner1ChestNo: '',
        winner1TeamId: '',
        winner2Name: '',
        winner2ChestNo: '',
        winner2TeamId: '',
        winner3Name: '',
        winner3ChestNo: '',
        winner3TeamId: ''
      });
    }
    setIsAwardModalOpen(true);
  };

  // Save Award (Add / Edit)
  const handleSaveAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardForm.winner1Name.trim()) return;

    const finalAwardType = awardForm.awardType === 'Other / Custom' 
      ? (awardForm.customAwardType.trim() || 'Special Award') 
      : awardForm.awardType;

    const winners: ClassAward['winners'] = [
      {
        place: 1,
        studentName: awardForm.winner1Name.trim(),
        chestNo: awardForm.winner1ChestNo ? Number(awardForm.winner1ChestNo) : undefined,
        teamId: awardForm.winner1TeamId || undefined
      }
    ];

    if (awardForm.winner2Name.trim()) {
      winners.push({
        place: 2,
        studentName: awardForm.winner2Name.trim(),
        chestNo: awardForm.winner2ChestNo ? Number(awardForm.winner2ChestNo) : undefined,
        teamId: awardForm.winner2TeamId || undefined
      });
    }

    if (awardForm.winner3Name.trim()) {
      winners.push({
        place: 3,
        studentName: awardForm.winner3Name.trim(),
        chestNo: awardForm.winner3ChestNo ? Number(awardForm.winner3ChestNo) : undefined,
        teamId: awardForm.winner3TeamId || undefined
      });
    }

    if (editingAward) {
      updateClassAward({
        ...editingAward,
        awardType: finalAwardType,
        classStandard: awardForm.classStandard.trim(),
        date: awardForm.date,
        winners
      });
    } else {
      addClassAward({
        awardType: finalAwardType,
        classStandard: awardForm.classStandard.trim(),
        date: awardForm.date,
        winners
      });
    }

    setIsAwardModalOpen(false);
  };

  // Open Mark Entry Modal for program
  const handleOpenMarkEntry = (prog: Program) => {
    setActiveProgram(prog);
    const marksData: typeof participantMarks = {};
    prog.participants.forEach(pt => {
      marksData[pt.studentId] = {
        marks: pt.marks,
        grade: pt.grade || 'None',
        rank: pt.rank || null,
        codeLetter: pt.codeLetter || '',
        remarks: pt.remarks || ''
      };
    });
    setParticipantMarks(marksData);
    setSelectedJudgeId(prog.judgesAssigned[0] || (judges[0]?.id || ''));
  };

  // Helper auto grade from marks
  const calculateAutoGrade = (marks?: number): Grade => {
    if (marks === undefined || isNaN(marks) || marks === 0) return 'None';
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    return 'None';
  };

  const handleMarkChange = (studentId: string, val: string) => {
    const num = val === '' ? undefined : Math.min(100, Math.max(0, Number(val)));
    const autoGrade = calculateAutoGrade(num);

    const updated = {
      ...participantMarks,
      [studentId]: {
        ...participantMarks[studentId],
        marks: num,
        grade: autoGrade
      }
    };

    // Auto calculate ranks if all have marks
    const studentList = Object.entries(updated).map(([sId, data]: [string, any]) => ({
      studentId: sId,
      marks: data.marks || 0
    })).sort((a, b) => b.marks - a.marks);

    if (studentList.length > 0 && studentList[0].marks > 0) {
      studentList.forEach((item, idx) => {
        if (idx === 0 && item.marks > 0) updated[item.studentId].rank = 1;
        else if (idx === 1 && item.marks > 0) updated[item.studentId].rank = 2;
        else if (idx === 2 && item.marks > 0) updated[item.studentId].rank = 3;
        else updated[item.studentId].rank = null;
      });
    }

    setParticipantMarks(updated);
  };

  const handleSaveMarks = () => {
    if (!activeProgram) return;

    const updatedParticipants: ProgramParticipant[] = activeProgram.participants.map(pt => {
      const entry = participantMarks[pt.studentId];
      return {
        ...pt,
        marks: entry?.marks,
        grade: entry?.grade,
        rank: entry?.rank,
        codeLetter: entry?.codeLetter || pt.codeLetter,
        remarks: entry?.remarks
      };
    });

    updateProgramParticipants(activeProgram.id, updatedParticipants);

    // Save assigned judge if chosen
    if (selectedJudgeId) {
      updateProgram({
        ...activeProgram,
        judgesAssigned: [selectedJudgeId]
      });
    }

    setActiveProgram(null);
  };

  // Open Judge Create/Edit
  const handleOpenJudgeModal = (judge?: Judge) => {
    if (judge) {
      setEditingJudge(judge);
      setJudgeForm({
        name: judge.name,
        phone: judge.phone,
        specialization: judge.specialization || '',
        notes: judge.notes || ''
      });
    } else {
      setEditingJudge(null);
      setJudgeForm({
        name: '',
        phone: '',
        specialization: '',
        notes: ''
      });
    }
    setIsAddJudgeOpen(true);
  };

  const handleSaveJudge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judgeForm.name.trim()) return;

    if (editingJudge) {
      updateJudge({
        ...editingJudge,
        name: judgeForm.name,
        phone: judgeForm.phone,
        specialization: judgeForm.specialization,
        notes: judgeForm.notes
      });
    } else {
      addJudge({
        name: judgeForm.name,
        phone: judgeForm.phone,
        specialization: judgeForm.specialization,
        notes: judgeForm.notes
      });
    }
    setIsAddJudgeOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Main Mode Switcher Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 p-1">
          <button
            id="tab-mode-programs"
            onClick={() => setActiveEntryMode('programs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
              activeEntryMode === 'programs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Program Marks & Judging</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeEntryMode === 'programs' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {programs.length}
            </span>
          </button>

          <button
            id="tab-mode-class-awards"
            onClick={() => setActiveEntryMode('class-awards')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
              activeEntryMode === 'class-awards'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Class & Special Awards Entry (ക്ലാസ് അവാർഡുകൾ)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeEntryMode === 'class-awards' ? 'bg-purple-800 text-white' : 'bg-purple-100 text-purple-800'
            }`}>
              {classAwards.length}
            </span>
          </button>
        </div>

        {activeEntryMode === 'programs' && (
          <div className="flex items-center gap-2 px-2 self-start sm:self-auto flex-wrap">
            <button
              id="judge-portal-qr-btn"
              onClick={() => setIsJudgeQrModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>📱 Judge Portal QR & Link</span>
            </button>

            <button
              id="judges-mgmt-btn"
              onClick={() => setIsJudgesModalOpen(true)}
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-purple-600" />
              <span>Judges Panel ({judges.length})</span>
            </button>
          </div>
        )}

        {activeEntryMode === 'class-awards' && (
          <div className="flex items-center gap-2 px-2 self-start sm:self-auto">
            <button
              id="add-class-award-top-btn"
              onClick={() => handleOpenAwardModal()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Class Award Entry</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: PROGRAMS MARK VALUATION */}
      {activeEntryMode === 'programs' && (
        <div className="space-y-4">
          {/* Header & Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Program Mark Entry & Valuation</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Fair Blind Judging
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Input marks scored by participants, auto-award grades (A+, A, B+...) and compute ranks.
                </p>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

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

              <select
                value={selectedGender}
                onChange={e => setSelectedGender(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
              >
                <option value="All">All Genders</option>
                <option value="Male">👦 Boys Events</option>
                <option value="Female">👧 Girls Events</option>
              </select>

              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
              >
                <option value="All">All Stages</option>
                <option value="Stage">🎭 Stage</option>
                <option value="Off Stage">✍️ Off Stage</option>
              </select>

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Evaluated">Evaluated</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          {/* Program Mark Entry List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
                    <th className="py-3 px-4">PROGRAM NAME</th>
                    <th className="py-3 px-3">TYPE</th>
                    <th className="py-3 px-3">CATEGORY</th>
                    <th className="py-3 px-3 text-center">PARTICIPANTS</th>
                    <th className="py-3 px-3 text-center">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPrograms.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-600">
                        No programs found for mark valuation.
                      </td>
                    </tr>
                  ) : (
                    filteredPrograms.map(prog => {
                      const category = categories.find(c => c.id === prog.categoryId);
                      const isReady = prog.participants.length > 0;

                      return (
                        <tr key={prog.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-600">{prog.code}</span>
                              <span>{prog.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-700">
                            {prog.type} ({prog.location})
                          </td>
                          <td className="py-3.5 px-3 text-slate-700 font-medium">
                            {category?.name || 'General'}
                          </td>
                          <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                            {prog.participants.length} Entries
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prog.status === 'Published' ? 'bg-emerald-100 text-emerald-800' :
                              prog.status === 'Evaluated' ? 'bg-amber-100 text-amber-900' :
                              prog.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {prog.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleOpenMarkEntry(prog)}
                              disabled={!isReady}
                              className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors shadow-xs ${
                                !isReady 
                                  ? 'bg-slate-100 text-slate-600 cursor-not-allowed'
                                  : prog.status === 'Evaluated' || prog.status === 'Published'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              }`}
                            >
                              {prog.status === 'Evaluated' || prog.status === 'Published' ? '✏️ Edit Marks' : '📝 Mark Entry'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CLASS & SPECIAL AWARDS ENTRY */}
      {activeEntryMode === 'class-awards' && (
        <div className="space-y-4">
          {/* Header Info & Filters */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">Class & Special Awards Entry</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                    Manual Honor Entry
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Enter and manage special proficiency awards (100% Attendance, Annual Exam Toppers, Hifz, Moral Science, Alumni/Passed Out).
                  These entries directly appear on the Live Results & Public Portal.
                </p>
              </div>

              <button
                id="add-new-class-award-btn"
                onClick={() => handleOpenAwardModal()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Class Award</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-100">
              <div className="relative sm:col-span-2">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student name, class standard, or award title..."
                  value={classAwardSearch}
                  onChange={e => setClassAwardSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <select
                value={selectedAwardFilter}
                onChange={e => setSelectedAwardFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
              >
                <option value="All">All Award Types</option>
                <option value="100% Attendance Proficiency">100% Attendance Proficiency</option>
                <option value="Annual Examination Topper">Annual Examination Topper</option>
                <option value="Hifz Al-Quran Proficiency">Hifz Al-Quran Proficiency</option>
                <option value="Best Disciplined Student">Best Disciplined Student</option>
                <option value="Moral Science Topper">Moral Science Topper</option>
                <option value="General Proficiency Award">General Proficiency Award</option>
                <option value="Alumni / Passed Out Special Award">Alumni / Passed Out Special Award</option>
              </select>
            </div>
          </div>

          {/* Awards Card Grid */}
          {filteredClassAwards.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-800 text-sm">No Class Awards Found</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No class award entries match your search. Click "+ Add Class Award" to add 100% attendance, exam topper, or hifz honors.
              </p>
              <button
                onClick={() => handleOpenAwardModal()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Award</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClassAwards.map(award => (
                <div 
                  key={award.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                          {award.classStandard}
                        </span>
                        {award.date && (
                          <span className="text-[11px] text-slate-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{award.date}</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-1.5 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>{award.awardType}</span>
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedAwardForPrint(award)}
                        title="Print Award Certificate"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenAwardModal(award)}
                        title="Edit Award"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete award "${award.awardType}" for ${award.classStandard}?`)) {
                            deleteClassAward(award.id);
                          }
                        }}
                        title="Delete Award"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Winners List */}
                  <div className="space-y-2 text-xs">
                    {award.winners.map(w => {
                      const team = w.teamId ? teams.find(t => t.id === w.teamId) : null;

                      return (
                        <div 
                          key={w.place} 
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              w.place === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                              w.place === 2 ? 'bg-slate-200 text-slate-800 border border-slate-300' :
                              'bg-orange-100 text-orange-900 border border-orange-200'
                            }`}>
                              {w.place === 1 ? '🥇 1st Place' : w.place === 2 ? '🥈 2nd Place' : '🥉 3rd Place'}
                            </span>
                            <span className="font-bold text-slate-900">{w.studentName}</span>
                            {w.chestNo && (
                              <span className="font-mono text-[11px] text-slate-600">
                                #{w.chestNo}
                              </span>
                            )}
                          </div>

                          {team && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200" style={{ color: team.color }}>
                              {team.name}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: MARK ENTRY & VALUATION */}
      {activeProgram && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl p-5 space-y-4 shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                    {activeProgram.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">
                    {activeProgram.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Category: <strong>{categories.find(c => c.id === activeProgram.categoryId)?.name}</strong> • Location: <strong>{activeProgram.location}</strong>
                </p>
              </div>
              <button 
                onClick={() => setActiveProgram(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Evaluator / Judge Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-indigo-600" />
                <span>Assigned Judge / Evaluator:</span>
              </label>
              <select
                value={selectedJudgeId}
                onChange={e => setSelectedJudgeId(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800"
              >
                <option value="">-- Select Judge --</option>
                {judges.map(j => (
                  <option key={j.id} value={j.id}>{j.name} ({j.specialization || 'Judge'})</option>
                ))}
              </select>
            </div>

            {/* Contestants Scoring Table */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              <div className="text-xs font-bold text-slate-700 pb-1 flex items-center justify-between">
                <span>Contestants Valuation List:</span>
                <span className="text-[11px] text-slate-600 font-normal">
                  Grades & Ranks are auto-calculated from marks (0–100)
                </span>
              </div>

              {activeProgram.participants.length === 0 ? (
                <div className="text-center py-8 text-slate-600 text-xs">
                  No participants registered for this program yet.
                </div>
              ) : (
                activeProgram.participants.map((pt, idx) => {
                  const student = students.find(s => s.id === pt.studentId);
                  const team = teams.find(t => t.id === pt.teamId);
                  const currentData = participantMarks[pt.studentId] || {};

                  return (
                    <div
                      key={pt.studentId}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-slate-900 text-amber-300 font-extrabold flex items-center justify-center text-xs shadow-xs">
                            {currentData.codeLetter || pt.codeLetter || String.fromCharCode(65 + idx)}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-slate-600">#{pt.chestNo}</span>
                              <span className="font-bold text-xs text-slate-900">{student?.name || 'Contestant'}</span>
                            </div>
                            <div className="text-[11px] font-semibold" style={{ color: team?.color }}>
                              {team?.name}
                            </div>
                          </div>
                        </div>

                        {/* Rank Badge */}
                        <div>
                          {currentData.rank === 1 && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                              🥇 1st Place
                            </span>
                          )}
                          {currentData.rank === 2 && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-300 shadow-xs">
                              🥈 2nd Place
                            </span>
                          )}
                          {currentData.rank === 3 && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-amber-900/10 text-amber-900 border border-amber-600/30 shadow-xs">
                              🥉 3rd Place
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Marks, Grade and Manual Rank Controls */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 items-center text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">MARKS (0-100)</label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="e.g. 92"
                            value={currentData.marks !== undefined ? currentData.marks : ''}
                            onChange={e => handleMarkChange(pt.studentId, e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">AWARDED GRADE</label>
                          <select
                            value={currentData.grade || 'None'}
                            onChange={e => setParticipantMarks({
                              ...participantMarks,
                              [pt.studentId]: {
                                ...currentData,
                                grade: e.target.value as Grade
                              }
                            })}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-300 font-bold text-indigo-700 text-xs"
                          >
                            <option value="None">None</option>
                            <option value="A+">🌟 Grade A+</option>
                            <option value="A">Grade A</option>
                            <option value="B+">Grade B+</option>
                            <option value="B">Grade B</option>
                            <option value="C">Grade C</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">RANK POSITION</label>
                          <select
                            value={currentData.rank || ''}
                            onChange={e => setParticipantMarks({
                              ...participantMarks,
                              [pt.studentId]: {
                                ...currentData,
                                rank: e.target.value === '' ? null : Number(e.target.value) as 1 | 2 | 3
                              }
                            })}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-300 font-semibold text-slate-800 text-xs"
                          >
                            <option value="">No Rank</option>
                            <option value="1">1st Place</option>
                            <option value="2">2nd Place</option>
                            <option value="3">3rd Place</option>
                          </select>
                        </div>

                        <div className="col-span-3 sm:col-span-1">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">REMARKS / NOTES</label>
                          <input
                            type="text"
                            placeholder="Optional judge remarks..."
                            value={currentData.remarks || ''}
                            onChange={e => setParticipantMarks({
                              ...participantMarks,
                              [pt.studentId]: {
                                ...currentData,
                                remarks: e.target.value
                              }
                            })}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-normal"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-600">
                Saving marks marks program as <strong>Evaluated</strong> for publishing.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveProgram(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMarks}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Valuation Marks</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: JUDGES MANAGEMENT (Matching PDF page 9) */}
      {isJudgesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg p-5 space-y-4 shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Judges & Evaluators Panel
                </h3>
              </div>
              <button 
                onClick={() => setIsJudgesModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 font-semibold">Registered Judges ({judges.length})</span>
              <button
                id="register-new-judge-btn"
                onClick={() => handleOpenJudgeModal()}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Register New Judge</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {judges.map(judge => (
                <div 
                  key={judge.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{judge.name}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Phone: <strong className="text-slate-700">{judge.phone}</strong>
                    </p>
                    {judge.specialization && (
                      <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
                        Specialty: {judge.specialization}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenJudgeModal(judge)}
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete judge "${judge.name}"?`)) {
                          deleteJudge(judge.id);
                        }
                      }}
                      className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsJudgesModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REGISTER NEW JUDGE (Matching PDF page 9) */}
      {isAddJudgeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingJudge ? 'Edit Judge Details' : '+ Register New Judge'}
              </h3>
              <button 
                onClick={() => setIsAddJudgeOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJudge} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">JUDGE NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Usthad Zainul Abid Al-Qasimi"
                  value={judgeForm.name}
                  onChange={e => setJudgeForm({ ...judgeForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">MOBILE NUMBER *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98460 11223"
                  value={judgeForm.phone}
                  onChange={e => setJudgeForm({ ...judgeForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SPECIALIZATION / EVENTS</label>
                <input
                  type="text"
                  placeholder="e.g. Qiraath, Tajweed, Oratory"
                  value={judgeForm.specialization}
                  onChange={e => setJudgeForm({ ...judgeForm, specialization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NOTES (OPTIONAL)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Chief evaluator for high school events"
                  value={judgeForm.notes}
                  onChange={e => setJudgeForm({ ...judgeForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddJudgeOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-sm"
                >
                  {editingJudge ? 'Save Judge' : 'Register Judge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JUDGE PORTAL QR CODE & SHAREABLE LINK MODAL */}
      {isJudgeQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-slate-900 text-sm">Judge Portal Link & QR</h3>
                  <p className="text-[11px] text-slate-500">Share with evaluation judges</p>
                </div>
              </div>
              <button
                onClick={() => setIsJudgeQrModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code Container */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + window.location.pathname + '?judgePortal=true#judge-portal')}`}
                alt="Judge Portal QR Code"
                className="w-48 h-48 mx-auto rounded-xl shadow-xs object-contain bg-white p-2"
              />
              <p className="text-[11px] font-semibold text-slate-600 mt-2">Scan with mobile camera to open Judge Portal</p>
            </div>

            {/* Link Copy Box */}
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Direct Shareable Link (യൂണീക്ക് ലിങ്ക്)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}${window.location.pathname}?judgePortal=true#judge-portal`}
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-300 rounded-xl font-mono text-xs text-slate-800 select-all"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?judgePortal=true#judge-portal`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 3000);
                  }}
                  className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <a
                href={`${window.location.origin}${window.location.pathname}?judgePortal=true#judge-portal`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Open Judge Portal in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
