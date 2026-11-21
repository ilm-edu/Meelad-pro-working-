import React, { useState, useMemo } from 'react';
import { useFest } from '../context/FestContext';
import { 
  Trophy, Search, Award, Star, Flame, 
  Clock, MapPin, Users, Share2, Sparkles, 
  ChevronRight, Calendar, ArrowLeft, CheckCircle2
} from 'lucide-react';
import { GenderViewFilter } from '../types';

export const PublicPortalView: React.FC = () => {
  const { 
    festSettings, teams, categories, students, programs, stages,
    genderFilter, setGenderFilter, getTeamScores, getStudentScores,
    getBoysScores, getGirlsScores, getCategoryChampions, getGrandChampions,
    getTopVocalScorers, getTopPenScorers, classAwards 
  } = useFest();

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'champions' | 'student-search' | 'stage-live' | 'results' | 'awards'>('leaderboard');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [searchedStudent, setSearchedStudent] = useState<any | null>(null);

  const teamScores = getTeamScores();
  const studentScores = getStudentScores();
  const grandChampions = getGrandChampions();
  const boysScores = getBoysScores();
  const girlsScores = getGirlsScores();
  const categoryChampions = getCategoryChampions();
  
  const vocalScorers = getTopVocalScorers();
  const penScorers = getTopPenScorers();
  const publishedPrograms = useMemo(() => programs.filter(p => p.status === 'Published'), [programs]);
  const liveStagePrograms = useMemo(() => programs.filter(p => p.status === 'In Progress'), [programs]);

  // Search student handler
  const handleStudentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentSearchQuery.trim()) return;

    const query = studentSearchQuery.trim().toLowerCase();
    const found = students.find(s => 
      s.chestNo.toLowerCase() === query || 
      s.name.toLowerCase().includes(query)
    );

    if (found) {
      const scoreData = studentScores.find(sc => sc.student.id === found.id);
      const studentPrograms = programs.filter(p => 
        p.participants.some(pt => pt.studentId === found.id)
      ).map(p => {
        const pt = p.participants.find(part => part.studentId === found.id)!;
        return {
          program: p,
          participant: pt
        };
      });

      setSearchedStudent({
        student: found,
        scoreData,
        programs: studentPrograms,
        team: teams.find(t => t.id === found.teamId),
        category: categories.find(c => c.id === found.categoryId)
      });
    } else {
      setSearchedStudent(null);
      alert('No student found with that Chest No or Name.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16">
      {/* Public Header Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-4">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wide">
                Official Live Portal
              </span>
              <span className="text-xs text-indigo-300 font-medium">
                {festSettings.academicYear}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {festSettings.festName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mt-1">
              {festSettings.madrassaName} • {festSettings.venue}
            </p>
          </div>

          {/* Quick Division Switcher (Boys / Girls / All) for Parents */}
          <div className="bg-slate-800/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 self-start sm:self-auto flex items-center gap-1 shadow-md">
            {(['All', 'Male', 'Female'] as GenderViewFilter[]).map(g => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  genderFilter === g
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {g === 'All' ? '🌟 Combined' : g === 'Male' ? '👦 Boys Fest' : '👧 Girls Fest'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar p-1">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-300" />
          <span>Team Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab('champions')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
            activeTab === 'champions'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Champions (പ്രതിഭകൾ)</span>
        </button>

        <button
          onClick={() => setActiveTab('student-search')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
            activeTab === 'student-search'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Search className="w-4 h-4 text-indigo-400" />
          <span>Student Chest No Lookup</span>
        </button>

        <button
          onClick={() => setActiveTab('stage-live')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
            activeTab === 'stage-live'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>Stage Live Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
            activeTab === 'results'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-orange-400" />
          <span>Event Results ({publishedPrograms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('awards')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
            activeTab === 'awards'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Star className="w-4 h-4 text-purple-400" />
          <span>Class Awards</span>
        </button>
      </div>

      {/* TAB 1: TEAM LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-5">
          {/* Top 3 Podium (Visual) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-end pt-4">
            {/* Rank 2 */}
            {teamScores[1] && (
              <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 text-center shadow-xs flex flex-col items-center justify-end h-44 sm:h-52">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-extrabold flex items-center justify-center text-xs mb-2 shadow-xs">
                  🥈
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate max-w-full">
                  {teamScores[1].team.name}
                </h4>
                <div className="text-lg sm:text-2xl font-black mt-1" style={{ color: teamScores[1].team.color }}>
                  {teamScores[1].totalPoints}
                </div>
                <div className="text-[10px] text-slate-600 font-semibold uppercase">Points</div>
              </div>
            )}

            {/* Rank 1 */}
            {teamScores[0] && (
              <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl border-2 border-amber-400 p-4 sm:p-5 text-center shadow-md flex flex-col items-center justify-end h-52 sm:h-64 relative">
                <div className="absolute -top-3.5 px-3 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] uppercase shadow-sm">
                  👑 Leader
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-black flex items-center justify-center text-base mb-2 shadow-xs">
                  🥇
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate max-w-full">
                  {teamScores[0].team.name}
                </h4>
                <div className="text-2xl sm:text-3xl font-black mt-1 text-amber-600">
                  {teamScores[0].totalPoints}
                </div>
                <div className="text-[10px] text-slate-600 font-semibold uppercase">Points</div>
              </div>
            )}

            {/* Rank 3 */}
            {teamScores[2] && (
              <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 text-center shadow-xs flex flex-col items-center justify-end h-40 sm:h-48">
                <div className="w-8 h-8 rounded-full bg-amber-900/10 border border-amber-800/20 text-amber-900 font-extrabold flex items-center justify-center text-xs mb-2 shadow-xs">
                  🥉
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate max-w-full">
                  {teamScores[2].team.name}
                </h4>
                <div className="text-lg sm:text-2xl font-black mt-1" style={{ color: teamScores[2].team.color }}>
                  {teamScores[2].totalPoints}
                </div>
                <div className="text-[10px] text-slate-600 font-semibold uppercase">Points</div>
              </div>
            )}
          </div>

          {/* Full Standings List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">
                Detailed Team Point Breakdown ({genderFilter === 'All' ? 'Combined' : genderFilter + ' Fest'})
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {teamScores.map((ts, idx) => (
                <div key={ts.team.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 font-black text-xs text-slate-700 flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ts.team.color }} />
                        <h4 className="font-bold text-sm text-slate-900">{ts.team.name}</h4>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-2">
                        <span>Stage: <strong>{ts.stagePoints} pts</strong></span>
                        <span>•</span>
                        <span>Off-Stage: <strong>{ts.offStagePoints} pts</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900">{ts.totalPoints}</div>
                    <div className="text-[10px] text-slate-600 font-semibold">Total Points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: CHAMPIONS (Kala Prathibha & Kala Thilakam) */}
      {activeTab === 'champions' && (
        <div className="space-y-6">
          {/* Dual Grand Champions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kala Prathibha (Boys Fest Champion) */}
            {(genderFilter === 'All' || genderFilter === 'Male') && (
              <div className="rounded-3xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white p-6 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-xs">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span>കലാപ്രതിഭ (KALA PRATHIBHA)</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    BOYS CHAMPION
                  </span>
                </div>

                {grandChampions.boysChampion ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-sm font-black text-emerald-700">
                          #{grandChampions.boysChampion.student.chestNo}
                        </span>
                        <h3 className="text-xl font-black text-slate-900">
                          {grandChampions.boysChampion.student.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="font-semibold text-slate-700">
                          {categories.find(c => c.id === grandChampions.boysChampion?.student.categoryId)?.name}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="font-bold" style={{ color: teams.find(t => t.id === grandChampions.boysChampion?.student.teamId)?.color }}>
                          {teams.find(t => t.id === grandChampions.boysChampion?.student.teamId)?.name}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200">
                      <div className="bg-white/90 p-2.5 rounded-xl text-center border border-emerald-100">
                        <div className="text-[10px] font-bold text-slate-500">TOTAL PTS</div>
                        <div className="text-lg font-black text-emerald-700">
                          {grandChampions.boysChampion.totalPoints}
                        </div>
                      </div>
                      <div className="bg-white/90 p-2.5 rounded-xl text-center border border-emerald-100">
                        <div className="text-[10px] font-bold text-slate-500">STAGE</div>
                        <div className="text-lg font-black text-purple-700">
                          {grandChampions.boysChampion.stagePoints}
                        </div>
                      </div>
                      <div className="bg-white/90 p-2.5 rounded-xl text-center border border-emerald-100">
                        <div className="text-[10px] font-bold text-slate-500">1st PLACES</div>
                        <div className="text-lg font-black text-amber-600">
                          {grandChampions.boysChampion.firstCount}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500 font-medium">
                    Awaiting published Boys event results.
                  </div>
                )}
              </div>
            )}

            {/* Kala Thilakam (Girls Fest Champion) */}
            {(genderFilter === 'All' || genderFilter === 'Female') && (
              <div className="rounded-3xl border-2 border-rose-400 bg-gradient-to-br from-rose-50 via-pink-50/40 to-white p-6 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-xs">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span>കലാതിലകം (KALA THILAKAM)</span>
                  </div>
                  <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                    GIRLS CHAMPION
                  </span>
                </div>

                {grandChampions.girlsChampion ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-sm font-black text-rose-700">
                          #{grandChampions.girlsChampion.student.chestNo}
                        </span>
                        <h3 className="text-xl font-black text-slate-900">
                          {grandChampions.girlsChampion.student.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="font-semibold text-slate-700">
                          {categories.find(c => c.id === grandChampions.girlsChampion?.student.categoryId)?.name}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="font-bold" style={{ color: teams.find(t => t.id === grandChampions.girlsChampion?.student.teamId)?.color }}>
                          {teams.find(t => t.id === grandChampions.girlsChampion?.student.teamId)?.name}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-rose-200">
                      <div className="bg-white/90 p-2.5 rounded-xl text-center border border-rose-100">
                        <div className="text-[10px] font-bold text-slate-500">TOTAL PTS</div>
                        <div className="text-lg font-black text-rose-700">
                          {grandChampions.girlsChampion.totalPoints}
                        </div>
                      </div>
                      <div className="bg-white/90 p-2.5 rounded-xl text-center border border-rose-100">
                        <div className="text-[10px] font-bold text-slate-500">STAGE</div>
                        <div className="text-lg font-black text-purple-700">
                          {grandChampions.girlsChampion.stagePoints}
                        </div>
                      </div>
                      <div className="bg-white/90 p-2.5 rounded-xl text-center border border-rose-100">
                        <div className="text-[10px] font-bold text-slate-500">1st PLACES</div>
                        <div className="text-lg font-black text-amber-600">
                          {grandChampions.girlsChampion.firstCount}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500 font-medium">
                    Awaiting published Girls event results.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category-wise Champions */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Category Champions (വിഭാഗം ചാമ്പ്യന്മാർ)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryChampions
                .filter(cc => {
                  if (genderFilter === 'Male') return cc.category.gender === 'Male';
                  if (genderFilter === 'Female') return cc.category.gender === 'Female';
                  return true;
                })
                .map(cc => {
                  const champ = cc.champion;
                  const isBoy = cc.category.gender === 'Male';
                  const team = champ ? teams.find(t => t.id === champ.student.teamId) : null;

                  return (
                    <div 
                      key={cc.category.id} 
                      className={`p-3.5 rounded-2xl border ${
                        isBoy ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'
                      } space-y-2`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{cc.category.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isBoy ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isBoy ? '👦 Boys' : '👧 Girls'}
                        </span>
                      </div>

                      {champ && champ.totalPoints > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-800">
                              #{champ.student.chestNo} {champ.student.name}
                            </span>
                            <span className={`font-black text-xs ${isBoy ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {champ.totalPoints} pts
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold" style={{ color: team?.color }}>
                              {team?.name}
                            </span>
                            <span className="text-slate-500">
                              {champ.stagePoints} stage / {champ.offStagePoints} off-stage
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 font-medium py-1">
                          Awaiting results
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT CHEST NO SEARCH */}
      {activeTab === 'student-search' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Find Student Live Results & Timetable</h3>
            <p className="text-xs text-slate-600">
              Enter the student's <strong>Chest Number (e.g. 101, 102)</strong> or student name to check performance card:
            </p>

            <form onSubmit={handleStudentSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter Chest No (e.g. 101) or Student Name..."
                  value={studentSearchQuery}
                  onChange={e => setStudentSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Search
              </button>
            </form>
          </div>

          {/* Searched Student Card */}
          {searchedStudent && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-slate-900 text-white px-2 py-0.5 rounded-md">
                      #{searchedStudent.student.chestNo}
                    </span>
                    <h3 className="text-lg font-black text-slate-900">
                      {searchedStudent.student.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Class {searchedStudent.student.classNumber} • {searchedStudent.category?.name} • <strong style={{ color: searchedStudent.team?.color }}>{searchedStudent.team?.name}</strong>
                  </p>
                </div>

                <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 text-center self-start sm:self-auto">
                  <div className="text-xl font-black text-indigo-700">
                    {searchedStudent.scoreData?.totalPoints || 0} pts
                  </div>
                  <div className="text-[10px] font-bold text-indigo-900 uppercase">Total Individual Points</div>
                </div>
              </div>

              {/* Registered Programs & Results */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Registered Events & Live Standings:
                </h4>

                {searchedStudent.programs.length === 0 ? (
                  <div className="text-xs text-slate-600">No events registered.</div>
                ) : (
                  searchedStudent.programs.map(({ program, participant }: any) => (
                    <div
                      key={program.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                            {program.code}
                          </span>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{program.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {program.location} • Status: <strong>{program.status}</strong>
                        </div>
                      </div>

                      <div className="text-right">
                        {participant.rank ? (
                          <span className="px-2.5 py-1 rounded-xl font-extrabold text-xs bg-amber-100 text-amber-900 border border-amber-300">
                            {participant.rank === 1 ? '🥇 1st Place' : participant.rank === 2 ? '🥈 2nd Place' : '🥉 3rd Place'}
                          </span>
                        ) : participant.grade ? (
                          <span className="px-2 py-0.5 rounded-lg font-bold text-xs bg-indigo-100 text-indigo-800">
                            Grade {participant.grade}
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px] font-medium">
                            Awaiting Result
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STAGE LIVE SCHEDULE */}
      {activeTab === 'stage-live' && (
        <div className="space-y-4">
          {liveStagePrograms.length > 0 && (
            <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-4 rounded-2xl shadow-md space-y-2 animate-pulse">
              <div className="flex items-center gap-2 text-xs font-black uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>NOW LIVE ON STAGE</span>
              </div>
              {liveStagePrograms.map(p => (
                <div key={p.id} className="text-base font-extrabold">
                  {p.code} - {p.name} ({stages.find(s => s.id === p.stageId)?.name || 'Main Stage'})
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {programs
              .filter(p => p.location === 'Stage')
              .map(p => {
                const stage = stages.find(s => s.id === p.stageId);
                const category = categories.find(c => c.id === p.categoryId);

                return (
                  <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {p.code}
                      </span>
                      <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {stage?.name || 'Stage 1'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{p.name}</h4>
                    <p className="text-xs text-slate-600">{category?.name} • {p.durationMinutes || 20} mins</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">⏰ {p.scheduledTime || 'Scheduled'}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Published' ? 'bg-emerald-100 text-emerald-800' :
                        p.status === 'In Progress' ? 'bg-rose-100 text-rose-800 font-extrabold' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 4: PUBLISHED EVENT RESULTS */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {publishedPrograms.map(p => {
              const category = categories.find(c => c.id === p.categoryId);
              const rank1 = p.participants.find(pt => pt.rank === 1);
              const rank2 = p.participants.find(pt => pt.rank === 2);
              const rank3 = p.participants.find(pt => pt.rank === 3);

              const stu1 = students.find(s => s.id === rank1?.studentId);
              const stu2 = students.find(s => s.id === rank2?.studentId);
              const stu3 = students.find(s => s.id === rank3?.studentId);

              const team1 = teams.find(t => t.id === rank1?.teamId);
              const team2 = teams.find(t => t.id === rank2?.teamId);
              const team3 = teams.find(t => t.id === rank3?.teamId);

              return (
                <div key={p.id} className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {p.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Published
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">{p.name}</h4>
                  <p className="text-xs text-slate-600">{category?.name} ({p.location})</p>

                  <div className="space-y-1.5 text-xs pt-1">
                    {rank1 && (
                      <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-amber-800">🥇 1st:</span>
                          <span className="font-bold text-slate-900">{stu1?.name}</span>
                        </div>
                        <span className="font-semibold text-[11px]" style={{ color: team1?.color }}>
                          {team1?.name}
                        </span>
                      </div>
                    )}

                    {rank2 && (
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-700">🥈 2nd:</span>
                          <span className="font-bold text-slate-800">{stu2?.name}</span>
                        </div>
                        <span className="font-semibold text-[11px]" style={{ color: team2?.color }}>
                          {team2?.name}
                        </span>
                      </div>
                    )}

                    {rank3 && (
                      <div className="p-2 rounded-xl bg-amber-900/5 border border-amber-800/20 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-amber-900">🥉 3rd:</span>
                          <span className="font-bold text-slate-800">{stu3?.name}</span>
                        </div>
                        <span className="font-semibold text-[11px]" style={{ color: team3?.color }}>
                          {team3?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: CLASS & SPECIAL AWARDS */}
      {activeTab === 'awards' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classAwards.map(award => (
              <div key={award.id} className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                    {award.classStandard}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">
                    {award.awardType}
                  </h4>
                </div>

                <div className="space-y-1.5 text-xs">
                  {award.winners.map(w => (
                    <div key={w.place} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <span className="font-bold text-slate-700">
                        {w.place === 1 ? '🥇 1st Place' : w.place === 2 ? '🥈 2nd Place' : '🥉 3rd Place'}:
                      </span>
                      <span className="font-extrabold text-slate-900">{w.studentName}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
