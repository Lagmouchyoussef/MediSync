import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../../core/services/api";
import Logo from "../../shared/components/Logo";

// Shared logic and UI
import { ThemeContext } from "./components/DoctorShared";
import { Icon } from "./components/DoctorUI";

// Pages
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import History from "./pages/History";
import Settings from "./pages/Settings";

// Header Components
import NotificationDropdown from "./components/NotificationDropdown";
import UserDropdown from "./components/UserDropdown";

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

  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const handleMarkRead = (id) => setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  const handleMarkAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const handleDismiss = async (id) => {
    try {
      await apiService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
      
      const notif = notifications.find((n) => n.id === id);
      if (notif) {
        await apiService.createActivity("Notification Supprimée", `La notification "${notif.title}" a été supprimée définitivement.`, "notification");
        const updatedHistory = await apiService.fetchActivities();
        setHistory(updatedHistory);
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Global state for patients to persist changes
  const [patients, setPatients] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    summary: {
      total_patients: 0,
      total_appointments: 0,
      total_history: 0,
      upcoming_today: 0,
    },
    charts: {},
  });
  
  // Navigation states
  const [expandedNav, setExpandedNav] = useState(null);
  const [appointmentsTab, setAppointmentsTab] = useState("manage");

  // Invitations state
  const [invitations, setInvitations] = useState([]);

  // History state
  const [history, setHistory] = useState([]);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    // Global data fetch
    const fetchData = async () => {
      try {
        // Fetch Profile
        const profileData = await apiService.fetchProfile();
        setProfile(profileData);
        if (profileData.image) setUserImage(profileData.image);
        
        // Fetch Patients
        const patientsData = await apiService.fetchPatients();
        if (Array.isArray(patientsData)) {
          const formattedPatients = patientsData.map(p => ({
            ...p,
            name: `${p.first_name} ${p.last_name}`,
            age: p.date_of_birth ? (new Date().getFullYear() - new Date(p.date_of_birth).getFullYear()) : "N/A"
          }));
          setPatients(formattedPatients);
        }

        // Fetch Dashboard statistics from backend summary
        const statsData = await apiService.fetchStats();
        if (statsData?.summary) {
          setDashboardStats(statsData);
        }

        // Fetch Appointments
        const appointmentsData = await apiService.fetchAppointments();
        if (Array.isArray(appointmentsData)) {
          setInvitations(appointmentsData);
        }

        // Fetch History
        const activitiesData = await apiService.fetchActivities();
        if (Array.isArray(activitiesData)) {
          setHistory(activitiesData);
        }

        // Fetch Notifications
        const notifsData = await apiService.fetchNotifications().catch(() => []);
        if (Array.isArray(notifsData)) {
          setNotifications(notifsData);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Profile image sync
  const [userImage, setUserImage] = useState(apiService.getUserImage());
  const refreshUserImage = () => setUserImage(apiService.getUserImage());

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
        { id: "patients", label: "Patients", icon: "patients", badge: Array.isArray(patients) ? patients.length : 0 },
        { 
          id: "appointments", 
          label: "Availability", 
          icon: "appointments", 
          badge: Array.isArray(invitations) ? invitations.length : 0,
          subItems: [
            { id: "manage", label: "Manage Setup" },
            { id: "history", label: "Invitation History", badge: Array.isArray(invitations) ? invitations.length : 0 }
          ]
        },
      ]
    },
    {
      title: "Administration",
      items: [
        { id: "history", label: "Activity", icon: "history", badge: Array.isArray(history) ? history.length : 0 },
        { id: "settings", label: "Configuration", icon: "settings", badge: null },
      ]
    }
  ];

  const handleDeleteAppointmentFromDashboard = async (id) => {
    try {
      await apiService.deleteAppointment(id);
      setInvitations(prev => prev.filter(inv => inv.id !== id));
      await apiService.createActivity("Deleted Appointment", `Appointment ID ${id} was deleted via Dashboard.`, "danger");
    } catch (err) {
      alert("Error deleting appointment");
    }
  };

  const renderPage = () => {
    const pCount = Array.isArray(patients) ? patients.length : (dashboardStats?.summary?.total_patients ?? 0);
    const iCount = Array.isArray(invitations) ? invitations.length : (dashboardStats?.summary?.total_appointments ?? 0);
    const hCount = Array.isArray(history) ? history.length : (dashboardStats?.summary?.total_history ?? 0);
    const nUnread = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;
    const safeInvs = Array.isArray(invitations) ? invitations : [];

    switch (activePage) {
      case "dashboard": return (
        <Dashboard
          patientsCount={pCount}
          appointmentCount={safeInvs.filter(i => {
            if (!i.date) return false;
            const d = new Date(i.date);
            return !isNaN(d.getTime()) && d.toDateString() === new Date().toDateString();
          }).length}
          historyCount={hCount}
          notificationsCount={nUnread}
          upcomingAppointments={safeInvs.slice(0, 5).map(i => ({ ...i, patient: i.patient_name || i.patient || "Patient" }))}
          history={Array.isArray(history) ? history : []}
          onDeleteAppointment={handleDeleteAppointmentFromDashboard}
          onNavigate={setActivePage}
        />
      );
      case "patients": return <Patients patients={Array.isArray(patients) ? patients : []} setPatients={setPatients} />;
      case "appointments": return <Appointments activeTab={appointmentsTab} setActiveTab={setAppointmentsTab} invitations={safeInvs} setInvitations={setInvitations} patients={Array.isArray(patients) ? patients : []} />;
      case "history": return <History setPatients={setPatients} history={Array.isArray(history) ? history : []} setHistory={setHistory} />;
      case "settings": return <Settings onProfileUpdate={async () => {
        const updated = await apiService.fetchProfile();
        setProfile(updated);
        setUserImage(updated.image);
      }} />;
      default: return (
        <Dashboard 
          patientsCount={pCount} 
          appointmentCount={iCount} 
          historyCount={hCount} 
          notificationsCount={nUnread} 
          upcomingAppointments={safeInvs} 
        />
      );
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
    <ThemeContext.Provider value={{ dark: darkMode, toggle: () => setDarkMode(!darkMode), setDark: setDarkMode }}>
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
                    const hasSubItems = !!item.subItems;
                    const isExpanded = expandedNav === item.id;

                    return (
                      <div key={item.id} className="space-y-1">
                        <button 
                          onClick={() => {
                            if (hasSubItems) {
                              setExpandedNav(isExpanded ? null : item.id);
                              setActivePage(item.id);
                            } else {
                              setActivePage(item.id);
                              setExpandedNav(null);
                            }
                          }} 
                          className={`w-full group flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-bold transition-all duration-300 relative overflow-hidden ${
                            isActive && !hasSubItems
                              ? "bg-gradient-to-r from-[#2da0a8] to-[#20838a] text-white shadow-lg shadow-[#2da0a8]/25" 
                              : isActive && hasSubItems
                                ? `${darkMode ? "bg-slate-800 text-white" : "bg-[#2da0a8]/10 text-[#2da0a8]"}`
                                : `${darkMode ? "text-slate-400 hover:text-white hover:bg-slate-800/50" : "text-slate-500 hover:text-[#2da0a8] hover:bg-slate-50"}`
                          }`}
                        >
                          {/* Hover accent line */}
                          {!isActive && (
                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#2da0a8] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300`}></div>
                          )}
                          
                          <div className={`${isActive ? (hasSubItems ? "text-[#2da0a8]" : "text-white") : darkMode ? "text-slate-500 group-hover:text-white" : "text-slate-400 group-hover:text-[#2da0a8]"} transition-colors duration-300`}>
                            <Icon name={item.icon} className="w-6 h-6" />
                          </div>
                          
                          <span className="flex-1 text-left transform group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
                          
                          {item.badge && item.badge > 0 && !hasSubItems && (
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black shadow-sm transition-all duration-300 ${isActive ? "bg-white/20 text-white backdrop-blur-sm" : darkMode ? "bg-slate-800 text-slate-300" : "bg-[#2da0a8]/10 text-[#2da0a8]"}`}>
                              {item.badge}
                            </span>
                          )}

                          {hasSubItems && (
                            <div className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}>
                              <Icon name="chevronRight" className={`w-4 h-4 ${isActive ? "text-[#2da0a8]" : darkMode ? "text-slate-500" : "text-slate-400"}`} />
                            </div>
                          )}
                        </button>

                        <AnimatePresence>
                          {hasSubItems && isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: "auto", opacity: 1 }} 
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className={`ml-11 pl-4 border-l-2 space-y-1 py-1 ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
                                {item.subItems.map(sub => {
                                  const isSubActive = appointmentsTab === sub.id;
                                  return (
                                    <button 
                                      key={sub.id}
                                      onClick={() => {
                                        setActivePage(item.id);
                                        if (item.id === "appointments") {
                                          setAppointmentsTab(sub.id);
                                        }
                                        setMobileMenuOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-bold transition-all duration-300 flex items-center justify-between ${
                                        isSubActive 
                                          ? `${darkMode ? "text-white bg-slate-800" : "text-[#2da0a8] bg-[#2da0a8]/10"}` 
                                          : `${darkMode ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50" : "text-slate-500 hover:text-[#2da0a8] hover:bg-slate-50"}`
                                      }`}
                                    >
                                      <span>{sub.label}</span>
                                      {sub.badge !== undefined && sub.badge > 0 && (
                                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${isSubActive ? "bg-[#2da0a8] text-white" : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"}`}>
                                          {sub.badge}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
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
                <div className="w-10 h-10 bg-gradient-to-br from-[#2da0a8] to-blue-600 rounded-xl overflow-hidden flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#2da0a8]/20">
                  {userImage ? (
                    <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (profile?.first_name || apiService.getUserFirstName() || 'A').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#0a0c10] rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-black truncate ${headerText}`}>
                  {profile ? `${profile.first_name} ${profile.last_name}` : apiService.getUserFullName()}
                </p>
                <p className={`text-[10px] font-black uppercase tracking-widest truncate ${headerSubText}`}>
                  {profile?.specialty || apiService.getUserRole()}
                </p>
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
                  placeholder="Rechercher un patient..." 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setActivePage('patients');
                    }
                  }}
                  className={`pl-11 pr-4 py-3 border rounded-2xl text-[13px] w-64 focus:w-80 transition-all duration-500 outline-none font-bold ${searchInputStyle} focus:ring-4 focus:ring-[#2da0a8]/10 focus:border-[#2da0a8] shadow-sm`} 
                />
              </div>



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
                  <div className="w-8 h-8 bg-gradient-to-br from-[#2da0a8] to-blue-600 rounded-lg overflow-hidden flex items-center justify-center text-white font-black text-xs shadow-lg shadow-teal-500/10">
                    {userImage ? (
                      <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      (profile?.first_name || apiService.getUserFirstName() || 'A').charAt(0).toUpperCase()
                    )}
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