import React, { useState } from 'react';
import {
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  History,
  X,
  Info,
} from 'lucide-react';
import { FiscalYear } from '../types';

interface FaaliyetYiliProps {
  fiscalYears: FiscalYear[];
  onUpdateFiscalYear: (
    yearStr: string,
    newPlannedDate: string,
    unlockReason?: string
  ) => void;
}

export const FaaliyetYili: React.FC<FaaliyetYiliProps> = ({
  fiscalYears,
  onUpdateFiscalYear,
}) => {
  // Currently active fiscal year
  const activeYearObj = fiscalYears.find((y) => !y.isLocked) || fiscalYears[0];

  // Selected year for Modal editing (Matching Şekil 14)
  const [selectedYearObj, setSelectedYearObj] = useState<FiscalYear | null>(null);
  const [modalDate, setModalDate] = useState('');
  const [modalReason, setModalReason] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleOpenLockModal = (yr: FiscalYear) => {
    setSelectedYearObj(yr);
    setModalDate(yr.plannedLockDate);
    setModalReason('');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYearObj) return;

    if (selectedYearObj.isLocked && !modalReason.trim()) {
      alert('Kilitli yılı yeniden aktif hale getirmek için gerekçe girilmesi zorunludur. (İş Kuralı 7108-UC5-BR-030)');
      return;
    }

    onUpdateFiscalYear(selectedYearObj.year, modalDate.trim(), modalReason.trim());
    setSelectedYearObj(null);
    setFeedback(
      selectedYearObj.isLocked
        ? `${selectedYearObj.year} faaliyet yılı gerekçe belirtilerek yeniden aktif hale getirildi.`
        : `${selectedYearObj.year} faaliyet yılı için planlanan kilitleme tarihi güncellendi.`
    );
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>Yönetim Paneli (UC-05)</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          Faaliyet Yılı ve Dönem Kilit Yönetimi
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Takvim parametrelerine bağlı otomatik yıl kilitleme, kilitli dönem kontrolü ve yeniden aktif etme kuralları
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Mevcut Yıl Bilgisi Card (Matching Şekil 14 Üst Alan) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-3">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Mevcut Yıl Bilgisi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <div>
            <span className="text-slate-500 block">Faaliyet Yılı</span>
            <span className="font-bold text-slate-900 text-lg tabular-nums">
              {activeYearObj.year}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Durum</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Aktif</span>
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Kilitlenme Tarihi</span>
            <span className="font-semibold text-slate-800 text-sm flex items-center gap-1.5 mt-1 tabular-nums">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{activeYearObj.plannedLockDate}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Yıl İşlemleri Tablosu (Matching Şekil 14 Tablo) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Yıl İşlemleri
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs md:text-sm text-slate-700">
            <thead className="bg-[#f8fafc] border-b border-slate-200 font-semibold text-slate-800">
              <tr>
                <th className="px-4 py-3">Yıl</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Kilitlenme Tarihi</th>
                <th className="px-4 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fiscalYears.map((fy) => (
                <tr key={fy.year} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-900 tabular-nums">
                    {fy.year}
                  </td>
                  <td className="px-4 py-3">
                    {fy.isLocked ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                        <Lock className="w-3 h-3 text-rose-600" />
                        <span>Kilitli</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        <Unlock className="w-3 h-3 text-emerald-600" />
                        <span>Aktif</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 tabular-nums">
                    {fy.plannedLockDate}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleOpenLockModal(fy)}
                      className="px-3 py-1.5 rounded-md bg-[#0284c7] hover:bg-[#0275b1] text-white text-xs font-semibold shadow-2xs transition-colors"
                    >
                      Kilit Yönetimi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Şekil 14: YIL KİLİT YÖNETİMİ Modalları (Açık & Kilitli Durumlar)           */}
      {/* ========================================================================= */}
      {selectedYearObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">YIL KİLİT YÖNETİMİ</h3>
              <button onClick={() => setSelectedYearObj(null)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bilgilendirme Kutusu (Matching Şekil 14 Açıklama Şeridi) */}
            <div className="p-3 bg-[#e1f0fe] border border-[#bee0fd] rounded-lg text-slate-800 text-xs flex items-center gap-2.5">
              <Info className="w-4 h-4 text-[#0284c7] shrink-0" />
              <span>
                Seçilen faaliyet yılı için planlanan kilitleme tarihini güncelleyebilir veya kilitli yılın yeniden aktif hale getirilmesi işlemini yapabilirsiniz.
              </span>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs md:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-slate-500 block text-xs">Faaliyet Yılı</span>
                  <span className="font-bold text-slate-900 text-base tabular-nums">
                    {selectedYearObj.year}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Yıl Durumu</span>
                  {selectedYearObj.isLocked ? (
                    <span className="px-2 py-0.5 rounded-sm bg-rose-600 text-white font-bold text-xs inline-block mt-0.5">
                      Kilitli
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-sm bg-emerald-600 text-white font-bold text-xs inline-block mt-0.5">
                      Açık
                    </span>
                  )}
                </div>
              </div>

              {/* Status Info Card on the right side of mockup */}
              {!selectedYearObj.isLocked ? (
                // Durum: Açık Yıl Bilgisi (Şekil 14 üst modal)
                <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-lg space-y-1 text-xs">
                  <p className="font-bold text-sky-900">Açık Yıl Bilgisi</p>
                  <p className="text-slate-700">
                    Seçilen yıl şu anda açıktır. Planlanan kilitleme tarihini güncelleyebilirsiniz.
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    * Açık yıl durumunda gerekçe alanı görüntülenmez.
                  </p>
                </div>
              ) : (
                // Durum: Kilitli Yıl Bilgisi (Şekil 14 alt modal)
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg space-y-1 text-xs">
                  <p className="font-bold text-rose-900">Kilitli Yıl Bilgisi</p>
                  <p className="text-slate-700">
                    Seçilen yıl kilitlidir. Planlanan kilitleme tarihini güncelleyebilir ve yeniden aktif hale getirmek için gerekçe belirtebilirsiniz.
                  </p>
                  <p className="text-[11px] text-rose-700 font-semibold pt-1">
                    * Yeniden aktif hale getirme işlemi için gerekçe alanı zorunludur.
                  </p>
                </div>
              )}

              {/* Planlanan Kilitleme Tarihi Input */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 block">
                  Planlanan Kilitleme Tarihi
                </label>
                <input
                  type="text"
                  required
                  value={modalDate}
                  onChange={(e) => setModalDate(e.target.value)}
                  placeholder="GG.AA.YYYY (Örn: 31.12.2026)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              {/* Yeniden Aktif Hale Getirme Gerekçesi (Yalnızca Kilitli Yıl ise) */}
              {selectedYearObj.isLocked && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-800">
                      Yeniden Aktif Hale Getirme Gerekçesi <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <span className="text-xs text-slate-400 tabular-nums">{modalReason.length}/500</span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    required
                    value={modalReason}
                    onChange={(e) => setModalReason(e.target.value)}
                    placeholder="Yeniden aktif hale getirme gerekçesini giriniz..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedYearObj(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0284c7] hover:bg-[#0275b1] text-white rounded-lg text-xs font-semibold shadow-xs"
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
