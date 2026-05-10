import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/PatientShared";
import { Icon, Badge, Modal } from "../components/PatientUI";

export default function HealthHistory({ history, setHistory }) {
  const { dark } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
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

  const categories = [
    { id: "all", label: "All", icon: "activity" },
    { id: "medical", label: "Medical", icon: "heart" },
    { id: "appointment", label: "Appointment", icon: "calendar" },
    { id: "admin", label: "Administration", icon: "settings" },
    { id: "security", label: "Security", icon: "shield" },
    { id: "notification", label: "Notifications", icon: "bell" }
  ];

  const getCategoryColor = (cat) => {
    const c = { 
      medical: dark ? "bg-red-900/30 text-red-300 border-red-800" : "bg-red-50 text-red-700 border-red-100", 
      appointment: dark ? "bg-blue-900/30 text-blue-300 border-blue-800" : "bg-blue-50 text-blue-700 border-blue-100", 
      admin: dark ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200", 
      security: dark ? "bg-yellow-900/30 text-yellow-300 border-yellow-800" : "bg-yellow-50 text-yellow-700 border-yellow-100", 
      notification: dark ? "bg-purple-900/30 text-purple-300 border-purple-800" : "bg-purple-50 text-purple-700 border-purple-100" 
    }; 
    return c[cat] || c.admin;
  };

  const getCategoryIcon = (cat) => ({ 
    medical: "heart", 
    appointment: "calendar", 
    admin: "settings", 
    security: "shield", 
    notification: "bell" 
  }[cat] || "activity");

  const filteredHistory = useMemo(() => {
    if (!Array.isArray(history)) return [];
    return history.filter((item) => {
      const matchSearch = item.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.details.toLowerCase().includes(searchTerm.toLowerCase());
      return filterCategory === "all" || item.type === filterCategory ? matchSearch : false;
    });
  }, [history, searchTerm, filterCategory]);

  const handleDeleteHistory = async () => {
    try {
      await apiService.deleteActivity(deleteConfirm.id);
      setHistory(history.filter(h => h.id !== deleteConfirm.id));
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (err) {
      alert("Error deleting activity record: " + err.message);
    }
  };

  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-400" : "text-slate-500";
  const itemCard = dark ? "bg-[#0a0c10] border-[#1e293b]" : "bg-white border-slate-100 shadow-sm";
  const timelineColor = dark ? "border-[#1e293b]" : "bg-slate-100";


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black tracking-tight ${textPrimary}`}>Activity History</h1>
          <p className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Track all operations and system events</p>
        </div>
        <div className="flex items-center gap-3">
          <button className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${dark ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            <Icon name="download" className="w-4 h-4 inline mr-2" /> Export
          </button>
          <button className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-[#0a0c10] text-white hover:bg-black transition-all shadow-lg active:scale-95">
            <Icon name="print" className="w-4 h-4 inline mr-2" /> Print
          </button>
        </div>
      </div>

      <div className={`${dark ? "bg-[#0a0c10]/50 border-[#1e293b]" : "bg-white border-slate-100"} rounded-[2rem] border overflow-hidden shadow-sm`}>
        <div className={`p-6 border-b ${dark ? "border-[#1e293b]" : "border-slate-100"} space-y-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="search" className={`w-4 h-4 ${dark ? "text-slate-600" : "text-slate-400"}`} />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search actions, records, or dates..." 
                className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2da0a8] focus:border-transparent outline-none text-sm transition-all ${dark ? "bg-[#0a0c10] border-[#1e293b] text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-800 shadow-sm"}`} 
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => setFilterCategory(cat.id)} 
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                    filterCategory === cat.id 
                      ? "bg-[#2da0a8] border-[#2da0a8] text-white shadow-lg shadow-teal-500/20" 
                      : `${dark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"} hover:border-[#2da0a8]/50`
                  }`}
                >
                  {cat.label}
                </button>
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
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: index * 0.05 }} 
                  className="flex gap-4 group"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getCategoryColor(item.type)} flex-shrink-0`}>
                      <Icon name={getCategoryIcon(item.type)} className="w-5 h-5" />
                    </div>
                    {index < filteredHistory.length - 1 && <div className={`w-0.5 h-full ${timelineColor} min-h-[60px]`} />}
                  </div>
                  
                  <div className="flex-1 pb-6">
                    <div className={`${itemCard} rounded-xl p-4 border transition-all relative`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getCategoryColor(item.type)}`}>
                            {item.action}
                          </span>
                        </div>
                        <div className="flex items-start gap-3 text-right">
                          <div>
                            <p className={`text-[11px] font-bold ${textSecondary}`}>
                              {new Date(item.timestamp).toLocaleDateString("en-US")}
                            </p>
                            <p className={`text-[10px] ${dark ? "text-gray-600" : "text-gray-400"}`}>
                              {new Date(item.timestamp).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="relative">
                            <button 
                              onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)} 
                              className={`p-2 -mr-1 rounded-xl transition-all ${dark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-900 hover:bg-slate-100"}`}
                            >
                              <Icon name="moreVertical" className="w-5 h-5" />
                            </button>
                            
                            <AnimatePresence>
                              {activeDropdown === item.id && (
                                <motion.div 
                                  ref={dropdownRef}
                                  initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                                  exit={{ opacity: 0, scale: 0.95, y: 10 }} 
                                  className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border z-50 overflow-hidden ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                                >
                                  <div className="py-1">
                                    <button onClick={() => { setSelectedItem(item); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition-colors ${dark ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"}`}>
                                      <Icon name="eye" className="w-4 h-4 text-[#2da0a8]" /> View Details
                                    </button>
                                    <div className={`h-px my-1 ${dark ? "bg-slate-700" : "bg-slate-100"}`}></div>
                                    <button onClick={() => { setDeleteConfirm({ isOpen: true, id: item.id }); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition-colors ${dark ? "text-rose-400 hover:bg-rose-900/30" : "text-rose-600 hover:bg-rose-50"}`}>
                                      <Icon name="trash" className="w-4 h-4 text-rose-500" /> Delete Record
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                      <p className={`text-sm mb-2 pr-8 ${dark ? "text-gray-300" : "text-gray-600"}`}>{item.details}</p>
                      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${dark ? "text-gray-600" : "text-gray-400"}`}>
                        <Icon name="users" className="w-3.5 h-3.5" />
                        <span>By You</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ isOpen: false, id: null })} title="Confirm Deletion" size="sm">
        <div className="text-center py-4 space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="trash" className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className={`text-lg font-black ${textPrimary}`}>Delete Event?</h3>
            <p className={`text-sm font-medium ${textSecondary} px-4 leading-relaxed`}>
              Permanently delete this event from history?
            </p>
          </div>
          <div className="flex gap-3 pt-4 px-2">
            <button onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className={`flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${dark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}>Cancel</button>
            <button onClick={handleDeleteHistory} className="flex-1 bg-rose-600 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20 active:scale-95">Delete</button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Event Details" size="md">
        {selectedItem && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border ${dark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-start justify-between mb-6 border-b pb-6 border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className={`text-lg font-black ${textPrimary}`}>{selectedItem.action}</h4>
                  <p className={`${textSecondary} text-[10px] font-black mt-1 uppercase tracking-widest`}>Event ID: #{selectedItem.id.toString().padStart(4, '0')}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getCategoryColor(selectedItem.type)}`}>
                  <Icon name={getCategoryIcon(selectedItem.type)} className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Date</p>
                    <p className={`text-sm font-bold ${textPrimary}`}>{new Date(selectedItem.timestamp).toLocaleDateString("en-US")}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Time</p>
                    <p className={`text-sm font-bold ${textPrimary}`}>{new Date(selectedItem.timestamp).toLocaleTimeString("en-US")}</p>
                  </div>
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary} mb-1`}>Description</p>
                  <p className={`text-sm font-medium ${textPrimary} leading-relaxed`}>{selectedItem.details}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedItem(null)} className="w-full bg-[#2da0a8] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-500/20">Close Details</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
