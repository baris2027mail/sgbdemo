import {
  Activity,
  Department,
  Unit,
  User,
  ApprovalTemplate,
  FiscalYear,
  TransferRecord,
} from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    name: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    code: 'SGB',
    isActive: true,
    subUnits: [
      { id: 'sub-1-1', name: 'Strateji Geliştirme', code: 'SGB-SG', isActive: true, personnelCount: 14 },
      { id: 'sub-1-2', name: 'Stratejik Plan ve Faaliyet Grubu', code: 'SGB-SPFG', isActive: true, personnelCount: 8 },
      { id: 'sub-1-3', name: 'Bütçe ve Mali Kontrol Şube Müdürlüğü', code: 'SGB-BMK', isActive: true, personnelCount: 6 },
    ],
  },
  {
    id: 'dept-2',
    name: 'MUHASEBE HİZMETLERİ DAİRE BAŞKANLIĞI',
    code: 'MHDB',
    isActive: true,
    subUnits: [
      { id: 'sub-2-1', name: 'Banka Tahsilatları Şube Müdürlüğü', code: 'MH-BT', isActive: true, personnelCount: 5 },
      { id: 'sub-2-2', name: 'Faturalı Alacaklar Şube Müdürlüğü', code: 'MH-FA', isActive: true, personnelCount: 4 },
      { id: 'sub-2-3', name: 'Gelir Muhasebesi Şube Müdürlüğü', code: 'MH-GM', isActive: true, personnelCount: 6 },
      { id: 'sub-2-4', name: 'Kamu Zararları ve Rapor Takip Grubu', code: 'MH-KZ', isActive: true, personnelCount: 3 },
      { id: 'sub-2-5', name: 'Mali Raporlama ve Mevzuat Grubu', code: 'MH-MR', isActive: true, personnelCount: 4 },
      { id: 'sub-2-6', name: 'Merkez Muhasebe Şube Müdürlüğü', code: 'MH-MM', isActive: true, personnelCount: 5 },
      { id: 'sub-2-7', name: 'Ödeme Muhasebe Şube Müdürlüğü', code: 'MH-OM', isActive: true, personnelCount: 4 },
      { id: 'sub-2-8', name: 'Yönetim Hizmetleri ve Koordinasyon Şube Müdürlüğü', code: 'MH-YK', isActive: true, personnelCount: 3 },
    ],
  },
  {
    id: 'dept-3',
    name: 'İNSAN KAYNAKLARI DAİRESİ BAŞKANLIĞI',
    code: 'IKDB',
    isActive: true,
    subUnits: [
      { id: 'sub-3-1', name: 'İnsan Kaynakları Dairesi Başkanlığı', code: 'IK-GNL', isActive: true, personnelCount: 22 },
      { id: 'sub-3-2', name: 'Özlük ve Atama Şube Müdürlüğü', code: 'IK-OA', isActive: true, personnelCount: 7 },
      { id: 'sub-3-3', name: 'Hizmet İçi Eğitim Şube Müdürlüğü', code: 'IK-HIE', isActive: true, personnelCount: 5 },
    ],
  },
  {
    id: 'dept-4',
    name: 'STRATEJİK PLANLAMA VE KOORDİNASYON DAİRE BAŞKANLIĞI',
    code: 'SPKDB',
    isActive: true,
    subUnits: [
      { id: 'sub-4-1', name: '1 Protokol ve Koordinasyon Şube Müdürlüğü', code: 'SPK-PK1', isActive: true, personnelCount: 6 },
      { id: 'sub-4-2', name: 'Planlama Şube Müdürlüğü', code: 'SPK-PLN', isActive: true, personnelCount: 5 },
    ],
  },
  {
    id: 'dept-5',
    name: 'İÇ KONTROL DAİRE BAŞKANLIĞI',
    code: 'IKODB',
    isActive: true,
    subUnits: [
      { id: 'sub-5-1', name: 'İç Kontrol Şube Müdürlüğü', code: 'IKO-SM', isActive: true, personnelCount: 7 },
      { id: 'sub-5-2', name: 'Risk Yönetimi Grubu', code: 'IKO-RYG', isActive: true, personnelCount: 4 },
    ],
  },
  {
    id: 'dept-6',
    name: 'BÜTÇE DAİRE BAŞKANLIĞI',
    code: 'BDB',
    isActive: true,
    subUnits: [
      { id: 'sub-6-1', name: 'Bütçe Uygulama Şube Müdürlüğü', code: 'BDB-BU', isActive: true, personnelCount: 9 },
      { id: 'sub-6-2', name: 'Kesin Hesap Şube Müdürlüğü', code: 'BDB-KH', isActive: true, personnelCount: 5 },
    ],
  },
  {
    id: 'dept-7',
    name: 'BİLGİ TEKNOLOJİLERİ GENEL MÜDÜRLÜĞÜ',
    code: 'BTGM',
    isActive: true,
    subUnits: [
      { id: 'sub-7-1', name: 'Bilgi İşlem Dairesi Başkanlığı', code: 'BIDB', isActive: true, personnelCount: 18 },
      { id: 'sub-7-2', name: 'Kurumsal Yazılımlar Daire Başkanlığı', code: 'KYDB', isActive: true, personnelCount: 12 },
    ],
  },
];

