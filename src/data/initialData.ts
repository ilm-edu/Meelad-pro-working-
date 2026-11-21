import { Category, Team, Student, Program, Judge, Stage, PointSettings, ParticipationLimits, ClassAward, FinanceRecord, EventInfo } from '../types';

export const INITIAL_EVENT_INFO: EventInfo = {
  eventName: "MEELAD GRAND FEST 2026",
  madrasaName: "P.M. CHEROOR KOTTA MADRASA",
  tagline: "Inspiring Excellence Through Moral Education & Talents",
  eventDescription: "Annual Islamic Arts & Cultural Fest featuring competitive stage and off-stage events for Boys and Girls divisions.",
  location: "Cheroor Kotta Campus Ground",
  venue: "Main Stage Complex & Auditorium",
  startDate: "2026-08-25",
  endDate: "2026-08-27",
  organizerName: "Fest Coordination Committee",
  contactNumber: "+91 98470 12345",
  logoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80"
};

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-a',
    name: 'Team A (Emeralds)',
    code: 'T-A',
    color: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-600',
    description: 'Green House Pioneers',
    leaderName: 'Zainul Abid',
    leaderPhone: '+91 94001 22334'
  },
  {
    id: 'team-b',
    name: 'Team B (Sapphires)',
    code: 'T-B',
    color: '#06b6d4',
    bgGradient: 'from-cyan-500 to-blue-600',
    description: 'Blue Ocean Champions',
    leaderName: 'Salman Faris',
    leaderPhone: '+91 94002 33445'
  },
  {
    id: 'team-c',
    name: 'Team C (Amethysts)',
    code: 'T-C',
    color: '#8b5cf6',
    bgGradient: 'from-purple-500 to-indigo-600',
    description: 'Purple Knights',
    leaderName: 'Afrin Siddiq',
    leaderPhone: '+91 94003 44556'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'kiddies-1-boys',
    name: 'Kiddies 1 (Boys)',
    gender: 'Male',
    classes: [1],
    chestRange: { start: 1000, end: 1049 }
  },
  {
    id: 'kiddies-1-girls',
    name: 'Kiddies 1 (Girls)',
    gender: 'Female',
    classes: [1],
    chestRange: { start: 1050, end: 1099 }
  },
  {
    id: 'kiddies-2-boys',
    name: 'Kiddies 2 (Boys)',
    gender: 'Male',
    classes: [2],
    chestRange: { start: 1100, end: 1149 }
  },
  {
    id: 'kiddies-2-girls',
    name: 'Kiddies 2 (Girls)',
    gender: 'Female',
    classes: [2],
    chestRange: { start: 1150, end: 1199 }
  },
  {
    id: 'sub-junior-boys',
    name: 'Sub Junior (Boys)',
    gender: 'Male',
    classes: [3, 4],
    chestRange: { start: 1200, end: 1249 }
  },
  {
    id: 'sub-junior-girls',
    name: 'Sub Junior (Girls)',
    gender: 'Female',
    classes: [3, 4],
    chestRange: { start: 1250, end: 1299 }
  },
  {
    id: 'junior-boys',
    name: 'Junior (Boys)',
    gender: 'Male',
    classes: [5, 6],
    chestRange: { start: 1300, end: 1349 }
  },
  {
    id: 'junior-girls',
    name: 'Junior (Girls)',
    gender: 'Female',
    classes: [5, 6, 7],
    chestRange: { start: 1350, end: 1399 }
  },
  {
    id: 'senior-boys',
    name: 'Senior (Boys)',
    gender: 'Male',
    classes: [7, 8],
    chestRange: { start: 1400, end: 1449 }
  },
  {
    id: 'senior-girls',
    name: 'Senior (Girls)',
    gender: 'Female',
    classes: [8, 9, 10, 11, 12],
    chestRange: { start: 1450, end: 1499 }
  },
  {
    id: 'super-senior-boys',
    name: 'Super Senior (Boys)',
    gender: 'Male',
    classes: [9, 10, 11, 12],
    chestRange: { start: 1500, end: 1549 }
  }
];

