import React, { useState, useMemo } from 'react';
import { ASSETS } from '../data/mockData';
import { Student } from '../types';

interface ExamsScreenProps {
  students: Student[];
  onUpdateStudentMarks: (studentId: string, subject: string, score: number) => void;
  onShowToast: (msg: string) => void;
  onSyncSheets: () => void;
}

export const ExamsScreen: React.FC<ExamsScreenProps> = ({
  students,
  onUpdateStudentMarks,
  onShowToast,
  onSyncSheets,
}) => {
  const [selectedExam, setSelectedExam] = useState('ut1');
  const [selectedClass, setSelectedClass] = useState('10a');
  const [selectedSubject, setSelectedSubject] = useState<'science' | 'maths' | 'english'>('science');
  const [activeTab, setActiveTab] = useState<'sheet' | 'report' | 'analytics'>('sheet');
  const [selectedStudentForReportId, setSelectedStudentForReportId] = useState<string>('s2'); // defaults to Ananya Iyer

  // Sorting state for students in ledger
  const [isSortedByRank, setIsSortedByRank] = useState(false);

  // Helper calculation for grade, pct, and color
  const calculateResult = (score: number, max: number = 50) => {
    const val = Math.min(Math.max(score, 0), max);
    const pct = Math.round((val / max) * 100);
    let grade = 'F';
    let isPass = true;
    let colorClass = 'text-primary';

    if (pct >= 90) {
      grade = 'A+';
      colorClass = 'text-tertiary';
    } else if (pct >= 80) {
      grade = 'A';
      colorClass = 'text-primary';
    } else if (pct >= 70) {
      grade = 'B+';
      colorClass = 'text-primary';
    } else if (pct >= 60) {
      grade = 'B';
      colorClass = 'text-secondary';
    } else if (pct >= 40) {
      grade = 'C';
      colorClass = 'text-secondary';
    } else {
      grade = 'F';
      isPass = false;
      colorClass = 'text-error';
    }

    return { val, pct, grade, isPass, colorClass };
  };

  // Rank students based on currently selected subject marks
  const studentRankMap = useMemo(() => {
    const sorted = [...students].sort(
      (a, b) => (b.marks[selectedSubject] || 0) - (a.marks[selectedSubject] || 0)
    );
    const map = new Map<string, number>();
    sorted.forEach((s, idx) => {
      map.set(s.id, idx + 1);
    });
    return map;
  }, [students, selectedSubject]);

  // Display students list (ordered by roll or by rank)
  const displayStudents = useMemo(() => {
    if (!isSortedByRank) return students;
    return [...students].sort(
      (a, b) => (b.marks[selectedSubject] || 0) - (a.marks[selectedSubject] || 0)
    );
  }, [students, selectedSubject, isSortedByRank]);

  // Cohort stats
  const cohortStats = useMemo(() => {
    const scores = students.map((s) => s.marks[selectedSubject] || 0);
    if (scores.length === 0) return { avg: 0, highest: 0, passPct: 100, topper: students[0] };

    const total = scores.reduce((sum, v) => sum + v, 0);
    const avg = (total / scores.length).toFixed(1);
    const highest = Math.max(...scores);
    const passes = scores.filter((s) => s >= 20).length;
    const passPct = Math.round((passes / scores.length) * 100);

    const topper = [...students].sort(
      (a, b) => (b.marks[selectedSubject] || 0) - (a.marks[selectedSubject] || 0)
    )[0];

    return { avg, highest, passPct, topper };
  }, [students, selectedSubject]);

  // Histogram bins for analytics tab
  const histogram = useMemo(() => {
    const counts = { lt20: 0, b2130: 0, b3140: 0, b4150: 0 };
    students.forEach((s) => {
      const score = s.marks[selectedSubject] || 0;
      if (score <= 20) counts.lt20++;
      else if (score <= 30) counts.b2130++;
      else if (score <= 40) counts.b3140++;
      else counts.b4150++;
    });
    return counts;
  }, [students, selectedSubject]);

  const selectedStudentForReport =
    students.find((s) => s.id === selectedStudentForReportId) || students[1] || students[0];

  const handleScoreInput = (studentId: string, valueStr: string) => {
    const num = Math.min(50, Math.max(0, parseFloat(valueStr) || 0));
    onUpdateStudentMarks(studentId, selectedSubject, num);
  };

  const handleTriggerAutoRankSort = () => {
    setIsSortedByRank(true);
    onShowToast('Ledger sorted by highest marks and academic rank');
  };

  const handleSaveAndRecalculate = () => {
    setIsSortedByRank(true);
    onShowToast('Marks saved & class standing ranks recalculated!');
  };

  const handleSyncSheetsAction = () => {
    onSyncSheets();
    onShowToast('20 Records synced with Google Classroom Sheets');
  };

  const handlePreviewTopReportCard = () => {
    if (cohortStats.topper) {
      setSelectedStudentForReportId(cohortStats.topper.id);
    }
    setActiveTab('report');
    onShowToast(`Displaying generated report card for ${cohortStats.topper?.name || 'Topper'}`);
  };

  const handlePrintMode = () => {
    onShowToast('Sending formatted report card to print spooler...');
    window.print();
  };

  return (
    <div className="flex flex-col w-full pb-24 gap-3.5 animate-in fade-in duration-200">
      {/* Filter Ribbon */}
      <section className="px-4 pt-2 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
            <span className="font-label-lg text-[13px] font-bold text-on-surface">
              Evaluation Context
            </span>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container-highest text-primary font-bold">
            Academic Year 2024-25
          </span>
        </div>

        {/* Dropdown Control Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Exam Selector */}
          <div className="relative bg-surface-container-low rounded-xl px-3 py-1.5 shadow-sm border border-outline-variant/30 flex flex-col justify-center">
            <label
              className="text-[10px] text-on-surface-variant font-bold flex items-center gap-1 uppercase tracking-wider"
              htmlFor="exam-select"
            >
              <span className="material-symbols-outlined text-[13px]">event_note</span> Exam Title
            </label>
            <div className="relative flex items-center">
              <select
                id="exam-select"
                value={selectedExam}
                onChange={(e) => {
                  setSelectedExam(e.target.value);
                  onShowToast(`Loaded context for ${e.target.options[e.target.selectedIndex].text}`);
                }}
                className="w-full bg-transparent font-headline-sm text-[14px] font-bold text-on-surface appearance-none focus:outline-none pr-6 py-0.5 cursor-pointer"
              >
                <option value="ut1">Unit Test 1</option>
                <option value="ut2">Unit Test 2</option>
                <option value="midterm">Mid-Term Assessment</option>
                <option value="final">Final Exam</option>
              </select>
              <span className="material-symbols-outlined absolute right-0 pointer-events-none text-on-surface-variant text-[18px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Class & Subject Row */}
          <div className="grid grid-cols-2 gap-2 sm:col-span-2">
            {/* Class Selector */}
            <div className="relative bg-surface-container-low rounded-xl px-3 py-1.5 shadow-sm border border-outline-variant/30 flex flex-col justify-center">
              <label
                className="text-[10px] text-on-surface-variant font-bold flex items-center gap-1 uppercase tracking-wider"
                htmlFor="class-select"
              >
                <span className="material-symbols-outlined text-[13px]">school</span> Grade &amp; Div
              </label>
              <div className="relative flex items-center">
                <select
                  id="class-select"
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    onShowToast(`Filtered records by ${e.target.options[e.target.selectedIndex].text}`);
                  }}
                  className="w-full bg-transparent font-headline-sm text-[14px] font-bold text-on-surface appearance-none focus:outline-none pr-5 py-0.5 cursor-pointer"
                >
                  <option value="10a">Class 10-A</option>
                  <option value="10b">Class 10-B</option>
                  <option value="9a">Class 9-A</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 pointer-events-none text-on-surface-variant text-[16px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Subject Selector */}
            <div className="relative bg-surface-container-low rounded-xl px-3 py-1.5 shadow-sm border border-outline-variant/30 flex flex-col justify-center">
              <label
                className="text-[10px] text-on-surface-variant font-bold flex items-center gap-1 uppercase tracking-wider"
                htmlFor="subject-select"
              >
                <span className="material-symbols-outlined text-[13px]">science</span> Subject
              </label>
              <div className="relative flex items-center">
                <select
                  id="subject-select"
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value as any);
                    onShowToast(`Selected subject ledger: ${e.target.options[e.target.selectedIndex].text}`);
                  }}
                  className="w-full bg-transparent font-headline-sm text-[14px] font-bold text-on-surface appearance-none focus:outline-none pr-5 py-0.5 cursor-pointer"
                >
                  <option value="science">Science (Max 50)</option>
                  <option value="maths">Maths (Max 50)</option>
                  <option value="english">English (Max 50)</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 pointer-events-none text-on-surface-variant text-[16px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Summary Row (Horizontal Scroll on Mobile) */}
      <section className="pl-4">
        <div className="flex items-center justify-between pr-4 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">
            Class Cohort Overview
          </span>
          <span className="text-[11px] text-tertiary font-bold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> +3.2% vs
            UT-Prev
          </span>
        </div>

        <div
          className="flex gap-2.5 overflow-x-auto pb-1.5 pr-4 no-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {/* Class Avg */}
          <div
            className="min-w-[145px] flex-shrink-0 bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant font-medium">Class Avg</span>
              <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[14px]">functions</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-[20px] font-bold text-on-surface">
                {cohortStats.avg}
                <span className="text-on-surface-variant text-[12px] font-normal"> / 50</span>
              </div>
              <span className="text-[11px] text-primary font-bold">
                {Math.round((parseFloat(cohortStats.avg as any) / 50) * 100)}% Average
              </span>
            </div>
          </div>

          {/* Highest Mark */}
          <div
            className="min-w-[145px] flex-shrink-0 bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant font-medium">Highest Score</span>
              <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[14px]">military_tech</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-[20px] font-bold text-on-surface">
                {cohortStats.highest}
                <span className="text-on-surface-variant text-[12px] font-normal"> / 50</span>
              </div>
              <span className="text-[11px] text-tertiary font-bold">
                {Math.round((cohortStats.highest / 50) * 100)}% Top Bench
              </span>
            </div>
          </div>

          {/* Pass Rate */}
          <div
            className="min-w-[145px] flex-shrink-0 bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant font-medium">Pass Ratio</span>
              <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[14px]">verified</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-[20px] font-bold text-on-surface">{cohortStats.passPct}%</div>
              <span className="text-[11px] text-on-surface-variant">19 of 20 Students</span>
            </div>
          </div>

          {/* Topper Card */}
          <div
            className="min-w-[190px] flex-shrink-0 bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant font-medium">Class Topper</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-[10px] font-bold">
                Rank 1 🏆
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={cohortStats.topper?.avatarUrl || ASSETS.ananyaAvatar}
                alt="Topper"
              />
              <div className="min-w-0">
                <p className="text-[12px] text-on-surface font-bold truncate">
                  {cohortStats.topper?.name || 'Ananya Iyer'}
                </p>
                <p className="text-[11px] text-tertiary font-semibold">
                  {cohortStats.topper?.marks[selectedSubject] || 49}/50 (
                  {Math.round(((cohortStats.topper?.marks[selectedSubject] || 49) / 50) * 100)}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Segment Tab Switcher */}
      <section className="px-4">
        <div className="w-full bg-surface-container-low p-1 rounded-xl flex items-center gap-1 shadow-sm border border-outline-variant/30">
          <button
            onClick={() => setActiveTab('sheet')}
            className={`flex-1 py-2 rounded-lg text-center text-[12px] font-bold transition-all ${
              activeTab === 'sheet'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface font-medium'
            }`}
            type="button"
            id="tab-btn-sheet"
          >
            Entry Sheet
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-2 rounded-lg text-center text-[12px] font-bold transition-all ${
              activeTab === 'report'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface font-medium'
            }`}
            type="button"
            id="tab-btn-report"
          >
            Report Card
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 rounded-lg text-center text-[12px] font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface font-medium'
            }`}
            type="button"
            id="tab-btn-analytics"
          >
            Analytics
          </button>
        </div>
      </section>

      {/* ==================== TAB 1: Marks Entry Sheet ==================== */}
      {activeTab === 'sheet' && (
        <div className="flex flex-col w-full px-4 gap-3 animate-in fade-in duration-150">
          {/* Action Quick Toolbar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-sm text-[15px] font-bold text-on-surface">
                Marks Entry Ledger
              </h2>
              <p className="text-[12px] text-on-surface-variant">
                Enter raw marks (0–50). Grade &amp; rank update automatically.
              </p>
            </div>
            <button
              onClick={handleTriggerAutoRankSort}
              className="h-8 px-2.5 rounded-lg bg-surface-container text-on-surface text-[12px] font-bold flex items-center gap-1 hover:bg-surface-container-high transition-colors"
              title="Sort by Rank"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">sort</span>
              <span>Ranks</span>
            </button>
          </div>

          {/* Student Score Card List */}
          <div className="flex flex-col gap-2.5">
            {displayStudents.map((student) => {
              const currentScore = student.marks[selectedSubject] ?? 0;
              const result = calculateResult(currentScore, 50);
              const rank = studentRankMap.get(student.id) || 1;

              let rankSuffix = '';
              if (rank === 1) rankSuffix = ' 👑';
              else if (rank === 2) rankSuffix = ' 🥈';
              else if (rank === 3) rankSuffix = ' 🥉';

              const isRank1 = rank === 1;

              return (
                <article
                  key={student.id}
                  className={`student-card bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border transition-all duration-150 ${
                    isRank1
                      ? 'border-primary/40 ring-1 ring-primary/20'
                      : 'border-outline-variant/30 hover:border-primary/30'
                  }`}
                  data-roll={student.rollNo}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] flex-shrink-0 ${
                          !result.isPass
                            ? 'bg-error-container text-error'
                            : isRank1
                            ? 'bg-surface-container-high text-primary'
                            : 'bg-surface-container text-primary'
                        }`}
                      >
                        {student.rollNo}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-headline-sm text-[14px] font-bold text-on-surface truncate">
                            {student.name}
                          </h3>
                          {isRank1 && <span className="text-[14px]">🏆</span>}
                          {rank === 2 && <span className="text-[14px]">🥈</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span
                            className={`student-rank-badge text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              !result.isPass
                                ? 'bg-error-container text-on-error-container'
                                : isRank1
                                ? 'bg-surface-container-high text-primary'
                                : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            Rank #{rank}
                            {rankSuffix}
                          </span>
                          <span
                            className={`status-indicator w-2 h-2 rounded-full ${
                              !result.isPass
                                ? 'bg-error'
                                : result.pct >= 90
                                ? 'bg-tertiary'
                                : 'bg-secondary'
                            }`}
                          ></span>
                          <span className="text-[11px] text-on-surface-variant">
                            {isRank1
                              ? 'Highest Mark'
                              : !result.isPass
                              ? 'Needs Retest'
                              : rank === 2
                              ? 'High Distinction'
                              : 'Science Div A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`student-status-badge text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        result.isPass
                          ? 'bg-surface-container-high text-tertiary'
                          : 'bg-error-container text-error'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          result.isPass ? 'bg-tertiary' : 'bg-error'
                        }`}
                      ></span>
                      {result.isPass ? 'Pass' : 'Needs Review'}
                    </span>
                  </div>

                  <div className="mt-3 p-2 bg-surface-container-low rounded-xl flex items-center justify-between gap-2 border border-outline-variant/20">
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-on-surface-variant font-bold">Marks:</label>
                      <div className="flex items-center bg-surface-container-lowest rounded-lg px-2 py-1 shadow-sm border border-outline-variant/30">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={currentScore}
                          onChange={(e) => handleScoreInput(student.id, e.target.value)}
                          className={`mark-input w-12 text-center text-[16px] font-bold bg-transparent focus:outline-none ${
                            !result.isPass
                              ? 'text-error'
                              : result.pct >= 90
                              ? 'text-tertiary'
                              : 'text-primary'
                          }`}
                        />
                        <span className="text-[12px] text-on-surface-variant font-semibold">
                          / 50
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <span className="text-[10px] text-on-surface-variant block uppercase font-semibold">
                          Pct %
                        </span>
                        <span
                          className={`student-percent text-[13px] font-bold ${
                            !result.isPass ? 'text-error' : 'text-on-surface'
                          }`}
                        >
                          {result.pct}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant block uppercase font-semibold">
                          Grade
                        </span>
                        <span
                          className={`student-grade text-[15px] font-bold ${
                            !result.isPass
                              ? 'text-error'
                              : result.pct >= 90
                              ? 'text-tertiary'
                              : 'text-primary'
                          }`}
                        >
                          {result.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Exam Action Buttons Bar */}
          <div className="flex flex-col gap-2 mt-1">
            <button
              onClick={handleSaveAndRecalculate}
              className="w-full h-11 bg-primary text-on-primary rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              <span>Save &amp; Recalculate Ranks</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePreviewTopReportCard}
                className="h-10 bg-surface-container-lowest border border-outline-variant/30 text-primary rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:bg-surface-container transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span>Generate Cards</span>
              </button>
              <button
                onClick={handleSyncSheetsAction}
                className="h-10 bg-surface-container-lowest border border-outline-variant/30 text-secondary rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:bg-surface-container transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
                <span>Sync Sheets</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: Official Report Card Preview ==================== */}
      {activeTab === 'report' && (
        <div className="flex flex-col w-full px-4 gap-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
              <h2 className="font-headline-sm text-[15px] font-bold text-on-surface">
                Official Report Card Preview
              </h2>
            </div>
            <button
              onClick={handlePrintMode}
              className="px-3 py-1 rounded-full bg-surface-container text-primary text-[11px] font-bold flex items-center gap-1 hover:bg-surface-container-high transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Export</span>
            </button>
          </div>

          {/* Student Selector Pill Row to view other report cards */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] text-on-surface-variant font-medium flex-shrink-0">
              Select Student:
            </span>
            {students.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedStudentForReportId(s.id);
                  onShowToast(`Report Card preview for ${s.name}`);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedStudentForReport.id === s.id
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Printable Report Card Preview */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-md border border-outline-variant/40 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-xl bg-primary-container text-on-primary flex items-center justify-center text-[18px] font-bold">
                  EP
                </div>
                <div>
                  <h4 className="font-headline-sm text-[15px] font-bold text-on-surface leading-tight">
                    EduTrack Academy
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    CBSE Affiliation #930219 | Term 1 2024
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-surface-container-high text-tertiary text-[11px] font-bold">
                  Passed (A+)
                </span>
              </div>
            </div>

            {/* Student Bio Data Block */}
            <div className="mt-3 p-3 bg-surface-container-low rounded-xl grid grid-cols-2 gap-2 border border-outline-variant/20">
              <div className="flex items-center gap-2.5">
                <img
                  className="w-12 h-12 rounded-lg object-cover ring-1 ring-outline-variant/30"
                  src={
                    selectedStudentForReport.id === 's2'
                      ? ASSETS.ananyaReportCardAvatar
                      : selectedStudentForReport.avatarUrl
                  }
                  alt={selectedStudentForReport.name}
                />
                <div className="min-w-0">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase">Candidate</p>
                  <p className="text-[13px] font-bold text-on-surface truncate">
                    {selectedStudentForReport.name}
                  </p>
                  <p className="text-[11px] text-primary font-semibold">
                    Roll No: {selectedStudentForReport.rollNo} • Class 10-A
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center text-right">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase">
                  Class Standing
                </p>
                <p className="text-[15px] font-bold text-primary">
                  Rank {studentRankMap.get(selectedStudentForReport.id) || 1} / 42
                </p>
                <div className="flex items-center justify-end gap-1 text-tertiary">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span className="text-[11px] font-bold">
                    {Math.round(
                      ((selectedStudentForReport.marks.science +
                        selectedStudentForReport.marks.maths +
                        selectedStudentForReport.marks.english) /
                        150) *
                        100
                    )}
                    .0% Grand Total
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Breakdown Table */}
            <div className="mt-3 overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant/20">
              <div className="grid grid-cols-4 bg-surface-container-high px-3 py-2 text-on-surface-variant text-[11px] uppercase font-bold tracking-wider">
                <div className="col-span-2">Subject</div>
                <div className="text-right">Max</div>
                <div className="text-right">Scored</div>
              </div>
              <div className="text-[12px] text-on-surface divide-y divide-outline-variant/20">
                <div className="grid grid-cols-4 px-3 py-2 items-center">
                  <div className="col-span-2 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary"></span> Science
                  </div>
                  <div className="text-right text-on-surface-variant">50</div>
                  <div className="text-right font-bold text-primary">
                    {selectedStudentForReport.marks.science} (
                    {calculateResult(selectedStudentForReport.marks.science).grade})
                  </div>
                </div>

                <div className="grid grid-cols-4 px-3 py-2 items-center bg-surface-container-lowest">
                  <div className="col-span-2 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span> Mathematics
                  </div>
                  <div className="text-right text-on-surface-variant">50</div>
                  <div className="text-right font-bold text-secondary">
                    {selectedStudentForReport.marks.maths} (
                    {calculateResult(selectedStudentForReport.marks.maths).grade})
                  </div>
                </div>

                <div className="grid grid-cols-4 px-3 py-2 items-center">
                  <div className="col-span-2 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span> English Lit
                  </div>
                  <div className="text-right text-on-surface-variant">50</div>
                  <div className="text-right font-bold text-tertiary">
                    {selectedStudentForReport.marks.english} (
                    {calculateResult(selectedStudentForReport.marks.english).grade})
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance & Co-Curricular Spark */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-surface-container-low rounded-xl flex items-center gap-2 border border-outline-variant/20">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">fact_check</span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant block uppercase font-semibold">
                    Attendance
                  </span>
                  <span className="text-[12px] text-on-surface font-bold">
                    {selectedStudentForReport.attendanceSummary || '94% Regular'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-surface-container-low rounded-xl flex items-center gap-2 border border-outline-variant/20">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant block uppercase font-semibold">
                    Discipline
                  </span>
                  <span className="text-[12px] text-tertiary font-bold">
                    {selectedStudentForReport.disciplineGrade || 'Grade Exemplary'}
                  </span>
                </div>
              </div>
            </div>

            {/* Teacher Feedback & Signature Block */}
            <div className="mt-3 p-3 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  format_quote
                </span>
                <span className="text-[12px] font-bold">Head Teacher Remarks</span>
              </div>
              <p className="text-[12px] text-on-surface-variant italic pl-5 leading-relaxed">
                {selectedStudentForReport.remarks ||
                  '“Demonstrates consistent analytical clarity and actively assists peers during lab modules.”'}
              </p>

              <div className="mt-2 pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">
                    Class Educator
                  </p>
                  <p className="text-[12px] font-bold text-on-surface">Mrs. R. Swaminathan</p>
                </div>
                <div className="text-right">
                  <span className="material-symbols-outlined text-primary text-[28px] opacity-85">
                    draw
                  </span>
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">
                    Authorized Signatory
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: Analytics & Toppers View ==================== */}
      {activeTab === 'analytics' && (
        <div className="flex flex-col w-full px-4 gap-3 animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-headline-sm text-[15px] font-bold text-on-surface">
                  Marks Distribution Curve
                </h3>
                <p className="text-[12px] text-on-surface-variant">
                  Breakdown across {students.length} registered students ({selectedSubject})
                </p>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-bold">
                Mean: {cohortStats.avg}
              </span>
            </div>

            {/* Inline Bar Histogram Graphic */}
            <div className="h-32 w-full flex items-end justify-between gap-2.5 pt-4 pb-1 px-2 border-b border-outline-variant/20">
              {/* Range 0-20 */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[11px] text-error font-bold">{histogram.lt20}</span>
                <div
                  className="w-full bg-error-container rounded-t-md transition-all duration-500"
                  style={{ height: `${Math.max(12, histogram.lt20 * 20)}%` }}
                ></div>
                <span className="text-[11px] text-on-surface-variant font-medium">&lt;20</span>
              </div>

              {/* Range 21-30 */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[11px] text-on-surface-variant font-bold">
                  {histogram.b2130}
                </span>
                <div
                  className="w-full bg-surface-container-highest rounded-t-md transition-all duration-500"
                  style={{ height: `${Math.max(16, histogram.b2130 * 20)}%` }}
                ></div>
                <span className="text-[11px] text-on-surface-variant font-medium">21-30</span>
              </div>

              {/* Range 31-40 */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[11px] text-primary font-bold">{histogram.b3140}</span>
                <div
                  className="w-full bg-surface-variant rounded-t-md transition-all duration-500"
                  style={{ height: `${Math.max(20, histogram.b3140 * 20)}%` }}
                ></div>
                <span className="text-[11px] text-on-surface-variant font-medium">31-40</span>
              </div>

              {/* Range 41-50 */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[11px] text-tertiary font-bold">{histogram.b4150}</span>
                <div
                  className="w-full bg-primary-container rounded-t-md transition-all duration-500"
                  style={{ height: `${Math.max(25, histogram.b4150 * 20)}%` }}
                ></div>
                <span className="text-[11px] text-on-surface-variant font-medium">41-50</span>
              </div>
            </div>
          </div>

          {/* Podium Highlight */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30">
            <h3 className="font-headline-sm text-[15px] font-bold text-on-surface mb-2.5">
              Top 3 Subject Masters
            </h3>
            <div className="flex flex-col gap-2">
              {[...students]
                .sort((a, b) => (b.marks[selectedSubject] || 0) - (a.marks[selectedSubject] || 0))
                .slice(0, 3)
                .map((stu, i) => (
                  <div
                    key={stu.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[12px] ${
                          i === 0
                            ? 'bg-surface-container-high text-primary ring-1 ring-primary/30'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-[13px] font-bold text-on-surface">{stu.name}</p>
                        <p className="text-[11px] text-on-surface-variant">
                          Roll {stu.rollNo} • {calculateResult(stu.marks[selectedSubject] || 0).pct}%
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[15px] font-bold ${
                        i === 0
                          ? 'text-tertiary'
                          : i === 1
                          ? 'text-primary'
                          : 'text-on-surface'
                      }`}
                    >
                      {stu.marks[selectedSubject] || 0}/50
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