export const INITIAL_UNITS: Unit[] = [
  { id: 'u-1', name: 'Strateji Geliştirme', code: 'SGB', departmentName: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI', isActive: true, personnelCount: 14 },
  { id: 'u-2', name: 'İnsan Kaynakları Dairesi Başkanlığı', code: 'IKDB', departmentName: 'İNSAN KAYNAKLARI DAİRESİ BAŞKANLIĞI', isActive: true, personnelCount: 22 },
  { id: 'u-3', name: 'Bilgi İşlem Dairesi Başkanlığı', code: 'BIDB', departmentName: 'BİLGİ TEKNOLOJİLERİ GENEL MÜDÜRLÜĞÜ', isActive: true, personnelCount: 18 },
  { id: 'u-4', name: 'Muhasebe Hizmetleri Daire Başkanlığı', code: 'MHDB', departmentName: 'MUHASEBE HİZMETLERİ DAİRE BAŞKANLIĞI', isActive: true, personnelCount: 30 },
  { id: 'u-5', name: 'Bütçe Daire Başkanlığı', code: 'BDB', departmentName: 'BÜTÇE DAİRE BAŞKANLIĞI', isActive: true, personnelCount: 14 },
  { id: 'u-6', name: 'İç Kontrol Daire Başkanlığı', code: 'IKODB', departmentName: 'İÇ KONTROL DAİRE BAŞKANLIĞI', isActive: true, personnelCount: 11 },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    sicilNo: '33697239310',
    username: 'admin',
    fullName: 'İş Birimi Admini',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    unit: 'Strateji Geliştirme',
    role: 'İş Birimi Admini',
    isApproverCandidate: true,
    canReopen: true,
    isActive: true,
    lastSyncDate: '12.10.2026 09:15',
    title: 'Sistem & İş Birimi Yöneticisi',
    email: 'admin@sgb.gov.tr',
  },
  {
    id: 'user-cevat',
    sicilNo: '33697239316',
    username: 'cyamankale',
    fullName: 'Cevat Gökhan YAMANKALE',
    department: 'MUHASEBE HİZMETLERİ DAİRE BAŞKANLIĞI',
    unit: 'Mali Raporlama ve Mevzuat Grubu',
    role: 'Yetkili Onaycı',
    isApproverCandidate: true,
    canReopen: true,
    isActive: true,
    lastSyncDate: '12.10.2026 08:30',
    title: 'Daire Başkanı (Yetkili Onaycı)',
    email: 'cevat.yamankale@sgb.gov.tr',
  },
  {
    id: 'user-abdullah',
    sicilNo: '30223447634',
    username: 'amujdeci',
    fullName: 'Abdullah MÜJDECİ',
    department: 'BÜTÇE DAİRE BAŞKANLIĞI',
    unit: 'Bütçe Uygulama Şube Müdürlüğü',
    role: 'Onaycı',
    isApproverCandidate: true,
    canReopen: false,
    isActive: true,
    lastSyncDate: '12.10.2026 08:45',
    title: 'Şube Müdürü (Onaycı)',
    email: 'abdullah.mujdeci@sgb.gov.tr',
  },
  {
    id: 'user-abdulkadir',
    sicilNo: '38272102948',
    username: 'amercan',
    fullName: 'Abdulkadir MERCAN',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    unit: 'Stratejik Plan ve Faaliyet Grubu',
    role: 'Standart Kullanıcı',
    isApproverCandidate: true,
    canReopen: false,
    isActive: true,
    lastSyncDate: '11.10.2026 17:20',
    title: 'Strateji Geliştirme Uzmanı',
    email: 'abdulkadir.mercan@sgb.gov.tr',
  },
  {
    id: 'user-ahmet',
    sicilNo: '24734426844',
    username: 'ayuksel',
    fullName: 'Ahmet Murat YÜKSEL',
    department: 'STRATEJİK PLANLAMA VE KOORDİNASYON DAİRE BAŞKANLIĞI',
    unit: '1 Protokol ve Koordinasyon Şube Müdürlüğü',
    role: 'Standart Kullanıcı',
    isApproverCandidate: false,
    canReopen: false,
    isActive: true,
    lastSyncDate: '10.10.2026 14:10',
    title: 'Planlama Uzmanı',
    email: 'ahmet.yuksel@sgb.gov.tr',
  },
  {
    id: 'user-bulent',
    sicilNo: '32911671628',
    username: 'bkaya',
    fullName: 'Bülent KAYA',
    department: 'İÇ KONTROL DAİRE BAŞKANLIĞI',
    unit: 'İç Kontrol Şube Müdürlüğü',
    role: 'Gözlemci',
    isApproverCandidate: false,
    canReopen: false,
    isActive: true,
    lastSyncDate: '12.10.2026 09:00',
    title: 'Denetçi (Gözlemci)',
    email: 'bulent.kaya@sgb.gov.tr',
  },
];

