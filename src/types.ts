export type Gender = 'Male' | 'Female';
export type GenderViewFilter = 'All' | 'Male' | 'Female';
export type ProgramLocation = 'Stage' | 'Off Stage' | 'Sports';
export type ProgramType = 'Individual' | 'Group';
export type ProgramStatus = 'Pending' | 'In Progress' | 'Evaluated' | 'Published';
export type Grade = 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'None';

export interface Category {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Mix';
  classes: number[]; // e.g. [1], [2], [3, 4], [5, 6], [7, 8], [9, 10, 11, 12]
  chestRange: {
    start: number;
    end: number;
  };
}

export interface Team {
  id: string;
  name: string;
  code: string;
  color: string;
  bgGradient: string;
  description?: string;
  leaderName?: string;
  leaderPhone?: string;
}

export interface Student {
  id: string;
  chestNo: number;
  name: string;
  gender: 'Male' | 'Female';
  categoryId: string;
  classNumber: number;
  teamId: string;
  phone?: string;
  parentName?: string;
  assignedProgramIds: string[];
}

export interface ProgramParticipant {
  studentId: string;
  chestNo: number;
  teamId: string;
  codeLetter?: string; // Secret code for judges e.g. A, B, C, D
  isPrelimQualified?: boolean; // For programs with screening/prelim round
  prelimScore?: number;
  marks?: number; // Main/Final marks (0-100)
  grade?: Grade;
  rank?: 1 | 2 | 3 | null;
  judgesScores?: Record<string, number>; // judgeId -> score
  remarks?: string;
}

export interface Program {
  id: string;
  code: string; // e.g. #101, #102
  name: string; // English & Malayalam e.g. "ഖുർആൻ പാരായണം (Quran Recitation)"
  malayalamName?: string;
  categoryId: string;
  isGeneralOpen?: boolean; // When true, students of any category can participate
  gender: 'Male' | 'Female' | 'Mix';
  location: ProgramLocation;
  type: ProgramType;
  status: ProgramStatus;
  hasPrelimRound?: boolean; // When true, supports pre-fest screening/shortlisting
  prelimCompleted?: boolean;
  maxParticipantsPerTeam: number;
  durationMinutes: number;
  stageId?: string;
  scheduledTime?: string;
  participants: ProgramParticipant[];
  judgesAssigned: string[];
  publishedAt?: string;
}

export interface Judge {
  id: string;
  name: string;
  phone: string;
  specialization?: string;
  notes?: string;
}

export interface Stage {
  id: string;
  name: string;
  type?: 'On Stage' | 'Off Stage';
  locationDetails?: string;
  description?: string;
  location?: string;
  currentProgramId?: string;
}

export interface PointSettings {
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
  groupFirstPlace: number;
  groupSecondPlace: number;
  groupThirdPlace: number;
  generalFirstPlace: number;
  generalSecondPlace: number;
  generalThirdPlace: number;
  gradeAPlus: number;
  gradeA: number;
  gradeBPlus: number;
  gradeB: number;
  gradeC: number;
  gradeD: number;
  groupMultiplier: number;
}

export interface ParticipationLimits {
  enabled: boolean;
  defaultIndividualStage: number;
  defaultIndividualOffStage: number;
  defaultSports: number;
  defaultGeneral: number;
  defaultGroup: number;
  customRules: {
    id: string;
    categoryId?: string;
    gender?: 'Male' | 'Female';
    individualStage: number;
    individualOffStage: number;
    sports: number;
    general: number;
    group: number;
  }[];
}

export interface ClassAward {
  id: string;
  awardType: string; // e.g. 'Attendance', 'Examination', 'Hifz Proficiency', 'Discipline'
  classStandard: string;
  winners: {
    place: 1 | 2 | 3;
    studentName: string;
    chestNo?: number;
    teamId?: string;
  }[];
  date: string;
}

export interface FinanceRecord {
  id: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  recordedBy: string;
}

export interface EventInfo {
  eventName: string;
  madrasaName: string;
  tagline: string;
  eventDescription: string;
  location: string;
  venue: string;
  startDate: string;
  endDate: string;
  organizerName: string;
  contactNumber: string;
  logoUrl?: string;
}

export interface ExportHistoryLog {
  id: string;
  exportType: string;
  scope: string;
  createdAt: string;
  generatedBy: string;
  status: 'Completed' | 'Pending';
}

export type FestSettings = EventInfo & {
  festName?: string;
  madrassaName?: string;
  academicYear?: string;
  venue?: string;
  rankPoints?: Record<number, number>;
  groupRankPoints?: Record<number, number>;
  generalRankPoints?: Record<number, number>;
  gradePoints?: Record<string, number>;
};
export type FinanceEntry = FinanceRecord & {
  title?: string;
  notes?: string;
};
