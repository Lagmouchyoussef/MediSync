import { useState, useMemo } from "react";
import { useTheme, mockPatients } from "./DoctorShared";
import { Icon, Modal, Badge, SearchInput } from "./DoctorUI";

export default function Patients() {
  const { dark } = useTheme();
  const [patients, setPatients] = useState(mockPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [formData, setFormData] = useState({ name: "", age: "", gender: "Male", phone: "", email: "", address: "", bloodType: "" });

  const filteredPatients = useMemo(() => patients.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.phone.includes(searchTerm) || p.email.toLowerCase().includes(searchTerm.toLowerCase())), [patients, searchTerm]);
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPatient) { setPatients(patients.map((p) => p.id === editingPatient.id ? { ...p, ...formData } : p)); }
    else { setPatients([...patients, { id: patients.length + 1, ...formData, date: new Date().toISOString().split("T")[0], status: "Active", lastVisit: "N/A" }]); }
    setShowModal(false); setEditingPatient(null); setFormData({ name: "", age: "", gender: "Male", phone: "", email: "", address: "", bloodType: "" });
  };
  const handleEdit = (patient) => { setEditingPatient(patient); setFormData({ name: patient.name, age: patient.age.toString(), gender: patient.gender, phone: patient.phone, email: patient.email, address: patient.address, bloodType: patient.bloodType }); setShowModal(true); };
  const handleDelete = (id) => { if (confirm("Are you sure you want to delete this patient?")) setPatients(patients.filter((p) => p.id !== id)); };

  const cardClass = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const textPrimary = dark ? "text-white" : "text-gray-800";
  const textSecondary = dark ? "text-gray-400" : "text-gray-500";
  const borderColor = dark ? "border-gray-700" : "border-gray-100";
  const hoverRow = dark ? "hover:bg-gray-700" : "hover:bg-blue-50";
  const headBg = dark ? "bg-gray-700" : "bg-gray-50";
  const borderRow = dark ? "border-gray-700" : "border-gray-50";
  const inputClass = `w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${dark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-800"}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className={`text-2xl font-bold ${textPrimary}`}>Patient Management</h1><p className={`mt-1 ${textSecondary}`}>{patients.length} registered patients</p></div>
        <button onClick={() => { setEditingPatient(null); setFormData({ name: "", age: "", gender: "Male", phone: "", email: "", address: "", bloodType: "" }); setShowModal(true); }} className="flex items-center gap-2 bg-[#2da0a8] text-white px-6 py-2.5 rounded-xl hover:bg-[#258a91] transition-colors font-medium shadow-lg shadow-blue-200"><Icon name="plus" className="w-5 h-5" /> New Patient</button>
      </div>
      <div className={`${cardClass} rounded-2xl shadow-sm border overflow-hidden`}>
        <div className={`p-6 border-b ${borderColor}`}><SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by name, phone or email..." /></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className={headBg}><th className={`text-left p-4 text-sm font-semibold ${textSecondary}`}>Patient</th><th className={`text-left p-4 text-sm font-semibold ${textSecondary}`}>Age</th><th className={`text-left p-4 text-sm font-semibold ${textSecondary}`}>Blood Type</th><th className={`text-left p-4 text-sm font-semibold ${textSecondary}`}>Phone</th><th className={`text-left p-4 text-sm font-semibold ${textSecondary}`}>Address</th><th className={`text-left p-4 text-sm font-semibold ${textSecondary}`}>Status</th><th className={`text-right p-4 text-sm font-semibold ${textSecondary}`}>Actions</th></tr></thead>
            <tbody>{paginatedPatients.map((patient) => (<tr key={patient.id} className={`border-t ${borderRow} ${hoverRow} transition-colors`}><td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-[#2da0a8] rounded-full flex items-center justify-center text-white font-semibold">{patient.name.charAt(0)}</div><div><p className={`font-medium ${textPrimary}`}>{patient.name}</p><p className={`text-xs ${textSecondary}`}>{patient.email}</p></div></div></td><td className={`p-4 text-sm ${textSecondary}`}>{patient.age} years</td><td className="p-4"><Badge variant="info">{patient.bloodType}</Badge></td><td className={`p-4 text-sm ${textSecondary}`}>{patient.phone}</td><td className={`p-4 text-sm ${textSecondary}`}>{patient.address}</td><td className="p-4"><Badge variant={patient.status === "Active" ? "success" : "danger"}>{patient.status}</Badge></td><td className="p-4"><div className="flex items-center justify-end gap-2"><button onClick={() => handleEdit(patient)} className="p-2 text-[#2da0a8] hover:bg-blue-50 rounded-lg transition-colors"><Icon name="edit" className="w-4 h-4" /></button><button onClick={() => handleDelete(patient.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Icon name="trash" className="w-4 h-4" /></button></div></td></tr>))}</tbody>
          </table>
        </div>
        {totalPages > 1 && (<div className={`flex items-center justify-between p-4 border-t ${borderColor}`}><p className={`text-sm ${textSecondary}`}>Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length}</p><div className="flex gap-2"><button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${dark ? "border-gray-600 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"}`}><Icon name="chevronLeft" className="w-4 h-4" /></button>{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (<button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "bg-[#2da0a8] text-white" : dark ? "border border-gray-600 hover:bg-gray-700" : "border border-gray-200 hover:bg-gray-50"}`}>{page}</button>))}<button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${dark ? "border-gray-600 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"}`}><Icon name="chevronRight" className="w-4 h-4" /></button></div></div>)}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingPatient ? "Edit Patient" : "New Patient"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Full Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Patient name" /></div><div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Age *</label><input type="number" required value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className={inputClass} placeholder="Age" /></div></div>
          <div className="grid grid-cols-2 gap-4"><div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Gender</label><select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className={inputClass}><option value="Male">Male</option><option value="Female">Female</option></select></div><div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Blood Type</label><select value={formData.bloodType} onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })} className={inputClass}><option value="">Select</option>{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bt) => (<option key={bt} value={bt}>{bt}</option>))}</select></div></div>
          <div className="grid grid-cols-2 gap-4"><div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Phone *</label><input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="06XXXXXXXX" /></div><div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="email@example.com" /></div></div>
          <div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Address</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputClass} placeholder="Patient address" /></div>
          <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowModal(false)} className={`flex-1 px-6 py-2.5 border rounded-xl transition-colors font-medium ${dark ? "border-gray-600 hover:bg-gray-700 text-gray-300" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}>Cancel</button><button type="submit" className="flex-1 px-6 py-2.5 bg-[#2da0a8] text-white rounded-xl hover:bg-[#258a91] transition-colors font-medium shadow-lg shadow-blue-200">{editingPatient ? "Modify" : "Save"}</button></div>
        </form>
      </Modal>
    </div>
  );
}