export const INITIAL_APPROVAL_TEMPLATES: ApprovalTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Muhasebe Faaliyetleri Onay Şablonu',
    unitOrDept: 'MUHASEBE HİZMETLERİ DAİRE BAŞKANLIĞI',
    scope: 'Daire Başkanlığı',
    description: 'Muhasebe ve mali kayıtların iki aşamalı şube amiri ve daire başkanı onayı',
    isActive: true,
    steps: [
      { order: 1, approverName: 'Abdullah MÜJDECİ', approverSicil: '30223447634', title: '1. Onaycı (Şube Müdürü)' },
      { order: 2, approverName: 'Cevat Gökhan YAMANKALE', approverSicil: '33697239316', title: 'Nihai Onaycı (Daire Başkanı)' },
    ],
  },
  {
    id: 'tmpl-2',
    name: 'SGB Genel Faaliyet Onay Şablonu',
    unitOrDept: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    scope: 'SGB Geneli',
    description: 'Kurumsal stratejik planlama ve performans raporları onay zinciri',
    isActive: true,
    steps: [
      { order: 1, approverName: 'Cevat Gökhan YAMANKALE', approverSicil: '33697239316', title: 'Strateji Koordinatörü' },
      { order: 2, approverName: 'İş Birimi Admini', approverSicil: '33697239310', title: 'Başkanlık Onayı' },
    ],
  },
  {
    id: 'tmpl-3',
    name: 'Bütçe Daire Başkanlığı Şablonu',
    unitOrDept: 'BÜTÇE DAİRE BAŞKANLIĞI',
    scope: 'Daire Başkanlığı',
    description: 'Bütçe hazırlık ve ödenek aktarımı onay akışı',
    isActive: true,
    steps: [
      { order: 1, approverName: 'Abdullah MÜJDECİ', approverSicil: '30223447634', title: 'Bütçe Şube Müdürü' },
    ],
  },
];

