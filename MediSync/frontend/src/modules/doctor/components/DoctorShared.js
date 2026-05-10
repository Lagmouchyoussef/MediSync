import { createContext, useContext } from "react";

export const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

export const COLORS = ["#2da0a8", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export const getPatientId = (p) => {
  if (!p) return "";
  return `PAT-${String(p.id).padStart(4, "0")}-${new Date(p.date || new Date()).getFullYear()}`;
};

export const mockPatients = [];

export const mockAppointments = [];

export const monthlyRevenue = [
  { month: "Jan", amount: 12500 }, { month: "Feb", amount: 15800 }, { month: "Mar", amount: 18200 },
  { month: "Apr", amount: 14600 }, { month: "May", amount: 21300 }, { month: "Jun", amount: 19700 },
  { month: "Jul", amount: 22100 }, { month: "Aug", amount: 17800 }, { month: "Sep", amount: 20400 },
  { month: "Oct", amount: 23500 }, { month: "Nov", amount: 19200 }, { month: "Dec", amount: 25800 },
];

export const dailyPatients = [
  { day: "Mon", patients: 12 }, { day: "Tue", patients: 18 }, { day: "Wed", patients: 15 },
  { day: "Thu", patients: 22 }, { day: "Fri", patients: 19 }, { day: "Sat", patients: 8 }, { day: "Sun", patients: 3 },
];

export const appointmentTypes = [
  { name: "Consultation", value: 45 }, { name: "Exam", value: 25 }, { name: "Emergency", value: 10 },
  { name: "Follow-up", value: 15 }, { name: "Vaccination", value: 5 },
];
