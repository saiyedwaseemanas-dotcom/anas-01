import React, { useState } from 'react';
import { ASSETS, TEACHERS_ROSTER } from '../data/mockData';
import { Student, AttendanceStatus } from '../types';

interface AttendanceScreenProps {
  students: Student[];
  onUpdateAttendance: (studentId: string, status: AttendanceStatus) => void;
  onMarkAllPresent: () => void;
  onSyncSheets: () => void;
  onShowToast: (msg: string) => void;
}

export const AttendanceScreen: React.FC<AttendanceScreenProps> = ({
  students,
  onUpdateAttendance,
  onMarkAllPresent,
  onSyncSheets,
  onShowToast,
}) => {
  const [viewMode, setViewMode] = useState<'student' | 'teacher'>('student');
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [dateIndex, setDateIndex] = useState(1);

  const dates = ['Yesterday, Oct 23', 'Today, Oct 24', 'Tomorrow, Oct 25'];

  // Calculate live aggregate counts
  const presentCount = students.filter((s) => s.attendanceStatus === 'P').length + 34;
  const absentCount = students.filter((s) => s.attendanceStatus === 'A').length;
  const leaveCount = students.filter((s) => s.attendanceStatus === 'L').length;
  const halfDayCount = students.filter((s) => s.attendanceStatus === 'HD').length;
  const totalCount = 42;

  const handlePrevDay = () => {
    if (dateIndex > 0) {
      setDateIndex(dateIndex - 1);
      onShowToast(`Loaded attendance record for ${dates[dateIndex - 1]}`);
    }
  };

  const handleNextDay = () => {
    if (dateIndex < dates.length - 1) {
      setDateIndex(dateIndex + 1);
      onShowToast(`Loaded attendance record for ${dates[dateIndex + 1]}`);
    }
  };

  const handleWhatsApp = (student: Student) => {
    const text = encodeURIComponent(
      `Dear Parent, this is regarding ${student.name}'s attendance status (${student.attendanceStatus}) on ${dates[dateIndex]}. Current Attendance: ${student.attendancePct}%.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    onShowToast(`WhatsApp opened for ${student.name}'s parent`);
  };

  const handleNotifyAllDefaulters = () => {
    const text = encodeURIComponent(
      `EduTrack Notice: Important attendance warning for Class 10-A students below 75% attendance threshold.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    onShowToast('Dispatched WhatsApp alert to defaulter parents');
  };

  return (
    <div className="flex flex-col w-full px-4 pb-24 gap-3.5 animate-in fade-in duration-200">
      {/* Segmented View Mode Toggle */}
      <div className="w-full bg-surface-container rounded-xl p-1 flex items-center shadow-sm mt-1">
        <button
          onClick={() => setViewMode('student')}
          className={`flex-1 py-2 px-3 rounded-lg font-headline-sm text-[13px] transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none ${
            viewMode === 'student'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-on-surface font-medium'
          }`}
          type="button"
          id="tab-student"
        >
          <span className="material-symbols-outlined text-[18px]">school</span>
          <span>Student Attendance</span>
        </button>

        <button
          onClick={() => setViewMode('teacher')}
          className={`flex-1 py-2 px-3 rounded-lg font-headline-sm text-[13px] transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none ${
            viewMode === 'teacher'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-on-surface font-medium'
          }`}
          type="button"
          id="tab-teacher"
        >
          <span className="material-symbols-outlined text-[18px]">badge</span>
          <span>Teacher Check-In</span>
        </button>
      </div>

      {viewMode === 'student' ? (
        <>
          {/* Filter & Date Card */}
          <div className="w-full bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              {/* Class Selector */}
              <div className="relative flex-1 min-w-0">
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    onShowToast(`Switched view to Class ${e.target.value}`);
                  }}
                  className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-headline-sm text-[13px] font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  id="class-picker"
                >
                  <option value="10-A">Class 10-A (Secondary)</option>
                  <option value="10-B">Class 10-B (Secondary)</option>
                  <option value="9-A">Class 9-A (Junior)</option>
                  <option value="12-Sci">Class 12-Science (Senior)</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2.5 text-on-surface-variant text-[20px]">
                  arrow_drop_down
                </span>
              </div>

              {/* Date Navigator */}
              <div className="flex items-center bg-surface-container-low rounded-lg h-10 px-1.5 flex-shrink-0">
                <button
                  onClick={handlePrevDay}
                  disabled={dateIndex === 0}
                  aria-label="Previous day"
                  className="w-7 h-7 rounded flex items-center justify-center text-on-surface-variant disabled:opacity-30 active:bg-surface-container-high transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  className="flex items-center gap-1 px-1.5 text-on-surface font-label-md text-[12px] font-semibold"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[17px] text-primary">
                    calendar_today
                  </span>
                  <span>{dates[dateIndex]}</span>
                </button>
                <button
                  onClick={handleNextDay}
                  disabled={dateIndex === dates.length - 1}
                  aria-label="Next day"
                  className="w-7 h-7 rounded flex items-center justify-center text-on-surface-variant disabled:opacity-30 active:bg-surface-container-high transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Attendance Live Aggregate Strip */}
            <div className="w-full bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between text-on-surface-variant font-label-sm text-[11px] overflow-x-auto gap-2">
              <div className="flex items-center gap-2.5 min-w-max">
                <span className="flex items-center gap-1 font-label-md text-[12px] text-on-surface">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <strong className="text-on-surface">{presentCount}</strong> Present
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <strong className="text-error">{absentCount}</strong> Absent
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <strong className="text-amber-700">{leaveCount}</strong> Leave
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <strong className="text-purple-700">{halfDayCount}</strong> Half-Day
                </span>
              </div>
              <span className="text-on-surface-variant font-label-sm text-[11px] bg-surface-container px-2 py-0.5 rounded-full flex-shrink-0">
                Total: <strong className="text-on-surface">{totalCount}</strong>
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onMarkAllPresent();
                onShowToast('All 42 students marked Present for today');
              }}
              className="flex-1 h-10 px-3 bg-primary text-on-primary rounded-xl font-label-lg text-[13px] font-semibold shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 focus:outline-none"
              type="button"
              id="btn-mark-all-present"
            >
              <span className="material-symbols-outlined text-[19px]">check_circle</span>
              <span>Mark All Present</span>
            </button>

            <button
              onClick={() => {
                onSyncSheets();
                onShowToast('Class 10-A attendance synced with Google Sheets');
              }}
              aria-label="Sync to Google Sheet"
              className="h-10 px-3 bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-label-md text-[12px] font-semibold rounded-xl shadow-sm active:bg-surface-container flex items-center gap-1.5 transition-colors focus:outline-none"
              type="button"
            >
              <span className="material-symbols-outlined text-[19px] text-tertiary">cloud_sync</span>
              <span className="hidden xs:inline">Sync Sheet</span>
            </button>

            <button
              onClick={() => {
                onShowToast('Generated CSV and PDF Attendance Register for Class 10-A');
              }}
              aria-label="Export Excel or PDF"
              className="w-10 h-10 bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant rounded-xl shadow-sm active:bg-surface-container flex items-center justify-center transition-colors focus:outline-none"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">ios_share</span>
            </button>
          </div>

          {/* Classroom Avatar Glance Strip */}
          <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm border border-outline-variant/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex -space-x-2 overflow-hidden flex-shrink-0">
                <img
                  alt="Aarav"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container-lowest object-cover"
                  src={ASSETS.aaravAvatar}
                />
                <img
                  alt="Ananya"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container-lowest object-cover"
                  src={ASSETS.ananyaAvatar}
                />
                <img
                  alt="Rahul"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container-lowest object-cover"
                  src={ASSETS.rahulAvatar}
                />
                <img
                  alt="Sneha"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container-lowest object-cover"
                  src={ASSETS.snehaAvatar}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-[12px] text-on-surface font-semibold truncate">
                  Class Monitor: Aarav Patel
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant truncate">
                  Period 1 • Physics Lab
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-tertiary bg-surface-container-low px-2 py-1 rounded-full flex-shrink-0">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span className="font-label-sm text-[10px] font-bold">Class in Session</span>
            </div>
          </div>

          {/* Student Attendance Roster Cards */}
          <div className="space-y-2.5">
            {students.map((student) => {
              const isPresent = student.attendanceStatus === 'P';
              const isAbsent = student.attendanceStatus === 'A';
              const isLeave = student.attendanceStatus === 'L';
              const isHalfDay = student.attendanceStatus === 'HD';

              return (
                <div
                  key={student.id}
                  className="student-card w-full bg-surface-container-lowest rounded-xl p-3 shadow-sm border border-outline-variant/30 flex flex-col gap-2.5 transition-all hover:border-primary/30"
                  data-id={student.id}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-surface-container text-primary font-headline-sm text-[14px] font-bold flex items-center justify-center flex-shrink-0">
                        {student.rollNo}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-headline-sm text-[14px] font-bold text-on-surface truncate">
                            {student.name}
                          </h3>
                          {student.isDefaulter ? (
                            <span className="material-symbols-outlined text-error text-[16px]">
                              warning
                            </span>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {student.isDefaulter ? (
                            <span className="font-label-sm text-[10px] text-error bg-error-container/60 px-1.5 py-0.5 rounded font-bold">
                              {student.attendancePct}% Defaulter
                            </span>
                          ) : (
                            <span className="font-label-sm text-[10px] text-tertiary bg-surface-container px-1.5 py-0.5 rounded font-bold">
                              {student.attendancePct}% Att.
                            </span>
                          )}
                          <span className="font-label-sm text-[11px] text-on-surface-variant truncate">
                            Roll #{student.rollNo} • {student.notes || student.house || 'Science Div A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleWhatsApp(student)}
                      aria-label={`WhatsApp Parent of ${student.name}`}
                      className="w-9 h-9 rounded-full bg-surface-container-low text-tertiary flex items-center justify-center active:scale-95 transition-transform flex-shrink-0 hover:bg-surface-container"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">chat</span>
                    </button>
                  </div>

                  {/* Action Toggles: P, A, L, HD */}
                  <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                    <button
                      onClick={() => onUpdateAttendance(student.id, 'P')}
                      className={`status-btn h-9 rounded-lg font-label-lg text-[13px] font-bold transition-all flex items-center justify-center ${
                        isPresent
                          ? 'bg-tertiary text-on-tertiary shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                      type="button"
                    >
                      P
                    </button>
                    <button
                      onClick={() => onUpdateAttendance(student.id, 'A')}
                      className={`status-btn h-9 rounded-lg font-label-lg text-[13px] font-bold transition-all flex items-center justify-center ${
                        isAbsent
                          ? 'bg-error text-on-error shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                      type="button"
                    >
                      A
                    </button>
                    <button
                      onClick={() => onUpdateAttendance(student.id, 'L')}
                      className={`status-btn h-9 rounded-lg font-label-lg text-[13px] font-bold transition-all flex items-center justify-center ${
                        isLeave
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                      type="button"
                    >
                      L
                    </button>
                    <button
                      onClick={() => onUpdateAttendance(student.id, 'HD')}
                      className={`status-btn h-9 rounded-lg font-label-lg text-[13px] font-bold transition-all flex items-center justify-center ${
                        isHalfDay
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                      type="button"
                    >
                      HD
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Defaulter Warning Banner */}
          <div className="w-full bg-error-container rounded-xl p-3.5 shadow-sm border border-error/20 flex flex-col gap-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">report_problem</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-[14px] font-bold text-on-error-container leading-tight">
                  Defaulter Notice
                </span>
                <p className="font-body-sm text-[12px] text-on-error-container mt-0.5 leading-relaxed">
                  3 students below 75% threshold in Class 10-A. Immediate parent follow-up mandated by
                  CBSE guidelines.
                </p>
              </div>
            </div>
            <button
              onClick={handleNotifyAllDefaulters}
              className="w-full h-9 bg-error text-on-error rounded-lg font-label-md text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all hover:bg-error/90"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Notify All Parents via WhatsApp</span>
            </button>
          </div>
        </>
      ) : (
        /* TEACHER CHECK-IN VIEW */
        <div className="flex flex-col gap-3">
          <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-outline-variant/30 flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-[15px] font-bold text-on-surface">
                Faculty Attendance Register
              </h3>
              <p className="text-[12px] text-on-surface-variant">
                Bio-metric punch timestamps &amp; duty rosters
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-tertiary font-bold text-[11px]">
              100% Present
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {TEACHERS_ROSTER.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant/30 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <img
                    src={teacher.avatarUrl}
                    alt={teacher.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-lg text-[13px] font-bold text-on-surface truncate">
                      {teacher.name}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {teacher.department} • Assigned: {teacher.assignedClasses.join(', ')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="font-bold text-[12px] text-tertiary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    {teacher.checkInTime}
                  </span>
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold">
                    Biometric In
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onShowToast('Exporting Faculty Daily Biometric Register to PDF...')}
            className="w-full py-2.5 rounded-xl bg-surface-container text-primary font-label-md text-[12px] font-bold flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Daily Faculty Register</span>
          </button>
        </div>
      )}
    </div>
  );
};