export const INITIAL_FISCAL_YEARS: FiscalYear[] = [
  {
    year: '2026',
    isLocked: false,
    plannedLockDate: '31.12.2026',
    statusText: 'Aktif Faaliyet Dönemi',
    history: [
      { date: '01.01.2026 00:00', action: 'Dönem Başlatıldı', user: 'Sistem' },
      { date: '11.09.2026 10:00', action: 'Planlanan Kilit Tarihi Güncellendi (31.12.2026)', user: 'İş Birimi Admini' },
    ],
  },
  {
    year: '2025',
    isLocked: true,
    plannedLockDate: '31.12.2025',
    actualLockDate: '31.12.2025 23:59',
    statusText: 'Kilitli (Salt Okunur)',
    history: [
      { date: '31.12.2025 23:59', action: 'Yıl Sonu Otomatik Kilitleme Gerçekleştirildi', user: 'Sistem Otomasyonu' },
    ],
  },
  {
    year: '2024',
    isLocked: true,
    plannedLockDate: '31.12.2024',
    actualLockDate: '31.12.2024 23:59',
    statusText: 'Kilitli (Arşiv)',
    history: [
      { date: '31.12.2024 23:59', action: 'Yıl Sonu Otomatik Kilitleme Gerçekleştirildi', user: 'Sistem Otomasyonu' },
    ],
  },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Stratejik Planlama Çalışması',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    currentUnit: 'Strateji Geliştirme',
    priority: 'Yüksek',
    startDate: '12.12.2026',
    estimatedEndDate: '31.12.2026',
    dateRange: '12 Ara 2026 - 31 Ara 2026',
    description: '2027-2031 dönemi 5 yıllık kurumsal stratejik plan hazırlık faaliyetleri ve paydaş görüşleri analizi.',
    createdUser: 'Abdulkadir MERCAN',
    createdDate: '12.12.2026 09:30',
    updatedUser: 'Abdulkadir MERCAN',
    updatedDate: '12.12.2026 11:20',
    approvalStatus: 'Onay Bekliyor',
    internalStatus: 'Devam Ediyor',
    year: '2026',
    assignedApprover: 'Cevat Gökhan YAMANKALE',
    currentApproverIndex: 1,
    pendingApprovalType: 'Faaliyet',
    pendingApprovalFileIds: ['file-1-1', 'file-1-2'],
    files: [
      {
        id: 'file-1-1',
        name: 'Strateji Planı.pdf',
        size: '4.2 MB',
        uploadDate: '12.12.2026 10:00',
        uploadedBy: 'Abdulkadir MERCAN',
        description: 'Taslak stratejik planlama raporu',
        approvalStatus: 'Onay Bekliyor',
      },
      {
        id: 'file-1-2',
        name: 'Paydas_Gorusleri.xlsx',
        size: '1.8 MB',
        uploadDate: '12.12.2026 11:15',
        uploadedBy: 'Abdulkadir MERCAN',
        description: 'Dış paydaş anket sonuç matrisi',
        approvalStatus: 'Onay Bekliyor',
      },
    ],
    approvalHistory: [
      {
        id: 'hist-1',
        type: 'Onaya Gönderildi',
        performedBy: 'Abdulkadir MERCAN',
        date: '12.12.2026 11:30',
        result: 'Onaya Gönderildi',
        reason: 'Tüm Faaliyet Onayı: Faaliyet ve bağlı tüm dosyalar onaya iletildi.',
        affectedItems: ['Stratejik Planlama Çalışması', 'Strateji Planı.pdf', 'Paydas_Gorusleri.xlsx'],
      },
    ],
    // Legacy mapping
    fileName: 'Strateji Planı.pdf',
    hasPendingApproval: true,
    status: 'Onayda',
  },
  {
    id: 'act-2',
    title: 'Performans Programı Hazırlığı',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    currentUnit: 'Strateji Geliştirme',
    priority: 'Yüksek',
    startDate: '01.01.2027',
    estimatedEndDate: '28.02.2027',
    dateRange: '01.01.2027 - 28.02.2027',
    description: 'Yıllık performans göstergelerinin tespiti ve birim hedefleriyle eşleştirilmesi.',
    createdUser: 'Abdulkadir MERCAN',
    createdDate: '14.12.2026 14:00',
    updatedUser: 'Abdulkadir MERCAN',
    updatedDate: '14.12.2026 14:00',
    approvalStatus: 'Onay Bekliyor',
    internalStatus: 'Devam Ediyor',
    year: '2026',
    assignedApprover: 'Cevat Gökhan YAMANKALE',
    currentApproverIndex: 1,
    pendingApprovalType: 'Dosya',
    pendingApprovalFileIds: ['file-2-1'],
    files: [
      {
        id: 'file-2-1',
        name: 'Performans.pdf',
        size: '3.1 MB',
        uploadDate: '14.12.2026 14:05',
        uploadedBy: 'Abdulkadir MERCAN',
        description: '2027 Yılı Performans Programı Taslağı',
        approvalStatus: 'Onay Bekliyor',
      },
    ],
    approvalHistory: [
      {
        id: 'hist-2',
        type: 'Onaya Gönderildi',
        performedBy: 'Abdulkadir MERCAN',
        date: '14.12.2026 14:10',
        result: 'Onaya Gönderildi',
        reason: 'Dosya Paketi Onayı: 1 adet dosya onay paketine iletildi.',
        affectedItems: ['Performans.pdf'],
      },
    ],
    fileName: 'Performans.pdf',
    hasPendingApproval: true,
    status: 'Onayda',
  },
  {
    id: 'act-3',
    title: 'Raporlama Faaliyeti',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    currentUnit: 'Strateji Geliştirme',
    priority: 'Orta',
    startDate: '01.03.2027',
    estimatedEndDate: '31.03.2027',
    dateRange: '01.03.2027 - 31.03.2027',
    description: '1. Çeyrek faaliyet izleme ve değerlendirme raporunun konsolide edilmesi.',
    createdUser: 'Abdulkadir MERCAN',
    createdDate: '15.12.2026 09:00',
    updatedUser: 'Abdulkadir MERCAN',
    updatedDate: '15.12.2026 09:00',
    approvalStatus: 'Taslak',
    internalStatus: 'Devam Ediyor',
    year: '2026',
    files: [
      {
        id: 'file-3-1',
        name: 'Rapor.pdf',
        size: '1.5 MB',
        uploadDate: '15.12.2026 09:10',
        uploadedBy: 'Abdulkadir MERCAN',
        description: 'Çeyrek rapor şablonu',
        approvalStatus: 'Onaylanabilir',
      },
    ],
    approvalHistory: [],
    fileName: 'Rapor.pdf',
    hasPendingApproval: false,
    status: 'Aktif',
  },
  {
    id: 'act-4',
    title: 'Veri Analizi',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    currentUnit: 'Strateji Geliştirme',
    priority: 'Orta',
    startDate: '01.04.2026',
    estimatedEndDate: '30.04.2027',
    dateRange: '01.04.2026 - 30.04.2027',
    description: 'Kurumsal iş yükü ve hizmet istatistiklerinin veri madenciliği araçlarıyla analizi.',
    createdUser: 'Abdulkadir MERCAN',
    createdDate: '01.04.2026 10:00',
    updatedUser: 'Abdulkadir MERCAN',
    updatedDate: '01.04.2026 10:00',
    approvalStatus: 'Taslak',
    internalStatus: 'Devam Ediyor',
    year: '2026',
    files: [
      {
        id: 'file-4-1',
        name: 'Analiz.xlsx',
        size: '5.4 MB',
        uploadDate: '01.04.2026 10:15',
        uploadedBy: 'Abdulkadir MERCAN',
        description: 'Ham istatistiki veri seti',
        approvalStatus: 'Onaylanabilir',
      },
    ],
    approvalHistory: [],
    fileName: 'Analiz.xlsx',
    hasPendingApproval: false,
    status: 'Aktif',
  },
  {
    id: 'act-5',
    title: 'Planlama Raporu',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    currentUnit: 'Strateji Geliştirme',
    priority: 'Düşük',
    startDate: '01.05.2027',
    estimatedEndDate: '31.05.2027',
    dateRange: '01.05.2027 - 31.05.2027',
    description: 'Birim bazlı yıllık iş planlarının konsolide edilmesi ve takvimlendirilmesi.',
    createdUser: 'Abdulkadir MERCAN',
    createdDate: '10.05.2026 15:30',
    updatedUser: 'Abdulkadir MERCAN',
    updatedDate: '10.05.2026 15:30',
    approvalStatus: 'Onay Bekliyor',
    internalStatus: 'Devam Ediyor',
    year: '2026',
    assignedApprover: 'Cevat Gökhan YAMANKALE',
    files: [
      {
        id: 'file-5-1',
        name: 'Plan.pdf',
        size: '2.1 MB',
        uploadDate: '10.05.2026 15:40',
        uploadedBy: 'Abdulkadir MERCAN',
        description: 'Birim planları özeti',
        approvalStatus: 'Onay Bekliyor',
      },
    ],
    approvalHistory: [],
    fileName: 'Plan.pdf',
    hasPendingApproval: true,
    status: 'Onayda',
  },
  {
    id: 'act-6',
    title: 'İç Kontrol Eylem Planı',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    currentUnit: 'Strateji Geliştirme',
    priority: 'Yüksek',
    startDate: '15.01.2027',
    estimatedEndDate: '15.06.2027',
    dateRange: '15.01.2027 - 15.06.2027',
    description: 'Kamu İç Kontrol Standartlarına Uyum Eylem Planı 2027 revizyonu.',
    createdUser: 'Abdulkadir MERCAN',
    createdDate: '15.01.2026 09:00',
    updatedUser: 'Abdulkadir MERCAN',
    updatedDate: '15.01.2026 09:00',
    approvalStatus: 'Taslak',
    internalStatus: 'Devam Ediyor',
    year: '2026',
    files: [{ id: 'file-6-1', name: 'Ic_Kontrol_2027.pdf', size: '2.8 MB', uploadDate: '15.01.2026', uploadedBy: 'Abdulkadir MERCAN', description: '', approvalStatus: 'Onaylanabilir' }],
    approvalHistory: [],
    fileName: 'Ic_Kontrol_2027.pdf',
    hasPendingApproval: false,
    status: 'Aktif',
  },
  {
    id: 'act-7',
    title: 'Bütçe Hazırlık Çalışmaları',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    currentUnit: 'Strateji Geliştirme',
    priority: 'Yüksek',
    startDate: '01.06.2027',
    estimatedEndDate: '30.09.2027',
    dateRange: '01.06.2027 - 30.09.2027',
    description: 'Orta Vadeli Program ve Bütçe Çağrısı çerçevesinde kurum bütçe teklifi hazırlığı.',
    createdUser: 'Abdulkadir MERCAN',
    createdDate: '01.06.2026 11:00',
    updatedUser: 'Abdulkadir MERCAN',
    updatedDate: '01.06.2026 11:00',
    approvalStatus: 'Onay Bekliyor',
    internalStatus: 'Devam Ediyor',
    year: '2026',
    assignedApprover: 'Abdullah MÜJDECİ',
    files: [{ id: 'file-7-1', name: 'Butce_Taslak.xlsx', size: '4.5 MB', uploadDate: '01.06.2026', uploadedBy: 'Abdulkadir MERCAN', description: '', approvalStatus: 'Onay Bekliyor' }],
    approvalHistory: [],
    fileName: 'Butce_Taslak.xlsx',
    hasPendingApproval: true,
    status: 'Onayda',
  },
  {
    id: 'act-8',
    title: 'Kurumsal Risk Değerlendirmesi',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    currentUnit: 'Strateji Geliştirme',
    priority: 'Orta',
    startDate: '10.02.2027',
    estimatedEndDate: '25.04.2027',
    dateRange: '10.02.2027 - 25.04.2027',
    description: 'Kurumsal risklerin tespiti, oylanması ve risk matrisinin oluşturulması.',
    createdUser: 'Abdulkadir MERCAN',
    createdDate: '10.02.2026 14:00',
    updatedUser: 'Abdulkadir MERCAN',
    updatedDate: '10.02.2026 14:00',
    approvalStatus: 'Taslak',
    internalStatus: 'Devam Ediyor',
    year: '2026',
    files: [{ id: 'file-8-1', name: 'Risk_Matrisi.docx', size: '1.2 MB', uploadDate: '10.02.2026', uploadedBy: 'Abdulkadir MERCAN', description: '', approvalStatus: 'Onaylanabilir' }],
    approvalHistory: [],
    fileName: 'Risk_Matrisi.docx',
    hasPendingApproval: false,
    status: 'Aktif',
  },
  {
    id: 'act-9',
    title: 'Kalite Yönetim Sistemi Denetimi',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    currentUnit: 'Strateji Geliştirme',
    priority: 'Orta',
    startDate: '05.03.2027',
    estimatedEndDate: '20.03.2027',
    dateRange: '05.03.2027 - 20.03.2027',
    description: 'ISO 9001 Kalite Yönetim Sistemi ara denetimi ve uygunsuzluk takibi.',
    createdUser: 'Abdulkadir MERCAN',
    createdDate: '05.03.2026 10:00',
    updatedUser: 'Abdulkadir MERCAN',
    updatedDate: '05.03.2026 10:00',
    approvalStatus: 'Taslak',
    internalStatus: 'Devam Ediyor',
    year: '2026',
    files: [{ id: 'file-9-1', name: 'KYS_Denetim_Raporu.pdf', size: '2.0 MB', uploadDate: '05.03.2026', uploadedBy: 'Abdulkadir MERCAN', description: '', approvalStatus: 'Onaylanabilir' }],
    approvalHistory: [],
    fileName: 'KYS_Denetim_Raporu.pdf',
    hasPendingApproval: false,
    status: 'Aktif',
  },
  {
    id: 'act-10',
    title: 'Mevzuat Uyum Analizi',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    currentUnit: 'Strateji Geliştirme',
    priority: 'Düşük',
    startDate: '01.02.2027',
    estimatedEndDate: '31.05.2027',
    dateRange: '01.02.2027 - 31.05.2027',
    description: 'Yeni yürürlüğe giren kanun ve yönetmeliklerin kurum süreçlerine etkisi.',
    createdUser: 'Abdulkadir MERCAN',
    createdDate: '01.02.2026 10:00',
    updatedUser: 'Abdulkadir MERCAN',
    updatedDate: '01.02.2026 10:00',
    approvalStatus: 'Taslak',
    internalStatus: 'Devam Ediyor',
    year: '2026',
    files: [{ id: 'file-10-1', name: 'Mevzuat_Uyum.pdf', size: '3.4 MB', uploadDate: '01.02.2026', uploadedBy: 'Abdulkadir MERCAN', description: '', approvalStatus: 'Onaylanabilir' }],
    approvalHistory: [],
    fileName: 'Mevzuat_Uyum.pdf',
    hasPendingApproval: false,
    status: 'Aktif',
  },
  {
    id: 'act-11',
    title: 'Hizmet Standartları Güncellemesi',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    currentUnit: 'Strateji Geliştirme',
    priority: 'Düşük',
    startDate: '15.04.2027',
    estimatedEndDate: '30.06.2027',
    dateRange: '15.04.2027 - 30.06.2027',
    description: 'Vatandaşa sunulan kamu hizmetlerinin standartlarının ve sürelerinin gözden geçirilmesi.',
    createdUser: 'Abdulkadir MERCAN',
    createdDate: '15.04.2026 10:00',
    updatedUser: 'Abdulkadir MERCAN',
    updatedDate: '15.04.2026 10:00',
    approvalStatus: 'Taslak',
    internalStatus: 'Devam Ediyor',
    year: '2026',
    files: [{ id: 'file-11-1', name: 'Standartlar_Tablosu.xlsx', size: '1.1 MB', uploadDate: '15.04.2026', uploadedBy: 'Abdulkadir MERCAN', description: '', approvalStatus: 'Onaylanabilir' }],
    approvalHistory: [],
    fileName: 'Standartlar_Tablosu.xlsx',
    hasPendingApproval: false,
    status: 'Aktif',
  },
  {
    id: 'act-12',
    title: 'Yıllık Faaliyet Raporu Konsolidasyonu',
    department: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
    currentUnit: 'Strateji Geliştirme',
    priority: 'Yüksek',
    startDate: '02.01.2027',
    estimatedEndDate: '28.02.2027',
    dateRange: '02.01.2027 - 28.02.2027',
    description: 'Kurum genelindeki tüm harcama birimlerinin yıllık faaliyet raporlarının tek metin haline getirilmesi.',
    createdUser: 'Abdulkadir MERCAN',
    createdDate: '02.01.2026 10:00',
    updatedUser: 'Abdulkadir MERCAN',
    updatedDate: '02.01.2026 10:00',
    approvalStatus: 'Onay Bekliyor',
    internalStatus: 'Devam Ediyor',
    year: '2026',
    assignedApprover: 'Cevat Gökhan YAMANKALE',
    files: [{ id: 'file-12-1', name: 'Yillik_Rapor_2026.pdf', size: '7.8 MB', uploadDate: '02.01.2026', uploadedBy: 'Abdulkadir MERCAN', description: '', approvalStatus: 'Onay Bekliyor' }],
    approvalHistory: [],
    fileName: 'Yillik_Rapor_2026.pdf',
    hasPendingApproval: true,
    status: 'Onayda',
  },

  // Activities in other units (already approved or completed sample to test "Yeniden Düzenlemeye Aç")
  {
    id: 'act-13',
    title: 'Yurtdışı Formüler Entegrasyonu',
    department: 'MUHASEBE HİZMETLERİ DAİRE BAŞKANLIĞI',
    currentUnit: 'Mali Raporlama ve Mevzuat Grubu',
    priority: 'Yüksek',
    startDate: '12.11.2025',
    estimatedEndDate: '15.12.2025',
    dateRange: '12.11.2025 - 15.12.2025',
    description: 'Yurtdışı formülerinin entegrasyon süreci kapsamında gerekli çalışmaların tamamlanması planlanmaktadır.',
    createdUser: 'Ahmet Yılmaz',
    createdDate: '12.11.2025 10:24',
    updatedUser: 'Ahmet Yılmaz',
    updatedDate: '14.11.2025 16:37',
    approvalStatus: 'Onaylandı',
    approvalDate: '15.12.2026',
    internalStatus: 'Tamamlandı',
    year: '2026',
    files: [
      {
        id: 'file-13-1',
        name: 'Formüler Örneği.pdf',
        size: '2.4 MB',
        uploadDate: '12.11.2025 10:30',
        uploadedBy: 'Ahmet Yılmaz',
        description: 'Formüler örneği taslağı',
        approvalStatus: 'Onaylandı',
        approvalDate: '15.12.2026',
      },
      {
        id: 'file-13-2',
        name: 'Ek Bilgi.docx',
        size: '1.2 MB',
        uploadDate: '12.11.2025 10:35',
        uploadedBy: 'Ahmet Yılmaz',
        description: 'Ek bilgi dokümanı',
        approvalStatus: 'Onaylandı',
        approvalDate: '15.12.2026',
      },
      {
        id: 'file-13-3',
        name: 'Tablo.xlsx',
        size: '3.1 MB',
        uploadDate: '12.11.2025 10:40',
        uploadedBy: 'Ahmet Yılmaz',
        description: 'Veri tablosu',
        approvalStatus: 'İade Edildi',
      },
    ],
    approvalHistory: [
      {
        id: 'hist-13',
        type: 'Faaliyet Onayı',
        performedBy: 'Cevat Gökhan YAMANKALE',
        date: '15.12.2026 14:00',
        result: 'Onaylandı',
        reason: 'İnceleme tamamlanmış olup uygun bulunmuştur.',
      },
    ],
    fileName: 'Formüler Örneği.pdf',
    hasPendingApproval: false,
    status: 'Tamamlandı',
  },
  {
    id: 'act-14',
    title: 'Banka Tahsilat Otomasyonu',
    department: 'MUHASEBE HİZMETLERİ DAİRE BAŞKANLIĞI',
    currentUnit: 'Banka Tahsilatları Şube Müdürlüğü',
    priority: 'Orta',
    startDate: '10.02.2026',
    estimatedEndDate: '30.06.2026',
    dateRange: '10.02.2026 - 30.06.2026',
    description: 'Anlaşmalı kamu bankaları ile çevrimiçi mutabakat servislerinin test edilmesi.',
    createdUser: 'Cevat Gökhan YAMANKALE',
    createdDate: '10.02.2026 09:00',
    updatedUser: 'Cevat Gökhan YAMANKALE',
    updatedDate: '10.02.2026 09:00',
    approvalStatus: 'İade Edildi',
    internalStatus: 'Devam Ediyor',
    year: '2026',
    files: [
      {
        id: 'file-14-1',
        name: 'Banka_Protokol.pdf',
        size: '1.8 MB',
        uploadDate: '10.02.2026 09:15',
        uploadedBy: 'Cevat Gökhan YAMANKALE',
        description: 'Protokol taslağı',
        approvalStatus: 'İade Edildi',
      },
    ],
    approvalHistory: [
      {
        id: 'hist-14',
        type: 'İade',
        performedBy: 'Abdullah MÜJDECİ',
        date: '15.02.2026 16:30',
        result: 'İade Edildi',
        reason: 'Madde 4 kapsamındaki mali mesuliyet hükümleri hukuk müşavirliği görüşüyle uyumlu değil.',
      },
    ],
    fileName: 'Banka_Protokol.pdf',
    hasPendingApproval: false,
    status: 'İade Edildi',
  },
];

