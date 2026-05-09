import { useState } from "react";
import { useTheme, mockPatients, getPatientId } from "./DoctorShared";
import { Icon, Badge, Modal } from "./DoctorUI";

export default function Appointments() {
  const { dark } = useTheme();
  
  // State for Availability
  const [availableDays, setAvailableDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  
  // State for Invitation
  const [invitationForm, setInvitationForm] = useState({
    patientId: "",
    date: "2026-05-10",
    time: "",
    type: "General Consultation",
    notes: ""
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [activeTab, setActiveTab] = useState("manage");

  // Mock Invitation History
  const [invitations, setInvitations] = useState([
    { id: 1, direction: "sent", patient: "Ahmed Benali", date: "2026-05-12", time: "10:00 AM", type: "General Consultation", status: "Pending" },
    { id: 2, direction: "received", patient: "Nadia Filali", date: "2026-05-14", time: "02:30 PM", type: "Follow-up", status: "Accepted" },
    { id: 3, direction: "sent", patient: "Sara Moussaoui", date: "2026-05-15", time: "09:00 AM", type: "Specialist Visit", status: "Declined" },
    { id: 4, direction: "received", patient: "Karim Tazi", date: "2026-05-16", time: "11:00 AM", type: "Routine Checkup", status: "Pending" },
  ]);

  const updateStatus = (id, newStatus) => {
    setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const appointmentTypes = ["General Consultation", "Specialist Visit", "Follow-up", "Emergency", "Routine Checkup"];

  const toggleDay = (day) => {
    setAvailableDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-400" : "text-slate-500";
  const cardClass = `rounded-[2rem] border p-8 ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`;
  const inputClass = `w-full px-5 py-3.5 border rounded-2xl focus:ring-4 focus:ring-[#2da0a8]/10 focus:border-[#2da0a8] outline-none text-sm font-bold transition-all ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"}`;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className={`text-3xl font-black tracking-tight ${textPrimary}`}>Set Availability</h1>
          <p className={`${textSecondary} text-sm font-bold uppercase tracking-widest`}>Manage your consulting hours and patient invitations</p>
        </div>
        
        {/* Underline Tabs */}
        <div className={`flex gap-8 border-b ${dark ? "border-slate-800" : "border-slate-200"}`}>
          <button 
            onClick={() => setActiveTab("manage")}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
              activeTab === "manage" 
                ? "text-[#2da0a8]" 
                : `${dark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`
            }`}
          >
            Manage Setup
            {activeTab === "manage" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2da0a8] rounded-t-full shadow-[0_-2px_8px_rgba(45,160,168,0.5)]"></div>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab("history")}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
              activeTab === "history" 
                ? "text-[#2da0a8]" 
                : `${dark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`
            }`}
          >
            Invitation History
            {activeTab === "history" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2da0a8] rounded-t-full shadow-[0_-2px_8px_rgba(45,160,168,0.5)]"></div>
            )}
          </button>
        </div>
      </div>

      {activeTab === "manage" ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        
        {/* Left Column: Set Weekly Availability */}
        <div className="space-y-8">
          <div className={cardClass}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-teal-500/10 text-teal-600 rounded-2xl flex items-center justify-center">
                <Icon name="appointments" className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-xl font-black ${textPrimary}`}>Set Your Weekly Availability</h3>
                <p className={`${textSecondary} text-xs font-bold`}>Configure your standard working hours</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Days Selection */}
              <div>
                <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-4 ${textSecondary}`}>Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {days.map(day => {
                    const isSelected = availableDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all border ${
                          isSelected 
                            ? "bg-[#2da0a8] border-[#2da0a8] text-white shadow-lg shadow-teal-500/20" 
                            : `${dark ? "bg-slate-800 border-slate-700 text-slate-500" : "bg-slate-50 border-slate-100 text-slate-400"} hover:border-[#2da0a8]/50`
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Start Time</label>
                  <input 
                    type="time" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)}
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>End Time</label>
                  <input 
                    type="time" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)}
                    className={inputClass} 
                  />
                </div>
              </div>

              <div className={`p-4 rounded-2xl ${dark ? "bg-slate-800/30" : "bg-slate-50"} flex gap-3 items-start`}>
                <div className="mt-0.5 text-[#2da0a8]"><Icon name="bell" className="w-4 h-4" /></div>
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-wide">
                  These times will apply to all selected days. You can view your full calendar in the schedule tab.
                </p>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-[#2da0a8] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#20838a] transition-all shadow-lg shadow-teal-500/20 active:scale-95">
                  Save Availability
                </button>
                <button className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${dark ? "border-slate-800 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  View Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Current Availability Summary */}
          <div className={`${cardClass} border-dashed`}>
             <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${textSecondary}`}>Current Availability</h4>
             {availableDays.length > 0 ? (
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${textPrimary}`}>{availableDays.join(", ")}</span>
                    <Badge variant="success">Active</Badge>
                 </div>
                 <p className="text-sm font-black text-[#2da0a8]">{startTime} — {endTime}</p>
               </div>
             ) : (
               <div className="text-center py-6">
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No availability set</p>
                 <p className="text-[10px] text-slate-500 mt-2">Set your weekly availability above to start accepting appointments</p>
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Send Appointment Invitation */}
        <div className={cardClass}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center">
              <Icon name="messages" className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-xl font-black ${textPrimary}`}>Send Appointment Invitation</h3>
              <p className={`${textSecondary} text-xs font-bold`}>Invite patients for specific available slots</p>
            </div>
          </div>

          <form className="space-y-6">
            <div>
              <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Select Patient</label>
              <select 
                className={inputClass}
                value={invitationForm.patientId}
                onChange={(e) => setInvitationForm({...invitationForm, patientId: e.target.value})}
              >
                <option value="">Choose a patient...</option>
                {mockPatients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({getPatientId(p)})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Available Date</label>
                <input 
                  type="date" 
                  className={inputClass} 
                  value={invitationForm.date}
                  onChange={(e) => setInvitationForm({...invitationForm, date: e.target.value})}
                />
              </div>
              <div>
                <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Available Time</label>
                <select className={inputClass} defaultValue="">
                  <option value="" disabled>Set your availability first</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Appointment Type</label>
              <select 
                className={inputClass}
                value={invitationForm.type}
                onChange={(e) => setInvitationForm({...invitationForm, type: e.target.value})}
              >
                {appointmentTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-black uppercase tracking-[0.2em] mb-3 ${textSecondary}`}>Notes (Optional)</label>
              <textarea 
                className={`${inputClass} min-h-[120px] resize-none`} 
                placeholder="Add any specific instructions or notes for the patient"
                value={invitationForm.notes}
                onChange={(e) => setInvitationForm({...invitationForm, notes: e.target.value})}
              />
            </div>

            <div className="pt-4 space-y-3">
              <button type="button" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                <Icon name="send" className="w-4 h-4" />
                <span>Send Invitation</span>
              </button>
              <button type="button" onClick={() => setShowPreview(true)} className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-50 text-slate-500"}`}>
                Preview Invitation
              </button>
            </div>
          </form>
        </div>
      </div>
      ) : (
        <div className={cardClass}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center">
              <Icon name="history" className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-xl font-black ${textPrimary}`}>Invitation History</h3>
              <p className={`${textSecondary} text-xs font-bold`}>View sent invitations and received requests</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
                  <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Direction</th>
                  <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Patient</th>
                  <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Date & Time</th>
                  <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Type</th>
                  <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Status</th>
                  <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {invitations.map(inv => (
                  <tr key={inv.id} className="group">
                    <td className="py-4 pr-4">
                      {inv.direction === "sent" ? (
                        <div className="flex items-center gap-2 text-blue-500 bg-blue-500/10 w-max px-3 py-1.5 rounded-lg">
                          <Icon name="send" className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Sent</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 w-max px-3 py-1.5 rounded-lg">
                          <Icon name="download" className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Received</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <p className={`text-sm font-bold ${textPrimary}`}>{inv.patient}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>
                        {getPatientId(mockPatients.find(p => p.name === inv.patient))}
                      </p>
                    </td>
                    <td className="py-4 pr-4">
                      <p className={`text-sm font-bold ${textPrimary}`}>{inv.date}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>{inv.time}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <Badge variant="purple">{inv.type}</Badge>
                    </td>
                    <td className="py-4 pr-4">
                      <Badge variant={inv.status === 'Accepted' ? 'success' : inv.status === 'Declined' ? 'danger' : 'warning'}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.direction === "received" && (
                          <div className="flex items-center gap-1.5 mr-2">
                            {inv.status !== 'Accepted' && (
                              <button onClick={() => updateStatus(inv.id, 'Accepted')} title="Accept" className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors">
                                <Icon name="check" className="w-4 h-4" />
                              </button>
                            )}
                            {inv.status !== 'Declined' && (
                              <button onClick={() => updateStatus(inv.id, 'Declined')} title="Decline" className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors">
                                <Icon name="close" className="w-4 h-4" />
                              </button>
                            )}
                            {inv.status !== 'Pending' && (
                              <button onClick={() => updateStatus(inv.id, 'Pending')} title="Set Pending" className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-colors">
                                <Icon name="activity" className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                        <button 
                          onClick={() => setSelectedInvitation(inv)}
                          title="View Details"
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${dark ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"}`}
                        >
                          <Icon name="eye" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Invitation Preview" size="md">
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border ${dark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex justify-between items-start mb-6 border-b pb-6 border-slate-200 dark:border-slate-700">
              <div>
                <h4 className={`text-lg font-black ${textPrimary}`}>Appointment Invitation</h4>
                <p className={`${textSecondary} text-xs font-bold mt-1 uppercase tracking-widest`}>From: Dr. {mockPatients.length > 0 ? "Doctor" : "Doctor"}</p>
              </div>
              <div className="w-12 h-12 bg-[#2da0a8] text-white rounded-xl flex items-center justify-center">
                <Icon name="calendar" className="w-6 h-6" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Patient</p>
                <p className={`text-sm font-bold ${textPrimary}`}>
                  {mockPatients.find(p => String(p.id) === String(invitationForm.patientId))?.name || "No patient selected"}
                  {invitationForm.patientId && <span className="ml-2 text-xs font-black uppercase tracking-widest text-slate-400">{getPatientId(mockPatients.find(p => String(p.id) === String(invitationForm.patientId)))}</span>}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Date</p>
                  <p className={`text-sm font-bold ${textPrimary}`}>{invitationForm.date || "Not set"}</p>
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Time</p>
                  <p className={`text-sm font-bold ${textPrimary}`}>{invitationForm.time || "Not set"}</p>
                </div>
              </div>

              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Type</p>
                <Badge variant="purple">{invitationForm.type}</Badge>
              </div>

              {invitationForm.notes && (
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Notes</p>
                  <p className={`text-sm font-medium ${textPrimary} bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800`}>
                    {invitationForm.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowPreview(false)} className={`flex-1 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${dark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}>
              Close
            </button>
            <button className="flex-1 bg-[#2da0a8] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#20838a] transition-all shadow-lg shadow-teal-500/20">
              Send Now
            </button>
          </div>
        </div>
      </Modal>

      {/* View History Modal */}
      <Modal isOpen={!!selectedInvitation} onClose={() => setSelectedInvitation(null)} title="Invitation Details" size="md">
        {selectedInvitation && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border ${dark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex justify-between items-start mb-6 border-b pb-6 border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className={`text-lg font-black ${textPrimary}`}>
                    {selectedInvitation.direction === "sent" ? "Sent Invitation" : "Received Request"}
                  </h4>
                  <p className={`${textSecondary} text-xs font-bold mt-1 uppercase tracking-widest`}>
                    Patient: {getPatientId(mockPatients.find(p => p.name === selectedInvitation.patient))}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${selectedInvitation.direction === "sent" ? "bg-blue-500" : "bg-emerald-500"}`}>
                  <Icon name={selectedInvitation.direction === "sent" ? "send" : "download"} className="w-6 h-6" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Patient</p>
                  <p className={`text-sm font-bold ${textPrimary}`}>
                    {selectedInvitation.patient}
                    <span className="ml-2 text-xs font-black uppercase tracking-widest text-slate-400">
                      {getPatientId(mockPatients.find(p => p.name === selectedInvitation.patient))}
                    </span>
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Date</p>
                    <p className={`text-sm font-bold ${textPrimary}`}>{selectedInvitation.date}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Time</p>
                    <p className={`text-sm font-bold ${textPrimary}`}>{selectedInvitation.time}</p>
                  </div>
                </div>

                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Type & Status</p>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="purple">{selectedInvitation.type}</Badge>
                    <Badge variant={selectedInvitation.status === 'Accepted' ? 'success' : selectedInvitation.status === 'Declined' ? 'danger' : 'warning'}>
                      {selectedInvitation.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setSelectedInvitation(null)} className={`flex-1 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${dark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