export const INITIAL_JUDGES: Judge[] = [
  {
    id: 'judge-1',
    name: 'Usthad Zainul Abid Al-Qasimi',
    phone: '+91 98460 11223',
    specialization: 'Qiraath & Tajweed, Arabic Oratory',
    notes: 'Chief Evaluator for Quran & Arabic events'
  },
  {
    id: 'judge-2',
    name: 'Mujeeb Rahman Master',
    phone: '+91 98460 22334',
    specialization: 'Mappilappattu, Madh Song, Music rhythm',
    notes: 'Cultural music critic & songwriter'
  },
  {
    id: 'judge-3',
    name: 'Prof. Shihabudheen Faizy',
    phone: '+91 98460 33445',
    specialization: 'Elocution & Extempore Speech, Debate',
    notes: 'State Level Arts Judge'
  },
  {
    id: 'judge-4',
    name: 'Aysha Teacher',
    phone: '+91 98460 44556',
    specialization: 'Calligraphy, Story Telling, Girls Division',
    notes: 'Art curator and educator'
  }
];

export const INITIAL_STAGES: Stage[] = [
  {
    id: 'stage-1',
    name: 'Main Stage (Imam Bukhari Stage)',
    type: 'On Stage',
    locationDetails: 'Central Auditorium Ground'
  },
  {
    id: 'stage-2',
    name: 'Stage 2 (Imam Shafi Stage)',
    type: 'On Stage',
    locationDetails: 'East Campus Hall'
  },
  {
    id: 'stage-3',
    name: 'Girls Stage (Sayyidath Fathima Stage)',
    type: 'On Stage',
    locationDetails: 'Indoor Girls Auditorium'
  },
  {
    id: 'stage-off-a',
    name: 'Off Stage Hall A (Art & Writing)',
    type: 'Off Stage',
    locationDetails: 'Block B Ground Floor'
  },
  {
    id: 'stage-off-b',
    name: 'Off Stage Hall B (Games & Memory)',
    type: 'Off Stage',
    locationDetails: 'Block C 1st Floor'
  }
];

export const INITIAL_POINT_SETTINGS: PointSettings = {
  firstPlace: 10,
  secondPlace: 8,
  thirdPlace: 6,
  groupFirstPlace: 15,
  groupSecondPlace: 12,
  groupThirdPlace: 10,
  generalFirstPlace: 10,
  generalSecondPlace: 8,
  generalThirdPlace: 6,
  gradeAPlus: 5,
  gradeA: 4,
  gradeBPlus: 3,
  gradeB: 2,
  gradeC: 1,
  gradeD: 0,
  groupMultiplier: 1.5
};

export const INITIAL_LIMITS: ParticipationLimits = {
  enabled: true,
  defaultIndividualStage: 3,
  defaultIndividualOffStage: 3,
  defaultSports: 2,
  defaultGeneral: 2,
  defaultGroup: 2,
  customRules: [
    {
      id: 'rule-kiddies',
      categoryId: 'kiddies-1-boys',
      individualStage: 2,
      individualOffStage: 2,
      sports: 1,
      general: 1,
      group: 1
    }
  ]
};