const STORAGE_KEYS = {
  ACTIVITIES: 'sgb_portal_activities_v2',
  DEPARTMENTS: 'sgb_portal_departments_v2',
  UNITS: 'sgb_portal_units_v2',
  USERS: 'sgb_portal_users_v2',
  ACTIVE_USER_ID: 'sgb_portal_active_user_id_v2',
  TEMPLATES: 'sgb_portal_templates_v2',
  FISCAL_YEARS: 'sgb_portal_fiscal_years_v2',
  TRANSFERS: 'sgb_portal_transfers_v2',
};

export const getStoredActivities = (): Activity[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACTIVITIES;
  }
};

export const setStoredActivities = (activities: Activity[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (e) {
    console.error('Failed to save activities to localStorage', e);
  }
};

export const getStoredDepartments = (): Department[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
      return INITIAL_DEPARTMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEPARTMENTS;
  }
};

export const setStoredDepartments = (departments: Department[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
  } catch (e) {
    console.error('Failed to save departments', e);
  }
};

export const getStoredUnits = (): Unit[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNITS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(INITIAL_UNITS));
      return INITIAL_UNITS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_UNITS;
  }
};

export const setStoredUnits = (units: Unit[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(units));
  } catch (e) {
    console.error('Failed to save units', e);
  }
};

