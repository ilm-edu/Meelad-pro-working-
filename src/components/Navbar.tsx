import React from 'react';
import { useFest } from '../context/FestContext';
import { Menu, Trophy, Users, Monitor, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { GenderViewFilter } from '../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenLiveDisplay: () => void;
  onOpenParentPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenLiveDisplay,
  onOpenParentPortal
}) => {
  const { eventInfo, genderFilter, setGenderFilter } = useFest();

  const genderOptions: { id: GenderViewFilter; label: string; icon: string; activeClass: string }[] = [
    { id: 'All', label: 'Combined', icon: '🏆', activeClass: 'bg-indigo-600 text-white shadow-sm' },
    { id: 'Male', label: 'Boys', icon: '👦', activeClass: 'bg-emerald-600 text-white shadow-sm' },
    { id: 'Female', label: 'Girls', icon: '👧', activeClass: 'bg-rose-600 text-white shadow-sm' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md pt-safe">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Left: Mobile Drawer Trigger / Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="mobile-menu-btn"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 lg:hidden transition-colors app-touch-active"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-amber-400/20 shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <h1 className="font-black text-xs sm:text-base tracking-tight truncate max-w-[130px] xs:max-w-[160px] sm:max-w-[280px]">
                  {eventInfo.eventName}
                </h1>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[260px]">
                {eventInfo.madrasaName}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Gender Segregation Switch Pill */}
        <div className="flex items-center bg-slate-800/90 p-0.5 sm:p-1 rounded-xl border border-slate-700/80 shadow-inner">
          {genderOptions.map(opt => (
            <button
              key={opt.id}
              id={`gender-filter-${opt.id.toLowerCase()}`}
              onClick={() => setGenderFilter(opt.id)}
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all duration-150 app-touch-active ${
                genderFilter === opt.id
                  ? opt.activeClass
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span className="text-xs">{opt.icon}</span>
              <span className="hidden xs:inline sm:inline">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Quick Portals */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            id="parent-portal-btn"
            onClick={onOpenParentPortal}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm app-touch-active"
            title="Open Parent / Student Public Portal"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Parent View</span>
          </button>

          <button
            id="live-screen-btn"
            onClick={onOpenLiveDisplay}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm app-touch-active"
            title="Open Fullscreen TV / Projector Display"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Live Scoreboard</span>
          </button>
        </div>
      </div>
    </header>
  );
};

