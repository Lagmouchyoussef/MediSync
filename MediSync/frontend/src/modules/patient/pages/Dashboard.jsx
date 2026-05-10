import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme, patientData, healthStats } from "../components/PatientShared";
import { Icon, Badge, StatCard } from "../components/PatientUI";

export default function Dashboard() {
  const { dark } = useTheme();
  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-500" : "text-slate-400";
  const gridColor = dark ? "#1e293b" : "#f1f5f9";

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#2da0a8] to-blue-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className={`relative rounded-[2rem] p-8 ${dark ? "bg-[#0a0c10] border-slate-800" : "bg-white border-slate-100 shadow-sm"} border overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2da0a8]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#2da0a8] to-blue-600 rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-[#2da0a8]/20 border-4 border-white/10">
                {patientData.avatar}
              </div>
              <div>
                <h1 className={`text-3xl font-black tracking-tight ${textPrimary}`}>Hello, {patientData.name} 👋</h1>
                <p className={`${textSecondary} font-bold mt-1 uppercase text-xs tracking-widest`}>MediSync Patient Portal • ID: PAT-1234</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`text-right hidden sm:block`}>
                <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Blood Type</p>
                <p className={`text-xl font-black text-red-500`}>{patientData.bloodType}</p>
              </div>
              <div className={`w-px h-10 ${dark ? "bg-slate-800" : "bg-slate-100"}`}></div>
              <Badge variant="info">Record Up to Date</Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="calendar" label="Upcoming Apps" value="3" color="bg-[#2da0a8]" delay={0.1} />
        <StatCard icon="history" label="History" value="12" color="bg-emerald-500" delay={0.2} />
        <StatCard icon="settings" label="Config" value="Active" color="bg-purple-500" delay={0.3} />
        <StatCard icon="bell" label="Alerts" value="1" color="bg-amber-500" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={`lg:col-span-2 ${dark ? "bg-[#0a0c10] border-slate-800" : "bg-white border-slate-100 shadow-sm"} border rounded-[2rem] p-8`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className={`text-xl font-black tracking-tight ${textPrimary}`}>Health Tracking</h3>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSecondary} mt-1`}>Indicators over last 6 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={healthStats}>
              <defs>
                <linearGradient id="colorTension" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2da0a8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2da0a8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" stroke={textSecondary} fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
              <YAxis stroke={textSecondary} fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: "1rem", 
                  border: "none", 
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)", 
                  backgroundColor: dark ? "#0a0c10" : "#fff", 
                  color: dark ? "#fff" : "#000",
                  fontSize: "12px",
                  fontWeight: "bold"
                }} 
              />
              <Area type="monotone" dataKey="tension" stroke="#2da0a8" strokeWidth={4} fillOpacity={1} fill="url(#colorTension)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className={`${dark ? "bg-[#0a0c10] border-slate-800" : "bg-white border-slate-100 shadow-sm"} border rounded-[2rem] p-8`}>
          <h3 className={`text-xl font-black tracking-tight mb-6 ${textPrimary}`}>Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#2da0a8] to-[#20838a] text-white font-black text-sm shadow-xl shadow-[#2da0a8]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Book Appointment
            </button>
            <button className={`w-full py-4 rounded-2xl border ${dark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"} font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all`}>
              Download Records
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
