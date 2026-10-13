import React from 'react';
import {
  Home,
  FileText,
  Settings,
  User as UserIcon,
  X,
  CheckSquare,
  Building2,
  Users,
  GitBranch,
  Calendar,
  ArrowRightLeft,
} from 'lucide-react';
import { SgbLogo } from './SgbLogo';
import { User } from '../types';

export type ActivePage =
  | 'ana-sayfa'
  | 'faaliyetler'
  | 'onay-islemleri'
  | 'birim-aktifligi'
  | 'personel-aktifligi'
  | 'onay-akisi'
  | 'onayci-devir'
  | 'faaliyet-yili'
  | 'birim-transferi';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenProfileModal?: () => void;
  pendingApprovalsCount: number;
  currentUser: User;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  onOpenProfileModal,
  pendingApprovalsCount,
  currentUser,
}) => {
  const isYonetimActive = [
    'birim-aktifligi',
    'personel-aktifligi',
    'onay-akisi',
    'onayci-devir',
    'faaliyet-yili',
    'birim-transferi',
  ].includes(activePage);

  // Strict role-based menu visibility
  const canAccessManagement = currentUser.role === 'İş Birimi Admini';
  const canAccessApprovals = ['Onaycı', 'Yetkili Onaycı', 'İş Birimi Admini'].includes(currentUser.role);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-[#0b2444] text-white shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
          <button
            onClick={() => {
              onNavigate('ana-sayfa');
              onCloseMobile();
            }}
            className="flex items-center gap-3 text-left focus:outline-hidden group"
          >
            <SgbLogo size={36} />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-sky-200 transition-colors">
                SGB Portal
              </span>
              <span className="text-[10px] text-sky-300/80 uppercase tracking-wider font-semibold">
                SGK İş Analizi Sistemi
              </span>
            </div>
          </button>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 lg:hidden"
            aria-label="Menüyü Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* Ana Sayfa */}
          <button
            onClick={() => {
              onNavigate('ana-sayfa');
              onCloseMobile();
            }}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              activePage === 'ana-sayfa'
                ? 'bg-[#0284c7] text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5 text-slate-300 shrink-0" />
            <span>Ana Sayfa</span>
          </button>

          {/* Faaliyetler */}
          <button
            onClick={() => {
              onNavigate('faaliyetler');
              onCloseMobile();
            }}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              activePage === 'faaliyetler'
                ? 'bg-[#0284c7] text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5 text-slate-300 shrink-0" />
            <span>Faaliyetler</span>
          </button>

          {/* Onay İşlemleri (Sadece Onay Yetkisine Sahip Roller: Onaycı, Yetkili Onaycı, İş Birimi Admini) */}
          {canAccessApprovals && (
            <button
              onClick={() => {
                onNavigate('onay-islemleri');
                onCloseMobile();
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activePage === 'onay-islemleri'
                  ? 'bg-[#0284c7] text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-slate-300 shrink-0" />
                <span>Onay İşlemleri</span>
              </div>
              {pendingApprovalsCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-400 text-slate-900 tabular-nums">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          )}

          {/* Yönetim Menüsü (Yalnızca İş Birimi Admini İçin Görüntülenir - Standart Kullanıcı ve Onaycılarda Gizlenir) */}
          {canAccessManagement && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onNavigate('birim-transferi');
                  onCloseMobile();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isYonetimActive
                    ? 'bg-[#0091b6] text-white shadow-xs'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Settings className="w-5 h-5 text-white shrink-0" />
                <span>Yönetim</span>
              </button>

              {/* Submenu items under Yönetim */}
              <div className="mt-1 ml-3 space-y-1 pl-2 border-l border-white/10">
                <button
                  onClick={() => {
                    onNavigate('birim-aktifligi');
                    onCloseMobile();
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    activePage === 'birim-aktifligi'
                      ? 'bg-[#bae6fd] text-[#035496] font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 opacity-80" />
                  <span>Birim Aktifliği</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('personel-aktifligi');
                    onCloseMobile();
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    activePage === 'personel-aktifligi'
                      ? 'bg-[#bae6fd] text-[#035496] font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 opacity-80" />
                  <span>Personel Aktifliği</span>
                </button>

                {/* Onay Akışı ve Onaycı Devir Submenü Grubu */}
                <div className="pt-1.5 pb-1">
                  <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-bold text-sky-200/90 uppercase tracking-wider">
                    <GitBranch className="w-3.5 h-3.5 text-sky-400" />
                    <span>Onay Akışı Yönetimi</span>
                  </div>
                  <div className="ml-2.5 pl-2 border-l border-white/15 space-y-1 mt-0.5">
                    <button
                      onClick={() => {
                        onNavigate('onay-akisi');
                        onCloseMobile();
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        activePage === 'onay-akisi'
                          ? 'bg-[#bae6fd] text-[#035496] font-bold shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>• Onay Akış Şablonları</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('onayci-devir');
                        onCloseMobile();
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        activePage === 'onayci-devir'
                          ? 'bg-[#bae6fd] text-[#035496] font-bold shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <ArrowRightLeft className="w-3 h-3 text-sky-300 opacity-90" />
                      <span>• Onaycı Devri (DB Bazlı)</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigate('faaliyet-yili');
                    onCloseMobile();
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    activePage === 'faaliyet-yili'
                      ? 'bg-[#bae6fd] text-[#035496] font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 opacity-80" />
                  <span>Faaliyet Yılı</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('birim-transferi');
                    onCloseMobile();
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                    activePage === 'birim-transferi'
                      ? 'bg-[#bae6fd] text-[#035496] font-bold shadow-xs ring-1 ring-sky-300/50'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 opacity-80" />
                  <span>Birim Transferi</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer with Active User Avatar */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors group text-left"
            title="Kullanıcı Profili ve Oturum Bilgileri"
          >
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0b2444] shadow-sm group-hover:ring-2 group-hover:ring-sky-400 font-bold text-sm">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser.fullName}
              </p>
              <p className="text-[11px] text-sky-200 truncate">
                {currentUser.role}
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
