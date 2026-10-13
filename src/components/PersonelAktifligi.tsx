import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  X,
  ShieldCheck,
  Building2,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { User, Department } from '../types';

interface PersonelAktifligiProps {
  users: User[];
  departments: Department[];
  onUpdateUser: (updatedUser: User) => void;
  onSyncService: (type: 'amirler' | 'birimler') => void;
}

export const PersonelAktifligi: React.FC<PersonelAktifligiProps> = ({
  users,
  departments,
  onUpdateUser,
  onSyncService,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Selected User for Detail Modal (Matching Şekil 11 Personel Detayı)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Edit draft in modal
  const [isCandidateApprover, setIsCandidateApprover] = useState(false);
  const [canReopen, setCanReopen] = useState(false);

  const handleOpenDetailModal = (u: User) => {
    setSelectedUser(u);
    setIsCandidateApprover(u.isApproverCandidate);
    setCanReopen(u.canReopen);
  };

  const handleSaveUserDetail = () => {
    if (!selectedUser) return;
    const updated: User = {
      ...selectedUser,
      isApproverCandidate: isCandidateApprover,
      canReopen: isCandidateApprover ? canReopen : false, // Rule 7108-UC5-FR-045
    };
    onUpdateUser(updated);
    setSelectedUser(null);
  };

  const handleToggleActiveStatus = (u: User) => {
    if (u.isActive) {
      if (
        !window.confirm(
          `"${u.fullName}" adlı personeli pasife almak istediğinize emin misiniz? Eğer üzerinde bekleyen onay görevi varsa önce devredilmelidir.`
        )
      ) {
        return;
      }
    }
    const updated: User = {
      ...u,
      isActive: !u.isActive,
    };
    onUpdateUser(updated);
  };

  const filteredUsers = users.filter((u) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = u.fullName.toLowerCase().includes(q);
      const matchSicil = u.sicilNo.includes(q);
      if (!matchName && !matchSicil) return false;
    }
    if (filterUnit && u.unit !== filterUnit) return false;
    if (filterRole) {
      if (filterRole === 'Onaycı' && !u.isApproverCandidate) return false;
      if (filterRole === 'Amir' && !u.title.includes('Başkan') && !u.title.includes('Müdür')) return false;
    }
    if (filterStatus) {
      const isAct = filterStatus === 'Aktif';
      if (u.isActive !== isAct) return false;
    }
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Yönetim Paneli (UC-05)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Personel Listesi ve Yetki Yönetimi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personel ve amir bilgileri her gece kurumdan güncellenir. Acil durumda manuel senkronizasyon yapabilirsiniz.
          </p>
        </div>

        {/* Sync Buttons (Matching Şekil 11) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSyncService('amirler')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Amirleri Güncelle</span>
          </button>
          <button
            onClick={() => onSyncService('birimler')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Birimleri Güncelle</span>
          </button>
        </div>
      </div>

      {/* Filter and Table Container (Matching Şekil 11) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ad Soyad / Sicil No</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ad veya sicil ara..."
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Birimler</label>
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-hidden focus:border-sky-500"
            >
              <option value="">Tümü</option>
              {departments.flatMap((d) => d.subUnits).map((su) => (
                <option key={su.id} value={su.name}>
                  {su.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Görev / Onaycı</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-hidden focus:border-sky-500"
            >
              <option value="">Tümü</option>
              <option value="Amir">Amir</option>
              <option value="Onaycı">Onaycı Adayı</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Durum</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-hidden focus:border-sky-500"
            >
              <option value="">Tümü</option>
              <option value="Aktif">Aktif</option>
              <option value="Pasif">Pasif</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterUnit('');
                setFilterRole('');
                setFilterStatus('');
              }}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        </div>

        {/* Table (Matching Şekil 11) */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs md:text-sm text-slate-700">
            <thead className="bg-[#f8fafc] border-b border-slate-200 text-xs font-semibold text-slate-800">
              <tr>
                <th className="px-4 py-3">Ad Soyad</th>
                <th className="px-4 py-3">Sicil No</th>
                <th className="px-4 py-3">Birimler</th>
                <th className="px-4 py-3">Görev / Onaycı</th>
                <th className="px-3 py-3">Durum</th>
                <th className="px-4 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {u.fullName}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 tabular-nums">
                    {u.sicilNo}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    <span className="block font-medium text-slate-800">{u.unit}</span>
                    <span className="text-[11px] text-slate-400">{u.department}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-sm bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
                        Amir
                      </span>
                      {u.isApproverCandidate && (
                        <span className="px-2 py-0.5 rounded-sm bg-sky-50 text-sky-800 border border-sky-200 font-semibold text-[11px]">
                          Onaycı
                        </span>
                      )}
                      {u.canReopen && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                          Yeniden Açma Yetkili
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {u.isActive ? (
                      <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aktif</span>
                      </span>
                    ) : (
                      <span className="text-rose-600 font-semibold text-xs flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Pasif</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenDetailModal(u)}
                      className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                    >
                      Detay
                    </button>
                    <button
                      onClick={() => handleToggleActiveStatus(u)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                        u.isActive
                          ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                          : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-300'
                      }`}
                    >
                      {u.isActive ? '✕ Pasife Al' : '✓ Aktifleştir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Şekil 11: Personel Detayı Modalı                                         */}
      {/* ========================================================================= */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Personel Detayı: {selectedUser.fullName}
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Meta Grid matching Şekil 11 */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-slate-400 block text-[11px]">Sicil No</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {selectedUser.sicilNo}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Kullanıcı Adı</span>
                  <span className="font-medium text-slate-800">{selectedUser.username}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Durum</span>
                  <span className="font-semibold text-emerald-700">
                    {selectedUser.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Son Senkronizasyon</span>
                  <span className="text-slate-600">{selectedUser.lastSyncDate}</span>
                </div>
              </div>

              {/* Checkboxes matching Şekil 11 & Rule 7108-UC5-FR-045 */}
              <div className="p-3.5 bg-sky-50/50 border border-sky-200 rounded-lg space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isCandidateApprover}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsCandidateApprover(checked);
                      if (!checked) setCanReopen(false); // Rule 7108-UC5-FR-045: unchecking candidate disables reopen permission
                    }}
                    className="w-4 h-4 rounded-xs text-sky-600 focus:ring-sky-500"
                  />
                  <span>Onaycı Adayı</span>
                </label>

                <label
                  className={`flex items-center gap-2 font-semibold ${
                    isCandidateApprover
                      ? 'text-slate-800 cursor-pointer'
                      : 'text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!isCandidateApprover}
                    checked={canReopen}
                    onChange={(e) => setCanReopen(e.target.checked)}
                    className="w-4 h-4 rounded-xs text-sky-600 focus:ring-sky-500"
                  />
                  <span>Yeniden Düzenlemeye Açma Yetkisi</span>
                </label>
                {!isCandidateApprover && (
                  <p className="text-[10px] text-slate-500 pl-6">
                    * "Yeniden Düzenlemeye Açma Yetkisi" yalnızca Onaycı Adayı olarak belirlenmiş personel için tanımlanabilir.
                  </p>
                )}
              </div>

              {/* Birimler Listesi matching Şekil 11 */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Bağlı Birimler</span>
                <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{selectedUser.department}</p>
                    <p className="text-slate-500 text-[11px]">{selectedUser.unit}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="px-1.5 py-0.5 rounded-xs bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Amir
                      </span>
                      {isCandidateApprover && (
                        <span className="px-1.5 py-0.5 rounded-xs bg-sky-100 text-sky-800 text-[10px] font-bold">
                          Onaycı
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCandidateApprover(false);
                      setCanReopen(false);
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-semibold shadow-2xs"
                  >
                    Onaycılıktan Çıkar
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={handleSaveUserDetail}
                className="px-5 py-2 bg-[#0284c7] hover:bg-[#0275b1] text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
