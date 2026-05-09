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
        <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.15 }} className={`absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl shadow-2xl border z-50 overflow-hidden`}>
          <div className="bg-gradient-to-r from-[#2da0a8] to-[#258a91] px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="p-2 bg-white bg-opacity-20 rounded-xl"><Icon name="bell" className="w-5 h-5 text-white" /></div><div><h3 className="text-white font-bold text-lg">Notifications</h3><p className="text-blue-200 text-xs">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All up to date!"}</p></div></div>
              {unreadCount > 0 && (<button onClick={onMarkAllRead} className="flex items-center gap-1.5 px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white text-xs font-medium transition-colors"><Icon name="checkAll" className="w-3.5 h-3.5" />Mark All Read</button>)}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (<div className="py-12 text-center"><div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${dark ? "bg-gray-700" : "bg-gray-100"}`}><Icon name="bell" className={`w-8 h-8 ${dark ? "text-gray-500" : "text-gray-300"}`} /></div><p className={textSecondary}>No notifications</p></div>) : notifications.map((notif) => (<motion.div key={notif.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`relative border-b transition-colors hover:bg-opacity-50 ${dark ? "border-gray-700 hover:bg-gray-700" : "border-gray-50 hover:bg-gray-50"} ${notif.read ? "opacity-70" : ""}`}>
              {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2da0a8] rounded-r-full" />}
              <div className="p-4 pl-5"><div className="flex gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotifColor(notif.type)}`}><Icon name={getNotifIcon(notif.type)} className="w-5 h-5" /></div><div className="flex-1 min-w-0"><p className={`text-sm ${notif.read ? textSecondary : `${textPrimary} font-semibold`}`}>{notif.title}</p><p className={`text-xs mt-0.5 leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}>{notif.message}</p><p className={`text-xs mt-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>{getTimeAgo(notif.date)}</p></div></div><div className="flex gap-2 mt-2 pl-13">{!notif.read && (<button onClick={() => onMarkRead(notif.id)} className="text-xs text-[#2da0a8] hover:text-[#258a91] font-medium flex items-center gap-1 transition-colors"><Icon name="markRead" className="w-3.5 h-3.5" />Mark as read</button>)}<button onClick={() => onDismiss(notif.id)} className={`text-xs font-medium flex items-center gap-1 transition-colors ml-auto ${dark ? "text-gray-500 hover:text-red-400" : "text-gray-400 hover:text-red-500"}`}><Icon name="close" className="w-3.5 h-3.5" /></button></div></div>
            </motion.div>))}
          </div>
          {notifications.length > 0 && (<div className={`p-3 border-t text-center ${dark ? "bg-gray-700 border-gray-700" : "bg-gray-50 border-gray-100"}`}><button className="text-sm text-[#2da0a8] hover:text-[#258a91] font-medium transition-colors">See all notifications</button></div>)}
        </motion.div>
      </>)}
    </AnimatePresence>
  );
}
