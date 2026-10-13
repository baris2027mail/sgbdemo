import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  Send,
  Eye,
  GitBranch,
  Layers,
  FileCheck,
  Package,
  ShieldCheck,
  Info,
  AlertCircle,
} from 'lucide-react';
import { Activity, ActivityFile, User } from '../types';

interface OnayIslemleriProps {
  activities: Activity[];
  currentUser: User;
  onApprove: (activityId: string, isFinal: boolean) => void;
  onReject: (activityId: string, reason: string) => void;
  onReopen: (activityId: string, reason: string) => void;
}

export const OnayIslemleri: React.FC<OnayIslemleriProps> = ({
  activities,
  currentUser,
  onApprove,
  onReject,
  onReopen,
}) => {
  // Navigation between Pending vs Approved items
  const [mainView, setMainView] = useState<'bekleyen' | 'onaylanan'>('bekleyen');

  // Filter activities
  const pendingActivities = activities.filter((a) => a.approvalStatus === 'Onay Bekliyor');
  const approvedActivities = activities.filter((a) => a.approvalStatus === 'Onaylandı');

  // Selected item to review in bottom card (Matching Şekil 8)
  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    pendingActivities[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'detaylar' | 'dosyalar' | 'onay-akisi'>('detaylar');

  // Reject / Return Modal (Matching Şekil 9 İade Gerekçesi Ekranı)
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Reopen Modal (Matching Şekil 10 Yeniden Düzenlemeye Açma Ekranı)
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenTargetActivity, setReopenTargetActivity] = useState<Activity | null>(null);
  const [reopenReason, setReopenReason] = useState('');

  // Selected activity object
  const activeActivity = activities.find((a) => a.id === selectedActivityId);

  // Success / Feedback notification
  const [feedback, setFeedback] = useState<string | null>(null);

  // Authorization check for reopening approved activities
  const isAuthorizedToReopen =
    currentUser.canReopen ||
    currentUser.role === 'Yetkili Onaycı' ||
    currentUser.role === 'İş Birimi Admini';

  // Determine if active pending task is a File Package vs Full Activity
  const isFilePackageApproval = activeActivity?.pendingApprovalType === 'Dosya';
  const targetFilesCount = activeActivity?.pendingApprovalFileIds?.length || activeActivity?.files.length || 0;

  const handleConfirmApprove = () => {
    if (!activeActivity) return;
    onApprove(activeActivity.id, true);
    setFeedback(
      isFilePackageApproval
        ? `"${activeActivity.title}" faaliyeti kapsamındaki dosya paketi (${targetFilesCount} dosya) başarıyla onaylandı. Faaliyet gövdesi bağımsız kaldı.`
        : `"${activeActivity.title}" faaliyeti ve bağlı tüm dosyalar tek paket halinde başarıyla onaylandı.`
    );
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleConfirmReject = () => {
    if (!activeActivity || !rejectReason.trim()) {
      alert('Lütfen iade gerekçesini yazınız.');
      return;
    }
    onReject(activeActivity.id, rejectReason.trim());
    setShowRejectModal(false);
    setRejectReason('');
    setFeedback(
      isFilePackageApproval
        ? `"${activeActivity.title}" faaliyeti dosya paketi gerekçesiyle iade edildi.`
        : `"${activeActivity.title}" faaliyeti gerekçesiyle iade edildi.`
    );
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleConfirmReopen = () => {
    if (!reopenTargetActivity || !reopenReason.trim()) {
      alert('Lütfen yeniden faaliyete açma gerekçesini yazınız.');
      return;
    }
    onReopen(reopenTargetActivity.id, reopenReason.trim());
    setShowReopenModal(false);
    setReopenReason('');
    setFeedback(`"${reopenTargetActivity.title}" faaliyeti yeniden düzenlemeye açıldı.`);
    setReopenTargetActivity(null);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider">
            <CheckSquare className="w-4 h-4" />
            <span>Onay Süreçleri Yönetimi (UC-04)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Onay İşlemleri ve Onaycı Ekranı
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Faaliyet onayı ve dosya paketi onayı ayrımı ile değerlendirme, onaylama, iade ve yeniden düzenlemeye açma işlemleri
          </p>
        </div>

        {/* Top View Toggle Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setMainView('bekleyen')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              mainView === 'bekleyen'
                ? 'bg-white text-sky-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Onay Bekleyenler ({pendingActivities.length})</span>
          </button>
          <button
            onClick={() => setMainView('onaylanan')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              mainView === 'onaylanan'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Onaylanmış Faaliyetler ({approvedActivities.length})</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)}>
            <X className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GÖRÜNÜM 1: ONAY BEKLEYENLER                                               */}
      {/* ========================================================================= */}
      {mainView === 'bekleyen' && (
        <>
          {/* Top Table: Onay Bekleyen İşlemler (Matching Şekil 8 Üst Tablo) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Onay Bekleyen İşlemler
                </h2>
                <p className="text-xs text-slate-500">
                  Dosya onayları paket halinde, faaliyet onayları ise tüm ekleriyle birlikte değerlendirilir.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md tabular-nums">
                {pendingActivities.length} Görev Bekliyor
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs md:text-sm text-slate-700">
                <thead className="bg-[#f8fafc] border-b border-slate-200 font-semibold text-slate-800">
                  <tr>
                    <th className="px-4 py-3">Onay Türü</th>
                    <th className="px-4 py-3">Adı ve Kapsamı</th>
                    <th className="px-4 py-3">Birim</th>
                    <th className="px-4 py-3">Gönderim Tarihi</th>
                    <th className="px-4 py-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingActivities.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-xs">
                        Şu anda onay bekleyen faaliyet veya dosya paketi bulunmamaktadır.
                      </td>
                    </tr>
                  ) : (
                    pendingActivities.map((act) => {
                      const isSelected = act.id === selectedActivityId;
                      const isDosya = act.pendingApprovalType === 'Dosya';
                      const fileCount = act.pendingApprovalFileIds?.length || act.files.length;

                      return (
                        <tr
                          key={act.id}
                          onClick={() => setSelectedActivityId(act.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-sky-50/70 font-medium' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="px-4 py-3">
                            {isDosya ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold">
                                <Package className="w-3.5 h-3.5 text-purple-600" />
                                <span>Dosya Onayı (Paket)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold">
                                <FileCheck className="w-3.5 h-3.5 text-sky-600" />
                                <span>Faaliyet Onayı (Tümden)</span>
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-900 block">{act.title}</span>
                            {isDosya && (
                              <span className="text-[11px] text-purple-700 block mt-0.5">
                                Paket Kapsamı: {fileCount} adet seçili dosya
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{act.currentUnit}</td>
                          <td className="px-4 py-3 text-slate-500 tabular-nums">
                            {act.startDate}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedActivityId(act.id);
                              }}
                              className={`px-3 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                                isSelected
                                  ? 'bg-[#0284c7] text-white shadow-2xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Görüntüle</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Card: Onay Detayı & Scope Banner (Matching Şekil 8) */}
          {activeActivity && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5">
              {/* Scope Notification Banner (Faaliyet Onayı mı Dosya Onayı mı net ayrımı!) */}
              {isFilePackageApproval ? (
                <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Package className="w-5 h-5 text-purple-600 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-purple-950">
                        Dosya Onayı İncelemesi (Paket Halinde)
                      </p>
                      <p className="text-purple-800 text-xs">
                        Bu işlem sonucunda <strong>yalnızca pakete dahil edilen {targetFilesCount} adet dosya onaylanacaktır.</strong> Faaliyetin ana durumu bağımsız kalacaktır.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-purple-300 text-purple-800 font-bold shrink-0">
                    Paket Kapsamı: {targetFilesCount} Dosya
                  </span>
                </div>
              ) : (
                <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-lg text-sky-900 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-5 h-5 text-sky-600 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-sky-950">
                        Faaliyet Onayı İncelemesi (Tümden Onay)
                      </p>
                      <p className="text-sky-800 text-xs">
                        Bu işlem sonucunda <strong>tüm faaliyet bilgileri ve faaliyete bağlı bütün dosyalar ({activeActivity.files.length} dosya) birlikte onaylanacak</strong> ve faaliyet durumu <em>"Tamamlandı"</em> statüsüne geçirilecektir.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-sky-300 text-sky-800 font-bold shrink-0">
                    Tüm Faaliyet + {activeActivity.files.length} Dosya
                  </span>
                </div>
              )}

              {/* Tabs: Detaylar, Dosyalar, Onay Akışı */}
              <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('detaylar')}
                  className={`pb-2.5 px-3 border-b-2 transition-colors ${
                    activeTab === 'detaylar'
                      ? 'border-[#0284c7] text-[#0284c7]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Detaylar
                </button>
                <button
                  onClick={() => setActiveTab('dosyalar')}
                  className={`pb-2.5 px-3 border-b-2 transition-colors ${
                    activeTab === 'dosyalar'
                      ? 'border-[#0284c7] text-[#0284c7]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Dosyalar ({activeActivity.files.length})
                </button>
                <button
                  onClick={() => setActiveTab('onay-akisi')}
                  className={`pb-2.5 px-3 border-b-2 transition-colors ${
                    activeTab === 'onay-akisi'
                      ? 'border-[#0284c7] text-[#0284c7]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Onay Akışı
                </button>
              </div>

              {/* Tab 1: Detaylar */}
              {activeTab === 'detaylar' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div>
                      <span className="text-slate-500 block">Faaliyet Adı:</span>
                      <span className="font-bold text-slate-900 text-sm">{activeActivity.title}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Daire Başkanlığı & Birim:</span>
                      <span className="font-semibold text-slate-800">{activeActivity.department} · {activeActivity.currentUnit}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Tarih Aralığı:</span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {activeActivity.startDate} - {activeActivity.estimatedEndDate}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-slate-500 block font-semibold">Faaliyet Açıklaması:</span>
                    <p className="text-slate-700 leading-relaxed text-xs">
                      {activeActivity.description}
                    </p>
                    <div className="pt-2 text-[11px] text-slate-400">
                      Oluşturan: {activeActivity.createdUser} ({activeActivity.createdDate})
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Dosyalar */}
              {activeTab === 'dosyalar' && (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-700 font-semibold">
                      <tr>
                        <th className="px-4 py-2.5">Dosya Adı</th>
                        <th className="px-4 py-2.5">Açıklama</th>
                        <th className="px-3 py-2.5">Boyut</th>
                        <th className="px-3 py-2.5">Paket Durumu</th>
                        <th className="px-3 py-2.5 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeActivity.files.map((f) => {
                        const isInPackage =
                          !isFilePackageApproval ||
                          (activeActivity.pendingApprovalFileIds &&
                            activeActivity.pendingApprovalFileIds.includes(f.id));

                        return (
                          <tr key={f.id} className={isInPackage ? 'bg-sky-50/40' : 'hover:bg-slate-50'}>
                            <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5 text-sky-600" />
                              <span>{f.name}</span>
                            </td>
                            <td className="px-4 py-2.5 text-slate-600">{f.description || '-'}</td>
                            <td className="px-3 py-2.5 text-slate-500 tabular-nums">{f.size}</td>
                            <td className="px-3 py-2.5">
                              {isInPackage ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-800 font-bold border border-purple-200">
                                  ✓ Onay Paketinde
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
                                  Paket Dışı
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <button
                                onClick={() => alert(`${f.name} indiriliyor...`)}
                                className="text-sky-600 hover:text-sky-800 font-semibold"
                              >
                                İndir
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 3: Onay Akışı */}
              {activeTab === 'onay-akisi' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-sky-600" />
                    <span>Hiyerarşik Onay Zinciri</span>
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 font-medium text-emerald-800">
                      <span className="text-[10px] text-emerald-600 block">1. Aşama</span>
                      <span>Şube Amiri Onayı (Tamamlandı)</span>
                    </div>
                    <span className="text-slate-400 font-bold">→</span>
                    <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-300 font-bold text-sky-900 shadow-2xs">
                      <span className="text-[10px] text-sky-600 block">2. Aşama (Şu Anda)</span>
                      <span>{currentUser.fullName} ({currentUser.role})</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons: İptal / Onayla / İade Et */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedActivityId('')}
                  className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Kapat
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowRejectModal(true)}
                    className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{isFilePackageApproval ? 'Dosya Paketini İade Et' : 'Faaliyeti İade Et'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmApprove}
                    className="px-6 py-2 rounded-lg bg-[#0284c7] hover:bg-[#0275b1] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {isFilePackageApproval
                        ? `Dosya Paketini Onayla (${targetFilesCount} Dosya)`
                        : 'Faaliyeti ve Tüm Dosyaları Onayla'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* GÖRÜNÜM 2: ONAYLANMIŞ FAALİYETLER & YENİDEN DÜZENLEMEYE AÇMA              */}
      {/* ========================================================================= */}
      {mainView === 'onaylanan' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Onaylanmış Faaliyetler Arşivi
              </h2>
              <p className="text-xs text-slate-500">
                Yetkili Onaycı veya İş Birimi Admini yetkisiyle onaylı kayıtları gerekçe belirterek yeniden düzenlemeye açabilirsiniz.
              </p>
            </div>
            {isAuthorizedToReopen ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Yetkili Onaycı Yetkisi: Aktif (Yeniden Düzenlemeye Açabilirsiniz)</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                Salt Okunur Arşiv (Yetkili Onaycı rolü gereklidir)
              </span>
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs md:text-sm text-slate-700">
              <thead className="bg-[#f8fafc] border-b border-slate-200 font-semibold text-slate-800">
                <tr>
                  <th className="px-4 py-3">Faaliyet Adı</th>
                  <th className="px-4 py-3">Daire Başkanlığı / Birim</th>
                  <th className="px-4 py-3">Dosyalar</th>
                  <th className="px-4 py-3">Onay Tarihi</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvedActivities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-xs">
                      Henüz onaylanmış faaliyet kaydı bulunmamaktadır.
                    </td>
                  </tr>
                ) : (
                  approvedActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{act.title}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">
                        <span className="font-medium text-slate-800 block">{act.department}</span>
                        <span className="text-slate-400">{act.currentUnit}</span>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-slate-500">
                        {act.files.length} dosya eklendi
                      </td>
                      <td className="px-4 py-3 tabular-nums font-semibold text-emerald-700">
                        {act.approvalDate || '15.12.2026'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isAuthorizedToReopen ? (
                          <button
                            onClick={() => {
                              setReopenTargetActivity(act);
                              setReopenReason('');
                              setShowReopenModal(true);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 ml-auto shadow-2xs transition-colors cursor-pointer"
                            title="Onaylı faaliyeti yeniden düzenlemeye aç"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Yeniden Düzenlemeye Aç</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs italic">
                            Yalnızca Yetkili Onaycı
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Şekil 9: İade İşlemi ve Gerekçe Modalı                                     */}
      {/* ========================================================================= */}
      {showRejectModal && activeActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">İade Gerekçesi</h3>
              <button onClick={() => setShowRejectModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  Bu işlem ile {isFilePackageApproval ? 'dosya paketi' : 'faaliyet'} iade edilecektir.
                </p>
                <p className="text-rose-700 mt-0.5">Lütfen iade gerekçesini ayrıntılı olarak giriniz.</p>
              </div>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Faaliyet Adı:</span>
                  <span className="font-semibold text-slate-800">{activeActivity.title}</span>
                </div>
                {isFilePackageApproval && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">İade Edilen Paket:</span>
                    <span className="font-semibold text-purple-700">{targetFilesCount} adet dosya</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800">
                    İade Gerekçesi <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <span className="text-xs text-slate-400 tabular-nums">{rejectReason.length}/500</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={500}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="İade gerekçesini yazınız..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>İade Et</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Şekil 10: Yeniden Düzenlemeye Açma Modalı (Yetkili Onaycı)                  */}
      {/* ========================================================================= */}
      {showReopenModal && reopenTargetActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Yeniden Faaliyete Açma (Yetkili Onaycı)
              </h3>
              <button onClick={() => setShowReopenModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  Bu işlem ile onaylanmış faaliyet ve bağlı tüm dosyalar yeniden düzenlenmeye açılacaktır.
                </p>
                <p className="text-amber-800 mt-0.5">
                  Faaliyet durumu "Devam Ediyor" statüsüne çekilecek ve önceki onay tarihi sistem geçmişinde saklanacaktır. Lütfen açıklama giriniz.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-slate-500 text-xs block">Faaliyet Adı:</span>
                  <span className="font-semibold text-slate-800">{reopenTargetActivity.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Onay Tarihi:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {reopenTargetActivity.approvalDate || '15.12.2026'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800">
                    Açıklama / Gerekçe <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <span className="text-xs text-slate-400 tabular-nums">{reopenReason.length}/500</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={500}
                  required
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="Yeniden faaliyete açma gerekçesini yazınız..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReopenModal(false)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmReopen}
                className="px-5 py-2 bg-[#0284c7] hover:bg-[#0275b1] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yeniden Faaliyete Aç</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
