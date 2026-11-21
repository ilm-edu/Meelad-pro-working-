import React from 'react';
import { 
  LayoutDashboard, BookOpen, PenTool, Trophy, 
  Menu, Sparkles, Filter, Users2, UserCheck, CalendarDays, 
  FileDown, Settings, Monitor, Users
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { useFest } from '../context/FestContext';

interface MobileBottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenMoreSheet: () => void;
  isParentPortalMode: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMoreSheet,
  isParentPortalMode
}) => {
  const { programs } = useFest();

  if (isParentPortalMode) return null;

  const evaluatedCount = programs.filter(p => p.status === 'Evaluated').length;

  const tabs: {
    id: NavTab | 'more';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'mark-entry', label: 'Mark Entry', icon: PenTool },
    { 
      id: 'results', 
      label: 'Results', 
      icon: Trophy, 
      badge: evaluatedCount > 0 ? evaluatedCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950'
    },
    { id: 'more', label: 'More', icon: Menu }
  ];

  return (
    <nav 
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-400 pb-safe shadow-2xl"
    >
      <div className="grid grid-cols-5 items-center justify-around px-1 py-1.5 max-w-lg mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isMore = tab.id === 'more';
          const isSelected = !isMore && activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => {
                if (isMore) {
                  onOpenMoreSheet();
                } else {
                  setActiveTab(tab.id as NavTab);
                }
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 app-touch-active ${
                isSelected 
                  ? 'text-indigo-400 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Pill */}
              <div className="relative">
                <div 
                  className={`p-1.5 rounded-2xl transition-all duration-200 ${
                    isSelected 
                      ? 'bg-indigo-600/30 text-indigo-400 ring-1 ring-indigo-500/50 shadow-xs' 
                      : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {tab.badge !== undefined && (
                  <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-black rounded-full shadow-xs ${
                    tab.badgeColor || 'bg-indigo-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] tracking-tight mt-0.5 leading-none ${
                isSelected ? 'font-black text-indigo-300' : 'font-medium'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
