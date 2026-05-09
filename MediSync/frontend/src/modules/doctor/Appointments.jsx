import { useState, useMemo } from "react";
import { useTheme, mockAppointments, mockPatients } from "./DoctorShared";
import { Icon, Modal, Badge, SearchInput } from "./DoctorUI";

export default function Appointments() {
  const { dark } = useTheme();
  const [appointments, setAppointments] = useState(mockAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({ patient: "", doctor: "", date: "", time: "", type: "Consultation", status: "Pending", notes: "" });
  const doctors = ["Dr. Hassan Amrani", "Dr. Leila Berrada", "Dr. Rachid Tazi", "Dr. Nadia El Fassi"];
  
  const filteredAppointments = useMemo(() => appointments.filter((a) => a.patient.toLowerCase().includes(searchTerm.toLowerCase()) || a.doctor.toLowerCase().includes(searchTerm.toLowerCase()) || a.type.toLowerCase().includes(searchTerm.toLowerCase())), [appointments, searchTerm]);

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (editingAppointment) { setAppointments(appointments.map((a) => a.id === editingAppointment.id ? { ...a, ...formData } : a)); } 
    else { setAppointments([...appointments, { id: appointments.length + 1, ...formData }]); } 
    setShowModal(false); setEditingAppointment(null); setFormData({ patient: "", doctor: "", date: "", time: "", type: "Consultation", status: "Pending", notes: "" }); 
  };
  const handleEdit = (apt) => { setEditingAppointment(apt); setFormData({ patient: apt.patient, doctor: apt.doctor, date: apt.date, time: apt.time, type: apt.type, status: apt.status, notes: apt.notes }); setShowModal(true); };
  const handleDelete = (id) => { if (confirm("Are you sure you want to delete this appointment?")) setAppointments(appointments.filter((a) => a.id !== id)); };

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
        <div><h1 className={`text-2xl font-bold ${textPrimary}`}>Appointment Management</h1><p className={`mt-1 ${textSecondary}`}>{appointments.length} scheduled appointments</p></div>
        <button onClick={() => { setEditingAppointment(null); setFormData({ patient: "", doctor: "", date: "", time: "", type: "Consultation", status: "Pending", notes: "" }); setShowModal(true); }} className="flex items-center gap-2 bg-[#2da0a8] text-white px-6 py-2.5 rounded-xl hover:bg-[#258a91] transition-colors font-medium shadow-lg shadow-blue-200"><Icon name="plus" className="w-5 h-5" /> New Appointment</button>
      </div>
      <div className={`${cardClass} rounded-2xl shadow-sm border overflow-hidden`}>
        <div className={`p-6 border-b ${borderColor}`}><SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by patient, doctor or type..." /></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className={headBg}><th className={`text-left p-4 text-sm font-semibold ${textSecondary}`}>Patient</th><th className={`text-left p-4 text-sm font-semibold ${textSecondary}`}>Doctor</th><th className={`text-left p-4 text-sm font-semibold ${textSecondary}`}>Date</th><th className={`text-left p-4 text-sm font-semibold ${textSecondary}`}>Time</th><th className={`text-left p-4 text-sm font-semibold ${textSecondary}`}>Type</th><th className={`text-left p-4 text-sm font-semibold ${textSecondary}`}>Status</th><th className={`text-right p-4 text-sm font-semibold ${textSecondary}`}>Actions</th></tr></thead>
            <tbody>{filteredAppointments.map((apt) => (<tr key={apt.id} className={`border-t ${borderRow} ${hoverRow} transition-colors`}><td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">{apt.patient.charAt(0)}</div><span className={`font-medium ${textPrimary}`}>{apt.patient}</span></div></td><td className={`p-4 text-sm ${textSecondary}`}>{apt.doctor}</td><td className={`p-4 text-sm ${textSecondary}`}>{new Date(apt.date).toLocaleDateString("en-US")}</td><td className={`p-4 text-sm font-medium ${textPrimary}`}>{apt.time}</td><td className="p-4"><Badge variant="purple">{apt.type}</Badge></td><td className="p-4"><Badge variant={apt.status === "Confirmed" ? "success" : apt.status === "Pending" ? "warning" : "danger"}>{apt.status}</Badge></td><td className="p-4"><div className="flex items-center justify-end gap-2"><button onClick={() => handleEdit(apt)} className="p-2 text-[#2da0a8] hover:bg-blue-50 rounded-lg transition-colors"><Icon name="edit" className="w-4 h-4" /></button><button onClick={() => handleDelete(apt.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Icon name="trash" className="w-4 h-4" /></button></div></td></tr>))}</tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingAppointment ? "Edit Appointment" : "New Appointment"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Patient *</label><select required value={formData.patient} onChange={(e) => setFormData({ ...formData, patient: e.target.value })} className={inputClass}><option value="">Select a patient</option>{mockPatients.map((p) => (<option key={p.id} value={p.name}>{p.name}</option>))}</select></div><div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Doctor *</label><select required value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })} className={inputClass}><option value="">Select a doctor</option>{doctors.map((d) => (<option key={d} value={d}>{d}</option>))}</select></div></div>
          <div className="grid grid-cols-3 gap-4"><div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Date *</label><input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={inputClass} /></div><div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Time *</label><input type="time" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className={inputClass} /></div><div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Type *</label><select required value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={inputClass}>{["Consultation", "Exam", "Emergency", "Follow-up", "Vaccination"].map((t) => (<option key={t} value={t}>{t}</option>))}</select></div></div>
          <div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputClass}>{["Pending", "Confirmed", "Cancelled"].map((s) => (<option key={s} value={s}>{s}</option>))}</select></div>
          <div><label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className={`${inputClass} resize-none`} placeholder="Additional notes..." /></div>
          <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowModal(false)} className={`flex-1 px-6 py-2.5 border rounded-xl transition-colors font-medium ${dark ? "border-gray-600 hover:bg-gray-700 text-gray-300" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}>Cancel</button><button type="submit" className="flex-1 px-6 py-2.5 bg-[#2da0a8] text-white rounded-xl hover:bg-[#258a91] transition-colors font-medium shadow-lg shadow-blue-200">{editingAppointment ? "Modify" : "Save"}</button></div>
        </form>
      </Modal>
    </div>
  );
}
