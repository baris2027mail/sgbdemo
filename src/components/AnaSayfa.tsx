import React from 'react';
import {
  FileText,
  Building2,
  Clock,
  ArrowRightLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Send,
  Plus,
  GitBranch,
} from 'lucide-react';
import { Activity, Unit, TransferRecord, User, FiscalYear } from '../types';
import { ActivePage } from './Sidebar';

interface AnaSayfaProps {
  activities: Activity[];
  units: Unit[];
  transfers: TransferRecord[];
  currentUser: User;
  currentFiscalYear: FiscalYear;
  onNavigate: (page: ActivePage) => void;
}

export const AnaSayfa: React.FC<AnaSayfaProps> = ({
  activities,
  units,
  transfers,
  currentUser,
  currentFiscalYear,
  onNavigate,
}) => {
  const pendingCount = activities.filter((a) => a.approvalStatus === 'Onay Bekliyor').length;
  const approvedCount = activities.filter((a) => a.approvalStatus === 'Onaylandı').length;
  const returnedCount = activities.filter((a) => a.approvalStatus === 'İade Edildi').length;
  const draftCount = activities.filter((a) => a.approvalStatus === 'Taslak').length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* SGK & SGB Portal Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-[#0a223e] via-[#0284c7] to-[#0369a1] p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-sky-200 font-bold bg-white/10 px-2 py-0.5 rounded-sm">
              SGK · Strateji Geliştirme Başkanlığı
            </span>
            <span className="text-[11px] text-sky-200">
              Talep No: 7108 · İş Analizi v1.0
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            SGB Kurumsal Faaliyet ve Onay Portalı
          </h1>
          <p className="text-xs md:text-sm text-sky-100 max-w-2xl leading-relaxed">
            Kurum bünyesindeki faaliyetlerin merkezi olarak oluşturulması, Belgenet organizasyon yapısıyla uyumlu takibi, hiyerarşik onay süreçleri ve birimler arası yetki devirleri.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('faaliyetler')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white text-[#035496] font-bold text-xs hover:bg-sky-50 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Faaliyet</span>
          </button>
          <button
            onClick={() => onNavigate('birim-transferi')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-sky-600/80 hover:bg-sky-600 text-white font-semibold text-xs transition-colors border border-white/20"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Birim Transferi</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Toplam Faaliyet */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Toplam Faaliyet</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {activities.length}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">{approvedCount}</span> onaylı ·
            <span className="font-semibold text-amber-700">{pendingCount}</span> onay bekliyor
          </div>
        </div>

        {/* Onay Bekleyenler */}
        <div
          onClick={() => onNavigate('onay-islemleri')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2 cursor-pointer hover:border-sky-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Onay Bekleyenler</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 tabular-nums">
            {pendingCount}
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>İnceleme bekleyen görevler</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Onaylanan / Tamamlanan */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Onaylanan Faaliyetler</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 tabular-nums">
            {approvedCount}
          </div>
          <div className="text-xs text-slate-500">
            {returnedCount > 0 ? `${returnedCount} faaliyet iade edildi` : 'Tamamlanmış süreçler'}
          </div>
        </div>

        {/* Aktif Birim Sayısı */}
        <div
          onClick={() => onNavigate('birim-aktifligi')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2 cursor-pointer hover:border-sky-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Teşkilat Birimleri</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {units.filter((u) => u.isActive).length} / {units.length}
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Aktif / Toplam Birim</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Two Columns: Birim Faaliyet Dağılımı & Son Transfer / Onay Hareketleri */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Birim Dağılımı */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-base font-bold text-slate-900">
              Birimlere Göre Faaliyet Dağılımı
            </h2>
            <button
              onClick={() => onNavigate('faaliyetler')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Listeyi Gör</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {units.map((unit) => {
              const count = activities.filter((a) => a.currentUnit === unit.name).length;
              const percent = activities.length > 0 ? Math.round((count / activities.length) * 100) : 0;
              return (
                <div key={unit.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{unit.name}</span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {count} faaliyet ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-[#0284c7] rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Son Birim Transferleri & Onay Hareketleri */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-base font-bold text-slate-900">
              Son Birim Transferi Kayıtları
            </h2>
            <button
              onClick={() => onNavigate('birim-transferi')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Transfer Ekranı</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {transfers.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                Henüz transfer kaydı bulunmamaktadır.
              </p>
            ) : (
              transfers.slice(0, 4).map((record) => (
                <div
                  key={record.id}
                  className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <span className="truncate max-w-[140px]">{record.sourceUnit}</span>
                      <ArrowRightLeft className="w-3 h-3 text-sky-600 shrink-0" />
                      <span className="text-sky-700 truncate max-w-[140px]">{record.targetUnit}</span>
                    </div>
                    <span className="text-slate-400 tabular-nums">{record.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] truncate">
                    <strong>Gerekçe: </strong> {record.reason}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                    <span>{record.transferredCount} adet faaliyet taşındı</span>
                    <span>Yetkili: {record.operator}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