export const INITIAL_STUDENTS: Student[] = [
  // Kiddies 1 Boys (1000 - 1005)
  {
    id: 'stu-1000',
    chestNo: 1000,
    name: 'MUHAMMED ESHAN V',
    gender: 'Male',
    categoryId: 'kiddies-1-boys',
    classNumber: 1,
    teamId: 'team-a',
    phone: '+91 99461 00001',
    parentName: 'Veeran Kutty',
    assignedProgramIds: ['p-101', 'p-102', 'p-103']
  },
  {
    id: 'stu-1001',
    chestNo: 1001,
    name: 'MUHAMMED M',
    gender: 'Male',
    categoryId: 'kiddies-1-boys',
    classNumber: 1,
    teamId: 'team-a',
    phone: '+91 99461 00002',
    parentName: 'Musthafa',
    assignedProgramIds: ['p-101', 'p-104']
  },
  {
    id: 'stu-1002',
    chestNo: 1002,
    name: 'MUHAMMED ADAM',
    gender: 'Male',
    categoryId: 'kiddies-1-boys',
    classNumber: 1,
    teamId: 'team-a',
    phone: '+91 99461 00003',
    parentName: 'Adam Bava',
    assignedProgramIds: ['p-102', 'p-103', 'p-104']
  },
  {
    id: 'stu-1006',
    chestNo: 1006,
    name: 'FAIZ AMEEN VK',
    gender: 'Male',
    categoryId: 'kiddies-1-boys',
    classNumber: 1,
    teamId: 'team-b',
    phone: '+91 99461 00004',
    parentName: 'Ameen',
    assignedProgramIds: ['p-101', 'p-102', 'p-103']
  },
  {
    id: 'stu-1007',
    chestNo: 1007,
    name: 'AYAN HYZIN KK',
    gender: 'Male',
    categoryId: 'kiddies-1-boys',
    classNumber: 1,
    teamId: 'team-b',
    phone: '+91 99461 00005',
    parentName: 'Hameed',
    assignedProgramIds: ['p-101', 'p-104']
  },
  {
    id: 'stu-1012',
    chestNo: 1012,
    name: 'MUHAMMAD AZLIN MM',
    gender: 'Male',
    categoryId: 'kiddies-1-boys',
    classNumber: 1,
    teamId: 'team-c',
    phone: '+91 99461 00006',
    parentName: 'Mansoor',
    assignedProgramIds: ['p-101', 'p-103']
  },
  {
    id: 'stu-1013',
    chestNo: 1013,
    name: 'HAIZAM MUHAMMED NM',
    gender: 'Male',
    categoryId: 'kiddies-1-boys',
    classNumber: 1,
    teamId: 'team-c',
    phone: '+91 99461 00007',
    parentName: 'Niyas',
    assignedProgramIds: ['p-102', 'p-104']
  },

  // Kiddies 1 Girls (1050 - 1056)
  {
    id: 'stu-1050',
    chestNo: 1050,
    name: 'HAWWA AYRIN',
    gender: 'Female',
    categoryId: 'kiddies-1-girls',
    classNumber: 1,
    teamId: 'team-a',
    phone: '+91 99461 00010',
    parentName: 'Ashraf',
    assignedProgramIds: ['p-150', 'p-151', 'p-152']
  },
  {
    id: 'stu-1051',
    chestNo: 1051,
    name: 'HAMDA SM',
    gender: 'Female',
    categoryId: 'kiddies-1-girls',
    classNumber: 1,
    teamId: 'team-a',
    phone: '+91 99461 00011',
    parentName: 'Shamsudheen',
    assignedProgramIds: ['p-150', 'p-151']
  },
  {
    id: 'stu-1054',
    chestNo: 1054,
    name: 'AYISHA KK',
    gender: 'Female',
    categoryId: 'kiddies-1-girls',
    classNumber: 1,
    teamId: 'team-b',
    phone: '+91 99461 00012',
    parentName: 'Kabeer',
    assignedProgramIds: ['p-150', 'p-152']
  },
  {
    id: 'stu-1055',
    chestNo: 1055,
    name: 'HAMIDHA UV',
    gender: 'Female',
    categoryId: 'kiddies-1-girls',
    classNumber: 1,
    teamId: 'team-b',
    phone: '+91 99461 00013',
    parentName: 'Usman',
    assignedProgramIds: ['p-151', 'p-152']
  },
  {
    id: 'stu-1058',
    chestNo: 1058,
    name: 'ANZA MEHARI KP',
    gender: 'Female',
    categoryId: 'kiddies-1-girls',
    classNumber: 1,
    teamId: 'team-c',
    phone: '+91 99461 00014',
    parentName: 'Pareed',
    assignedProgramIds: ['p-150', 'p-151', 'p-152']
  },

  // Sub Junior Boys (1200 - 1205)
  {
    id: 'stu-1200',
    chestNo: 1200,
    name: 'ADNAN BILAL',
    gender: 'Male',
    categoryId: 'sub-junior-boys',
    classNumber: 3,
    teamId: 'team-a',
    phone: '+91 99461 00020',
    parentName: 'Bilal',
    assignedProgramIds: ['p-110', 'p-111', 'p-114']
  },
  {
    id: 'stu-1206',
    chestNo: 1206,
    name: 'RAYAN SHAHID',
    gender: 'Male',
    categoryId: 'sub-junior-boys',
    classNumber: 4,
    teamId: 'team-b',
    phone: '+91 99461 00021',
    parentName: 'Shahid',
    assignedProgramIds: ['p-110', 'p-112', 'p-114']
  },
  {
    id: 'stu-1212',
    chestNo: 1212,
    name: 'DANISH ABDULLA',
    gender: 'Male',
    categoryId: 'sub-junior-boys',
    classNumber: 4,
    teamId: 'team-c',
    phone: '+91 99461 00022',
    parentName: 'Abdulla',
    assignedProgramIds: ['p-111', 'p-112', 'p-114']
  },

  // Junior Boys (1300 - 1305)
  {
    id: 'stu-1300',
    chestNo: 1300,
    name: 'SHANID THOUFEEQ',
    gender: 'Male',
    categoryId: 'junior-boys',
    classNumber: 5,
    teamId: 'team-a',
    phone: '+91 99461 00030',
    parentName: 'Thoufeeq',
    assignedProgramIds: ['p-120', 'p-122', 'p-124']
  },
  {
    id: 'stu-1306',
    chestNo: 1306,
    name: 'MUBASHIR ALI',
    gender: 'Male',
    categoryId: 'junior-boys',
    classNumber: 6,
    teamId: 'team-b',
    phone: '+91 99461 00031',
    parentName: 'Ali Akbar',
    assignedProgramIds: ['p-120', 'p-123', 'p-124']
  },
  {
    id: 'stu-1312',
    chestNo: 1312,
    name: 'FAHEEM JALAL',
    gender: 'Male',
    categoryId: 'junior-boys',
    classNumber: 6,
    teamId: 'team-c',
    phone: '+91 99461 00032',
    parentName: 'Jalaludheen',
    assignedProgramIds: ['p-122', 'p-123', 'p-124']
  },

  // Senior Girls (1450 - 1455)
  {
    id: 'stu-1450',
    chestNo: 1450,
    name: 'FATHIMA RINSHA',
    gender: 'Female',
    categoryId: 'senior-girls',
    classNumber: 9,
    teamId: 'team-a',
    phone: '+91 99461 00040',
    parentName: 'Rasheed',
    assignedProgramIds: ['p-160', 'p-161', 'p-165']
  },
  {
    id: 'stu-1455',
    chestNo: 1455,
    name: 'HIBA MARIYAM',
    gender: 'Female',
    categoryId: 'senior-girls',
    classNumber: 10,
    teamId: 'team-b',
    phone: '+91 99461 00041',
    parentName: 'Moideen',
    assignedProgramIds: ['p-160', 'p-162', 'p-165']
  },
  {
    id: 'stu-1460',
    chestNo: 1460,
    name: 'NAFEESA LIYANA',
    gender: 'Female',
    categoryId: 'senior-girls',
    classNumber: 10,
    teamId: 'team-c',
    phone: '+91 99461 00042',
    parentName: 'Liyakath Ali',
    assignedProgramIds: ['p-161', 'p-162', 'p-165']
  }
];

