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

export const dailyPatients = [];

export const appointmentTypes = [];
