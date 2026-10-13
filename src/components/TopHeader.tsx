import React, { useState } from 'react';
import {
  Menu,
  User as UserIcon,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { SgbLogo } from './SgbLogo';
import { User } from '../types';

interface TopHeaderProps {
  breadcrumbCategory: string;
  breadcrumbPage: string;
  onOpenMobileMenu: () => void;
  onNavigateHome: () => void;
  onOpenProfileModal?: () => void;
  fiscalYear: string;
  isYearLocked: boolean;
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (userId: string) => void;
  pendingApprovalsCount: number;
  onNavigateToApprovals?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  breadcrumbCategory,
  breadcrumbPage,
  onOpenMobileMenu,
  onNavigateHome,
  onOpenProfileModal,
  fiscalYear,
  isYearLocked,
  currentUser,
  allUsers,
  onSwitchUser,
  pendingApprovalsCount,
  onNavigateToApprovals,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const canAccessApprovals = ['Onaycı', 'Yetkili Onaycı', 'İş Birimi Admini'].includes(currentUser.role);

  return (
    <div className="flex flex-col w-full shrink-0">
      {/* Top Banner (SGK Institutional Vibrant Blue Strip) */}
      <div className="h-14 bg-gradient-to-r from-[#0178d4] via-[#0284c7] to-[#0275b1] px-4 md:px-8 flex items-center justify-between text-white shadow-md z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 rounded-md hover:bg-white/10 lg:hidden focus:outline-hidden"
            aria-label="Menüyü Aç"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left focus:outline-hidden group"
          >
            <SgbLogo size={32} />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold text-sky-100 tracking-wider uppercase opacity-90 hidden sm:inline">
                SGK · Strateji Geliştirme Başkanlığı
              </span>
              <span className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-sky-100 transition-colors">
                SGB Portal
              </span>
            </div>
          </button>
        </div>

        {/* Right Action & Profile Area */}
        <div className="flex items-center gap-3 text-xs font-medium">
          {/* Fiscal Year Status Badge */}
          <div
            className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border text-white ${
              isYearLocked
                ? 'bg-rose-500/20 border-rose-300/40 text-rose-100'
                : 'bg-white/15 border-white/20'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isYearLocked ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            <span className="tabular-nums font-semibold">
              {fiscalYear} {isYearLocked ? '(Kilitli)' : '(Aktif)'}
            </span>
          </div>

          {/* Pending Approvals Quick Button (Sadece Onay Yetkili Kullanıcılar) */}
          {canAccessApprovals && pendingApprovalsCount > 0 && onNavigateToApprovals && (
            <button
              onClick={onNavigateToApprovals}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-300/30 transition-colors"
              title={`${pendingApprovalsCount} onay bekleyen işlem var`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
              <span className="font-bold">{pendingApprovalsCount}</span>
            </button>
          )}

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition-colors focus:outline-hidden border border-white/15"
            >
              <div className="w-6 h-6 rounded-full bg-white text-[#0178d4] flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col text-left leading-tight">
                <span className="font-bold text-white truncate max-w-[140px]">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] text-sky-200 truncate">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-white/80" />
            </button>

            {/* Dropdown Menu for Role Switching */}
            {showUserDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white p-2 text-slate-800 shadow-2xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500">
                      Aktif Kullanıcı & Rol Seçimi (Test/MEYES)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Dokümandaki rolleri deneyimlemek için geçiş yapın
                    </p>
                  </div>

                  <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                    {allUsers.map((u) => {
                      const isSelected = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u.id);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                            isSelected
                              ? 'bg-sky-50 text-sky-900 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-sky-600 text-white font-bold'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {u.fullName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold truncate">{u.fullName}</p>
                              {isSelected && (
                                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{u.role}</p>
                            <p className="text-[10px] text-slate-400 truncate">{u.unit}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenProfileModal?.();
                      }}
                      className="w-full text-center py-1.5 text-xs font-medium text-sky-700 hover:text-sky-900 rounded-md hover:bg-sky-50"
                    >
                      Kullanıcı ve Sistem Detayları
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sub-header Breadcrumb & Secondary Status Bar */}
      <div className="h-12 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center text-sm font-medium text-slate-500" aria-label="Breadcrumb">
          <span className="text-sky-700 font-medium hover:text-sky-900 transition-colors">
            {breadcrumbCategory}
          </span>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400 stroke-[2.5]" />
          <span className="text-slate-800 font-semibold">{breadcrumbPage}</span>
        </nav>

        {/* Current Active User Profile Badge */}
        <div className="flex items-center gap-2.5 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-xs">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-800 hidden xs:inline">
              {currentUser.fullName}
            </span>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium border border-slate-200">
            {currentUser.role}
          </span>
        </div>
      </div>
    </div>
  );
};
