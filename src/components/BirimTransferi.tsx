import React, { useState, useMemo } from 'react';
import {
  Info,
  Search,
  AlertTriangle,
  ArrowRightLeft,
  Check,
  ChevronDown,
  History,
  RotateCcw,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Activity, Unit, TransferRecord } from '../types';

interface BirimTransferiProps {
  units: Unit[];
  activities: Activity[];
  onExecuteTransfer: (
    sourceUnit: string,
    targetUnit: string,
    reason: string,
    activityIds: string[]
  ) => void;
  transferHistory: TransferRecord[];
  onUndoLastTransfer?: () => void;
  onResetData: () => void;
}

export const BirimTransferi: React.FC<BirimTransferiProps> = ({
  units,
  activities,
  onExecuteTransfer,
  transferHistory,
  onUndoLastTransfer,
  onResetData,
}) => {
  // Source & Target Unit state (defaults strictly matching screenshot)
  const [sourceUnit, setSourceUnit] = useState<string>('Strateji Geliştirme');
  const [targetUnit, setTargetUnit] = useState<string>('İnsan Kaynakları Dairesi Başkanlığı');

  // Transfer Reason state
  const [reason, setReason] = useState<string>('');

  // Selected Activity IDs (defaulting to the first 3 activities to match the screenshot "Seçili: 3 / 12")
  const [selectedIds, setSelectedIds] = useState<string[]>(['act-1', 'act-2', 'act-3']);

  // Filter/Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Notifications
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Filter activities that belong to the currently selected Source Unit
  const sourceActivities = useMemo(() => {
    return activities.filter((act) => act.currentUnit === sourceUnit);
  }, [activities, sourceUnit]);

  // Filter by search query
  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) return sourceActivities;
    const query = searchQuery.toLowerCase();
    return sourceActivities.filter(
      (act) =>
        act.title.toLowerCase().includes(query) ||
        (act.fileName ? act.fileName.toLowerCase().includes(query) : false)
    );
  }, [sourceActivities, searchQuery]);

  // Handle source unit change
  const handleSourceUnitChange = (newSource: string) => {
    setSourceUnit(newSource);
    // Clear selection
    setSelectedIds([]);
    // If target unit is identical, set target to another unit
    if (targetUnit === newSource) {
      const alternate = units.find((u) => u.name !== newSource);
      if (alternate) setTargetUnit(alternate.name);
    }
  };

  // Checkbox toggle for a single activity
  const toggleSelectActivity = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Master checkbox toggle
  const isAllFilteredSelected =
    filteredActivities.length > 0 &&
    filteredActivities.every((act) => selectedIds.includes(act.id));

  const isIndeterminate =
    filteredActivities.some((act) => selectedIds.includes(act.id)) &&
    !isAllFilteredSelected;

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      // Deselect all filtered items
      const filteredIds = new Set(filteredActivities.map((a) => a.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      // Select all filtered items
      const combined = new Set([...selectedIds, ...filteredActivities.map((a) => a.id)]);
      setSelectedIds(Array.from(combined));
    }
  };

  // Validate before showing confirmation modal
  const handleValidateAndOpenConfirm = () => {
    if (selectedIds.length === 0) {
      setToastMessage({
        type: 'error',
        text: 'Lütfen transfer edilecek en az bir faaliyet seçiniz.',
      });
      return;
    }

    if (!targetUnit) {
      setToastMessage({
        type: 'error',
        text: 'Lütfen bir hedef birim seçiniz.',
      });
      return;
    }

    if (sourceUnit === targetUnit) {
      setToastMessage({
        type: 'error',
        text: 'Hedef birim, kaynak birim ile aynı olamaz.',
      });
      return;
    }

    if (!reason.trim()) {
      setToastMessage({
        type: 'error',
        text: 'Lütfen transfer gerekçesini doldurunuz.',
      });
      return;
    }

    setShowConfirmModal(true);
  };

  // Perform actual transfer
  const handleConfirmTransfer = () => {
    setShowConfirmModal(false);
    onExecuteTransfer(sourceUnit, targetUnit, reason.trim(), selectedIds);

    const count = selectedIds.length;
    setSelectedIds([]);
    setReason('');

    setToastMessage({
      type: 'success',
      text: `${count} faaliyet başarıyla "${targetUnit}" birimine aktarıldı.`,
    });
  };

  // Cancel action
  const handleCancel = () => {
    setSelectedIds([]);
    setReason('');
    setToastMessage({
      type: 'info',
      text: 'Seçimler ve gerekçe alanı temizlendi.',
    });
  };

  // Selected items details for confirmation
  const selectedActivitiesList = useMemo(() => {
    return activities.filter((act) => selectedIds.includes(act.id));
  }, [activities, selectedIds]);

  const hasPendingApprovalInSelected = selectedActivitiesList.some(
    (a) => a.hasPendingApproval
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-lg shadow-sm text-sm border transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : toastMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-sky-50 border-sky-200 text-sky-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toastMessage.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            {toastMessage.type === 'error' && (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            {toastMessage.type === 'info' && (
              <Info className="w-5 h-5 text-sky-600 shrink-0" />
            )}
            <span className="font-medium">{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 rounded-md hover:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Birim Transferi Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
        {/* Title & History/Reset Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Birim Transferi
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="Geçmiş transfer kayıtlarını inceleyin"
            >
              <History className="w-3.5 h-3.5" />
              <span>Transfer Geçmişi ({transferHistory.length})</span>
            </button>
            <button
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 bg-transparent hover:bg-slate-100 rounded-md transition-colors"
              title="Varsayılan ekran görüntüsü verilerine sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Varsayılana Sıfırla</span>
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[#e1f0fe] border border-[#bee0fd] rounded-lg p-3.5 flex items-center gap-3 text-slate-800 text-sm">
          <div className="w-5 h-5 rounded-full bg-[#0284c7] flex items-center justify-center text-white shrink-0">
            <Info className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <p className="text-slate-800 font-normal leading-relaxed">
            Aşağıda seçilen faaliyetler, belirtilen Kaynak Birim'den Hedef Birim'e taşınacaktır.
          </p>
        </div>

        {/* Form Fields: Kaynak Birim & Hedef Birim */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Kaynak Birim */}
          <div className="space-y-1.5">
            <label
              htmlFor="source-unit-select"
              className="block text-sm font-semibold text-slate-800"
            >
              Kaynak Birim
            </label>
            <div className="relative">
              <select
                id="source-unit-select"
                value={sourceUnit}
                onChange={(e) => handleSourceUnitChange(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-800 shadow-2xs hover:border-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.name}>
                    {unit.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Hedef Birim * */}
          <div className="space-y-1.5">
            <label
              htmlFor="target-unit-select"
              className="block text-sm font-semibold text-slate-800"
            >
              Hedef Birim <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <select
                id="target-unit-select"
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-800 shadow-2xs hover:border-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
              >
                {units.map((unit) => (
                  <option
                    key={unit.id}
                    value={unit.name}
                    disabled={unit.name === sourceUnit || !unit.isActive}
                  >
                    {unit.name} {unit.name === sourceUnit ? '(Kaynak Birim)' : !unit.isActive ? '(Pasif Birim)' : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Transfer Gerekçesi * */}
        <div className="space-y-1.5">
          <label
            htmlFor="transfer-reason"
            className="block text-sm font-semibold text-slate-800"
          >
            Transfer Gerekçesi <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="space-y-1">
            <textarea
              id="transfer-reason"
              rows={3}
              maxLength={500}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Transfer gerekçesini yazınız..."
              className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-hidden resize-y min-h-[90px]"
            />
            <div className="flex justify-end text-xs text-slate-500 tabular-nums">
              {reason.length}/500
            </div>
          </div>
        </div>

        {/* Transfer Edilecek Faaliyetler Header & Search */}
        <div className="space-y-3 pt-2">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Transfer Edilecek Faaliyetler
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Faaliyet adı ile ara..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Selection Counter */}
            <div className="text-sm font-semibold text-[#0284c7] tabular-nums whitespace-nowrap">
              Seçili: {selectedIds.length} / {sourceActivities.length}
            </div>
          </div>

          {/* Activities Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-[#f8fafc] border-b border-slate-200 text-xs font-semibold text-slate-800">
                <tr>
                  <th scope="col" className="w-12 px-4 py-3.5 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAllFilteredSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = isIndeterminate;
                        }}
                        onChange={handleToggleSelectAll}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                          isAllFilteredSelected || isIndeterminate
                            ? 'bg-[#0284c7] border-[#0284c7] text-white'
                            : 'border-slate-300 bg-white hover:border-slate-400'
                        }`}
                      >
                        {isAllFilteredSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        {isIndeterminate && !isAllFilteredSelected && (
                          <div className="w-2 h-0.5 bg-white rounded-xs" />
                        )}
                      </div>
                    </label>
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-semibold text-slate-900">
                    Faaliyet Adı
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-semibold text-slate-900">
                    Dosya Adı
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-semibold text-slate-900">
                    Başlangıç / Bitiş Tarihi
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-semibold text-slate-900">
                    Mevcut Birim
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">
                      {sourceActivities.length === 0
                        ? `"${sourceUnit}" birimine kayıtlı faaliyet bulunmuyor.`
                        : 'Arama kriterine uygun faaliyet bulunamadı.'}
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((activity) => {
                    const isSelected = selectedIds.includes(activity.id);
                    return (
                      <tr
                        key={activity.id}
                        onClick={() => toggleSelectActivity(activity.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-sky-50/50 hover:bg-sky-50' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Checkbox Cell */}
                        <td
                          className="w-12 px-4 py-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectActivity(activity.id)}
                              className="sr-only"
                            />
                            <div
                              className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-[#0284c7] border-[#0284c7] text-white shadow-2xs'
                                  : 'border-slate-300 bg-white hover:border-slate-400'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </label>
                        </td>

                        {/* Faaliyet Adı */}
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {activity.title}
                        </td>

                        {/* Dosya Adı */}
                        <td className="px-4 py-3 text-slate-600">
                          {activity.fileName}
                        </td>

                        {/* Başlangıç / Bitiş Tarihi */}
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                          {activity.dateRange}
                        </td>

                        {/* Mevcut Birim */}
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                          {activity.currentUnit}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Warning Alert */}
        <div className="bg-[#e1f0fe] border border-[#bee0fd] rounded-lg p-3.5 flex items-center gap-3 text-slate-800 text-sm">
          <div className="text-[#0284c7] shrink-0">
            <AlertTriangle className="w-5 h-5 fill-[#0284c7] text-white" />
          </div>
          <p className="text-slate-800 font-normal leading-relaxed">
            Seçili faaliyetlerin devam eden onay süreçleri bulunuyorsa, bu transfer işlemi bu süreçleri etkileyecektir.
          </p>
        </div>

        {/* Bottom Actions: İptal & Transfer Et */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-[#0284c7] bg-white px-7 py-2.5 text-sm font-medium text-[#0284c7] hover:bg-sky-50 transition-colors focus:outline-hidden cursor-pointer"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleValidateAndOpenConfirm}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0284c7] hover:bg-[#0275b1] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors focus:outline-hidden cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Transfer Et</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Transfer İşlemini Onayla
                  </h3>
                  <p className="text-xs text-slate-500">
                    Seçili faaliyetlerin birim değişikliğini onaylayın
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs md:text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 text-xs block">Kaynak Birim</span>
                  <span className="font-semibold text-slate-800">{sourceUnit}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Hedef Birim</span>
                  <span className="font-semibold text-sky-700">{targetUnit}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-xs block mb-1">Transfer Gerekçesi</span>
                <p className="p-2.5 bg-slate-50 rounded-md border border-slate-200 text-slate-800 italic">
                  "{reason}"
                </p>
              </div>

              <div>
                <span className="text-slate-500 text-xs block mb-1">
                  Aktarılacak Faaliyetler ({selectedActivitiesList.length} adet)
                </span>
                <ul className="max-h-32 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-md border border-slate-200">
                  {selectedActivitiesList.map((item) => (
                    <li key={item.id} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800 truncate pr-2">
                        • {item.title}
                      </span>
                      {item.hasPendingApproval && (
                        <span className="text-[11px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-sm shrink-0">
                          Onay Sürecinde
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {hasPendingApprovalInSelected && (
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex items-start gap-2 text-amber-800 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    Seçili bazı faaliyetlerin onay süreci devam etmektedir. Transfer edildiğinde onay yetkisi hedef birime geçecektir.
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmTransfer}
                className="px-5 py-2 rounded-lg bg-[#0284c7] hover:bg-[#0275b1] text-sm font-semibold text-white transition-colors shadow-xs"
              >
                Transferi Gerçekleştir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-sky-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Transfer Geçmişi & Denetim İzi
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {transferHistory.length === 0 ? (
                <p className="text-center py-8 text-sm text-slate-400">
                  Henüz birim transfer kaydı bulunmamaktadır.
                </p>
              ) : (
                transferHistory.map((record) => (
                  <div
                    key={record.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-800 font-semibold">
                        <span>{record.sourceUnit}</span>
                        <ArrowRightLeft className="w-3.5 h-3.5 text-sky-600" />
                        <span className="text-sky-700">{record.targetUnit}</span>
                      </div>
                      <span className="text-slate-500 tabular-nums">{record.timestamp}</span>
                    </div>

                    <p className="text-slate-700">
                      <span className="font-medium text-slate-500">Gerekçe: </span>
                      {record.reason}
                    </p>

                    <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Aktarılan Faaliyet: {record.transferredCount} adet ({record.activityTitles.join(', ')})</span>
                      <span className="font-medium">Yetkili: {record.operator}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {onUndoLastTransfer && transferHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onUndoLastTransfer();
                    setShowHistoryModal(false);
                    setToastMessage({
                      type: 'info',
                      text: 'Son transfer işlemi geri alındı.',
                    });
                  }}
                  className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Son Transferi Geri Al</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="ml-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-xs font-semibold text-white transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
