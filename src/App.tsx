import React, { useState, useEffect } from 'react';
import { Sidebar, ActivePage } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { BirimTransferi } from './components/BirimTransferi';
import { AnaSayfa } from './components/AnaSayfa';
import { Faaliyetler } from './components/Faaliyetler';
import { OnayIslemleri } from './components/OnayIslemleri';
import { BirimAktifligi } from './components/BirimAktifligi';
import { PersonelAktifligi } from './components/PersonelAktifligi';
import { OnayAkisi } from './components/OnayAkisi';
import { OnayciDevir } from './components/OnayciDevir';
import { FaaliyetYili } from './components/FaaliyetYili';
import { ProfileModal } from './components/ProfileModal';
import {
  Activity,
  Department,
  Unit,
  User,
  ApprovalTemplate,
  FiscalYear,
  TransferRecord,
} from './types';
import {
  getStoredActivities,
  setStoredActivities,
  getStoredDepartments,
  setStoredDepartments,
  getStoredUnits,
  setStoredUnits,
  getStoredUsers,
  setStoredUsers,
  getStoredActiveUserId,
  setStoredActiveUserId,
  getStoredTemplates,
  setStoredTemplates,
  getStoredFiscalYears,
  setStoredFiscalYears,
  getStoredTransfers,
  setStoredTransfers,
  resetAllDataToDefault,
  INITIAL_USERS,
} from './data/initialData';

