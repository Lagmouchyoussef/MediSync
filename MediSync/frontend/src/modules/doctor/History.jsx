import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./DoctorShared";
import apiService from "../../core/services/api";
import { Icon, SearchInput, Badge, Modal } from "./DoctorUI";

export default function History({ setPatients, history: externalHistory, setHistory: setExternalHistory }) {
  const { dark } = useTheme();
  
  const [localHistory, setLocalHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Sync with external history if provided
  const history = externalHistory || localHistory;
  const setHistory = setExternalHistory || setLocalHistory;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mappedHistory = useMemo(() => {
    if (!Array.isArray(history)) return [];
    return history.map(h => ({
      id: h.id,
      type: h.action,
      patient: h.details?.split(' ')[0] || "System",
      description: h.details || h.action,
      date: h.timestamp ? h.timestamp.split('T')[0] : new Date().toISOString().split('T')[0],
      time: h.timestamp ? h.timestamp.split('T')[1]?.split('.')[0] || "00:00" : "00:00",
      status: "completed",
      category: h.type || "admin",
      user: "Dr. " + (apiService.getUserLastName() || "Admin")
    }));
  }, [history]);

  const categories = [
    { id: "all", label: "All", icon: "activity" }, { id: "medical", label: "Medical", icon: "heart" },
    { id: "appointment", label: "Appointment", icon: "calendar" }, { id: "admin", label: "Administration", icon: "settings" }, 
    { id: "security", label: "Security", icon: "eye" }, { id: "notification", label: "Notifications", icon: "bell" }
  ];
  
  const getCategoryColor = (cat) => { const c = { medical: dark ? "bg-red-900 text-red-300 border-red-800" : "bg-red-100 text-red-700 border-red-200", appointment: dark ? "bg-blue-900 text-blue-300 border-blue-800" : "bg-blue-100 text-blue-700 border-blue-200", admin: dark ? "bg-gray-700 text-gray-300 border-gray-600" : "bg-gray-100 text-gray-700 border-gray-200", security: dark ? "bg-yellow-900 text-yellow-300 border-yellow-800" : "bg-yellow-100 text-yellow-700 border-yellow-200", notification: dark ? "bg-purple-900 text-purple-300 border-purple-800" : "bg-purple-100 text-purple-700 border-purple-200" }; return c[cat] || c.admin; };
  const getCategoryIcon = (cat) => ({ medical: "heart", appointment: "calendar", admin: "settings", security: "shield", notification: "bell" }[cat] || "activity");

  const filteredHistory = useMemo(() => mappedHistory.filter((item) => {  
    const matchSearch = item.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       item.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       item.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       item.type.toLowerCase().includes(searchTerm.toLowerCase()); 
    return filterCategory === "all" || item.category === filterCategory ? matchSearch : false; 
  }), [mappedHistory, searchTerm, filterCategory]);

  const handleDeleteHistory = async (id) => {
    if (!confirm("Permanently delete this event from history?")) return;
    try {
      // In a real app: await apiService.deleteActivity(id);
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      alert("Error deleting history event");
    }
  };

  const handleRestoreHistory = (id) => {
    alert("This action cannot be restored definitively.");
  };

  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-400" : "text-slate-500";
  const itemCard = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100";
  const timelineColor = dark ? "bg-slate-800" : "bg-slate-100";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black tracking-tight ${textPrimary}`}>Activity History</h1>
          <p className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Track all operations and system events</p>
        </div>
        <div className="flex items-center gap-3">
          <button className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${dark ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}><Icon name="download" className="w-4 h-4 inline mr-2" /> Export</button>
          <button className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-black transition-all shadow-lg active:scale-95"><Icon name="print" className="w-4 h-4 inline mr-2" /> Print</button>
        </div>
      </div>

      <div className={`${dark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"} rounded-[2rem] border overflow-hidden shadow-sm`}>
        <div className={`p-6 border-b ${dark ? "border-slate-800" : "border-slate-100"} space-y-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1"><SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search patients, actions, or users..." /></div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setFilterCategory(cat.id)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border ${filterCategory === cat.id ? "bg-[#2da0a8] border-[#2da0a8] text-white shadow-lg shadow-teal-500/20" : `${dark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"} hover:border-[#2da0a8]/50`}`}>{cat.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="history" className={`w-12 h-12 mx-auto mb-3 ${dark ? "text-gray-600" : "text-gray-300"}`} />
                <p className={textSecondary}>No elements found</p>
              </div>
            ) : (
              filteredHistory.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getCategoryColor(item.category)} flex-shrink-0`}>
                      <Icon name={getCategoryIcon(item.category)} className="w-5 h-5" />
                    </div>
                    {index < filteredHistory.length - 1 && <div className={`w-0.5 h-full ${timelineColor} min-h-[60px]`} />}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className={`${itemCard} rounded-xl p-4 border shadow-sm transition-all relative`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(item.category)}`}>{item.type}</span>
                          <span className={`text-sm font-medium ${textPrimary}`}>{item.patient}</span>
                        </div>
                        <div className="flex items-start gap-3 text-right">
                          <div>
                            <p className={`text-xs ${textSecondary}`}>{new Date(item.date).toLocaleDateString("en-US")}</p>
                            <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{item.time}</p>
                          </div>
                          <div className="relative">
                            <button onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)} className={`p-1 -mr-2 rounded-lg transition-colors ${dark ? "text-slate-500 hover:text-slate-300 hover:bg-slate-700" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}>
                              <Icon name="moreVertical" className="w-5 h-5" />
                            </button>
                            
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
                                    <div className={`h-px my-1 ${dark ? "bg-slate-700" : "bg-slate-100"}`}></div>
                                    <button onClick={() => { handleDeleteHistory(item.id); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition-colors ${dark ? "text-rose-400 hover:bg-rose-900/30" : "text-rose-600 hover:bg-rose-50"}`}>
                                      <Icon name="trash" className="w-4 h-4" /> Delete Event
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                      <p className={`text-sm mb-2 pr-8 ${dark ? "text-gray-300" : "text-gray-600"}`}>{item.description}</p>
                      <div className={`flex items-center gap-2 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        <Icon name="users" className="w-3 h-3" />
                        <span>By {item.user}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          {filteredHistory.length > 0 && (
            <div className="mt-6 text-center">
              <p className={`text-sm ${textSecondary}`}>{filteredHistory.length} event{filteredHistory.length > 1 ? "s" : ""} displayed</p>
            </div>
          )}
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
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Description</p>
                  <p className={`text-sm font-medium ${textPrimary} leading-relaxed`}>{selectedItem.description}</p>
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Performed By</p>
                  <p className={`text-sm font-bold ${textPrimary}`}>{selectedItem.user}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedItem(null)} className="w-full bg-[#2da0a8] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#20838a] transition-all shadow-lg shadow-teal-500/20">Close Details</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
