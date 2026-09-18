import React, { useState } from 'react';
import { ASSETS, DEFAULTERS_LIST } from '../data/mockData';
import { NavigationTab } from '../types';

interface DashboardScreenProps {
  onNavigate: (tab: NavigationTab) => void;
  onSyncSheets: () => void;
  onOpenPendingDrawer: () => void;
  onShowToast: (msg: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onSyncSheets,
  onOpenPendingDrawer,
  onShowToast,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('Thu');
  const [showAllDefaulters, setShowAllDefaulters] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncClick = () => {
    setIsSyncing(true);
    onSyncSheets();
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const handleWhatsAppChat = (studentName: string, phone: string = '') => {
    const text = encodeURIComponent(`Hello, regarding student ${studentName}'s attendance at EduTrack Academy...`);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    onShowToast(`Opening WhatsApp chat for ${studentName}`);
  };

  const attendanceDays = [
    { day: 'Mon', pct: 93, height: '72%' },
    { day: 'Tue', pct: 95, height: '80%' },
    { day: 'Wed', pct: 91, height: '64%' },
    { day: 'Thu', pct: 96, height: '88%', isPeak: true },
    { day: 'Fri', pct: 94, height: '76%' },
  ];

  return (
    <div className="flex flex-col w-full px-4 pb-24 gap-4 animate-in fade-in duration-200">
      {/* Top Greeting & Live Cloud Sync Status */}
      <div className="flex flex-col gap-1 mt-2">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-[11px] text-on-surface-variant font-medium tracking-wide">
            Monday, Oct 24, 2024
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold">
              Sheets Live
            </span>
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <h1 className="font-headline-lg-mobile text-[22px] font-bold text-on-surface tracking-tight">
            Good Morning, <span className="text-primary">Principal Davies</span>
          </h1>
        </div>
        <p className="font-body-sm text-[13px] text-on-surface-variant">
          Here is today's real-time campus summary and faculty activity.
        </p>
      </div>

      {/* Quick Action Pill Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        <button
          onClick={() => onNavigate('attendance')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-[12px] font-semibold whitespace-nowrap shadow-sm active:scale-95 transition-all flex-shrink-0"
          type="button"
          id="quick-mark-attendance"
        >
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>Mark Attendance</span>
        </button>

        <button
          onClick={() => onNavigate('syllabus')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-label-md text-[12px] font-medium whitespace-nowrap shadow-sm hover:bg-surface-container-low active:scale-95 transition-all flex-shrink-0"
          type="button"
          id="quick-add-chapter"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">bookmark_add</span>
          <span>Add Chapter</span>
        </button>

        <button
          onClick={() => onNavigate('marks-exams')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-label-md text-[12px] font-medium whitespace-nowrap shadow-sm hover:bg-surface-container-low active:scale-95 transition-all flex-shrink-0"
          type="button"
          id="quick-enter-marks"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">edit_note</span>
          <span>Enter Marks</span>
        </button>

        <button
          onClick={handleSyncClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-[12px] font-semibold whitespace-nowrap shadow-sm active:scale-95 transition-all flex-shrink-0"
          type="button"
          id="sync-sheet-btn"
        >
          <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>
            sync
          </span>
          <span>{isSyncing ? 'Syncing...' : 'Sync Sheets'}</span>
        </button>
      </div>

      {/* Critical Pacing Warning Alert */}
      <div className="w-full bg-error-container text-on-error-container p-3.5 rounded-xl shadow-sm flex items-start gap-3 relative overflow-hidden border border-error/20">
        <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center flex-shrink-0 text-error shadow-sm mt-0.5">
          <span className="material-symbols-outlined text-[20px]">warning</span>
        </div>
        <div className="flex flex-col flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1">
            <span className="font-label-lg text-[13px] font-bold">2 Subjects Behind Pace</span>
            <span className="font-label-sm text-[10px] bg-error text-on-error px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
              14D LEFT
            </span>
          </div>
          <p className="font-body-sm text-[12px] text-on-error-container/90 mt-1 line-clamp-2 leading-relaxed">
            <span className="font-semibold text-on-error-container">Class 10-A Science</span> &amp;{' '}
            <span className="font-semibold text-on-error-container">Class 9-A History</span> fall
            short of the 80% syllabus benchmark.
          </p>
          <button
            onClick={onOpenPendingDrawer}
            className="mt-2 flex items-center gap-1 text-error font-label-md text-[12px] font-bold cursor-pointer active:opacity-75 text-left"
            type="button"
          >
            <span>Review pending topic milestones</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 4 Key Metric Cards (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {/* Total Students */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <span className="font-label-sm text-[11px] px-1.5 py-0.5 rounded-full bg-surface-container text-primary font-bold">
              +12
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-[20px] text-on-surface font-bold tracking-tight">
              1,240
            </span>
            <span className="font-label-md text-[12px] text-on-surface-variant font-medium">
              Total Students
            </span>
            <span className="font-label-sm text-[11px] text-primary font-medium mt-0.5 truncate">
              Term growth pace
            </span>
          </div>
        </div>

        {/* Active Teachers */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-tertiary"></span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-[20px] text-on-surface font-bold tracking-tight">
              48
            </span>
            <span className="font-label-md text-[12px] text-on-surface-variant font-medium">
              Active Teachers
            </span>
            <span className="font-label-sm text-[11px] text-tertiary font-medium mt-0.5 truncate">
              100% Present today
            </span>
          </div>
        </div>

        {/* Today Attendance */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
            </div>
            <span className="font-label-sm text-[10px] text-tertiary font-bold px-1.5 py-0.5 rounded-full bg-[#ECFDF5]">
              &gt;90% Goal
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-[20px] text-on-surface font-bold tracking-tight">
              94.2%
            </span>
            <span className="font-label-md text-[12px] text-on-surface-variant font-medium">
              Today Attendance
            </span>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-tertiary h-1.5 rounded-full" style={{ width: '94.2%' }}></div>
            </div>
          </div>
        </div>

        {/* Syllabus Progress */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">auto_stories</span>
            </div>
            <span className="font-label-sm text-[10px] text-on-surface-variant font-semibold px-1.5 py-0.5 rounded-full bg-surface-container">
              Avg
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-[20px] text-on-surface font-bold tracking-tight">
              68.5%
            </span>
            <span className="font-label-md text-[12px] text-on-surface-variant font-medium">
              Syllabus Covered
            </span>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: '68.5%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual 1: 7-Day Attendance Trend */}
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-headline-sm text-[15px] font-bold text-on-surface">
              Weekly Attendance Trend
            </span>
            <span className="font-label-sm text-[11px] text-on-surface-variant">
              Classroom check-in stability
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold">
              Avg 93.8%
            </span>
          </div>
        </div>

        {/* Attendance Columns Graphic */}
        <div className="w-full pt-4 pb-1">
          <div className="relative h-40 w-full flex items-end justify-between px-2">
            {/* Grid horizontal guide lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full h-px bg-outline-variant"></div>
              <div className="w-full h-px bg-outline-variant"></div>
              <div className="w-full h-px bg-outline-variant"></div>
              <div className="w-full h-px bg-outline-variant"></div>
            </div>

            {attendanceDays.map((item) => {
              const isSelected = selectedDay === item.day;
              return (
                <div
                  key={item.day}
                  onClick={() => setSelectedDay(item.day)}
                  className="relative flex flex-col items-center h-full justify-end z-10 cursor-pointer group w-11"
                >
                  {item.isPeak && (
                    <div className="absolute -top-4 flex items-center gap-0.5 bg-primary text-on-primary px-1.5 py-0.5 rounded-full font-label-sm text-[10px] shadow-sm">
                      <span className="material-symbols-outlined text-[11px]">trending_up</span>
                      <span className="font-bold">Peak</span>
                    </div>
                  )}
                  <div
                    className={`font-label-sm text-[11px] mb-1 font-bold transition-colors ${
                      item.isPeak || isSelected
                        ? 'text-primary'
                        : 'text-on-surface-variant group-hover:text-on-surface'
                    }`}
                  >
                    {item.pct}%
                  </div>
                  <div
                    className={`w-7 rounded-t-lg transition-all duration-300 ${
                      item.isPeak || isSelected
                        ? 'bg-primary shadow-sm'
                        : 'bg-surface-container group-hover:bg-primary/60'
                    }`}
                    style={{ height: item.height }}
                  ></div>
                  <span
                    className={`font-label-sm text-[11px] mt-2 transition-colors ${
                      item.isPeak || isSelected
                        ? 'text-primary font-bold'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
          <span className="font-body-sm text-[12px] text-on-surface-variant">
            Campus benchmark is 90.0%
          </span>
          <button
            onClick={() => onNavigate('attendance')}
            className="text-primary font-label-md text-[12px] font-semibold flex items-center gap-0.5 hover:underline"
            type="button"
          >
            <span>Detailed View</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Interactive Visual 2: Syllabus Progress Breakdown by Class */}
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-3.5 w-full">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-headline-sm text-[15px] font-bold text-on-surface">
              Curriculum Completion
            </span>
            <span className="font-label-sm text-[11px] text-on-surface-variant">
              Term 2 Progress vs 70% Target
            </span>
          </div>
          <span className="font-label-sm text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold">
            Midterm Ready
          </span>
        </div>

        {/* Class Progress Items */}
        <div className="flex flex-col gap-3">
          {/* Class 10-A */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-label-md text-[13px] text-on-surface font-semibold">
                  Class 10-A
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant">42 Students</span>
              </div>
              <span className="font-label-md text-[13px] font-bold text-primary">72%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: '72%' }}
              ></div>
            </div>
          </div>

          {/* Class 10-B */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-label-md text-[13px] text-on-surface font-semibold">
                  Class 10-B
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant">39 Students</span>
              </div>
              <span className="font-label-md text-[13px] font-bold text-on-surface">65%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
              <div
                className="bg-secondary h-2 rounded-full transition-all duration-500"
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>

          {/* Class 9-A (Critical Alert) */}
          <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-surface-container-low border border-error/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-label-md text-[13px] text-on-surface font-semibold">
                  Class 9-A
                </span>
                <span className="font-label-sm text-[10px] px-1.5 py-0.5 rounded-full bg-error-container text-on-error-container font-bold">
                  Lagging Target
                </span>
              </div>
              <span className="font-label-md text-[13px] font-bold text-error">58%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
              <div
                className="bg-error h-2 rounded-full transition-all duration-500"
                style={{ width: '58%' }}
              ></div>
            </div>
          </div>

          {/* Class 9-B */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-label-md text-[13px] text-on-surface font-semibold">
                  Class 9-B
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant">38 Students</span>
              </div>
              <span className="font-label-md text-[13px] font-bold text-tertiary">81%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
              <div
                className="bg-tertiary h-2 rounded-full transition-all duration-500"
                style={{ width: '81%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Defaulter Alert Watchlist (<75% Attendance) */}
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-error-container text-on-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">person_alert</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-[15px] font-bold text-on-surface">
                Defaulter Watchlist
              </span>
              <span className="font-label-sm text-[11px] text-error font-semibold">
                &lt;75% Attendance Threshold
              </span>
            </div>
          </div>
          <span className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-bold">
            2 Critical
          </span>
        </div>

        {/* Student Rows */}
        <div className="flex flex-col gap-2 pt-1">
          {/* Defaulter 1: Rahul Sharma */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <img
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                src={ASSETS.rahulAvatar}
                alt="Rahul Sharma"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-[13px] font-bold text-on-surface truncate">
                  Rahul Sharma
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant">
                  Roll #14 • Class 10-A
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex flex-col items-end">
                <span className="font-label-lg text-[13px] font-bold text-error">68%</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant">8 Days Absent</span>
              </div>
              <button
                onClick={() => handleWhatsAppChat('Rahul Sharma', '+919876543210')}
                aria-label="WhatsApp Parent of Rahul Sharma"
                className="w-9 h-9 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-tertiary active:scale-95 transition-transform"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
              </button>
            </div>
          </div>

          {/* Defaulter 2: Priya Verma */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <img
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                src={ASSETS.priyaAvatar}
                alt="Priya Verma"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-[13px] font-bold text-on-surface truncate">
                  Priya Verma
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant">
                  Roll #22 • Class 9-A
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex flex-col items-end">
                <span className="font-label-lg text-[13px] font-bold text-error">71%</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant">6 Days Absent</span>
              </div>
              <button
                onClick={() => handleWhatsAppChat('Priya Verma', '+919876543211')}
                aria-label="WhatsApp Parent of Priya Verma"
                className="w-9 h-9 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-tertiary active:scale-95 transition-transform"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAllDefaulters(true)}
          className="w-full mt-1 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-[12px] font-semibold text-center flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors"
          type="button"
        >
          <span>View All 7 Defaulters</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* Defaulters Modal */}
      {showAllDefaulters && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl p-4 shadow-2xl flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[22px]">person_alert</span>
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">
                  All 7 Attendance Defaulters
                </h3>
              </div>
              <button
                onClick={() => setShowAllDefaulters(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[12px] text-on-surface-variant">
              Students falling below the mandatory CBSE 75% attendance threshold. Contact parent via
              direct WhatsApp notice.
            </p>

            <div className="flex flex-col gap-2">
              {DEFAULTERS_LIST.map((student) => (
                <div
                  key={student.name}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-lg text-[13px] font-bold text-on-surface truncate">
                        {student.name}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        Roll #{student.rollNo} • {student.className}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="font-bold text-error text-[13px] block">
                        {student.attendancePct}%
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        {student.daysAbsent}d Absent
                      </span>
                    </div>
                    <button
                      onClick={() => handleWhatsAppChat(student.name, student.phone)}
                      className="w-8 h-8 rounded-full bg-surface-container-lowest text-tertiary flex items-center justify-center shadow-sm active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowAllDefaulters(false);
                onShowToast('Broadcasting attendance notice to 7 parents via WhatsApp API');
              }}
              className="w-full mt-2 py-2.5 rounded-xl bg-error text-on-error font-label-md text-[13px] font-bold shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Broadcast Notice to All 7 Parents</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
