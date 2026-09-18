export type NavigationTab = 'dashboard' | 'attendance' | 'syllabus' | 'marks-exams' | 'more';

export type AttendanceStatus = 'P' | 'A' | 'L' | 'HD';

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  avatarUrl: string;
  classId: string;
  className: string;
  house?: string;
  attendancePct: number;
  consecutiveAbsentDays?: number;
  attendanceStatus: AttendanceStatus;
  notes?: string;
  isDefaulter?: boolean;
  marks: {
    science: number;
    maths: number;
    english: number;
    [key: string]: number;
  };
  attendanceSummary?: string;
  disciplineGrade?: string;
  remarks?: string;
}

export type ChapterStatus = 'completed' | 'in_progress' | 'not_started';

export interface Chapter {
  id: string;
  chapterNo: string;
  title: string;
  subjectId: string;
  periodsAllocated: number;
  periodsDone: number;
  examWeightMarks: number;
  status: ChapterStatus;
  finishedDate?: string;
  projectedStartDate?: string;
  expectedDuration?: string;
  classNotes?: string;
  homeworkSummary?: string;
  assessmentNote?: string;
  tags?: string[];
}

export interface SubjectInfo {
  id: string;
  name: string;
  teacherName: string;
  teacherAvatar: string;
  completionPct: number;
  targetPct: number;
  totalChapters: number;
  completedChapters: number;
  isAlert?: boolean;
  alertMessage?: string;
}

export interface TeacherCheckIn {
  id: string;
  name: string;
  avatarUrl: string;
  department: string;
  checkInTime: string;
  status: 'present' | 'on_duty' | 'leave';
  assignedClasses: string[];
}

export interface DefaulterStudent {
  name: string;
  rollNo: string;
  className: string;
  attendancePct: number;
  daysAbsent: number;
  avatarUrl: string;
  phone?: string;
}
