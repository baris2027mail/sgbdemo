import React, { useState } from 'react';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  Layers,
  Info,
} from 'lucide-react';
import { Department, SubUnit, User } from '../types';

interface BirimAktifligiProps {
  departments: Department[];
  currentUser: User;
  onToggleDepartment: (deptId: string, willBeActive: boolean, reason?: string) => void;
  onToggleSubUnit: (deptId: string, subUnitId: string, willBeActive: boolean) => void;
}

export const BirimAktifligi: React.FC<BirimAktifligiProps> = ({
  departments,
  currentUser,
  onToggleDepartment,
  onToggleSubUnit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDeptIds, setExpandedDeptIds] = useState<string[]>([
    'dept-2', // Muhasebe Hizmetleri DB expanded by default matching Şekil 12
    'dept-1',
  ]);

  // Modal for confirmation when closing a department or unit (Matching 7108-UC5-GUI-003)
  const [pendingCloseAction, setPendingCloseAction] = useState<{
    type: 'dept' | 'subunit';
    deptId: string;
    subUnitId?: string;
    name: string;
    activeApprovalCount: number;
  } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedDeptIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRequestToggleDept = (dept: Department) => {
    if (dept.isActive) {
      // Closing department: warn user
      setPendingCloseAction({
        type: 'dept',
        deptId: dept.id,
        name: dept.name,
        activeApprovalCount: 3, // mock count of affected approvals
      });
    } else {
      onToggleDepartment(dept.id, true);
    }
  };

  const handleRequestToggleSubUnit = (dept: Department, sub: SubUnit) => {
    if (!dept.isActive && !sub.isActive) {
      alert('Üst Daire Başkanlığı kapalıyken alt birim faaliyete açılamaz! (İş Kuralı: 7108-UC5-BR-003)');
      return;
    }

    if (sub.isActive) {
      setPendingCloseAction({
        type: 'subunit',
        deptId: dept.id,
        subUnitId: sub.id,
        name: sub.name,
        activeApprovalCount: 1,
      });
    } else {
      onToggleSubUnit(dept.id, sub.id, true);
    }
  };

  const handleConfirmClose = () => {
    if (!pendingCloseAction) return;
    if (pendingCloseAction.type === 'dept') {
      onToggleDepartment(pendingCloseAction.deptId, false);
    } else if (pendingCloseAction.subUnitId) {
      onToggleSubUnit(pendingCloseAction.deptId, pendingCloseAction.subUnitId, false);
    }
    setPendingCloseAction(null);
  };

  // Filter departments & subunits by search
  const filteredDepartments = departments.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesDept = d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q);
    const matchesSub = d.subUnits.some((s) => s.name.toLowerCase().includes(q));
    return matchesDept || matchesSub;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Yönetim Paneli (UC-05)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Birim Yönetim Ekranı
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daire Başkanlıkları ve bağlı şube/grup müdürlüklerinin kurumsal faaliyet aktiflik yönetimi
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>Kapatılan birimlerdeki faaliyetler Birim Transferi ile taşınabilir.</span>
        </div>
      </div>

      {/* Main Hierarchy Card (Matching Şekil 12) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
        {/* Search Bar matching Şekil 12 (Birim ara...) */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Birim ara..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500"
          />
        </div>

        {/* Tree Container matching Şekil 12 exactly */}
        <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden">
          {filteredDepartments.map((dept) => {
            const isExpanded = expandedDeptIds.includes(dept.id);
            return (
              <div key={dept.id} className="bg-white transition-colors">
                {/* Department Header Row */}
                <div className="flex items-center justify-between p-3.5 hover:bg-slate-50/80">
                  <div
                    onClick={() => toggleExpand(dept.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <button className="text-slate-400 hover:text-slate-600 p-0.5">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-xs md:text-sm tracking-tight uppercase">
                        {dept.name}
                      </span>
                      <span className="text-[11px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-sm font-semibold border border-sky-200">
                        Faaliyet girebilir
                      </span>
                      {!dept.isActive && (
                        <span className="text-[11px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-sm font-semibold border border-rose-200">
                          Kapalı (Pasif)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Department Action Button (Matching Şekil 12) */}
                  <div className="flex items-center gap-2 pl-3 shrink-0">
                    {dept.isActive ? (
                      <button
                        onClick={() => handleRequestToggleDept(dept)}
                        className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Faaliyete Kapat</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRequestToggleDept(dept)}
                        className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Faaliyete Aç</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Subunits List (Matching Şekil 12) */}
                {isExpanded && dept.subUnits && (
                  <div className="bg-slate-50/60 divide-y divide-slate-100 pl-8 pr-3.5 py-1">
                    {dept.subUnits.map((sub) => {
                      const isSubLockedByParent = !dept.isActive;
                      return (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between py-2.5 hover:bg-slate-100/60 px-2 rounded-md transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span
                              className={`text-xs font-medium uppercase ${
                                isSubLockedByParent
                                  ? 'text-slate-400 line-through'
                                  : sub.isActive
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {sub.name}
                            </span>
                            {isSubLockedByParent && (
                              <span className="text-[10px] text-slate-400">
                                (Üst Daire Kapalı)
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {sub.isActive ? (
                              <button
                                onClick={() => handleRequestToggleSubUnit(dept, sub)}
                                disabled={isSubLockedByParent}
                                className="px-3 py-1 rounded-md border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                              >
                                <X className="w-3 h-3" />
                                <span>Faaliyete Kapat</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRequestToggleSubUnit(dept, sub)}
                                disabled={isSubLockedByParent}
                                className="px-3 py-1 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Faaliyete Aç</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal when Closing Unit (Rule 7108-UC5-GUI-003) */}
      {pendingCloseAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <h3>Birim Faaliyete Kapatma Onayı</h3>
              </div>
              <button onClick={() => setPendingCloseAction(null)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs md:text-sm text-slate-700">
              <p>
                <strong>"{pendingCloseAction.name}"</strong> birimini faaliyete kapatmak üzeresiniz.
              </p>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs space-y-1.5">
                <p className="font-bold">Oluşacak Sistem Etkileri (İş Kuralı 7108-UC5-BR-006):</p>
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Bu birime bağlı devam eden tüm onay süreçleri derhal sonlandırılacaktır.</li>
                  <li>İlgili faaliyetlerin onay durumu <em>"Taslak / Henüz onaya gönderilmedi"</em> statüsüne çekilecektir.</li>
                  <li>Onaycıların bekleyen görev havuzundaki görevler kaldırılacaktır.</li>
                  <li>Birimdeki faaliyetlerin yürütülmesi için <strong>"Birim Transferi"</strong> ekranından başka bir aktif birime devredilmesi gerekecektir.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPendingCloseAction(null)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Evet, Birimi Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
