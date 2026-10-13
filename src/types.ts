export type UserRole =
  | 'Standart Kullanıcı'
  | 'Onaycı'
  | 'Yetkili Onaycı'
  | 'Gözlemci'
  | 'İş Birimi Admini';

export interface User {
  id: string;
  sicilNo: string;
  username: string;
  fullName: string;
  department: string; // Daire Başkanlığı
  unit: string; // Grup / Şube Müdürlüğü
  role: UserRole;
  isApproverCandidate: boolean; // Onaycı Adayı
  canReopen: boolean; // Yeniden Düzenlemeye Açma Yetkisi
  isActive: boolean; // Portal Aktif / Pasif
  lastSyncDate: string;
  title: string;
  email: string;
}

export type ApprovalStatus = 'Taslak' | 'Onay Bekliyor' | 'Onaylandı' | 'İade Edildi';
export type PriorityLevel = 'Düşük' | 'Orta' | 'Yüksek';

export interface ActivityFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  description: string;
  approvalStatus: 'Onaylanabilir' | 'Onay Bekliyor' | 'Onaylandı' | 'İade Edildi';
  approvalDate?: string | null;
}

export interface ApprovalHistoryItem {
  id: string;
  type: 'Faaliyet Onayı' | 'Dosya Onayı' | 'İade' | 'Yeniden Düzenlemeye Açma' | 'Onaya Gönderildi' | 'Onaycı Devri';
  performedBy: string;
  performedByRole?: string;
  date: string;
  result: 'Onaylandı' | 'İade Edildi' | 'Yeniden Düzenlemeye Açıldı' | 'Onaya Gönderildi' | 'Devredildi';
  reason?: string;
  affectedItems?: string[];
}

export interface Activity {
  id: string;
  title: string;
  department: string; // Daire Başkanlığı
  currentUnit: string; // Grup / Şube Müdürlüğü
  originalUnit?: string; // Transfer öncesi ilk oluşturulduğu birim
  priority: PriorityLevel;
  startDate: string; // Otomatik sistem tarihi (GG.AA.YYYY)
  estimatedEndDate: string; // Kullanıcı seçimi (GG.AA.YYYY)
  dateRange: string;
  description: string;
  createdUser: string;
  createdDate: string;
  updatedUser: string;
  updatedDate: string;
  approvalStatus: ApprovalStatus;
  approvalDate?: string | null;
  internalStatus: 'Devam Ediyor' | 'Tamamlandı'; // Arka plan statüsü (ön yüzde elle değiştirilemez)
  year: string;
  files: ActivityFile[];
  approvalHistory: ApprovalHistoryItem[];
  currentApproverIndex?: number;
  assignedApprover?: string;
  approvalTemplateId?: string;
  pendingApprovalType?: 'Faaliyet' | 'Dosya';
  pendingApprovalFileIds?: string[];

  // Legacy fields kept for backward compatibility with initial screen
  fileName?: string;
  hasPendingApproval?: boolean;
  status?: string;
}

export interface SubUnit {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  personnelCount: number;
  hasActiveWorkflows?: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  subUnits: SubUnit[];
}

export interface Unit {
  id: string;
  name: string;
  code: string;
  departmentName?: string;
  isActive: boolean;
  personnelCount: number;
}

export interface ApprovalTemplateStep {
  order: number;
  approverName: string;
  approverSicil: string;
  title: string;
}

export interface ApprovalTemplate {
  id: string;
  name: string;
  unitOrDept: string;
  scope: 'Daire Başkanlığı' | 'SGB Geneli';
  description: string;
  steps: ApprovalTemplateStep[];
  isActive: boolean;
}

export interface TransferRecord {
  id: string;
  timestamp: string;
  sourceUnit: string;
  targetUnit: string;
  sourceDepartment?: string;
  targetDepartment?: string;
  reason: string;
  transferredCount: number;
  activityIds: string[];
  activityTitles: string[];
  operator: string;
}

export interface FiscalYear {
  year: string;
  isLocked: boolean;
  plannedLockDate: string;
  actualLockDate?: string;
  statusText: string;
  history: {
    date: string;
    action: string;
    user: string;
    reason?: string;
  }[];
}

export interface PendingApprovalTask {
  id: string;
  type: 'Faaliyet' | 'Dosya';
  activityId: string;
  activityTitle: string;
  targetFileName?: string;
  department: string;
  unit: string;
  submissionDate: string;
  submittedBy: string;
  currentApprover: string;
  stepOrder: number;
  totalSteps: number;
  files: ActivityFile[];
}