export const getStoredUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
};

export const setStoredUsers = (users: User[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
};

export const getStoredActiveUserId = (): string => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
    return raw || 'user-admin';
  } catch {
    return 'user-admin';
  }
};

export const setStoredActiveUserId = (id: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, id);
  } catch (e) {
    console.error('Failed to save active user id', e);
  }
};

export const getStoredTemplates = (): ApprovalTemplate[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_APPROVAL_TEMPLATES));
      return INITIAL_APPROVAL_TEMPLATES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPROVAL_TEMPLATES;
  }
};

export const setStoredTemplates = (templates: ApprovalTemplate[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  } catch (e) {
    console.error('Failed to save templates', e);
  }
};

export const getStoredFiscalYears = (): FiscalYear[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FISCAL_YEARS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FISCAL_YEARS, JSON.stringify(INITIAL_FISCAL_YEARS));
      return INITIAL_FISCAL_YEARS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FISCAL_YEARS;
  }
};

export const setStoredFiscalYears = (years: FiscalYear[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FISCAL_YEARS, JSON.stringify(years));
  } catch (e) {
    console.error('Failed to save fiscal years', e);
  }
};

export const getStoredTransfers = (): TransferRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
    if (!raw) {
      const initialLogs: TransferRecord[] = [
        {
          id: 'tr-prev-1',
          timestamp: '10.10.2026 14:32',
          sourceUnit: 'Destek Hizmetleri Dairesi Başkanlığı',
          targetUnit: 'Strateji Geliştirme',
          sourceDepartment: 'DESTEK HİZMETLERİ DAİRE BAŞKANLIĞI',
          targetDepartment: 'STRATEJİ GELİŞTİRME BAŞKANLIĞI',
          reason: 'Birimler arası görev dağılımı revizyonu ve organizasyonel sadeleşme kapsamında aktarım yapılmıştır.',
          transferredCount: 2,
          activityIds: ['act-archive-1', 'act-archive-2'],
          activityTitles: ['Envanter Sayım Raporu', 'Tedarik Planlama'],
          operator: 'İş Birimi Admini',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(initialLogs));
      return initialLogs;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const setStoredTransfers = (transfers: TransferRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers));
  } catch (e) {
    console.error('Failed to save transfers', e);
  }
};

export const resetAllDataToDefault = () => {
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
  localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
  localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(INITIAL_UNITS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_APPROVAL_TEMPLATES));
  localStorage.setItem(STORAGE_KEYS.FISCAL_YEARS, JSON.stringify(INITIAL_FISCAL_YEARS));
  localStorage.removeItem(STORAGE_KEYS.TRANSFERS);
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, 'user-admin');
};
