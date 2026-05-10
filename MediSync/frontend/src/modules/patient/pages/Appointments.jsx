import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, appointmentsData } from "../components/PatientShared";
import { Icon, Badge } from "../components/PatientUI";

export default function Appointments() {
  const { dark } = useTheme();
  const [activeTab, setActiveTab] = useState("list");
  const [appointments, setAppointments] = useState(appointmentsData);
  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-500" : "text-slate-400";
  const cardBg = dark ? "bg-[#0a0c10] border-slate-800" : "bg-white border-slate-100 shadow-sm";

  // New Booking Form State
  const [formData, setFormData] = useState({
    date: "",
    doctor: "",
    timeSlot: "",
    type: "",
    reason: "",
    email: "",
    phone: "",
    consent: false
  });

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

  const handleAction = (id, newStatus) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("Please consent to the processing of your personal data.");
      return;
    }
    const newApt = {
      id: Date.now(),
      doctor: formData.doctor || "Selected Doctor",
      specialty: "Medical Review",
      date: formData.date,
      time: formData.timeSlot,
      status: "Pending",
      type: formData.type || "General",
      initiator: "patient",
      notes: formData.reason
    };
    setAppointments([newApt, ...appointments]);
    setActiveTab("list");
    // Reset form
    setFormData({ date: "", doctor: "", timeSlot: "", type: "", reason: "", email: "", phone: "", consent: false });
  };

  const inputStyle = `w-full px-5 py-4 rounded-2xl border ${dark ? "bg-slate-900 border-slate-800 text-white placeholder-slate-600" : "bg-slate-50 border-slate-100 text-slate-800 placeholder-slate-400"} focus:border-[#2da0a8] focus:ring-4 focus:ring-[#2da0a8]/10 outline-none font-bold text-sm transition-all shadow-sm`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-black tracking-tight ${textPrimary}`}>My Appointments</h2>
          <p className={`${textSecondary} font-bold mt-1 uppercase text-xs tracking-widest`}>Manage your visits and requests</p>
        </div>
        
        <div className={`flex p-1.5 rounded-2xl ${dark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"} border shadow-inner`}>
          <button 
            onClick={() => setActiveTab("list")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeTab === "list" ? "bg-white dark:bg-[#0a0c10] text-[#2da0a8] shadow-lg scale-105" : textSecondary}`}
          >
            Appointments List
          </button>
          <button 
            onClick={() => setActiveTab("book")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeTab === "book" ? "bg-white dark:bg-[#0a0c10] text-[#2da0a8] shadow-lg scale-105" : textSecondary}`}
          >
            Book New Visit
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "list" ? (
          <motion.div key="list" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
            {/* List Content (Simplified for brevity as it's already implemented) */}
            <div className="space-y-4">
              <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${textSecondary} px-2 flex items-center gap-2`}>
                <span className="w-2 h-2 bg-[#2da0a8] rounded-full"></span> Incoming Requests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appointments.filter(a => a.initiator === "doctor").map((apt) => (
                  <div key={apt.id} className={`${cardBg} border rounded-[2rem] p-8 group transition-all duration-500 hover:border-[#2da0a8] hover:shadow-xl hover:shadow-[#2da0a8]/5`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                          <Icon name="calendar" className="w-7 h-7" />
                        </div>
                        <div>
                          <p className={`text-lg font-black ${textPrimary}`}>{apt.doctor}</p>
                          <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${textSecondary}`}>{apt.specialty}</p>
                        </div>
                      </div>
                      <Badge variant={apt.status === "Accepted" ? "success" : apt.status === "Rejected" ? "danger" : "warning"}>{apt.status}</Badge>
                    </div>
                    
                    <div className={`p-5 rounded-2xl ${dark ? "bg-slate-900/50" : "bg-slate-50"} mb-6 border ${dark ? "border-slate-800" : "border-slate-100"}`}>
                      <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
                        <span className={textSecondary}>Date & Time</span>
                        <span className={textPrimary}>{apt.date} • {apt.time}</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {apt.status === "Pending" ? (
                        <>
                          <button onClick={() => handleAction(apt.id, "Accepted")} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#2da0a8] to-[#20838a] text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-[#2da0a8]/20 hover:scale-[1.02] transition-all">Accept</button>
                          <button onClick={() => handleAction(apt.id, "Rejected")} className={`flex-1 py-3.5 rounded-xl ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-600"} text-xs font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all`}>Reject</button>
                        </>
                      ) : (
                        <button className={`w-full py-3.5 rounded-xl ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"} text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2`}>
                          <Icon name="eye" className="w-4 h-4" /> View Visit Details
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${textSecondary} px-2 flex items-center gap-2`}>
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> My Reservations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appointments.filter(a => a.initiator === "patient").map((apt) => (
                  <div key={apt.id} className={`${cardBg} border rounded-[2rem] p-8 group transition-all duration-500 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg -rotate-3 group-hover:rotate-0 transition-transform">
                          <Icon name="calendar" className="w-7 h-7" />
                        </div>
                        <div>
                          <p className={`text-lg font-black ${textPrimary}`}>{apt.doctor}</p>
                          <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${textSecondary}`}>{apt.specialty}</p>
                        </div>
                      </div>
                      <Badge variant={apt.status === "Accepted" ? "success" : apt.status === "Rejected" ? "danger" : "warning"}>{apt.status}</Badge>
                    </div>
                    <div className={`p-5 rounded-2xl ${dark ? "bg-slate-900/50" : "bg-slate-50"} mb-6 border ${dark ? "border-slate-800" : "border-slate-100"}`}>
                      <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
                        <span className={textSecondary}>Schedule</span>
                        <span className={textPrimary}>{apt.date} • {apt.time}</span>
                      </div>
                    </div>
                    <button className={`w-full py-3.5 rounded-xl ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"} text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2`}>
                      <Icon name="eye" className="w-4 h-4" /> Check Status
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="book" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="max-w-4xl mx-auto pb-10">
            <div className={`${cardBg} border rounded-[3rem] p-12 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2da0a8]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-[#2da0a8] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#2da0a8]/20">
                    <Icon name="plus" className="w-6 h-6" />
                  </div>
                  <h3 className={`text-3xl font-black tracking-tight ${textPrimary}`}>Book Your Appointment</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left Column */}
                    <div className="space-y-8">
                      <div>
                        <label className={`block text-[11px] font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Selected Date</label>
                        <input 
                          type="date" 
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className={inputStyle}
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Choose Doctor</label>
                        <select 
                          required
                          value={formData.doctor}
                          onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                          className={inputStyle}
                        >
                          <option value="">Select a doctor</option>
                          <option>Dr. Hassan Amrani (Cardiologist)</option>
                          <option>Dr. Leila Berrada (General Practitioner)</option>
                          <option>Dr. Rachid Tazi (Endocrinologist)</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-[11px] font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Selected Time</label>
                        <input 
                          type="time" 
                          required
                          value={formData.timeSlot}
                          onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                          className={inputStyle}
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Appointment Type</label>
                        <select 
                          required
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          className={inputStyle}
                        >
                          <option value="">Select type</option>
                          <option>Consultation</option>
                          <option>Follow-up</option>
                          <option>Emergency</option>
                          <option>Diagnostic Test</option>
                        </select>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                      <div>
                        <label className={`block text-[11px] font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Reason for Visit</label>
                        <textarea 
                          rows={4}
                          required
                          value={formData.reason}
                          onChange={(e) => setFormData({...formData, reason: e.target.value})}
                          placeholder="Please describe your symptoms or reason for the appointment..."
                          className={`${inputStyle} resize-none min-h-[120px]`}
                        ></textarea>
                      </div>

                      <div>
                        <label className={`block text-[11px] font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Email Address</label>
                        <input 
                          type="email" 
                          required
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className={inputStyle}
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Contact Phone</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="Your phone number"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={inputStyle}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className={`p-8 rounded-3xl border ${dark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-100"} mt-10`}>
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative mt-1">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.consent}
                          onChange={() => setFormData({...formData, consent: !formData.consent})}
                        />
                        <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                          formData.consent 
                            ? "bg-[#2da0a8] border-[#2da0a8] shadow-lg shadow-[#2da0a8]/20" 
                            : `${dark ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-white"}`
                        }`}>
                          <Icon name="check" className={`w-4 h-4 text-white transition-opacity ${formData.consent ? "opacity-100" : "opacity-0"}`} />
                        </div>
                      </div>
                      <span className={`text-[13px] font-bold leading-relaxed transition-colors ${formData.consent ? textPrimary : textSecondary} group-hover:text-[#2da0a8]`}>
                        I consent to the processing of my personal data in accordance with the Privacy Notice and agree to receive automated email reminders for this appointment.
                      </span>
                    </label>
                  </div>

                  <div className="pt-6 flex gap-6">
                    <button 
                      type="button" 
                      onClick={() => setActiveTab("list")} 
                      className={`flex-1 py-5 rounded-2xl border ${dark ? "border-slate-800 text-slate-500 hover:bg-slate-800/50" : "border-slate-200 text-slate-400 hover:bg-slate-100"} font-black text-xs uppercase tracking-[0.2em] transition-all`}
                    >
                      Cancel Request
                    </button>
                    <button 
                      type="submit" 
                      className="flex-[2] py-5 rounded-2xl bg-gradient-to-r from-[#2da0a8] to-[#20838a] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#2da0a8]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Book Appointment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
