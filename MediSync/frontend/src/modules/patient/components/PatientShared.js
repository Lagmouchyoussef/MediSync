import { createContext, useContext } from "react";
import apiService from "../../../core/services/api";

export const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

export const COLORS = ["#2da0a8", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// We'll initialize patientData with null or empty values and fetch it in Dashboard
export const patientData = {
  name: apiService.getUserDisplayName() || "Guest",
  age: null,
  gender: "",
  bloodType: "",
  phone: "",
  email: apiService.getUserEmail() || "",
  address: "",
  CIN: "",
  cnss: "",
  allergies: [],
  chronicDiseases: [],
  emergencyContact: { name: "", phone: "", relation: "" },
  avatar: apiService.getUserFirstName() ? apiService.getUserFirstName().charAt(0) : "P",
  joinDate: ""
};

// Initial empty arrays for dynamic data
export const appointmentsData = [];
export const healthStats = [];
