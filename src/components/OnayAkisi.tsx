import React, { useState } from 'react';
import {
  GitBranch,
  Plus,
  CheckCircle2,
  Trash2,
  X,
  Repeat,
} from 'lucide-react';
import { ApprovalTemplate, Department, User } from '../types';

interface OnayAkisiProps {
  templates: ApprovalTemplate[];
  departments: Department[];
  users: User[];
  onSaveTemplate: (template: ApprovalTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onDelegateTasks?: (workflowKey: string, newApproverName: string) => void;
  onNavigateToDevir?: () => void;
}

export const OnayAkisi: React.FC<OnayAkisiProps> = ({
  templates,
  departments,
  users,
  onSaveTemplate,
  onDeleteTemplate,
  onNavigateToDevir,
}) => {
  // Modal: Onay Şablonu Ekle (Matching Şekil 13)
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(departments[0]?.name || '');
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [orderedApprovers, setOrderedApprovers] = useState<
    { name: string; title: string; sicil: string }[]
  >([]);

  // Available candidate approvers for the selected department
  const candidateApprovers = users.filter((u) => u.isApproverCandidate && u.isActive);

  const handleAddApproverToOrder = (candidate: User) => {
    if (orderedApprovers.some((a) => a.sicil === candidate.sicilNo)) {
      alert('Bu onaycı zaten onay sırasına eklenmiştir.');
      return;
    }
    setOrderedApprovers([
      ...orderedApprovers,
      {
        name: candidate.fullName,
        title: candidate.title,
        sicil: candidate.sicilNo,
      },
    ]);
  };

  const handleRemoveApproverFromOrder = (sicil: string) => {
    setOrderedApprovers(orderedApprovers.filter((a) => a.sicil !== sicil));
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) {
      alert('Lütfen şablon adını giriniz.');
      return;
    }
    if (orderedApprovers.length === 0) {
      alert('Lütfen en az bir onaycı adımı ekleyiniz.');
      return;
    }

    const newTmpl: ApprovalTemplate = {
      id: `tmpl-${Date.now()}`,
      name: templateName.trim(),
      unitOrDept: selectedDept,
      scope: 'Daire Başkanlığı',
      description: description.trim(),
      isActive: true,
      steps: orderedApprovers.map((item, index) => ({
        order: index + 1,
        approverName: item.name,
        approverSicil: item.sicil,
        title: item.title,
      })),
    };

    onSaveTemplate(newTmpl);
    setShowAddModal(false);
    setTemplateName('');
    setDescription('');
    setOrderedApprovers([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider">
            <GitBranch className="w-4 h-4" />
            <span>Yönetim Paneli (UC-05)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Onay Akış Şablonları
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Birimlere özel hiyerarşik onay basamakları şablonları tanımlama ve yönetimi
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToDevir && (
            <button
              onClick={onNavigateToDevir}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              <Repeat className="w-3.5 h-3.5 text-sky-600" />
              <span>Onaycı Devir Ekranı (DB Bazlı) →</span>
            </button>
          )}

          <button
            onClick={() => {
              setSelectedDept(departments[0]?.name || '');
              setTemplateName('');
              setDescription('');
              setOrderedApprovers([]);
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0284c7] hover:bg-[#0275b1] text-white text-xs font-semibold transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Şablon Ekle</span>
          </button>
        </div>
      </div>

      {/* Templates List Table (Matching Şekil 13 Üst Tablo) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Onay Şablonları Listesi
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs md:text-sm text-slate-700">
            <thead className="bg-[#f8fafc] border-b border-slate-200 font-semibold text-slate-800">
              <tr>
                <th className="px-4 py-3">Birim / Kapsam</th>
                <th className="px-4 py-3">Şablon Adı</th>
                <th className="px-4 py-3">Onay Sırası</th>
                <th className="px-3 py-3">Durum</th>
                <th className="px-4 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {templates.map((tmpl) => (
                <tr key={tmpl.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900 max-w-[200px]">
                    {tmpl.unitOrDept}
                  </td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{tmpl.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {tmpl.steps.map((st, idx) => (
                        <React.Fragment key={st.order}>
                          <span className="px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                            {st.approverName}
                          </span>
                          {idx < tmpl.steps.length - 1 && (
                            <span className="text-slate-400 font-bold">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aktif</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1.5">
                    <button
                      onClick={() => alert(`Şablon Açıklaması: ${tmpl.description}`)}
                      className="px-2.5 py-1 text-xs border rounded-md hover:bg-slate-50 font-semibold text-slate-700"
                    >
                      Detay
                    </button>
                    <button
                      onClick={() => onDeleteTemplate(tmpl.id)}
                      className="px-2.5 py-1 text-xs border border-rose-200 rounded-md hover:bg-rose-50 font-semibold text-rose-600"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Şekil 13: Onay Şablonu Ekle Modalı                                        */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Onay Şablonu Ekle</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 block">Birim (Daire Başkanlığı) *</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 block">Şablon Adı *</label>
                <input
                  type="text"
                  required
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Örn: Mevzuat Faaliyetleri Onay Şablonu"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 block">Açıklama</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bu şablonun hangi durumlarda kullanılacağı..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-y"
                />
              </div>

              {/* Two Column Approvers Picker matching Şekil 13 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                {/* Sol: Onay Sırası */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-900 block">Onay Sırası</label>
                  <p className="text-[11px] text-slate-400">
                    Sağdaki listeden onaycı ekleyin. Sıra, onayın kime önce gideceğini belirler.
                  </p>

                  <div className="border border-slate-200 rounded-lg p-2.5 min-h-[140px] space-y-1.5 bg-slate-50">
                    {orderedApprovers.length === 0 ? (
                      <p className="text-[11px] text-slate-400 text-center py-8">
                        Henüz onaycı eklenmedi. Sağdaki listeden ekleyiniz.
                      </p>
                    ) : (
                      orderedApprovers.map((item, idx) => (
                        <div
                          key={item.sicil}
                          className="flex items-center justify-between p-2 bg-white rounded-md border border-slate-200 text-xs shadow-2xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="font-medium text-slate-800">{item.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveApproverFromOrder(item.sicil)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Sağ: Onaycı Adayları */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-900 block">Onaycı Adayları</label>
                  <p className="text-[11px] text-slate-400">
                    Kurumda yetkilendirilmiş aktif onaycı adayları listesi
                  </p>

                  <div className="border border-slate-200 rounded-lg p-2.5 min-h-[140px] max-h-48 overflow-y-auto space-y-1.5 bg-slate-50">
                    {candidateApprovers.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-center justify-between p-2 bg-white rounded-md border border-slate-200 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{candidate.fullName}</p>
                          <p className="text-[10px] text-slate-400">{candidate.title}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddApproverToOrder(candidate)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 rounded-md font-semibold text-xs border border-slate-200"
                        >
                          + Ekle
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0284c7] hover:bg-[#0275b1] text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
