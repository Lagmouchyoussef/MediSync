import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../modules/auth/Login.jsx';
import PatientDashboard from '../modules/patient/PatientDashboard.jsx';
import DoctorDashboard from '../modules/doctor/DoctorDashboard.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
