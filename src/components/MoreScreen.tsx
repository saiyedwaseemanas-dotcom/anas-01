import React from 'react';
import { ASSETS } from '../data/mockData';

interface MoreScreenProps {
  userRole: string;
  setUserRole: (role: string) => void;
  onShowToast: (msg: string) => void;
  onSyncSheets: () => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({
  userRole,
  setUserRole,
  onShowToast,
  onSyncSheets,
}) => {
  return (
    <div className="flex flex-col w-full px-4 pb-24 gap-3.5 animate-in fade-in duration-200">
      {/* Institution Profile Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex items-center gap-3">
        <img
          alt="EduTrack Academy Logo"
          className="w-14 h-14 object-contain rounded-xl bg-surface-container p-1.5"
          src={ASSETS.logo}
        />
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-[16px] font-bold text-on-surface truncate">
              EduTrack Academy
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-[10px] font-bold">
              CBSE Verified
            </span>
          </div>
          <p className="text-[12px] text-on-surface-variant">CBSE Affiliation #930219</p>
          <p className="text-[11px] text-on-surface-variant/80 mt-0.5">
            Northwood Senior Secondary Campus • Academic Year 2024-25
          </p>
        </div>
      </div>

      {/* Current User Card */}
      <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-outline-variant/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            alt="User"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
            src={ASSETS.principalAvatar}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-label-lg text-[13px] font-bold text-on-surface truncate">
              Michael Davies
            </span>
            <span className="text-[11px] text-primary font-semibold">Active Role: {userRole}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
          {(['Admin', 'Educator', 'Principal'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setUserRole(r);
                onShowToast(`Switched view to ${r}`);
              }}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                userRole === r
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Google Sheets Integration Card */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]">table_chart</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[14px] font-bold text-on-surface">
                Google Sheets Live Sync
              </h3>
              <p className="text-[11px] text-on-surface-variant">Connected to Central Academic Ledger</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-tertiary font-bold bg-[#ECFDF5] px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
            Online
          </span>
        </div>

        <div className="p-2.5 bg-surface-container-low rounded-lg text-[12px] flex flex-col gap-1 border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant font-medium">Synced Sheets:</span>
            <span className="font-semibold text-on-surface">Class 10-A, 10-B, 9-A, 9-B</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant font-medium">Last Sync:</span>
            <span className="font-semibold text-primary">Today at 08:30 AM (Auto)</span>
          </div>
        </div>

        <button
          onClick={() => {
            onSyncSheets();
            onShowToast('Synced all attendance, syllabus & mark registers with Google Sheets!');
          }}
          className="w-full py-2 bg-surface-container text-primary font-bold text-[12px] rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">sync</span>
          <span>Perform Full School Bi-directional Sync</span>
        </button>
      </div>

      {/* Administration & Tools Section */}
      <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-outline-variant/30 flex flex-col gap-1">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 px-1">
          Academic Management
        </h3>

        {[
          {
            icon: 'calendar_month',
            title: 'School Timetable & Periods',
            desc: 'Configure 8 daily periods & lab shifts',
            action: () => onShowToast('Master timetable view opened'),
          },
          {
            icon: 'people',
            title: 'Student Master Registry',
            desc: 'Manage admission IDs, roll codes, and bio-data',
            action: () => onShowToast('Student master registry opened'),
          },
          {
            icon: 'contact_phone',
            title: 'Emergency Parent WhatsApp Broadcast',
            desc: 'Direct notice to all 1,240 registered families',
            action: () => onShowToast('Opening Parent Broadcast composer...'),
          },
          {
            icon: 'fact_check',
            title: 'CBSE Exam Affiliation Checklist',
            desc: 'Term 1 compliance & syllabus requirements',
            action: () => onShowToast('Compliance guidelines verified 100%'),
          },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container-low transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold text-on-surface truncate">{item.title}</span>
                <span className="text-[11px] text-on-surface-variant truncate">{item.desc}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              chevron_right
            </span>
          </button>
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center pt-2 pb-4 text-[11px] text-on-surface-variant flex flex-col gap-1">
        <span>EduTrack Pro Academic Suite • Version 2.4.0</span>
        <span>Empowering teachers, admins, and students with real-time academic precision</span>
      </div>
    </div>
  );
};
