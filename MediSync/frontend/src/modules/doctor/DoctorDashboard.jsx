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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", badge: null },
    { id: "patients", label: "Patients", icon: "patients", badge: mockPatients.length },
    { id: "appointments", label: "Appointments", icon: "appointments", badge: mockAppointments.filter((a) => a.status === "Pending").length },
    { id: "history", label: "History", icon: "history", badge: null },
    { id: "settings", label: "Settings", icon: "settings", badge: null },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "patients": return <Patients />;
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
      <div className={`min-h-screen ${bgMain} flex transition-colors duration-300`}>
        {mobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

        {/* ==================== SIDEBAR ==================== */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 ${sidebarBg} border-r transition-all duration-300 flex flex-col ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${sidebarOpen ? "w-72" : "w-[88px]"}`}>
          <div className={`p-8 flex flex-col items-center justify-center border-b ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
            <div className="relative cursor-pointer" onClick={() => setActivePage("dashboard")}>
              <Logo size={sidebarOpen ? 120 : 48} className="relative transition-all duration-500" />
            </div>
          </div>

          <nav className="flex-1 flex flex-col py-4 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button 
                  key={item.id} 
                  onClick={() => { setActivePage(item.id); setMobileMenuOpen(false); }} 
                  className={`w-full flex items-center gap-4 px-8 py-5 transition-all duration-300 border-b ${darkMode ? "border-slate-800" : "border-slate-100"} ${
                    isActive 
                      ? "bg-[#2da0a8] text-white border-l-4 border-l-white/50" 
                      : `${darkMode ? "text-slate-400 hover:bg-slate-900" : "text-slate-500 hover:bg-slate-50"} border-l-4 border-l-transparent`
                  }`}
                >
                  <Icon name={item.icon} className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -10 }} 
                        className="text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden flex-1 text-left uppercase"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {item.badge && item.badge > 0 && (
                    <span className={`${isActive ? "bg-white text-[#2da0a8]" : "bg-[#2da0a8] text-white"} px-2 py-0.5 rounded-lg text-[10px] font-black min-w-[20px] text-center shadow-sm`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className={`p-6 border-t ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
            <div className={`flex items-center gap-3 p-3 rounded-2xl ${darkMode ? "bg-slate-900/50" : "bg-slate-50"} ${sidebarOpen ? "" : "justify-center"}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-[#2da0a8] to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/20">
                {(apiService.getUserEmail() || 'A').charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black tracking-tighter text-[#2da0a8] uppercase truncate">Dr. {(apiService.getUserEmail() || 'Admin').split('@')[0]}</p>
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Active Session</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ==================== MAIN ==================== */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* ==================== HEADER ==================== */}
          <header className={`${headerBg} backdrop-blur-xl border-b px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30 transition-all duration-300`}>
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2.5 rounded-2xl transition-all duration-300 ${headerIconColor} border border-transparent hover:border-slate-800/10`}>
                <Icon name="menu" className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-3 text-sm">
                <span className={`font-black uppercase tracking-widest text-[10px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Doctor Portal</span>
                <div className={`w-1 h-1 rounded-full ${darkMode ? "bg-slate-700" : "bg-slate-300"}`}></div>
                <span className={`font-bold tracking-tight ${headerText}`}>{navItems.find((item) => item.id === activePage)?.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300">
                  <Icon name="search" className={`w-4 h-4 ${darkMode ? "text-slate-600 group-focus-within:text-[#2da0a8]" : "text-slate-400 group-focus-within:text-[#2da0a8]"}`} />
                </div>
                <input 
                  type="text" 
                  placeholder="Global search..." 
                  className={`pl-10 pr-4 py-2.5 border rounded-2xl text-xs w-64 focus:w-80 transition-all duration-500 outline-none font-medium ${searchInputStyle} focus:ring-2 focus:ring-[#2da0a8]/20 focus:border-[#2da0a8]`} 
                />
              </div>

              <div className={`w-px h-6 ${darkMode ? "bg-slate-800" : "bg-slate-200"} hidden sm:block`} />

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative p-2.5 rounded-2xl transition-all duration-300 group ${headerIconColor} border border-transparent hover:border-slate-800/10`}
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={darkMode ? "moon" : "sun"}
                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  >
                    {darkMode ? <Icon name="sun" className="w-5 h-5 text-yellow-400" /> : <Icon name="moon" className="w-5 h-5 text-slate-600" />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* Notification */}
              <div ref={notifRef} className="relative">
                <button 
                  onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }} 
                  className={`relative p-2.5 rounded-2xl transition-all duration-300 ${headerIconColor} border border-transparent hover:border-slate-800/10`}
                >
                  <Icon name="bell" className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="absolute top-2 right-2 w-4 h-4 bg-[#ef4444] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#0a0c10]"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.span>
                  )}
                </button>
                <NotificationDropdown notifications={notifications} onMarkRead={handleMarkRead} onMarkAllRead={handleMarkAllRead} onDismiss={handleDismiss} isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
              </div>

              {/* User Dropdown */}
              <div ref={userMenuRef} className="relative">
                <button 
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }} 
                  className={`flex items-center gap-3 p-1.5 rounded-2xl transition-all duration-300 ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"} border border-transparent hover:border-slate-800/10`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#2da0a8] to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-teal-500/10">
                    {(apiService.getUserEmail() || 'A').charAt(0).toUpperCase()}
                  </div>
                  <Icon name="chevronRight" className={`w-3.5 h-3.5 transition-transform duration-300 ${userMenuOpen ? "rotate-90" : "rotate-0"} ${headerSubText}`} />
                </button>
                <UserDropdown isOpen={userMenuOpen} onClose={() => setUserMenuOpen(false)} handleLogout={handleLogout} />
              </div>
            </div>
          </header>

          {/* Content area where pages are rendered */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div key={activePage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}