import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import apiService from "../../../core/services/api";
import { useTheme } from "../components/DoctorShared";
import { Icon, Modal } from "../components/DoctorUI";
import { useRef } from "react";

export default function Settings({ onProfileUpdate }) {
  const { dark, setDark } = useTheme();
  const [settings, setSettings] = useState({ 
    firstName: apiService.getUserFirstName() || "",
    lastName: apiService.getUserLastName() || "",
    profileEmail: apiService.getUserEmail() || "",
    profilePhone: "",
    dob: "",
    profileAddress: "",
    emergencyContact: "",
    emergencyPhone: "",
    specialty: apiService.getUserRole() === 'doctor' ? "General Practitioner" : "Patient",
    clinicName: "",
    address: "",
    phone: "",
    email: apiService.getUserEmail() || "",
    currency: "MAD", 
    language: "en", 
    smsNotifications: false, 
    autoBackup: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    theme: "dark",
    fontSize: "medium",
    animations: true,
    confirmDeletion: true,
    autoReminders: true
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [showImageDeleteConfirm, setShowImageDeleteConfirm] = useState(false);
  const [profileImage, setProfileImage] = useState(apiService.getUserImage() || null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const [sessionInfo, setSessionInfo] = useState({
    browser: "Detecting...",
    location: "Detecting..."
  });
  const [mobileSessionRevoked, setMobileSessionRevoked] = useState(false);
  const [passwordDate, setPasswordDate] = useState(apiService.getPasswordLastChanged() ? new Date(apiService.getPasswordLastChanged()).toLocaleDateString() : "Never");

  useEffect(() => {
    // Detect Browser & OS
    const getBrowserInfo = () => {
      const ua = navigator.userAgent;
      let browser = "Unknown Browser";
      let os = "Unknown OS";
      if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Edg")) browser = "Edge";
      else if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Safari")) browser = "Safari";
      if (ua.includes("Win")) os = "Windows";
      else if (ua.includes("Mac")) os = "macOS";
      else if (ua.includes("Linux")) os = "Linux";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("iPhone")) os = "iOS";
      return `${browser} on ${os}`;
    };

    setSessionInfo(prev => ({ ...prev, browser: getBrowserInfo() }));

    // Fetch user info for password date
    apiService.fetchCurrentUser().then(user => {
      if (user.password_last_changed) {
        setPasswordDate(new Date(user.password_last_changed).toLocaleDateString());
      }
      if (user.image) {
        setProfileImage(user.image);
      }
      setSettings(prev => ({
        ...prev,
        firstName: user.first_name || prev.firstName,
        lastName: user.last_name || prev.lastName,
        profileEmail: user.email || prev.profileEmail,
        profilePhone: user.phone || prev.profilePhone,
        profileAddress: user.address || prev.profileAddress,
        specialty: user.specialty || prev.specialty
      }));
    });

    // Try to get location from timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setSessionInfo(prev => ({ ...prev, location: tz.split('/')[1]?.replace('_', ' ') || tz }));
  }, []);
  
  const handleSave = async () => { 
    try {
      await apiService.updateProfile({
        first_name: settings.firstName,
        last_name: settings.lastName,
        phone: settings.profilePhone,
        address: settings.profileAddress,
        specialty: settings.specialty
      });
      setSaved(true); 
      setTimeout(() => setSaved(false), 2000); 
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const data = await apiService.updateProfile(formData);
      setProfileImage(data.image);
      apiService.setUserImage(data.image);
      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = null;
    }
  };

  const handleImageDelete = async () => {
    setIsUploading(true);
    setShowImageDeleteConfirm(false);
    try {
      await apiService.deleteProfileImage();
      setProfileImage(null);
      apiService.setUserImage(null);
      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await apiService.deleteAccount();
      apiService.logout();
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur lors de la suppression du compte");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    setIsChangingPassword(true);
    
    try {
      await apiService.changePassword(passwords.current, passwords.new);
      setIsChangingPassword(false);
      setShowPasswordModal(false);
      setPasswords({ current: '', new: '', confirm: '' });
      setPasswordDate(new Date().toLocaleDateString());
      alert("Mot de passe mis à jour avec succès !");
    } catch (err) {
      console.error(err);
      setIsChangingPassword(false);
      alert(err.message || "Erreur lors du changement de mot de passe");
    }
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: "user" },
    { id: "general", label: "Clinic Options", icon: "settings" }, 
    { id: "notifications", label: "Notifications", icon: "bell" }, 
    { id: "preferences", label: "Preferences", icon: "dashboard" },
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
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <div className="relative group">
                  <label 
                    htmlFor="profile-image-upload"
                    className="w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-br from-[#2da0a8] to-blue-600 shadow-xl shadow-teal-500/20 relative cursor-pointer group-hover:ring-4 group-hover:ring-teal-500/20 transition-all flex items-center justify-center"
                  >
                    <input 
                      id="profile-image-upload"
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white">
                        {settings.firstName.charAt(0)}{settings.lastName.charAt(0)}
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Icon name="plus" className="w-8 h-8 text-white/80" />
                    </div>
                  </label>
                  <div className="absolute -bottom-2 -right-2 flex flex-col gap-1">
                    <label 
                      htmlFor="profile-image-upload"
                      className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Upload New Photo"
                    >
                      <Icon name="edit" className={`w-4 h-4 ${dark ? "text-slate-400" : "text-slate-500"}`} />
                    </label>
                    {profileImage && (
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowImageDeleteConfirm(true); }}
                        className="p-2.5 bg-rose-50 dark:bg-rose-900/30 rounded-xl shadow-lg border border-rose-100 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                        title="Delete Photo"
                      >
                        <Icon name="trash" className="w-4 h-4 text-rose-500" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-center md:text-left flex-1 mt-2">
                  <h3 className={`text-2xl font-black ${textPrimary}`}>Dr. {settings.firstName} {settings.lastName}</h3>
                  <p className={`text-sm font-bold uppercase tracking-widest mt-1 ${dark ? "text-[#2da0a8]" : "text-teal-600"}`}>{settings.specialty}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>First Name</label><input type="text" placeholder="Enter your first name" value={settings.firstName} onChange={(e) => setSettings({ ...settings, firstName: e.target.value })} className={inputClass} /></div>
                <div><label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Last Name</label><input type="text" placeholder="Enter your last name" value={settings.lastName} onChange={(e) => setSettings({ ...settings, lastName: e.target.value })} className={inputClass} /></div>
                
                <div className="md:col-span-2">
                  <label className={`block text-xs font-black uppercase tracking-widest mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Email Address</label>
                  <p className={`text-[10px] mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Used for important communications</p>
                  <input type="email" placeholder="Enter your email address" value={settings.profileEmail} onChange={(e) => setSettings({ ...settings, profileEmail: e.target.value })} className={inputClass} />
                </div>

                <div><label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Phone</label><input type="tel" placeholder="Enter your phone number" value={settings.profilePhone} onChange={(e) => setSettings({ ...settings, profilePhone: e.target.value })} className={inputClass} /></div>
                <div><label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Date of Birth</label><input type="date" placeholder="jj/mm/aaaa" value={settings.dob} onChange={(e) => setSettings({ ...settings, dob: e.target.value })} className={inputClass} /></div>
                
                <div className="md:col-span-2"><label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Address</label><input type="text" placeholder="Enter your address" value={settings.profileAddress} onChange={(e) => setSettings({ ...settings, profileAddress: e.target.value })} className={inputClass} /></div>
                
                <div><label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Emergency Contact</label><input type="text" placeholder="Enter emergency contact name" value={settings.emergencyContact} onChange={(e) => setSettings({ ...settings, emergencyContact: e.target.value })} className={inputClass} /></div>
                <div><label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Emergency Phone</label><input type="tel" placeholder="Enter emergency phone number" value={settings.emergencyPhone} onChange={(e) => setSettings({ ...settings, emergencyPhone: e.target.value })} className={inputClass} /></div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-800/10">
                <button className={`px-6 py-2.5 border rounded-xl transition-colors font-bold text-sm ${dark ? "border-slate-800 hover:bg-slate-900 text-slate-400" : "border-slate-200 hover:bg-slate-50 text-slate-500"}`}>Cancel</button>
                <button onClick={handleSave} className="px-8 py-2.5 bg-[#2da0a8] text-white rounded-xl hover:bg-[#258a91] transition-all font-bold text-sm shadow-lg shadow-teal-500/20">{saved ? "✓ Saved !" : "Save Profile"}</button>
              </div>
            </motion.div>
          )}

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

          {activeTab === "preferences" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              
              {/* Language & Region */}
              <div className="space-y-4">
                <h3 className={`text-lg font-black ${textPrimary} flex items-center gap-2`}>
                  <div className="w-1.5 h-6 bg-[#2da0a8] rounded-full"></div>
                  Language & Region
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Language</label>
                    <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className={inputClass}>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Time Zone</label>
                    <select value={settings.timeZone} onChange={(e) => setSettings({ ...settings, timeZone: e.target.value })} className={inputClass}>
                      <option>Europe/Paris (UTC+1)</option>
                      <option>Africa/Casablanca (UTC+1)</option>
                      <option>America/New_York (UTC-5)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Interface */}
              <div className="space-y-4">
                <h3 className={`text-lg font-black ${textPrimary} flex items-center gap-2`}>
                  <div className="w-1.5 h-6 bg-[#2da0a8] rounded-full"></div>
                  Interface
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-widest mb-4 ${dark ? "text-slate-500" : "text-slate-400"}`}>Theme</label>
                    <div className="flex gap-3">
                      {["Light", "Dark", "Auto"].map(t => (
                        <button 
                          key={t}
                          onClick={() => {
                            setSettings({...settings, theme: t.toLowerCase()});
                            if (t === "Light") setDark(false);
                            if (t === "Dark") setDark(true);
                            if (t === "Auto") {
                              const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                              setDark(isDark);
                            }
                          }}
                          className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${
                            settings.theme === t.toLowerCase() 
                              ? "bg-[#2da0a8] text-white border-[#2da0a8] shadow-lg shadow-teal-500/20" 
                              : `${dark ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Font Size</label>
                    <select value={settings.fontSize} onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })} className={inputClass}>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Behavior */}
              <div className="space-y-4">
                <h3 className={`text-lg font-black ${textPrimary} flex items-center gap-2`}>
                  <div className="w-1.5 h-6 bg-[#2da0a8] rounded-full"></div>
                  Behavior
                </h3>
                <div className="space-y-3">
                  {[
                    { key: "animations", label: "Animations", desc: "Enable interface transitions and animations" },
                    { key: "confirmDeletion", label: "Confirmation before deletion", desc: "Always ask before deleting important items" },
                    { key: "autoReminders", label: "Automatic reminders", desc: "Send automated alerts to patients and staff" }
                  ].map(item => (
                    <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl border ${dark ? "bg-slate-900/30 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                      <div>
                        <p className={`text-sm font-bold ${textPrimary}`}>{item.label}</p>
                        <p className={`text-[10px] ${textSecondary}`}>{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })} 
                        className={`relative w-10 h-5 rounded-full transition-colors ${settings[item.key] ? "bg-[#2da0a8]" : dark ? "bg-slate-800" : "bg-slate-300"}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[item.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800/10">
                <button onClick={handleSave} className="px-8 py-2.5 bg-[#2da0a8] text-white rounded-xl hover:bg-[#258a91] transition-all font-bold text-sm shadow-lg shadow-teal-500/20">{saved ? "✓ Saved !" : "Save Preferences"}</button>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              
              {/* Password Section */}
              <div className={`p-6 rounded-2xl border flex items-center justify-between ${dark ? "bg-slate-900/30 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <div>
                  <h3 className={`font-bold text-base ${textPrimary}`}>Password</h3>
                  <p className={`text-xs mt-1 ${textSecondary}`}>Last changed: {passwordDate}</p>
                </div>
                <button onClick={() => setShowPasswordModal(true)} className={`px-5 py-2.5 border rounded-xl transition-colors font-bold text-sm ${dark ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-700"}`}>
                  Change Password
                </button>
              </div>

              {/* Two-Factor Authentication */}
              <div className={`p-6 rounded-2xl border flex items-center justify-between ${dark ? "bg-slate-900/30 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <div>
                  <h3 className={`font-bold text-base ${textPrimary}`}>Two-Factor Authentication</h3>
                  <p className={`text-xs mt-1 ${textSecondary}`}>Recommended for maximum security</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold uppercase tracking-widest ${dark ? "text-emerald-400" : "text-emerald-600"}`}>2FA enabled</span>
                  <button className={`relative w-12 h-6 rounded-full transition-colors bg-[#2da0a8]`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform translate-x-6`} />
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className={`p-6 rounded-2xl border ${dark ? "bg-slate-900/30 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <h3 className={`font-bold text-base mb-4 ${textPrimary}`}>Active Sessions</h3>
                <div className="space-y-4">
                  
                  {/* Current Browser */}
                  <div className={`flex items-center justify-between pb-4 border-b ${dark ? "border-slate-800" : "border-slate-200"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${dark ? "bg-slate-800" : "bg-white border border-slate-100"}`}>
                        <Icon name="browser" className="w-5 h-5 text-[#2da0a8]" />
                      </div>

                      <div>
                        <p className={`font-bold text-sm ${textPrimary}`}>Current browser</p>
                        <p className={`text-xs mt-0.5 ${textSecondary}`}>{sessionInfo.browser} • {sessionInfo.location}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg">Active</span>
                  </div>

                  {/* Mobile App */}
                  {!mobileSessionRevoked && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${dark ? "bg-slate-800" : "bg-white border border-slate-100"}`}>
                          <Icon name="mobile" className={`w-5 h-5 ${textSecondary}`} />
                        </div>

                        <div>
                          <p className={`font-bold text-sm ${textPrimary}`}>Mobile App</p>
                          <p className={`text-xs mt-0.5 ${textSecondary}`}>MediSync Mobile App • {sessionInfo.location}</p>
                        </div>
                      </div>
                      <button onClick={() => setMobileSessionRevoked(true)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${dark ? "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10" : "text-slate-500 hover:text-rose-600 hover:bg-rose-50"}`}>
                        Revoke
                      </button>
                    </div>
                  )}

                </div>
              </div>

              {/* Danger Zone */}
              <div className={`p-6 rounded-2xl border ${dark ? "bg-red-900/5 border-red-900/20" : "bg-red-50 border-red-100"}`}>
                <h3 className={`font-bold mb-2 flex items-center gap-2 ${dark ? "text-red-400" : "text-red-800"}`}><Icon name="alert" className="w-4 h-4" /> Danger Zone</h3>
                <p className={`text-xs mb-6 ${dark ? "text-red-900/60" : "text-red-600"}`}>This action is irreversible and will delete all your data.</p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setShowDeleteConfirm(true)} className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold text-sm">Delete Account</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal (Premium Style) */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Deletion" size="sm">
        <div className="text-center py-4 space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="trash" className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className={`text-lg font-black ${textPrimary}`}>Delete Account?</h3>
            <p className={`text-sm font-medium ${textSecondary} px-6 leading-relaxed`}>
              Are you sure you want to permanently delete your account? All clinical data and settings will be lost forever.
            </p>
          </div>
          
          <div className={`mx-4 p-4 rounded-xl border ${dark ? "bg-rose-900/10 border-rose-900/20" : "bg-rose-50 border-rose-100"} text-[11px] font-bold uppercase tracking-wider ${dark ? "text-rose-400" : "text-rose-600"}`}>
            Warning: This action is irreversible.
          </div>

          <div className="flex gap-3 pt-4 px-2">
            <button 
              onClick={() => setShowDeleteConfirm(false)}
              className={`flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${dark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
            >
              Cancel
            </button>
            <button 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="flex-1 bg-rose-600 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Current Password</label>
              <div className="relative">
                <input 
                  type={showPasswords ? "text" : "password"}
                  className={`${inputClass} pr-10`} 
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                />
                <button type="button" onClick={() => setShowPasswords(!showPasswords)} className={`absolute right-3 top-2.5 ${dark ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"}`}>
                  <Icon name={showPasswords ? "eyeOff" : "eye"} className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>New Password</label>
              <div className="relative">
                <input 
                  type={showPasswords ? "text" : "password"}
                  className={`${inputClass} pr-10`} 
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                />
                <button type="button" onClick={() => setShowPasswords(!showPasswords)} className={`absolute right-3 top-2.5 ${dark ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"}`}>
                  <Icon name={showPasswords ? "eyeOff" : "eye"} className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showPasswords ? "text" : "password"}
                  className={`${inputClass} pr-10`} 
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                />
                <button type="button" onClick={() => setShowPasswords(!showPasswords)} className={`absolute right-3 top-2.5 ${dark ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"}`}>
                  <Icon name={showPasswords ? "eyeOff" : "eye"} className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/10">
            <button 
              onClick={() => setShowPasswordModal(false)}
              className={`px-6 py-2.5 border rounded-xl transition-colors font-bold text-sm ${dark ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-500"}`}
            >
              Cancel
            </button>
            <button 
              onClick={handleChangePassword}
              disabled={isChangingPassword || !passwords.current || !passwords.new || passwords.new !== passwords.confirm}
              className={`px-6 py-2.5 bg-[#2da0a8] hover:bg-[#258a91] text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-teal-500/20 flex items-center gap-2 ${(isChangingPassword || !passwords.current || !passwords.new || passwords.new !== passwords.confirm) ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isChangingPassword ? "Saving..." : "Update Password"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Profile Image Delete Confirmation Modal (Premium Style) */}
      <Modal isOpen={showImageDeleteConfirm} onClose={() => setShowImageDeleteConfirm(false)} title="Confirm Deletion" size="sm">
        <div className="text-center py-4 space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="trash" className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className={`text-lg font-black ${textPrimary}`}>Delete your profile picture?</h3>
            <p className={`text-sm font-medium ${textSecondary} px-6 leading-relaxed`}>
              Are you sure you want to permanently delete your photo? This action cannot be undone.
            </p>
          </div>
          
          <div className="flex gap-3 pt-4 px-2">
            <button 
              onClick={() => setShowImageDeleteConfirm(false)}
              className={`flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${dark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
            >
              Cancel
            </button>
            <button 
              onClick={handleImageDelete}
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
