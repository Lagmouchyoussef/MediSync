import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Search, 
  Bell,
  Activity,
  TrendingUp,
  UserCheck,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import apiService from "../../core/services/api";
import Logo from "../../shared/components/Logo";

const data = [
  { name: 'Mon', patients: 12 },
  { name: 'Tue', patients: 19 },
  { name: 'Wed', patients: 15 },
  { name: 'Thu', patients: 22 },
  { name: 'Fri', patients: 30 },
  { name: 'Sat', patients: 10 },
  { name: 'Sun', patients: 5 },
];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!apiService.isAuthenticated() || apiService.getUserRole() !== 'doctor') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    apiService.logout();
    navigate('/');
  };

  const SidebarItem = ({ icon: Icon, label, id }) => (
    <div 
      onClick={() => setActiveTab(id)}
      className={`sidebar-link ${activeTab === id ? 'active' : ''}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f4f7fb]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <Logo size={40} />
          <span className="text-xl font-bold text-slate-800 tracking-tight">MediSync</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" id="dashboard" />
          <SidebarItem icon={Users} label="My Patients" id="patients" />
          <SidebarItem icon={Calendar} label="Appointments" id="appointments" />
          <SidebarItem icon={MessageSquare} label="Messages" id="messages" />
          <div className="pt-6 mt-6 border-t border-slate-100">
            <SidebarItem icon={Settings} label="Settings" id="settings" />
          </div>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Hello, Dr. {apiService.getUserEmail().split('@')[0]}</h1>
            <p className="text-slate-500 text-sm">Here is an overview of your activity today.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:border-primary w-64"
              />
            </div>
            <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={Users} title="Total Patients" value="1,284" change="+12%" trend="up" />
          <StatCard icon={Calendar} title="Today's Appts" value="18" change="-2" trend="down" />
          <StatCard icon={Clock} title="Consult. Hours" value="42h" change="+5h" trend="up" />
          <StatCard icon={TrendingUp} title="Efficiency" value="94%" change="+3%" trend="up" />
        </div>

        {/* Charts & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 glass-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Patient Attendance</h3>
              <select className="bg-slate-50 border-none text-xs font-semibold text-slate-500 rounded-lg p-1 outline-none">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="patients" fill="#2da0a8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Info */}
          <div className="glass-panel p-6">
            <h3 className="font-bold text-slate-800 mb-6">Recent Messages</h3>
            <div className="space-y-4">
              <MessageItem name="Sophie Martin" msg="I'd like to reschedule my appt..." time="10 min" />
              <MessageItem name="Thomas Bernard" msg="Thanks for the prescription." time="1h" />
              <MessageItem name="Lucas Dubois" msg="Can I take an appointment..." time="3h" />
            </div>
            <button className="w-full mt-6 py-2 text-primary text-sm font-semibold hover:bg-primary/5 rounded-lg transition-all">
              See all messages
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, change, trend }) {
  return (
    <div className="glass-card p-6 hover:shadow-lg transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-all">
          <Icon size={24} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {change}
        </span>
      </div>
      <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}

function MessageItem({ name, msg, time }) {
  return (
    <div className="flex gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-all">
      <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h4 className="text-sm font-bold text-slate-800 truncate">{name}</h4>
          <span className="text-[10px] text-slate-400">{time}</span>
        </div>
        <p className="text-xs text-slate-500 truncate">{msg}</p>
      </div>
    </div>
  );
}