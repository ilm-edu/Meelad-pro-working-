import React from 'react';
import { 
  LayoutDashboard, Users2, UserCheck, BookOpen, PenTool, 
  Trophy, Filter, CalendarDays, FileDown, Settings, 
  Sparkles, X, ChevronRight, RefreshCw, Smartphone, Layers
} from 'lucide-react';
import { useFest } from '../context/FestContext';

export type NavTab = 
  | 'dashboard'
  | 'teams'
  | 'categories'
  | 'students'
  | 'programs'
  | 'mark-entry'
  | 'results'
  | 'prelims'
  | 'schedule'
  | 'exports'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose
}) => {
  const { programs, students, categories, resetToSampleData } = useFest();

  const evaluatedCount = programs.filter(p => p.status === 'Evaluated').length;
  const prelimsCount = programs.filter(p => p.hasPrelimRound).length;

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'teams', label: 'Teams Management', icon: Users2 },
    { id: 'categories', label: 'Categories & Classes', icon: Layers, badge: categories.length },
    { id: 'students', label: 'Student Directory', icon: UserCheck, badge: students.length },
    { id: 'programs', label: 'Manage Programs', icon: BookOpen, badge: programs.length },
    { id: 'mark-entry', label: 'Mark Entry & Judges', icon: PenTool },
    { 
      id: 'results', 
      label: 'Results & Smart Publisher', 
      icon: Trophy, 
      badge: evaluatedCount > 0 ? `${evaluatedCount} Ready` : undefined, 
      badgeColor: 'bg-amber-500 text-slate-900' 
    },
    { 
      id: 'prelims', 
      label: 'Prelim Screening Hub', 
      icon: Filter, 
      badge: prelimsCount > 0 ? `${prelimsCount} Events` : undefined,
      badgeColor: 'bg-indigo-500 text-white' 
    },
    { id: 'schedule', label: 'Schedule Management', icon: CalendarDays },
    { id: 'exports', label: 'Event Exports & Badges', icon: FileDown },
    { id: 'settings', label: 'Settings & Finance', icon: Settings },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header (Mobile) */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2 text-white font-bold">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-sm">
              ✨
            </span>
            <span>Fest Control Portal</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Main Management
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badgeColor || (isActive ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-400')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 space-y-2">
          <button
            id="reset-sample-data-btn"
            onClick={() => {
              if (window.confirm("Reset all festival records to default rich sample data?")) {
                resetToSampleData();
              }
            }}
            className="w-full px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 border border-slate-700/60 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reload Sample Fest Data</span>
          </button>
          
          <div className="text-[11px] text-center text-slate-300 flex items-center justify-center gap-1.5 py-1">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>99% Mobile-First Responsive</span>
          </div>
        </div>
      </aside>
    </>
  );
};
