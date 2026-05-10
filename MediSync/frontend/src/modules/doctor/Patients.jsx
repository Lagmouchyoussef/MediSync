import { useState, useMemo } from "react";
import { useTheme, getPatientId } from "./DoctorShared";
import apiService from "../../core/services/api";
import { Icon, Modal, Badge, SearchInput } from "./DoctorUI";

export default function Patients({ patients, setPatients }) {
  const { dark } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({ 
    first_name: "", last_name: "", gender: "Male", phone: "", email: "", 
    address: "", date_of_birth: "", username: "", password: "" 
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, type: "single" });

  const filteredPatients = useMemo(() => patients.filter((p) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `PAT-${String(p.id).padStart(4, "0")}-${new Date(p.date).getFullYear()}`.includes(searchTerm)
  ), [patients, searchTerm]);

  const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingPatient) { 
        const updated = await apiService.updatePatient(editingPatient.id, formData);
        setPatients(patients.map((p) => p.id === editingPatient.id ? { ...updated, name: `${updated.first_name} ${updated.last_name}` } : p)); 
      } else { 
        const created = await apiService.createPatient(formData);
        setPatients([{ ...created, name: `${created.first_name} ${created.last_name}` }, ...patients]);
        await apiService.createActivity("Registered Patient", `New patient ${created.first_name} registered.`);
      }
      setShowModal(false); 
      setEditingPatient(null); 
      setFormData({ 
        first_name: "", last_name: "", gender: "Male", phone: "", email: "", 
        address: "", date_of_birth: "", username: "", password: "" 
      });
    } catch (err) {
      alert(err.message || "Error saving patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (patient) => { 
    setEditingPatient(patient); 
    setFormData({ 
      first_name: patient.first_name, last_name: patient.last_name, gender: patient.gender, 
      phone: patient.phone || "", email: patient.email || "", address: patient.address || "", 
      date_of_birth: patient.date_of_birth || "", username: patient.username || "", password: "" 
    }); 
    setShowModal(true); 
  };

  const handleDelete = async () => { 
    const { id } = deleteConfirm;
    if (!id) return;
    try {
      await apiService.deletePatient(id);
      setPatients(prev => prev.filter((p) => String(p.id) !== String(id)));
      setSelectedIds(prev => prev.filter(sId => String(sId) !== String(id)));
      await apiService.createActivity("Deleted Patient", `Patient ID ${id} was deleted.`, "danger");
      setDeleteConfirm({ isOpen: false, id: null, type: "single" });
    } catch (err) {
      alert("Failed to delete patient");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      for (const id of selectedIds) {
        await apiService.deletePatient(id);
      }
      setPatients(prev => prev.filter(p => !selectedIds.map(String).includes(String(p.id))));
      setSelectedIds([]);
      await apiService.createActivity("Bulk Deletion", `${selectedIds.length} patients were permanently deleted.`, "danger");
      setDeleteConfirm({ isOpen: false, id: null, type: "single" });
    } catch (err) {
      alert("Failed to delete some patients");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedPatients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedPatients.map(p => p.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const cardClass = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100";
  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-400" : "text-slate-500";
  const borderColor = dark ? "border-slate-800" : "border-slate-100";
  const hoverRow = dark ? "hover:bg-slate-800/50" : "hover:bg-slate-50";
  const headBg = dark ? "bg-slate-800/50" : "bg-slate-50/50";
  const inputClass = `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2da0a8] focus:border-transparent outline-none text-sm transition-all ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-800"}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black tracking-tight ${textPrimary}`}>Patient Management</h1>
          <p className={`mt-1 text-sm font-medium ${textSecondary}`}>{patients.length} patients registered in the program</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={() => setDeleteConfirm({ isOpen: true, id: null, type: "bulk" })}
              className="flex items-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-xl hover:bg-rose-600 transition-all font-bold text-sm shadow-lg shadow-rose-500/20 active:scale-95"
            >
              <Icon name="trash" className="w-4 h-4" />
              Delete ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={() => { setEditingPatient(null); setFormData({ first_name: "", last_name: "", gender: "Male", phone: "", email: "", address: "", date_of_birth: "" }); setShowModal(true); }} 
            className="flex items-center gap-2 bg-[#2da0a8] text-white px-5 py-2.5 rounded-xl hover:bg-[#258a91] transition-all font-bold text-sm shadow-lg shadow-teal-500/20 active:scale-95"
          >
            <Icon name="plus" className="w-4 h-4" /> New Patient
          </button>
        </div>
      </div>

      <div className={`${cardClass} rounded-2xl shadow-sm border overflow-hidden`}>
        <div className={`p-6 border-b ${borderColor}`}>
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by name, ID (PAT-...), or phone..." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={headBg}>
                <th className="p-4 w-10 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded accent-[#2da0a8]" 
                    checked={selectedIds.length === paginatedPatients.length && paginatedPatients.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className={`text-left p-4 text-[11px] font-black uppercase tracking-widest ${textSecondary}`}>ID & Patient</th>
                <th className={`text-left p-4 text-[11px] font-black uppercase tracking-widest ${textSecondary}`}>Age / Blood</th>
                <th className={`text-left p-4 text-[11px] font-black uppercase tracking-widest ${textSecondary}`}>Contact</th>
                <th className={`text-left p-4 text-[11px] font-black uppercase tracking-widest ${textSecondary}`}>Address</th>
                <th className={`text-left p-4 text-[11px] font-black uppercase tracking-widest ${textSecondary}`}>Status</th>
                <th className={`text-right p-4 text-[11px] font-black uppercase tracking-widest ${textSecondary}`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedPatients.map((patient) => {
                const isSelected = selectedIds.includes(patient.id);
                return (
                  <tr key={patient.id} className={`${isSelected ? (dark ? "bg-[#2da0a8]/10" : "bg-[#2da0a8]/5") : ""} ${hoverRow} transition-colors`}>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded accent-[#2da0a8]" 
                        checked={isSelected}
                        onChange={() => toggleSelect(patient.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-[#2da0a8] rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className={`text-xs font-black text-[#2da0a8] mb-0.5 tracking-tight`}>{getPatientId(patient)}</p>
                          <p className={`font-bold text-sm ${textPrimary}`}>{patient.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-sm font-medium ${textPrimary}`}>{patient.age} years</span>
                        <Badge variant="info">{patient.bloodType}</Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${textPrimary}`}>{patient.phone}</span>
                        <span className={`text-xs ${textSecondary}`}>{patient.email}</span>
                      </div>
                    </td>
                    <td className={`p-4 text-sm ${textSecondary}`}>{patient.address}</td>
                    <td className="p-4">
                      <Badge variant={patient.status === "Active" ? "success" : "danger"}>{patient.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(patient)} className={`p-2 rounded-lg transition-colors ${dark ? "hover:bg-slate-800 text-slate-400 hover:text-[#2da0a8]" : "hover:bg-slate-100 text-slate-500 hover:text-[#2da0a8]"}`}>
                          <Icon name="edit" className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm({ isOpen: true, id: patient.id, type: "single" })} className={`p-2 rounded-xl border transition-all ${dark ? "border-slate-800 hover:bg-rose-900/30 text-rose-400" : "border-slate-100 hover:bg-rose-50 text-rose-500"}`}>
                          <Icon name="trash" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className={`flex items-center justify-between p-4 border-t ${borderColor}`}>
            <p className={`text-sm font-medium ${textSecondary}`}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
                disabled={currentPage === 1} 
                className={`p-2 rounded-lg border transition-all disabled:opacity-30 ${dark ? "border-slate-800 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}
              >
                <Icon name="chevronLeft" className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button 
                  key={page} 
                  onClick={() => setCurrentPage(page)} 
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${currentPage === page ? "bg-[#2da0a8] text-white shadow-lg shadow-teal-500/20" : dark ? "border border-slate-800 hover:bg-slate-800 text-slate-400" : "border border-slate-200 hover:bg-slate-50 text-slate-600"}`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages} 
                className={`p-2 rounded-lg border transition-all disabled:opacity-30 ${dark ? "border-slate-800 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}
              >
                <Icon name="chevronRight" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingPatient ? "Edit Patient Details" : "Register New Patient"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${textSecondary}`}>First Name *</label>
              <input type="text" required value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className={inputClass} placeholder="John" />
            </div>
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${textSecondary}`}>Last Name *</label>
              <input type="text" required value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className={inputClass} placeholder="Doe" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${textSecondary}`}>Gender</label>
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className={inputClass}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${textSecondary}`}>Date of Birth *</label>
              <input type="date" required value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${textSecondary}`}>Phone *</label>
              <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="06XXXXXXXX" />
            </div>
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${textSecondary}`}>Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="patient@example.com" />
            </div>
          </div>
          <div>
            <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${textSecondary}`}>Address</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputClass} placeholder="123 Health Street, City" />
          </div>

          <div className={`p-4 rounded-2xl ${dark ? "bg-slate-800/50" : "bg-slate-50"} border ${borderColor} space-y-4`}>
            <p className={`text-[11px] font-black uppercase tracking-widest ${textSecondary}`}>Account Access</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${textSecondary}`}>Username</label>
                <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className={inputClass} placeholder="j.doe" />
              </div>
              <div>
                <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${textSecondary}`}>Password</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={inputClass} placeholder="••••••••" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className={`flex-1 px-6 py-3 border rounded-xl transition-all font-bold text-sm ${dark ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-[#2da0a8] text-white rounded-xl hover:bg-[#258a91] transition-all font-bold text-sm shadow-lg shadow-teal-500/20 active:scale-95 disabled:opacity-50">
              {isSubmitting ? "Processing..." : (editingPatient ? "Apply Changes" : "Register Patient")}
            </button>
          </div>
        </form>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ isOpen: false, id: null, type: "single" })} title="Confirm Deletion" size="sm">
        <div className="text-center py-4 space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="trash" className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className={`text-lg font-black ${dark ? "text-white" : "text-slate-800"}`}>
              {deleteConfirm.type === "bulk" ? `Delete ${selectedIds.length} Patients?` : "Delete Patient?"}
            </h3>
            <p className={`text-sm font-medium ${dark ? "text-slate-400" : "text-slate-500"} px-4 leading-relaxed`}>
              {deleteConfirm.type === "bulk" 
                ? `Are you sure you want to permanently delete these ${selectedIds.length} patients from the system?` 
                : "Permanently delete this patient from history?"}
            </p>
          </div>
          <div className="flex gap-3 pt-4 px-2">
            <button 
              onClick={() => setDeleteConfirm({ isOpen: false, id: null, type: "single" })}
              className={`flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${dark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
            >
              Cancel
            </button>
            <button onClick={deleteConfirm.type === "bulk" ? handleBulkDelete : handleDelete} className="flex-1 bg-rose-600 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-2">
              <Icon name="trash" className="w-4 h-4" />
              {deleteConfirm.type === "bulk" ? `Delete Selected (${selectedIds.length})` : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
