import { motion } from "framer-motion";
import { useTheme } from "../components/PatientShared";
import { Icon } from "../components/PatientUI";

export default function HealthHistory() {
  const { dark } = useTheme();
  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-500" : "text-slate-400";

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
        <Icon name="history" className="w-10 h-10 text-[#2da0a8]" />
      </div>
      <h2 className={`text-2xl font-black ${textPrimary}`}>Health History</h2>
      <p className={`${textSecondary} font-bold mt-2 uppercase text-[10px] tracking-widest`}>Coming Soon • Secure Records Management</p>
    </div>
  );
}
