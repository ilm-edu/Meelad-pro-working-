import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  GenderViewFilter, Team, Category, Student, Program, Judge, Stage, 
  PointSettings, ParticipationLimits, ClassAward, FinanceRecord, EventInfo,
  Grade, ExportHistoryLog
} from '../types';
import { 
  INITIAL_EVENT_INFO, INITIAL_TEAMS, INITIAL_CATEGORIES, INITIAL_JUDGES, 
  INITIAL_STAGES, INITIAL_POINT_SETTINGS, INITIAL_LIMITS, INITIAL_STUDENTS, 
  INITIAL_PROGRAMS, INITIAL_CLASS_AWARDS, INITIAL_FINANCE_RECORDS 
} from '../data/initialData';

export interface TeamScore {
  team: Team;
  rankPoints: number;
  gradePoints: number;
  totalPoints: number;
  firstCount: number;
  secondCount: number;
  thirdCount: number;
  aPlusCount: number;
  aCount: number;
  publishedCount: number;
}

export interface StudentScore {
  student: Student;
  stagePoints: number;
  offStagePoints: number;
  totalPoints: number;
  firstCount: number;
  secondCount: number;
  thirdCount: number;
  aPlusCount: number;
  programDetails: {
    program: Program;
    rank?: 1 | 2 | 3 | null;
    grade?: Grade;
    points: number;
  }[];
}

export interface CategoryChampion {
  category: Category;
  champion: StudentScore | null;
}

export interface PublishRecommendation {
  program: Program;
  projectedWinnerTeam: Team | undefined;
  projectedPointsAwarded: Record<string, number>; // teamId -> points added
  balanceScore: number; // Higher score = better balance
  reason: string;
}

interface FestContextType {
  // Global Gender View
  genderFilter: GenderViewFilter;
  setGenderFilter: (filter: GenderViewFilter) => void;
  
  // Entities
  eventInfo: EventInfo;
  setEventInfo: React.Dispatch<React.SetStateAction<EventInfo>>;
  festSettings: any;
  updateFestSettings: (settings: any) => void;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  programs: Program[];
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
  judges: Judge[];
  setJudges: React.Dispatch<React.SetStateAction<Judge[]>>;
  stages: Stage[];
  setStages: React.Dispatch<React.SetStateAction<Stage[]>>;
  pointSettings: PointSettings;
  setPointSettings: React.Dispatch<React.SetStateAction<PointSettings>>;
  limits: ParticipationLimits;
  setLimits: React.Dispatch<React.SetStateAction<ParticipationLimits>>;
  classAwards: ClassAward[];
  setClassAwards: React.Dispatch<React.SetStateAction<ClassAward[]>>;
  financeRecords: FinanceRecord[];
  setFinanceRecords: React.Dispatch<React.SetStateAction<FinanceRecord[]>>;
  financeEntries: any[];
  addFinanceEntry: (entry: any) => void;
  deleteFinanceEntry: (id: string) => void;
  exportLogs: ExportHistoryLog[];
  addExportLog: (type: string, scope: string) => void;

  // Actions
  addStudent: (student: Omit<Student, 'id' | 'chestNo'> & { customChestNo?: number }) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
  assignProgramsToStudent: (studentId: string, programIds: string[]) => { success: boolean; message?: string };
  
  addProgram: (program: Omit<Program, 'id' | 'code'>) => void;
  updateProgram: (program: Program) => void;
  deleteProgram: (programId: string) => void;
  updateProgramParticipants: (programId: string, participants: Program['participants']) => void;

  addJudge: (judge: Omit<Judge, 'id'>) => void;
  updateJudge: (judge: Judge) => void;
  deleteJudge: (judgeId: string) => void;

  addStage: (stage: Omit<Stage, 'id'>) => void;
  updateStage: (stage: Stage) => void;
  deleteStage: (stageId: string) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;

  addClassAward: (award: Omit<ClassAward, 'id'>) => void;
  updateClassAward: (award: ClassAward) => void;
  deleteClassAward: (awardId: string) => void;

  addFinanceRecord: (record: Omit<FinanceRecord, 'id'>) => void;
  deleteFinanceRecord: (recordId: string) => void;

  // Publishing & Prelims
  publishProgramResult: (programId: string) => void;
  unpublishProgramResult: (programId: string) => void;
  publishAllEvaluated: () => void;
  togglePrelimQualification: (programId: string, studentId: string, isQualified: boolean, score?: number) => void;

