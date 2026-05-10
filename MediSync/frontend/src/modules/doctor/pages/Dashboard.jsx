import { useState } from "react";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { useTheme } from "../components/DoctorShared";
import { StatCard, Icon, Modal } from "../components/DoctorUI";

const QuickAction = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-3 group">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300`}>
      <Icon name={icon} className="w-6 h-6" />
    </div>
    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-[#2da0a8] transition-colors">{label}</span>
  </button>
);

export default function Dashboard({ 
  patientsCount = 0, 
  appointmentCount = 0, 
  historyCount = 0, 
  notificationsCount = 0, 
  upcomingAppointments = [],
  history = [],
  onDeleteAppointment,
  onNavigate
}) {
  const { dark } = useTheme();
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-400" : "text-slate-500";
  const cardClass = `${dark ? "bg-[#0a0c10] border-[#1e293b]" : "bg-white border-slate-100 shadow-sm"} rounded-[2rem] border p-8`;

  // Process appointment types distribution from real data
  const typeCounts = upcomingAppointments.reduce((acc, curr) => {
    const type = curr.type || 'Consultation';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const appointmentTypes = Object.keys(typeCounts).length > 0 
    ? Object.entries(typeCounts).map(([name, count]) => ({
        name,
        value: Math.round((count / upcomingAppointments.length) * 100)
      }))
    : [];

  const COLORS = ['#2da0a8', '#3b82f6', '#8b5cf6', '#f59e0b'];

  // Process patient activity from history
  const activityByDay = history.reduce((acc, curr) => {
    const day = new Date(curr.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const patientActivityData = days.map(day => ({
    name: day,
    patients: activityByDay[day] || 0
  }));

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${textPrimary}`}>Medical Analytics</h1>
          <p className={`${textSecondary} text-sm font-bold uppercase tracking-widest mt-1`}>System Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border ${dark ? "bg-slate-900/50 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500"} text-xs font-black uppercase tracking-widest`}>
            {new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
          </div>
          <button className="bg-[#2da0a8] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#20838a] transition-all shadow-lg shadow-teal-500/20 active:scale-95">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="patients" label="Total Patients" value={String(patientsCount)} color="bg-blue-500" delay={0} />
        <StatCard icon="calendar" label="Today's Appointments" value={String(appointmentCount)} color="bg-emerald-500" delay={0.1} />
        <StatCard icon="history" label="Activity Records" value={String(historyCount)} color="bg-purple-500" delay={0.2} />
        <StatCard icon="bell" label="Unread Notifications" value={String(notificationsCount)} color="bg-[#2da0a8]" delay={0.3} />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Volume Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`${cardClass} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className={`text-xl font-black ${textPrimary}`}>Patient Activity</h3>
              <p className={`${textSecondary} text-xs font-bold mt-1`}>Weekly patient volume trends</p>
            </div>
            <select className={`bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest ${textSecondary}`}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            {patientActivityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={patientActivityData}>
                  <defs>
                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2da0a8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2da0a8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={dark ? "#1e293b" : "#f1f5f9"} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: textSecondary, fontSize: 10, fontWeight: 800}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: textSecondary, fontSize: 10, fontWeight: 800}} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: dark ? '#0a0c10' : '#fff', 
                      border: 'none', 
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                      fontWeight: '800'
                    }} 
                  />
                  <Area type="monotone" dataKey="patients" stroke="#2da0a8" strokeWidth={4} fillOpacity={1} fill="url(#colorPatients)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <Icon name="activity" className={`w-12 h-12 mx-auto mb-3 ${dark ? "text-slate-800" : "text-slate-100"}`} />
                <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>No activity data available</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Appointment Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={cardClass}>
          <div className="mb-8">
            <h3 className={`text-xl font-black ${textPrimary}`}>Appointment Types</h3>
            <p className={`${textSecondary} text-xs font-bold mt-1`}>Distribution of services</p>
          </div>
          <div className="h-[220px] w-full flex items-center justify-center">
            {appointmentTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={appointmentTypes} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {appointmentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <Icon name="calendar" className={`w-12 h-12 mx-auto mb-3 ${dark ? "text-slate-800" : "text-slate-100"}`} />
                <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>No data</p>
              </div>
            )}
          </div>
          <div className="mt-6 space-y-3">
            {appointmentTypes.length > 0 ? appointmentTypes.map((type, index) => (
              <div key={type.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className={`text-[11px] font-bold ${textSecondary}`}>{type.name}</span>
                </div>
                <span className={`text-[11px] font-black ${textPrimary}`}>{type.value}%</span>
              </div>
            )) : (
              <p className={`text-[10px] text-center font-bold ${textSecondary} italic`}>Waiting for appointments...</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className={cardClass}>
          <div className="mb-8">
            <h3 className={`text-xl font-black ${textPrimary}`}>Quick Actions</h3>
            <p className={`${textSecondary} text-xs font-bold mt-1`}>Manage clinic tasks efficiently</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <QuickAction icon="plus" label="Invite" color="bg-teal-500" onClick={() => onNavigate("appointments")} />
            <QuickAction icon="patients" label="Records" color="bg-blue-500" onClick={() => onNavigate("patients")} />
            <QuickAction icon="user" label="Profile" color="bg-purple-500" onClick={() => onNavigate("settings")} />
            <QuickAction icon="settings" label="Config" color="bg-slate-500" onClick={() => onNavigate("settings")} />
            <QuickAction icon="bell" label="Alerts" color="bg-orange-500" onClick={() => {}} />
            <QuickAction icon="history" label="Logs" color="bg-indigo-500" onClick={() => onNavigate("history")} />
          </div>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className={`${cardClass} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className={`text-xl font-black ${textPrimary}`}>Upcoming Appointments</h3>
              <p className={`${textSecondary} text-xs font-bold mt-1`}>Next scheduled consultations</p>
            </div>
            <button onClick={() => onNavigate("appointments")} className={`text-[10px] font-black uppercase tracking-widest text-[#2da0a8] hover:underline`}>View All</button>
          </div>

          <div className="space-y-4">
            {upcomingAppointments.length > 0 ? upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${dark ? "bg-slate-900/40 border-slate-800 hover:border-[#2da0a8]/50" : "bg-slate-50/50 border-slate-100 hover:border-[#2da0a8]/50"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br from-[#2da0a8] to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md`}>
                    {appointment.patient?.charAt(0) || "P"}
                  </div>
                  <div>
                    <p className={`text-sm font-black ${textPrimary}`}>{appointment.patient}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>{appointment.type}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#2da0a8]">{appointment.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-black ${textPrimary}`}>{appointment.time}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${appointment.status === 'Accepted' ? 'text-emerald-500' : 'text-amber-500'}`}>{appointment.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${dark ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" : "bg-white text-slate-500 hover:bg-slate-100 shadow-sm"}`}>
                      <Icon name="eye" className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm({ isOpen: true, id: appointment.id })}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${dark ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white" : "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white shadow-sm"}`}
                    >
                      <Icon name="trash" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center">
                <Icon name="calendar" className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>No upcoming appointments</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ isOpen: false, id: null })} title="Confirm Deletion" size="sm">
        <div className="text-center py-4 space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="trash" className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className={`text-lg font-black ${textPrimary}`}>Delete Appointment?</h3>
            <p className={`text-sm font-medium ${textSecondary} px-4 leading-relaxed`}>
              Permanently delete this appointment from your dashboard?
            </p>
          </div>
          <div className="flex gap-3 pt-4 px-2">
            <button 
              onClick={() => setDeleteConfirm({ isOpen: false, id: null })}
              className={`flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${dark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onDeleteAppointment(deleteConfirm.id);
                setDeleteConfirm({ isOpen: false, id: null });
              }}
              className="flex-1 bg-rose-600 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
