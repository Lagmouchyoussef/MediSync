import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./DoctorShared";
import { Icon, SearchInput, Badge, Modal } from "./DoctorUI";

export default function History({ deletedPatients = [], setDeletedPatients, setPatients, history: externalHistory, setHistory: setExternalHistory }) {
  const { dark } = useTheme();
  
  const [localHistory, setLocalHistory] = useState([]);

  const history = externalHistory !== undefined ? externalHistory : localHistory;
  const setHistory = setExternalHistory || setLocalHistory;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteHistory = (id) => {
    setHistory(prev => prev.filter(h => h.id !== id));
    setActiveDropdown(null);
  };

  const handleRestoreHistory = (id) => {
    // Placeholder for restore action
    setActiveDropdown(null);
  };

  const categories = [
    { id: "all", label: "All", icon: "activity" }, { id: "medical", label: "Medical", icon: "heart" },
    { id: "appointment", label: "Appointment", icon: "calendar" }, { id: "admin", label: "Administration", icon: "settings" }, 
    { id: "security", label: "Security", icon: "eye" }, { id: "notification", label: "Notifications", icon: "bell" },
    { id: "recycle", label: "Recycle Bin", icon: "trash" }
  ];
  
  const filteredHistory = useMemo(() => history.filter((item) => {  
    const matchSearch = item.patient.toLowerCase().includes(searchTerm.toLowerCase()) || item.user.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase()) || item.type.toLowerCase().includes(searchTerm.toLowerCase()); 
    return filterCategory === "all" || item.category === filterCategory ? matchSearch : false; 
  }), [history, searchTerm, filterCategory]);

  const getCategoryColor = (cat) => { const c = { medical: dark ? "bg-red-900 text-red-300 border-red-800" : "bg-red-100 text-red-700 border-red-200", appointment: dark ? "bg-blue-900 text-blue-300 border-blue-800" : "bg-blue-100 text-blue-700 border-blue-200", admin: dark ? "bg-gray-700 text-gray-300 border-gray-600" : "bg-gray-100 text-gray-700 border-gray-200", security: dark ? "bg-yellow-900 text-yellow-300 border-yellow-800" : "bg-yellow-100 text-yellow-700 border-yellow-200", notification: dark ? "bg-purple-900 text-purple-300 border-purple-800" : "bg-purple-100 text-purple-700 border-purple-200", recycle: dark ? "bg-rose-900 text-rose-300 border-rose-800" : "bg-rose-100 text-rose-700 border-rose-200" }; return c[cat] || c.admin; };
  const getCategoryIcon = (cat) => ({ medical: "heart", appointment: "calendar", admin: "settings", security: "eye", notification: "bell", recycle: "trash" }[cat] || "activity");
  const textPrimary = dark ? "text-white" : "text-gray-800";
  const textSecondary = dark ? "text-gray-400" : "text-gray-500";
  const cardClass = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const borderColor = dark ? "border-gray-700" : "border-gray-100";
  const itemCard = dark ? "bg-gray-800 border-gray-700 hover:border-[#2da0a8]" : "bg-white border-gray-100 hover:shadow-md group-hover:border-blue-100";
  const timelineColor = dark ? "bg-gray-700" : "bg-gray-200";

  const handleRestore = (patientId) => {
    const patientToRestore = deletedPatients.find(p => p.id === patientId);
    if (patientToRestore && setPatients && setDeletedPatients) {
      // Remove deletedAt
      const { deletedAt, ...restoredPatient } = patientToRestore;
      setPatients(prev => [...prev, restoredPatient]);
      setDeletedPatients(prev => prev.filter(p => p.id !== patientId));
    }
  };

  const filteredDeleted = useMemo(() => deletedPatients.filter((item) => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  ), [deletedPatients, searchTerm]);

  return (
    <div className="space-y-6">
      <div><h1 className={`text-2xl font-bold ${textPrimary}`}>Activity History</h1><p className={`mt-1 ${textSecondary}`}>View all system actions and events</p></div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[{ label: "Consultations", count: history.filter((h) => h.category === "medical").length, icon: "heart", bg: dark ? "bg-red-900" : "bg-red-100", color: dark ? "text-red-300" : "text-red-600" }, { label: "Appointments", count: history.filter((h) => h.category === "appointment").length, icon: "calendar", bg: dark ? "bg-blue-900" : "bg-blue-100", color: dark ? "text-blue-300" : "text-blue-600" }, { label: "Administration", count: history.filter((h) => h.category === "admin").length, icon: "settings", bg: dark ? "bg-gray-700" : "bg-gray-100", color: dark ? "text-gray-300" : "text-gray-600" }, { label: "Security", count: history.filter((h) => h.category === "security").length, icon: "eye", bg: dark ? "bg-yellow-900" : "bg-yellow-100", color: dark ? "text-yellow-300" : "text-yellow-600" }, { label: "Notifications", count: history.filter((h) => h.category === "notification").length, icon: "bell", bg: dark ? "bg-purple-900" : "bg-purple-100", color: dark ? "text-purple-300" : "text-purple-600" }].map((s, idx) => (<div key={idx} className={`${cardClass} rounded-2xl p-4 shadow-sm border`}><div className="flex items-center gap-3"><div className={`p-3 ${s.bg} rounded-xl`}><Icon name={s.icon} className={`w-5 h-5 ${s.color}`} /></div><div><p className={`text-xl font-bold ${textPrimary}`}>{s.count}</p><p className={`text-xs ${textSecondary} font-medium uppercase tracking-widest`}>{s.label}</p></div></div></div>))}
      </div>
      <div className={`${cardClass} rounded-2xl shadow-sm border overflow-hidden`}>
        <div className={`p-6 border-b ${borderColor}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1"><SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search in history..." /></div>
            <div className="flex items-center gap-2 flex-wrap">{categories.map((cat) => (<button key={cat.id} onClick={() => setFilterCategory(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterCategory === cat.id ? "bg-[#2da0a8] text-white shadow-md" : dark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}><Icon name={cat.icon} className="w-4 h-4" />{cat.label}</button>))}</div>
          </div>
        </div>
        <div className="p-6">
          {filterCategory === "recycle" ? (
            <div className="space-y-4">
              {filteredDeleted.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="trash" className={`w-12 h-12 mx-auto mb-3 ${dark ? "text-gray-600" : "text-gray-300"}`} />
                  <p className={textSecondary}>Recycle bin is empty</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
                        <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Patient</th>
                        <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Deleted At</th>
                        <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Status</th>
                        <th className={`pb-4 text-[10px] font-black uppercase tracking-widest ${textSecondary} text-right`}>Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredDeleted.map((patient) => (
                        <motion.tr key={patient.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
                          <td className="py-4 pr-4">
                            <p className={`text-sm font-bold ${textPrimary}`}>{patient.name}</p>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>{patient.email}</p>
                          </td>
                          <td className="py-4 pr-4 text-sm font-medium text-slate-500">
                            {new Date(patient.deletedAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 pr-4">
                            <Badge variant="danger">Deleted</Badge>
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => handleRestore(patient.id)}
                              className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all ${dark ? "border-slate-700 hover:bg-emerald-900/30 text-emerald-400" : "border-slate-200 hover:bg-emerald-50 text-emerald-600"}`}
                            >
                              Restore
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.length === 0 ? (<div className="text-center py-12"><Icon name="history" className={`w-12 h-12 mx-auto mb-3 ${dark ? "text-gray-600" : "text-gray-300"}`} /><p className={textSecondary}>No elements found</p></div>) : filteredHistory.map((item, index) => (<motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex gap-4 group"><div className="flex flex-col items-center"><div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getCategoryColor(item.category)} flex-shrink-0`}><Icon name={getCategoryIcon(item.category)} className="w-5 h-5" /></div>{index < filteredHistory.length - 1 && <div className={`w-0.5 h-full ${timelineColor} min-h-[60px]`} />}</div><div className="flex-1 pb-6"><div className={`${itemCard} rounded-xl p-4 border shadow-sm transition-all relative`}><div className="flex items-start justify-between mb-2"><div className="flex items-center gap-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(item.category)}`}>{item.type}</span><span className={`text-sm font-medium ${textPrimary}`}>{item.patient}</span></div><div className="flex items-start gap-3 text-right"><div><p className={`text-xs ${textSecondary}`}>{new Date(item.date).toLocaleDateString("en-US")}</p><p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{item.time}</p></div><div className="relative"><button onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)} className={`p-1 -mr-2 rounded-lg transition-colors ${dark ? "text-slate-500 hover:text-slate-300 hover:bg-slate-700" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}><Icon name="moreVertical" className="w-5 h-5" /></button>
              
              <AnimatePresence>
                {activeDropdown === item.id && (
                  <motion.div 
                    ref={dropdownRef}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.95, y: 10 }} 
                    transition={{ duration: 0.1 }}
                    className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border z-50 overflow-hidden ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                  >
                    <div className="py-1">
                      <button onClick={() => { setSelectedItem(item); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition-colors ${dark ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"}`}>
                        <Icon name="eye" className="w-4 h-4" /> View Details
                      </button>
                      <button onClick={() => handleRestoreHistory(item.id)} className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition-colors ${dark ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"}`}>
                        <Icon name="activity" className="w-4 h-4" /> Restore Action
                      </button>
                      <div className={`h-px my-1 ${dark ? "bg-slate-700" : "bg-slate-100"}`}></div>
                      <button onClick={() => handleDeleteHistory(item.id)} className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition-colors ${dark ? "text-rose-400 hover:bg-rose-900/30" : "text-rose-600 hover:bg-rose-50"}`}>
                        <Icon name="trash" className="w-4 h-4" /> Delete Event
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div></div></div><p className={`text-sm mb-2 pr-8 ${dark ? "text-gray-300" : "text-gray-600"}`}>{item.description}</p><div className={`flex items-center gap-2 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}><Icon name="users" className="w-3 h-3" /><span>By {item.user}</span></div></div></div></motion.div>))}
            </div>
          )}
          {filterCategory !== "recycle" && filteredHistory.length > 0 && <div className="mt-6 text-center"><p className={`text-sm ${textSecondary}`}>{filteredHistory.length} event{filteredHistory.length > 1 ? "s" : ""} displayed</p></div>}
        </div>
      </div>

      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Event Details" size="md">
        {selectedItem && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border ${dark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-start justify-between mb-6 border-b pb-6 border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className={`text-lg font-black ${textPrimary}`}>{selectedItem.type}</h4>
                  <p className={`${textSecondary} text-xs font-bold mt-1 uppercase tracking-widest`}>Event ID: #{selectedItem.id.toString().padStart(4, '0')}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getCategoryColor(selectedItem.category)}`}>
                  <Icon name={getCategoryIcon(selectedItem.category)} className="w-6 h-6" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Date</p>
                    <p className={`text-sm font-bold ${textPrimary}`}>{new Date(selectedItem.date).toLocaleDateString("en-US")}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Time</p>
                    <p className={`text-sm font-bold ${textPrimary}`}>{selectedItem.time}</p>
                  </div>
                </div>

                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Related Patient / Target</p>
                  <p className={`text-sm font-bold ${textPrimary}`}>{selectedItem.patient}</p>
                </div>

                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Action By</p>
                  <p className={`text-sm font-bold ${textPrimary}`}>{selectedItem.user}</p>
                </div>

                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Details</p>
                  <div className={`text-sm font-medium ${textPrimary} bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed`}>
                    {selectedItem.description}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedItem(null)} className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${dark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}>
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
