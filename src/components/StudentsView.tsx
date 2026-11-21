import React, { useState, useMemo, useEffect } from 'react';
import { useFest } from '../context/FestContext';
import { 
  Users, Plus, Search, Filter, Edit2, Trash2, 
  BookOpen, CheckSquare, Square, X, AlertCircle, 
  Download, Upload, Check, ChevronRight, Sparkles,
  Layers, UserPlus, ListPlus, FileSpreadsheet, CheckCircle2
} from 'lucide-react';
import { Student } from '../types';

export const StudentsView: React.FC = () => {
  const { 
    students, addStudent, addStudentsBulk, updateStudent, deleteStudent, 
    categories, teams, programs, assignProgramsToStudent, 
    limits, genderFilter, setGenderFilter 
  } = useFest();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>(genderFilter === 'All' ? 'All' : genderFilter);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkTab, setBulkTab] = useState<'usthad' | 'teamLeader' | 'csv'>('usthad');
  const [bulkSuccessCount, setBulkSuccessCount] = useState<number | null>(null);

  // Class Usthad Bulk Form State
  const [usthadClass, setUsthadClass] = useState<number>(1);
  const [usthadGender, setUsthadGender] = useState<'Male' | 'Female'>('Male');
  const [usthadCategory, setUsthadCategory] = useState<string>('');
  const [usthadTeamAllocation, setUsthadTeamAllocation] = useState<'same' | 'roundRobin'>('same');
  const [usthadDefaultTeam, setUsthadDefaultTeam] = useState<string>('');
  const [usthadNamesText, setUsthadNamesText] = useState<string>('');

  // Team Leader Bulk Form State
  const [tlTeam, setTlTeam] = useState<string>('');
  const [tlGender, setTlGender] = useState<'Male' | 'Female'>('Male');
  const [tlCategory, setTlCategory] = useState<string>('');
  const [tlClass, setTlClass] = useState<number>(1);
  const [tlNamesText, setTlNamesText] = useState<string>('');

  // CSV Import State
  const [csvText, setCsvText] = useState<string>('');

  // Editing Single Student
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentForm, setStudentForm] = useState({
    name: '',
    gender: 'Male' as 'Male' | 'Female',
    categoryId: categories[0]?.id || '',
    classNumber: 1,
    teamId: teams[0]?.id || '',
    phone: '',
    parentName: '',
    customChestNo: ''
  });

  // Auto-set Category when Usthad changes class or gender
  useEffect(() => {
    const matched = categories.find(c => c.gender === usthadGender && c.classes.includes(Number(usthadClass)));
    if (matched) {
      setUsthadCategory(matched.id);
    } else {
      const fallback = categories.find(c => c.gender === usthadGender);
      if (fallback) setUsthadCategory(fallback.id);
    }
  }, [usthadClass, usthadGender, categories]);

  // Auto-set Category for Team Leader
  useEffect(() => {
    const matched = categories.find(c => c.gender === tlGender && c.classes.includes(Number(tlClass)));
    if (matched) {
      setTlCategory(matched.id);
    } else {
      const fallback = categories.find(c => c.gender === tlGender);
      if (fallback) setTlCategory(fallback.id);
    }
  }, [tlClass, tlGender, categories]);

  // Set default teams if empty
  useEffect(() => {
    if (teams.length > 0) {
      if (!usthadDefaultTeam) setUsthadDefaultTeam(teams[0].id);
      if (!tlTeam) setTlTeam(teams[0].id);
    }
  }, [teams, usthadDefaultTeam, tlTeam]);

  // Student-wise Program Assignment Modal
  const [assignmentStudent, setAssignmentStudent] = useState<Student | null>(null);
  const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([]);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState(false);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search
      const matchSearch = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.chestNo.toString().includes(searchQuery);
      if (!matchSearch) return false;

      // Category
      if (selectedCategory !== 'All' && student.categoryId !== selectedCategory) return false;

      // Class
      if (selectedClass !== 'All' && student.classNumber.toString() !== selectedClass) return false;

      // Team
      if (selectedTeam !== 'All' && student.teamId !== selectedTeam) return false;

      // Gender
      if (selectedGender !== 'All' && student.gender !== selectedGender) return false;

      return true;
    });
  }, [students, searchQuery, selectedCategory, selectedClass, selectedTeam, selectedGender]);

  // Open Add/Edit Student
  const handleOpenAddModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setStudentForm({
        name: student.name,
        gender: student.gender,
        categoryId: student.categoryId,
        classNumber: student.classNumber,
        teamId: student.teamId,
        phone: student.phone || '',
        parentName: student.parentName || '',
        customChestNo: student.chestNo.toString()
      });
    } else {
      setEditingStudent(null);
      setStudentForm({
        name: '',
        gender: 'Male',
        categoryId: categories[0]?.id || '',
        classNumber: 1,
        teamId: teams[0]?.id || '',
        phone: '',
        parentName: '',
        customChestNo: ''
      });
    }
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name.trim()) return;

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        name: studentForm.name,
        gender: studentForm.gender,
        categoryId: studentForm.categoryId,
        classNumber: Number(studentForm.classNumber) || 1,
        teamId: studentForm.teamId,
        phone: studentForm.phone,
        parentName: studentForm.parentName,
        chestNo: studentForm.customChestNo ? Number(studentForm.customChestNo) : editingStudent.chestNo
      });
    } else {
      addStudent({
        name: studentForm.name,
        gender: studentForm.gender,
        categoryId: studentForm.categoryId,
        classNumber: Number(studentForm.classNumber) || 1,
        teamId: studentForm.teamId,
        phone: studentForm.phone,
        parentName: studentForm.parentName,
        assignedProgramIds: [],
        customChestNo: studentForm.customChestNo ? Number(studentForm.customChestNo) : undefined
      });
    }
    setIsAddModalOpen(false);
  };

  // Open Student-wise Program Assignment Modal
  const handleOpenAssignment = (student: Student) => {
    setAssignmentStudent(student);
    setSelectedProgramIds(student.assignedProgramIds || []);
    setAssignError(null);
    setAssignSuccess(false);
  };

  const handleToggleProgramSelect = (progId: string) => {
    setAssignError(null);
    setSelectedProgramIds(prev => 
      prev.includes(progId) ? prev.filter(id => id !== progId) : [...prev, progId]
    );
  };

  const handleSaveAssignment = () => {
    if (!assignmentStudent) return;
    const res = assignProgramsToStudent(assignmentStudent.id, selectedProgramIds);
    if (!res.success) {
      setAssignError(res.message || 'Failed to assign programs due to rules limits');
    } else {
      setAssignSuccess(true);
      setTimeout(() => {
        setAssignmentStudent(null);
      }, 800);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Chest No', 'Name', 'Gender', 'Category', 'Class', 'Team', 'Assigned Programs Count'];
    const rows = filteredStudents.map(s => {
      const cat = categories.find(c => c.id === s.categoryId)?.name || '';
      const team = teams.find(t => t.id === s.teamId)?.name || '';
      return [s.chestNo, `"${s.name}"`, s.gender, `"${cat}"`, s.classNumber, `"${team}"`, s.assignedProgramIds.length];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `melad_students_directory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Available programs for current assignment student
  const availableProgramsForStudent = useMemo(() => {
    if (!assignmentStudent) return [];
    return programs.filter(p => {
      const matchGender = p.gender === 'General' || p.gender === assignmentStudent.gender;
      const matchCat = p.categoryId === assignmentStudent.categoryId || p.type === 'General';
      return matchGender && matchCat;
    });
  }, [assignmentStudent, programs]);

  // Limits calculation for current student modal
  const studentLimits = useMemo(() => {
    if (!assignmentStudent) return null;
    const rule = limits.customRules.find(r => r.categoryId === assignmentStudent.categoryId);
    const maxStage = rule?.individualStage ?? limits.defaultIndividualStage;
    const maxOffStage = rule?.individualOffStage ?? limits.defaultIndividualOffStage;
    
    const selectedProgs = programs.filter(p => selectedProgramIds.includes(p.id));
    const currentStage = selectedProgs.filter(p => p.location === 'Stage' && p.type === 'Individual').length;
    const currentOffStage = selectedProgs.filter(p => p.location === 'Off Stage' && p.type === 'Individual').length;

    return { maxStage, maxOffStage, currentStage, currentOffStage };
  }, [assignmentStudent, selectedProgramIds, limits, programs]);

  // Parsed Usthad Students (Class-wise)
  const parsedUsthadList = useMemo(() => {
    if (!usthadNamesText.trim()) return [];
    const lines = usthadNamesText.split('\n').map(l => l.trim()).filter(Boolean);
    
    return lines.map((line, idx) => {
      const parts = line.split(/[,;\t]/).map(p => p.trim());
      const name = parts[0] || '';
      const parentName = parts[1] || '';
      const phone = parts[2] || '';

      let assignedTeamId = usthadDefaultTeam || (teams[0]?.id ?? '');
      if (usthadTeamAllocation === 'roundRobin' && teams.length > 0) {
        assignedTeamId = teams[idx % teams.length].id;
      }

      return {
        name,
        parentName,
        phone,
        classNumber: Number(usthadClass) || 1,
        gender: usthadGender,
        categoryId: usthadCategory || (categories[0]?.id ?? ''),
        teamId: assignedTeamId,
        assignedProgramIds: []
      };
    });
  }, [usthadNamesText, usthadClass, usthadGender, usthadCategory, usthadTeamAllocation, usthadDefaultTeam, teams, categories]);

  // Parsed Team Leader Students (Team-wise)
  const parsedTlList = useMemo(() => {
    if (!tlNamesText.trim()) return [];
    const lines = tlNamesText.split('\n').map(l => l.trim()).filter(Boolean);

    return lines.map((line) => {
      const parts = line.split(/[,;\t]/).map(p => p.trim());
      const name = parts[0] || '';
      const customClass = parts[1] ? Number(parts[1]) : Number(tlClass) || 1;
      const parentName = parts[2] || '';

      return {
        name,
        parentName,
        phone: '',
        classNumber: customClass,
        gender: tlGender,
        categoryId: tlCategory || (categories[0]?.id ?? ''),
        teamId: tlTeam || (teams[0]?.id ?? ''),
        assignedProgramIds: []
      };
    });
  }, [tlNamesText, tlClass, tlGender, tlCategory, tlTeam, categories, teams]);

  // Parsed CSV Students
  const parsedCsvList = useMemo(() => {
    if (!csvText.trim()) return [];
    const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
    const result: any[] = [];

    lines.forEach((line, idx) => {
      if (idx === 0 && (line.toLowerCase().includes('name') || line.toLowerCase().includes('chest'))) {
        return;
      }
      const cols = line.split(/[,;\t]/).map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length >= 1 && cols[0]) {
        const name = cols[0];
        const gender: 'Male' | 'Female' = (cols[1]?.toLowerCase().startsWith('f') || cols[1]?.toLowerCase() === 'girl') ? 'Female' : 'Male';
        const classNum = Number(cols[2]) || 1;
        
        const matchedCat = categories.find(c => c.name.toLowerCase() === cols[3]?.toLowerCase() || (c.gender === gender && c.classes.includes(classNum)));
        const categoryId = matchedCat?.id || categories[0]?.id || '';

        const matchedTeam = teams.find(t => t.name.toLowerCase() === cols[4]?.toLowerCase() || t.code.toLowerCase() === cols[4]?.toLowerCase());
        const teamId = matchedTeam?.id || teams[0]?.id || '';

        result.push({
          name,
          gender,
          classNumber: classNum,
          categoryId,
          teamId,
          customChestNo: cols[5] ? Number(cols[5]) : undefined,
          assignedProgramIds: []
        });
      }
    });

    return result;
  }, [csvText, categories, teams]);

  const handleSaveBulk = () => {
    let listToSave: any[] = [];
    if (bulkTab === 'usthad') listToSave = parsedUsthadList;
    else if (bulkTab === 'teamLeader') listToSave = parsedTlList;
    else if (bulkTab === 'csv') listToSave = parsedCsvList;

    if (listToSave.length === 0) return;

    addStudentsBulk(listToSave);
    setBulkSuccessCount(listToSave.length);
    setIsBulkModalOpen(false);
    setUsthadNamesText('');
    setTlNamesText('');
    setCsvText('');

    setTimeout(() => {
      setBulkSuccessCount(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Controls (Matching PDF page 6) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Directory</h2>
            <p className="text-xs text-slate-600">
              Manage student profiles, chest numbers, and single/batch program assignments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {bulkSuccessCount !== null && (
              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Added {bulkSuccessCount} students!</span>
              </span>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              title="Export Students as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              id="bulk-student-btn"
              onClick={() => setIsBulkModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
              title="Bulk Student Registration (ക്ലാസ് ഉസ്താദ് / ടീം ലീഡർ ബൾക്ക് എൻട്രി)"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>⚡ Bulk Entry (ബൾക്ക് എൻട്രി)</span>
            </button>

            <button
              id="add-student-btn"
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Student</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or chest..."
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

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
          >
            <option value="All">All Classes</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
              <option key={num} value={num.toString()}>Class {num}</option>
            ))}
          </select>

          {/* Team Filter */}
          <select
            value={selectedTeam}
            onChange={e => setSelectedTeam(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
          >
            <option value="All">All Teams</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={selectedGender}
            onChange={e => setSelectedGender(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
          >
            <option value="All">All Genders</option>
            <option value="Male">👦 Boys Only</option>
            <option value="Female">👧 Girls Only</option>
          </select>
        </div>
      </div>

      {/* Student Table (Matching PDF page 6) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>Showing <strong>{filteredStudents.length}</strong> of {students.length} students</span>
          <span className="text-[11px] text-indigo-600 font-semibold">
            ✨ Click "Assign / View Programs" to assign events student-wise
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
                <th className="py-3 px-3 w-12 text-center">SL NO.</th>
                <th className="py-3 px-3">CHEST NO.</th>
                <th className="py-3 px-4">STUDENT NAME</th>
                <th className="py-3 px-3">GENDER</th>
                <th className="py-3 px-3">CATEGORY</th>
                <th className="py-3 px-3 text-center">CLASS</th>
                <th className="py-3 px-3">TEAM</th>
                <th className="py-3 px-3 text-center">PROGRAMS</th>
                <th className="py-3 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-600">
                    No students matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const category = categories.find(c => c.id === student.categoryId);
                  const team = teams.find(t => t.id === student.teamId);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          #{student.chestNo}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {student.name}
                        {student.parentName && (
                          <div className="text-[10px] text-slate-600 font-normal">
                            S/D/O {student.parentName}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          student.gender === 'Male'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {student.gender}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium truncate max-w-[140px]">
                        {category?.name || '—'}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        Class {student.classNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-2.5 h-2.5 rounded-full shrink-0" 
                            style={{ backgroundColor: team?.color || '#94a3b8' }} 
                          />
                          <span className="font-semibold text-slate-800">
                            {team?.name || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleOpenAssignment(student)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 font-semibold text-[11px] flex items-center justify-center gap-1 mx-auto transition-colors"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>View Programs ({student.assignedProgramIds.length})</span>
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenAddModal(student)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Student"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete student "${student.name}"?`)) {
                                deleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Student"
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

      {/* MODAL 1: STUDENT-WISE PROGRAM ASSIGNMENT (Crucial User Requirement) */}
      {assignmentStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl p-5 space-y-4 shadow-xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    #{assignmentStudent.chestNo}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">
                    {assignmentStudent.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Category: <strong>{categories.find(c => c.id === assignmentStudent.categoryId)?.name}</strong> • Team: <strong>{teams.find(t => t.id === assignmentStudent.teamId)?.name}</strong>
                </p>
              </div>
              <button 
                onClick={() => setAssignmentStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Participation Limits Indicator */}
            {limits.enabled && studentLimits && (
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-around text-xs">
                <div className="text-center">
                  <div className="text-[11px] text-slate-600 font-medium">Individual Stage</div>
                  <div className={`font-bold ${
                    studentLimits.currentStage > studentLimits.maxStage ? 'text-rose-600' : 'text-indigo-700'
                  }`}>
                    {studentLimits.currentStage} / {studentLimits.maxStage} Max
                  </div>
                </div>
                <div className="w-px h-8 bg-indigo-200" />
                <div className="text-center">
                  <div className="text-[11px] text-slate-600 font-medium">Individual Off-Stage</div>
                  <div className={`font-bold ${
                    studentLimits.currentOffStage > studentLimits.maxOffStage ? 'text-rose-600' : 'text-indigo-700'
                  }`}>
                    {studentLimits.currentOffStage} / {studentLimits.maxOffStage} Max
                  </div>
                </div>
                <div className="w-px h-8 bg-indigo-200" />
                <div className="text-center">
                  <div className="text-[11px] text-slate-600 font-medium">Total Assigned</div>
                  <div className="font-bold text-slate-800">
                    {selectedProgramIds.length} Programs
                  </div>
                </div>
              </div>
            )}

            {/* Error / Success Feedback */}
            {assignError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{assignError}</span>
              </div>
            )}

            {assignSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 shrink-0" />
                <span>Programs successfully assigned to student!</span>
              </div>
            )}

            {/* Programs List with Checkboxes */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              <div className="text-xs font-bold text-slate-700 pb-1">
                Select Events for this student:
              </div>

              {availableProgramsForStudent.length === 0 ? (
                <div className="text-center py-8 text-slate-600 text-xs">
                  No programs found matching this student's category and gender.
                </div>
              ) : (
                availableProgramsForStudent.map(program => {
                  const isChecked = selectedProgramIds.includes(program.id);

                  return (
                    <div
                      key={program.id}
                      onClick={() => handleToggleProgramSelect(program.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked 
                          ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 shadow-xs' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-indigo-600">
                          {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-slate-600">{program.code}</span>
                            <span className="font-bold text-xs">{program.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-0.5">
                            <span>{program.location}</span>
                            <span>•</span>
                            <span>{program.type}</span>
                            {program.hasPrelimRound && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                                Prelim Round
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        program.location === 'Stage' ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {program.location}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedProgramIds([])}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Clear Selections
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAssignmentStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAssignment}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Assignments</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT STUDENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingStudent ? 'Edit Student Profile' : 'Register New Student'}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">STUDENT FULL NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MUHAMMED ESHAN V"
                  value={studentForm.name}
                  onChange={e => setStudentForm({ ...studentForm, name: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium tracking-wide"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GENDER *</label>
                  <select
                    value={studentForm.gender}
                    onChange={e => setStudentForm({ ...studentForm, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Male">👦 Male (Boy)</option>
                    <option value="Female">👧 Female (Girl)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CLASS / STANDARD *</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={studentForm.classNumber}
                    onChange={e => setStudentForm({ ...studentForm, classNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CATEGORY *</label>
                  <select
                    value={studentForm.categoryId}
                    onChange={e => setStudentForm({ ...studentForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">TEAM / HOUSE *</label>
                  <select
                    value={studentForm.teamId}
                    onChange={e => setStudentForm({ ...studentForm, teamId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PARENT / GUARDIAN NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Veeran Kutty"
                    value={studentForm.parentName}
                    onChange={e => setStudentForm({ ...studentForm, parentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CUSTOM CHEST NO (OPTIONAL)</label>
                  <input
                    type="number"
                    placeholder="Leave empty for auto"
                    value={studentForm.customChestNo}
                    onChange={e => setStudentForm({ ...studentForm, customChestNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
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
                  {editingStudent ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK STUDENT ENTRY MODAL (FOR CLASS USTHAD & TEAM LEADER) */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 my-auto max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Bulk Student Registration (ബൾക്ക് രജിസ്ട്രേഷൻ)
                  </h3>
                  <p className="text-xs text-slate-600">
                    ക്ലാസ് ഉസ്താദുമാർക്കും ടീം ലീഡർമാർക്കും വിദ്യാർത്ഥികളുടെ പേരുകൾ ഒന്നിച്ചെഴുതാൻ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl flex-shrink-0">
              <button
                type="button"
                onClick={() => setBulkTab('usthad')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  bulkTab === 'usthad'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>👨‍🏫 Class Usthad (ക്ലാസ് തിരിച്ച്)</span>
              </button>

              <button
                type="button"
                onClick={() => setBulkTab('teamLeader')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  bulkTab === 'teamLeader'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ListPlus className="w-3.5 h-3.5" />
                <span>🚩 Team Leader (ടീം തിരിച്ച്)</span>
              </button>

              <button
                type="button"
                onClick={() => setBulkTab('csv')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  bulkTab === 'csv'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>📄 CSV / Excel Copy</span>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
              {/* TAB 1: CLASS USTHAD */}
              {bulkTab === 'usthad' && (
                <div className="space-y-4">
                  <div className="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <p className="text-indigo-900 leading-relaxed">
                      ക്ലാസ് ഉസ്താദുമാർക്ക് ക്ലാസും ആൺകുട്ടികൾ/പെൺകുട്ടികളും സെലക്ട് ചെയ്ത ശേഷം രജിസ്റ്ററിലെ അല്ലെങ്കിൽ വാട്സ്ആപ്പിലെ പേരുകൾ താഴെ ഒന്നിച്ച് പേസ്റ്റ് ചെയ്ത് സെക്കന്റുകൾ കൊണ്ട് രജിസ്റ്റർ ചെയ്യാം.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SELECT CLASS *</label>
                      <select
                        value={usthadClass}
                        onChange={e => setUsthadClass(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                          <option key={num} value={num}>Class {num} (ക്ലാസ് {num})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">GENDER *</label>
                      <select
                        value={usthadGender}
                        onChange={e => setUsthadGender(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Male">👦 Boys (ആൺകുട്ടികൾ)</option>
                        <option value="Female">👧 Girls (പെൺകുട്ടികൾ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">CATEGORY *</label>
                      <select
                        value={usthadCategory}
                        onChange={e => setUsthadCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      >
                        {categories.filter(c => c.gender === usthadGender).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">TEAM ALLOCATION MODE</label>
                      <select
                        value={usthadTeamAllocation}
                        onChange={e => setUsthadTeamAllocation(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
                      >
                        <option value="same">All in One Team (ഒരു ടീമിലേക്ക്)</option>
                        <option value="roundRobin">Auto-Distribute / Round Robin (ടീമുകൾ തുല്യമായി വീതിക്കാൻ)</option>
                      </select>
                    </div>

                    {usthadTeamAllocation === 'same' && (
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">DEFAULT TEAM *</label>
                        <select
                          value={usthadDefaultTeam}
                          onChange={e => setUsthadDefaultTeam(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
                        >
                          {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-bold text-slate-800">
                        PASTE / TYPE STUDENT NAMES (One name per line) *
                      </label>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Optional: Name, Parent Name, Phone
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      placeholder={`Muhammed Nihal\nAhmad Faris, Veeran Kutty\nBilal K, Moideen, 9876543210\nSalman Faris\nZayan Ali`}
                      value={usthadNamesText}
                      onChange={e => setUsthadNamesText(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: TEAM LEADER */}
              {bulkTab === 'teamLeader' && (
                <div className="space-y-4">
                  <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-900 leading-relaxed">
                      ടീം ലീഡർമാർക്ക് അവരുടെ സ്വന്തം ടീമിലേക്ക് ഓരോ കാറ്റഗറിയിലെയും വിദ്യാർത്ഥികളുടെ പേരുകൾ അതിവേഗം ഒന്നിച്ച് രജിസ്റ്റർ ചെയ്യാം.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SELECT YOUR TEAM *</label>
                      <select
                        value={tlTeam}
                        onChange={e => setTlTeam(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      >
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">GENDER *</label>
                      <select
                        value={tlGender}
                        onChange={e => setTlGender(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Male">👦 Boys (ആൺകുട്ടികൾ)</option>
                        <option value="Female">👧 Girls (പെൺകുട്ടികൾ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">CATEGORY *</label>
                      <select
                        value={tlCategory}
                        onChange={e => setTlCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      >
                        {categories.filter(c => c.gender === tlGender).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">DEFAULT CLASS</label>
                      <select
                        value={tlClass}
                        onChange={e => setTlClass(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                          <option key={num} value={num}>Class {num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-bold text-slate-800">
                        STUDENT NAMES (One per line) *
                      </label>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Format: Name OR Name, Class, Parent
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      placeholder={`Afnan K\nShamil Rahman, 4, Musthafa\nNabeel\nSafwan`}
                      value={tlNamesText}
                      onChange={e => setTlNamesText(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: CSV / EXCEL */}
              {bulkTab === 'csv' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <p className="text-slate-700 font-medium leading-relaxed">
                      നിങ്ങളുടെ എക്സൽ (Excel) അല്ലെങ്കിൽ ഗൂഗിൾ ഷീറ്റ്സിൽ നിന്നുള്ള കോളം കോപ്പി ചെയ്ത് ഇവിടെ പേസ്റ്റ് ചെയ്യാം.
                    </p>
                    <div className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded-xl border border-slate-200 mt-2">
                      Format: Name, Gender, Class, Category, Team, ChestNo (Optional)
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">PASTE CSV / TAB-SEPARATED ROWS</label>
                    <textarea
                      rows={6}
                      placeholder={`Muhammed Nihal, Male, 3, Junior, Badr, 105\nAmina, Female, 4, Junior, Uhud, 502`}
                      value={csvText}
                      onChange={e => setCsvText(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* LIVE PARSED PREVIEW TABLE */}
              {((bulkTab === 'usthad' && parsedUsthadList.length > 0) ||
                (bulkTab === 'teamLeader' && parsedTlList.length > 0) ||
                (bulkTab === 'csv' && parsedCsvList.length > 0)) && (
                <div className="mt-4 bg-slate-50 rounded-2xl border border-slate-200 p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Live Preview</span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md text-[10px] font-extrabold">
                        {bulkTab === 'usthad' && parsedUsthadList.length}
                        {bulkTab === 'teamLeader' && parsedTlList.length}
                        {bulkTab === 'csv' && parsedCsvList.length} students found
                      </span>
                    </h4>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      ✓ Ready for 1-click batch import
                    </span>
                  </div>

                  <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl bg-white">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-slate-700 sticky top-0 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3 w-8">#</th>
                          <th className="py-2 px-3">NAME</th>
                          <th className="py-2 px-2">CLASS</th>
                          <th className="py-2 px-2">GENDER</th>
                          <th className="py-2 px-3">CATEGORY</th>
                          <th className="py-2 px-3">TEAM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(bulkTab === 'usthad' ? parsedUsthadList : (bulkTab === 'teamLeader' ? parsedTlList : parsedCsvList)).map((item, idx) => {
                          const catName = categories.find(c => c.id === item.categoryId)?.name || 'General';
                          const teamName = teams.find(t => t.id === item.teamId)?.name || 'Unassigned';

                          return (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2 px-3 text-slate-500 font-medium">{idx + 1}</td>
                              <td className="py-2 px-3 font-bold text-slate-900">{item.name}</td>
                              <td className="py-2 px-2">Class {item.classNumber}</td>
                              <td className="py-2 px-2">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  item.gender === 'Male' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                                }`}>
                                  {item.gender === 'Male' ? 'Boys' : 'Girls'}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-slate-600">{catName}</td>
                              <td className="py-2 px-3 font-semibold text-indigo-700">{teamName}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 text-xs"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveBulk}
                disabled={
                  (bulkTab === 'usthad' && parsedUsthadList.length === 0) ||
                  (bulkTab === 'teamLeader' && parsedTlList.length === 0) ||
                  (bulkTab === 'csv' && parsedCsvList.length === 0)
                }
                className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-all ${
                  ((bulkTab === 'usthad' && parsedUsthadList.length > 0) ||
                   (bulkTab === 'teamLeader' && parsedTlList.length > 0) ||
                   (bulkTab === 'csv' && parsedCsvList.length > 0))
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  ⚡ Add All {bulkTab === 'usthad' ? parsedUsthadList.length : (bulkTab === 'teamLeader' ? parsedTlList.length : parsedCsvList.length)} Students
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
