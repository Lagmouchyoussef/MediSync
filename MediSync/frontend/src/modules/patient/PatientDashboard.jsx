import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../shared/components/Logo";

// Shared logic and UI
import { ThemeContext, patientData } from "./components/PatientShared";
import { Icon } from "./components/PatientUI";

// Header Components
import NotificationDropdown from "./components/NotificationDropdown";
import apiService from "../../core/services/api";



// Pages
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import HealthHistory from "./pages/HealthHistory";
import Configuration from "./pages/Configuration";

export default function PatientDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!apiService.isAuthenticated() || apiService.getUserRole() !== 'patient') {
      navigate("/");
    }
  }, [navigate]);

  // History State
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Appointments State
  const [appointments, setAppointments] = useState([]);
  const [loadingApts, setLoadingApts] = useState(true);

  const fetchApts = async () => {
    try {
      const data = await apiService.fetchAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoadingApts(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    window.location.href = "/";
  };

  const fetchHistory = async () => {
    try {
      const data = await apiService.fetchActivities();
      setHistory(data || []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await apiService.fetchCurrentUser();
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };


  // History Refresh instead of manual add
  const refreshHistory = () => {
    fetchHistory();
  };

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);

  const fetchNotifs = async () => {
    try {
      const data = await apiService.fetchNotifications();
      // Map backend fields to frontend fields if necessary
      const mapped = data.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        date: n.created_at,
        read: n.read
      }));
      setNotifications(mapped);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
    fetchHistory();
    fetchApts();
    fetchProfile();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifs();
      fetchApts();
    }, 30000);
    return () => clearInterval(interval);
  }, []);


  // Show toast for new unread notifications
  const prevNotifsRef = useRef([]);
  useEffect(() => {
    const unread = notifications.filter(n => !n.read);
    const prevUnread = prevNotifsRef.current.filter(n => !n.read);
    
    prevNotifsRef.current = notifications;
  }, [notifications]);




  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await apiService.markNotificationRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiService.markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await apiService.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };


  const unreadCount = notifications.filter(n => !n.read).length;

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
        { id: "appointments", label: "Appointments", icon: "calendar", badge: appointments.filter(a => a.status === 'Pending').length },
        { id: "history", label: "Health History", icon: "history", badge: history.length },
      ]
    },
    {
      title: "Administration",
      items: [
        { id: "settings", label: "Configuration", icon: "settings", badge: null },
      ]
    }
  ];

  const headerBg = darkMode ? "bg-[#0a0c10]/80 border-[#1e293b]" : "bg-white/80 border-slate-200";
  const headerText = darkMode ? "text-slate-200" : "text-slate-800";
  const headerSubText = darkMode ? "text-slate-500" : "text-slate-400";
  const headerIconColor = darkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100";
  const searchInputStyle = darkMode ? "bg-slate-900 border-[#1e293b] text-white placeholder-slate-600" : "bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400";
  const bgMain = darkMode ? "bg-[#050608]" : "bg-[#f8fafc]";
  const sidebarBg = darkMode ? "bg-[#050608] border-[#1e293b]" : "bg-white border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]";


  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard onNavigate={setActivePage} appointments={appointments} notifications={notifications} historyCount={history.length} />;
      case "appointments": return <Appointments onAddToHistory={refreshHistory} appointments={appointments} setAppointments={setAppointments} />;
      case "history": return <HealthHistory history={history} setHistory={setHistory} />;
      case "settings": return <Configuration />;
      default: return <Dashboard onNavigate={setActivePage} appointments={appointments} notifications={notifications} historyCount={history.length} />;
    }
  };

  return (
    <ThemeContext.Provider value={{ dark: darkMode, toggle: () => setDarkMode(!darkMode) }}>
      <div className={`min-h-screen ${bgMain} flex transition-colors duration-300 overflow-hidden`}>
        {/* Mobile Overlay */}
        {mobileMenuOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

        {/* ==================== LEFT SIDEBAR ==================== */}
        <aside className={`hidden lg:flex flex-col w-64 ${sidebarBg} border-r z-20 transition-all duration-300 relative`}>

          <div className="py-8 flex items-center justify-center cursor-pointer" onClick={() => setActivePage("dashboard")}>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#2da0a8] to-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Logo size={100} />
            </div>
          </div>
          
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
                        {!isActive && (
                          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#2da0a8] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300`}></div>
                        )}
                        <div className={`${isActive ? "text-white" : darkMode ? "text-slate-500 group-hover:text-white" : "text-slate-400 group-hover:text-[#2da0a8]"} transition-colors duration-300`}>
                          <Icon name={item.icon} className="w-6 h-6" />
                        </div>
                        <span className="flex-1 text-left transform group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
                        {item.badge !== null && item.badge >= 0 && (
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

          <div className={`p-5 m-4 mt-2 rounded-2xl border ${darkMode ? "bg-[#0a0c10] border-[#1e293b]" : "bg-white border-slate-100 shadow-sm"}`}>
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2da0a8] to-blue-600 rounded-xl overflow-hidden flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#2da0a8]/20">
                  {profile?.image ? (
                    <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    (profile?.first_name || apiService.getUserFirstName() || "P").charAt(0)
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#0a0c10] rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-black truncate ${headerText}`}>
                  {profile ? `${profile.first_name} ${profile.last_name}` : apiService.getUserFullName()}
                </p>
                <p className={`text-[10px] font-black uppercase tracking-widest truncate ${headerSubText}`}>Patient</p>
              </div>
              <button 
                onClick={handleLogout}
                className={`p-2.5 rounded-xl transition-all duration-300 ${darkMode ? "bg-slate-800 text-slate-400 hover:bg-red-500/10 hover:text-red-400" : "bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500"}`} 
                title="Logout"
              >
                <Icon name="logout" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ==================== MAIN CONTENT AREA ==================== */}
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          <header className={`${headerBg} backdrop-blur-md border-b px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 shadow-sm`}>
            <div className="flex items-center gap-6">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2.5 rounded-xl bg-[#2da0a8] text-white shadow-lg shadow-teal-500/20">
                <Icon name="menu" className="w-6 h-6" />
              </button>
              <div className="hidden sm:flex flex-col">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Patient Portal / {activePage === 'dashboard' ? 'Overview' : activePage === 'history' ? 'Clinical' : activePage}
                </p>
                <h2 className={`text-xl font-black tracking-tight capitalize ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {activePage === 'history' ? 'Health History' : activePage}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                  <Icon name="search" className={`w-4 h-4 ${darkMode ? "text-slate-600" : "text-slate-400"}`} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  className={`pl-11 pr-4 py-3 border rounded-2xl text-[13px] w-64 focus:w-80 transition-all duration-500 outline-none font-bold ${searchInputStyle} focus:ring-4 focus:ring-[#2da0a8]/10 focus:border-[#2da0a8] shadow-sm`} 
                />
              </div>

              <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl transition-all duration-300 ${headerIconColor}`}>
                {darkMode ? <Icon name="sun" className="w-5 h-5 text-yellow-400" /> : <Icon name="moon" className="w-5 h-5" />}
              </button>

              <div ref={notifRef} className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)} className={`p-2.5 rounded-xl transition-all duration-300 ${headerIconColor} relative`}>
                  <Icon name="bell" className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0a0c10]">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown 
                  notifications={notifications} 
                  onMarkRead={handleMarkRead} 
                  onMarkAllRead={handleMarkAllRead} 
                  onDismiss={handleDismiss} 
                  isOpen={notifOpen} 
                  onClose={() => setNotifOpen(false)} 
                />
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activePage} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                transition={{ duration: 0.2 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
      </div>
    </div>
  </ThemeContext.Provider>


  );
}