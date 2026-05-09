import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  MessageSquare, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Bell,
  Heart,
  Droplets,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import apiService from "../../core/services/api";
import Logo from "../../shared/components/Logo";

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

  return (
    <div className="flex h-screen bg-[#f4f7fb]">
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 bg-white border-r border-slate-200 flex flex-col p-4 lg:p-6 transition-all">
        <div className="flex items-center gap-3 mb-10 px-2">
          <Logo size={40} />
          <span className="text-xl font-bold text-slate-800 tracking-tight hidden lg:block">MediSync</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Overview" id="overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={Calendar} label="Appointments" id="appointments" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
          <SidebarItem icon={FileText} label="Medical Records" id="records" active={activeTab === 'records'} onClick={() => setActiveTab('records')} />
          <SidebarItem icon={MessageSquare} label="Messages" id="messages" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} />
          <div className="pt-6 mt-6 border-t border-slate-100">
            <SidebarItem icon={Settings} label="Settings" id="settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </div>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="hidden lg:block">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome, {apiService.getUserEmail().split('@')[0]}</h1>
            <p className="text-slate-500 text-sm">Your health is our priority.</p>
          </div>
          
          <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        {/* Quick Health Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <HealthStat icon={Droplets} label="Blood Group" value="O+" color="text-rose-500" bg="bg-rose-50" />
          <HealthStat icon={Heart} label="Blood Pressure" value="120/80" color="text-emerald-500" bg="bg-emerald-50" />
          <HealthStat icon={Stethoscope} label="Last Checkup" value="2 months ago" color="text-amber-500" bg="bg-amber-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointment */}
          <div className="glass-panel p-6">
            <h3 className="font-bold text-slate-800 mb-6">Upcoming Appointment</h3>
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Dr. Sarah Khalil</h4>
                    <p className="text-xs text-slate-500">Cardiology</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">Tomorrow</p>
                  <p className="text-xs text-slate-500">14:30</p>
                </div>
              </div>
              <button className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all">
                Appointment Details
              </button>
            </div>
          </div>

          {/* Documents */}
          <div className="glass-panel p-6">
            <h3 className="font-bold text-slate-800 mb-6">Recent Documents</h3>
            <div className="space-y-4">
              <DocumentItem name="Blood_analysis.pdf" date="May 12, 2024" size="1.2 MB" />
              <DocumentItem name="Prescription_Flu.pdf" date="May 05, 2024" size="450 KB" />
              <DocumentItem name="Chest_Xray.jpg" date="April 20, 2024" size="3.5 MB" />
            </div>
            <button className="w-full mt-6 py-2 text-primary text-sm font-semibold hover:bg-primary/5 rounded-lg transition-all">
              See all documents
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, id, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`sidebar-link ${active ? 'active' : ''}`}
    >
      <Icon size={20} />
      <span className="hidden lg:block">{label}</span>
    </div>
  );
}

function HealthStat({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="glass-card p-6 flex items-center gap-4">
      <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function DocumentItem({ name, date, size }) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
          <FileText size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">{name}</h4>
          <p className="text-[10px] text-slate-400">{date} • {size}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-300" />
    </div>
  );
}