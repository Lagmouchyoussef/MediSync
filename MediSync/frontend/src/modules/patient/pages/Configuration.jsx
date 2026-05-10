import { motion } from "framer-motion";
import { useTheme } from "../components/PatientShared";
import { Icon } from "../components/PatientUI";

export default function Configuration() {
  const { dark, toggle } = useTheme();
  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-500" : "text-slate-400";

  return (
    <div className="space-y-8">
      <div>
        <h2 className={`text-3xl font-black tracking-tight ${textPrimary}`}>Configuration</h2>
        <p className={`${textSecondary} font-bold mt-1 uppercase text-xs tracking-widest`}>Personalize your portal experience</p>
      </div>

      <div className={`p-8 rounded-[2rem] border ${dark ? "bg-[#0a0c10] border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-black ${textPrimary}`}>Appearance</h3>
            <p className={`text-xs font-bold ${textSecondary} mt-1`}>Toggle between Light and Dark mode</p>
          </div>
          <button 
            onClick={toggle}
            className={`w-14 h-7 rounded-full transition-all relative ${dark ? "bg-[#2da0a8]" : "bg-slate-300"}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${dark ? "left-8" : "left-1"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
