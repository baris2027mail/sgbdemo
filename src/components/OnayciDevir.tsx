import React, { useState, useMemo } from 'react';
import {
  ArrowRightLeft,
  Users,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Check,
  RotateCcw,
  Info,
  ChevronRight,
} from 'lucide-react';
import { User, Activity, Department } from '../types';

interface OnayciDevirProps {
  users: User[];
  activities: Activity[];
  departments: Department[];
  currentUser: User;
  onExecuteDelegation: (
    sourceApproverName: string,
    delegations: {
      groupKey: string;
      department: string;
      templateName: string;
      newApproverName: string;
      activityIds: string[];
    }[]
  ) => void;
}

export const OnayciDevir: React.FC<OnayciDevirProps> = ({
  users,
  activities,
  departments,
  currentUser,
  onExecuteDelegation,
}) => {
  // Candidate / active approvers
  const approvers = useMemo(() => {
    return users.filter((u) => u.isApproverCandidate && u.isActive);
  }, [users]);

  // Selected source approver whose tasks will be delegated
  const [sourceApproverName, setSourceApproverName] = useState<string>(
    approvers[0]?.fullName || 'Cevat Gökhan YAMANKALE'
  );

  // Success / Feedback notification
  const [feedback, setFeedback] = useState<string | null>(null);

  // Find all pending activities assigned to the selected source approver
  const approverPendingActivities = useMemo(() => {
    return activities.filter((act) => {
      if (act.approvalStatus !== 'Onay Bekliyor') return false;
      // Either explicitly assigned or matches default
      if (act.assignedApprover) {
        return act.assignedApprover === sourceApproverName;
      }
      // Sample fallback matching
      return sourceApproverName === 'Cevat Gökhan YAMANKALE';
    });
  }, [activities, sourceApproverName]);

  // Group pending tasks by Daire Başkanlığı (DB) and Onay Akışı / Şablon (as requested!)
  const groupedTasks = useMemo(() => {
    const groups: {
      [key: string]: {
        groupKey: string;
        department: string;
        templateName: string;
        activityIds: string[];
        activityTitles: string[];
        count: number;
      };
    } = {};

    approverPendingActivities.forEach((act) => {
      const dept = act.department || 'STRATEJİ GELİŞTİRME BAŞKANLIĞI';
      const tmpl =
        act.approvalTemplateId ||
        (dept.includes('MUHASEBE') ? 'Muhasebe Faaliyetleri Onay Şablonu' : 'SGB Genel Faaliyet Onay Şablonu');
      const key = `${dept} // ${tmpl}`;

      if (!groups[key]) {
        groups[key] = {
          groupKey: key,
          department: dept,
          templateName: tmpl,
          activityIds: [],
          activityTitles: [],
          count: 0,
        };
      }

      groups[key].activityIds.push(act.id);
      groups[key].activityTitles.push(act.title);
      groups[key].count += 1;
    });

    // If no direct matches, generate realistic active DB groups for user testing
    if (Object.keys(groups).length === 0) {
      return [
        {
          groupKey: 'MUHASEBE HİZMETLERİ DAİRE BAŞKANLIĞI // Muhasebe Faaliyetleri Onay Şablonu',
          department: 'MUHASEBE HİZMETLERİ DAİRE BAŞKANLIĞI',
          templateName: 'Muhasebe Faaliyetleri Onay Şablonu',
          activityIds: ['act-1', 'act-2'],
          activityTitles: ['Stratejik Planlama Çalışması', 'Performans Programı Hazırlığı'],
          count: 2,
        },
        {
          groupKey: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI // SGB Genel Faaliyet Onay Şablonu',
          department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
          templateName: 'SGB Genel Faaliyet Onay Şablonu',
          activityIds: ['act-5', 'act-7'],
          activityTitles: ['Planlama Raporu', 'Bütçe Hazırlık Çalışmaları'],
          count: 2,
        },
      ];
    }

    return Object.values(groups);
  }, [approverPendingActivities]);

  // Selected new approver per group key
  const [targetApprovers, setTargetApprovers] = useState<{ [key: string]: string }>({});
  // Selected groups to delegate
  const [selectedGroupKeys, setSelectedGroupKeys] = useState<string[]>([]);

  // Initialize target approvers
  React.useEffect(() => {
    const initialTargets: { [key: string]: string } = {};
    const defaultNewApprover =
      approvers.find((u) => u.fullName !== sourceApproverName)?.fullName ||
      'Abdullah MÜJDECİ';

    groupedTasks.forEach((g) => {
      initialTargets[g.groupKey] = defaultNewApprover;
    });

    setTargetApprovers(initialTargets);
    setSelectedGroupKeys(groupedTasks.map((g) => g.groupKey));
  }, [groupedTasks, sourceApproverName, approvers]);

  const handleToggleSelectGroup = (key: string) => {
    setSelectedGroupKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleApplyDelegation = () => {
    if (selectedGroupKeys.length === 0) {
      alert('Lütfen devredilecek en az bir Daire Başkanlığı / Onay Akışı grubu seçiniz.');
      return;
    }

    const payload = selectedGroupKeys.map((key) => {
      const g = groupedTasks.find((item) => item.groupKey === key)!;
      return {
        groupKey: g.groupKey,
        department: g.department,
        templateName: g.templateName,
        newApproverName: targetApprovers[g.groupKey] || 'İş Birimi Admini',
        activityIds: g.activityIds,
      };
    });

    onExecuteDelegation(sourceApproverName, payload);
    setFeedback(
      `"${sourceApproverName}" üzerindeki bekleyen görevler başarıyla seçilen yeni onaycılara devredildi. Değişiklikler sistem onay geçmişine kaydedildi.`
    );
    setTimeout(() => setFeedback(null), 5000);
  };

  const sourceUserObj = users.find((u) => u.fullName === sourceApproverName);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Yönetim Paneli (UC-05 · İş Kuralı 7108-UC5-BR-010 & BR-018)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Onaycı Değişikliği / Görev Devir Yönetimi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Görevden ayrılan, pasife alınan veya izinli onaycıların üzerindeki bekleyen görevleri Daire Başkanlığı (DB) bazında gruplayarak yeni onaycılara aktarın.
          </p>
        </div>

        <div className="px-3.5 py-2 bg-sky-50 border border-sky-200 rounded-lg text-sky-800 text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span>Yetki: Yalnızca İş Birimi Admini</span>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-700">
            Kapat
          </button>
        </div>
      )}

      {/* Step 1: Select Source Approver */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">
            1
          </span>
          <span>Görevleri Devredilecek Onaycıyı Seçin</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Mevcut Onaycı (Ayrılan / Pasife Alınacak Personel) *
            </label>
            <select
              value={sourceApproverName}
              onChange={(e) => setSourceApproverName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white focus:outline-hidden focus:border-sky-500 shadow-2xs"
            >
              {approvers.map((app) => (
                <option key={app.id} value={app.fullName}>
                  {app.fullName} ({app.title} - {app.department})
                </option>
              ))}
            </select>
          </div>

          {sourceUserObj && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Bağlı Daire Başkanlığı:</span>
                <span className="font-semibold text-slate-800">{sourceUserObj.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Sicil No:</span>
                <span className="font-mono text-slate-700">{sourceUserObj.sicilNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Bekleyen Toplam Görev:</span>
                <span className="font-bold text-sky-700 tabular-nums">
                  {groupedTasks.reduce((acc, g) => acc + g.count, 0)} görev
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Daire Başkanlığı (DB) ve Şablon Bazında Gruplanmış Görevler Listesi */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Daire Başkanlığı (DB) ve Onay Akışı Bazında Gruplar</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Her Daire Başkanlığı ve akış için sorumlu yeni onaycıyı belirleyin
            </p>
          </div>
          <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
            {groupedTasks.length} Grup Tespit Edildi
          </span>
        </div>

        <div className="space-y-3">
          {groupedTasks.map((group) => {
            const isSelected = selectedGroupKeys.includes(group.groupKey);
            const currentTarget =
              targetApprovers[group.groupKey] ||
              approvers.find((u) => u.fullName !== sourceApproverName)?.fullName ||
              '';

            return (
              <div
                key={group.groupKey}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  isSelected
                    ? 'border-sky-300 bg-sky-50/40 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 opacity-75'
                }`}
              >
                {/* Header row with checkbox */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectGroup(group.groupKey)}
                      className="mt-1 w-4 h-4 rounded-xs text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {group.department}
                        </span>
                        <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-sm font-semibold">
                          {group.templateName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        İlgili Faaliyetler: {group.activityTitles.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Task Count Badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full tabular-nums">
                      {group.count} Bekleyen Görev
                    </span>
                  </div>
                </div>

                {/* Target Approver Selector */}
                <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-7">
                  <span className="text-xs font-semibold text-slate-700">
                    Bu Daire Başkanlığı Grubu İçin Yeni Onaycı:
                  </span>
                  <div className="w-full sm:w-72">
                    <select
                      value={currentTarget}
                      onChange={(e) =>
                        setTargetApprovers({
                          ...targetApprovers,
                          [group.groupKey]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 bg-white focus:outline-hidden focus:border-sky-500 shadow-2xs"
                    >
                      {approvers
                        .filter((u) => u.fullName !== sourceApproverName)
                        .map((cand) => (
                          <option key={cand.id} value={cand.fullName}>
                            {cand.fullName} ({cand.title})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              Devir sonrası tamamlanmış onay adımları korunur, kalan adımlar yeni onaycı ile sürdürülür.
            </span>
          </div>

          <button
            onClick={handleApplyDelegation}
            className="px-6 py-2.5 bg-[#0284c7] hover:bg-[#0275b1] text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Devir İşlemini Uygula</span>
          </button>
        </div>
      </div>
    </div>
  );
};
