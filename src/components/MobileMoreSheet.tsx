import React from 'react';
import { 
  Users2, UserCheck, Filter, CalendarDays, FileDown, 
  Settings, Monitor, Users, RefreshCw, X, ChevronRight,
  Trophy, Sparkles, Smartphone, ShieldCheck, Heart
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { useFest } from '../context/FestContext';

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenLiveDisplay: () => void;
  onOpenParentPortal: () => void;
}

export const MobileMoreSheet: React.FC<MobileMoreSheetProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenLiveDisplay,
  onOpenParentPortal
}) => {
  const { students, programs, categories, teams, resetToSampleData } = useFest();

  if (!isOpen) return null;

  const prelimsCount = programs.filter(p => p.hasPrelimRound).length;

  const menuSections = [
    {
      title: 'Management Modules',
      items: [
        { 
          id: 'students' as NavTab, 
          label: 'Student Directory', 
          desc: 'Manage participants, class & chest numbers',
          icon: UserCheck, 
          badge: `${students.length} Students`,
          color: 'text-emerald-400 bg-emerald-500/10'
        },
        { 
          id: 'teams' as NavTab, 
          label: 'Teams & Categories', 
          desc: 'House teams, colors & class groups',
          icon: Users2, 
          badge: `${teams.length} Teams`,
          color: 'text-indigo-400 bg-indigo-500/10'
        },
        { 
          id: 'prelims' as NavTab, 
          label: 'Prelim Screening Hub', 
          desc: 'Audition rounds & finalist shortlisting',
          icon: Filter, 
          badge: prelimsCount > 0 ? `${prelimsCount} Events` : undefined,
          color: 'text-amber-400 bg-amber-500/10'
        },
        { 
          id: 'schedule' as NavTab, 
          label: 'Stage Schedule & Venues', 
          desc: 'Timeline and venue management',
          icon: CalendarDays, 
          color: 'text-cyan-400 bg-cyan-500/10'
        },
        { 
          id: 'exports' as NavTab, 
          label: 'Event Badges & Score Sheets', 
          desc: 'Printable chest badges and mark sheets',
          icon: FileDown, 
          color: 'text-violet-400 bg-violet-500/10'
        },
        { 
          id: 'settings' as NavTab, 
          label: 'Settings & Finance Ledger', 
          desc: 'Point rules, sound, stage & food expense ledger',
          icon: Settings, 
          color: 'text-rose-400 bg-rose-500/10'
        },
      ]
    }
  ];

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Sheet Container */}
      <div 
        className="relative z-10 bg-slate-900 border-t border-slate-800 rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden pb-safe animate-in slide-in-from-bottom duration-200"
      >
        {/* Drag Handle Bar */}
        <div className="pt-3 pb-2 flex flex-col items-center cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-slate-700 rounded-full mb-1" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              ✨
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">More Modules & Tools</h3>
              <p className="text-[11px] text-slate-400">Fest Management Portal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Launch Cards (Parent Portal & Live Screen) */}
        <div className="p-4 grid grid-cols-2 gap-2.5 bg-slate-950/50 border-b border-slate-800">
          <button
            onClick={() => {
              onClose();
              onOpenParentPortal();
            }}
            className="p-3 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-indigo-700/50 text-left space-y-1.5 app-touch-active shadow-md"
          >
            <div className="flex items-center justify-between">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Public</span>
            </div>
            <div className="font-black text-xs text-white">Parent Portal</div>
            <div className="text-[10px] text-slate-400 line-clamp-1">Mobile lookup for scores & badges</div>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenLiveDisplay();
            }}
            className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-600/50 text-left space-y-1.5 app-touch-active shadow-md"
          >
            <div className="flex items-center justify-between">
              <Monitor className="w-5 h-5 text-amber-400" />
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">TV Mode</span>
            </div>
            <div className="font-black text-xs text-white">Stage Scoreboard</div>
            <div className="text-[10px] text-slate-400 line-clamp-1">Fullscreen live projector display</div>
          </button>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                {section.title}
              </div>

              <div className="space-y-1">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isCurrent = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all app-touch-active ${
                        isCurrent
                          ? 'bg-indigo-600 text-white font-bold shadow-md'
                          : 'bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-700/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isCurrent ? 'bg-white/20 text-white' : item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-white">{item.label}</div>
                          <div className={`text-[10px] ${isCurrent ? 'text-indigo-100' : 'text-slate-400'}`}>
                            {item.desc}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCurrent ? 'bg-indigo-900 text-white' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Reload Demo Data Option */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (window.confirm("Reload default sample festival records?")) {
                  resetToSampleData();
                  onClose();
                }
              }}
              className="w-full p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/30 flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset & Reload Sample Fest Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