export const INITIAL_PROGRAMS: Program[] = [
  // Kiddies 1 Boys
  {
    id: 'p-101',
    code: '#101',
    name: 'ബലൂൺ പൊട്ടിക്കൽ (Balloon Burst)',
    malayalamName: 'ബലൂൺ പൊട്ടിക്കൽ',
    categoryId: 'kiddies-1-boys',
    gender: 'Male',
    location: 'Off Stage',
    type: 'Individual',
    status: 'Published',
    hasPrelimRound: false,
    maxParticipantsPerTeam: 2,
    durationMinutes: 15,
    stageId: 'stage-off-b',
    scheduledTime: 'Day 1 - 09:30 AM',
    judgesAssigned: ['judge-4'],
    publishedAt: '2026-08-25T11:00:00Z',
    participants: [
      { studentId: 'stu-1000', chestNo: 1000, teamId: 'team-a', codeLetter: 'A', marks: 92, grade: 'A+', rank: 1 },
      { studentId: 'stu-1006', chestNo: 1006, teamId: 'team-b', codeLetter: 'B', marks: 86, grade: 'A', rank: 2 },
      { studentId: 'stu-1012', chestNo: 1012, teamId: 'team-c', codeLetter: 'C', marks: 78, grade: 'B+', rank: 3 }
    ]
  },
  {
    id: 'p-102',
    code: '#102',
    name: 'കളറിംഗ് (Coloring)',
    malayalamName: 'കളറിംഗ്',
    categoryId: 'kiddies-1-boys',
    gender: 'Male',
    location: 'Off Stage',
    type: 'Individual',
    status: 'Evaluated', // Evaluated ready for Smart Publishing!
    hasPrelimRound: false,
    maxParticipantsPerTeam: 2,
    durationMinutes: 30,
    stageId: 'stage-off-a',
    scheduledTime: 'Day 1 - 10:30 AM',
    judgesAssigned: ['judge-4'],
    participants: [
      { studentId: 'stu-1006', chestNo: 1006, teamId: 'team-b', codeLetter: 'K', marks: 95, grade: 'A+', rank: 1 },
      { studentId: 'stu-1013', chestNo: 1013, teamId: 'team-c', codeLetter: 'L', marks: 88, grade: 'A', rank: 2 },
      { studentId: 'stu-1002', chestNo: 1002, teamId: 'team-a', codeLetter: 'M', marks: 82, grade: 'B+', rank: 3 }
    ]
  },
  {
    id: 'p-103',
    code: '#103',
    name: 'ഗാനം (Song / Madhu Song)',
    malayalamName: 'ഗാനം',
    categoryId: 'kiddies-1-boys',
    gender: 'Male',
    location: 'Stage',
    type: 'Individual',
    status: 'In Progress',
    hasPrelimRound: true, // Has preliminary round shortlisting!
    prelimCompleted: true,
    maxParticipantsPerTeam: 2,
    durationMinutes: 20,
    stageId: 'stage-1',
    scheduledTime: 'Day 1 - 02:00 PM',
    judgesAssigned: ['judge-2'],
    participants: [
      { studentId: 'stu-1000', chestNo: 1000, teamId: 'team-a', codeLetter: 'X', isPrelimQualified: true, prelimScore: 88, marks: 90, grade: 'A+', rank: 2 },
      { studentId: 'stu-1006', chestNo: 1006, teamId: 'team-b', codeLetter: 'Y', isPrelimQualified: true, prelimScore: 94, marks: 96, grade: 'A+', rank: 1 },
      { studentId: 'stu-1012', chestNo: 1012, teamId: 'team-c', codeLetter: 'Z', isPrelimQualified: true, prelimScore: 82, marks: 84, grade: 'A', rank: 3 }
    ]
  },
  {
    id: 'p-104',
    code: '#104',
    name: 'കഥാ കഥനം (Story Telling)',
    malayalamName: 'കഥാ കഥനം (മുസാബഖ)',
    categoryId: 'kiddies-1-boys',
    gender: 'Male',
    location: 'Stage',
    type: 'Individual',
    status: 'Pending',
    hasPrelimRound: false,
    maxParticipantsPerTeam: 2,
    durationMinutes: 25,
    stageId: 'stage-1',
    scheduledTime: 'Day 1 - 03:30 PM',
    judgesAssigned: ['judge-3'],
    participants: [
      { studentId: 'stu-1001', chestNo: 1001, teamId: 'team-a', codeLetter: 'P' },
      { studentId: 'stu-1007', chestNo: 1007, teamId: 'team-b', codeLetter: 'Q' },
      { studentId: 'stu-1013', chestNo: 1013, teamId: 'team-c', codeLetter: 'R' }
    ]
  },

  // Kiddies 1 Girls
  {
    id: 'p-150',
    code: '#150',
    name: 'കളറിംഗ് (Coloring - Girls)',
    malayalamName: 'കളറിംഗ്',
    categoryId: 'kiddies-1-girls',
    gender: 'Female',
    location: 'Off Stage',
    type: 'Individual',
    status: 'Published',
    hasPrelimRound: false,
    maxParticipantsPerTeam: 2,
    durationMinutes: 30,
    stageId: 'stage-off-a',
    scheduledTime: 'Day 1 - 09:30 AM',
    judgesAssigned: ['judge-4'],
    publishedAt: '2026-08-25T11:30:00Z',
    participants: [
      { studentId: 'stu-1050', chestNo: 1050, teamId: 'team-a', codeLetter: 'G1', marks: 94, grade: 'A+', rank: 1 },
      { studentId: 'stu-1058', chestNo: 1058, teamId: 'team-c', codeLetter: 'G2', marks: 89, grade: 'A', rank: 2 },
      { studentId: 'stu-1054', chestNo: 1054, teamId: 'team-b', codeLetter: 'G3', marks: 83, grade: 'B+', rank: 3 }
    ]
  },
  {
    id: 'p-151',
    code: '#151',
    name: 'മദ്ഹുനബി ഗാനം (Girls Madhu Song)',
    malayalamName: 'മദ്ഹുനബി ഗാനം',
    categoryId: 'kiddies-1-girls',
    gender: 'Female',
    location: 'Stage',
    type: 'Individual',
    status: 'Evaluated',
    hasPrelimRound: true,
    prelimCompleted: true,
    maxParticipantsPerTeam: 2,
    durationMinutes: 20,
    stageId: 'stage-3',
    scheduledTime: 'Day 1 - 11:00 AM',
    judgesAssigned: ['judge-4'],
    participants: [
      { studentId: 'stu-1058', chestNo: 1058, teamId: 'team-c', codeLetter: 'F1', isPrelimQualified: true, marks: 96, grade: 'A+', rank: 1 },
      { studentId: 'stu-1051', chestNo: 1051, teamId: 'team-a', codeLetter: 'F2', isPrelimQualified: true, marks: 90, grade: 'A+', rank: 2 },
      { studentId: 'stu-1055', chestNo: 1055, teamId: 'team-b', codeLetter: 'F3', isPrelimQualified: true, marks: 84, grade: 'A', rank: 3 }
    ]
  },
  {
    id: 'p-152',
    code: '#152',
    name: 'കഥ പറച്ചിൽ (Story Narration - Girls)',
    malayalamName: 'കഥ പറച്ചിൽ',
    categoryId: 'kiddies-1-girls',
    gender: 'Female',
    location: 'Stage',
    type: 'Individual',
    status: 'Pending',
    hasPrelimRound: false,
    maxParticipantsPerTeam: 2,
    durationMinutes: 20,
    stageId: 'stage-3',
    scheduledTime: 'Day 1 - 02:30 PM',
    judgesAssigned: ['judge-4'],
    participants: [
      { studentId: 'stu-1050', chestNo: 1050, teamId: 'team-a' },
      { studentId: 'stu-1054', chestNo: 1054, teamId: 'team-b' },
      { studentId: 'stu-1058', chestNo: 1058, teamId: 'team-c' }
    ]
  },

  // Sub Junior Boys
  {
    id: 'p-110',
    code: '#110',
    name: 'ലെമൺ സ്പൂൺ (Lemon & Spoon Race)',
    malayalamName: 'ലെമൺ സ്പൂൺ',
    categoryId: 'sub-junior-boys',
    gender: 'Male',
    location: 'Off Stage',
    type: 'Individual',
    status: 'Published',
    hasPrelimRound: false,
    maxParticipantsPerTeam: 2,
    durationMinutes: 20,
    stageId: 'stage-off-b',
    scheduledTime: 'Day 1 - 10:00 AM',
    judgesAssigned: ['judge-3'],
    publishedAt: '2026-08-25T12:00:00Z',
    participants: [
      { studentId: 'stu-1206', chestNo: 1206, teamId: 'team-b', codeLetter: 'LS1', marks: 95, grade: 'A+', rank: 1 },
      { studentId: 'stu-1200', chestNo: 1200, teamId: 'team-a', codeLetter: 'LS2', marks: 88, grade: 'A', rank: 2 },
      { studentId: 'stu-1212', chestNo: 1212, teamId: 'team-c', codeLetter: 'LS3', marks: 80, grade: 'B+', rank: 3 }
    ]
  },
  {
    id: 'p-114',
    code: '#114',
    name: 'ഖിറാഅത്ത് (Quran Recitation Sub Junior)',
    malayalamName: 'ഖിറാഅത്ത് (മുസാബഖ)',
    categoryId: 'sub-junior-boys',
    gender: 'Male',
    location: 'Stage',
    type: 'Individual',
    status: 'Evaluated',
    hasPrelimRound: true,
    prelimCompleted: true,
    maxParticipantsPerTeam: 2,
    durationMinutes: 25,
    stageId: 'stage-1',
    scheduledTime: 'Day 2 - 09:30 AM',
    judgesAssigned: ['judge-1'],
    participants: [
      { studentId: 'stu-1212', chestNo: 1212, teamId: 'team-c', codeLetter: 'Q1', isPrelimQualified: true, marks: 98, grade: 'A+', rank: 1 },
      { studentId: 'stu-1200', chestNo: 1200, teamId: 'team-a', codeLetter: 'Q2', isPrelimQualified: true, marks: 91, grade: 'A+', rank: 2 },
      { studentId: 'stu-1206', chestNo: 1206, teamId: 'team-b', codeLetter: 'Q3', isPrelimQualified: true, marks: 85, grade: 'A', rank: 3 }
    ]
  },

  // Junior Boys
  {
    id: 'p-120',
    code: '#120',
    name: 'ചിത്ര രചന വാട്ടർ കളർ (Water Colour Painting)',
    malayalamName: 'ചിത്ര രചന വാട്ടർ കളർ',
    categoryId: 'junior-boys',
    gender: 'Male',
    location: 'Off Stage',
    type: 'Individual',
    status: 'Published',
    hasPrelimRound: false,
    maxParticipantsPerTeam: 2,
    durationMinutes: 45,
    stageId: 'stage-off-a',
    scheduledTime: 'Day 1 - 02:00 PM',
    judgesAssigned: ['judge-4'],
    publishedAt: '2026-08-25T15:30:00Z',
    participants: [
      { studentId: 'stu-1300', chestNo: 1300, teamId: 'team-a', codeLetter: 'WC1', marks: 93, grade: 'A+', rank: 1 },
      { studentId: 'stu-1306', chestNo: 1306, teamId: 'team-b', codeLetter: 'WC2', marks: 87, grade: 'A', rank: 2 },
      { studentId: 'stu-1312', chestNo: 1312, teamId: 'team-c', codeLetter: 'WC3', marks: 79, grade: 'B+', rank: 3 }
    ]
  },
  {
    id: 'p-124',
    code: '#124',
    name: 'അറബി ഗാനം (Arabic Song Junior)',
    malayalamName: 'അറബി ഗാനം (മുസാബഖ)',
    categoryId: 'junior-boys',
    gender: 'Male',
    location: 'Stage',
    type: 'Individual',
    status: 'Evaluated',
    hasPrelimRound: true,
    prelimCompleted: true,
    maxParticipantsPerTeam: 2,
    durationMinutes: 25,
    stageId: 'stage-1',
    scheduledTime: 'Day 2 - 11:00 AM',
    judgesAssigned: ['judge-1', 'judge-2'],
    participants: [
      { studentId: 'stu-1306', chestNo: 1306, teamId: 'team-b', codeLetter: 'AR1', isPrelimQualified: true, marks: 95, grade: 'A+', rank: 1 },
      { studentId: 'stu-1312', chestNo: 1312, teamId: 'team-c', codeLetter: 'AR2', isPrelimQualified: true, marks: 89, grade: 'A', rank: 2 },
      { studentId: 'stu-1300', chestNo: 1300, teamId: 'team-a', codeLetter: 'AR3', isPrelimQualified: true, marks: 84, grade: 'A', rank: 3 }
    ]
  },

  // Senior Girls
  {
    id: 'p-160',
    code: '#160',
    name: 'അറബിക് കാലിഗ്രാഫി (Arabic Calligraphy)',
    malayalamName: 'അറബിക് കാലിഗ്രാഫി',
    categoryId: 'senior-girls',
    gender: 'Female',
    location: 'Off Stage',
    type: 'Individual',
    status: 'Published',
    hasPrelimRound: false,
    maxParticipantsPerTeam: 2,
    durationMinutes: 45,
    stageId: 'stage-off-a',
    scheduledTime: 'Day 1 - 03:00 PM',
    judgesAssigned: ['judge-4'],
    publishedAt: '2026-08-25T16:00:00Z',
    participants: [
      { studentId: 'stu-1450', chestNo: 1450, teamId: 'team-a', codeLetter: 'CAL1', marks: 97, grade: 'A+', rank: 1 },
      { studentId: 'stu-1460', chestNo: 1460, teamId: 'team-c', codeLetter: 'CAL2', marks: 90, grade: 'A+', rank: 2 },
      { studentId: 'stu-1455', chestNo: 1455, teamId: 'team-b', codeLetter: 'CAL3', marks: 84, grade: 'A', rank: 3 }
    ]
  },
  {
    id: 'p-165',
    code: '#165',
    name: 'കയ്യെഴുത്ത് അറബി (Arabic Handwriting)',
    malayalamName: 'കയ്യെഴുത്ത് അറബി (മുസാബഖ)',
    categoryId: 'senior-girls',
    gender: 'Female',
    location: 'Off Stage',
    type: 'Individual',
    status: 'Evaluated',
    hasPrelimRound: false,
    maxParticipantsPerTeam: 2,
    durationMinutes: 30,
    stageId: 'stage-off-a',
    scheduledTime: 'Day 2 - 10:00 AM',
    judgesAssigned: ['judge-4'],
    participants: [
      { studentId: 'stu-1455', chestNo: 1455, teamId: 'team-b', codeLetter: 'HW1', marks: 94, grade: 'A+', rank: 1 },
      { studentId: 'stu-1460', chestNo: 1460, teamId: 'team-c', codeLetter: 'HW2', marks: 91, grade: 'A+', rank: 2 },
      { studentId: 'stu-1450', chestNo: 1450, teamId: 'team-a', codeLetter: 'HW3', marks: 86, grade: 'A', rank: 3 }
    ]
  }
];

