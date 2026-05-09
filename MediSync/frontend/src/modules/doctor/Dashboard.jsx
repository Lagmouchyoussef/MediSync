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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard icon="patients" label="Total Patients" value="1,247" change={12} color="bg-blue-500" delay={0} />
        <StatCard icon="calendar" label="Today's Appointments" value="23" change={8} color="bg-emerald-500" delay={0.1} />
        <StatCard icon="heart" label="Consultations" value="342" change={-3} color="bg-purple-500" delay={0.2} />
        <StatCard icon="messages" label="Doctor Invitations" value="156" change={24} color="bg-[#2da0a8]" delay={0.3} />
        <StatCard icon="patients" label="Patient Requests" value="89" change={12} color="bg-amber-500" delay={0.4} />
        <StatCard icon="alert" label="Emergencies" value="14" change={5} color="bg-rose-600" delay={0.5} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl p-6 shadow-sm border`}>
          <h3 className={`text-lg font-semibold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>Appointment Types</h3>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 w-full" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={appointmentTypes} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {appointmentTypes.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap lg:flex-col gap-4 justify-center">
              {appointmentTypes.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index] }} />
                  <div>
                    <p className={`text-sm font-bold ${dark ? "text-gray-200" : "text-gray-700"}`}>{item.name}</p>
                    <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{item.value} cases</p>
                  </div>
                </div>
              ))}
            </div>
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
