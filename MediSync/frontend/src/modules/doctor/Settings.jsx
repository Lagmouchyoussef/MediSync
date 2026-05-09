import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./DoctorShared";
import { Icon } from "./DoctorUI";

export default function Settings() {
  const { dark } = useTheme();
  const [settings, setSettings] = useState({ 
    clinicName: "Al Amal Clinic", 
    address: "123 Boulevard Mohammed V, Casablanca", 
    phone: "+212 522 123 456", 
    email: "contact@cliniquealamal.ma", 
    currency: "MAD", 
    language: "en", 
    notifications: true, 
    emailNotifications: true, 
    smsNotifications: false, 
    autoBackup: true 
  });
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  
  const handleSave = () => { 
    setSaved(true); 
    setTimeout(() => setSaved(false), 2000); 
  };

  const tabs = [
    { id: "general", label: "General", icon: "settings" }, 
    { id: "notifications", label: "Notifications", icon: "bell" }, 
    { id: "security", label: "Security", icon: "eye" }
  ];

  const cardClass = dark ? "bg-[#0a0c10] border-[#1e293b]" : "bg-white border-slate-200";
  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-400" : "text-slate-500";
  const inputClass = `w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#2da0a8] focus:border-transparent outline-none text-sm ${dark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${textPrimary}`}>Settings</h1>
          <p className={`mt-1 ${textSecondary}`}>Manage your system and personal preferences</p>
        </div>
      </div>

      <div className={`${cardClass} rounded-2xl shadow-xl border overflow-hidden flex flex-col md:flex-row min-h-[500px]`}>
        <div className={`w-full md:w-64 border-r ${dark ? "border-slate-800" : "border-slate-100"} flex flex-col`}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`flex items-center gap-3 px-6 py-5 text-sm font-bold transition-all border-b ${dark ? "border-slate-800" : "border-slate-100"} ${
                  isActive 
                    ? "bg-[#2da0a8] text-white border-l-4 border-l-white/50" 
                    : `${dark ? "text-slate-400 hover:bg-slate-900" : "text-slate-500 hover:bg-slate-50"} border-l-4 border-l-transparent`
                }`}
              >
                <Icon name={tab.icon} className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 p-8">
          {activeTab === "general" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Clinic Name</label><input type="text" value={settings.clinicName} onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })} className={inputClass} /></div>
                <div><label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Email</label><input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className={inputClass} /></div>
                <div><label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Phone</label><input type="tel" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className={inputClass} /></div>
                <div><label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Address</label><input type="text" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className={inputClass} /></div>
                <div><label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Currency</label><select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className={inputClass}><option value="MAD">MAD (Dirham)</option><option value="EUR">EUR (Euro)</option><option value="USD">USD (Dollar)</option></select></div>
                <div><label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Language</label><select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className={inputClass}><option value="en">English</option><option value="fr">Français</option><option value="ar">العربية</option></select></div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-800/10">
                <button className={`px-6 py-2.5 border rounded-xl transition-colors font-bold text-sm ${dark ? "border-slate-800 hover:bg-slate-900 text-slate-400" : "border-slate-200 hover:bg-slate-50 text-slate-500"}`}>Cancel</button>
                <button onClick={handleSave} className="px-8 py-2.5 bg-[#2da0a8] text-white rounded-xl hover:bg-[#258a91] transition-all font-bold text-sm shadow-lg shadow-teal-500/20">{saved ? "✓ Saved !" : "Save Changes"}</button>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {[{ key: "notifications", label: "Push Notifications", desc: "Receive notifications in the browser" }, { key: "emailNotifications", label: "Email Notifications", desc: "Receive email summaries" }, { key: "smsNotifications", label: "SMS Notifications", desc: "Receive SMS alerts" }, { key: "autoBackup", label: "Auto Backup", desc: "Backup data daily" }].map((item) => (
                <div key={item.key} className={`flex items-center justify-between p-5 rounded-2xl border ${dark ? "bg-slate-900/30 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                  <div><p className={`font-bold ${textPrimary}`}>{item.label}</p><p className={`text-xs ${textSecondary}`}>{item.desc}</p></div>
                  <button onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })} className={`relative w-12 h-6 rounded-full transition-colors ${settings[item.key] ? "bg-[#2da0a8]" : dark ? "bg-slate-800" : "bg-slate-300"}`}><div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${settings[item.key] ? "translate-x-6" : "translate-x-0.5"}`} /></button>
                </div>
              ))}
              <div className="flex justify-end pt-6">
                <button onClick={handleSave} className="px-8 py-2.5 bg-[#2da0a8] text-white rounded-xl hover:bg-[#258a91] transition-all font-bold text-sm shadow-lg shadow-teal-500/20">{saved ? "✓ Saved !" : "Save Preferences"}</button>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className={`p-6 rounded-2xl border ${dark ? "bg-slate-900/30 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <h3 className={`font-bold mb-4 flex items-center gap-2 ${textPrimary}`}><Icon name="eye" className="w-4 h-4" /> Change Password</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input type="password" placeholder="Current password" className={inputClass} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="password" placeholder="New password" className={inputClass} />
                    <input type="password" placeholder="Confirm new password" className={inputClass} />
                  </div>
                </div>
                <button className="mt-6 px-6 py-2.5 bg-[#2da0a8] text-white rounded-xl hover:bg-[#258a91] transition-all font-bold text-sm shadow-lg shadow-teal-500/20">Update Password</button>
              </div>
              <div className={`p-6 rounded-2xl border ${dark ? "bg-red-900/5 border-red-900/20" : "bg-red-50 border-red-100"}`}>
                <h3 className={`font-bold mb-2 flex items-center gap-2 ${dark ? "text-red-400" : "text-red-800"}`}><Icon name="alert" className="w-4 h-4" /> Danger Zone</h3>
                <p className={`text-xs mb-6 ${dark ? "text-red-900/60" : "text-red-600"}`}>These actions are irreversible. Please proceed with caution.</p>
                <div className="flex flex-wrap gap-3">
                  <button className={`px-6 py-2.5 border rounded-xl transition-colors font-bold text-sm ${dark ? "border-red-900/50 text-red-400 hover:bg-red-900/20" : "border-red-200 text-red-600 hover:bg-red-100"}`}>Reset All Data</button>
                  <button className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold text-sm">Delete Account</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