export default function App() {
  // Navigation State - defaults to 'faaliyetler'
  const [activePage, setActivePage] = useState<ActivePage>('faaliyetler');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // LocalStorage Persisted States
  const [activities, setActivities] = useState<Activity[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeUserId, setActiveUserId] = useState<string>('user-admin');
  const [templates, setTemplates] = useState<ApprovalTemplate[]>([]);
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);

  // Initialize from LocalStorage on mount
  useEffect(() => {
    setActivities(getStoredActivities());
    setDepartments(getStoredDepartments());
    setUnits(getStoredUnits());
    setUsers(getStoredUsers());
    setActiveUserId(getStoredActiveUserId());
    setTemplates(getStoredTemplates());
    setFiscalYears(getStoredFiscalYears());
    setTransfers(getStoredTransfers());
  }, []);

  // Active Current User
  const currentUser = users.find((u) => u.id === activeUserId) || users[0] || INITIAL_USERS[0];

  // Reactive Navigation Guard: Ensure active page is allowed for current user role
  useEffect(() => {
    const isManagementPage = [
      'birim-aktifligi',
      'personel-aktifligi',
      'onay-akisi',
      'onayci-devir',
      'faaliyet-yili',
      'birim-transferi',
    ].includes(activePage);
    const isApprovalsPage = activePage === 'onay-islemleri';

    if (isManagementPage && currentUser.role !== 'İş Birimi Admini') {
      setActivePage('faaliyetler');
    } else if (
      isApprovalsPage &&
      !['Onaycı', 'Yetkili Onaycı', 'İş Birimi Admini'].includes(currentUser.role)
    ) {
      setActivePage('faaliyetler');
    }
  }, [currentUser?.role, activePage]);

  // Active Fiscal Year
  const currentFiscalYear = fiscalYears.find((fy) => !fy.isLocked) || fiscalYears[0] || {
    year: '2026',
    isLocked: false,
    plannedLockDate: '31.12.2026',
    statusText: 'Aktif Faaliyet Dönemi',
    history: [],
  };

  // Switch Active User / Role with navigation guard
  const handleSwitchUser = (newUserId: string) => {
    setActiveUserId(newUserId);
    setStoredActiveUserId(newUserId);
    const targetUser = users.find((u) => u.id === newUserId);
    if (targetUser) {
      const isManagementPage = [
        'birim-aktifligi',
        'personel-aktifligi',
        'onay-akisi',
        'onayci-devir',
        'faaliyet-yili',
        'birim-transferi',
      ].includes(activePage);
      const isApprovalsPage = activePage === 'onay-islemleri';

      if (isManagementPage && targetUser.role !== 'İş Birimi Admini') {
        setActivePage('faaliyetler');
      } else if (
        isApprovalsPage &&
        !['Onaycı', 'Yetkili Onaycı', 'İş Birimi Admini'].includes(targetUser.role)
      ) {
        setActivePage('faaliyetler');
      }
    }
  };

  // Pending Approvals Count for badge
  const pendingApprovalsCount = activities.filter(
    (a) => a.approvalStatus === 'Onay Bekliyor'
  ).length;

  // --- Handlers for Activities (UC-02 & UC-03) ---
  const handleSaveActivity = (activity: Activity) => {
    const exists = activities.some((a) => a.id === activity.id);
    const updated = exists
      ? activities.map((a) => (a.id === activity.id ? activity : a))
      : [activity, ...activities];
    setActivities(updated);
    setStoredActivities(updated);
  };

  const handleDeleteActivity = (activityId: string) => {
    const updated = activities.filter((a) => a.id !== activityId);
    setActivities(updated);
    setStoredActivities(updated);
  };

  // Request Approval (UC-04: Onaya Gönder)
  const handleRequestApproval = (
    activityId: string,
    approvalType: 'Faaliyet' | 'Dosya',
    selectedFileIds: string[]
  ) => {
    const nowStr = new Date().toLocaleDateString('tr-TR');
    const updated = activities.map((act) => {
      if (act.id !== activityId) return act;

      const updatedFiles = act.files.map((f) => {
        if (approvalType === 'Faaliyet' || selectedFileIds.includes(f.id)) {
          return { ...f, approvalStatus: 'Onay Bekliyor' as const };
        }
        return f;
      });

      return {
        ...act,
        approvalStatus: 'Onay Bekliyor' as const,
        internalStatus: 'Devam Ediyor' as const,
        pendingApprovalType: approvalType,
        pendingApprovalFileIds: selectedFileIds,
        files: updatedFiles,
        approvalHistory: [
          {
            id: `hist-${Date.now()}`,
            type: 'Onaya Gönderildi' as const,
            performedBy: currentUser.fullName,
            date: nowStr,
            result: 'Onaya Gönderildi' as const,
            reason:
              approvalType === 'Dosya'
                ? `Dosya Paketi Onayı: ${selectedFileIds.length} adet dosya onay paketine sunuldu.`
                : `Tüm Faaliyet Onayı: Faaliyet ve bağlı tüm dosyalar (${act.files.length} dosya) tek paket halinde onaya sunuldu.`,
            affectedItems: selectedFileIds,
          },
          ...act.approvalHistory,
        ],
        hasPendingApproval: true,
        status: 'Onayda',
      };
    });

    setActivities(updated);
    setStoredActivities(updated);
  };

  // Approve Activity (UC-04: Onayla)
  const handleApproveActivity = (activityId: string, isFinal: boolean) => {
    const todayStr = new Date().toLocaleDateString('tr-TR');
    const updated = activities.map((act) => {
      if (act.id !== activityId) return act;

      const isDosyaPackage = act.pendingApprovalType === 'Dosya';
      const targetFileIds = act.pendingApprovalFileIds || act.files.map((f) => f.id);

      if (isDosyaPackage) {
        // Sadece seçili dosya paketini onayla (Dosya Onayı - Paket Halinde)
        const updatedFiles = act.files.map((f) => {
          if (targetFileIds.includes(f.id)) {
            return {
              ...f,
              approvalStatus: 'Onaylandı' as const,
              approvalDate: todayStr,
            };
          }
          return f;
        });

        // Kontrol: Başka bekleyen dosya var mı?
        const hasOtherPendingFiles = updatedFiles.some((f) => f.approvalStatus === 'Onay Bekliyor');

        return {
          ...act,
          approvalStatus: hasOtherPendingFiles ? ('Onay Bekliyor' as const) : ('Taslak' as const),
          hasPendingApproval: hasOtherPendingFiles,
          pendingApprovalType: undefined,
          pendingApprovalFileIds: undefined,
          files: updatedFiles,
          approvalHistory: [
            {
              id: `hist-${Date.now()}`,
              type: 'Dosya Onayı' as const,
              performedBy: currentUser.fullName,
              date: todayStr,
              result: 'Onaylandı' as const,
              reason: `Dosya Paketi Onayı: Seçilen ${targetFileIds.length} adet dosya başarıyla onaylandı.`,
              affectedItems: targetFileIds,
            },
            ...act.approvalHistory,
          ],
        };
      } else {
        // Tüm Faaliyet Onayı (Tüm Her Şey Şeklinde)
        const updatedFiles = act.files.map((f) => ({
          ...f,
          approvalStatus: 'Onaylandı' as const,
          approvalDate: todayStr,
        }));

        return {
          ...act,
          approvalStatus: 'Onaylandı' as const,
          approvalDate: todayStr,
          internalStatus: 'Tamamlandı' as const,
          pendingApprovalType: undefined,
          pendingApprovalFileIds: undefined,
          files: updatedFiles,
          approvalHistory: [
            {
              id: `hist-${Date.now()}`,
              type: 'Faaliyet Onayı' as const,
              performedBy: currentUser.fullName,
              date: todayStr,
              result: 'Onaylandı' as const,
              reason: 'İnceleme sonucu faaliyetin tüm detayları ve bağlı tüm dosyalar tek paket halinde onaylanmıştır.',
            },
            ...act.approvalHistory,
          ],
          hasPendingApproval: false,
          status: 'Tamamlandı',
        };
      }
    });

    setActivities(updated);
    setStoredActivities(updated);
  };

  // Reject / Return Activity (UC-04: İade Et)
  const handleRejectActivity = (activityId: string, reason: string) => {
    const todayStr = new Date().toLocaleDateString('tr-TR');
    const updated = activities.map((act) => {
      if (act.id !== activityId) return act;

      const isDosyaPackage = act.pendingApprovalType === 'Dosya';
      const targetFileIds = act.pendingApprovalFileIds || act.files.map((f) => f.id);

      if (isDosyaPackage) {
        // Sadece paket içindeki dosyaları İade Edildi yap
        const updatedFiles = act.files.map((f) => {
          if (targetFileIds.includes(f.id)) {
            return {
              ...f,
              approvalStatus: 'İade Edildi' as const,
            };
          }
          return f;
        });

        return {
          ...act,
          approvalStatus: 'İade Edildi' as const,
          hasPendingApproval: false,
          pendingApprovalType: undefined,
          pendingApprovalFileIds: undefined,
          files: updatedFiles,
          approvalHistory: [
            {
              id: `hist-${Date.now()}`,
              type: 'İade' as const,
              performedBy: currentUser.fullName,
              date: todayStr,
              result: 'İade Edildi' as const,
              reason: `Dosya Paketi İadesi: ${reason}`,
              affectedItems: targetFileIds,
            },
            ...act.approvalHistory,
          ],
          status: 'İade Edildi',
        };
      } else {
        // Tüm faaliyeti ve bağlı dosyaları İade Edildi yap
        const updatedFiles = act.files.map((f) => ({
          ...f,
          approvalStatus: 'İade Edildi' as const,
        }));

        return {
          ...act,
          approvalStatus: 'İade Edildi' as const,
          internalStatus: 'Devam Ediyor' as const,
          pendingApprovalType: undefined,
          pendingApprovalFileIds: undefined,
          files: updatedFiles,
          approvalHistory: [
            {
              id: `hist-${Date.now()}`,
              type: 'İade' as const,
              performedBy: currentUser.fullName,
              date: todayStr,
              result: 'İade Edildi' as const,
              reason: `Faaliyet İadesi: ${reason}`,
            },
            ...act.approvalHistory,
          ],
          hasPendingApproval: false,
          status: 'İade Edildi',
        };
      }
    });

    setActivities(updated);
    setStoredActivities(updated);
  };

  // Reopen Activity (UC-04: Yeniden Düzenlemeye Açma)
  const handleReopenActivity = (activityId: string, reason: string) => {
    const todayStr = new Date().toLocaleDateString('tr-TR');
    const updated = activities.map((act) => {
      if (act.id !== activityId) return act;

      const updatedFiles = act.files.map((f) => ({
        ...f,
        approvalStatus: 'Onaylanabilir' as const,
        approvalDate: null,
      }));

      return {
        ...act,
        approvalStatus: 'Taslak' as const,
        internalStatus: 'Devam Ediyor' as const,
        approvalDate: null,
        pendingApprovalType: undefined,
        pendingApprovalFileIds: undefined,
        files: updatedFiles,
        approvalHistory: [
          {
            id: `hist-${Date.now()}`,
            type: 'Yeniden Düzenlemeye Açma' as const,
            performedBy: currentUser.fullName,
            date: todayStr,
            result: 'Yeniden Düzenlemeye Açıldı' as const,
            reason: reason,
          },
          ...act.approvalHistory,
        ],
        hasPendingApproval: false,
        status: 'Aktif',
      };
    });

    setActivities(updated);
    setStoredActivities(updated);
  };

  // --- Handlers for Management (UC-05) ---
  const handleToggleDepartment = (deptId: string, willBeActive: boolean) => {
    const updatedDepts = departments.map((d) => {
      if (d.id !== deptId) return d;
      return {
        ...d,
        isActive: willBeActive,
        subUnits: d.subUnits.map((su) => ({ ...su, isActive: willBeActive })),
      };
    });
    setDepartments(updatedDepts);
    setStoredDepartments(updatedDepts);

    // Rule 7108-UC5-BR-006: Cancel ongoing approvals in deactivated department
    if (!willBeActive) {
      const closedDept = departments.find((d) => d.id === deptId);
      if (closedDept) {
        const updatedActs = activities.map((a) => {
          if (a.department === closedDept.name && a.approvalStatus === 'Onay Bekliyor') {
            return {
              ...a,
              approvalStatus: 'Taslak' as const,
              hasPendingApproval: false,
              status: 'Taslak',
            };
          }
          return a;
        });
        setActivities(updatedActs);
        setStoredActivities(updatedActs);
      }
    }
  };

  const handleToggleSubUnit = (deptId: string, subUnitId: string, willBeActive: boolean) => {
    const updatedDepts = departments.map((d) => {
      if (d.id !== deptId) return d;
      return {
        ...d,
        subUnits: d.subUnits.map((su) =>
          su.id === subUnitId ? { ...su, isActive: willBeActive } : su
        ),
      };
    });
    setDepartments(updatedDepts);
    setStoredDepartments(updatedDepts);
  };

  const handleUpdateFiscalYear = (
    yearStr: string,
    newPlannedDate: string,
    unlockReason?: string
  ) => {
    const todayStr = new Date().toLocaleDateString('tr-TR');
    const updated = fiscalYears.map((fy) => {
      if (fy.year !== yearStr) return fy;
      const isReopening = fy.isLocked && Boolean(unlockReason);
      return {
        ...fy,
        plannedLockDate: newPlannedDate,
        isLocked: isReopening ? false : fy.isLocked,
        statusText: isReopening ? 'Aktif Faaliyet Dönemi' : fy.statusText,
        history: [
          {
            date: todayStr,
            action: isReopening
              ? `Yeniden Aktif Hale Getirildi (Planlanan: ${newPlannedDate})`
              : `Planlanan Kilit Tarihi Güncellendi (${newPlannedDate})`,
            user: currentUser.fullName,
            reason: unlockReason,
          },
          ...fy.history,
        ],
      };
    });
    setFiscalYears(updated);
    setStoredFiscalYears(updated);
  };

  const handleSaveTemplate = (tmpl: ApprovalTemplate) => {
    const exists = templates.some((t) => t.id === tmpl.id);
    const updated = exists
      ? templates.map((t) => (t.id === tmpl.id ? tmpl : t))
      : [tmpl, ...templates];
    setTemplates(updated);
    setStoredTemplates(updated);
  };

  const handleDeleteTemplate = (tmplId: string) => {
    const updated = templates.filter((t) => t.id !== tmplId);
    setTemplates(updated);
    setStoredTemplates(updated);
  };

  const handleDelegateTasks = (workflowKey: string, newApproverName: string) => {
    console.log(`Delegated tasks for ${workflowKey} to ${newApproverName}`);
  };

  const handleExecuteDelegation = (
    sourceApproverName: string,
    delegations: {
      groupKey: string;
      department: string;
      templateName: string;
      newApproverName: string;
      activityIds: string[];
    }[]
  ) => {
    const todayStr = new Date().toLocaleDateString('tr-TR');
    const updatedActivities = activities.map((act) => {
      const matchedGroup = delegations.find((del) => del.activityIds.includes(act.id));
      if (matchedGroup) {
        return {
          ...act,
          assignedApprover: matchedGroup.newApproverName,
          approvalHistory: [
            {
              id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              type: 'Onaycı Devri' as const,
              performedBy: currentUser.fullName,
              date: todayStr,
              result: 'Devredildi' as const,
              reason: `Daire Başkanlığı (${matchedGroup.department}) bazlı onaycı devri: ${sourceApproverName} -> ${matchedGroup.newApproverName}`,
            },
            ...act.approvalHistory,
          ],
        };
      }
      return act;
    });

    setActivities(updatedActivities);
    setStoredActivities(updatedActivities);
  };

  const handleUpdateUser = (updatedUser: User) => {
    const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updated);
    setStoredUsers(updated);
  };

  const handleSyncService = (type: 'amirler' | 'birimler') => {
    const nowStr = new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const updated = users.map((u) => ({ ...u, lastSyncDate: nowStr }));
    setUsers(updated);
    setStoredUsers(updated);
    alert(`${type === 'amirler' ? 'MEYES Amir Bilgileri' : 'Belgenet Birim Hiyerarşisi'} başarıyla senkronize edildi. (Son senkron: ${nowStr})`);
  };

  // Execute Unit Transfer (UC-05 Akış 5)
  const handleExecuteTransfer = (
    sourceUnit: string,
    targetUnit: string,
    reason: string,
    activityIds: string[]
  ) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('tr-TR')} ${now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
    const transferredTitles: string[] = [];

    // Find target department
    const targetDept = departments.find((d) =>
      d.subUnits.some((su) => su.name === targetUnit)
    )?.name || 'STRATEJİ GELİŞTİRME BAŞKANLIĞI';

    const sourceDept = departments.find((d) =>
      d.subUnits.some((su) => su.name === sourceUnit)
    )?.name || 'STRATEJİ GELİŞTİRME BAŞKANLIĞI';

    // Rule 7108-UC5-BR-032 & BR-033: Update unit, keep original unit, cancel ongoing approval
    const updatedActivities = activities.map((act) => {
      if (activityIds.includes(act.id)) {
        transferredTitles.push(act.title);
        return {
          ...act,
          currentUnit: targetUnit,
          department: targetDept,
          originalUnit: act.originalUnit || sourceUnit,
          approvalStatus: 'Taslak' as const, // ongoing approval cancelled, reset to draft
          hasPendingApproval: false,
          status: 'Taslak',
          updatedUser: currentUser.fullName,
          updatedDate: formattedDate,
        };
      }
      return act;
    });

    const newRecord: TransferRecord = {
      id: `tr-${Date.now()}`,
      timestamp: formattedDate,
      sourceUnit,
      targetUnit,
      sourceDepartment: sourceDept,
      targetDepartment: targetDept,
      reason,
      transferredCount: activityIds.length,
      activityIds,
      activityTitles: transferredTitles,
      operator: currentUser.fullName,
    };

    const updatedTransfers = [newRecord, ...transfers];

    setActivities(updatedActivities);
    setTransfers(updatedTransfers);
    setStoredActivities(updatedActivities);
    setStoredTransfers(updatedTransfers);
  };

  const handleUndoLastTransfer = () => {
    if (transfers.length === 0) return;
    const lastTransfer = transfers[0];

    const revertedActivities = activities.map((act) => {
      if (lastTransfer.activityIds.includes(act.id)) {
        return {
          ...act,
          currentUnit: lastTransfer.sourceUnit,
        };
      }
      return act;
    });

    const remainingTransfers = transfers.slice(1);
    setActivities(revertedActivities);
    setTransfers(remainingTransfers);
    setStoredActivities(revertedActivities);
    setStoredTransfers(remainingTransfers);
  };

  const handleResetData = () => {
    resetAllDataToDefault();
    setActivities(getStoredActivities());
    setDepartments(getStoredDepartments());
    setUnits(getStoredUnits());
    setUsers(getStoredUsers());
    setActiveUserId('user-admin');
    setTemplates(getStoredTemplates());
    setFiscalYears(getStoredFiscalYears());
    setTransfers(getStoredTransfers());
    setActivePage('birim-transferi');
  };

  // Breadcrumbs
  const getBreadcrumbInfo = (): { category: string; page: string } => {
    switch (activePage) {
      case 'ana-sayfa':
        return { category: 'Portal', page: 'Ana Sayfa' };
      case 'faaliyetler':
        return { category: 'Faaliyetler', page: 'Faaliyet Listesi ve Yönetimi' };
      case 'onay-islemleri':
        return { category: 'Onay Süreçleri', page: 'Onay Bekleyen İşlemler' };
      case 'birim-aktifligi':
        return { category: 'Yönetim', page: 'Birim Yönetimi ve Aktiflik' };
      case 'personel-aktifligi':
        return { category: 'Yönetim', page: 'Personel Aktifliği ve Yetkiler' };
      case 'onay-akisi':
        return { category: 'Yönetim', page: 'Onay Akışı / Şablonları' };
      case 'onayci-devir':
        return { category: 'Yönetim', page: 'Onaycı Değişikliği / Devir' };
      case 'faaliyet-yili':
        return { category: 'Yönetim', page: 'Faaliyet Yılı Kilit Yönetimi' };
      case 'birim-transferi':
      default:
        return { category: 'Yönetim', page: 'Birim Transferi' };
    }
  };

  const breadcrumb = getBreadcrumbInfo();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 font-sans antialiased text-slate-800">
      {/* Left Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        pendingApprovalsCount={pendingApprovalsCount}
        currentUser={currentUser}
      />

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header & Breadcrumbs with Role Switcher */}
        <TopHeader
          breadcrumbCategory={breadcrumb.category}
          breadcrumbPage={breadcrumb.page}
          onOpenMobileMenu={() => setIsOpenMobile(true)}
          onNavigateHome={() => setActivePage('ana-sayfa')}
          onOpenProfileModal={() => setIsProfileOpen(true)}
          fiscalYear={currentFiscalYear.year}
          isYearLocked={currentFiscalYear.isLocked}
          currentUser={currentUser}
          allUsers={users}
          onSwitchUser={handleSwitchUser}
          pendingApprovalsCount={pendingApprovalsCount}
          onNavigateToApprovals={() => setActivePage('onay-islemleri')}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activePage === 'birim-transferi' && (
            <BirimTransferi
              units={units}
              activities={activities}
              onExecuteTransfer={handleExecuteTransfer}
              transferHistory={transfers}
              onUndoLastTransfer={handleUndoLastTransfer}
              onResetData={handleResetData}
            />
          )}

          {activePage === 'ana-sayfa' && (
            <AnaSayfa
              activities={activities}
              units={units}
              transfers={transfers}
              currentUser={currentUser}
              currentFiscalYear={currentFiscalYear}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'faaliyetler' && (
            <Faaliyetler
              activities={activities}
              departments={departments}
              currentUser={currentUser}
              currentFiscalYear={currentFiscalYear}
              onSaveActivity={handleSaveActivity}
              onDeleteActivity={handleDeleteActivity}
              onRequestApproval={handleRequestApproval}
              onReopenActivity={handleReopenActivity}
              onNavigateToTransfer={() => setActivePage('birim-transferi')}
            />
          )}

          {activePage === 'onay-islemleri' && (
            <OnayIslemleri
              activities={activities}
              currentUser={currentUser}
              onApprove={handleApproveActivity}
              onReject={handleRejectActivity}
              onReopen={handleReopenActivity}
            />
          )}

          {activePage === 'birim-aktifligi' && (
            <BirimAktifligi
              departments={departments}
              currentUser={currentUser}
              onToggleDepartment={handleToggleDepartment}
              onToggleSubUnit={handleToggleSubUnit}
            />
          )}

          {activePage === 'personel-aktifligi' && (
            <PersonelAktifligi
              users={users}
              departments={departments}
              onUpdateUser={handleUpdateUser}
              onSyncService={handleSyncService}
            />
          )}

          {activePage === 'onay-akisi' && (
            <OnayAkisi
              templates={templates}
              departments={departments}
              users={users}
              onSaveTemplate={handleSaveTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              onDelegateTasks={handleDelegateTasks}
              onNavigateToDevir={() => setActivePage('onayci-devir')}
            />
          )}

          {activePage === 'onayci-devir' && (
            <OnayciDevir
              users={users}
              activities={activities}
              departments={departments}
              currentUser={currentUser}
              onExecuteDelegation={handleExecuteDelegation}
            />
          )}

          {activePage === 'faaliyet-yili' && (
            <FaaliyetYili
              fiscalYears={fiscalYears}
              onUpdateFiscalYear={handleUpdateFiscalYear}
            />
          )}
        </main>
      </div>

      {/* Profile & Integration Details Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onResetAllData={handleResetData}
      />
    </div>
  );
}
