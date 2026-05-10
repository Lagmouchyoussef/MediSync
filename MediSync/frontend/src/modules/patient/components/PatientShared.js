import { createContext, useContext } from "react";

export const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

export const COLORS = ["#2da0a8", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export const patientData = {
  name: "Ahmed Benali",
  age: 45,
  gender: "Male",
  bloodType: "A+",
  phone: "0612345678",
  email: "ahmed@email.com",
  address: "123 Hassan II Avenue, Casablanca",
  CIN: "AB123456",
  cnss: "1234567890",
  allergies: ["Penicillin", "Aspirin"],
  chronicDiseases: ["Hypertension"],
  emergencyContact: { name: "Fatima Benali", phone: "0698765432", relation: "Wife" },
  avatar: "P",
  joinDate: "2024-01-15"
};

export const appointmentsData = [
  { id: 1, doctor: "Dr. Hassan Amrani", specialty: "Cardiologist", date: "2026-05-15", time: "09:00", status: "Accepted", type: "Consultation", initiator: "patient", notes: "Monthly checkup" },
  { id: 2, doctor: "Dr. Leila Berrada", specialty: "General Practitioner", date: "2026-05-20", time: "14:30", status: "Pending", type: "Exam", initiator: "patient", notes: "Blood test follow-up" },
  { id: 3, doctor: "Dr. Rachid Tazi", specialty: "Endocrinologist", date: "2026-05-25", time: "11:00", status: "Pending", initiator: "doctor", notes: "Diabetes review required" },
];

export const healthStats = [
  { month: "Jan", tension: 14.2, glucose: 1.05, weight: 82 },
  { month: "Feb", tension: 13.8, glucose: 1.08, weight: 81.5 },
  { month: "Mar", tension: 13.5, glucose: 1.10, weight: 81 },
  { month: "Apr", tension: 13.2, glucose: 1.12, weight: 80.5 },
  { month: "May", tension: 13.0, glucose: 1.12, weight: 80 },
  { month: "Jun", tension: 12.8, glucose: 1.09, weight: 79.5 },
];
