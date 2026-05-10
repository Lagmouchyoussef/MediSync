import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { useTheme } from "../components/PatientShared";
import { StatCard, Icon, Badge } from "../components/PatientUI";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function Dashboard({ onNavigate, appointments = [], notifications = [], historyCount = 0 }) {
  const { dark } = useTheme();

  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-400" : "text-slate-500";
  const cardBg = dark ? "bg-[#0a0c10] border-[#1e293b]" : "bg-white border-slate-100 shadow-sm";
  const borderColor = dark ? "border-[#1e293b]" : "border-slate-100";

  const nextVisits = appointments
    .filter(a => (a.status === "Pending" || a.status === "Accepted" || a.status === "Confirmed") && new Date(a.date) >= new Date().setHours(0,0,0,0))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);
  
  const recentAlerts = notifications.slice(0, 3);

  const stats = {
    appointments: appointments.filter(a => a.status === "Pending").length,
    history: historyCount,
    alerts: notifications.filter(n => !n.read).length
  };

  // Generate chart data from appointments or notifications
  const chartData = [
    { name: "Mon", value: 0 },
    { name: "Tue", value: 0 },
    { name: "Wed", value: 0 },
    { name: "Thu", value: 0 },
    { name: "Fri", value: 0 },
    { name: "Sat", value: 0 },
    { name: "Sun", value: 0 },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${textPrimary}`}>Dashboard Analytics</h1>
          <p className={`mt-1 font-bold ${textSecondary} uppercase text-[10px] tracking-[0.2em]`}>
            Welcome back, your health overview is ready
          </p>
        </div>
        <div className={`px-5 py-2.5 rounded-2xl border ${dark ? "bg-[#0a0c10] border-[#1e293b]" : "bg-white border-slate-100 shadow-sm"} flex items-center gap-3`}>
          <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center text-white">
            <Icon name="calendar" className="w-4 h-4" />
          </div>
          <span className={`text-[13px] font-black ${textPrimary}`}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="calendar" label="Pending Appointments" value={stats.appointments.toString()} color="bg-blue-500" delay={0} onClick={() => onNavigate("appointments")} />
        <StatCard icon="heart" label="Health Records" value={stats.history.toString()} color="bg-emerald-500" delay={0.1} onClick={() => onNavigate("history")} />
        <StatCard icon="history" label="Recent Activity" value={stats.history.toString()} color="bg-purple-500" delay={0.2} onClick={() => onNavigate("history")} />
        <StatCard icon="bell" label="Unread Alerts" value={stats.alerts.toString()} color="bg-orange-500" delay={0.3} />
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className={`lg:col-span-2 ${cardBg} rounded-[2.5rem] border p-8 relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Icon name="activity" className="w-24 h-24" />
          </div>
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className={`text-xl font-black tracking-tight ${textPrimary}`}>Health Activity Trends</h3>
              <p className={`text-[11px] font-black uppercase tracking-widest mt-1 ${textSecondary}`}>Weekly performance overview</p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${dark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
              Last 7 Days
            </div>
          </div>

          <div className="h-[350px] w-full flex items-center justify-center">
            {stats.history > 0 || appointments.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2da0a8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2da0a8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={dark ? "#1e293b" : "#f1f5f9"} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: textSecondary, fontSize: 11, fontWeight: 700}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: dark ? '#0f172a' : '#fff', 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }} 
                  />
                  <Area type="monotone" dataKey="value" stroke="#2da0a8" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center opacity-40">
                <Icon name="activity" className="w-12 h-12 mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">No activity data yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Side Section: Upcoming Visits */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.5 }}
          className={`${cardBg} rounded-[2.5rem] border p-8 flex flex-col`}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-lg font-black tracking-tight ${textPrimary}`}>Next Visits</h3>
            <button onClick={() => onNavigate("appointments")} className={`text-[10px] font-black uppercase tracking-widest text-[#2da0a8] hover:underline`}>View All</button>
          </div>

          <div className="space-y-4 flex-1">
            {nextVisits.length > 0 ? nextVisits.map((apt, idx) => (
              <div key={idx} onClick={() => onNavigate("appointments")} className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer ${dark ? "bg-[#0a0c10] border-[#1e293b] hover:bg-slate-800" : "bg-slate-50 border-slate-100 hover:bg-white hover:shadow-md"}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2da0a8]/10 text-[#2da0a8] flex items-center justify-center font-black text-xs">
                    {apt.doctor?.charAt(0) || "D"}
                  </div>
                  <div>
                    <p className={`text-[13px] font-black ${textPrimary}`}>{apt.doctor}</p>
                    <p className={`text-[10px] font-bold ${textSecondary}`}>{apt.specialty || apt.type}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={apt.type === "Urgency" ? "danger" : "info"}>{new Date(apt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</Badge>
                  <span className={`text-[11px] font-black ${textPrimary}`}>{apt.time}</span>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full opacity-50 py-10 text-center">
                <Icon name="calendar" className="w-12 h-12 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">No upcoming visits</p>
              </div>
            )}
          </div>

          <button onClick={() => onNavigate("appointments")} className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-[#2da0a8] to-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-500/20 active:scale-95 transition-all">
            Book New Visit
          </button>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className={`${cardBg} rounded-[2rem] border p-8`}>
          <h3 className={`text-lg font-black tracking-tight ${textPrimary} mb-6`}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: "history", label: "Reports", icon: "dashboard", color: "bg-blue-500" },
              { id: "dashboard", label: "Messages", icon: "bell", color: "bg-[#2da0a8]" },
              { id: "settings", label: "Profile", icon: "user", color: "bg-purple-500" },
              { id: "history", label: "Support", icon: "history", color: "bg-emerald-500" }
            ].map((act, idx) => (
              <button key={idx} onClick={() => onNavigate(act.id)} className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${dark ? "bg-[#0a0c10] border-[#1e293b] hover:bg-slate-800" : "bg-slate-50 border-slate-200 hover:bg-white hover:shadow-md shadow-inner group"}`}>
                <div className={`w-10 h-10 rounded-xl ${act.color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
                  <Icon name={act.icon} className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${textPrimary}`}>{act.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Health Stats - Empty state if no data */}
        <div className={`${cardBg} rounded-[2rem] border p-8 flex flex-col items-center justify-center`}>
          <h3 className={`text-lg font-black tracking-tight ${textPrimary} mb-4 w-full text-left`}>Health Stats</h3>
          {stats.history > 0 ? (
            <>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{value: 100}]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      <Cell fill="#3b82f6" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="text-[10px] font-black uppercase text-slate-500">Reports</span></div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 opacity-40 text-center">
              <Icon name="heart" className="w-12 h-12 mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest">No stats available</p>
            </div>
          )}
        </div>

        {/* Recent Notifications Snippet */}
        <div className={`${cardBg} rounded-[2rem] border p-8`}>
          <h3 className={`text-lg font-black tracking-tight ${textPrimary} mb-6`}>Recent Alerts</h3>
          <div className="space-y-4">
            {recentAlerts.length > 0 ? recentAlerts.map((notif, idx) => (
              <div key={idx} onClick={() => onNavigate("dashboard")} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer ${dark ? "bg-[#0a0c10]" : "bg-slate-50"} border ${borderColor} hover:border-[#2da0a8] transition-colors`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${notif.type === 'security' ? 'bg-rose-500' : 'bg-[#2da0a8]'} text-white`}>
                  <Icon name={notif.type === 'security' ? 'shield' : 'bell'} className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className={`text-[12px] font-black ${textPrimary} truncate w-40`}>{notif.title}</p>
                  <p className={`text-[10px] font-bold ${textSecondary}`}>{new Date(notif.date || notif.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center opacity-50 py-10 text-center">
                <Icon name="bell" className="w-12 h-12 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">No recent alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