export const INITIAL_CLASS_AWARDS: ClassAward[] = [
  {
    id: 'award-1',
    awardType: '100% Attendance Proficiency',
    classStandard: 'Class 5',
    date: '2026-08-26',
    winners: [
      { place: 1, studentName: 'SHANID THOUFEEQ', chestNo: 1300, teamId: 'team-a' },
      { place: 2, studentName: 'MUBASHIR ALI', chestNo: 1306, teamId: 'team-b' }
    ]
  },
  {
    id: 'award-2',
    awardType: 'Annual Examination Topper',
    classStandard: 'Class 9',
    date: '2026-08-26',
    winners: [
      { place: 1, studentName: 'FATHIMA RINSHA', chestNo: 1450, teamId: 'team-a' },
      { place: 2, studentName: 'HIBA MARIYAM', chestNo: 1455, teamId: 'team-b' }
    ]
  }
];

export const INITIAL_FINANCE_RECORDS: FinanceRecord[] = [
  {
    id: 'fin-1',
    type: 'Income',
    category: 'Sponsorship',
    amount: 25000,
    description: 'Main Stage Sponsor - Al-Noor Traders',
    date: '2026-08-20',
    recordedBy: 'Treasurer'
  },
  {
    id: 'fin-2',
    type: 'Income',
    category: 'Public Donation',
    amount: 18500,
    description: 'Well-wishers contribution for trophies & prizes',
    date: '2026-08-22',
    recordedBy: 'Committee'
  },
  {
    id: 'fin-3',
    type: 'Expense',
    category: 'Trophies & Mementos',
    amount: 14500,
    description: 'Gold, Silver cups & individual shields',
    date: '2026-08-23',
    recordedBy: 'Convener'
  },
  {
    id: 'fin-4',
    type: 'Expense',
    category: 'Stage & Sound',
    amount: 12000,
    description: 'Sound system, LED lights & backdrop banner',
    date: '2026-08-24',
    recordedBy: 'Stage Manager'
  },
  {
    id: 'fin-5',
    type: 'Expense',
    category: 'Printing & Stationery',
    amount: 3200,
    description: 'Chest numbers, Valuation sheets, Green room books',
    date: '2026-08-24',
    recordedBy: 'Office'
  }
];
