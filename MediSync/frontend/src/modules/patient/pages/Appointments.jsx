import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/PatientShared";
import { Icon, Badge, Modal } from "../components/PatientUI";
import apiService from "../../../core/services/api";

export default function Appointments({ onAddToHistory, appointments = [], setAppointments }) {
  const { dark } = useTheme();
  const [activeTab, setActiveTab] = useState("list");
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Try to fetch doctors if the endpoint exists, else fallback to empty
        const data = await apiService._authorizedRequest('/doctors/').catch(() => []);
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const [selectedApt, setSelectedApt] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const [formError, setFormError] = useState("");
  
  // Booking Form State
  const [formData, setFormData] = useState({
    date: "", doctor: "", timeSlot: "", type: "Consultation", reason: "", email: apiService.getUserEmail() || "", phone: "", consent: false
  });

  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-400" : "text-slate-500";
  const cardClass = `rounded-[2rem] border p-8 ${dark ? "bg-[#0a0c10] border-[#1e293b]" : "bg-white border-slate-100 shadow-sm"}`;
  const inputClass = `w-full px-5 py-3.5 border rounded-2xl focus:ring-4 focus:ring-[#2da0a8]/10 focus:border-[#2da0a8] outline-none text-sm font-bold transition-all ${dark ? "bg-slate-900 border-[#1e293b] text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"}`;


  const handleAction = async (id, newStatus) => {
    try {
      // In a real app, we would call an API here
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const apt = appointments.find(a => a.id === deleteConfirm.id);
    if (apt) {
      try {
        await apiService.deleteAppointment(apt.id);
        onAddToHistory(
          "Appointment Deleted", 
          `Appointment with ${apt.doctor} on ${apt.date} was removed and archived.`, 
          "appointment"
        );
        setAppointments(appointments.filter(a => a.id !== deleteConfirm.id));
      } catch (err) {
        console.error("Failed to delete appointment:", err);
      }
    }
    setDeleteConfirm({ isOpen: false, id: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.doctor) {
      setFormError("Please choose a doctor.");
      return;
    }
    if (!formData.date) {
      setFormError("Please select a date.");
      return;
    }
    if (!formData.timeSlot) {
      setFormError("Please select a time.");
      return;
    }
    if (!formData.email) {
      setFormError("Please enter your email.");
      return;
    }
    if (!formData.phone) {
      setFormError("Please enter your phone number.");
      return;
    }
    if (!formData.reason) {
      setFormError("Please state the reason for your visit.");
      return;
    }
    if (!formData.consent) {
      setFormError("You must accept the terms to book.");
      return;
    }

    try {
      const newAptData = {
        doctor: formData.doctor,
        date: formData.date,
        time: formData.timeSlot,
        type: formData.type,
        notes: formData.reason,
        email: formData.email,
        phone: formData.phone,
      };

      const response = await apiService._authorizedRequest('/appointments/', 'POST', newAptData).catch(() => ({ ...newAptData, id: Date.now(), status: "Pending" }));
      
      setAppointments([response, ...appointments]);
      onAddToHistory("Appointment Booked", `New appointment request sent to ${formData.doctor}.`, "appointment");
      setActiveTab("list");
      setFormData({ date: "", doctor: "", timeSlot: "", type: "Consultation", reason: "", email: apiService.getUserEmail() || "", phone: "", consent: false });
    } catch (err) {
      setFormError("Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header & Navigation */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className={`text-3xl font-black tracking-tight ${textPrimary}`}>Appointments</h1>
          <p className={`${textSecondary} text-sm font-bold uppercase tracking-widest`}>Manage your reservations and healthcare requests</p>
        </div>
        
        {/* Underline Tabs - Doctor Style */}
        <div className={`flex gap-8 border-b ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
          <button 
            onClick={() => setActiveTab("list")}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
              activeTab === "list" 
                ? "text-[#2da0a8]" 
                : `${dark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`
            }`}
          >
            My Reservations
            {activeTab === "list" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2da0a8] rounded-t-full shadow-[0_-2px_8px_rgba(45,160,168,0.5)]"></div>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab("book")}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
              activeTab === "book" 
                ? "text-[#2da0a8]" 
                : `${dark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`
            }`}
          >
            Book Appointment
            {activeTab === "book" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2da0a8] rounded-t-full shadow-[0_-2px_8px_rgba(45,160,168,0.5)]"></div>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "list" ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className={cardClass}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-teal-500/10 text-teal-600 rounded-2xl flex items-center justify-center">
                  <Icon name="calendar" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-xl font-black ${textPrimary}`}>All Appointments</h3>
                  <p className={`${textSecondary} text-xs font-bold`}>View and manage your consultation history</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
                      <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Doctor</th>
                      <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Specialty</th>
                      <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Date & Time</th>
                      <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Status</th>
                      <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {appointments.length > 0 ? appointments.map(apt => (
                      <tr key={apt.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300">
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#2da0a8] to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md">
                              {apt.doctor?.charAt(0) || "D"}
                            </div>
                            <span className={`text-sm font-bold ${textPrimary}`}>{apt.doctor}</span>
                          </div>
                        </td>
                        <td className="py-5 text-sm font-medium text-slate-500 dark:text-slate-400">{apt.specialty || apt.type}</td>
                        <td className="py-5">
                          <p className={`text-sm font-bold ${textPrimary}`}>{new Date(apt.date).toLocaleDateString()}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest text-[#2da0a8]`}>{apt.time}</p>
                        </td>
                        <td className="py-5">
                          <Badge variant={apt.status === 'Accepted' || apt.status === 'Confirmed' ? 'success' : apt.status === 'Rejected' || apt.status === 'Cancelled' ? 'danger' : 'warning'}>
                            {apt.status}
                          </Badge>
                        </td>
                        <td className="py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                            {apt.initiator === "doctor" ? (
                              <>
                                <button onClick={() => handleAction(apt.id, "Accepted")} className={`w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all`}><Icon name="check" className="w-4 h-4" /></button>
                                <button onClick={() => handleAction(apt.id, "Rejected")} className={`w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all`}><Icon name="close" className="w-4 h-4" /></button>
                                {apt.status !== "Pending" && <button onClick={() => handleAction(apt.id, "Pending")} className={`w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all`}><Icon name="history" className="w-4 h-4" /></button>}
                              </>
                            ) : (
                              <>
                                {apt.status !== "Cancelled" ? (
                                  <button onClick={() => handleAction(apt.id, "Cancelled")} className={`w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all`}><Icon name="close" className="w-4 h-4" /></button>
                                ) : (
                                  <button onClick={() => handleAction(apt.id, "Pending")} className={`w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all`}><Icon name="history" className="w-4 h-4" /></button>
                                )}
                              </>
                            )}
                            <button onClick={() => setSelectedApt(apt)} className={`w-8 h-8 rounded-lg ${dark ? "bg-[#1e293b] text-slate-400 hover:bg-blue-500 hover:text-white" : "bg-slate-100 text-slate-500 hover:bg-blue-500 hover:text-white"} flex items-center justify-center transition-all`}><Icon name="eye" className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteConfirm({ isOpen: true, id: apt.id })} className={`w-8 h-8 rounded-lg ${dark ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white" : "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white"} flex items-center justify-center transition-all`}><Icon name="trash" className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="py-10 text-center">
                          <Icon name="calendar" className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>No appointments found</p>
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="book" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-center">
            <div className={`${cardClass} max-w-2xl w-full`}>
              <div className="text-center mb-8">
                <h3 className={`text-xl font-black ${textPrimary}`}>Book Your Appointment</h3>
                <p className={`${textSecondary} text-xs font-bold mt-2`}>Request a new consultation slot</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {formError && (
                  <div className="rounded-2xl p-4 bg-rose-50 text-rose-700 border border-rose-100 text-sm font-bold">
                    {formError}
                  </div>
                )}
                <div>
                  <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Choose Doctor</label>
                  <select required value={formData.doctor} onChange={(e) => setFormData({...formData, doctor: e.target.value})} className={inputClass}>
                    <option value="">Select a doctor...</option>
                    {doctors.length > 0 ? doctors.map(doc => (
                      <option key={doc.id} value={doc.name || doc.full_name}>{doc.name || doc.full_name} ({doc.specialty})</option>
                    )) : (
                      <>
                        <option value="General Practitioner">General Practitioner</option>
                        <option value="Specialist">Specialist</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Select Date</label>
                    <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Available Time</label>
                    <input type="time" required value={formData.timeSlot} onChange={(e) => setFormData({...formData, timeSlot: e.target.value})} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Appointment Type</label>
                    <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className={inputClass}>
                      <option>Consultation</option>
                      <option>Follow-up</option>
                      <option>Routine Checkup</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Contact Phone</label>
                    <input type="tel" required placeholder="Your phone number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Email Address</label>
                  <input type="email" required placeholder="Enter your email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputClass} />
                </div>

                <div>
                  <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Reason for Visit</label>
                  <textarea rows={4} required value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} placeholder="Please describe your symptoms or reason for the appointment..." className={`${inputClass} resize-none`} />
                </div>

                <div className={`p-6 rounded-2xl ${dark ? "bg-slate-800/30 border-slate-700" : "bg-slate-50 border-slate-200"} border`}>
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input type="checkbox" className="sr-only peer" checked={formData.consent} onChange={(e) => setFormData({...formData, consent: e.target.checked})} />
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.consent ? "bg-[#2da0a8] border-[#2da0a8]" : "border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-700"}`}><Icon name="check" className={`w-4 h-4 text-white ${formData.consent ? "opacity-100" : "opacity-0"}`} /></div>
                    <span className={`text-[11px] font-bold leading-relaxed ${formData.consent ? textPrimary : textSecondary}`}>
                      I consent to the processing of my personal data in accordance with the Privacy Notice and agree to receive automated email reminders for this appointment.
                    </span>
                  </label>
                </div>

                <button type="submit" className="w-full bg-[#2da0a8] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#20838a] transition-all shadow-lg shadow-teal-500/20 active:scale-95">
                  Book Appointment
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment Detail Modal */}
      <Modal isOpen={!!selectedApt} onClose={() => setSelectedApt(null)} title="Appointment Details" size="md">
        {selectedApt && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-gradient-to-br from-[#2da0a8] to-blue-600 text-white shadow-xl">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20"><Icon name="calendar" className="w-8 h-8" /></div>
              <div><h4 className="text-xl font-black">{selectedApt.doctor}</h4><p className="text-sm font-bold opacity-90">{selectedApt.specialty}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700"><p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Date</p><p className="text-sm font-bold">{new Date(selectedApt.date).toLocaleDateString()}</p></div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700"><p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Time</p><p className="text-sm font-bold">{selectedApt.time}</p></div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-[#1e293b] shadow-inner"><p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Reason / Notes</p><p className="text-sm leading-relaxed italic">{selectedApt.notes || "No additional notes provided."}</p></div>
            <button onClick={() => setSelectedApt(null)} className="w-full py-4 rounded-2xl bg-[#2da0a8] text-white font-black text-xs uppercase tracking-widest shadow-lg">Close Details</button>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ isOpen: false, id: null })} title="Archive Appointment" size="sm">
        <div className="text-center py-4 space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4"><Icon name="trash" className="w-10 h-10" /></div>
          <div className="space-y-2">
            <h3 className={`text-lg font-black ${textPrimary}`}>Archive Appointment?</h3>
            <p className={`text-sm font-medium ${textSecondary} px-4 leading-relaxed`}>This appointment will be moved to your Health History history.</p>
          </div>
          <div className="flex gap-3 pt-4 px-2">
            <button onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className="flex-1 py-3.5 rounded-2xl font-black text-xs uppercase transition-all bg-slate-100 dark:bg-slate-800">Cancel</button>
            <button onClick={handleDelete} className="flex-1 bg-rose-600 text-white py-3.5 rounded-2xl font-black text-xs uppercase shadow-lg shadow-rose-500/20 hover:bg-rose-700">Move to History</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
