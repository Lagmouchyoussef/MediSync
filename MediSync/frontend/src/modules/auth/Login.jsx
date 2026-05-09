import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../shared/components/Logo";
import apiService from "../../core/services/api";

export default function Login() {
  const [active, setActive] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [role, setRole] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  const capitalizeFirst = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleFirstNameChange = (e) => {
    setFirstName(capitalizeFirst(e.target.value));
  };

  const handleLastNameChange = (e) => {
    setLastName(capitalizeFirst(e.target.value));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    try {
      const response = await apiService.login(data.get("email"), data.get("password"));
      navigate(`/${response.user.role}/dashboard`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const userData = {
      email: data.get("email"),
      password: data.get("password"),
      first_name: firstName,
      last_name: lastName,
      role: role
    };
    try {
      await apiService.register(userData);
      alert("Registration successful!");
      setActive(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await apiService.resetPassword(resetEmail);
      alert("A reset link has been sent to your email address.");
      setIsForgot(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Video */}
      <video className="absolute top-0 left-0 w-full h-full object-cover z-0" autoPlay loop muted playsInline>
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>

      <div className={`login-container ${active ? "active" : ""} relative z-30`}>
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp} className="bg-white flex flex-col items-center justify-center px-10 h-full">
            <Logo size={120} />
            <h1 className="text-2xl font-bold mt-3 mb-1">Create Account</h1>
            <div className="flex gap-2 w-full">
              <input className="input-base" placeholder="First Name" value={firstName} onChange={handleFirstNameChange} name="first_name" required />
              <input className="input-base" placeholder="Last Name" value={lastName} onChange={handleLastNameChange} name="last_name" required />
            </div>
            <input className="input-base mt-2" type="email" name="email" placeholder="Email" required />
            <div className="relative w-full mt-2">
              <input 
                className="input-base pr-10" 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Password" 
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex gap-3 mt-3">
              <button type="button" onClick={() => setRole("patient")} className={`role-pill ${role === "patient" ? "active" : ""}`}>
                <i className="fa-solid fa-user"></i> Patient
              </button>
              <button type="button" onClick={() => setRole("doctor")} className={`role-pill ${role === "doctor" ? "active" : ""}`}>
                <i className="fa-solid fa-user-doctor"></i> Doctor
              </button>
            </div>
            <button type="submit" className="btn-primary mt-4">Sign Up</button>
          </form>
        </div>

        {/* Sign In / Forgot Password Form */}
        <div className="form-container sign-in">
          {isForgot ? (
            <form onSubmit={handleResetPassword} className="bg-white flex flex-col items-center justify-center px-10 h-full">
              <Logo size={120} />
              <h1 className="text-2xl font-bold mt-4 mb-2">Forgot Password?</h1>
              <p className="text-xs text-slate-500 text-center mb-4">Enter your email address to receive a reset link.</p>
              <input 
                className="input-base" 
                type="email" 
                placeholder="Your email" 
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required 
              />
              <button type="submit" className="btn-primary mt-6 w-full">Send Reset Link</button>
              <button type="button" onClick={() => setIsForgot(false)} className="text-xs text-primary font-semibold mt-4 hover:underline">
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="bg-white flex flex-col items-center justify-center px-10 h-full">
              <Logo size={120} />
              <h1 className="text-2xl font-bold mt-3 mb-1">Login</h1>
              <input name="email" className="input-base" type="email" placeholder="Email" required />
              <div className="relative w-full mt-2">
                <input 
                  name="password" 
                  className="input-base pr-10" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="flex gap-3 mt-3">
                <button type="button" onClick={() => setRole("patient")} className={`role-pill ${role === "patient" ? "active" : ""}`}>
                  <i className="fa-solid fa-user"></i> Patient
                </button>
                <button type="button" onClick={() => setRole("doctor")} className={`role-pill ${role === "doctor" ? "active" : ""}`}>
                  <i className="fa-solid fa-user-doctor"></i> Doctor
                </button>
              </div>

              <button type="button" onClick={() => setIsForgot(true)} className="text-xs text-slate-500 mt-3 hover:text-primary transition-colors">
                Forgot Password?
              </button>

              <button type="submit" className="btn-primary mt-4">Login</button>
            </form>
          )}
        </div>

        {/* Toggle Panel */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1 className="text-white text-3xl font-bold mb-3">Welcome Back!</h1>
              <p className="text-white/90 text-sm leading-relaxed text-center">Login to access your personal space and manage your health.</p>
              <button onClick={() => {setActive(false); setIsForgot(false);}} className="mt-6 px-10 py-2.5 border-2 border-white text-white font-semibold rounded-lg uppercase text-xs tracking-wide hover:bg-white hover:text-primary transition">
                Login
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 className="text-white text-3xl font-bold mb-3">Welcome!</h1>
              <p className="text-white/90 text-sm leading-relaxed text-center">Create an account to access all MediSync services.</p>
              <button onClick={() => {setActive(true); setIsForgot(false);}} className="mt-6 px-10 py-2.5 border-2 border-white text-white font-semibold rounded-lg uppercase text-xs tracking-wide hover:bg-white hover:text-primary transition">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}