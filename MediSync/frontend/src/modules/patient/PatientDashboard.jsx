import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../../core/services/api";
import Logo from "../../shared/components/Logo";

// ==================== Icon Component ====================
function Icon({ name, className = "w-5 h-5" }) {
  const icons = {
    overview: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
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
    <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden">
      {/* ==================== LEFT SIDEBAR ==================== */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 relative">
        <div className="py-8 flex items-center justify-center cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Logo size={100} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
          <div className="space-y-3">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] px-4 text-slate-400 flex items-center gap-3">
              Patient Portal
              <span className="h-px flex-1 bg-slate-100"></span>
            </p>
            <div className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveTab(item.id)} 
                    className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold transition-all duration-300 relative overflow-hidden ${
                      isActive 
                        ? "bg-gradient-to-r from-[#2da0a8] to-[#20838a] text-white shadow-lg shadow-[#2da0a8]/25" 
                        : "text-slate-500 hover:text-[#2da0a8] hover:bg-slate-50"
                    }`}
                  >
                    {!isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#2da0a8] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    )}
                    <div className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-[#2da0a8]"} transition-colors duration-300`}>
                      <Icon name={item.icon} className="w-6 h-6" />
                    </div>
                    <span className="flex-1 text-left transform group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-5 m-4 mt-2 rounded-2xl border bg-white border-slate-100 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2da0a8] to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#2da0a8]/20">
                {(apiService.getUserDisplayName() || 'P').charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold truncate leading-tight text-slate-800">{apiService.getUserDisplayName() || 'Patient'}</p>
              <p className="text-[11px] font-medium truncate mt-0.5 text-slate-500">{apiService.getUserRole()?.toUpperCase() || 'PATIENT'}</p>
            </div>
            <button onClick={handleLogout} className="p-2.5 rounded-xl transition-all duration-300 bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500" title="Logout">
              <Icon name="logout" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="lg:hidden relative cursor-pointer" onClick={() => setActiveTab("overview")}>
              <Logo size={80} className="relative" />
            </div>
            
            {/* Page Context */}
            <div className="hidden sm:flex flex-col">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Patient Portal / Medical
              </p>
              <h2 className="text-xl font-black tracking-tight capitalize text-slate-800">
                {activeTab}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Quick Support Button */}
            <button className="hidden md:flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl text-[12px] font-bold hover:bg-slate-100 transition-all border border-slate-100">
              <Icon name="messages" className="w-4 h-4 text-[#2da0a8]" />
              <span>Support</span>
            </button>

            <div className="h-8 w-px bg-slate-100 mx-2 hidden md:block"></div>

            <button className="relative p-3 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-[#2da0a8] transition-all duration-300">
              <Icon name="bell" className="w-5.5 h-5.5" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="lg:hidden">
              <div className="w-8 h-8 bg-gradient-to-br from-[#2da0a8] to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                {(apiService.getUserDisplayName() || 'P').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* ==================== MAIN CONTENT ==================== */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto custom-scrollbar">
        <div className="mb-10">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Welcome, {apiService.getUserDisplayName() || 'Guest'}</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Your health is our priority.</p>
        </div>

        {/* Quick Health Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <HealthStat icon="droplets" label="Blood Group" value="O+" color="text-rose-500" bg="bg-rose-50" />
          <HealthStat icon="heart" label="Blood Pressure" value="120/80" color="text-emerald-500" bg="bg-emerald-50" />
          <HealthStat icon="stethoscope" label="Last Checkup" value="2 months ago" color="text-amber-500" bg="bg-amber-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="font-black text-slate-800 mb-6 uppercase tracking-widest text-xs">Upcoming Appointment</h3>
            <div className="rounded-3xl p-10 border border-dashed border-slate-200 text-center">
              <Icon name="appointments" className="w-10 h-10 mx-auto text-[#2da0a8]" />
              <p className="text-lg font-black text-slate-800 mt-6">Aucun rendez-vous prévu</p>
              <p className="text-sm text-slate-400 mt-2">Lorsque vous aurez un rendez-vous, il s'affichera ici automatiquement.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="font-black text-slate-800 mb-6 uppercase tracking-widest text-xs">Recent Documents</h3>
            <div className="rounded-3xl p-10 border border-dashed border-slate-200 text-center">
              <Icon name="records" className="w-10 h-10 mx-auto text-[#2da0a8]" />
              <p className="text-lg font-black text-slate-800 mt-6">Aucun document disponible</p>
              <p className="text-sm text-slate-400 mt-2">Vos documents médicaux apparaîtront ici lorsque vous en aurez de nouveaux.</p>
            </div>
          </div>
        </div>
        </main>
      </div>
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