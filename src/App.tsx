/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardScreen } from './components/DashboardScreen';
import { AttendanceScreen } from './components/AttendanceScreen';
import { SyllabusScreen } from './components/SyllabusScreen';
import { ExamsScreen } from './components/ExamsScreen';
import { MoreScreen } from './components/MoreScreen';
import { INITIAL_STUDENTS, INITIAL_CHAPTERS } from './data/mockData';
import { NavigationTab, Student, Chapter, AttendanceStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [userRole, setUserRole] = useState<'Admin' | 'Educator' | 'Principal'>('Admin');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleUpdateAttendance = (studentId: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const wasAbsent = s.attendanceStatus === 'A';
          const newStatus = status;
          return {
            ...s,
            attendanceStatus: newStatus,
            attendancePct:
              newStatus === 'P'
                ? Math.min(100, s.attendancePct + 1)
                : newStatus === 'A'
                ? Math.max(50, s.attendancePct - 1)
                : s.attendancePct,
            isDefaulter: newStatus === 'A' ? true : s.attendancePct < 75,
          };
        }
        return s;
      })
    );
    const target = students.find((s) => s.id === studentId);
    showToast(`Updated ${target?.name || 'Student'} attendance to ${status}`);
  };

  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        attendanceStatus: 'P',
      }))
    );
    showToast('All 42 students marked Present for today');
  };

  const handleUpdateChapter = (chapterId: string, updates: Partial<Chapter>) => {
    setChapters((prev) =>
      prev.map((c) => (c.id === chapterId ? { ...c, ...updates } : c))
    );
  };

  const handleAddChapter = (newChapterData: Omit<Chapter, 'id'>) => {
    const newChapter: Chapter = {
      ...newChapterData,
      id: `c${Date.now()}`,
    };
    setChapters((prev) => [...prev, newChapter]);
  };

  const handleUpdateStudentMarks = (studentId: string, subject: string, score: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            marks: {
              ...s.marks,
              [subject]: score,
            },
          };
        }
        return s;
      })
    );
  };

  const handleSyncSheets = () => {
    showToast('20 Records synced with Google Classroom Sheets');
  };

  return (
    <div className="min-h-screen bg-slate-900/90 flex flex-col items-center justify-start sm:py-6 selection:bg-primary/20">
      {/* Mobile App Canvas Shell */}
      <main className="w-full max-w-md bg-surface min-h-screen sm:min-h-[920px] sm:max-h-[960px] flex flex-col relative shadow-2xl sm:rounded-[36px] sm:border-[8px] sm:border-slate-800 overflow-x-hidden overflow-y-auto">
        {/* Top App Header */}
        <Header
          activeTab={activeTab}
          userRole={userRole}
          setUserRole={(r) => setUserRole(r as any)}
          onShowToast={showToast}
          onNavigate={(tab: NavigationTab) => setActiveTab(tab)}
        />

        {/* Screen Content Viewport */}
        <div className="flex-1 w-full flex flex-col">
          {activeTab === 'dashboard' && (
            <DashboardScreen
              onNavigate={(tab: NavigationTab) => setActiveTab(tab)}
              onShowToast={showToast}
              onSyncSheets={handleSyncSheets}
              onOpenPendingDrawer={() => setActiveTab('syllabus')}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceScreen
              students={students}
              onUpdateAttendance={handleUpdateAttendance}
              onMarkAllPresent={handleMarkAllPresent}
              onSyncSheets={handleSyncSheets}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'syllabus' && (
            <SyllabusScreen
              chapters={chapters}
              onUpdateChapter={handleUpdateChapter}
              onAddChapter={handleAddChapter}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'marks-exams' && (
            <ExamsScreen
              students={students}
              onUpdateStudentMarks={handleUpdateStudentMarks}
              onShowToast={showToast}
              onSyncSheets={handleSyncSheets}
            />
          )}

          {activeTab === 'more' && (
            <MoreScreen
              userRole={userRole}
              setUserRole={(r) => setUserRole(r as any)}
              onShowToast={showToast}
              onSyncSheets={handleSyncSheets}
            />
          )}
        </div>

        {/* Bottom Navigation Dock */}
        <BottomNav activeTab={activeTab} onChangeTab={(tab) => setActiveTab(tab)} />

        {/* Floating Toast Feedback notification */}
        {toastMessage && (
          <div className="fixed sm:absolute bottom-20 left-4 right-4 z-50 flex items-center justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="bg-slate-900 text-white text-[12px] font-medium px-4 py-2.5 rounded-full shadow-2xl border border-slate-700/60 flex items-center gap-2 max-w-sm pointer-events-auto">
              <span className="material-symbols-outlined text-primary-fixed text-[18px]">
                check_circle
              </span>
              <span className="truncate">{toastMessage}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="ml-auto text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
