import React from 'react';
import { User as UserIcon, Shield, HardDrive, RotateCcw, X, Check, Building2, Key, Database } from 'lucide-react';
import { User } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onResetAllData: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onResetAllData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 text-[#0284c7] font-bold text-sm flex items-center justify-center">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{currentUser.fullName}</h3>
              <p className="text-xs text-slate-500 font-mono">Sicil: {currentUser.sicilNo} · {currentUser.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-50 border border-slate-100 rounded-lg">
            <div>
              <span className="text-slate-400 block text-[11px]">Rolü:</span>
              <span className="font-bold text-sky-800">{currentUser.role}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Ünvanı:</span>
              <span className="font-semibold text-slate-800">{currentUser.title}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Daire Başkanlığı:</span>
              <span className="font-semibold text-slate-800">{currentUser.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Birim (Grup/Müdürlük):</span>
              <span className="font-semibold text-slate-800">{currentUser.unit}</span>
            </div>
          </div>

          <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-lg space-y-2">
            <span className="font-bold text-slate-800 block">Entegrasyon & Yetki Parametreleri (MEYES & Belgenet)</span>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-2">
                <Check className={`w-3.5 h-3.5 ${currentUser.isApproverCandidate ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>Onaycı Adayı: <strong>{currentUser.isApproverCandidate ? 'Evet' : 'Hayır'}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className={`w-3.5 h-3.5 ${currentUser.canReopen ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>Yeniden Düzenlemeye Açma Yetkisi: <strong>{currentUser.canReopen ? 'Var (Yetkili Onaycı)' : 'Yok'}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-sky-600" />
                <span>Belgenet Organizasyon Senkronizasyonu: <strong>Aktif ({currentUser.lastSyncDate})</strong></span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Tüm verileri ilk başlangıç durumuna sıfırlamak istiyor musunuz?')) {
                onResetAllData();
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tüm Verileri Sıfırla</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
