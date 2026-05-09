import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./DoctorShared";
import { Icon } from "./DoctorUI";
import apiService from "../../core/services/api";

export default function UserDropdown({ isOpen, onClose, handleLogout }) {
  const { dark } = useTheme();
  const menuItems = [{ icon: "user", label: "My Profile" }, { icon: "settings", label: "Settings" }, { icon: "activity", label: "Activity Log" }, { icon: "shield", label: "Security" }];
  const textPrimary = dark ? "text-gray-200" : "text-gray-700";

  return (
    <AnimatePresence>
      {isOpen && (<>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.15 }} className={`absolute right-0 top-full mt-2 w-72 ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl shadow-2xl border z-50 overflow-hidden`}>
          <div className="p-5 bg-gradient-to-r from-[#2da0a8] to-[#258a91]"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-lg">{(apiService.getUserEmail() || 'A').charAt(0).toUpperCase()}</div><div><p className="text-white font-bold">Dr. {(apiService.getUserEmail() || 'Admin').split('@')[0]}</p><p className="text-blue-200 text-xs">Medical Doctor</p></div></div></div>
          <div className="py-2">{menuItems.map((item, index) => (<button key={index} onClick={onClose} className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${dark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`}><Icon name={item.icon} className={`w-5 h-5 ${dark ? "text-gray-500" : "text-gray-400"}`} />{item.label}</button>))}</div>
          <div className={`border-t ${dark ? "border-gray-700" : "border-gray-100"}`} />
          <div className="py-2"><button onClick={handleLogout} className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${dark ? "text-red-400 hover:bg-red-900/30" : "text-red-600 hover:bg-red-50"}`}><Icon name="logout" className="w-5 h-5" />Logout</button></div>
        </motion.div>
      </>)}
    </AnimatePresence>
  );
}
