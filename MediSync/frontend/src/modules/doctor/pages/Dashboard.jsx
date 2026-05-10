import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../components/DoctorShared";
import { StatCard, Icon, Modal } from "../components/DoctorUI";

export default function Dashboard({ 
  patientsCount = 0, 
  appointmentCount = 0, 
  historyCount = 0, 
  notificationsCount = 0, 
  upcomingAppointments = [],
  onDeleteAppointment
}) {
  const { dark } = useTheme();
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-400" : "text-slate-500";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${textPrimary}`}>Dashboard</h1>
          <p className={`mt-1 ${textSecondary}`}>Welcome to your medical system</p>
        </div>
        <span className={`hidden sm:block text-sm ${textSecondary}`}>
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
            <h3 className={`text-lg font-semibold ${textPrimary}`}>Upcoming Appointments</h3>
            <p className={`text-sm ${textSecondary}`}>Your next scheduled appointments are shown here.</p>
          </div>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${dark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${dark ? "bg-slate-800 text-teal-400" : "bg-teal-50 text-teal-600"}`}>
                    <Icon name="calendar" className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{appointment.patient || "Patient"}</p>
                    <p className={`text-xs ${textSecondary}`}>{appointment.type || "Appointment"} • {appointment.date || "Date not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{appointment.time || "—"}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${appointment.status === 'Accepted' ? 'text-emerald-500' : 'text-amber-500'}`}>{appointment.status || "Status unavailable"}</p>
                  </div>
                  <button 
                    onClick={() => setDeleteConfirm({ isOpen: true, id: appointment.id })}
                    className={`p-2 rounded-xl border transition-all ${dark ? "border-slate-800 hover:bg-rose-900/30 text-rose-400" : "border-slate-100 hover:bg-rose-50 text-rose-500"}`}
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
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
