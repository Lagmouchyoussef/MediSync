import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../../core/services/api";
import Logo from "../../shared/components/Logo";

// ==================== Icon Component ====================
function Icon({ name, className = "w-5 h-5" }) {
  const icons = {
    overview: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    appointments: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    records: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    messages: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>,
    settings: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    logout: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
    bell: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    heart: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    droplets: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s9.75 9.75 9.75 9.75 9.75-4.365 9.75-9.75-4.365-9.75-9.75-9.75zm0 15c-2.895 0-5.25-2.355-5.25-5.25s5.25-5.25 5.25-5.25 5.25 2.355 5.25 5.25-2.355 5.25-5.25 5.25z" /></svg>,
    stethoscope: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    chevronRight: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  };
  return icons[name] || null;
}

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!apiService.isAuthenticated() || apiService.getUserRole() !== 'patient') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    apiService.logout();
    navigate('/');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'overview' },
    { id: 'appointments', label: 'Appointments', icon: 'appointments' },
    { id: 'records', label: 'Medical Records', icon: 'records' },
    { id: 'messages', label: 'Messages', icon: 'messages' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${sidebarOpen ? "w-72" : "w-24"}`}>
        <div className="p-8 flex flex-col items-center justify-center border-b border-slate-100">
          <Logo size={sidebarOpen ? 120 : 48} className="transition-all duration-500" />
        </div>

        <nav className="flex-1 flex flex-col py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className={`w-full flex items-center gap-4 px-8 py-5 transition-all duration-300 border-b border-slate-50 ${
                  isActive 
                    ? "bg-[#2da0a8] text-white border-l-4 border-l-white/50" 
                    : "text-slate-500 hover:bg-slate-50 border-l-4 border-l-transparent"
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
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className={`flex items-center gap-3 p-3 rounded-2xl bg-slate-50 ${sidebarOpen ? "" : "justify-center"}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#2da0a8] to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/20">
              {(apiService.getUserEmail() || 'A').charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black tracking-tighter text-[#2da0a8] uppercase truncate">{(apiService.getUserEmail() || 'Patient').split('@')[0]}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Active Session</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all"
          >
            <Icon name="logout" className="w-4 h-4" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden">
              <Icon name="menu" className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Welcome, {(apiService.getUserEmail() || 'Guest').split('@')[0]}</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Your health is our priority.</p>
            </div>
          </div>
          
          <button className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-50 relative shadow-sm">
            <Icon name="bell" className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        {/* Quick Health Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <HealthStat icon="droplets" label="Blood Group" value="O+" color="text-rose-500" bg="bg-rose-50" />
          <HealthStat icon="heart" label="Blood Pressure" value="120/80" color="text-emerald-500" bg="bg-emerald-50" />
          <HealthStat icon="stethoscope" label="Last Checkup" value="2 months ago" color="text-amber-500" bg="bg-amber-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointment */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="font-black text-slate-800 mb-6 uppercase tracking-widest text-xs">Upcoming Appointment</h3>
            <div className="bg-[#2da0a8]/5 rounded-3xl p-8 border border-[#2da0a8]/10">
              <div className="flex justify-between items-start mb-8">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#2da0a8]">
                    <Icon name="appointments" className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-tight">Dr. Sarah Khalil</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cardiology</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#2da0a8] uppercase">Tomorrow</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">14:30</p>
                </div>
              </div>
              <button className="w-full bg-[#2da0a8] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#258a91] transition-all shadow-lg shadow-[#2da0a8]/20">
                Appointment Details
              </button>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="font-black text-slate-800 mb-6 uppercase tracking-widest text-xs">Recent Documents</h3>
            <div className="space-y-4">
              <DocumentItem name="Blood_analysis.pdf" date="May 12, 2024" size="1.2 MB" />
              <DocumentItem name="Prescription_Flu.pdf" date="May 05, 2024" size="450 KB" />
              <DocumentItem name="Chest_Xray.jpg" date="April 20, 2024" size="3.5 MB" />
            </div>
            <button className="w-full mt-8 py-3 text-[#2da0a8] text-xs font-black uppercase tracking-widest hover:bg-[#2da0a8]/5 rounded-2xl transition-all">
              See all documents
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function HealthStat({ icon, label, value, color, bg }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
      <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center`}>
        <Icon name={icon} className="w-7 h-7" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-black text-slate-800 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function DocumentItem({ name, date, size }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
          <Icon name="records" className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{name}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{date} • {size}</p>
        </div>
      </div>
      <Icon name="chevronRight" className="w-5 h-5 text-slate-300" />
    </div>
  );
}