  // Calculations
  getTeamScores: (filter?: GenderViewFilter) => TeamScore[];
  getStudentScores: (filter?: GenderViewFilter) => StudentScore[];
  getBoysScores: () => StudentScore[];
  getGirlsScores: () => StudentScore[];
  getCategoryChampions: (filter?: GenderViewFilter) => CategoryChampion[];
  getGrandChampions: () => { boysChampion: StudentScore | null; girlsChampion: StudentScore | null };
  getTopVocalScorers: (filter?: GenderViewFilter) => StudentScore[];
  getTopPenScorers: (filter?: GenderViewFilter) => StudentScore[];
  getSmartPublishRecommendations: () => PublishRecommendation[];
  resetToSampleData: () => void;
  factoryResetToDefault: () => void;
  factoryResetToFresh: () => void;
  clearAllResultsAndMarks: () => void;
  addStudentsBulk: (students: Array<Omit<Student, 'id' | 'chestNo'> & { customChestNo?: number }>) => void;
}

const FestContext = createContext<FestContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EVENT_INFO: 'melad_fest_event_info_v1',
  TEAMS: 'melad_fest_teams_v1',
  CATEGORIES: 'melad_fest_categories_v1',
  STUDENTS: 'melad_fest_students_v1',
  PROGRAMS: 'melad_fest_programs_v1',
  JUDGES: 'melad_fest_judges_v1',
  STAGES: 'melad_fest_stages_v1',
  POINT_SETTINGS: 'melad_fest_points_v1',
  LIMITS: 'melad_fest_limits_v1',
  CLASS_AWARDS: 'melad_fest_awards_v1',
  FINANCE: 'melad_fest_finance_v1',
  EXPORTS: 'melad_fest_exports_v1',
  GENDER_FILTER: 'melad_fest_gender_filter_v1'
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading localStorage for key ${key}:`, e);
    return fallback;
  }
}

export const FestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [genderFilter, setGenderFilterState] = useState<GenderViewFilter>(() => 
    loadStorage<GenderViewFilter>(STORAGE_KEYS.GENDER_FILTER, 'All')
  );

  const [eventInfo, setEventInfo] = useState<EventInfo>(() => 
    loadStorage<EventInfo>(STORAGE_KEYS.EVENT_INFO, INITIAL_EVENT_INFO)
  );

  const [teams, setTeams] = useState<Team[]>(() => 
    loadStorage<Team[]>(STORAGE_KEYS.TEAMS, INITIAL_TEAMS)
  );

  const [categories, setCategories] = useState<Category[]>(() => 
    loadStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
  );

  const [students, setStudents] = useState<Student[]>(() => 
    loadStorage<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS)
  );

  const [programs, setPrograms] = useState<Program[]>(() => 
    loadStorage<Program[]>(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS)
  );

  const [judges, setJudges] = useState<Judge[]>(() => 
    loadStorage<Judge[]>(STORAGE_KEYS.JUDGES, INITIAL_JUDGES)
  );

  const [stages, setStages] = useState<Stage[]>(() => 
    loadStorage<Stage[]>(STORAGE_KEYS.STAGES, INITIAL_STAGES)
  );

  const [pointSettings, setPointSettings] = useState<PointSettings>(() => 
    loadStorage<PointSettings>(STORAGE_KEYS.POINT_SETTINGS, INITIAL_POINT_SETTINGS)
  );

  const [limits, setLimits] = useState<ParticipationLimits>(() => 
    loadStorage<ParticipationLimits>(STORAGE_KEYS.LIMITS, INITIAL_LIMITS)
  );

  const [classAwards, setClassAwards] = useState<ClassAward[]>(() => 
    loadStorage<ClassAward[]>(STORAGE_KEYS.CLASS_AWARDS, INITIAL_CLASS_AWARDS)
  );

  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>(() => 
    loadStorage<FinanceRecord[]>(STORAGE_KEYS.FINANCE, INITIAL_FINANCE_RECORDS)
  );

  const [exportLogs, setExportLogs] = useState<ExportHistoryLog[]>(() => 
    loadStorage<ExportHistoryLog[]>(STORAGE_KEYS.EXPORTS, [
      {
        id: 'log-1',
        exportType: 'Green Room Sign-In Sheet',
        scope: 'All Categories • Stage & Offstage',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        generatedBy: 'Admin',
        status: 'Completed'
      }
    ])
  );

  // Sync to local storage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.GENDER_FILTER, JSON.stringify(genderFilter)); }, [genderFilter]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EVENT_INFO, JSON.stringify(eventInfo)); }, [eventInfo]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams)); }, [teams]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs)); }, [programs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.JUDGES, JSON.stringify(judges)); }, [judges]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STAGES, JSON.stringify(stages)); }, [stages]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.POINT_SETTINGS, JSON.stringify(pointSettings)); }, [pointSettings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.LIMITS, JSON.stringify(limits)); }, [limits]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CLASS_AWARDS, JSON.stringify(classAwards)); }, [classAwards]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(financeRecords)); }, [financeRecords]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EXPORTS, JSON.stringify(exportLogs)); }, [exportLogs]);

  const setGenderFilter = (filter: GenderViewFilter) => {
    setGenderFilterState(filter);
  };

  const addExportLog = (type: string, scope: string) => {
    const newLog: ExportHistoryLog = {
      id: `exp-${Date.now()}`,
      exportType: type,
      scope,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      generatedBy: 'Admin / Coordinator',
      status: 'Completed'
    };
    setExportLogs(prev => [newLog, ...prev]);
  };

  const resetToSampleData = () => {
    setEventInfo(INITIAL_EVENT_INFO);
    setTeams(INITIAL_TEAMS);
    setCategories(INITIAL_CATEGORIES);
    setStudents(INITIAL_STUDENTS);
    setPrograms(INITIAL_PROGRAMS);
    setJudges(INITIAL_JUDGES);
    setStages(INITIAL_STAGES);
    setPointSettings(INITIAL_POINT_SETTINGS);
    setLimits(INITIAL_LIMITS);
    setClassAwards(INITIAL_CLASS_AWARDS);
    setFinanceRecords(INITIAL_FINANCE_RECORDS);
    setGenderFilterState('All');
  };

  const factoryResetToDefault = () => {
    resetToSampleData();
  };

  const factoryResetToFresh = () => {
    setStudents([]);
    setPrograms(prev => prev.map(p => ({
      ...p,
      status: 'Pending',
      participants: [],
      publishedAt: undefined,
      prelimCompleted: false
    })));
    setClassAwards([]);
    setFinanceRecords([]);
    setExportLogs([]);
    setGenderFilterState('All');
  };

  const clearAllResultsAndMarks = () => {
    setPrograms(prev => prev.map(p => ({
      ...p,
      status: 'Pending',
      publishedAt: undefined,
      prelimCompleted: false,
      participants: p.participants.map(pt => ({
        studentId: pt.studentId,
        chestNo: pt.chestNo,
        teamId: pt.teamId,
        codeLetter: pt.codeLetter
      }))
    })));
    setClassAwards([]);
  };

  // Student Actions
  const addStudentsBulk = (studentsData: Array<Omit<Student, 'id' | 'chestNo'> & { customChestNo?: number }>) => {
    if (!studentsData.length) return;

    const highestChestByCat: Record<string, number> = {};
    categories.forEach(c => {
      const inCat = students.filter(s => s.categoryId === c.id);
      if (inCat.length > 0) {
        highestChestByCat[c.id] = Math.max(...inCat.map(s => s.chestNo));
      } else {
        highestChestByCat[c.id] = c.chestRange.start - 1;
      }
    });

    const createdList: Student[] = [];

    studentsData.forEach((sData, idx) => {
      const category = categories.find(c => c.id === sData.categoryId);
      let chestNo = sData.customChestNo;

      if (!chestNo && category) {
        const nextChest = (highestChestByCat[category.id] ?? (category.chestRange.start - 1)) + 1;
        chestNo = Math.min(nextChest, category.chestRange.end);
        highestChestByCat[category.id] = chestNo;
      }

      if (!chestNo) {
        chestNo = 1000 + students.length + idx + 1;
      }

      const newStudent: Student = {
        ...sData,
        id: `stu-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        chestNo,
        assignedProgramIds: sData.assignedProgramIds || []
      };
      createdList.push(newStudent);
    });

    setStudents(prev => [...prev, ...createdList]);

    // Update programs to include students if assigned
    const studentsWithProgs = createdList.filter(s => s.assignedProgramIds && s.assignedProgramIds.length > 0);
    if (studentsWithProgs.length > 0) {
      setPrograms(prev => prev.map(p => {
        let updatedParticipants = [...p.participants];
        studentsWithProgs.forEach(s => {
          if (s.assignedProgramIds.includes(p.id)) {
            if (!updatedParticipants.some(pt => pt.studentId === s.id)) {
              updatedParticipants.push({
                studentId: s.id,
                chestNo: s.chestNo,
                teamId: s.teamId
              });
            }
          }
        });
        return { ...p, participants: updatedParticipants };
      }));
    }
  };

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id' | 'chestNo'> & { customChestNo?: number }) => {
    const category = categories.find(c => c.id === studentData.categoryId);
    let chestNo = studentData.customChestNo;

    if (!chestNo && category) {
      // Find highest chest no in that range
      const existingInCat = students.filter(s => s.categoryId === category.id);
      if (existingInCat.length > 0) {
        const highest = Math.max(...existingInCat.map(s => s.chestNo));
        chestNo = Math.min(highest + 1, category.chestRange.end);
      } else {
        chestNo = category.chestRange.start;
      }
    }

    if (!chestNo) {
      chestNo = 1000 + students.length;
    }

    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      chestNo,
      assignedProgramIds: studentData.assignedProgramIds || []
    };

    setStudents(prev => [...prev, newStudent]);

    // Update programs to include this student if assigned
    if (newStudent.assignedProgramIds && newStudent.assignedProgramIds.length > 0) {
      setPrograms(prev => prev.map(p => {
        if (newStudent.assignedProgramIds.includes(p.id)) {
          const alreadyIn = p.participants.some(pt => pt.studentId === newStudent.id);
          if (!alreadyIn) {
            return {
              ...p,
              participants: [
                ...p.participants,
                {
                  studentId: newStudent.id,
                  chestNo: newStudent.chestNo,
                  teamId: newStudent.teamId
                }
              ]
            };
          }
        }
        return p;
      }));
    }
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    
    // Also sync chestNo & team in program participants
    setPrograms(prev => prev.map(p => ({
      ...p,
      participants: p.participants.map(pt => {
        if (pt.studentId === updatedStudent.id) {
          return {
            ...pt,
            chestNo: updatedStudent.chestNo,
            teamId: updatedStudent.teamId
          };
        }
        return pt;
      })
    })));
  };

  const deleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setPrograms(prev => prev.map(p => ({
      ...p,
      participants: p.participants.filter(pt => pt.studentId !== studentId)
    })));
  };

  // Student-wise Program Assignment
  const assignProgramsToStudent = (studentId: string, targetProgramIds: string[]): { success: boolean; message?: string } => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { success: false, message: 'Student not found' };

    // Check participation limits
    if (limits.enabled) {
      const assignedProgs = programs.filter(p => targetProgramIds.includes(p.id));
      const stageCount = assignedProgs.filter(p => p.location === 'Stage' && p.type === 'Individual').length;
      const offStageCount = assignedProgs.filter(p => p.location === 'Off Stage' && p.type === 'Individual').length;

      const rule = limits.customRules.find(r => r.categoryId === student.categoryId);
      const maxStage = rule?.individualStage ?? limits.defaultIndividualStage;
      const maxOffStage = rule?.individualOffStage ?? limits.defaultIndividualOffStage;

      if (stageCount > maxStage) {
        return { 
          success: false, 
          message: `Limit exceeded! Maximum individual stage programs allowed is ${maxStage}.` 
        };
      }
      if (offStageCount > maxOffStage) {
        return { 
          success: false, 
          message: `Limit exceeded! Maximum individual off-stage programs allowed is ${maxOffStage}.` 
        };
      }
    }

    // Update student's assignedProgramIds
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, assignedProgramIds: targetProgramIds };
      }
      return s;
    }));

    // Update programs list
    setPrograms(prev => prev.map(p => {
      const shouldBeIn = targetProgramIds.includes(p.id);
      const isAlreadyIn = p.participants.some(pt => pt.studentId === studentId);

      if (shouldBeIn && !isAlreadyIn) {
        return {
          ...p,
          participants: [
            ...p.participants,
            {
              studentId: student.id,
              chestNo: student.chestNo,
              teamId: student.teamId
            }
          ]
        };
      } else if (!shouldBeIn && isAlreadyIn) {
        return {
          ...p,
          participants: p.participants.filter(pt => pt.studentId !== studentId)
        };
      }
      return p;
    }));

    return { success: true };
  };

  // Program Actions
  const addProgram = (progData: Omit<Program, 'id' | 'code'>) => {
    const code = `#${100 + programs.length + 1}`;
    const newProg: Program = {
      ...progData,
      id: `p-${Date.now()}`,
      code,
      status: progData.status || 'Pending',
      participants: progData.participants || []
    };
    setPrograms(prev => [...prev, newProg]);
  };

  const updateProgram = (updatedProg: Program) => {
    setPrograms(prev => prev.map(p => p.id === updatedProg.id ? updatedProg : p));
  };

  const deleteProgram = (programId: string) => {
    setPrograms(prev => prev.filter(p => p.id !== programId));
    setStudents(prev => prev.map(s => ({
      ...s,
      assignedProgramIds: s.assignedProgramIds.filter(id => id !== programId)
    })));
  };

  const updateProgramParticipants = (programId: string, participants: Program['participants']) => {
    setPrograms(prev => prev.map(p => {
      if (p.id === programId) {
        // Auto calculate status if all marks are filled
        const allScored = participants.length > 0 && participants.every(pt => pt.marks !== undefined);
        const newStatus = p.status === 'Published' ? 'Published' : (allScored ? 'Evaluated' : (participants.some(pt => pt.marks !== undefined) ? 'In Progress' : 'Pending'));
        return {
          ...p,
          participants,
          status: newStatus
        };
      }
      return p;
    }));
  };

  // Judges, Stages, Categories Actions
  const addJudge = (j: Omit<Judge, 'id'>) => setJudges(prev => [...prev, { ...j, id: `judge-${Date.now()}` }]);
  const updateJudge = (j: Judge) => setJudges(prev => prev.map(item => item.id === j.id ? j : item));
  const deleteJudge = (id: string) => setJudges(prev => prev.filter(j => j.id !== id));

  const addStage = (s: Omit<Stage, 'id'>) => setStages(prev => [...prev, { ...s, id: `stage-${Date.now()}` }]);
  const updateStage = (s: Stage) => setStages(prev => prev.map(item => item.id === s.id ? s : item));
  const deleteStage = (id: string) => setStages(prev => prev.filter(s => s.id !== id));

  const addCategory = (c: Omit<Category, 'id'>) => setCategories(prev => [...prev, { ...c, id: `cat-${Date.now()}` }]);
  const updateCategory = (c: Category) => setCategories(prev => prev.map(item => item.id === c.id ? c : item));
  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));

  const addClassAward = (a: Omit<ClassAward, 'id'>) => setClassAwards(prev => [...prev, { ...a, id: `award-${Date.now()}` }]);
  const updateClassAward = (a: ClassAward) => setClassAwards(prev => prev.map(item => item.id === a.id ? a : item));
  const deleteClassAward = (id: string) => setClassAwards(prev => prev.filter(a => a.id !== id));

  const addFinanceRecord = (f: Omit<FinanceRecord, 'id'>) => setFinanceRecords(prev => [...prev, { ...f, id: `fin-${Date.now()}` }]);
  const deleteFinanceRecord = (id: string) => setFinanceRecords(prev => prev.filter(f => f.id !== id));

  // Publishing
  const publishProgramResult = (programId: string) => {
    setPrograms(prev => prev.map(p => {
      if (p.id === programId) {
        return {
          ...p,
          status: 'Published',
          publishedAt: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const unpublishProgramResult = (programId: string) => {
    setPrograms(prev => prev.map(p => {
      if (p.id === programId) {
        return {
          ...p,
          status: 'Evaluated'
        };
      }
      return p;
    }));
  };

  const publishAllEvaluated = () => {
    setPrograms(prev => prev.map(p => {
      if (p.status === 'Evaluated') {
        return {
          ...p,
          status: 'Published',
          publishedAt: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const togglePrelimQualification = (programId: string, studentId: string, isQualified: boolean, score?: number) => {
    setPrograms(prev => prev.map(p => {
      if (p.id === programId) {
        const updatedParticipants = p.participants.map(pt => {
          if (pt.studentId === studentId) {
            return {
              ...pt,
              isPrelimQualified: isQualified,
              prelimScore: score !== undefined ? score : pt.prelimScore
            };
          }
          return pt;
        });
        return {
          ...p,
          participants: updatedParticipants
        };
      }
      return p;
    }));
  };

  // Helper point calculation for rank & grade
  const getRankPoints = (rank?: 1 | 2 | 3 | null, isGroup?: boolean, isGeneral?: boolean) => {
    if (!rank) return 0;
    if (isGroup) {
      if (rank === 1) return pointSettings.groupFirstPlace;
      if (rank === 2) return pointSettings.groupSecondPlace;
      if (rank === 3) return pointSettings.groupThirdPlace;
    } else if (isGeneral) {
      if (rank === 1) return pointSettings.generalFirstPlace;
      if (rank === 2) return pointSettings.generalSecondPlace;
      if (rank === 3) return pointSettings.generalThirdPlace;
    } else {
      if (rank === 1) return pointSettings.firstPlace;
      if (rank === 2) return pointSettings.secondPlace;
      if (rank === 3) return pointSettings.thirdPlace;
    }
    return 0;
  };

  const getGradePoints = (grade?: Grade) => {
    if (!grade || grade === 'None') return 0;
    switch (grade) {
      case 'A+': return pointSettings.gradeAPlus;
      case 'A': return pointSettings.gradeA;
      case 'B+': return pointSettings.gradeBPlus;
      case 'B': return pointSettings.gradeB;
      case 'C': return pointSettings.gradeC;
      case 'D': return pointSettings.gradeD;
      default: return 0;
    }
  };

  // Points by Team
  const getTeamScores = (customFilter?: GenderViewFilter): TeamScore[] => {
    const filter = customFilter || genderFilter;
    
    // Filter published programs according to gender filter
    const publishedPrograms = programs.filter(p => {
      if (p.status !== 'Published') return false;
      if (filter === 'All') return true;
      return p.gender === filter;
    });

    const scoreMap: Record<string, TeamScore> = {};

    teams.forEach(team => {
      scoreMap[team.id] = {
        team,
        rankPoints: 0,
        gradePoints: 0,
        totalPoints: 0,
        firstCount: 0,
        secondCount: 0,
        thirdCount: 0,
        aPlusCount: 0,
        aCount: 0,
        publishedCount: 0
      };
    });

    publishedPrograms.forEach(prog => {
      const isGroup = prog.type === 'Group';
      const isGeneral = Boolean(prog.isGeneralOpen);
      prog.participants.forEach(pt => {
        const teamScore = scoreMap[pt.teamId];
        if (!teamScore) return;

        if (pt.rank === 1) {
          teamScore.firstCount++;
          teamScore.rankPoints += getRankPoints(1, isGroup, isGeneral);
        } else if (pt.rank === 2) {
          teamScore.secondCount++;
          teamScore.rankPoints += getRankPoints(2, isGroup, isGeneral);
        } else if (pt.rank === 3) {
          teamScore.thirdCount++;
          teamScore.rankPoints += getRankPoints(3, isGroup, isGeneral);
        }

        if (pt.grade === 'A+') {
          teamScore.aPlusCount++;
          teamScore.gradePoints += getGradePoints('A+');
        } else if (pt.grade === 'A') {
          teamScore.aCount++;
          teamScore.gradePoints += getGradePoints('A');
        } else if (pt.grade) {
          teamScore.gradePoints += getGradePoints(pt.grade);
        }
      });
    });

    return Object.values(scoreMap).map(ts => ({
      ...ts,
      totalPoints: ts.rankPoints + ts.gradePoints
    })).sort((a, b) => b.totalPoints - a.totalPoints);
  };

  // Student scores calculation
  const getStudentScores = (customFilter?: GenderViewFilter): StudentScore[] => {
    const filter = customFilter || genderFilter;
    
    const publishedPrograms = programs.filter(p => p.status === 'Published');
    
    const studentMap: Record<string, StudentScore> = {};

    students.forEach(student => {
      if (filter !== 'All' && student.gender !== filter) return;

      studentMap[student.id] = {
        student,
        stagePoints: 0,
        offStagePoints: 0,
        totalPoints: 0,
        firstCount: 0,
        secondCount: 0,
        thirdCount: 0,
        aPlusCount: 0,
        programDetails: []
      };
    });

    publishedPrograms.forEach(prog => {
      prog.participants.forEach(pt => {
        const entry = studentMap[pt.studentId];
        if (!entry) return;

        const isGroup = prog.type === 'Group';
        const isGeneral = Boolean(prog.isGeneralOpen);
        const rPoints = getRankPoints(pt.rank, isGroup, isGeneral);
        const gPoints = getGradePoints(pt.grade);
        const total = rPoints + gPoints;

        if (pt.rank === 1) entry.firstCount++;
        if (pt.rank === 2) entry.secondCount++;
        if (pt.rank === 3) entry.thirdCount++;
        if (pt.grade === 'A+') entry.aPlusCount++;

        if (prog.location === 'Stage') {
          entry.stagePoints += total;
        } else {
          entry.offStagePoints += total;
        }

        entry.totalPoints += total;
        entry.programDetails.push({
          program: prog,
          rank: pt.rank,
          grade: pt.grade,
          points: total
        });
      });
    });

    return Object.values(studentMap).sort((a, b) => b.totalPoints - a.totalPoints);
  };

  // Distinct Boys and Girls scores (Never mixed!)
  const getBoysScores = (): StudentScore[] => {
    return getStudentScores('Male');
  };

  const getGirlsScores = (): StudentScore[] => {
    return getStudentScores('Female');
  };

  // Grand Individual Champions (Kala Prathibha & Kala Thilakam)
  const getGrandChampions = (): { boysChampion: StudentScore | null; girlsChampion: StudentScore | null } => {
    const boys = getBoysScores();
    const girls = getGirlsScores();
    return {
      boysChampion: boys.length > 0 && boys[0].totalPoints > 0 ? boys[0] : (boys[0] || null),
      girlsChampion: girls.length > 0 && girls[0].totalPoints > 0 ? girls[0] : (girls[0] || null)
    };
  };

  // Category-wise Champions
  const getCategoryChampions = (filter?: GenderViewFilter): CategoryChampion[] => {
    const allScores = getStudentScores('All');
    const targetCats = categories.filter(c => {
      if (!filter || filter === 'All') return true;
      return c.gender === filter;
    });

    return targetCats.map(cat => {
      const catScores = allScores.filter(sc => sc.student.categoryId === cat.id);
      const champion = catScores.length > 0 ? catScores[0] : null;
      return {
        category: cat,
        champion
      };
    });
  };

  // Vocal of the Fest (Stage events topper)
  const getTopVocalScorers = (customFilter?: GenderViewFilter): StudentScore[] => {
    return getStudentScores(customFilter).sort((a, b) => b.stagePoints - a.stagePoints);
  };

  // Pen of the Fest (Off-stage events topper)
  const getTopPenScorers = (customFilter?: GenderViewFilter): StudentScore[] => {
    return getStudentScores(customFilter).sort((a, b) => b.offStagePoints - a.offStagePoints);
  };

  // Smart Balanced Result Publishing Manager algorithm
  const getSmartPublishRecommendations = (): PublishRecommendation[] => {
    // Find all evaluated but unannounced programs
    const evaluatedPrograms = programs.filter(p => p.status === 'Evaluated');
    if (evaluatedPrograms.length === 0) return [];

    const currentScores = getTeamScores('All');
    const leaderTeam = currentScores[0];
    const secondTeam = currentScores[1];
    const thirdTeam = currentScores[2];

    return evaluatedPrograms.map(prog => {
      const pointsAwarded: Record<string, number> = {};
      teams.forEach(t => { pointsAwarded[t.id] = 0; });

      const isGroup = prog.type === 'Group';
      const isGeneral = Boolean(prog.isGeneralOpen);
      let winnerTeamId: string | undefined;
      let highestRank = 99;

      prog.participants.forEach(pt => {
        const rPoints = getRankPoints(pt.rank, isGroup, isGeneral);
        const gPoints = getGradePoints(pt.grade);
        const sum = rPoints + gPoints;
        if (pt.teamId) {
          pointsAwarded[pt.teamId] = (pointsAwarded[pt.teamId] || 0) + sum;
        }
        if (pt.rank && pt.rank < highestRank) {
          highestRank = pt.rank;
          winnerTeamId = pt.teamId;
        }
      });

      const projectedWinnerTeam = teams.find(t => t.id === winnerTeamId);

      // Balancing heuristic:
      // If trailing team gets points, it boosts suspense/balance score!
      // If leading team gets points, balance score is lower if gap is already wide.
      let balanceScore = 50;
      let reason = 'Balanced contribution across all teams.';

      if (leaderTeam && secondTeam && winnerTeamId) {
        const currentGap = leaderTeam.totalPoints - secondTeam.totalPoints;
        
        if (winnerTeamId === thirdTeam?.team.id) {
          balanceScore = 95;
          reason = `🌟 High Suspense: Elevates trailing team (${thirdTeam.team.name}) to tighten the bottom table!`;
        } else if (winnerTeamId === secondTeam.team.id) {
          balanceScore = 90;
          reason = `🔥 Close Contender: Helps 2nd Place (${secondTeam.team.name}) close the ${currentGap} pt gap with leader!`;
        } else if (winnerTeamId === leaderTeam.team.id) {
          if (currentGap <= 5) {
            balanceScore = 70;
            reason = `⚡ Leader Push: Tight race (only ${currentGap} pt lead), strengthens leader momentum.`;
          } else {
            balanceScore = 40;
            reason = `⚠️ High Gap: Leader (${leaderTeam.team.name}) is already ahead by ${currentGap} pts. Publishing may widen gap.`;
          }
        }
      }

      return {
        program: prog,
        projectedWinnerTeam,
        projectedPointsAwarded: pointsAwarded,
        balanceScore,
        reason
      };
    }).sort((a, b) => b.balanceScore - a.balanceScore);
  };

  return (
    <FestContext.Provider value={{
      genderFilter,
      setGenderFilter,
      eventInfo,
      setEventInfo,
      festSettings: {
        ...eventInfo,
        festName: eventInfo.eventName,
        madrassaName: eventInfo.madrasaName,
        academicYear: '2025-2026',
        rankPoints: { 1: pointSettings.firstPlace, 2: pointSettings.secondPlace, 3: pointSettings.thirdPlace },
        groupRankPoints: { 1: pointSettings.groupFirstPlace, 2: pointSettings.groupSecondPlace, 3: pointSettings.groupThirdPlace },
        generalRankPoints: { 1: pointSettings.generalFirstPlace, 2: pointSettings.generalSecondPlace, 3: pointSettings.generalThirdPlace },
        gradePoints: { 
          'A+': pointSettings.gradeAPlus, 
          'A': pointSettings.gradeA, 
          'B+': pointSettings.gradeBPlus, 
          'B': pointSettings.gradeB, 
          'C': pointSettings.gradeC,
          'D': pointSettings.gradeD 
        }
      },
      updateFestSettings: (settings: any) => {
        if (settings.festName) setEventInfo(prev => ({ ...prev, eventName: settings.festName, madrasaName: settings.madrassaName || prev.madrasaName, venue: settings.venue || prev.venue }));
        if (settings.rankPoints) {
          setPointSettings(prev => ({
            ...prev,
            firstPlace: settings.rankPoints[1] ?? prev.firstPlace,
            secondPlace: settings.rankPoints[2] ?? prev.secondPlace,
            thirdPlace: settings.rankPoints[3] ?? prev.thirdPlace,
            groupFirstPlace: settings.groupRankPoints?.[1] ?? prev.groupFirstPlace,
            groupSecondPlace: settings.groupRankPoints?.[2] ?? prev.groupSecondPlace,
            groupThirdPlace: settings.groupRankPoints?.[3] ?? prev.groupThirdPlace,
            generalFirstPlace: settings.generalRankPoints?.[1] ?? prev.generalFirstPlace,
            generalSecondPlace: settings.generalRankPoints?.[2] ?? prev.generalSecondPlace,
            generalThirdPlace: settings.generalRankPoints?.[3] ?? prev.generalThirdPlace,
            gradeAPlus: settings.gradePoints?.['A+'] ?? prev.gradeAPlus,
            gradeA: settings.gradePoints?.['A'] ?? prev.gradeA,
            gradeBPlus: settings.gradePoints?.['B+'] ?? prev.gradeBPlus,
            gradeB: settings.gradePoints?.['B'] ?? prev.gradeB,
            gradeC: settings.gradePoints?.['C'] ?? prev.gradeC,
            gradeD: settings.gradePoints?.['D'] ?? prev.gradeD,
          }));
        }
      },
      teams,
      setTeams,
      categories,
      setCategories,
      students,
      setStudents,
      programs,
      setPrograms,
      judges,
      setJudges,
      stages,
      setStages,
      pointSettings,
      setPointSettings,
      limits,
      setLimits,
      classAwards,
      setClassAwards,
      financeRecords,
      setFinanceRecords,
      financeEntries: financeRecords.map(r => ({ ...r, title: r.description })),
      addFinanceEntry: (entry: any) => {
        addFinanceRecord({
          type: entry.type,
          category: entry.category,
          amount: entry.amount,
          description: entry.title || entry.description,
          date: entry.date,
          recordedBy: entry.recordedBy || 'Coordinator'
        });
      },
      deleteFinanceEntry: (id: string) => {
        deleteFinanceRecord(id);
      },
      exportLogs,
      addExportLog,
      addStudent,
      updateStudent,
      deleteStudent,
      assignProgramsToStudent,
      addProgram,
      updateProgram,
      deleteProgram,
      updateProgramParticipants,
      addJudge,
      updateJudge,
      deleteJudge,
      addStage,
      updateStage,
      deleteStage,
      addCategory,
      updateCategory,
      deleteCategory,
      addClassAward,
      updateClassAward,
      deleteClassAward,
      addFinanceRecord,
      deleteFinanceRecord,
      publishProgramResult,
      unpublishProgramResult,
      publishAllEvaluated,
      togglePrelimQualification,
      getTeamScores,
      getStudentScores,
      getBoysScores,
      getGirlsScores,
      getCategoryChampions,
      getGrandChampions,
      getTopVocalScorers,
      getTopPenScorers,
      getSmartPublishRecommendations,
      resetToSampleData,
      factoryResetToDefault,
      factoryResetToFresh,
      clearAllResultsAndMarks,
      addStudentsBulk
    }}>
      {children}
    </FestContext.Provider>
  );
};

export const useFest = () => {
  const context = useContext(FestContext);
  if (!context) {
    throw new Error('useFest must be used within a FestProvider');
  }
  return context;
};
