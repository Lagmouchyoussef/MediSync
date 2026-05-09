import { createContext, useContext } from "react";

export const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

export const COLORS = ["#2da0a8", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export const getPatientId = (p) => {
  if (!p) return "";
  return `PAT-${String(p.id).padStart(4, "0")}-${new Date(p.date || new Date()).getFullYear()}`;
};

export const mockPatients = [
  { id: 1, name: "Ahmed Benali", age: 45, gender: "Male", phone: "0612345678", email: "ahmed@email.com", address: "Casablanca", date: "2024-01-15", status: "Active", bloodType: "A+", lastVisit: "2025-12-10" },
  { id: 2, name: "Fatima Zahra", age: 32, gender: "Female", phone: "0698765432", email: "fatima@email.com", address: "Rabat", date: "2024-02-20", status: "Active", bloodType: "O+", lastVisit: "2025-11-28" },
  { id: 3, name: "Youssef El Amrani", age: 28, gender: "Male", phone: "0655443322", email: "youssef@email.com", address: "Fez", date: "2024-03-10", status: "Inactive", bloodType: "B+", lastVisit: "2025-10-15" },
  { id: 4, name: "Sara Moussaoui", age: 55, gender: "Female", phone: "0677889900", email: "sara@email.com", address: "Marrakech", date: "2024-04-05", status: "Active", bloodType: "AB-", lastVisit: "2026-01-02" },
  { id: 5, name: "Omar Idrissi", age: 67, gender: "Male", phone: "0633221100", email: "omar@email.com", address: "Tangier", date: "2024-05-18", status: "Active", bloodType: "A-", lastVisit: "2026-02-14" },
  { id: 6, name: "Khadija Tazi", age: 41, gender: "Female", phone: "0644556677", email: "khadija@email.com", address: "Agadir", date: "2024-06-22", status: "Active", bloodType: "O-", lastVisit: "2026-03-05" },
  { id: 7, name: "Karim Bennani", age: 35, gender: "Male", phone: "0666778899", email: "karim@email.com", address: "Meknes", date: "2024-07-30", status: "Inactive", bloodType: "B-", lastVisit: "2025-08-20" },
  { id: 8, name: "Nadia Filali", age: 29, gender: "Female", phone: "0688990011", email: "nadia@email.com", address: "Oujda", date: "2024-08-14", status: "Active", bloodType: "AB+", lastVisit: "2026-04-01" },
];

export const mockAppointments = [
  { id: 1, patient: "Ahmed Benali", doctor: "Dr. Hassan Amrani", date: "2026-05-10", time: "09:00", type: "Consultation", status: "Confirmed", notes: "Monthly follow-up" },
  { id: 2, patient: "Fatima Zahra", doctor: "Dr. Leila Berrada", date: "2026-05-10", time: "10:00", type: "Exam", status: "Pending", notes: "Blood test" },
  { id: 3, patient: "Sara Moussaoui", doctor: "Dr. Hassan Amrani", date: "2026-05-11", time: "11:00", type: "Emergency", status: "Confirmed", notes: "Chest pain" },
  { id: 4, patient: "Omar Idrissi", doctor: "Dr. Rachid Tazi", date: "2026-05-11", time: "14:00", type: "Follow-up", status: "Confirmed", notes: "Diabetes control" },
  { id: 5, patient: "Khadija Tazi", doctor: "Dr. Leila Berrada", date: "2026-05-12", time: "09:30", type: "Consultation", status: "Pending", notes: "First visit" },
  { id: 6, patient: "Nadia Filali", doctor: "Dr. Hassan Amrani", date: "2026-05-12", time: "15:00", type: "Exam", status: "Cancelled", notes: "X-ray" },
];

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
