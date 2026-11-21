import React, { useState } from 'react';
import { useFest } from '../context/FestContext';
import { 
  Users, BookOpen, Trophy, Award, Layers, Scale, 
  Share2, Copy, Check, ExternalLink, Sparkles, 
  ArrowUpRight, BarChart3, PieChart, ShieldCheck, 
  Smartphone, Filter, Flame
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenLiveDisplay: () => void;
  onOpenParentPortal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenLiveDisplay,
  onOpenParentPortal
}) => {
  const { 
    students, programs, teams, categories, judges, 
    genderFilter, setGenderFilter, getTeamScores,
    getSmartPublishRecommendations
  } = useFest();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDisplay, setCopiedDisplay] = useState(false);

  // Filter calculations
  const filteredStudents = students.filter(s => {
    if (genderFilter === 'All') return true;
    return s.gender === genderFilter;
  });

  const maleStudents = students.filter(s => s.gender === 'Male').length;
  const femaleStudents = students.filter(s => s.gender === 'Female').length;

  const stagePrograms = programs.filter(p => p.location === 'Stage').length;
  const offStagePrograms = programs.filter(p => p.location === 'Off Stage').length;
  const generalPrograms = programs.filter(p => p.type === 'General').length;

  const teamScores = getTeamScores();
  const smartRecommendations = getSmartPublishRecommendations();

  // Team participant counts
  const teamParticipantMap = teams.map(team => {
    const count = students.filter(s => s.teamId === team.id && (genderFilter === 'All' || s.gender === genderFilter)).length;
    return { team, count };
  });
  const maxParticipants = Math.max(...teamParticipantMap.map(t => t.count), 1);

  // Category counts
  const categoryStats = categories.map(cat => {
    const count = students.filter(s => s.categoryId === cat.id).length;
    return { cat, count };
  }).filter(c => c.count > 0);

  const handleCopyPortalLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyDisplayLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedDisplay(true);
    setTimeout(() => setCopiedDisplay(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🏆 *Melad Fest Live Standings & Results*\nCheck out the live scores, schedule and winner announcements here: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const rankMedal = (idx: number) => {
    if (idx === 0) return { label: 'GOLD', bg: 'bg-amber-100 text-amber-800 border-amber-300', icon: '🥇' };
    if (idx === 1) return { label: 'SILVER', bg: 'bg-slate-100 text-slate-700 border-slate-300', icon: '🥈' };
    if (idx === 2) return { label: 'BRONZE', bg: 'bg-amber-900/10 text-amber-900 border-amber-600/30', icon: '🥉' };
    return { label: `#${idx + 1}`, bg: 'bg-slate-50 text-slate-600 border-slate-200', icon: '🏅' };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Alert if Smart Publishing has pending programs */}
      {smartRecommendations.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm animate-pulse">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  {smartRecommendations.length} Evaluated Programs Ready to Publish!
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                  Smart Balance Available
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Use our Smart Result Publisher to release scores in a thrilling, balanced sequence that keeps parents & students on their toes!
              </p>
            </div>
          </div>
          <button
            id="smart-publish-banner-btn"
            onClick={() => onNavigate('results')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shrink-0 transition-colors shadow-sm"
          >
            <span>Open Smart Publisher</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
        {/* Metric 1: Students */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group app-touch-active"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-bold mb-1">
            <span>STUDENTS</span>
            <Users className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {filteredStudents.length}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-600 mt-1 flex items-center gap-1">
            <span>B: <strong className="text-slate-800">{maleStudents}</strong></span>
            <span>•</span>
            <span>G: <strong className="text-slate-800">{femaleStudents}</strong></span>
          </div>
        </div>

        {/* Metric 2: Programs */}
        <div 
          onClick={() => onNavigate('programs')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group app-touch-active"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-bold mb-1">
            <span>PROGRAMS</span>
            <BookOpen className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {programs.length}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-600 mt-1 truncate">
            Stage: {stagePrograms} | Off: {offStagePrograms}
          </div>
        </div>

        {/* Metric 3: Teams */}
        <div 
          onClick={() => onNavigate('teams')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group app-touch-active"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-bold mb-1">
            <span>TEAMS</span>
            <Trophy className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {teams.length}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-600 mt-1">
            House divisions
          </div>
        </div>

        {/* Metric 4: Categories */}
        <div 
          onClick={() => onNavigate('teams')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group app-touch-active"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-bold mb-1">
            <span>CATEGORIES</span>
            <Layers className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {categories.length}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-600 mt-1">
            Age groups
          </div>
        </div>

        {/* Metric 5: Judges */}
        <div 
          onClick={() => onNavigate('mark-entry')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group col-span-2 sm:col-span-1 app-touch-active"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-bold mb-1">
            <span>JUDGES</span>
            <Scale className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {judges.length}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-600 mt-1">
            Panel evaluators
          </div>
        </div>
      </div>

      {/* Participants by Team and Category Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Participants by Team */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Participants By Team</h3>
            </div>
            <span className="text-xs text-slate-600 font-medium">
              View: <strong className="text-slate-800">{genderFilter === 'All' ? 'Combined' : genderFilter === 'Male' ? 'Boys' : 'Girls'}</strong>
            </span>
          </div>

          <div className="h-48 flex items-end justify-around gap-4 pt-6 px-4 border-b border-slate-100">
            {teamParticipantMap.map(({ team, count }) => {
              const heightPercent = Math.max(Math.round((count / maxParticipants) * 100), 12);
              return (
                <div key={team.id} className="flex flex-col items-center gap-2 flex-1 max-w-[90px] group">
                  <div className="text-xs font-bold text-slate-700">
                    {count}
                  </div>
                  <div 
                    className="w-full rounded-t-xl transition-all duration-500 relative group-hover:brightness-110 shadow-sm"
                    style={{ 
                      height: `${heightPercent}%`,
                      backgroundColor: team.color
                    }}
                  >
                    <div className="absolute inset-x-0 top-1 text-center text-[10px] font-bold text-white/90">
                      {count}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 truncate w-full text-center">
                    {team.name.split(' ')[0]} {team.name.split(' ')[1]}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-600 text-center">
            Even distribution of students registered across competing houses.
          </p>
        </div>

        {/* Chart 2: Participants by Category Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Participants By Category</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
              Total {filteredStudents.length} Students
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {categoryStats.map(({ cat, count }) => (
              <div 
                key={cat.id} 
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 flex flex-col justify-between"
              >
                <div className="text-[11px] font-semibold text-slate-700 truncate">
                  {cat.name}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                    cat.gender === 'Male' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {cat.gender === 'Male' ? 'Boys' : 'Girls'}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-600 text-center">
            Classes divided systematically into standard Madrasa age groups.
          </p>
        </div>
      </div>

      {/* Team Leaderboard Section (Matching PDF page 2) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Team Leaderboard</h3>
            </div>
            <p className="text-xs text-slate-600">
              Standings aggregated from published results ({genderFilter === 'All' ? 'Combined Boys & Girls' : genderFilter === 'Male' ? 'Boys Division Only' : 'Girls Division Only'}).
            </p>
          </div>

          {/* Quick Gender Pill within Leaderboard */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs">
            <button
              onClick={() => setGenderFilter('All')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                genderFilter === 'All' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Combined
            </button>
            <button
              onClick={() => setGenderFilter('Male')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                genderFilter === 'Male' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Boys Fest
            </button>
            <button
              onClick={() => setGenderFilter('Female')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                genderFilter === 'Female' ? 'bg-rose-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Girls Fest
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">RANK</th>
                <th className="py-2.5 px-3">TEAM NAME</th>
                <th className="py-2.5 px-3 text-center">1ST PLACE</th>
                <th className="py-2.5 px-3 text-center">2ND PLACE</th>
                <th className="py-2.5 px-3 text-center">3RD PLACE</th>
                <th className="py-2.5 px-3 text-center">A+ GRADES</th>
                <th className="py-2.5 px-3 text-right">TOTAL POINTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamScores.map((score, idx) => {
                const medal = rankMedal(idx);
                return (
                  <tr key={score.team.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-bold ${medal.bg}`}>
                        <span>{medal.icon}</span>
                        <span>{medal.label}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" 
                          style={{ backgroundColor: score.team.color }} 
                        />
                        <span className="font-bold text-slate-900 text-sm">
                          {score.team.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {score.firstCount}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {score.secondCount}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {score.thirdCount}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-amber-600">
                      {score.aPlusCount}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-base font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                        {score.totalPoints} pts
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Portals Cards (Public Portal & Live Screen) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Public Result Portal */}
        <div className="bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-transparent p-5 rounded-2xl border border-cyan-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-cyan-900 font-bold text-sm">
            <Share2 className="w-4 h-4 text-cyan-600" />
            <span>Public Result Portal</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Share published standings instantly with parents and students. Auto-syncs in real-time with responsive mobile layout and chest number search.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              id="copy-portal-link-btn"
              onClick={handleCopyPortalLink}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              id="whatsapp-share-btn"
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>WhatsApp Share</span>
            </button>

            <button
              id="open-portal-btn"
              onClick={onOpenParentPortal}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Open Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Live Championship Display */}
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Live Championship Display</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Show live championship standings on TV, LED Screen, and Projector stage displays with animated podiums, confetti reveals, and live ticker.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              id="copy-display-link-btn"
              onClick={handleCopyDisplayLink}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedDisplay ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDisplay ? 'Link Copied!' : 'Copy Display Link'}</span>
            </button>

            <button
              id="open-live-display-btn"
              onClick={onOpenLiveDisplay}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Open Live Display</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
