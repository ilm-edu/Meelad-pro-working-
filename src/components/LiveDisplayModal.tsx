import React, { useState, useEffect } from 'react';
import { useFest } from '../context/FestContext';
import { 
  Trophy, Maximize2, Minimize2, X, Sparkles, 
  Flame, Volume2, Clock, Award, Star
} from 'lucide-react';
import { GenderViewFilter } from '../types';

interface LiveDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveDisplayModal: React.FC<LiveDisplayModalProps> = ({ isOpen, onClose }) => {
  const { 
    festSettings, teams, programs, stages,
    genderFilter, setGenderFilter, getTeamScores, getStudentScores 
  } = useFest();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const teamScores = getTeamScores();
  const publishedPrograms = programs.filter(p => p.status === 'Published');
  const runningPrograms = programs.filter(p => p.status === 'In Progress');

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between overflow-hidden">
      {/* Top Bar for Projector */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-indigo-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-extrabold text-xl shadow-lg">
            🏆
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              {festSettings.festName}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-300">
              {festSettings.madrassaName} • Official Stage Live Scoreboard
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Gender Filter for Screen */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            {(['All', 'Male', 'Female'] as GenderViewFilter[]).map(g => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  genderFilter === g
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g === 'All' ? 'Combined' : g === 'Male' ? 'Boys' : 'Girls'}
              </button>
            ))}
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Display Body */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center max-w-7xl mx-auto w-full space-y-6">
        {/* On Stage Live Banner if any */}
        {runningPrograms.length > 0 && (
          <div className="bg-gradient-to-r from-red-600/90 to-rose-700/90 border border-red-500 rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-2xl animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-white animate-ping" />
              <div className="text-xs sm:text-sm font-black tracking-wider uppercase text-amber-300">
                LIVE ON STAGE:
              </div>
              <div className="text-base sm:text-xl font-black text-white">
                {runningPrograms[0].code} - {runningPrograms[0].name}
              </div>
            </div>
            <div className="text-xs text-white/80 font-bold hidden sm:block">
              {stages.find(s => s.id === runningPrograms[0].stageId)?.name || 'Main Stage'}
            </div>
          </div>
        )}

        {/* Leaderboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {teamScores.map((ts, idx) => (
            <div
              key={ts.team.id}
              className={`rounded-3xl p-6 sm:p-8 border flex flex-col justify-between relative overflow-hidden transition-all duration-300 shadow-2xl ${
                idx === 0
                  ? 'bg-gradient-to-b from-slate-900 to-indigo-950 border-amber-400/80 ring-4 ring-amber-400/20'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* Leader Ribbon */}
              {idx === 0 && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-orange-500 text-slate-950 font-black text-xs px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-md">
                  👑 RANK #1 LEADER
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md"
                    style={{ backgroundColor: ts.team.color }}
                  >
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {ts.team.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      {ts.team.code} Team
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-5xl sm:text-6xl font-black tracking-tight" style={{ color: ts.team.color }}>
                    {ts.totalPoints}
                  </div>
                  <div className="text-xs text-slate-400 font-bold uppercase mt-1">
                    Total Standings Points
                  </div>
                </div>
              </div>

              {/* Stage vs Off Stage Bars */}
              <div className="pt-6 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Stage Points:</span>
                  <strong className="text-white font-bold">{ts.stagePoints} pts</strong>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${ts.totalPoints > 0 ? (ts.stagePoints / ts.totalPoints) * 100 : 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1">
                  <span>Off-Stage Points:</span>
                  <strong className="text-white font-bold">{ts.offStagePoints} pts</strong>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${ts.totalPoints > 0 ? (ts.offStagePoints / ts.totalPoints) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Live Result Marquee Ticker */}
      <div className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex items-center gap-4 text-xs">
        <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-black rounded-lg uppercase tracking-wider shrink-0">
          ⚡ LATEST RESULTS
        </span>

        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="inline-block animate-marquee space-x-8 text-slate-300 font-semibold">
            {publishedPrograms.map(p => {
              const r1 = p.participants.find(pt => pt.rank === 1);
              const t1 = teams.find(t => t.id === r1?.teamId);
              return (
                <span key={p.id} className="inline-flex items-center gap-2">
                  <span className="text-white font-bold">{p.name}:</span>
                  <span className="text-amber-400 font-extrabold">🥇 {t1?.name || 'Winner'}</span>
                  <span className="text-slate-600">•</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
