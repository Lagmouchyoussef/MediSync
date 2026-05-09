import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../../core/services/api";
import Logo from "../../shared/components/Logo";

// Shared logic and UI
import { ThemeContext, mockPatients, mockAppointments } from "./DoctorShared";
import { Icon } from "./DoctorUI";

// Pages
import Dashboard from "./Dashboard";
import Patients from "./Patients";
import Appointments from "./Appointments";
import History from "./History";
import Settings from "./Settings";

// Header Components
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (!apiService.isAuthenticated() || apiService.getUserRole() !== 'doctor') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    apiService.logout();
    navigate('/');
  };

  const [notifications, setNotifications] = useState([
    { id: 1, type: "appointment", title: "Appointment in 30 min", message: "Ahmed Benali has an appointment at 09:00 with Dr. Hassan Amrani", date: "2026-05-10T08:30:00", read: false },
    { id: 2, type: "patient", title: "New patient registered", message: "Nadia Filali was added to the system", date: "2026-05-10T08:45:00", read: false },
    { id: 3, type: "alert", title: "Low stock - Amoxicillin", message: "Amoxicillin stock has fallen below the minimum threshold (250 units remaining)", date: "2026-05-09T16:00:00", read: false },
    { id: 4, type: "appointment", title: "Appointment cancelled", message: "Nadia Filali's appointment scheduled for tomorrow at 15:00 was cancelled", date: "2026-05-09T14:30:00", read: true },
    { id: 5, type: "payment", title: "Payment received", message: "Payment of 1,300 DH received for Sara Moussaoui's invoice", date: "2026-05-09T11:00:00", read: true },
    { id: 6, type: "system", title: "Auto Backup", message: "Daily backup completed successfully at 03:00", date: "2026-05-09T03:00:00", read: true },
    { id: 7, type: "security", title: "New login", message: "Login detected from a new device - Chrome on Windows", date: "2026-05-08T08:00:00", read: true },
    { id: 8, type: "alert", title: "Expired medication", message: "3 batches of Amlodipine expire in less than 30 days", date: "2026-05-07T09:00:00", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const handleMarkRead = (id) => setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  const handleMarkAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const handleDismiss = (id) => setNotifications(notifications.filter((n) => n.id !== id));

  // Global state for patients to persist changes
  const [patients, setPatients] = useState(mockPatients);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navSections = [
    {
      title: "Overview",
      items: [
        { id: "dashboard", label: "Analytics", icon: "dashboard", badge: null },
      ]
    },
    {
      title: "Clinical",
      items: [
        { id: "patients", label: "Patients", icon: "patients", badge: patients.length },
        { id: "appointments", label: "Planning", icon: "appointments", badge: mockAppointments.filter((a) => a.status === "Pending").length },
      ]
    },
    {
      title: "Administration",
      items: [
        { id: "history", label: "Activity", icon: "history", badge: null },
        { id: "settings", label: "Configuration", icon: "settings", badge: null },
      ]
    }
  ];

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "patients": return <Patients patients={patients} setPatients={setPatients} />;
      case "appointments": return <Appointments />;
      case "history": return <History />;
      case "settings": return <Settings />;
      default: return <Dashboard />;
    }
  };

  const bgMain = darkMode ? "bg-[#050608]" : "bg-[#f8fafc]";
  const headerBg = darkMode ? "bg-[#0a0c10]/80 border-[#1e293b]" : "bg-white/80 border-slate-200";
  const headerText = darkMode ? "text-slate-200" : "text-slate-800";
  const headerSubText = darkMode ? "text-slate-500" : "text-slate-400";
  const headerIconColor = darkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100";
  const searchInputStyle = darkMode ? "bg-slate-900 border-slate-800 text-white placeholder-slate-600" : "bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400";
  const sidebarBg = darkMode ? "bg-[#0a0c10] border-[#1e293b]" : "bg-white border-slate-200";

  return (
    <ThemeContext.Provider value={{ dark: darkMode, toggle: () => setDarkMode(!darkMode) }}>
      <div className={`min-h-screen ${bgMain} flex transition-colors duration-300 overflow-hidden`}>
        {mobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

        {/* ==================== LEFT SIDEBAR ==================== */}
        <aside className={`hidden lg:flex flex-col w-64 ${darkMode ? "bg-[#050608] border-[#1e293b]" : "bg-white border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"} border-r z-20 transition-all duration-300 relative`}>
          {/* Top Logo Area */}
          <div className="py-8 flex items-center justify-center cursor-pointer" onClick={() => setActivePage("dashboard")}>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Logo size={100} />
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <p className={`text-[11px] font-black uppercase tracking-[0.2em] px-4 ${darkMode ? "text-slate-500" : "text-slate-400"} flex items-center gap-3`}>
                  {section.title}
                  <span className={`h-px flex-1 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}></span>
                </p>
                <div className="space-y-1.5">
                  {section.items.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                      <button 
                        key={item.id} 
                        onClick={() => setActivePage(item.id)} 
                        className={`w-full group flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-bold transition-all duration-300 relative overflow-hidden ${
                          isActive 
                            ? "bg-gradient-to-r from-[#2da0a8] to-[#20838a] text-white shadow-lg shadow-[#2da0a8]/25" 
                            : `${darkMode ? "text-slate-400 hover:text-white hover:bg-slate-800/50" : "text-slate-500 hover:text-[#2da0a8] hover:bg-slate-50"}`
                        }`}
                      >
                        {/* Hover accent line */}
                        {!isActive && (
                          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#2da0a8] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300`}></div>
                        )}
                        
                        <div className={`${isActive ? "text-white" : darkMode ? "text-slate-500 group-hover:text-white" : "text-slate-400 group-hover:text-[#2da0a8]"} transition-colors duration-300`}>
                          <Icon name={item.icon} className="w-6 h-6" />
                        </div>
                        
                        <span className="flex-1 text-left transform group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
                        
                        {item.badge && item.badge > 0 && (
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black shadow-sm transition-all duration-300 ${isActive ? "bg-white/20 text-white backdrop-blur-sm" : darkMode ? "bg-slate-800 text-slate-300" : "bg-[#2da0a8]/10 text-[#2da0a8]"}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* User Profile Footer */}
          <div className={`p-5 m-4 mt-2 rounded-2xl border ${darkMode ? "bg-[#0a0c10] border-[#1e293b]" : "bg-white border-slate-100 shadow-sm"}`}>
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2da0a8] to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#2da0a8]/20">
                  {(apiService.getUserEmail() || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#0a0c10] rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-base font-bold truncate leading-tight ${darkMode ? "text-white" : "text-slate-800"}`}>Dr. {apiService.getUserEmail()?.split('@')[0] || 'Doctor'}</p>
                <p className={`text-[11px] font-medium truncate mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>General Practitioner</p>
              </div>
              <button onClick={handleLogout} className={`p-2.5 rounded-xl transition-all duration-300 ${darkMode ? "bg-slate-800 text-slate-400 hover:bg-red-500/10 hover:text-red-400" : "bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500"}`} title="Logout">
                <Icon name="logout" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ==================== MAIN CONTENT AREA ==================== */}
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          {/* ==================== TOP HEADER ==================== */}
          <header className={`${headerBg} backdrop-blur-md border-b px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 shadow-sm`}>
            <div className="flex items-center gap-6">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2.5 rounded-xl bg-[#2da0a8] text-white shadow-lg shadow-teal-500/20">
                <Icon name="menu" className="w-6 h-6" />
              </button>
              
              {/* Breadcrumbs / Page Title */}
              <div className="hidden sm:flex flex-col">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Doctor Portal / {activePage === 'dashboard' ? 'Overview' : activePage === 'patients' ? 'Clinical' : activePage === 'appointments' ? 'Clinical' : 'Administration'}
                </p>
                <h2 className={`text-xl font-black tracking-tight capitalize ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {activePage}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              {/* Premium Search Bar */}
              <div className="hidden md:block relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                  <Icon name="search" className={`w-4 h-4 ${darkMode ? "text-slate-600 group-focus-within:text-[#2da0a8]" : "text-slate-400 group-focus-within:text-[#2da0a8]"}`} />
                </div>
                <input 
                  type="text" 
                  placeholder="Quick search patients, docs..." 
                  className={`pl-11 pr-4 py-3 border rounded-2xl text-[13px] w-64 focus:w-80 transition-all duration-500 outline-none font-bold ${searchInputStyle} focus:ring-4 focus:ring-[#2da0a8]/10 focus:border-[#2da0a8] shadow-sm`} 
                />
              </div>

              {/* Quick Action Button (Desktop) */}
              <button className="hidden xl:flex items-center gap-2 bg-[#2da0a8] text-white px-5 py-3 rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-[#20838a] transition-all shadow-lg shadow-teal-500/20 active:scale-95">
                <Icon name="plus" className="w-4 h-4" />
                <span>New Action</span>
              </button>

              <div className={`h-8 w-px ${darkMode ? "bg-slate-800" : "bg-slate-100"} mx-2 hidden md:block`}></div>

              <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl transition-all duration-300 ${headerIconColor}`}>
                <AnimatePresence mode="wait">
                  <motion.div key={darkMode ? "moon" : "sun"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    {darkMode ? <Icon name="sun" className="w-5 h-5 text-yellow-400" /> : <Icon name="moon" className="w-5 h-5 text-slate-600" />}
                  </motion.div>
                </AnimatePresence>
              </button>

              <div ref={notifRef} className="relative">
                <button onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }} className={`p-2.5 rounded-xl transition-all duration-300 ${headerIconColor} relative`}>
                  <Icon name="bell" className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-[#ef4444] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#0a0c10]">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown notifications={notifications} onMarkRead={handleMarkRead} onMarkAllRead={handleMarkAllRead} onDismiss={handleDismiss} isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
              </div>

              <div ref={userMenuRef} className="relative lg:hidden">
                <button onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }} className={`flex items-center gap-2 p-1 rounded-xl transition-all duration-300 ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-[#2da0a8] to-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg shadow-teal-500/10">
                    {(apiService.getUserEmail() || 'A').charAt(0).toUpperCase()}
                  </div>
                  <Icon name="chevronRight" className={`w-3 h-3 transition-transform duration-300 ${userMenuOpen ? "rotate-90" : "rotate-0"} ${headerSubText}`} />
                </button>
                <UserDropdown isOpen={userMenuOpen} onClose={() => setUserMenuOpen(false)} handleLogout={handleLogout} />
              </div>
            </div>
          </header>

          {/* ==================== MOBILE MENU ==================== */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className={`fixed inset-y-0 left-0 z-50 w-64 ${darkMode ? "bg-[#050608]" : "bg-white"} shadow-2xl p-6 lg:hidden flex flex-col`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="relative group">
                    <Logo size={100} />
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className={`p-2 rounded-xl transition-colors ${darkMode ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-slate-800"}`}><Icon name="close" /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar">
                  {navSections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <p className={`text-[11px] font-black uppercase tracking-[0.2em] px-2 ${darkMode ? "text-slate-500" : "text-slate-400"} flex items-center gap-3`}>
                        {section.title}
                        <span className={`h-px flex-1 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}></span>
                      </p>
                      <div className="space-y-1.5">
                        {section.items.map((item) => {
                          const isActive = activePage === item.id;
                          return (
                            <button 
                              key={item.id} 
                              onClick={() => { setActivePage(item.id); setMobileMenuOpen(false); }} 
                              className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold transition-all duration-300 relative overflow-hidden ${
                                isActive 
                                  ? "bg-gradient-to-r from-[#2da0a8] to-[#20838a] text-white shadow-lg shadow-[#2da0a8]/25" 
                                  : `${darkMode ? "text-slate-400 hover:text-white hover:bg-slate-800/50" : "text-slate-500 hover:text-[#2da0a8] hover:bg-slate-50"}`
                              }`}
                            >
                              {!isActive && (
                                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#2da0a8] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300`}></div>
                              )}
                              
                              <div className={`${isActive ? "text-white" : darkMode ? "text-slate-500 group-hover:text-white" : "text-slate-400 group-hover:text-[#2da0a8]"} transition-colors duration-300`}>
                                <Icon name={item.icon} className="w-5 h-5" />
                              </div>
                              
                              <span className="flex-1 text-left transform group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
                              
                              {item.badge && item.badge > 0 && (
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black shadow-sm transition-all duration-300 ${isActive ? "bg-white/20 text-white backdrop-blur-sm" : darkMode ? "bg-slate-800 text-slate-300" : "bg-[#2da0a8]/10 text-[#2da0a8]"}`}>
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content area */}
          <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div key={activePage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}