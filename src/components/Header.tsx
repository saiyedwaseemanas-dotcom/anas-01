import React, { useState } from 'react';
import { ASSETS, NOTIFICATIONS } from '../data/mockData';
import { NavigationTab } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  userRole: string;
  setUserRole: (role: string) => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
  onNavigate?: (tab: NavigationTab) => void;
  onShowToast?: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  userRole,
  setUserRole,
  onOpenNotifications,
  unreadCount = 2,
  onNavigate,
  onShowToast,
}) => {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const getSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Campus Overview';
      case 'attendance':
        return 'Attendance Register';
      case 'syllabus':
        return 'Curriculum Tracker';
      case 'marks-exams':
        return 'Marks & Exams';
      case 'more':
        return 'Administration';
      default:
        return 'Campus';
    }
  };

  const handleBellClick = () => {
    if (onOpenNotifications) {
      onOpenNotifications();
    } else {
      setIsNotificationsOpen(!isNotificationsOpen);
    }
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between gap-2">
        {/* Left: Brand Identity */}
        <div
          className="flex items-center gap-2.5 min-w-0 cursor-pointer"
          onClick={() => onNavigate && onNavigate('dashboard')}
        >
          <img
            alt="EduTrack Pro Logo"
            className="h-8 w-auto object-contain flex-shrink-0"
            src={ASSETS.logo}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-[16px] font-bold text-on-surface tracking-tight truncate leading-tight">
              EduTrack Pro
            </span>
            <span className="font-label-sm text-[11px] text-on-surface-variant font-medium truncate">
              {getSubtitle()}
            </span>
          </div>
        </div>

        {/* Right: Role Pill, Notifications, Profile Avatar */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Admin Role Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
              className="h-7 min-w-[44px] px-2.5 rounded-full bg-surface-container-high text-primary flex items-center gap-1.5 font-label-md text-[12px] font-semibold hover:bg-surface-container-highest transition-colors focus:outline-none"
              type="button"
              id="admin-role-toggle"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
              <span>{userRole}</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>

            {isAdminMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xl z-50 py-1 flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1.5 border-b border-outline-variant/20 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Active Access View
                </div>
                {(['Admin', 'Educator', 'Principal'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setUserRole(role);
                      setIsAdminMenuOpen(false);
                      if (onShowToast) onShowToast(`Switched view to ${role} Portal`);
                    }}
                    className={`px-3 py-2 text-left text-[12px] font-medium transition-colors flex items-center justify-between ${
                      userRole === role
                        ? 'bg-surface-container text-primary font-bold'
                        : 'text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <span>{role} Portal</span>
                    {userRole === role && (
                      <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={handleBellClick}
              aria-label="Notifications"
              className="w-10 h-10 relative flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none"
              type="button"
              id="notifications-btn"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-1.5 w-72 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-2xl z-50 p-3 flex flex-col gap-2.5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[13px] text-on-surface">Campus Alerts</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">
                      {unreadCount} New
                    </span>
                  </div>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-on-surface-variant hover:text-on-surface text-[11px]"
                  >
                    Close
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {NOTIFICATIONS.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-lg bg-surface-container-low flex flex-col gap-0.5 border border-outline-variant/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-on-surface">{item.title}</span>
                        <span className="text-[10px] text-on-surface-variant">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-tight">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    if (onShowToast) onShowToast('All notifications marked as read');
                  }}
                  className="w-full py-1.5 rounded-lg bg-surface-container text-primary font-bold text-[11px] hover:bg-surface-container-high transition-colors text-center"
                >
                  Mark All Read
                </button>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95 transition-all"
              type="button"
              id="profile-avatar-btn"
            >
              <img
                alt="Principal Michael Davies Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/50"
                src={ASSETS.principalAvatar}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xl z-50 p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/20">
                  <img
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                    src={ASSETS.principalAvatar}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-headline-sm text-[13px] font-bold text-on-surface truncate">
                      Principal M. Davies
                    </span>
                    <span className="text-[11px] text-on-surface-variant truncate">
                      davies@edutrack.academy
                    </span>
                  </div>
                </div>

                <div className="flex flex-col text-[12px] text-on-surface gap-1">
                  <div className="flex items-center justify-between text-on-surface-variant text-[11px] py-1">
                    <span>CBSE Affiliation:</span>
                    <span className="font-semibold text-primary">#930219</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant text-[11px] py-1">
                    <span>Academic Term:</span>
                    <span className="font-semibold text-on-surface">2024-25 (Term 1)</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full mt-1 py-1.5 rounded-lg bg-surface-container text-primary font-label-sm text-[11px] font-semibold text-center hover:bg-surface-container-high transition-colors"
                >
                  Close Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
