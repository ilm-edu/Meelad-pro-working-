import React, { useState, useEffect } from 'react';
import { FestProvider, useFest } from './context/FestContext';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TeamsCategoriesView } from './components/TeamsCategoriesView';
import { CategoriesView } from './components/CategoriesView';
import { StudentsView } from './components/StudentsView';
import { ProgramsView } from './components/ProgramsView';
import { MarkEntryView } from './components/MarkEntryView';
import { ResultsView } from './components/ResultsView';
import { PrelimShortlistingView } from './components/PrelimShortlistingView';
import { ScheduleView } from './components/ScheduleView';
import { ExportsView } from './components/ExportsView';
import { SettingsFinanceView } from './components/SettingsFinanceView';
import { PublicPortalView } from './components/PublicPortalView';
import { JudgePortalView } from './components/JudgePortalView';
import { LiveDisplayModal } from './components/LiveDisplayModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileMoreSheet } from './components/MobileMoreSheet';

const FestAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const [isLiveDisplayOpen, setIsLiveDisplayOpen] = useState(false);
  const [isParentPortalMode, setIsParentPortalMode] = useState(false);
  const [isJudgePortalMode, setIsJudgePortalMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('judgePortal') === 'true' || window.location.hash === '#judge-portal') {
      setIsJudgePortalMode(true);
    }
  }, []);

  const renderActiveView = () => {
    if (isJudgePortalMode) {
      return (
        <JudgePortalView
          onBackToAdmin={() => {
            setIsJudgePortalMode(false);
            window.location.hash = '';
          }}
        />
      );
    }

    if (isParentPortalMode) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setIsParentPortalMode(false)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 app-touch-active shadow-sm"
            >
              <span>← Back to Admin Fest Portal</span>
            </button>
            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              📱 Parent & Student View
            </span>
          </div>
          <PublicPortalView />
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={(tab) => {
              if (tab === 'reports') setActiveTab('results');
              else if (tab === 'schedule') setActiveTab('schedule');
              else setActiveTab(tab as NavTab);
            }}
            onOpenLiveDisplay={() => setIsLiveDisplayOpen(true)}
          />
        );
      case 'teams':
        return <TeamsCategoriesView />;
      case 'categories':
        return <CategoriesView />;
      case 'students':
        return <StudentsView />;
      case 'programs':
        return <ProgramsView />;
      case 'mark-entry':
        return <MarkEntryView />;
      case 'results':
        return <ResultsView />;
      case 'prelims':
        return <PrelimShortlistingView />;
      case 'schedule':
        return <ScheduleView />;
      case 'exports':
        return <ExportsView />;
      case 'settings':
        return <SettingsFinanceView />;
      default:
        return <DashboardView onNavigate={(tab) => setActiveTab(tab as NavTab)} onOpenLiveDisplay={() => setIsLiveDisplayOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        onOpenLiveDisplay={() => setIsLiveDisplayOpen(true)}
        onOpenParentPortal={() => setIsParentPortalMode(prev => !prev)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar for Desktop */}
        {!isParentPortalMode && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content Area with mobile bottom padding to clear the bottom nav bar */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full custom-scrollbar pb-24 lg:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMoreSheet={() => setIsMoreSheetOpen(true)}
        isParentPortalMode={isParentPortalMode}
      />

      {/* Mobile More Sheet / Native Action Drawer */}
      <MobileMoreSheet
        isOpen={isMoreSheetOpen}
        onClose={() => setIsMoreSheetOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLiveDisplay={() => setIsLiveDisplayOpen(true)}
        onOpenParentPortal={() => setIsParentPortalMode(true)}
      />

      {/* Projector / TV Fullscreen Live Display Modal */}
      <LiveDisplayModal
        isOpen={isLiveDisplayOpen}
        onClose={() => setIsLiveDisplayOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FestProvider>
      <FestAppContent />
    </FestProvider>
  );
}

