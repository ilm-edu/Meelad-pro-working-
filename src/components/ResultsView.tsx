import React, { useState, useMemo } from 'react';
import { useFest } from '../context/FestContext';
import { 
  Trophy, Sparkles, Award, Star, Flame, 
  CheckCircle2, ArrowRight, Share2, Printer, 
  Users, Filter, Eye, RefreshCw, Layers, Plus, Trash2, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Program, ClassAward, GenderViewFilter } from '../types';

export const ResultsView: React.FC = () => {
  const { 
    programs, publishProgramResult, unpublishProgramResult, publishAllEvaluated,
    teams, categories, students, classAwards, addClassAward, deleteClassAward,
    genderFilter, setGenderFilter, getTeamScores, getStudentScores,
    getBoysScores, getGirlsScores, getCategoryChampions, getGrandChampions,
    getTopVocalScorers, getTopPenScorers, getSmartPublishRecommendations
  } = useFest();

  const [activeSubTab, setActiveSubTab] = useState<'smart-publisher' | 'programs' | 'top-scorers' | 'class-awards'>('smart-publisher');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>(genderFilter === 'All' ? 'All' : genderFilter);
  const [individualChampionshipView, setIndividualChampionshipView] = useState<'both' | 'male' | 'female'>('both');
  const [selectedProgramForCert, setSelectedProgramForCert] = useState<Program | null>(null);

  // Class Awards Modal
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [awardForm, setAwardForm] = useState({
    awardType: '100% Attendance Proficiency',
    classStandard: 'Class 5',
    winner1: '',
    winner2: '',
    winner3: ''
  });

  const evaluatedPrograms = useMemo(() => programs.filter(p => p.status === 'Evaluated'), [programs]);
  const publishedPrograms = useMemo(() => programs.filter(p => p.status === 'Published'), [programs]);
  const smartRecs = getSmartPublishRecommendations();
  const teamScores = getTeamScores();
  
  const grandChampions = getGrandChampions();
  const boysScores = getBoysScores();
  const girlsScores = getGirlsScores();
  const categoryChampions = getCategoryChampions();
  
  const boysVocalScorers = getTopVocalScorers('Male');
  const girlsVocalScorers = getTopVocalScorers('Female');
  const boysPenScorers = getTopPenScorers('Male');
  const girlsPenScorers = getTopPenScorers('Female');

  const handlePublishWithConfetti = (progId: string) => {
    publishProgramResult(progId);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handlePublishAllWithConfetti = () => {
    if (window.confirm(`Publish all ${evaluatedPrograms.length} evaluated program results at once?`)) {
      publishAllEvaluated();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  };

  const handleSaveAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardForm.winner1.trim()) return;

    const winners: ClassAward['winners'] = [
      { place: 1, studentName: awardForm.winner1 }
    ];
    if (awardForm.winner2.trim()) winners.push({ place: 2, studentName: awardForm.winner2 });
    if (awardForm.winner3.trim()) winners.push({ place: 3, studentName: awardForm.winner3 });

    addClassAward({
      awardType: awardForm.awardType,
      classStandard: awardForm.classStandard,
      date: new Date().toISOString().split('T')[0],
      winners
    });

    setIsAwardModalOpen(false);
    setAwardForm({
      awardType: '100% Attendance Proficiency',
      classStandard: 'Class 5',
      winner1: '',
      winner2: '',
      winner3: ''
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Sub Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar p-1">
          <button
            id="tab-smart-publisher"
            onClick={() => setActiveSubTab('smart-publisher')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeSubTab === 'smart-publisher'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Result Publisher</span>
            {evaluatedPrograms.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-orange-700 text-[10px] font-extrabold">
                {evaluatedPrograms.length}
              </span>
            )}
          </button>

          <button
            id="tab-prog-results"
            onClick={() => setActiveSubTab('programs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeSubTab === 'programs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Program Results ({publishedPrograms.length})</span>
          </button>

          <button
            id="tab-top-scorers"
            onClick={() => setActiveSubTab('top-scorers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeSubTab === 'top-scorers'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Top Scorers (Vocal / Pen)</span>
          </button>

          <button
            id="tab-class-awards"
            onClick={() => setActiveSubTab('class-awards')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeSubTab === 'class-awards'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Class Awards ({classAwards.length})</span>
          </button>
        </div>

        {evaluatedPrograms.length > 0 && activeSubTab === 'smart-publisher' && (
          <button
            id="publish-all-btn"
            onClick={handlePublishAllWithConfetti}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 shadow-xs"
          >
            <span>Publish All ({evaluatedPrograms.length})</span>
          </button>
        )}
      </div>

      {/* VIEW 1: SMART BALANCED RESULT PUBLISHER (Adipoli Publishing Manager) */}
      {activeSubTab === 'smart-publisher' && (
        <div className="space-y-6">
          {/* Engine Header */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-800 shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-extrabold text-xl shadow-md">
                  🎯
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-amber-300">
                    Smart Balanced Result Publishing Manager
                  </h3>
                  <p className="text-xs text-slate-300">
                    Calculates points distribution to release results with optimal excitement, suspense, and neck-to-neck competition.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                <span className="text-slate-400">Current Leader:</span>
                <strong className="text-amber-400 font-bold">{teamScores[0]?.team.name || 'None'}</strong>
                <span className="text-slate-500">({teamScores[0]?.totalPoints || 0} pts)</span>
              </div>
            </div>
          </div>

          {/* Publishing Recommendations */}
          {smartRecs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mx-auto">
                ✨
              </div>
              <h4 className="font-bold text-slate-900 text-sm">All Evaluated Results Are Up To Date!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                There are no unannounced evaluated programs pending. Enter marks in the "Mark Entry & Judges" tab to generate balanced publish recommendations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Recommended Sequence to Publish ({smartRecs.length} Pending):
                </h4>
                <span className="text-xs text-indigo-600 font-semibold">
                  Sorted by Balance & Suspense Rating
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {smartRecs.map(({ program, projectedWinnerTeam, projectedPointsAwarded, balanceScore, reason }, idx) => {
                  const category = categories.find(c => c.id === program.categoryId);

                  return (
                    <div
                      key={program.id}
                      className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                        idx === 0
                          ? 'border-amber-400 ring-2 ring-amber-400/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                {program.code}
                              </span>
                              <h5 className="font-bold text-sm text-slate-900">
                                {program.name}
                              </h5>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {category?.name} • {program.location}
                            </p>
                          </div>

                          {idx === 0 ? (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs animate-pulse">
                              🌟 TOP PICK
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                              Option #{idx + 1}
                            </span>
                          )}
                        </div>

                        {/* Balance Reason */}
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                          {reason}
                        </div>

                        {/* Point Impact Simulation */}
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                            <span>Projected Points Gain:</span>
                            <span>Winner: <strong style={{ color: projectedWinnerTeam?.color }}>{projectedWinnerTeam?.name}</strong></span>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {teams.map(t => {
                              const pts = projectedPointsAwarded[t.id] || 0;
                              return (
                                <div key={t.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                                  <div className="text-[10px] text-slate-600 font-semibold truncate">{t.name.split(' ')[0]}</div>
                                  <div className="font-bold text-xs" style={{ color: t.color }}>
                                    +{pts} pts
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-600">
                          Suspense Score: <strong className="text-slate-800">{balanceScore}%</strong>
                        </span>

                        <button
                          id={`publish-rec-${program.id}`}
                          onClick={() => handlePublishWithConfetti(program.id)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm app-touch-active"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Publish Result Now</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: PUBLISHED PROGRAM RESULTS */}
      {activeSubTab === 'programs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {publishedPrograms.map(prog => {
              const category = categories.find(c => c.id === prog.categoryId);
              const rank1 = prog.participants.find(pt => pt.rank === 1);
              const rank2 = prog.participants.find(pt => pt.rank === 2);
              const rank3 = prog.participants.find(pt => pt.rank === 3);

              const stu1 = students.find(s => s.id === rank1?.studentId);
              const stu2 = students.find(s => s.id === rank2?.studentId);
              const stu3 = students.find(s => s.id === rank3?.studentId);

              const team1 = teams.find(t => t.id === rank1?.teamId);
              const team2 = teams.find(t => t.id === rank2?.teamId);
              const team3 = teams.find(t => t.id === rank3?.teamId);

              return (
                <div 
                  key={prog.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between space-y-3.5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {prog.code}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Published
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 mt-2">
                      {prog.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {category?.name} • {prog.location}
                    </p>

                    {/* Winners Podium Summary */}
                    <div className="mt-3 space-y-1.5 text-xs">
                      {rank1 && (
                        <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200/60 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-amber-800">🥇 1st:</span>
                            <span className="font-bold text-slate-900">{stu1?.name}</span>
                            <span className="text-[10px] text-slate-600 font-mono">#{rank1.chestNo}</span>
                          </div>
                          <span className="font-semibold text-[11px]" style={{ color: team1?.color }}>
                            {team1?.name.split(' ')[0]}
                          </span>
                        </div>
                      )}

                      {rank2 && (
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-700">🥈 2nd:</span>
                            <span className="font-bold text-slate-800">{stu2?.name}</span>
                            <span className="text-[10px] text-slate-600 font-mono">#{rank2.chestNo}</span>
                          </div>
                          <span className="font-semibold text-[11px]" style={{ color: team2?.color }}>
                            {team2?.name.split(' ')[0]}
                          </span>
                        </div>
                      )}

                      {rank3 && (
                        <div className="p-2 rounded-lg bg-amber-900/5 border border-amber-800/20 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-amber-900">🥉 3rd:</span>
                            <span className="font-bold text-slate-800">{stu3?.name}</span>
                            <span className="text-[10px] text-slate-600 font-mono">#{rank3.chestNo}</span>
                          </div>
                          <span className="font-semibold text-[11px]" style={{ color: team3?.color }}>
                            {team3?.name.split(' ')[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => unpublishProgramResult(prog.id)}
                      className="text-xs text-slate-600 hover:text-rose-600 font-medium"
                    >
                      Unpublish
                    </button>

                    <button
                      onClick={() => setSelectedProgramForCert(prog)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Result Slip</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: INDIVIDUAL CHAMPIONSHIPS & TOP SCORERS (Matching PDF page 11 & Strict Gender Separation) */}
      {activeSubTab === 'top-scorers' && (
        <div className="space-y-6">
          {/* Grand Champions Spotlight (കലാപ്രതിഭ & കലാതിലകം) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Grand Fest Champions (മഹാ പ്രതിഭകൾ)</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Boys and Girls championships are awarded independently with separate titles and trophies.
                </p>
              </div>

              {/* Gender View Filter Toggle for Championships */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
                <button
                  onClick={() => setIndividualChampionshipView('both')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    individualChampionshipView === 'both' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Both Sections
                </button>
                <button
                  onClick={() => setIndividualChampionshipView('male')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    individualChampionshipView === 'male' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  👦 Boys (കലാപ്രതിഭ)
                </button>
                <button
                  onClick={() => setIndividualChampionshipView('female')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    individualChampionshipView === 'female' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  👧 Girls (കലാതിലകം)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kala Prathibha (Boys Fest Champion) */}
              {(individualChampionshipView === 'both' || individualChampionshipView === 'male') && (
                <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white p-5 shadow-sm">
                  <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 opacity-10">
                    <Trophy className="w-32 h-32 text-emerald-900" />
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black tracking-wide shadow-xs">
                      <Trophy className="w-3.5 h-3.5 text-amber-300" />
                      <span>കലാപ്രതിഭ (KALA PRATHIBHA)</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                      BOYS FEST CHAMPION
                    </span>
                  </div>

                  {grandChampions.boysChampion ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-sm font-bold text-emerald-700">
                            #{grandChampions.boysChampion.student.chestNo}
                          </span>
                          <h4 className="text-lg font-black text-slate-900">
                            {grandChampions.boysChampion.student.name}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                          <span className="font-semibold text-slate-700">
                            {categories.find(c => c.id === grandChampions.boysChampion?.student.categoryId)?.name}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="font-bold" style={{ color: teams.find(t => t.id === grandChampions.boysChampion?.student.teamId)?.color }}>
                            {teams.find(t => t.id === grandChampions.boysChampion?.student.teamId)?.name}
                          </span>
                        </div>
                      </div>

                      {/* Score Badges */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200/60">
                        <div className="bg-white/80 p-2 rounded-xl text-center border border-emerald-100">
                          <div className="text-[10px] font-bold text-slate-500">TOTAL PTS</div>
                          <div className="text-base font-black text-emerald-700">
                            {grandChampions.boysChampion.totalPoints}
                          </div>
                        </div>
                        <div className="bg-white/80 p-2 rounded-xl text-center border border-emerald-100">
                          <div className="text-[10px] font-bold text-slate-500">STAGE PTS</div>
                          <div className="text-base font-black text-purple-700">
                            {grandChampions.boysChampion.stagePoints}
                          </div>
                        </div>
                        <div className="bg-white/80 p-2 rounded-xl text-center border border-emerald-100">
                          <div className="text-[10px] font-bold text-slate-500">1st PLACES</div>
                          <div className="text-base font-black text-amber-600">
                            {grandChampions.boysChampion.firstCount}
                          </div>
                        </div>
                      </div>

                      {/* Programs won */}
                      {grandChampions.boysChampion.programDetails.length > 0 && (
                        <div className="pt-2">
                          <div className="text-[11px] font-bold text-slate-600 mb-1">Winning Programs:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {grandChampions.boysChampion.programDetails.map(pd => (
                              <span key={pd.program.id} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {pd.rank === 1 ? '🥇' : pd.rank === 2 ? '🥈' : '🥉'} {pd.program.name.split('(')[0]} ({pd.points}p)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-500 font-medium">
                      Publish evaluated Boys programs to determine Kala Prathibha champion.
                    </div>
                  )}
                </div>
              )}

              {/* Kala Thilakam (Girls Fest Champion) */}
              {(individualChampionshipView === 'both' || individualChampionshipView === 'female') && (
                <div className="relative overflow-hidden rounded-2xl border-2 border-rose-400 bg-gradient-to-br from-rose-50 via-pink-50/40 to-white p-5 shadow-sm">
                  <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 opacity-10">
                    <Trophy className="w-32 h-32 text-rose-900" />
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black tracking-wide shadow-xs">
                      <Trophy className="w-3.5 h-3.5 text-amber-300" />
                      <span>കലാതിലകം (KALA THILAKAM)</span>
                    </div>
                    <span className="text-[11px] font-bold text-rose-800 bg-rose-100/80 px-2.5 py-0.5 rounded-full">
                      GIRLS FEST CHAMPION
                    </span>
                  </div>

                  {grandChampions.girlsChampion ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-sm font-bold text-rose-700">
                            #{grandChampions.girlsChampion.student.chestNo}
                          </span>
                          <h4 className="text-lg font-black text-slate-900">
                            {grandChampions.girlsChampion.student.name}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                          <span className="font-semibold text-slate-700">
                            {categories.find(c => c.id === grandChampions.girlsChampion?.student.categoryId)?.name}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="font-bold" style={{ color: teams.find(t => t.id === grandChampions.girlsChampion?.student.teamId)?.color }}>
                            {teams.find(t => t.id === grandChampions.girlsChampion?.student.teamId)?.name}
                          </span>
                        </div>
                      </div>

                      {/* Score Badges */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-rose-200/60">
                        <div className="bg-white/80 p-2 rounded-xl text-center border border-rose-100">
                          <div className="text-[10px] font-bold text-slate-500">TOTAL PTS</div>
                          <div className="text-base font-black text-rose-700">
                            {grandChampions.girlsChampion.totalPoints}
                          </div>
                        </div>
                        <div className="bg-white/80 p-2 rounded-xl text-center border border-rose-100">
                          <div className="text-[10px] font-bold text-slate-500">STAGE PTS</div>
                          <div className="text-base font-black text-purple-700">
                            {grandChampions.girlsChampion.stagePoints}
                          </div>
                        </div>
                        <div className="bg-white/80 p-2 rounded-xl text-center border border-rose-100">
                          <div className="text-[10px] font-bold text-slate-500">1st PLACES</div>
                          <div className="text-base font-black text-amber-600">
                            {grandChampions.girlsChampion.firstCount}
                          </div>
                        </div>
                      </div>

                      {/* Programs won */}
                      {grandChampions.girlsChampion.programDetails.length > 0 && (
                        <div className="pt-2">
                          <div className="text-[11px] font-bold text-slate-600 mb-1">Winning Programs:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {grandChampions.girlsChampion.programDetails.map(pd => (
                              <span key={pd.program.id} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
                                {pd.rank === 1 ? '🥇' : pd.rank === 2 ? '🥈' : '🥉'} {pd.program.name.split('(')[0]} ({pd.points}p)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-500 font-medium">
                      Publish evaluated Girls programs to determine Kala Thilakam champion.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Category-wise Individual Champions (വിഭാഗം ചാമ്പ്യന്മാർ) */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Category Champions (വിഭാഗം ചാമ്പ്യന്മാർ)</h3>
                <p className="text-xs text-slate-600">
                  Individual toppers of each category division (Boys and Girls segregated).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryChampions
                .filter(cc => {
                  if (individualChampionshipView === 'male') return cc.category.gender === 'Male';
                  if (individualChampionshipView === 'female') return cc.category.gender === 'Female';
                  return true;
                })
                .map(cc => {
                  const champ = cc.champion;
                  const isBoy = cc.category.gender === 'Male';
                  const team = champ ? teams.find(t => t.id === champ.student.teamId) : null;

                  return (
                    <div 
                      key={cc.category.id} 
                      className={`p-3 rounded-xl border ${
                        isBoy 
                          ? 'border-emerald-200/80 bg-emerald-50/30' 
                          : 'border-rose-200/80 bg-rose-50/30'
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
                          No points recorded yet
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Special Category Stars (Vocal & Pen Stars for Boys and Girls) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Boys Vocal Star */}
            {(individualChampionshipView === 'both' || individualChampionshipView === 'male') && (
              <div className="bg-white p-3.5 rounded-2xl border border-purple-200 shadow-xs space-y-1">
                <div className="text-[11px] font-bold text-purple-700 flex items-center justify-between">
                  <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-purple-600" /> BOYS VOCAL STAR</span>
                  <span className="text-[10px] bg-purple-100 px-1.5 py-0.2 rounded font-bold">STAGE</span>
                </div>
                <div className="font-bold text-sm text-slate-900 truncate">
                  {boysVocalScorers[0]?.student.name || 'No Stage Points'}
                </div>
                <div className="text-xs text-purple-700 font-semibold">
                  {boysVocalScorers[0]?.stagePoints || 0} Stage Points
                </div>
              </div>
            )}

            {/* Girls Vocal Star */}
            {(individualChampionshipView === 'both' || individualChampionshipView === 'female') && (
              <div className="bg-white p-3.5 rounded-2xl border border-pink-200 shadow-xs space-y-1">
                <div className="text-[11px] font-bold text-pink-700 flex items-center justify-between">
                  <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-pink-600" /> GIRLS VOCAL STAR</span>
                  <span className="text-[10px] bg-pink-100 px-1.5 py-0.2 rounded font-bold">STAGE</span>
                </div>
                <div className="font-bold text-sm text-slate-900 truncate">
                  {girlsVocalScorers[0]?.student.name || 'No Stage Points'}
                </div>
                <div className="text-xs text-pink-700 font-semibold">
                  {girlsVocalScorers[0]?.stagePoints || 0} Stage Points
                </div>
              </div>
            )}

            {/* Boys Pen Star */}
            {(individualChampionshipView === 'both' || individualChampionshipView === 'male') && (
              <div className="bg-white p-3.5 rounded-2xl border border-teal-200 shadow-xs space-y-1">
                <div className="text-[11px] font-bold text-teal-700 flex items-center justify-between">
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-teal-600" /> BOYS PEN STAR</span>
                  <span className="text-[10px] bg-teal-100 px-1.5 py-0.2 rounded font-bold">OFF-STAGE</span>
                </div>
                <div className="font-bold text-sm text-slate-900 truncate">
                  {boysPenScorers[0]?.student.name || 'No Off-Stage Points'}
                </div>
                <div className="text-xs text-teal-700 font-semibold">
                  {boysPenScorers[0]?.offStagePoints || 0} Off-Stage Points
                </div>
              </div>
            )}

            {/* Girls Pen Star */}
            {(individualChampionshipView === 'both' || individualChampionshipView === 'female') && (
              <div className="bg-white p-3.5 rounded-2xl border border-indigo-200 shadow-xs space-y-1">
                <div className="text-[11px] font-bold text-indigo-700 flex items-center justify-between">
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-indigo-600" /> GIRLS PEN STAR</span>
                  <span className="text-[10px] bg-indigo-100 px-1.5 py-0.2 rounded font-bold">OFF-STAGE</span>
                </div>
                <div className="font-bold text-sm text-slate-900 truncate">
                  {girlsPenScorers[0]?.student.name || 'No Off-Stage Points'}
                </div>
                <div className="text-xs text-indigo-700 font-semibold">
                  {girlsPenScorers[0]?.offStagePoints || 0} Off-Stage Points
                </div>
              </div>
            )}
          </div>

          {/* DISTINCT RANKING TABLES (NEVER MIXED) */}
          <div className="space-y-6">
            {/* BOYS RANKING TABLE */}
            {(individualChampionshipView === 'both' || individualChampionshipView === 'male') && (
              <div className="bg-white rounded-2xl border-2 border-emerald-200/90 shadow-xs overflow-hidden">
                <div className="p-4 bg-emerald-50/50 border-b border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      👦 Boys Individual Rankings (കലാപ്രതിഭ പട്ടിക)
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {boysScores.filter(s => s.totalPoints > 0).length} Scoring Contestants
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                        <th className="py-3 px-3 w-12 text-center">RANK</th>
                        <th className="py-3 px-3">CHEST NO</th>
                        <th className="py-3 px-4">STUDENT NAME</th>
                        <th className="py-3 px-3">CATEGORY</th>
                        <th className="py-3 px-3">TEAM</th>
                        <th className="py-3 px-3 text-center">STAGE PTS</th>
                        <th className="py-3 px-3 text-center">OFF-STAGE PTS</th>
                        <th className="py-3 px-4 text-right">TOTAL POINTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {boysScores.slice(0, 15).map((score, index) => {
                        const category = categories.find(c => c.id === score.student.categoryId);
                        const team = teams.find(t => t.id === score.student.teamId);

                        return (
                          <tr key={score.student.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-3 text-center font-bold text-slate-700">
                              {index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : index + 1}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-800">
                              #{score.student.chestNo}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {score.student.name}
                            </td>
                            <td className="py-3 px-3 text-slate-600 font-medium">
                              {category?.name}
                            </td>
                            <td className="py-3 px-3 font-semibold" style={{ color: team?.color }}>
                              {team?.name}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-purple-700">
                              {score.stagePoints}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-teal-700">
                              {score.offStagePoints}
                            </td>
                            <td className="py-3 px-4 text-right font-extrabold text-sm text-emerald-700">
                              {score.totalPoints} pts
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* GIRLS RANKING TABLE */}
            {(individualChampionshipView === 'both' || individualChampionshipView === 'female') && (
              <div className="bg-white rounded-2xl border-2 border-rose-200/90 shadow-xs overflow-hidden">
                <div className="p-4 bg-rose-50/50 border-b border-rose-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      👧 Girls Individual Rankings (കലാതിലകം പട്ടിക)
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                    {girlsScores.filter(s => s.totalPoints > 0).length} Scoring Contestants
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                        <th className="py-3 px-3 w-12 text-center">RANK</th>
                        <th className="py-3 px-3">CHEST NO</th>
                        <th className="py-3 px-4">STUDENT NAME</th>
                        <th className="py-3 px-3">CATEGORY</th>
                        <th className="py-3 px-3">TEAM</th>
                        <th className="py-3 px-3 text-center">STAGE PTS</th>
                        <th className="py-3 px-3 text-center">OFF-STAGE PTS</th>
                        <th className="py-3 px-4 text-right">TOTAL POINTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {girlsScores.slice(0, 15).map((score, index) => {
                        const category = categories.find(c => c.id === score.student.categoryId);
                        const team = teams.find(t => t.id === score.student.teamId);

                        return (
                          <tr key={score.student.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-3 text-center font-bold text-slate-700">
                              {index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : index + 1}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-800">
                              #{score.student.chestNo}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {score.student.name}
                            </td>
                            <td className="py-3 px-3 text-slate-600 font-medium">
                              {category?.name}
                            </td>
                            <td className="py-3 px-3 font-semibold" style={{ color: team?.color }}>
                              {team?.name}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-purple-700">
                              {score.stagePoints}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-teal-700">
                              {score.offStagePoints}
                            </td>
                            <td className="py-3 px-4 text-right font-extrabold text-sm text-rose-700">
                              {score.totalPoints} pts
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
        </div>
      )}

      {/* VIEW 4: CLASS AWARDS (Matching PDF pages 12, 13) */}
      {activeSubTab === 'class-awards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Class & Special Awards</h3>
              <p className="text-xs text-slate-600">
                Manual award entry for 100% Attendance, Annual Examination, Hifz Proficiency, or Old Students.
              </p>
            </div>
            <button
              onClick={() => setIsAwardModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Class Award</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classAwards.map(award => (
              <div 
                key={award.id}
                className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                      {award.classStandard}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">
                      {award.awardType}
                    </h4>
                  </div>
                  <button
                    onClick={() => deleteClassAward(award.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

      {/* MODAL: ADD CLASS AWARD */}
      {isAwardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                + Add Class / Special Award
              </h3>
              <button 
                onClick={() => setIsAwardModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAward} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">AWARD TYPE *</label>
                <select
                  value={awardForm.awardType}
                  onChange={e => setAwardForm({ ...awardForm, awardType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                >
                  <option value="100% Attendance Proficiency">100% Attendance Proficiency</option>
                  <option value="Annual Examination Topper">Annual Examination Topper</option>
                  <option value="Hifz Al-Quran Proficiency">Hifz Al-Quran Proficiency</option>
                  <option value="Best Disciplined Student">Best Disciplined Student</option>
                  <option value="Alumni / Passed Out Special Award">Alumni / Passed Out Special Award</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">CLASS / STANDARD *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 5 or Passed Out 2025"
                  value={awardForm.classStandard}
                  onChange={e => setAwardForm({ ...awardForm, classStandard: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">🥇 1ST PLACE WINNER *</label>
                <input
                  type="text"
                  required
                  placeholder="Student Name..."
                  value={awardForm.winner1}
                  onChange={e => setAwardForm({ ...awardForm, winner1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">🥈 2ND PLACE WINNER (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="Student Name..."
                  value={awardForm.winner2}
                  onChange={e => setAwardForm({ ...awardForm, winner2: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">🥉 3RD PLACE WINNER (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="Student Name..."
                  value={awardForm.winner3}
                  onChange={e => setAwardForm({ ...awardForm, winner3: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAwardModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRINTABLE RESULT SLIP */}
      {selectedProgramForCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Official Result Slip
              </h3>
              <button 
                onClick={() => setSelectedProgramForCert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-center">
              <div className="font-bold text-sm text-indigo-900">
                {selectedProgramForCert.code} - {selectedProgramForCert.name}
              </div>
              <p className="text-xs text-slate-600">
                {categories.find(c => c.id === selectedProgramForCert.categoryId)?.name}
              </p>

              <div className="divide-y divide-slate-200 text-left pt-2 text-xs">
                {selectedProgramForCert.participants
                  .filter(pt => pt.rank)
                  .sort((a, b) => (a.rank || 99) - (b.rank || 99))
                  .map(pt => {
                    const student = students.find(s => s.id === pt.studentId);
                    const team = teams.find(t => t.id === pt.teamId);

                    return (
                      <div key={pt.studentId} className="py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-700">
                            {pt.rank === 1 ? '🥇 1st' : pt.rank === 2 ? '🥈 2nd' : '🥉 3rd'}:
                          </span>
                          <span className="font-bold text-slate-900">{student?.name}</span>
                          <span className="font-mono text-slate-600">#{pt.chestNo}</span>
                        </div>
                        <div className="font-semibold" style={{ color: team?.color }}>
                          {team?.name} ({pt.grade || 'A+'})
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
