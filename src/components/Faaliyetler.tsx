import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Lock,
  Upload,
  Trash2,
  Send,
  X,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Layers,
  History,
  FileCheck,
  Info,
} from 'lucide-react';
import { Activity, ActivityFile, Department, User, FiscalYear } from '../types';

interface FaaliyetlerProps {
  activities: Activity[];
  departments: Department[];
  currentUser: User;
  currentFiscalYear: FiscalYear;
  onSaveActivity: (activity: Activity) => void;
  onDeleteActivity: (activityId: string) => void;
  onRequestApproval: (activityId: string, approvalType: 'Faaliyet' | 'Dosya', selectedFileIds: string[]) => void;
  onReopenActivity: (activityId: string, reason: string) => void;
  onNavigateToTransfer: () => void;
}

export const Faaliyetler: React.FC<FaaliyetlerProps> = ({
  activities,
  departments,
  currentUser,
  currentFiscalYear,
  onSaveActivity,
  onDeleteActivity,
  onRequestApproval,
  onReopenActivity,
}) => {
  // --- Filter State (Matching Şekil 4) ---
  const [filterTitle, setFilterTitle] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterApprovalStatus, setFilterApprovalStatus] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterApprovalDate, setFilterApprovalDate] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Activity for Detail / Edit / Approval Modal
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'dosyalar' | 'detay' | 'gecmis'>('dosyalar');

  // Editable fields for detail modal (matching Şekil 3 & 5 "Güncelle")
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState<'Düşük' | 'Orta' | 'Yüksek'>('Orta');
  const [editEstEndDate, setEditEstEndDate] = useState('');

  // New Activity Modal State (Matching Şekil 2)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'Düşük' | 'Orta' | 'Yüksek'>('Orta');
  const [newEstEndDate, setNewEstEndDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFiles, setNewFiles] = useState<ActivityFile[]>([]);
  const [fileInputDesc, setFileInputDesc] = useState('');

  // Send to Approval Wizard State (Matching Şekil 6 & 7)
  const [showSendApprovalModal, setShowSendApprovalModal] = useState(false);
  const [approvalWizardStep, setApprovalWizardStep] = useState<1 | 2>(1);
  const [selectedApprovalType, setSelectedApprovalType] = useState<'Faaliyet' | 'Dosya'>('Faaliyet');
  const [selectedFileIdsForApproval, setSelectedFileIdsForApproval] = useState<string[]>([]);

  // Reopen Modal State (Matching Şekil 10)
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  // Toast / Feedback message
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const isYearLocked = currentFiscalYear.isLocked;
  const isObserver = currentUser.role === 'Gözlemci';

  // SubUnit options based on selected Department in filter
  const availableSubUnits = useMemo(() => {
    if (!filterDept) {
      return departments.flatMap((d) => d.subUnits);
    }
    const found = departments.find((d) => d.name === filterDept);
    return found ? found.subUnits : [];
  }, [departments, filterDept]);

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Role scope filter (Rule 7108-UC3-BR-001 & 002)
      if (currentUser.role === 'Standart Kullanıcı') {
        if (act.currentUnit !== currentUser.unit) return false;
      }

      if (filterTitle && !act.title.toLowerCase().includes(filterTitle.toLowerCase())) return false;
      if (filterDept && act.department !== filterDept) return false;
      if (filterUnit && act.currentUnit !== filterUnit) return false;
      if (filterPriority && act.priority !== filterPriority) return false;
      if (filterApprovalStatus && act.approvalStatus !== filterApprovalStatus) return false;
      if (filterAuthor && !act.createdUser.toLowerCase().includes(filterAuthor.toLowerCase())) return false;
      if (filterStartDate && !act.startDate.includes(filterStartDate)) return false;
      if (filterEndDate && !act.estimatedEndDate.includes(filterEndDate)) return false;
      if (filterApprovalDate && (!act.approvalDate || !act.approvalDate.includes(filterApprovalDate))) return false;

      return true;
    });
  }, [
    activities,
    currentUser,
    filterTitle,
    filterDept,
    filterUnit,
    filterPriority,
    filterApprovalStatus,
    filterAuthor,
    filterStartDate,
    filterEndDate,
    filterApprovalDate,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / itemsPerPage));
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearFilters = () => {
    setFilterTitle('');
    setFilterDept('');
    setFilterUnit('');
    setFilterPriority('');
    setFilterApprovalStatus('');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterAuthor('');
    setFilterApprovalDate('');
    setCurrentPage(1);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Faaliyet Adı',
      'Daire Başkanlığı',
      'Birim',
      'Öncelik',
      'Başlangıç Tarihi',
      'Tahmini Bitiş Tarihi',
      'Oluşturan Kullanıcı',
      'Onay Durumu',
      'Onay Tarihi',
    ];
    const rows = filteredActivities.map((a) => [
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.department}"`,
      `"${a.currentUnit}"`,
      a.priority,
      a.startDate,
      a.estimatedEndDate,
      `"${a.createdUser}"`,
      a.approvalStatus,
      a.approvalDate || '-',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SGB_Faaliyetler_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Create Activity Modal (Rule 7108-UC2-FR-002: unit & dept auto-filled and read-only)
  const handleOpenAddModal = () => {
    if (isYearLocked) {
      setToast({ type: 'error', text: 'Kilitli faaliyet yılında yeni faaliyet eklenemez.' });
      return;
    }
    if (isObserver) {
      setToast({ type: 'error', text: 'Gözlemci rolü ile yeni faaliyet oluşturulamaz.' });
      return;
    }
    setNewTitle('');
    setNewPriority('Orta');
    setNewEstEndDate('');
    setNewDescription('');
    setNewFiles([]);
    setShowAddModal(true);
  };

  // File Upload Simulator
  const handleAddFile = (fileName: string, sizeStr: string = '2.4 MB') => {
    if (newFiles.some((f) => f.name.toLowerCase() === fileName.toLowerCase())) {
      alert('Bu isimde bir dosya zaten listede mevcuttur.');
      return;
    }
    const newFileObj: ActivityFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: fileName,
      size: sizeStr,
      uploadDate: new Date().toLocaleDateString('tr-TR'),
      uploadedBy: currentUser.fullName,
      description: fileInputDesc || 'Ek doküman',
      approvalStatus: 'Onaylanabilir',
    };
    setNewFiles([...newFiles, newFileObj]);
    setFileInputDesc('');
  };

  // Submit New Activity (Bitiş Tarihi isteğe bağlı)
  const handleSubmitNewActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      setToast({ type: 'error', text: 'Lütfen faaliyet adı ve açıklama alanlarını doldurunuz.' });
      return;
    }

    const todayStr = new Date().toLocaleDateString('tr-TR');
    const trimmedEnd = newEstEndDate.trim();
    const newActivityObj: Activity = {
      id: `act-${Date.now()}`,
      title: newTitle.trim(),
      department: currentUser.department,
      currentUnit: currentUser.unit,
      priority: newPriority,
      startDate: todayStr,
      estimatedEndDate: trimmedEnd || '-',
      dateRange: trimmedEnd ? `${todayStr} - ${trimmedEnd}` : todayStr,
      description: newDescription.trim(),
      createdUser: currentUser.fullName,
      createdDate: `${todayStr} ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`,
      updatedUser: currentUser.fullName,
      updatedDate: `${todayStr} ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`,
      approvalStatus: 'Taslak',
      internalStatus: 'Devam Ediyor',
      year: currentFiscalYear.year,
      files: newFiles,
      approvalHistory: [
        {
          id: `hist-${Date.now()}`,
          type: 'Faaliyet Onayı',
          performedBy: currentUser.fullName,
          date: todayStr,
          result: 'Onaya Gönderildi',
          reason: 'Faaliyet taslak olarak oluşturuldu.',
        },
      ],
      fileName: newFiles[0]?.name || 'Belge_Eklenmedi.pdf',
      hasPendingApproval: false,
      status: 'Aktif',
    };

    onSaveActivity(newActivityObj);
    setShowAddModal(false);
    setToast({ type: 'success', text: `"${newTitle}" faaliyeti başarıyla oluşturuldu.` });
  };

  // Open Activity Detail and populate editable draft
  const handleSelectActivity = (act: Activity) => {
    setSelectedActivity(act);
    setEditTitle(act.title);
    setEditDescription(act.description);
    setEditPriority(act.priority);
    setEditEstEndDate(act.estimatedEndDate === '-' ? '' : act.estimatedEndDate);
    setActiveDetailTab('dosyalar');
  };

  // Update Activity Details (matching Şekil 3 & 5 "Güncelle")
  const handleUpdateCurrentActivity = () => {
    if (!selectedActivity) return;
    if (isYearLocked) {
      setToast({ type: 'error', text: 'Kilitli faaliyet yılında güncelleme yapılamaz.' });
      return;
    }
    if (selectedActivity.approvalStatus === 'Onay Bekliyor') {
      setToast({ type: 'error', text: 'Onay sürecindeki faaliyetler üzerinde güncelleme yapılamaz.' });
      return;
    }
    if (selectedActivity.approvalStatus === 'Onaylandı') {
      setToast({ type: 'error', text: 'Onaylanmış faaliyetler üzerinde doğrudan güncelleme yapılamaz.' });
      return;
    }
    if (!editTitle.trim()) {
      setToast({ type: 'error', text: 'Faaliyet adı alanı zorunludur.' });
      return;
    }
    if (!editDescription.trim()) {
      setToast({ type: 'error', text: 'Faaliyet açıklaması alanı zorunludur.' });
      return;
    }

    const now = new Date();
    const dateStr = `${now.toLocaleDateString('tr-TR')} ${now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
    const trimmedEnd = editEstEndDate.trim();
    const dateRangeStr = trimmedEnd ? `${selectedActivity.startDate} - ${trimmedEnd}` : selectedActivity.startDate;

    const updated: Activity = {
      ...selectedActivity,
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
      estimatedEndDate: trimmedEnd || '-',
      dateRange: dateRangeStr,
      updatedUser: currentUser.fullName,
      updatedDate: dateStr,
    };

    onSaveActivity(updated);
    setSelectedActivity(updated);
    setToast({ type: 'success', text: `"${updated.title}" faaliyeti başarıyla güncellendi.` });
  };

  // Handle Send to Approval
  const handleOpenSendApprovalModal = (act: Activity) => {
    if (isYearLocked) {
      setToast({ type: 'error', text: 'Kilitli faaliyet yılında onaya gönderme işlemi yapılamaz.' });
      return;
    }
    setSelectedActivity(act);
    setSelectedApprovalType('Faaliyet');
    setSelectedFileIdsForApproval(act.files.map((f) => f.id));
    setApprovalWizardStep(1);
    setShowSendApprovalModal(true);
  };

  const handleConfirmSendToApproval = () => {
    if (!selectedActivity) return;
    if (selectedApprovalType === 'Dosya' && selectedFileIdsForApproval.length === 0) {
      setToast({ type: 'error', text: 'Lütfen onaya gönderilecek en az bir dosya seçiniz.' });
      return;
    }

    onRequestApproval(selectedActivity.id, selectedApprovalType, selectedFileIdsForApproval);
    setShowSendApprovalModal(false);
    setSelectedActivity(null);
    setToast({
      type: 'success',
      text: `${selectedApprovalType === 'Faaliyet' ? 'Faaliyet ve tüm dosyaları' : `${selectedFileIdsForApproval.length} adet dosya`} başarıyla onaya gönderildi.`,
    });
  };

  // Handle Reopen Activity (Yetkili Onaycı)
  const handleConfirmReopen = () => {
    if (!selectedActivity || !reopenReason.trim()) {
      setToast({ type: 'error', text: 'Yeniden faaliyete açma gerekçesi zorunludur.' });
      return;
    }
    onReopenActivity(selectedActivity.id, reopenReason.trim());
    setSelectedActivity({
      ...selectedActivity,
      approvalStatus: 'Taslak',
      internalStatus: 'Devam Ediyor',
      approvalDate: null,
      files: selectedActivity.files.map((f) => ({
        ...f,
        approvalStatus: 'Onaylanabilir',
        approvalDate: null,
      })),
    });
    setShowReopenModal(false);
    setReopenReason('');
    setToast({
      type: 'success',
      text: 'Faaliyet başarıyla yeniden düzenlemeye açıldı. Artık açıklama ve diğer bilgileri güncelleyebilirsiniz.',
    });
  };

  // Delete Activity (Rule 7108-UC2-BR-005)
  const handleDeleteActivity = (act: Activity) => {
    if (act.approvalStatus === 'Onay Bekliyor') {
      alert('Onay sürecindeki faaliyetler silinemez! Öncelikle onay sürecinin tamamlanması veya iade edilmesi gerekir.');
      return;
    }
    if (act.approvalStatus === 'Onaylandı') {
      alert('Onaylanmış faaliyetler doğrudan silinemez! Öncelikle yetkili onaycı tarafından yeniden düzenlemeye açılmalıdır.');
      return;
    }
    if (window.confirm(`"${act.title}" faaliyetini silmek istediğinize emin misiniz?`)) {
      onDeleteActivity(act.id);
      setSelectedActivity(null);
      setToast({ type: 'info', text: 'Faaliyet silindi.' });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-lg text-sm border shadow-xs transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : toast.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-sky-50 border-sky-200 text-sky-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
            {toast.type === 'info' && <Clock className="w-4 h-4 text-sky-600" />}
            <span className="font-medium">{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:bg-black/5 rounded-xs">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Title & Action Bar (Matching Şekil 4 Header) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Faaliyet Yönetimi (UC-02 / UC-03)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Faaliyetler
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Faaliyetler; arama, filtreleme, detay ve onay süreçleri yönetimi
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition-colors shadow-2xs"
            title="Arama sonuçlarını CSV olarak dışa aktar"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Dışa Aktar</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            disabled={isYearLocked || isObserver}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-xs font-semibold transition-colors shadow-2xs ${
              isYearLocked || isObserver
                ? 'bg-slate-400 cursor-not-allowed opacity-70'
                : 'bg-[#0284c7] hover:bg-[#0275b1]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Faaliyet</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Panel (Matching Şekil 4 Arama / Filtreleme) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Search className="w-4 h-4 text-sky-600" />
            <span>Arama / Filtreleme</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredActivities.length} sonuç
          </span>
        </div>

        {/* 1st Row of Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Faaliyet Adı</label>
            <input
              type="text"
              value={filterTitle}
              onChange={(e) => {
                setFilterTitle(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Faaliyet adı giriniz..."
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Daire Başkanlığı</label>
            <select
              value={filterDept}
              onChange={(e) => {
                setFilterDept(e.target.value);
                setFilterUnit('');
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:border-sky-500 bg-white"
            >
              <option value="">Seçiniz</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Birim (Grup/Müdürlük)</label>
            <select
              value={filterUnit}
              onChange={(e) => {
                setFilterUnit(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:border-sky-500 bg-white"
            >
              <option value="">Seçiniz</option>
              {availableSubUnits.map((su) => (
                <option key={su.id} value={su.name}>
                  {su.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Öncelik Durumu</label>
            <select
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:border-sky-500 bg-white"
            >
              <option value="">Seçiniz</option>
              <option value="Yüksek">Yüksek</option>
              <option value="Orta">Orta</option>
              <option value="Düşük">Düşük</option>
            </select>
          </div>
        </div>

        {/* 2nd Row of Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs items-end">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Onay Durumu</label>
            <select
              value={filterApprovalStatus}
              onChange={(e) => {
                setFilterApprovalStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:border-sky-500 bg-white"
            >
              <option value="">Seçiniz</option>
              <option value="Taslak">Taslak</option>
              <option value="Onay Bekliyor">Onay Bekliyor</option>
              <option value="Onaylandı">Onaylandı</option>
              <option value="İade Edildi">İade Edildi</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Başlangıç Tarihi</label>
            <input
              type="text"
              value={filterStartDate}
              onChange={(e) => {
                setFilterStartDate(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="GG.AA.YYYY"
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Oluşturan Kullanıcı</label>
            <input
              type="text"
              value={filterAuthor}
              onChange={(e) => {
                setFilterAuthor(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Kullanıcı adı..."
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Onay Tarihi</label>
            <input
              type="text"
              value={filterApprovalDate}
              onChange={(e) => {
                setFilterApprovalDate(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="GG.AA.YYYY"
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50 font-semibold flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Temizle</span>
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className="flex-1 px-3 py-1.5 bg-[#0284c7] hover:bg-[#0275b1] text-white rounded-md font-semibold flex items-center justify-center gap-1 shadow-2xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Ara</span>
            </button>
          </div>
        </div>
      </div>

      {/* Activities Data Table (Matching Şekil 4 Tablo) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm text-slate-700">
            <thead className="bg-[#f8fafc] border-b border-slate-200 text-xs font-semibold text-slate-800">
              <tr>
                <th className="px-4 py-3.5">Faaliyet Adı</th>
                <th className="px-4 py-3.5">Daire Başkanlığı</th>
                <th className="px-4 py-3.5">Birim</th>
                <th className="px-3 py-3.5 text-center">Öncelik</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Başlangıç</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Tahmini Bitiş</th>
                <th className="px-4 py-3.5">Oluşturan</th>
                <th className="px-3 py-3.5">Onay Durumu</th>
                <th className="px-3 py-3.5">Onay Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedActivities.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    Arama kriterlerine uygun faaliyet bulunamadı.
                  </td>
                </tr>
              ) : (
                paginatedActivities.map((act) => (
                  <tr
                    key={act.id}
                    onClick={() => handleSelectActivity(act)}
                    className="hover:bg-sky-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900 max-w-[200px] truncate">
                      {act.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate text-xs">
                      {act.department}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[150px] truncate text-xs">
                      {act.currentUnit}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          act.priority === 'Yüksek'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : act.priority === 'Orta'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {act.priority}
                      </span>
                    </td>
                    <td className="px-3 py-3 tabular-nums text-slate-600 whitespace-nowrap text-xs">
                      {act.startDate}
                    </td>
                    <td className="px-3 py-3 tabular-nums text-slate-600 whitespace-nowrap text-xs">
                      {act.estimatedEndDate}
                    </td>
                    <td className="px-4 py-3 text-slate-700 text-xs truncate max-w-[120px]">
                      {act.createdUser}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {act.approvalStatus === 'Onaylandı' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Onaylandı</span>
                        </span>
                      ) : act.approvalStatus === 'Onay Bekliyor' ? (
                        act.pendingApprovalType === 'Dosya' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                            <Clock className="w-3 h-3 text-purple-600" />
                            <span>Dosya Paketi Onayda ({act.pendingApprovalFileIds?.length || 1})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                            <Clock className="w-3 h-3 text-sky-600" />
                            <span>Faaliyet Onayda</span>
                          </span>
                        )
                      ) : act.approvalStatus === 'İade Edildi' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>İade Edildi</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <span>Taslak</span>
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 tabular-nums text-slate-500 whitespace-nowrap text-xs">
                      {act.approvalDate || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination (Matching Şekil 4 Toplam Kayıt) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-t border-slate-200 bg-[#f8fafc] text-xs text-slate-600 gap-3">
          <span className="tabular-nums font-medium">
            Toplam {filteredActivities.length} kayıt listelendi
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 border border-slate-300 rounded-md bg-white disabled:opacity-40"
            >
              Önceki
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  currentPage === p
                    ? 'bg-[#0284c7] text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 border border-slate-300 rounded-md bg-white disabled:opacity-40"
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Şekil 2: Yeni Faaliyet Ekleme Modalı                                     */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Faaliyet Ekleme</h3>
                <p className="text-xs text-slate-500">
                  Yeni kurumsal faaliyet ve ilgili dokümanları oluşturun
                </p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewActivity} className="space-y-4 text-xs md:text-sm">
              {/* Birim & Daire Bilgisi (Salt Okunur - Belgenet Entegrasyonu) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Organizasyon Bilgisi (Belgenet Kaynaklı)</span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Salt Okunur</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-500 block">Daire Başkanlığı:</span>
                    <span className="font-semibold text-slate-800">{currentUser.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Grup / Müdürlük:</span>
                    <span className="font-semibold text-sky-700">{currentUser.unit}</span>
                  </div>
                </div>
              </div>

              {/* Faaliyet Adı * */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800">
                    Faaliyet Adı <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <span className="text-xs text-slate-400 tabular-nums">{newTitle.length}/255</span>
                </div>
                <input
                  type="text"
                  maxLength={255}
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Faaliyet adını giriniz..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              {/* Öncelik & Tahmini Bitiş Tarihi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">
                    Öncelik Durumu <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white focus:outline-hidden focus:border-sky-500"
                  >
                    <option value="Yüksek">Yüksek</option>
                    <option value="Orta">Orta</option>
                    <option value="Düşük">Düşük</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">
                    Tahmini Bitiş Tarihi <span className="text-xs text-slate-400 font-normal">(İsteğe Bağlı)</span>
                  </label>
                  <input
                    type="text"
                    value={newEstEndDate}
                    onChange={(e) => setNewEstEndDate(e.target.value)}
                    placeholder="GG.AA.YYYY (Örn: 31.12.2026)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Açıklama * */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800">
                    Açıklama <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <span className="text-xs text-slate-400 tabular-nums">{newDescription.length}/1000</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={1000}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Faaliyet hakkında detaylı açıklama giriniz..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:border-sky-500 resize-y"
                />
              </div>

              {/* Dosya Ekleme Alanı (Matching Şekil 2 Dosya Ekleme Dropzone) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-900 block">Dosya Ekleme</label>
                <div className="p-4 border-2 border-dashed border-sky-300 bg-sky-50/40 rounded-xl text-center space-y-2">
                  <Upload className="w-8 h-8 text-sky-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    Dosya seçmek için tıklayın veya sürükleyip bırakın
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Desteklenen dosya formatları: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Maksimum 20 MB)
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAddFile('Strateji_Belgesi.pdf', '3.2 MB')}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md hover:bg-slate-50 font-medium"
                    >
                      + Örnek PDF Ekle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddFile('Mali_Tablo.xlsx', '1.4 MB')}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md hover:bg-slate-50 font-medium"
                    >
                      + Örnek XLSX Ekle
                    </button>
                  </div>
                </div>

                {/* Eklenen Dosyalar Tablosu */}
                {newFiles.length > 0 && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden mt-2">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                        <tr>
                          <th className="px-3 py-2">Dosya Adı</th>
                          <th className="px-3 py-2">Boyut</th>
                          <th className="px-3 py-2 text-right">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {newFiles.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-medium text-slate-800 flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5 text-sky-600" />
                              <span>{f.name}</span>
                            </td>
                            <td className="px-3 py-2 text-slate-500 tabular-nums">{f.size}</td>
                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => setNewFiles(newFiles.filter((item) => item.id !== f.id))}
                                className="text-rose-600 hover:text-rose-800"
                              >
                                <Trash2 className="w-3.5 h-3.5 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0284c7] hover:bg-[#0275b1] text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Şekil 3 & Şekil 5: Faaliyet Detay / Düzenleme & Onaya Gönder Ekranı        */}
      {/* ========================================================================= */}
      {selectedActivity && !showSendApprovalModal && !showReopenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Faaliyet Detayı: {selectedActivity.title}
                  </h3>
                  {selectedActivity.approvalStatus === 'Onaylandı' ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Onaylandı
                    </span>
                  ) : selectedActivity.approvalStatus === 'Onay Bekliyor' ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      Onay Bekliyor
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {selectedActivity.approvalStatus}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedActivity.department} · {selectedActivity.currentUnit}
                </p>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs (Dosyalar, Detay Bilgileri, Onay Geçmişi) */}
            <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveDetailTab('dosyalar')}
                className={`pb-2.5 px-3 border-b-2 transition-colors ${
                  activeDetailTab === 'dosyalar'
                    ? 'border-[#0284c7] text-[#0284c7]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Dosyalar ({selectedActivity.files.length})
              </button>
              <button
                onClick={() => setActiveDetailTab('detay')}
                className={`pb-2.5 px-3 border-b-2 transition-colors ${
                  activeDetailTab === 'detay'
                    ? 'border-[#0284c7] text-[#0284c7]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Detay Bilgileri
              </button>
              <button
                onClick={() => setActiveDetailTab('gecmis')}
                className={`pb-2.5 px-3 border-b-2 transition-colors ${
                  activeDetailTab === 'gecmis'
                    ? 'border-[#0284c7] text-[#0284c7]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Onay Geçmişi ({selectedActivity.approvalHistory.length})
              </button>
            </div>

            {/* Tab 1: Dosyalar (Matching Şekil 5 Dosyalar Tablosu) */}
            {activeDetailTab === 'dosyalar' && (
              <div className="space-y-3">
                {selectedActivity.approvalStatus === 'Onay Bekliyor' && (
                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-900 text-xs flex items-center gap-2">
                    <Lock className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>
                      Bu faaliyet ve dosyaları şu anda onay sürecindedir (Onay Bekliyor). Onay sürecindeki faaliyet ve dosyalar üzerinde silme ve düzenleme yapılamaz.
                    </span>
                  </div>
                )}

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f8fafc] border-b border-slate-200 font-semibold text-slate-800">
                      <tr>
                        <th className="px-4 py-2.5">Dosya Adı</th>
                        <th className="px-4 py-2.5">Açıklama</th>
                        <th className="px-3 py-2.5">Boyut</th>
                        <th className="px-3 py-2.5">Durum</th>
                        <th className="px-3 py-2.5 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedActivity.files.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                            Faaliyete eklenmiş dosya bulunmamaktadır.
                          </td>
                        </tr>
                      ) : (
                        selectedActivity.files.map((file) => (
                          <tr key={file.id} className="hover:bg-slate-50">
                            <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5 text-sky-600" />
                              <span>{file.name}</span>
                            </td>
                            <td className="px-4 py-2.5 text-slate-600">{file.description || '-'}</td>
                            <td className="px-3 py-2.5 text-slate-500 tabular-nums">{file.size}</td>
                            <td className="px-3 py-2.5">
                              {file.approvalStatus === 'Onaylandı' ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Onaylandı
                                </span>
                              ) : file.approvalStatus === 'Onay Bekliyor' ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                                  Onay Bekliyor
                                </span>
                              ) : file.approvalStatus === 'İade Edildi' ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                  İade Edildi
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                                  Onaylanabilir
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <button
                                onClick={() => alert(`${file.name} indiriliyor...`)}
                                className="text-sky-600 hover:text-sky-800 font-semibold mr-2 cursor-pointer"
                              >
                                İndir
                              </button>
                              {!['Onaylandı', 'Onay Bekliyor'].includes(selectedActivity.approvalStatus) &&
                                !['Onaylandı', 'Onay Bekliyor'].includes(file.approvalStatus) &&
                                !isYearLocked && (
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Bu dosyayı silmek istediğinize emin misiniz?')) {
                                        const updatedFiles = selectedActivity.files.filter((f) => f.id !== file.id);
                                        const updatedAct = { ...selectedActivity, files: updatedFiles };
                                        onSaveActivity(updatedAct);
                                        setSelectedActivity(updatedAct);
                                        setToast({ type: 'info', text: `"${file.name}" dosyası silindi.` });
                                      }
                                    }}
                                    className="text-rose-600 hover:text-rose-800 cursor-pointer"
                                  >
                                    Sil
                                  </button>
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

            {/* Tab 2: Detay Bilgileri & Düzenleme (Matching Şekil 3 & Şekil 5) */}
            {activeDetailTab === 'detay' && (
              <div className="space-y-4 text-xs">
                {selectedActivity.approvalStatus === 'Onaylandı' ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Bu faaliyet onaylanmıştır. Doğrudan değişiklik yapılamaz. Değişiklik için Yetkili Onaycı tarafından <strong>Yeniden Düzenlemeye Aç</strong> işlemi yapılmalıdır.
                      </span>
                    </div>
                    {currentUser.canReopen && (
                      <button
                        type="button"
                        onClick={() => setShowReopenModal(true)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        Yeniden Düzenlemeye Aç
                      </button>
                    )}
                  </div>
                ) : selectedActivity.approvalStatus === 'Onay Bekliyor' ? (
                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-900 text-xs flex items-center gap-2">
                    <Lock className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>
                      Bu faaliyet şu anda onay sürecindedir (Onay Bekliyor). Onay sürecindeki faaliyet ve dosyalar üzerinde düzenleme, güncelleme veya silme işlemi yapılamaz.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-900 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>
                        Faaliyet bilgilerini düzenleyebilir ve alttaki <strong>"Güncelle"</strong> butonuna basarak kaydedebilirsiniz.
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                  {/* Faaliyet Adı */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Faaliyet Adı *</label>
                    <input
                      type="text"
                      disabled={['Onaylandı', 'Onay Bekliyor'].includes(selectedActivity.approvalStatus) || isYearLocked}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-800 disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>

                  {/* Öncelik & Tahmini Bitiş Tarihi */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Öncelik Durumu</label>
                      <select
                        disabled={['Onaylandı', 'Onay Bekliyor'].includes(selectedActivity.approvalStatus) || isYearLocked}
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs text-slate-800 disabled:bg-slate-100"
                      >
                        <option value="Yüksek">Yüksek</option>
                        <option value="Orta">Orta</option>
                        <option value="Düşük">Düşük</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">
                        Tahmini Bitiş Tarihi <span className="text-slate-400 font-normal text-[11px]">(İsteğe Bağlı)</span>
                      </label>
                      <input
                        type="text"
                        disabled={['Onaylandı', 'Onay Bekliyor'].includes(selectedActivity.approvalStatus) || isYearLocked}
                        value={editEstEndDate}
                        onChange={(e) => setEditEstEndDate(e.target.value)}
                        placeholder="GG.AA.YYYY"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs text-slate-800 disabled:bg-slate-100"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Başlangıç Tarihi</label>
                      <input
                        type="text"
                        disabled
                        value={selectedActivity.startDate}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-100 text-xs text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Açıklama */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-700">Faaliyet Açıklaması *</label>
                      <span className="text-slate-400 text-[11px] tabular-nums">{editDescription.length}/1000</span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={1000}
                      disabled={['Onaylandı', 'Onay Bekliyor'].includes(selectedActivity.approvalStatus) || isYearLocked}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Faaliyet açıklaması..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-800 disabled:bg-slate-100 resize-y focus:outline-hidden focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Sistem Bilgileri Kartı (Şekil 3 alt alan) */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <h4 className="font-bold text-slate-700 mb-2">Sistem Bilgileri</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Oluşturulma Tarihi:</span>
                      <span className="font-medium text-slate-800">{selectedActivity.createdDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Oluşturan Kullanıcı:</span>
                      <span className="font-medium text-slate-800">{selectedActivity.createdUser}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Son Güncelleme:</span>
                      <span className="font-medium text-slate-800">{selectedActivity.updatedDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Güncelleyen:</span>
                      <span className="font-medium text-slate-800">{selectedActivity.updatedUser}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Onay Geçmişi (Matching Şekil 5 Onay Geçmişi) */}
            {activeDetailTab === 'gecmis' && (
              <div className="space-y-3">
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f8fafc] border-b border-slate-200 font-semibold text-slate-800">
                      <tr>
                        <th className="px-4 py-2.5">İşlem Türü</th>
                        <th className="px-4 py-2.5">İşlemi Yapan</th>
                        <th className="px-3 py-2.5">Tarih</th>
                        <th className="px-3 py-2.5">Sonuç</th>
                        <th className="px-4 py-2.5">Gerekçe / Açıklama</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedActivity.approvalHistory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                            Henüz onay geçmişi kaydı bulunmuyor.
                          </td>
                        </tr>
                      ) : (
                        selectedActivity.approvalHistory.map((h) => (
                          <tr key={h.id}>
                            <td className="px-4 py-2.5 font-semibold text-slate-800">{h.type}</td>
                            <td className="px-4 py-2.5 text-slate-700">{h.performedBy}</td>
                            <td className="px-3 py-2.5 text-slate-500 tabular-nums">{h.date}</td>
                            <td className="px-3 py-2.5">
                              <span className="font-semibold text-sky-700">{h.result}</span>
                            </td>
                            <td className="px-4 py-2.5 text-slate-600 italic">{h.reason || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Bottom Actions (Matching Şekil 5 Güncelle & Onaya Gönder) */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {/* Delete button (Only for Taslak or İade Edildi, not allowed when in approval or approved) */}
              {['Taslak', 'İade Edildi'].includes(selectedActivity.approvalStatus) && !isYearLocked && (
                <button
                  type="button"
                  onClick={() => handleDeleteActivity(selectedActivity)}
                  className="px-3 py-2 text-rose-600 hover:text-rose-800 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Faaliyeti Sil</span>
                </button>
              )}

              <div className="flex items-center gap-2.5 ml-auto">
                {/* Güncelle Butonu (Tekil, çalışan buton - Yalnızca Taslak veya İade Edildi durumunda aktiftir) */}
                {['Taslak', 'İade Edildi'].includes(selectedActivity.approvalStatus) && !isYearLocked && (
                  <button
                    type="button"
                    onClick={handleUpdateCurrentActivity}
                    className="px-5 py-2 rounded-lg bg-[#0284c7] hover:bg-[#0275b1] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Güncelle</span>
                  </button>
                )}

                {/* Reopen Button (Yetkili Onaycı & Admin, if approved) */}
                {selectedActivity.approvalStatus === 'Onaylandı' &&
                  (currentUser.canReopen || currentUser.role === 'Yetkili Onaycı' || currentUser.role === 'İş Birimi Admini') && (
                    <button
                      type="button"
                      onClick={() => setShowReopenModal(true)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Yeniden Düzenlemeye Aç</span>
                    </button>
                  )}

                {/* Send to Approval Button (if in draft or returned) */}
                {['Taslak', 'İade Edildi'].includes(selectedActivity.approvalStatus) && !isYearLocked && (
                  <button
                    type="button"
                    onClick={() => handleOpenSendApprovalModal(selectedActivity)}
                    className="px-5 py-2 bg-[#0284c7] hover:bg-[#0275b1] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Onaya Gönder</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedActivity(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Şekil 6 & Şekil 7: Onaya Gönder Wizard Modalı                            */}
      {/* ========================================================================= */}
      {showSendApprovalModal && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Onaya Gönder: {selectedActivity.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Adım {approvalWizardStep} / 2: {approvalWizardStep === 1 ? 'Onay Türü Seçimi' : 'Dosya Seçimi'}
                </p>
              </div>
              <button
                onClick={() => setShowSendApprovalModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Onay Türü Seçimi (Matching Şekil 6) */}
            {approvalWizardStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 font-medium">Onay Türü Seçiniz:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Faaliyet Onayı Kartı */}
                  <div
                    onClick={() => setSelectedApprovalType('Faaliyet')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all space-y-2 text-center ${
                      selectedApprovalType === 'Faaliyet'
                        ? 'border-[#0284c7] bg-sky-50/50 shadow-xs ring-1 ring-sky-300'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Faaliyet</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Seçilen faaliyet ve altındaki tüm dosyalar onay sürecine dahil edilir.
                    </p>
                    <input
                      type="radio"
                      name="approvalType"
                      checked={selectedApprovalType === 'Faaliyet'}
                      onChange={() => setSelectedApprovalType('Faaliyet')}
                      className="mt-1"
                    />
                  </div>

                  {/* Dosya Onayı Kartı */}
                  <div
                    onClick={() => setSelectedApprovalType('Dosya')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all space-y-2 text-center ${
                      selectedApprovalType === 'Dosya'
                        ? 'border-[#0284c7] bg-sky-50/50 shadow-xs ring-1 ring-sky-300'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Dosya</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Seçilen dosyalar bağımsız olarak onay sürecine dahil edilir.
                    </p>
                    <input
                      type="radio"
                      name="approvalType"
                      checked={selectedApprovalType === 'Dosya'}
                      onChange={() => setSelectedApprovalType('Dosya')}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowSendApprovalModal(false)}
                    className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedApprovalType === 'Dosya') {
                        setApprovalWizardStep(2);
                      } else {
                        handleConfirmSendToApproval();
                      }
                    }}
                    className="px-5 py-2 bg-[#0284c7] hover:bg-[#0275b1] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>{selectedApprovalType === 'Dosya' ? 'İleri' : 'Onaya Gönder'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Dosya Seçim Ekranı (Matching Şekil 7) */}
            {approvalWizardStep === 2 && (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600 font-semibold">Onaylanacak Dosyaları Seçin:</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-700 font-semibold">
                      <tr>
                        <th className="px-3 py-2 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={
                              selectedActivity.files.length > 0 &&
                              selectedFileIdsForApproval.length === selectedActivity.files.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFileIdsForApproval(selectedActivity.files.map((f) => f.id));
                              } else {
                                setSelectedFileIdsForApproval([]);
                              }
                            }}
                          />
                        </th>
                        <th className="px-3 py-2">Dosya Adı</th>
                        <th className="px-3 py-2">Açıklama</th>
                        <th className="px-3 py-2">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedActivity.files.map((f) => {
                        const isChecked = selectedFileIdsForApproval.includes(f.id);
                        return (
                          <tr key={f.id} className="hover:bg-slate-50">
                            <td className="px-3 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  setSelectedFileIdsForApproval((prev) =>
                                    prev.includes(f.id) ? prev.filter((id) => id !== f.id) : [...prev, f.id]
                                  );
                                }}
                              />
                            </td>
                            <td className="px-3 py-2 font-medium text-slate-800">{f.name}</td>
                            <td className="px-3 py-2 text-slate-500">{f.description || '-'}</td>
                            <td className="px-3 py-2">
                              <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-sm">
                                {f.approvalStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setApprovalWizardStep(1)}
                    className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Geri
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSendToApproval}
                    className="px-5 py-2 bg-[#0284c7] hover:bg-[#0275b1] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Onaya Gönder ({selectedFileIdsForApproval.length} dosya)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Şekil 10: Yeniden Düzenlemeye Açma Modalı (Yetkili Onaycı)                  */}
      {/* ========================================================================= */}
      {showReopenModal && selectedActivity && (
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

            {/* Info Box (Matching Şekil 10 Bilgi Panosu) */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Bu işlem ile onaylanmış faaliyet yeniden düzenlenmeye açılacaktır. Lütfen gerekçe açıklamasını giriniz.
              </span>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-slate-500 text-xs block">Faaliyet Adı:</span>
                  <span className="font-semibold text-slate-800">{selectedActivity.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Onay Tarihi:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {selectedActivity.approvalDate || '15.12.2026'}
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
