import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./DoctorShared";
import { Icon } from "./DoctorUI";

export default function NotificationDropdown({ notifications, onMarkRead, onMarkAllRead, onDismiss, isOpen, onClose }) {
  const { dark } = useTheme();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const getNotifIcon = (type) => ({ appointment: "calendar", patient: "users", alert: "alert", payment: "currency", system: "settings", security: "shield" }[type] || "bell");
  const getNotifColor = (type) => { const c = { appointment: dark ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600", patient: dark ? "bg-green-900 text-green-300" : "bg-green-100 text-green-600", alert: dark ? "bg-red-900 text-red-300" : "bg-red-100 text-red-600", payment: dark ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-600", system: dark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600", security: dark ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-600" }; return c[type] || c.system; };
  const getTimeAgo = (dateStr) => { const now = new Date(); const date = new Date(dateStr); const diff = Math.floor((now - date) / 1000); if (diff < 60) return "Just now"; if (diff < 3600) return `${Math.floor(diff / 60)} min ago`; if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`; return `${Math.floor(diff / 86400)}d ago`; };
  const textPrimary = dark ? "text-white" : "text-gray-800";
  const textSecondary = dark ? "text-gray-400" : "text-gray-500";

  return (
    <AnimatePresence>
      {isOpen && (<>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.15 }} className={`absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] ${dark ? "bg-[#0a0c10] border-[#1e293b]" : "bg-white border-slate-100"} rounded-2xl shadow-2xl border z-50 overflow-hidden`}>
          <div className="bg-gradient-to-r from-[#2da0a8] to-[#20838a] px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                  <Icon name="bell" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">Notifications</h3>
                  <p className="text-teal-50/70 text-[11px] font-medium">
                    {unreadCount > 0 ? `${unreadCount} notifications non lues` : "Tout est à jour !"}
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button onClick={onMarkAllRead} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white text-[10px] font-black uppercase tracking-wider transition-all">
                  Marquer tout comme lu
                </button>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${dark ? "bg-slate-900" : "bg-slate-50"}`}>
                  <Icon name="bell" className={`w-8 h-8 ${dark ? "text-slate-700" : "text-slate-200"}`} />
                </div>
                <p className={textSecondary}>Aucune notification</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <motion.div 
                  key={notif.id} 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  className={`relative border-b transition-all duration-300 ${dark ? "border-slate-800/50 hover:bg-slate-900/50" : "border-slate-50 hover:bg-slate-50/50"} ${notif.read ? "opacity-60" : ""}`}
                >
                  {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2da0a8] rounded-r-full shadow-[2px_0_8px_rgba(45,160,168,0.4)]" />}
                  <div className="p-4 pl-5">
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${getNotifColor(notif.type)}`}>
                        <Icon name={getNotifIcon(notif.type)} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notif.read ? textSecondary : `${textPrimary} font-bold`}`}>{notif.title}</p>
                        <p className={`text-[11px] mt-0.5 leading-relaxed ${dark ? "text-slate-500" : "text-slate-500"}`}>{notif.message}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <p className={`text-[10px] font-medium ${dark ? "text-slate-600" : "text-slate-400"}`}>{getTimeAgo(notif.date)}</p>
                          {!notif.read && <span className="w-1 h-1 bg-[#2da0a8] rounded-full"></span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pl-13">
                      {!notif.read && (
                        <button onClick={() => onMarkRead(notif.id)} className="text-[11px] text-[#2da0a8] hover:text-[#20838a] font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider">
                          <Icon name="checkAll" className="w-3.5 h-3.5" />
                          Marquer comme lu
                        </button>
                      )}
                      <button onClick={() => onDismiss(notif.id)} className={`text-[11px] font-bold flex items-center gap-1.5 transition-colors ml-auto uppercase tracking-wider ${dark ? "text-slate-600 hover:text-rose-400" : "text-slate-400 hover:text-rose-500"}`}>
                        <Icon name="close" className="w-3.5 h-3.5" />
                        Masquer
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className={`p-4 border-t text-center ${dark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50/50 border-slate-100"}`}>
              <button className="text-xs text-[#2da0a8] hover:text-[#20838a] font-black uppercase tracking-widest transition-all">
                Voir toutes les notifications
              </button>
            </div>
          )}
        </motion.div>
      </>)}
    </AnimatePresence>
  );
}
