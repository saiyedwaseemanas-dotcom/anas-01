import React from 'react';
import { NavigationTab } from '../types';

interface BottomNavProps {
  activeTab: NavigationTab;
  onChangeTab: (tab: NavigationTab) => void;
  attendanceAlertCount?: number;
  syllabusAlertCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  attendanceAlertCount = 2,
  syllabusAlertCount = 2,
}) => {
  const tabs = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Home',
      icon: 'home',
    },
    {
      id: 'attendance' as NavigationTab,
      label: 'Attendance',
      icon: 'checklist',
      badge: attendanceAlertCount > 0 ? attendanceAlertCount : undefined,
    },
    {
      id: 'syllabus' as NavigationTab,
      label: 'Syllabus',
      icon: 'auto_stories',
      badge: syllabusAlertCount > 0 ? syllabusAlertCount : undefined,
    },
    {
      id: 'marks-exams' as NavigationTab,
      label: 'Exams',
      icon: 'analytics',
    },
    {
      id: 'more' as NavigationTab,
      label: 'More',
      icon: 'menu_open',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 w-full z-40 pb-safe bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-1px_8px_rgba(0,0,0,0.04)]"
      id="bottom-navigation-bar"
    >
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-[44px] gap-0.5 relative transition-all duration-150 focus:outline-none ${
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
              id={`nav-tab-${tab.id}`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform ${
                    isActive ? 'scale-110' : ''
                  }`}
                >
                  {tab.icon}
                </span>
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full bg-error text-on-error text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`font-label-sm text-[11px] tracking-tight ${
                  isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-primary rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
