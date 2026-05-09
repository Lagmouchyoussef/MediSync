import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./DoctorShared";
import { Icon, SearchInput } from "./DoctorUI";

export default function History() {
  const { dark } = useTheme();
  const [history] = useState([
    { id: 1, type: "Consultation", patient: "Ahmed Benali", user: "Dr. Hassan Amrani", date: "2026-05-10", time: "09:15", description: "Monthly follow-up consultation - Hypertension", category: "medical" },
    { id: 2, type: "Patient added", patient: "Nadia Filali", user: "Administrator", date: "2026-05-10", time: "08:45", description: "New patient registered in the system", category: "admin" },
    { id: 3, type: "Appointment", patient: "Fatima Zahra", user: "Dr. Leila Berrada", date: "2026-05-09", time: "16:30", description: "Appointment confirmed for exam - Full blood test", category: "appointment" },
    { id: 4, type: "Modification", patient: "Sara Moussaoui", user: "Dr. Hassan Amrani", date: "2026-05-09", time: "14:20", description: "Medical record update - New diagnosis diabetes type 2", category: "medical" },
    { id: 5, type: "Cancellation", patient: "Karim Bennani", user: "Dr. Rachid Tazi", date: "2026-05-09", time: "11:00", description: "Appointment cancelled by patient - Reschedule requested", category: "appointment" },
    { id: 6, type: "Consultation", patient: "Omar Idrissi", user: "Dr. Rachid Tazi", date: "2026-05-08", time: "15:45", description: "Diabetes control - HbA1c results: 7.2%", category: "medical" },
    { id: 7, type: "Export", patient: "All", user: "Administrator", date: "2026-05-08", time: "09:00", description: "Export of April data in PDF", category: "admin" },
    { id: 8, type: "Consultation", patient: "Khadija Tazi", user: "Dr. Leila Berrada", date: "2026-05-07", time: "10:30", description: "First visit - Complete health checkup", category: "medical" },
    { id: 9, type: "Appointment", patient: "Ahmed Benali", user: "Administrator", date: "2026-05-07", time: "08:15", description: "New appointment scheduled for 15/05", category: "appointment" },
    { id: 10, type: "Modification", patient: "Youssef El Amrani", user: "Administrator", date: "2026-05-06", time: "17:00", description: "Patient status change: Active → Inactive", category: "admin" },
    { id: 11, type: "Consultation", patient: "Fatima Zahra", user: "Dr. Leila Berrada", date: "2026-05-06", time: "11:00", description: "Anemia treatment follow-up - Improvement noted", category: "medical" },
    { id: 12, type: "Login", patient: "-", user: "Dr. Hassan Amrani", date: "2026-05-06", time: "07:45", description: "Logged into system from IP address 192.168.1.100", category: "security" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const categories = [
    { id: "all", label: "All", icon: "activity" }, { id: "medical", label: "Medical", icon: "heart" },
    { id: "appointment", label: "Appointment", icon: "calendar" }, { id: "admin", label: "Administration", icon: "settings" }, { id: "security", label: "Security", icon: "eye" },
  ];
  
  const filteredHistory = useMemo(() => history.filter((item) => { 
    const matchSearch = item.patient.toLowerCase().includes(searchTerm.toLowerCase()) || item.user.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase()) || item.type.toLowerCase().includes(searchTerm.toLowerCase()); 
    return filterCategory === "all" || item.category === filterCategory ? matchSearch : false; 
  }), [history, searchTerm, filterCategory]);

  const getCategoryColor = (cat) => { const c = { medical: dark ? "bg-red-900 text-red-300 border-red-800" : "bg-red-100 text-red-700 border-red-200", appointment: dark ? "bg-blue-900 text-blue-300 border-blue-800" : "bg-blue-100 text-blue-700 border-blue-200", admin: dark ? "bg-gray-700 text-gray-300 border-gray-600" : "bg-gray-100 text-gray-700 border-gray-200", security: dark ? "bg-yellow-900 text-yellow-300 border-yellow-800" : "bg-yellow-100 text-yellow-700 border-yellow-200" }; return c[cat] || c.admin; };
  const getCategoryIcon = (cat) => ({ medical: "heart", appointment: "calendar", admin: "settings", security: "eye" }[cat] || "activity");
  const textPrimary = dark ? "text-white" : "text-gray-800";
  const textSecondary = dark ? "text-gray-400" : "text-gray-500";
  const cardClass = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const borderColor = dark ? "border-gray-700" : "border-gray-100";
  const itemCard = dark ? "bg-gray-800 border-gray-700 hover:border-[#2da0a8]" : "bg-white border-gray-100 hover:shadow-md group-hover:border-blue-100";
  const timelineColor = dark ? "bg-gray-700" : "bg-gray-200";

  return (
    <div className="space-y-6">
      <div><h1 className={`text-2xl font-bold ${textPrimary}`}>Activity History</h1><p className={`mt-1 ${textSecondary}`}>View all system actions and events</p></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ label: "Consultations", count: history.filter((h) => h.category === "medical").length, icon: "heart", bg: dark ? "bg-red-900" : "bg-red-100", color: dark ? "text-red-300" : "text-red-600" }, { label: "Appointments", count: history.filter((h) => h.category === "appointment").length, icon: "calendar", bg: dark ? "bg-blue-900" : "bg-blue-100", color: dark ? "text-blue-300" : "text-blue-600" }, { label: "Administration", count: history.filter((h) => h.category === "admin").length, icon: "settings", bg: dark ? "bg-gray-700" : "bg-gray-100", color: dark ? "text-gray-300" : "text-gray-600" }, { label: "Security", count: history.filter((h) => h.category === "security").length, icon: "eye", bg: dark ? "bg-yellow-900" : "bg-yellow-100", color: dark ? "text-yellow-300" : "text-yellow-600" }].map((s, idx) => (<div key={idx} className={`${cardClass} rounded-2xl p-5 shadow-sm border`}><div className="flex items-center gap-3"><div className={`p-3 ${s.bg} rounded-xl`}><Icon name={s.icon} className={`w-6 h-6 ${s.color}`} /></div><div><p className={`text-2xl font-bold ${textPrimary}`}>{s.count}</p><p className={`text-sm ${textSecondary}`}>{s.label}</p></div></div></div>))}
      </div>
      <div className={`${cardClass} rounded-2xl shadow-sm border overflow-hidden`}>
        <div className={`p-6 border-b ${borderColor}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1"><SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search in history..." /></div>
            <div className="flex items-center gap-2 flex-wrap">{categories.map((cat) => (<button key={cat.id} onClick={() => setFilterCategory(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterCategory === cat.id ? "bg-[#2da0a8] text-white shadow-md" : dark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}><Icon name={cat.icon} className="w-4 h-4" />{cat.label}</button>))}</div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (<div className="text-center py-12"><Icon name="history" className={`w-12 h-12 mx-auto mb-3 ${dark ? "text-gray-600" : "text-gray-300"}`} /><p className={textSecondary}>No elements found</p></div>) : filteredHistory.map((item, index) => (<motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex gap-4 group"><div className="flex flex-col items-center"><div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getCategoryColor(item.category)} flex-shrink-0`}><Icon name={getCategoryIcon(item.category)} className="w-5 h-5" /></div>{index < filteredHistory.length - 1 && <div className={`w-0.5 h-full ${timelineColor} min-h-[60px]`} />}</div><div className="flex-1 pb-6"><div className={`${itemCard} rounded-xl p-4 border shadow-sm transition-all`}><div className="flex items-start justify-between mb-2"><div className="flex items-center gap-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(item.category)}`}>{item.type}</span><span className={`text-sm font-medium ${textPrimary}`}>{item.patient}</span></div><div className="text-right"><p className={`text-xs ${textSecondary}`}>{new Date(item.date).toLocaleDateString("en-US")}</p><p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{item.time}</p></div></div><p className={`text-sm mb-2 ${dark ? "text-gray-300" : "text-gray-600"}`}>{item.description}</p><div className={`flex items-center gap-2 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}><Icon name="users" className="w-3 h-3" /><span>By {item.user}</span></div></div></div></motion.div>))}
          </div>
          {filteredHistory.length > 0 && <div className="mt-6 text-center"><p className={`text-sm ${textSecondary}`}>{filteredHistory.length} event{filteredHistory.length > 1 ? "s" : ""} displayed</p></div>}
        </div>
      </div>
    </div>
  );
}
