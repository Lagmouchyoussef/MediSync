import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar 
} from "recharts";
import { useTheme, COLORS, monthlyRevenue, appointmentTypes, dailyPatients, mockAppointments } from "./DoctorShared";
import { StatCard, Badge } from "./DoctorUI";

export default function Dashboard() {
  const { dark } = useTheme();
  const chartTextColor = dark ? "#9ca3af" : "#9ca3af";
  const gridColor = dark ? "#374151" : "#f0f0f0";
  const tooltipStyle = { borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", backgroundColor: dark ? "#1f2937" : "#fff", color: dark ? "#fff" : "#000" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-800"}`}>Dashboard</h1>
          <p className={`mt-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>Welcome to your medical system</p>
        </div>
        <span className={`hidden sm:block text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="patients" label="Total Patients" value="1,247" change={12} color="bg-blue-500" delay={0} />
        <StatCard icon="calendar" label="Today's Appointments" value="23" change={8} color="bg-green-500" delay={0.1} />
        <StatCard icon="currency" label="Monthly Revenue" value="45,800 DH" change={15} color="bg-yellow-500" delay={0.2} />
        <StatCard icon="heart" label="Consultations" value="342" change={-3} color="bg-purple-500" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`lg:col-span-2 ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl p-6 shadow-sm border`}>
          <h3 className={`text-lg font-semibold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2da0a8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2da0a8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={chartTextColor} fontSize={12} />
              <YAxis stroke={chartTextColor} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} DH`, "Revenue"]} />
              <Area type="monotone" dataKey="amount" stroke="#2da0a8" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl p-6 shadow-sm border`}>
          <h3 className={`text-lg font-semibold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>Appointment Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={appointmentTypes} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {appointmentTypes.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {appointmentTypes.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={`${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl p-6 shadow-sm border`}>
          <h3 className={`text-lg font-semibold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>Patients per Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyPatients}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="day" stroke={chartTextColor} fontSize={12} />
              <YAxis stroke={chartTextColor} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, "Patients"]} />
              <Bar dataKey="patients" fill="#2da0a8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className={`${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl p-6 shadow-sm border`}>
          <h3 className={`text-lg font-semibold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>Upcoming Appointments</h3>
          <div className="space-y-3">
            {mockAppointments.slice(0, 5).map((apt) => (
              <div key={apt.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${dark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{apt.patient.charAt(0)}</span>
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${dark ? "text-gray-200" : "text-gray-800"}`}>{apt.patient}</p>
                    <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{apt.type} - {apt.doctor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-800"}`}>{apt.time}</p>
                  <Badge variant={apt.status === "Confirmed" ? "success" : apt.status === "Pending" ? "warning" : "danger"}>{apt.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
