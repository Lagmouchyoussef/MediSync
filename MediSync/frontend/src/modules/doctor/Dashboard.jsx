import { motion } from "framer-motion";
import { useTheme } from "./DoctorShared";
import { StatCard } from "./DoctorUI";

export default function Dashboard({ patientsCount = 0, appointmentCount = 0, historyCount = 0, notificationsCount = 0, upcomingAppointments = [] }) {
  const { dark } = useTheme();

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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon="patients" label="Total Patients" value={String(patientsCount)} color="bg-blue-500" delay={0} />
        <StatCard icon="calendar" label="Today's Appointments" value={String(appointmentCount)} color="bg-emerald-500" delay={0.1} />
        <StatCard icon="history" label="Activity Records" value={String(historyCount)} color="bg-purple-500" delay={0.2} />
        <StatCard icon="bell" label="Unread Notifications" value={String(notificationsCount)} color="bg-[#2da0a8]" delay={0.3} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl p-6 shadow-sm border`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-semibold ${dark ? "text-white" : "text-gray-800"}`}>Upcoming Appointments</h3>
            <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>Your next scheduled appointments are shown here.</p>
          </div>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${dark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"}`}>
                <div>
                  <p className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{appointment.patient || "Patient"}</p>
                  <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{appointment.type || "Appointment"} • {appointment.date || "Date not set"}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{appointment.time || "—"}</p>
                  <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{appointment.status || "Status unavailable"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-slate-500">
            No upcoming appointments are available yet.
          </div>
        )}
      </motion.div>
    </div>
  );
}
