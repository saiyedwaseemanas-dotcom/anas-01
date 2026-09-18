import React, { useState } from 'react';
import { ASSETS, INITIAL_SUBJECTS, PENDING_TOPICS_ALL_CLASSES } from '../data/mockData';
import { Chapter, ChapterStatus } from '../types';

interface SyllabusScreenProps {
  chapters: Chapter[];
  onUpdateChapter: (chapterId: string, updates: Partial<Chapter>) => void;
  onAddChapter: (newChapter: Omit<Chapter, 'id'>) => void;
  onShowToast: (msg: string) => void;
}

export const SyllabusScreen: React.FC<SyllabusScreenProps> = ({
  chapters,
  onUpdateChapter,
  onAddChapter,
  onShowToast,
}) => {
  const [selectedClass, setSelectedClass] = useState('Class 10-A');
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState('mat');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCompact, setIsCompact] = useState(false);

  // Modals state
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPendingDrawerOpen, setIsPendingDrawerOpen] = useState(false);

  // Edit form state
  const [modalTitle, setModalTitle] = useState('');
  const [modalStatus, setModalStatus] = useState<ChapterStatus>('in_progress');
  const [modalPeriodsDone, setModalPeriodsDone] = useState(8);
  const [modalDate, setModalDate] = useState('2024-11-08');
  const [modalNotes, setModalNotes] = useState('');

  // Add chapter form state
  const [newTitle, setNewTitle] = useState('');
  const [newPeriodsAllocated, setNewPeriodsAllocated] = useState(12);
  const [newExamWeight, setNewExamWeight] = useState(8);

  const activeSubject = INITIAL_SUBJECTS.find((s) => s.id === activeSubjectId) || INITIAL_SUBJECTS[0];

  const filteredChapters = chapters.filter((c) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'completed') return c.status === 'completed';
    if (filterStatus === 'in_progress') return c.status === 'in_progress';
    if (filterStatus === 'not_started') return c.status === 'not_started';
    return true;
  });

  const openUpdateModal = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setModalTitle(chapter.title);
    setModalStatus(chapter.status);
    setModalPeriodsDone(chapter.periodsDone);
    setModalDate(chapter.finishedDate || '2024-11-08');
    setModalNotes(chapter.homeworkSummary || chapter.classNotes || '');
  };

  const handleSaveModal = () => {
    if (!editingChapter) return;
    onUpdateChapter(editingChapter.id, {
      status: modalStatus,
      periodsDone: modalPeriodsDone,
      finishedDate: modalStatus === 'completed' ? 'Today, Oct 24, 2024' : undefined,
      homeworkSummary: modalNotes,
    });
    setEditingChapter(null);
    onShowToast(`Updated progress for "${editingChapter.title}"`);
  };

  const handleQuickAddPeriod = (chapter: Chapter) => {
    const updatedDone = Math.min(chapter.periodsAllocated, chapter.periodsDone + 1);
    const newStatus = updatedDone >= chapter.periodsAllocated ? 'completed' : 'in_progress';
    onUpdateChapter(chapter.id, {
      periodsDone: updatedDone,
      status: newStatus,
    });
    onShowToast(`Recorded +1 lecture period for ${chapter.title} (${updatedDone}/${chapter.periodsAllocated})`);
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const nextNo = (chapters.length + 1).toString().padStart(2, '0');
    onAddChapter({
      chapterNo: nextNo,
      title: newTitle.trim(),
      subjectId: activeSubjectId,
      periodsAllocated: Number(newPeriodsAllocated) || 10,
      periodsDone: 0,
      examWeightMarks: Number(newExamWeight) || 6,
      status: 'not_started',
      expectedDuration: '2 Weeks',
    });

    setNewTitle('');
    setIsAddModalOpen(false);
    onShowToast(`Added chapter "${newTitle}" to ${activeSubject.name}`);
  };

  return (
    <div className="flex flex-col w-full pb-24 gap-3.5 animate-in fade-in duration-200">
      {/* Top Utility Controls: Class Dropdown & Search */}
      <section className="px-4 pt-2 flex items-center justify-between gap-2">
        <div className="relative inline-block">
          <button
            onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
            className="h-10 px-3.5 rounded-xl bg-surface-container-high text-on-surface flex items-center gap-2 font-label-lg text-[13px] font-bold shadow-sm focus:outline-none active:scale-95 transition-transform"
            id="classSelectBtn"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">school</span>
            <span>{selectedClass}</span>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              arrow_drop_down
            </span>
          </button>

          {isClassDropdownOpen && (
            <div className="absolute left-0 mt-1 w-44 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xl z-50 py-1.5 flex flex-col animate-in fade-in">
              {['Class 10-A', 'Class 10-B', 'Class 9-A', 'Class 12-Science'].map((cName) => (
                <button
                  key={cName}
                  onClick={() => {
                    setSelectedClass(cName);
                    setIsClassDropdownOpen(false);
                    onShowToast(`Loaded curriculum for ${cName}`);
                  }}
                  className={`px-3.5 py-2 text-left text-[12px] font-medium transition-colors ${
                    selectedClass === cName
                      ? 'bg-surface-container text-primary font-bold'
                      : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                  type="button"
                >
                  {cName} {cName === selectedClass && '(Current)'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onShowToast('Academic Term Calendar scheduled: Midterm starts Nov 15')}
            aria-label="Curriculum Calendar"
            className="w-10 h-10 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-all shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          </button>
          <button
            onClick={() => onShowToast('Exporting Syllabus Completion PDF report...')}
            aria-label="Export Syllabus PDF"
            className="w-10 h-10 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-all shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
          </button>
        </div>
      </section>

      {/* Horizontal Scrolling Subject Chips */}
      <section className="pl-4">
        <div className="flex items-center gap-2 overflow-x-auto pr-4 no-scrollbar py-1">
          {INITIAL_SUBJECTS.map((sub) => {
            const isActive = activeSubjectId === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setActiveSubjectId(sub.id);
                  onShowToast(`Switched to ${sub.name} curriculum`);
                }}
                className={`flex-shrink-0 h-8 px-3 rounded-full font-label-md text-[12px] font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : sub.isAlert
                    ? 'bg-surface-container-high text-on-surface hover:bg-surface-container'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container'
                }`}
                type="button"
              >
                <span>{sub.name}</span>
                {sub.isAlert && !isActive ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[10px]">warning</span>
                    {sub.completionPct}%
                  </span>
                ) : (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-on-primary/20 text-white'
                        : 'bg-surface-container-highest text-primary'
                    }`}
                  >
                    {sub.completionPct}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Subject Overview Hero Card */}
      <section className="px-4">
        <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/5 pointer-events-none blur-2xl"></div>

          {/* Card Top: Subject & Faculty Avatar */}
          <div className="flex items-start justify-between gap-2 relative z-10">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">calculate</span>
                <h1 className="font-headline-lg-mobile text-[22px] font-bold text-on-surface truncate">
                  {activeSubject.name}
                </h1>
              </div>
              <span className="font-label-md text-[12px] text-on-surface-variant mt-0.5 font-medium">
                Section 10-A • Academic Year 2024-25
              </span>
            </div>

            {/* Teacher Profile Badge */}
            <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded-full shadow-sm flex-shrink-0 border border-outline-variant/20">
              <img
                alt={activeSubject.teacherName}
                className="w-6 h-6 rounded-full object-cover"
                src={activeSubject.teacherAvatar || ASSETS.profSenAvatar}
              />
              <span className="font-label-sm text-[11px] text-on-surface font-semibold leading-tight">
                {activeSubject.teacherName}
              </span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="flex flex-col gap-1.5 relative z-10">
            <div className="flex items-center justify-between text-[12px] font-semibold">
              <span className="text-on-surface-variant">Syllabus Completion</span>
              <span className="font-headline-sm text-[16px] text-primary font-bold">
                {activeSubject.completionPct}%
              </span>
            </div>

            {/* Dual layered progress bar */}
            <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden relative">
              <div
                className="absolute top-0 bottom-0 left-0 bg-primary/20"
                style={{ width: `${activeSubject.targetPct}%` }}
              ></div>
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${activeSubject.completionPct}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>
                {activeSubject.completedChapters} of {activeSubject.totalChapters} Chapters Completed
              </span>
              <span className="text-primary font-bold">Target: {activeSubject.targetPct}%</span>
            </div>
          </div>

          {/* Red Alert Banner */}
          {activeSubject.alertMessage && (
            <div className="rounded-lg bg-error-container px-3 py-2 flex items-center gap-2 text-on-error-container relative z-10 shadow-sm border border-error/20">
              <span className="material-symbols-outlined text-[18px] text-error flex-shrink-0">
                crisis_alert
              </span>
              <div className="flex-1 min-w-0 text-[12px] leading-tight">
                <span className="font-bold">Target Alert:</span> {activeSubject.alertMessage}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1 relative z-10">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 h-10 rounded-lg bg-primary text-on-primary font-label-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Add New Chapter</span>
            </button>
            <button
              onClick={() => setIsCompact(!isCompact)}
              className="h-10 px-3 rounded-lg bg-surface-container text-on-surface font-label-md text-[12px] flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform"
              title="Toggle Compact View"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isCompact ? 'density_large' : 'density_medium'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Section Header & Filter Pills */}
      <section className="px-4 mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-[20px]">menu_book</span>
          <h2 className="font-headline-sm text-[16px] text-on-surface font-bold">Curriculum Topics</h2>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] font-bold">
            {filteredChapters.length} visible
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[11px] text-on-surface-variant font-medium">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-lg px-2 py-1 focus:outline-none border border-outline-variant/30 cursor-pointer"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="not_started">Pending</option>
          </select>
        </div>
      </section>

      {/* Interactive Chapter List (Cards) */}
      <section className="px-4 flex flex-col gap-2.5">
        {filteredChapters.map((chapter) => {
          const isCompleted = chapter.status === 'completed';
          const isInProgress = chapter.status === 'in_progress';
          const isNotStarted = chapter.status === 'not_started';

          return (
            <article
              key={chapter.id}
              className={`chapter-card rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col transition-all duration-200 ${
                isCompact ? 'p-2.5 gap-1.5' : 'p-3.5 gap-2'
              } ${isNotStarted ? 'opacity-90' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${
                      isCompleted
                        ? 'bg-tertiary/10 text-tertiary'
                        : isInProgress
                        ? 'bg-secondary-container/20 text-secondary'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {chapter.chapterNo}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-headline-sm text-[14px] font-bold text-on-surface truncate">
                      {chapter.title}
                    </h3>
                    <span className="text-[11px] text-on-surface-variant">
                      {chapter.periodsAllocated} Periods Allocated • Exam Weight: {chapter.examWeightMarks} Marks
                    </span>
                  </div>
                </div>

                {/* Status Indicator Pill */}
                <div className="flex-shrink-0">
                  {isCompleted && (
                    <span className="h-6 px-2 rounded-full bg-[#ECFDF5] text-[#065F46] font-label-sm text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                      <span>Completed</span>
                    </span>
                  )}
                  {isInProgress && (
                    <span className="h-6 px-2 rounded-full bg-[#F0F9FF] text-[#075985] font-label-sm text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse"></span>
                      <span>In Progress</span>
                    </span>
                  )}
                  {isNotStarted && (
                    <span className="h-6 px-2 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                      <span>Not Started</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar for in-progress chapter */}
              {isInProgress && (
                <div className="flex flex-col gap-1 bg-surface-container-low p-2 rounded-lg mt-1 border border-outline-variant/20">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-on-surface-variant font-medium">Lecture Pace</span>
                    <span className="text-secondary font-bold">
                      {chapter.periodsDone} / {chapter.periodsAllocated} Periods Done (
                      {Math.round((chapter.periodsDone / chapter.periodsAllocated) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((chapter.periodsDone / chapter.periodsAllocated) * 100))}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* In Progress Action Buttons */}
              {isInProgress && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => openUpdateModal(chapter)}
                    className="flex-1 h-9 rounded-lg bg-primary-fixed text-on-primary-fixed-variant font-label-md text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all hover:bg-primary-fixed-dim"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
                    <span>Update Status &amp; Tasks</span>
                  </button>
                  <button
                    onClick={() => handleQuickAddPeriod(chapter)}
                    className="h-9 px-3 rounded-lg bg-surface-container text-on-surface font-label-md text-[12px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                    title="Log Period Today"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">add_task</span>
                    <span>+1 Period</span>
                  </button>
                </div>
              )}

              {/* Completed Expandable Details */}
              {isCompleted && (
                <details className="group mt-1">
                  <summary className="list-none flex items-center justify-between text-[11px] text-primary cursor-pointer py-1 select-none font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">
                        check_circle
                      </span>
                      Finished on {chapter.finishedDate || 'Oct 02, 2024'}
                    </span>
                    <span className="material-symbols-outlined text-[18px] group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-1 pb-1 flex flex-col gap-1.5">
                    {chapter.classNotes && (
                      <div className="rounded-lg bg-surface-container-low p-2 flex items-start gap-2 text-[12px] text-on-surface border border-outline-variant/20">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant mt-0.5">
                          sticky_note_2
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-on-surface-variant text-[10px] uppercase tracking-wider">
                            Class Notes
                          </span>
                          <p className="text-on-surface">{chapter.classNotes}</p>
                        </div>
                      </div>
                    )}
                    {chapter.homeworkSummary && (
                      <div className="rounded-lg bg-surface-container-low p-2 flex items-start gap-2 text-[12px] text-on-surface border border-outline-variant/20">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant mt-0.5">
                          assignment
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-on-surface-variant text-[10px] uppercase tracking-wider">
                            Homework Assigned
                          </span>
                          <p className="text-on-surface">{chapter.homeworkSummary}</p>
                        </div>
                      </div>
                    )}
                    {chapter.assessmentNote && (
                      <div className="rounded-lg bg-surface-container-low p-2 flex items-start gap-2 text-[12px] text-on-surface border border-outline-variant/20">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant mt-0.5">
                          verified
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-on-surface-variant text-[10px] uppercase tracking-wider">
                            Assessment
                          </span>
                          <p className="text-on-surface">{chapter.assessmentNote}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Not Started Actions */}
              {isNotStarted && (
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/20 mt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">schedule</span>
                    {chapter.expectedDuration || 'Expected Duration: 2 Weeks'}
                  </span>
                  <button
                    onClick={() => {
                      onUpdateChapter(chapter.id, {
                        status: 'in_progress',
                        periodsDone: 1,
                      });
                      onShowToast(`Marked "${chapter.title}" as started!`);
                    }}
                    className="text-primary text-[12px] font-bold hover:underline"
                    type="button"
                  >
                    Mark as Started
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* Visual Delight: Pacing Tip Card */}
      <section className="px-4 mt-2">
        <div className="rounded-xl bg-surface-container-high p-3.5 flex items-center gap-3 shadow-sm border border-outline-variant/30">
          <div className="w-11 h-11 rounded-xl bg-surface-container-lowest flex items-center justify-center flex-shrink-0 text-primary shadow-sm">
            <span className="material-symbols-outlined text-[26px]">insights</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="font-headline-sm text-[14px] font-bold text-on-surface">Pacing Tip for 10-A</h4>
            <p className="text-[12px] text-on-surface-variant leading-relaxed">
              Conduct 2 extra tutorial classes on Saturdays to cover Quadratic Equations before the
              mid-term revision cycle.
            </p>
          </div>
        </div>
      </section>

      {/* Admin Bottom Action Trigger: Syllabus Drawer Summary */}
      <section className="px-4 mt-2 mb-2">
        <button
          onClick={() => setIsPendingDrawerOpen(true)}
          className="w-full h-12 px-3.5 rounded-xl bg-surface-container-highest text-on-surface font-label-lg text-[13px] flex items-center justify-between shadow-sm active:scale-[0.99] transition-all border border-outline-variant/30"
          type="button"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">hub</span>
            <span className="font-bold">View 8 Pending Topics Across All Classes</span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <span className="text-[11px] font-bold bg-primary text-on-primary px-2 py-0.5 rounded-full">
              8
            </span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </div>
        </button>
      </section>

      {/* ==================== MODAL: UPDATE STATUS & TASKS ==================== */}
      {editingChapter && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl p-4 shadow-2xl flex flex-col gap-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-5 bg-primary rounded-full"></span>
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">
                  Update {editingChapter.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingChapter(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Status Selection */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                CURRENT STATUS
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setModalStatus('not_started')}
                  className={`h-9 rounded-lg text-[12px] flex items-center justify-center gap-1 font-semibold transition-all ${
                    modalStatus === 'not_started'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                  type="button"
                >
                  <span className="w-2 h-2 rounded-full bg-outline"></span>
                  <span>Not Started</span>
                </button>
                <button
                  onClick={() => setModalStatus('in_progress')}
                  className={`h-9 rounded-lg text-[12px] flex items-center justify-center gap-1 font-semibold transition-all ${
                    modalStatus === 'in_progress'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                  type="button"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0EA5E9]"></span>
                  <span>In Progress</span>
                </button>
                <button
                  onClick={() => setModalStatus('completed')}
                  className={`h-9 rounded-lg text-[12px] flex items-center justify-center gap-1 font-semibold transition-all ${
                    modalStatus === 'completed'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                  type="button"
                >
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  <span>Completed</span>
                </button>
              </div>
            </div>

            {/* Periods Counter */}
            <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
              <span className="text-[13px] text-on-surface font-semibold">Periods Completed</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalPeriodsDone(Math.max(0, modalPeriodsDone - 1))}
                  className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-bold text-on-surface hover:bg-surface-container-high active:scale-95"
                  type="button"
                >
                  -
                </button>
                <span className="text-[16px] w-8 text-center text-primary font-bold">
                  {modalPeriodsDone}
                </span>
                <button
                  onClick={() =>
                    setModalPeriodsDone(
                      Math.min(editingChapter.periodsAllocated, modalPeriodsDone + 1)
                    )
                  }
                  className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-bold text-on-surface hover:bg-surface-container-high active:scale-95"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            {/* Date Picker */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                ESTIMATED / RECORDED COMPLETION DATE
              </label>
              <input
                type="date"
                value={modalDate}
                onChange={(e) => setModalDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-[13px] font-medium border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Homework & Notes Field */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                HOMEWORK / CLASSROOM SUMMARY
              </label>
              <textarea
                value={modalNotes}
                onChange={(e) => setModalNotes(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface text-[13px] border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                rows={2}
                placeholder="e.g. Assigned Exercise 4.2, quadratic formula drill sheet..."
              />
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setEditingChapter(null)}
                className="flex-1 h-10 rounded-lg bg-surface-container text-on-surface font-semibold text-[13px]"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="flex-1 h-10 rounded-lg bg-primary text-on-primary font-bold text-[13px] shadow-md active:scale-98"
                type="button"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD CHAPTER ==================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  bookmark_add
                </span>
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">
                  Add New Chapter to {activeSubject.name}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateChapter} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">
                  CHAPTER TITLE
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Coordinate Geometry"
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-[13px] border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase">
                    PERIODS ALLOCATED
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={newPeriodsAllocated}
                    onChange={(e) => setNewPeriodsAllocated(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-[13px] border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase">
                    EXAM WEIGHT (MARKS)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={newExamWeight}
                    onChange={(e) => setNewExamWeight(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-[13px] border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 h-10 rounded-lg bg-surface-container text-on-surface font-semibold text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-lg bg-primary text-on-primary font-bold text-[13px] shadow-md active:scale-98"
                >
                  Create Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DRAWER: OVERALL PENDING SYLLABUS ==================== */}
      {isPendingDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-end justify-center animate-in fade-in">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-2xl p-4 shadow-2xl flex flex-col gap-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">flag</span>
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">
                  Admin Pending Topics (8)
                </h3>
              </div>
              <button
                onClick={() => setIsPendingDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[12px] text-on-surface-variant">
              Overview of topics currently lagging behind midterm benchmarks across junior &amp; senior wings.
            </p>

            <div className="flex flex-col gap-2 mt-1">
              {PENDING_TOPICS_ALL_CLASSES.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between border border-outline-variant/20"
                >
                  <div className="flex flex-col pr-2">
                    <p className="text-[13px] text-on-surface font-bold">{item.classSubject}</p>
                    <p className="text-[12px] text-on-surface-variant">{item.topic}</p>
                  </div>
                  <span
                    className={`h-6 px-2.5 rounded-full font-bold text-[11px] flex items-center flex-shrink-0 ${item.statusColor}`}
                  >
                    {item.severity}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsPendingDrawerOpen(false)}
              className="w-full h-10 mt-1 rounded-xl bg-surface-container text-on-surface font-bold text-[13px] hover:bg-surface-container-high transition-colors"
              type="button"
            >
              Close Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
