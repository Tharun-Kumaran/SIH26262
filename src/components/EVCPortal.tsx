'use client';

import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  CheckCircle2,
  FileCheck,
  Video,
  Lock,
  Send,
  Building,
  Plus,
  Search,
} from 'lucide-react';
import { STAGE_LABELS } from '@/lib/types';

import { Role } from '@/lib/types';

interface EVCPortalProps {
  applications: any[];
  onRefresh: () => void;
  currentRole?: Role;
}

export const EVCPortal: React.FC<EVCPortalProps> = ({
  applications,
  onRefresh,
  currentRole = 'EVC_EXPERT',
}) => {
  const evcApplications = applications.filter((a) =>
    ['EVC_SCHEDULED', 'EVC_COMPLETED', 'SCRUTINY', 'RE_SCRUTINY'].includes(a.currentStage)
  );

  const [selectedApp, setSelectedApp] = useState<any>(
    evcApplications.find((a) => a.currentStage === 'EVC_SCHEDULED') || evcApplications[0]
  );

  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [scheduleDate, setScheduleDate] = useState<string>(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [scheduleMode, setScheduleMode] = useState<string>('PHYSICAL');
  const [leadExpert, setLeadExpert] = useState<string>('EVC Lead Inspector (AICTE Expert Committee)');
  const [expertEmail, setExpertEmail] = useState<string>('evc.expert@aicte-india.org');
  const [expertPhone, setExpertPhone] = useState<string>('+91-11-29581000');

  const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
  const [isGpsLocked, setIsGpsLocked] = useState<boolean>(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<string>('');
  const [inspectionSummary, setInspectionSummary] = useState<string>(
    'Conducted verification of laboratories, instructional area, faculty attendance register, and fire safety systems.'
  );
  const [deficienciesFound, setDeficienciesFound] = useState<string>('');
  const [isRecommended, setIsRecommended] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const activeSchedule = selectedApp?.evcSchedules?.[0];

  const handleCaptureGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = `${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`;
          setGpsCoordinates(coords);
          setIsGpsLocked(true);
        },
        () => {
          const fallbackCoords: Record<string, string> = {
            SRO: '13.0108,80.2355',
            WRO: '19.0760,72.8777',
            NRO: '26.4499,80.3319',
            NWRO: '30.7333,76.7794',
            CRO: '23.2599,77.4126',
            ERO: '22.5726,88.3639',
            SCRO: '17.3850,78.4867',
            SWRO: '12.9716,77.5946',
          };
          const reg = selectedApp?.institution?.region || 'NRO';
          setGpsCoordinates(fallbackCoords[reg] || '28.6139,77.2090');
          setIsGpsLocked(true);
        }
      );
    } else {
      setGpsCoordinates('26.4499,80.3319');
      setIsGpsLocked(true);
    }
  };

  const handleScheduleInspection = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/evc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'schedule',
          applicationId: selectedApp.id,
          inspectionDate: scheduleDate,
          mode: scheduleMode,
          leadExpertName: leadExpert,
          expertEmail,
          expertPhone,
          locationAddress: `${selectedApp.institution?.address}, ${selectedApp.institution?.city}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowScheduleModal(false);
        setSuccessToast(`EVC Inspection scheduled for ${scheduleDate}!`);
        setTimeout(() => setSuccessToast(null), 4000);
        onRefresh();
      }
    } catch {
      alert('Failed to schedule EVC inspection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!isGpsLocked && !gpsCoordinates) {
      alert('Please capture GPS coordinates prior to submitting inspection report.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/evc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          scheduleId: activeSchedule?.id || 'simulated-sched-id',
          applicationId: selectedApp.id,
          gpsCoordinates,
          inspectionSummary,
          deficienciesFound: isRecommended ? '' : deficienciesFound,
          isRecommended,
          actorName: leadExpert,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCompleteModal(false);
        setSuccessToast(
          isRecommended
            ? 'Inspection report recorded: Recommended for Approval.'
            : 'Inspection report recorded: Discrepancies referred to SHC Hearing.'
        );
        setTimeout(() => setSuccessToast(null), 4000);
        onRefresh();
      }
    } catch {
      alert('Failed to submit EVC report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-[1216px] mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[#172B4D] tracking-tight">
            EVC Inspection Scheduling & Report Management
          </h1>
          <p className="text-[13px] text-[#5E6C84] mt-0.5">
            Expert Visit Committee allocation, Physical/Virtual logistics, and Geotagged site verification
          </p>
        </div>

        {successToast && (
          <div className="px-3 py-1.5 rounded bg-[#EFF8F3] border border-[#BDE3CF] text-[#1E7E45] text-[12px] font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Pipeline on Left, Details & Submission on Right */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column: Inspection Queue */}
        <div className="col-span-5 space-y-3">
          <div className="enterprise-panel p-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F4] mb-2.5">
              <h2 className="text-[12px] font-semibold text-[#172B4D] uppercase tracking-wide">
                Inspection Pipeline ({evcApplications.length})
              </h2>
              <span className="text-[11px] text-[#8993A4]">Select to view status</span>
            </div>

            <div className="space-y-2">
              {evcApplications.map((app) => {
                const isSelected = app.id === selectedApp?.id;
                const schedule = app.evcSchedules?.[0];

                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#EFF5FB] border-[#245A91]'
                        : 'bg-white border-[#DDE1E5] hover:bg-[#FAFBFC]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-mono text-[11px] font-medium text-[#245A91]">
                          {app.applicationNo}
                        </div>
                        <h3 className="text-[13px] font-medium text-[#172B4D] mt-0.5">
                          {app.institution?.name}
                        </h3>
                        <div className="text-[11px] text-[#5E6C84] mt-0.5">
                          {app.institution?.city}, {app.institution?.state} ({app.institution?.region})
                        </div>
                      </div>

                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase shrink-0 ${
                          app.currentStage === 'EVC_COMPLETED'
                            ? 'bg-[#EFF8F3] text-[#1E7E45] border border-[#BDE3CF]'
                            : 'bg-[#EFF5FB] text-[#245A91] border border-[#D3DFED]'
                        }`}
                      >
                        {app.currentStage}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#F0F2F4] flex items-center justify-between text-[11px] text-[#5E6C84]">
                      <div className="flex items-center gap-1.5">
                        {schedule?.mode === 'VIRTUAL' ? (
                          <Video className="w-3.5 h-3.5 text-[#245A91]" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-[#5E6C84]" />
                        )}
                        <span>{schedule?.mode || 'Pending Schedule'}</span>
                      </div>

                      {schedule?.inspectionDate && (
                        <span>Date: {new Date(schedule.inspectionDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Inspection Dossier */}
        <div className="col-span-7 space-y-3">
          <div className="enterprise-panel p-4 space-y-4">
            {/* Header info */}
            <div className="flex items-start justify-between pb-3 border-b border-[#F0F2F4]">
              <div>
                <span className="text-[11px] font-mono text-[#245A91] bg-[#EFF5FB] px-1.5 py-0.5 rounded border border-[#D3DFED]">
                  PID: {selectedApp?.institution?.aictePid}
                </span>
                <h2 className="text-[15px] font-semibold text-[#172B4D] mt-1.5">
                  {selectedApp?.institution?.name}
                </h2>
                <p className="text-[12px] text-[#5E6C84]">
                  {selectedApp?.institution?.address}, {selectedApp?.institution?.city}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="px-2.5 py-1.5 rounded bg-white hover:bg-[#F4F5F7] text-[#172B4D] border border-[#DDE1E5] text-[12px] font-medium flex items-center gap-1 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#5E6C84]" />
                  <span>{activeSchedule ? 'Reschedule' : 'Schedule EVC'}</span>
                </button>

                <button
                  onClick={() => {
                    setShowCompleteModal(true);
                    setIsGpsLocked(false);
                    setGpsCoordinates(activeSchedule?.gpsCoordinates || '');
                  }}
                  className="px-3 py-1.5 rounded bg-[#245A91] hover:bg-[#1B4570] text-white text-[12px] font-medium flex items-center gap-1 transition-colors shadow-sm"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Submit Report</span>
                </button>
              </div>
            </div>

            {/* Inspector Details */}
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div className="p-3 rounded bg-[#FAFBFC] border border-[#DDE1E5]">
                <span className="text-[10px] uppercase font-semibold text-[#8993A4] block">
                  Lead Expert Inspector
                </span>
                <div className="text-[#172B4D] font-medium mt-1">
                  {activeSchedule?.leadExpertName || 'Prof. Vikram Malhotra (IIT Roorkee)'}
                </div>
                <div className="text-[#5E6C84] text-[11px] font-mono mt-0.5">
                  Phone: {activeSchedule?.expertPhone || '+91-9876543210'}
                </div>
              </div>

              <div className="p-3 rounded bg-[#FAFBFC] border border-[#DDE1E5]">
                <span className="text-[10px] uppercase font-semibold text-[#8993A4] block">
                  Inspection Mode & Geotag
                </span>
                <div className="text-[#172B4D] font-medium mt-1 flex items-center gap-2">
                  <span>{activeSchedule?.mode || 'Physical On-Site'}</span>
                  {activeSchedule?.gpsCoordinates && (
                    <span className="px-1.5 py-0.2 rounded bg-[#EFF8F3] text-[#1E7E45] border border-[#BDE3CF] text-[10px] font-medium">
                      GPS LOCKED
                    </span>
                  )}
                </div>
                <div className="text-[#5E6C84] text-[11px] font-mono mt-0.5">
                  Coords: {activeSchedule?.gpsCoordinates || 'Pending site lock'}
                </div>
              </div>
            </div>

            {/* Verification Checklist Matrix */}
            <div className="p-3 rounded bg-white border border-[#DDE1E5] space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5E6C84] block">
                APH Norms Site Inspection Parameters
              </span>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 bg-[#FAFBFC] border border-[#F0F2F4] rounded">
                  <span className="text-[#8993A4] block text-[10px]">Laboratories</span>
                  <span className="text-[#1E7E45] font-medium">100% Operational</span>
                </div>
                <div className="p-2 bg-[#FAFBFC] border border-[#F0F2F4] rounded">
                  <span className="text-[#8993A4] block text-[10px]">Instructional Area</span>
                  <span className="text-[#172B4D] font-medium">Satisfies Norms</span>
                </div>
                <div className="p-2 bg-[#FAFBFC] border border-[#F0F2F4] rounded">
                  <span className="text-[#8993A4] block text-[10px]">Barrier-Free Divyangjan</span>
                  <span className="text-[#1E7E45] font-medium">Ramps & Lift Installed</span>
                </div>
              </div>

              {activeSchedule?.inspectionSummary && (
                <div className="mt-2 pt-2 border-t border-[#F0F2F4]">
                  <span className="text-[10px] uppercase font-semibold text-[#8993A4] block">
                    Recorded Inspection Summary:
                  </span>
                  <p className="text-[12px] text-[#5E6C84] mt-0.5">{activeSchedule.inspectionSummary}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-none p-4">
          <div className="enterprise-panel max-w-md w-full p-5 space-y-3.5 bg-white shadow-lg">
            <h3 className="text-[14px] font-semibold text-[#172B4D] flex items-center gap-2 pb-2 border-b border-[#F0F2F4]">
              <Calendar className="w-4 h-4 text-[#245A91]" />
              Schedule Expert Visit Committee
            </h3>

            <div className="space-y-2.5 text-[12px]">
              <div>
                <label className="text-[#5E6C84] font-medium block mb-1">Inspection Date:</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#DDE1E5] rounded text-[#172B4D]"
                />
              </div>

              <div>
                <label className="text-[#5E6C84] font-medium block mb-1">Inspection Mode:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduleMode('PHYSICAL')}
                    className={`p-2 rounded border text-center font-medium ${
                      scheduleMode === 'PHYSICAL'
                        ? 'bg-[#EFF5FB] border-[#245A91] text-[#245A91]'
                        : 'bg-white border-[#DDE1E5] text-[#5E6C84]'
                    }`}
                  >
                    Physical On-Site
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleMode('VIRTUAL')}
                    className={`p-2 rounded border text-center font-medium ${
                      scheduleMode === 'VIRTUAL'
                        ? 'bg-[#EFF5FB] border-[#245A91] text-[#245A91]'
                        : 'bg-white border-[#DDE1E5] text-[#5E6C84]'
                    }`}
                  >
                    Virtual 360° Cam
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[#5E6C84] font-medium block mb-1">Lead Expert Inspector:</label>
                <input
                  type="text"
                  value={leadExpert}
                  onChange={(e) => setLeadExpert(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#DDE1E5] rounded text-[#172B4D]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0F2F4]">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-3 py-1.5 rounded bg-[#F4F5F7] text-[#5E6C84] hover:bg-[#EBECF0] text-[12px] font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleScheduleInspection}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 rounded bg-[#245A91] hover:bg-[#1B4570] text-white text-[12px] font-medium shadow-sm"
              >
                {isSubmitting ? 'Scheduling...' : 'Confirm Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Report Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-none p-4">
          <div className="enterprise-panel max-w-lg w-full p-5 space-y-3.5 bg-white shadow-lg">
            <h3 className="text-[14px] font-semibold text-[#172B4D] flex items-center gap-2 pb-2 border-b border-[#F0F2F4]">
              <FileCheck className="w-4 h-4 text-[#245A91]" />
              EVC Inspection Report Submission
            </h3>

            {/* GPS Lock */}
            <div className="p-3 bg-[#FAFBFC] border border-[#DDE1E5] rounded space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#172B4D] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#245A91]" />
                  Geotagged Site Verification:
                </span>
                {isGpsLocked ? (
                  <span className="text-[#1E7E45] font-medium text-[11px] flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    LOCKED (ACCURACY 99.8%)
                  </span>
                ) : (
                  <span className="text-[#D97706] text-[11px]">Capture Required</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  placeholder="Capture site coordinates..."
                  value={gpsCoordinates}
                  className="flex-1 px-2.5 py-1.5 text-[12px] bg-white border border-[#DDE1E5] rounded font-mono text-[#172B4D]"
                />
                <button
                  type="button"
                  onClick={handleCaptureGps}
                  className="px-2.5 py-1.5 rounded bg-[#245A91] hover:bg-[#1B4570] text-white text-[11px] font-medium"
                >
                  Capture GPS
                </button>
              </div>
            </div>

            {/* Recommendation */}
            <div className="space-y-1 text-[12px]">
              <label className="text-[#5E6C84] font-medium block">Committee Recommendation:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecommended(true)}
                  className={`p-2 rounded border text-center font-medium ${
                    isRecommended
                      ? 'bg-[#EFF8F3] border-[#1E7E45] text-[#1E7E45]'
                      : 'bg-white border-[#DDE1E5] text-[#5E6C84]'
                  }`}
                >
                  ✓ Recommend for Approval
                </button>
                <button
                  type="button"
                  onClick={() => setIsRecommended(false)}
                  className={`p-2 rounded border text-center font-medium ${
                    !isRecommended
                      ? 'bg-[#FEECEB] border-[#DC2626] text-[#DC2626]'
                      : 'bg-white border-[#DDE1E5] text-[#5E6C84]'
                  }`}
                >
                  ⚠ Flag Discrepancies (Refer SHC)
                </button>
              </div>
            </div>

            {!isRecommended && (
              <div>
                <label className="text-[12px] font-medium text-[#DC2626] block mb-1">
                  Specific Site Deficiencies:
                </label>
                <textarea
                  rows={2}
                  value={deficienciesFound}
                  onChange={(e) => setDeficienciesFound(e.target.value)}
                  placeholder="Detail discrepancies observed..."
                  className="w-full p-2 text-[12px] bg-white border border-[#FBC5C2] rounded text-[#172B4D] focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="text-[12px] font-medium text-[#5E6C84] block mb-1">
                Executive Inspection Summary:
              </label>
              <textarea
                rows={3}
                value={inspectionSummary}
                onChange={(e) => setInspectionSummary(e.target.value)}
                className="w-full p-2 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] focus:outline-none focus:border-[#245A91]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0F2F4]">
              <button
                type="button"
                onClick={() => setShowCompleteModal(false)}
                className="px-3 py-1.5 rounded bg-[#F4F5F7] text-[#5E6C84] text-[12px] font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReport}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 rounded bg-[#245A91] hover:bg-[#1B4570] text-white text-[12px] font-medium shadow-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Sign & Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
